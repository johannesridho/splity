import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const PayDebt = sequelize.define("pay_debt", {
  amount: Sequelize.DECIMAL,
  channelDebtId: Sequelize.STRING,
  channelName: Sequelize.STRING,
  creditorId: Sequelize.STRING,
  creditorName: Sequelize.STRING,
  debtorName: Sequelize.STRING,
  status: Sequelize.STRING
});
