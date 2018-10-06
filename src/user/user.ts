import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const User = sequelize.define("user", {
  credit: Sequelize.DECIMAL,
  debt: Sequelize.DECIMAL,
  id: Sequelize.STRING,
  name: { type: Sequelize.STRING, allowNull: true },
  username: { type: Sequelize.STRING, allowNull: true }
});
