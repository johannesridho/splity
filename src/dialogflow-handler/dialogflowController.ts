import dialogflowFulfillment = require("dialogflow-fulfillment");
import { Request, Response, Router } from "express";
import { ChannelInterface } from "../channel/ChannelInterface";
import * as channelService from "../channel/channelService";
import { ChannelUserInterface } from "../channel/user/ChannelUserInterface";
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
  intentMap.set("join-channel", joinChannel);

  intentMap.set("get-version", getVersion);

  agent.handleRequest(intentMap);
});

async function createChannel(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const channel: ChannelInterface = await channelService.createChannel(
    agent.parameters["channel-name"],
    agent.originalRequest.payload.data.source.userId
  );

  agent.add(`Your channel ${channel.name} is created. To join the channel, give this key : ${channel.key} to 
    your friends`);
}

async function joinChannel(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const key = agent.parameters["channel-key"];
  const name = agent.parameters["channel-name"];

  const channelUser: ChannelUserInterface = await channelService.joinChannel(
    key,
    name,
    agent.originalRequest.payload.data.source.userId
  );

  if (channelUser) {
    agent.add(`You've successfully joined channel ${name}`);
  } else {
    agent.add(`Channel with name ${name} and key ${key} is not exist.`);
  }
}

function getVersion(agent: any) {
  agent.add(versionService.getVersion());
}

export default router;
