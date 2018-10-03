import Bluebird = require("bluebird");
import { User } from "./user";
import { UserInterface } from "./UserInterface";

export function getUserById(id: number) {
  return User.findById(id, {
    attributes: ["id", "name", "username", "credit", "debt"]
  }) as Bluebird<UserInterface>;
}
