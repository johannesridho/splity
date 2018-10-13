import Bluebird = require("bluebird");
import { getChannelDebtByDetails } from "../channel/debt/channelDebtService";
import { getUserProfile } from "./line/lineService";
import { User } from "./user";
import { UserInterface } from "./UserInterface";

export function getUserById(id: string) {
  return User.findById(id, {
    attributes: ["id", "name", "username", "credit", "debt"]
  }) as Bluebird<UserInterface>;
}

// todo: need to fix this, name is not unique
export async function getUserByName(name: string) {
  return (await User.findOne({
    where: {
      name
    }
  })) as UserInterface;
}

// todo: trigger create user at welcome intent
export async function createUser(id: string) {
  const lineProfile = await getUserProfile(id);
  return User.create({
    credit: 0,
    debt: 0,
    id,
    name: lineProfile.displayName,
    username: ""
  }) as Bluebird<UserInterface>;
}

export function updateUserById(
  id: string,
  changes: { debt?: number; credit?: number; name?: string; username?: string }
) {
  return User.update(
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

export async function getDebtStatus(userId: string) {
  // : UserStatusInterface {
  const creditDetails = await getChannelDebtByDetails({ creditor: userId });
  const debtDetails = await getChannelDebtByDetails({ debtor: userId });
  let credit = 0;
  let debt = 0;
  creditDetails.forEach((creditDetail) => (credit += creditDetail.amount));
  debtDetails.forEach((debtDetail) => (debt += debtDetail.amount));

  return {
    credit,
    creditDetails,
    debt,
    debtDetails
  };
}
