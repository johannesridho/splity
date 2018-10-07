import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const Bill = sequelize.define("bill", {
  amount: Sequelize.DECIMAL,
  channelId: Sequelize.STRING,
  creditor: Sequelize.STRING,
  description: Sequelize.STRING,
  name: Sequelize.STRING,
  status: Sequelize.STRING
});
