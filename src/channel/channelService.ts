import Bluebird = require("bluebird");
import { Channel } from "./channel";
import { ChannelInterface } from "./ChannelInterface";
import { createChannelUser } from "./user/channelUserService";

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

export async function createChannel(name: string) {
  const key = Math.floor(1000 + Math.random() * 9000);
  const channel = (await Channel.create({
    key,
    name
  })) as Bluebird<ChannelInterface>;
  return `Your channel ${channel.get("name")} is created. To join the channel, give this key : ${channel.get("key")} to 
    your friends`;
}

export function joinChannel(key: string, name: string, userId: string) {
  const channels: Bluebird<ChannelInterface[]> = getChannelByKeyAndName(key, name);
  if (channels.value().length > 0) {
    return createChannelUser(channels.value()[0].id, userId);
  } else {
    throw new Error("invalid key");
  }
}
