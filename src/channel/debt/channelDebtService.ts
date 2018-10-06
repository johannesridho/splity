import Bluebird = require("bluebird");
import { ChannelDebt } from "./channelDebt";
import { ChannelDebtInterface, OptionalChannelDebtSimpleInterface } from "./ChannelDebtInterface";

export function getChannelDebtById(id: string) {
  return ChannelDebt.findById(id) as Bluebird<ChannelDebtInterface>;
}

export function getChannelDebtByDetails(details: OptionalChannelDebtSimpleInterface) {
  return ChannelDebt.findAll({
    where: {
      ...details
    }
  }) as Bluebird<ChannelDebtInterface[]>;
}

export function addChannelDebt(amount: number, channelId: string, creditor: string, debtor: string) {
  return ChannelDebt.create({
    amount,
    channelId,
    creditor,
    debtor
  }) as Bluebird<ChannelDebtInterface>;
}

export function updateChannelDebtById(id: string, changes: OptionalChannelDebtSimpleInterface) {
  return ChannelDebt.update(
    {
      ...changes
    },
    {
      where: {
        id
      }
    }
  );
}

export function updateChannelDebtByDetails(
  details: { channelId: string; debtor: string; creditor: string },
  changes: OptionalChannelDebtSimpleInterface,
  minusMode: boolean = false
) {
  if (minusMode) {
    const channelDebt = getChannelDebtByDetails(details).value()[0];
    if (changes.amount) {
      changes.amount = channelDebt.amount - changes.amount;
      if (changes.amount < 0) {
        changes.amount = 0;
      }
    }
  }

  return ChannelDebt.update(
    {
      ...changes
    },
    {
      where: {
        ...details
      }
    }
  );
}
