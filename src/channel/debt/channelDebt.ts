import * as Sequelize from "sequelize";
import { sequelize } from "../../sequelize";

export const ChannelDebt = sequelize.define("channel_debts", {
  amount: Sequelize.DECIMAL,
  channelId: Sequelize.STRING,
  creditor: Sequelize.STRING,
  debtor: Sequelize.STRING
});
