import Bluebird = require("bluebird");
import { ChannelUser } from "./channelUser";
import { ChannelUserInterface } from "./ChannelUserInterface";

export function getChannelUserById(id: string) {
  return ChannelUser.findById(id) as Bluebird<ChannelUserInterface>;
}

export function createChannelUser(channelId: string, userId: string) {
  return ChannelUser.create({
    channelId,
    userId
  }) as Bluebird<ChannelUserInterface>;
}