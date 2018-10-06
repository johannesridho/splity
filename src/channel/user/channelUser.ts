import * as Sequelize from "sequelize";
import { sequelize } from "../../sequelize";

export const ChannelUser = sequelize.define("channel_users", {
  channelId: Sequelize.STRING,
  userId: Sequelize.STRING
});
