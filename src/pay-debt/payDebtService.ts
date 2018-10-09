import { getChannelDebtByChannelNameAndCreditorIdAndDebtorId } from "../channel/debt/channelDebtService";
import { getUserById, getUserByName } from "../user/userService";
import { PayDebt } from "./payDebt";
import { OptionalPayDebtSimpleInterface, PayDebtInterface } from "./PayDebtInterface";
import { PayDebtStatusEnum } from "./PayDebtStatusEnum";

export async function getPayDebtById(id: string) {
  return (await PayDebt.findById(id)) as PayDebtInterface;
}

export async function createPayDebt(amount: number, channelName: string, creditorName: string, debtorId: string) {
  const creditor = await getUserByName(creditorName);
  const debtor = await getUserById(debtorId);
  const channelDebt = await getChannelDebtByChannelNameAndCreditorIdAndDebtorId(channelName, creditor.id, debtorId);

  return (await PayDebt.create({
    amount,
    channelDebtId: channelDebt.id,
    channelName,
    creditorId: creditor.id,
    creditorName,
    debtorName: debtor.name,
    status: PayDebtStatusEnum.UNSETTLED
  })) as PayDebtInterface;
}

export function updatePayDebtById(id: string, changes: OptionalPayDebtSimpleInterface) {
  return PayDebt.update(
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
