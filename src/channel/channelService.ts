import Bluebird = require("bluebird");
import { Channel } from "./Channel";
import { ChannelInterface } from "./ChannelInterface";

export function getChannelById(id: string) {
  return Channel.findById(id, {
    attributes: ["id", "name", "key", "userId"]
  }) as Bluebird<ChannelInterface>;
}

export function getChannelByName(name: string) {
  return Channel.findAll({
    where: {
      name
    }
  }) as Bluebird<ChannelInterface[]>;
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
    name: channel.name
  }) as Bluebird<ChannelInterface>;
}

export function addChannelByDetails(key: string, name: string) {
  return Channel.create({
    key,
    name
  }) as Bluebird<ChannelInterface>;
}

// export function joinChannel(key: string, name: string) {
//   const channels: Bluebird<ChannelInterface[]> = getChannelByKeyAndName(key, name);
//   if (len(channels)) {
//     return addChannelByDetails(key, name);
//   } else {
//     throw new Error("invalid key");
//   }
// }

// function len(channels: Bluebird<ChannelInterface[]>) {
//   return channels.value().length > 0;
// }
