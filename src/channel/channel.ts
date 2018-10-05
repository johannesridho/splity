import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const Channel = sequelize.define("channel", {
  key: Sequelize.DECIMAL,
  name: Sequelize.STRING,
  userId: Sequelize.STRING
});
