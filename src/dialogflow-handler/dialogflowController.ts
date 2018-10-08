import dialogflowFulfillment = require("dialogflow-fulfillment");
import { Request, Response, Router } from "express";
import * as billService from "../bill/billService";
import { ChannelInterface } from "../channel/ChannelInterface";
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
  intentMap.set("join-channel", joinChannel);
  intentMap.set("create-transaction", createTransaction);
  intentMap.set("pay-debt", payDebt);

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

  agent.add(
    `Your channel ${channel.name} is created. To join the channel, give this key : ${
      channel.key
    } to your friends and ask them to add Splity`
  );
}

async function joinChannel(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const key = agent.parameters["channel-key"];
  const name = agent.parameters["channel-name"];

  try {
    await channelService.joinChannel(key, name, agent.originalRequest.payload.data.source.userId);
    agent.add(`You've successfully joined channel ${name}`);
  } catch (error) {
    agent.add(error.message);
  }
}

async function createTransaction(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const bill = await billService.addEqualSplitBill(
    agent.parameters["transaction-amount"],
    agent.parameters["channel-key"],
    agent.originalRequest.payload.data.source.userId,
    agent.parameters["transaction-name"],
    agent.parameters["creditor-name"],
    "bill"
  );

  agent.add(
    `Your Bill for ${bill.bill.description} has been created. You have paid IDR ${
      bill.bill.amount
    } for this, so anyone in the channel should pay you IDR ${bill.channelDebts[0].amount}.`
  );
}

async function payDebt(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const payment = await billService.payDebt(
    agent.parameters["channel-key"],
    agent.originalRequest.payload.data.source.userId,
    agent.parameters["creditor-name"],
    agent.parameters["transaction-amount"],
    agent.parameters["transaction-name"]
  );

  agent.add(
    `Your Paymnet for ${payment.description} has been created. Please notify ${
      payment.name
    } to confirm/accept your payment`
  );
}

function getVersion(agent: any) {
  agent.add(versionService.getVersion());
}

export default router;
