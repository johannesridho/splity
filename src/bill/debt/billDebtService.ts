import Bluebird = require("bluebird");
import { BillDebt } from "./billDebt";
import { BillDebtInterface, OptionalBillDebtSimpleInterface } from "./BillDebtInterface";

export function getBillDebtById(id: string) {
  return BillDebt.findById(id) as Bluebird<BillDebtInterface>;
}

export function addBillDebt(amount: number, billId: string, debtor: string, status: string) {
  return BillDebt.create({
    amount,
    billId,
    debtor,
    status
  }) as Bluebird<BillDebtInterface>;
}

export function updateBillDebtById(id: string, changes: OptionalBillDebtSimpleInterface) {
  return BillDebt.update(
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
