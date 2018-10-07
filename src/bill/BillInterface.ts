export interface BillInterface {
  id: string;
  channelId: string;
  creditor: string;
  amount: number;
  name: string;
  status: string;
  description: string;
}

export interface OptionalBillSimpleInterface {
  channelId?: string;
  creditor?: string;
  amount?: number;
  name?: string;
  status?: string;
  description?: string;
}
