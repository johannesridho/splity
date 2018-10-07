import Bluebird = require("bluebird");
import { Error } from "tslint/lib/error";
import { getChannelByKey } from "../channel/channelService";
import {
  addChannelDebt,
  getChannelDebtByDetails,
  updateChannelDebtByDetails
} from "../channel/debt/channelDebtService";
import { getChannelUsersByChannelId } from "../channel/user/channelUserService";
import { Bill } from "./bill";
import { BillInterface, OptionalBillSimpleInterface } from "./BillInterface";
import { addBillDebt, getBillDebtById, updateBillDebtById } from "./debt/billDebtService";

export function getBillById(id: string) {
  return Bill.findById(id, {
    attributes: ["id", "channelId", "debtor", "creditor", "description", "amount", "status"]
  }) as Bluebird<BillInterface>;
}

export async function addBill(
  amount: number,
  channelKey: string,
  creditor: string,
  description: string,
  status: string,
  debtor?: string
) {
  const channelId = getChannelByKey(channelKey).value().id;
  if (debtor && status === "bill") {
    const channelUsers = getChannelUsersByChannelId(channelId).value();

    channelUsers.forEach(channelUser => {
      addChannelDebt(amount, channelId, creditor, channelUser.userId);
    });
  }

  return Bill.create({
    amount,
    channelId,
    creditor,
    description,
    status
  }) as Bluebird<BillInterface>;
}

export async function payDebt(
  channelName: string,
  debtor: string,
  creditor: string,
  amount: number,
  description: string
) {
  const channel = getChannelByKey(channelName).value();
  if (channel !== null || channel !== undefined) {
    const payBill = await addBill(amount, channelName, creditor, description, "pay-debt");
    addBillDebt(amount, payBill.id, debtor, "pending");

    return payBill;
    // todo: notify creditor
  }

  throw new Error("Channel not exist");
}

export function confirmPayment(channelId: string, billId: string, billDebtId: string, autoSettle: boolean = false) {
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
    }).value()[0];
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

export function getBills(details: OptionalBillSimpleInterface) {
  return Bill.findAll({
    where: {
      ...details
    }
  }) as Bluebird<BillInterface[]>;
}

export function updateBillById(id: string, changes: OptionalBillSimpleInterface) {
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
