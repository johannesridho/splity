export interface ChannelDebtInterface {
  id: string;
  channelId: string;
  debtor: string;
  creditor: string;
  amount: number;
}

export interface OptionalChannelDebtSimpleInterface {
  channelId?: string;
  debtor?: string;
  creditor?: string;
  amount?: number;
}
