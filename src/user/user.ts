import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const User = sequelize.define("user", {
  credit: Sequelize.DECIMAL,
  debt: Sequelize.DECIMAL,
  name: Sequelize.STRING,
  username: Sequelize.STRING
});
