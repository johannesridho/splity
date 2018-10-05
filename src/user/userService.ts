import Bluebird = require("bluebird");
import { User } from "./user";
import { UserInterface } from "./UserInterface";

export function getUserById(id: string) {
  return User.findById(id, {
    attributes: ["id", "name", "username", "credit", "debt"]
  }) as Bluebird<UserInterface>;
}

export function updateUser(id: string, changes: { debt?: number; credit?: number }) {
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
