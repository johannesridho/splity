import Bluebird = require("bluebird");
import { Channel } from "./channel";
import { ChannelInterface } from "./ChannelInterface";

export function getChannelById(id: number) {
  return Channel.findById(id, {
    attributes: ["id", "name", "key", "user_id"]
  }) as Bluebird<ChannelInterface>;
}
