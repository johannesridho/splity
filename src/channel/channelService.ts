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
  const lowerCaseName = name.toLowerCase();
  return Channel.find({
    where: {
      key,
      name: lowerCaseName
    }
  }) as Bluebird<ChannelInterface>;
}

export async function createChannel(name: string, userId: string) {
  const lowerCaseName = name.toLowerCase();
  const key = Math.floor(1000 + Math.random() * 9000);
  const channel = (await Channel.create({
    key,
    name: lowerCaseName
  })) as Bluebird<ChannelInterface>;
  await createChannelUser(channel.value().id, userId);
  return channel;
}

export async function joinChannel(key: string, name: string, userId: string) {
  const channel: ChannelInterface = await getChannelByKeyAndName(key, name);
  return createChannelUser(channel.id, userId);
}
