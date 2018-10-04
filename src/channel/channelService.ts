import Bluebird = require("bluebird");
import { Channel } from "./channel";
import { ChannelInterface } from "./ChannelInterface";

export function getChannelById(id: number) {
  return Channel.findById(id, {
    attributes: ["id", "name", "key", "user_id"]
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

export function addChannel(channel: ChannelInterface) {
  return Channel.create({
    key: channel.key,
    name: channel.name,
    userId: channel.userId
  }) as Bluebird<ChannelInterface>;
}

export function addChannelByDetails(key: string, name: string, userId: string) {
  return Channel.create({
    key,
    name,
    userId
  }) as Bluebird<ChannelInterface>;
}

export function joinChannel(key: string, name: string, userId: string) {
  const channels: Bluebird<ChannelInterface[]> = getChannelByKeyAndName(key, name);
  if (channels.get.length > 0) {
    return addChannelByDetails(key, name, userId);
  } else {
    throw new Error("invalid key");
  }
}