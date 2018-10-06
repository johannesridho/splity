import Bluebird = require("bluebird");
import { getChannelDebtByDetails } from "./../channel/debt/channelDebtService";
import { User } from "./user";
import { UserInterface, UserStatusInterface } from "./UserInterface";

export function getUserById(id: string) {
  return User.findById(id, {
    attributes: ["id", "name", "username", "credit", "debt"]
  }) as Bluebird<UserInterface>;
}

export function createUser(id: string) {
  // todo: get user's display name with profile api (https://developers.line.me/en/reference/messaging-api/#get-profile)
  return User.create({
    credit: 0,
    debt: 0,
    id,
    name: "",
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

export function getDebtStatus(userId: string): UserStatusInterface {
  const creditDetails = getChannelDebtByDetails({ creditor: userId }).value();
  const debtDetails = getChannelDebtByDetails({ debtor: userId }).value();
  let credit = 0;
  creditDetails.forEach(creditDetail => (credit += creditDetail.amount));
  let debt = 0;
  debtDetails.forEach(debtDetail => (debt += debtDetail.amount));

  return {
    credit,
    creditDetails,
    debt,
    debtDetails
  };
}
