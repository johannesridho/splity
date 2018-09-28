import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const config = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,
    version: process.env.npm_package_version
  }
};

export default config;
