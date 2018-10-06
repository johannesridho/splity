import Bluebird = require("bluebird");
import { getChannelById } from "../channel/channelService";
import {
  addChannelDebt,
  getChannelDebtByDetails,
  updateChannelDebtByDetails
} from "../channel/debt/channelDebtService";
import { Bill } from "./bill";
import { BillInterface, OptionalBillSimpleInterface } from "./BillInterface";
import { addBillDebt, getBillDebtById, updateBillDebtById } from "./debt/billDebtService";

export function getBillById(id: string) {
  return Bill.findById(id, {
    attributes: ["id", "channelId", "debtor", "creditor", "description", "amount", "status"]
  }) as Bluebird<BillInterface>;
}

export function addBill(
  amount: number,
  channelId: string,
  creditor: string,
  description: string,
  status: string,
  debtor?: string
) {
  if (debtor && status === "bill") {
    addChannelDebt(amount, channelId, creditor, debtor);
  }
  return Bill.create({
    amount,
    channelId,
    creditor,
    description,
    status
  }) as Bluebird<BillInterface>;
}

export function payDebt(channelId: string, debtor: string, creditor: string, amount: number, description: string) {
  // note: pay bills by creating new bill with 'pay-debt` status
  if (doesChannelExist(channelId)) {
    const payBill = addBill(amount, channelId, creditor, description, "pay-debt");
    addBillDebt(amount, payBill.value().id, debtor, "pending");

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

function doesChannelExist(channelId: string) {
  return getChannelById(channelId);
}
