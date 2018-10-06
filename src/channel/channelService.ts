import Bluebird = require("bluebird");
import { Channel } from "./channel";
import { ChannelInterface } from "./ChannelInterface";
import { createChannelUser } from "./User/channelUserService";

export function getChannelById(id: string) {
  return Channel.findById(id, {
    attributes: ["id", "name", "key"]
  }) as Bluebird<ChannelInterface>;
}

export function getChannelByKeyAndName(key: string, name: string) {
  return Channel.findAll({
    where: {
      key,
      name
    }
  }) as Bluebird<ChannelInterface[]>;
}

export function createChannel(key: string, name: string) {
  return Channel.create({
    key,
    name
  }) as Bluebird<ChannelInterface>;
}

export function joinChannel(key: string, name: string, userId: string) {
  const channels: Bluebird<ChannelInterface[]> = getChannelByKeyAndName(key, name);
  if (channels.value().length > 0) {
    return createChannelUser(channels.value()[0].id, userId);
  } else {
    throw new Error("invalid key");
  }
}
