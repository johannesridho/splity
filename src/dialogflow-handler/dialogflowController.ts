import dialogflowFulfillment = require("dialogflow-fulfillment");
import { Request, Response, Router } from "express";
import * as channelService from "../channel/channelService";
import logger from "../util/logger";
import * as versionService from "../version/versionService";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  logger.debug(req.body.queryResult);

  const agent = new dialogflowFulfillment.WebhookClient({
    request: req,
    response: res
  });

  const intentMap = new Map();

  // todo: find a better way to map the intents with the services (use reflection maybe)
  intentMap.set("create-channel", createChannel);
  intentMap.set("get-version", getVersion);
  agent.handleRequest(intentMap);
});

async function createChannel(agent: any) {
  const response = await channelService.createChannel(agent.parameters["channel-name"]);
  agent.add(response);
}

function getVersion(agent: any) {
  agent.add(versionService.getVersion());
}

export default router;
