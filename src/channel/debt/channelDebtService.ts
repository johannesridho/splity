import Bluebird = require("bluebird");
import { ChannelDebt } from "./channelDebt";
import { ChannelDebtInterface } from "./ChannelDebtInterface";

export function getChannelDebtById(id: string) {
  return ChannelDebt.findById(id) as Bluebird<ChannelDebtInterface>;
}

export function createChannelDebt(amount: number, channelId: string, creditor: string, debtor: string) {
  return ChannelDebt.create({
    amount,
    channelId,
    creditor,
    debtor
  }) as Bluebird<ChannelDebtInterface>;
}
