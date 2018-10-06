export interface BillDebtInterface {
  id: string;
  billId: string;
  debtor: string;
  amount: number;
  status: string;
}

export interface OptionalBillDebtSimpleInterface {
  billId?: string;
  debtor?: string;
  amount?: number;
  status?: string;
}
