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
  channelId?: string | string[];
  creditor?: string | string[];
  amount?: number | number[];
  name?: string | string[];
  status?: string | string[];
  description?: string | string[];
}
