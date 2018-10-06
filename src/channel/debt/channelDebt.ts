import * as Sequelize from "sequelize";
import { sequelize } from "../../sequelize";

export const ChannelDebt = sequelize.define("channel_debt", {
  amount: Sequelize.DECIMAL,
  channelId: Sequelize.STRING,
  creditor: Sequelize.STRING,
  debtor: Sequelize.STRING
});
