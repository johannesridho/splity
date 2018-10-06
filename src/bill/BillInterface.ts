export interface BillInterface {
  id: string;
  channelId: string;
  creditor: string;
  amount: number;
  status: string;
  description: string;
}

export interface OptionalBillSimpleInterface {
  channelId?: string;
  creditor?: string;
  amount?: number;
  status?: string;
  description?: string;
}
