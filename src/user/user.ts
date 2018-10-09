import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const User = sequelize.define("user", {
  credit: Sequelize.DECIMAL,
  debt: Sequelize.DECIMAL,
  id: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  username: { type: Sequelize.STRING, allowNull: true }
});
