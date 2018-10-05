export interface BillInterface {
  id: string;
  channelId: string;
  debtor: string;
  creditor: string;
  amount: number;
  status: string;
  description: string;
}
