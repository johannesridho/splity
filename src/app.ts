import * as compression from "compression";
import * as express from "express";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import * as helmet from "helmet";
import * as morgan from "morgan";
import dialogflowRouter from "./dialogflow-handler/dialogflowController";
import ErrorResponse from "./errors/ErrorResponse";
import logger from "./utils/logger";

const app = express();

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(
  morgan("tiny", {
    stream: {
      write: (message: string) => {
        logger.info(message);
      }
    }
  })
);

app.use("/dialogflow", dialogflowRouter);

// tslint:disable:variable-name
app.use((_req: Request, res: Response) => {
  const status = 404;
  res.status(status);
  res.send(new ErrorResponse("Not Found", status));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(
    `${err.status || 500} - ${err.message} - ${req.method} - ${
      req.originalUrl
    } - ${req.ip}`
  );

  const status = err.status || 500;
  res.status(status);
  res.send(new ErrorResponse(err.message, status));

  next(err);
});

export default app;
