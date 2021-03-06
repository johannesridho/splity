import * as Sequelize from "sequelize";
import { sequelize } from "../sequelize";

export const Channel = sequelize.define("channel", {
  key: Sequelize.INTEGER.UNSIGNED,
  name: { type: Sequelize.STRING, unique: true }
});
