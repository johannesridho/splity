import Bluebird = require("bluebird");
import ErrorResponse from "../error/ErrorResponse";
import { Channel } from "./channel";
import { ChannelInterface } from "./ChannelInterface";
import { createChannelUser, isChannelUserExist } from "./user/channelUserService";

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

export function getChannelByKey(key: string) {
  return Channel.find({
    where: {
      key
    }
  }) as Bluebird<ChannelInterface>;
}

export async function createChannel(name: string, userId: string) {
  const lowerCaseName = name.toLowerCase();
  const key = Math.floor(1000 + Math.random() * 9000);
  const channel = (await Channel.create({
    key,
    name: lowerCaseName
  })) as ChannelInterface;
  await createChannelUser(channel.id, userId);
  return channel;
}

export async function joinChannel(key: string, name: string, userId: string) {
  const channel: ChannelInterface = await getChannelByKeyAndName(key, name);
  if (!channel) {
    throw new ErrorResponse("`Channel with name ${name} and key ${key} is not exist.`", 404);
  }
  if (isChannelUserExist) {
    throw new ErrorResponse("Sorry but you already joined this channel.", 400);
  }
  return createChannelUser(channel.id, userId);
}
