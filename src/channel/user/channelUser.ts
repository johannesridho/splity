import * as Sequelize from "sequelize";
import { sequelize } from "../../sequelize";

export const ChannelUser = sequelize.define(
  "channel_user",
  {
    channelId: Sequelize.STRING,
    userId: Sequelize.STRING
  },
  {
    indexes: [
      {
        fields: ["channelId", "userId"],
        unique: true
      }
    ]
  }
);
