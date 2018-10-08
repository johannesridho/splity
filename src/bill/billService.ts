import Bluebird = require("bluebird");
import { getChannelByKey } from "../channel/channelService";
import { ChannelDebtInterface } from "../channel/debt/ChannelDebtInterface";
import {
  addOrIncreaseChannelDebt,
  getChannelDebtByDetails,
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

export async function payDebt(
  channelKey: string,
  debtor: string,
  creditor: string,
  amount: number,
  description: string
) {
  const channel = await getChannelByKey(channelKey);
  const channelDebt = await getChannelDebtByDetails({ channelId: channel.id, creditor, debtor });
  if (channel !== null && channelDebt.length !== 0) {
    const payBill = await createBill(amount, channelKey, creditor, description, "pay-debt");
    await addBillDebt(amount, payBill.id, debtor, "pending");

    return payBill;
  }

  throw new ErrorResponse("Sorry but requested channel is not exist.", 400);
}

export function confirmPayment(channelId: string, billId: string, billDebtId: string, autoSettle: boolean = true) {
  const payBill = getBillById(billId);
  const payBillDebt = getBillDebtById(billDebtId);
  updateBillById(payBill.value().id, { status: "pay-debt-accepted" });
  updateBillDebtById(payBillDebt.value().id, { status: "accepted" });

  updateChannelDebtByDetails(
    { channelId, debtor: payBillDebt.value().debtor, creditor: payBill.value().creditor },
    { amount: payBill.value().amount },
    true
  );

  if (autoSettle) {
    const channelDebt = getChannelDebtByDetails({
      channelId,
      creditor: payBill.value().creditor,
      debtor: payBillDebt.value().debtor
    })[0];
    if (channelDebt.amount <= 0) {
      settleDebt(payBill.value().id);
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
