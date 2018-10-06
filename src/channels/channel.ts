import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const Channel = sequelize.define("channels", {
  key: Sequelize.DECIMAL,
  name: Sequelize.STRING
});
