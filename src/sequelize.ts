import * as Sequelize from "sequelize";
import config from "./config";

export const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  dialect: config.db.dialect,
  operatorsAliases: false,
  port: config.db.port
});
