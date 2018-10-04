export interface BillInterface {
  id: string;
  channel_id: string;
  debtor: string;
  creditor: string;
  amount: number;
  status: string;
  description: string;
}
