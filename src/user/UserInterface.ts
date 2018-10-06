import { ChannelDebtInterface } from "./../channel/debt/ChannelDebtInterface";

export interface UserInterface {
  id: string;
  credit: number;
  debt: number;
  name: string;
  username: string;
}

export interface UserStatusInterface {
  credit: number;
  creditDetails: ChannelDebtInterface[];
  debt: number;
  debtDetails: ChannelDebtInterface[];
}
