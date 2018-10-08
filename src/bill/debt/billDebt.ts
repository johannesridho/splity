import * as Sequelize from "sequelize";
import { sequelize } from "../../sequelize";

export const BillDebt = sequelize.define("bill_debts", {
  amount: Sequelize.DECIMAL,
  billId: Sequelize.STRING,
  debtor: Sequelize.STRING,
  debtorName: Sequelize.STRING,
  status: Sequelize.STRING
});
