import Bluebird = require("bluebird");
import { getChannelById } from "../channel/channelService";
import { getUserById, updateUser } from "../user/userService";
import { Bill } from "./bill";
import { BillInterface } from "./BillInterface";

export function getBillById(id: string) {
  return Bill.findById(id, {
    attributes: ["id", "channelId", "debtor", "creditor", "description", "amount", "status"]
  }) as Bluebird<BillInterface>;
}

export function addBillByDetails(
  channelId: string,
  debtor: string,
  creditor: string,
  amount: number,
  status: string,
  description: string
) {
  return Bill.create({
    amount,
    channelId,
    creditor,
    debtor,
    description,
    status
  }) as Bluebird<BillInterface>;
}

export function payDebt(channelId: string, debtor: string, creditor: string, amount: number, description: string) {
  if (isChannelExist(channelId)) {
    addBillByDetails(channelId, debtor, creditor, amount, "pay-debt", description);
  }
}

export function settleDebt(debtId: string, payId: string, channelId: string) {
  if (isChannelExist(channelId)) {
    const debt = getBillById(debtId).value();
    const payment = getBillById(payId).value();
    const newDebtAmount = debt.amount - payment.amount;

    deleteBillById(payId);
    if (newDebtAmount === 0) {
      deleteBillById(debt.id);
      updateUsersNormally(debt, payment.amount);
    } else if (newDebtAmount > 0) {
      updateBillById(debt.id, newDebtAmount, debt.creditor, debt.debtor);
      updateUsersNormally(debt, payment.amount);
    } else {
      updateBillById(debt.id, 0 - newDebtAmount, debt.debtor, debt.creditor);
      updateUsersWithNegativeDelta(debt, payment);
    }
  }
}

function deleteBillById(id: string) {
  Bill.destroy({
    where: {
      id
    }
  });
}

function updateBillById(id: string, amount: number, creditor: string, debtor: string) {
  Bill.update(
    {
      amount,
      creditor,
      debtor
    },
    {
      where: {
        id
      }
    }
  );
}

function updateUsersNormally(debt: BillInterface, changeAmount: number) {
  const debtor = getUserById(debt.debtor).value();
  const creditor = getUserById(debt.creditor).value();
  updateUser(debtor.id, { debt: debtor.debt - changeAmount });
  updateUser(creditor.id, { credit: creditor.credit - changeAmount });
}

function updateUsersWithNegativeDelta(debt: BillInterface, payment: BillInterface) {
  const debtor = getUserById(debt.debtor).value();
  const creditor = getUserById(debt.creditor).value();
  const newDebtorDebtAmount = debtor.debt - payment.amount > 0 ? debtor.debt - payment.amount : 0;
  const newCreditorCreditAmount = creditor.credit - payment.amount > 0 ? creditor.credit - payment.amount : 0;
  const delta = payment.amount - debt.amount;
  updateUser(debtor.id, { credit: debtor.credit + delta, debt: newDebtorDebtAmount });
  updateUser(creditor.id, { credit: newCreditorCreditAmount, debt: creditor.debt + delta });
}

function isChannelExist(channelId: string) {
  return getChannelById(channelId);
}
