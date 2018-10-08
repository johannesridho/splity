import Bluebird = require("bluebird");
import { getChannelById } from "../channelService";
import { ChannelDebt } from "./channelDebt";
import { ChannelDebtInterface, OptionalChannelDebtSimpleInterface } from "./ChannelDebtInterface";

export async function getCreditDebtStatus(userId: string): Promise<string> {
  let response = "Here is the summary of your credit and debt: ";
  const debts = await getChannelDebtByDetails({
    debtor: userId
  });

  const credits = await getChannelDebtByDetails({
    creditor: userId
  });

  debts.forEach(async debt => {
    // todo: use name instead of userId
    response = response.concat(
      `\nChannel ${await getChannelById(debt.channelId)}: You owe ${debt.creditor} IDR ${debt.amount},`
    );
  });

  credits.forEach(async credit => {
    // todo: use name instead of userId
    response = response.concat(
      `\nChannel ${await getChannelById(credit.channelId)}: ${credit.debtor} owes you IDR ${credit.amount},`
    );
  });

  return response;
}

export function getChannelDebtById(id: string) {
  return ChannelDebt.findById(id) as Bluebird<ChannelDebtInterface>;
}

export async function getChannelDebtByDetails(details: OptionalChannelDebtSimpleInterface) {
  return (await ChannelDebt.findAll({
    where: {
      ...details
    }
  })) as ChannelDebtInterface[];
}

export async function addOrIncreaseChannelDebt(amount: number, channelId: string, creditor: string, debtor: string) {
  const channelDebt = await getChannelDebtByDetails({ channelId: channelId.toString(), creditor, debtor });
  if (channelDebt.length > 0) {
    await updateChannelDebtById(channelDebt[0].id, {
      amount: channelDebt[0].amount + amount,
      channelId: channelId.toString(),
      creditor,
      debtor
    });
    const newChannelDebt = await getChannelDebtByDetails({ channelId: channelId.toString(), creditor, debtor });

    return newChannelDebt[0];
  }

  return (await ChannelDebt.create({
    amount,
    channelId,
    creditor,
    debtor
  })) as ChannelDebtInterface;
}

async function updateChannelDebtById(id: string, changes: OptionalChannelDebtSimpleInterface) {
  return await ChannelDebt.update(
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
    const channelDebt = getChannelDebtByDetails(details)[0];
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
