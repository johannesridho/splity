export interface PayDebtInterface {
  readonly id: string;
  readonly amount: number;
  readonly channelDebtId: string;
  readonly channelName: string;
  readonly creditorId: string;
  readonly creditorName: string;
  readonly debtorName: string;
  readonly status: string;
}

export interface OptionalPayDebtSimpleInterface {
  readonly amount?: number;
  readonly channelDebtId?: string;
  readonly channelName?: string;
  readonly creditorId?: string;
  readonly creditorName?: string;
  readonly debtorName?: string;
  readonly status?: string;
}
