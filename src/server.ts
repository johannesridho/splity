import { createServer } from "http";
import app from "./app";
import config from "./config";
import { User } from "./user/User";
import logger from "./util/logger";

app.set("port", config.app.port);
const server = createServer(app as any);
server.listen(config.app.port);
server.on("error", onError);
server.on("listening", onListening);

User.sync({ force: true }).then(() => {
  return User.create({
    credit: 0,
    debt: 0,
    name: "Johannes",
    username: "jo"
  });
});

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof config.app.port === "string" ? "Pipe " + config.app.port : "Port " + config.app.port;

  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + address.port;
  logger.info(`Listening on ${bind}`);
  logger.info(`Environment : ${config.app.env}`);
}
