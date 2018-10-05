import Bluebird = require("bluebird");
import { getChannelById } from "../channel/channelService";
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
    } else if (newDebtAmount > 0) {
      updateBillById(debt.id, newDebtAmount, debt.creditor, debt.debtor);
    } else {
      updateBillById(debt.id, 0 - newDebtAmount, debt.debtor, debt.creditor);
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

function isChannelExist(channelId: string) {
  return getChannelById(channelId);
}
