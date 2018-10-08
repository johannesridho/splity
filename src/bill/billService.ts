import Bluebird = require("bluebird");
import { getChannelByKey } from "../channel/channelService";
import { ChannelDebtInterface } from "../channel/debt/ChannelDebtInterface";
import {
  addOrIncreaseChannelDebt,
  getChannelDebtByDetails,
  getChannelDebtChannelIdsByDetails,
  updateChannelDebtByDetails
} from "../channel/debt/channelDebtService";
import { getChannelUsersByChannelId } from "../channel/user/channelUserService";
import ErrorResponse from "../error/ErrorResponse";
import { Bill } from "./bill";
import { BillInterface, OptionalBillSimpleInterface } from "./BillInterface";
import { BillDebtInterface } from "./debt/BillDebtInterface";
import { addBillDebt, getBillDebtById, updateBillDebtById } from "./debt/billDebtService";

export function getBillById(id: string) {
  return Bill.findById(id, {
    attributes: ["id", "channelId", "debtor", "creditor", "description", "amount", "name", "status"]
  }) as Bluebird<BillInterface>;
}

export async function getBillByDetails(details: OptionalBillSimpleInterface) {
  return (await Bill.findAll({
    where: {
      ...details
    }
  })) as BillInterface[];
}

export async function addEqualSplitBill(
  amount: number,
  channelKey: string,
  creditor: string,
  description: string,
  name: string,
  status: string
) {
  const channelId = (await getChannelByKey(channelKey)).id;
  const channelUsers = await getChannelUsersByChannelId(channelId.toString());
  const channelDebts: ChannelDebtInterface[] = [];
  const billDebts: BillDebtInterface[] = [];

  const bill = await createBill(amount, channelId, creditor, description, status, name);

  for (const channelUser of channelUsers) {
    const channelDebt = await addOrIncreaseChannelDebt(
      amount / channelUsers.length,
      channelId,
      creditor,
      channelUser.userId
    );
    const billDebt = await addBillDebt(amount / channelUsers.length, bill.id, channelUser.userId, "pending");
    await billDebts.push(billDebt);
    await channelDebts.push(channelDebt);
  }

  return {
    bill,
    billDebts,
    channelDebts
  };
}

export async function payDebt(debtor: string, creditorName: string, amount: number, description: string) {
  const channelIds = await getChannelDebtChannelIdsByDetails({ debtor });
  const bills = await getBillByDetails({ channelId: channelIds, description, name: creditorName, status: "bill" });
  if (bills.length > 0) {
    const bill = bills[0];
    const payBill = await createBill(amount, bill.channelId, creditorName, description, "pay-debt");

    return payBill;
  }

  throw new ErrorResponse("Sorry but there is no bill that match your details, please try again", 400);
}

export async function confirmPayment(
  channelId: string,
  billId: string,
  billDebtId: string,
  autoSettle: boolean = true
) {
  const payBill = await getBillById(billId);
  const payBillDebt = await getBillDebtById(billDebtId);
  await updateBillById(payBill.id, { status: "pay-debt-accepted" });
  await updateBillDebtById(payBillDebt.id, { status: "accepted" });

  updateChannelDebtByDetails(
    { channelId, debtor: payBillDebt.debtor, creditor: payBill.creditor },
    { amount: payBill.amount },
    true
  );

  if (autoSettle) {
    const channelDebt = getChannelDebtByDetails({
      channelId,
      creditor: payBill.creditor,
      debtor: payBillDebt.debtor
    })[0];
    if (channelDebt.amount <= 0) {
      settleDebt(payBill.id);
    }
  }
}

export function settleDebt(billId: string) {
  return updateBillById(billId, {
    status: "settled"
  });
}

function createBill(
  amount: number,
  channelId: string,
  creditor: string,
  description: string,
  status: string,
  name: string = "dummy"
) {
  return Bill.create({
    amount,
    channelId,
    creditor,
    description,
    name,
    status
  }) as Bluebird<BillInterface>;
}

function updateBillById(id: string, changes: OptionalBillSimpleInterface) {
  return Bill.update(
    {
      ...changes
    },
    {
      where: {
        id
      }
    }
  );
}
