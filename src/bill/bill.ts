import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const Bill = sequelize.define("bill", {
  amount: Sequelize.DECIMAL,
  channel_id: Sequelize.STRING,
  creditor: Sequelize.STRING,
  debtor: Sequelize.STRING,
  description: Sequelize.STRING,
  status: Sequelize.STRING
});
