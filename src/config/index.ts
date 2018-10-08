import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const config = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,
    version: process.env.npm_package_version
  },
  db: {
    dialect: "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    logging: false,
    name: process.env.DB_NAME || "splity",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || ""
  },
  line: {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
  }
};

export default config;
