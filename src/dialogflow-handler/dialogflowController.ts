import dialogflowFulfillment = require("dialogflow-fulfillment");
import { Request, Response, Router } from "express";
import * as billService from "../bill/billService";
import { ChannelInterface } from "../channel/ChannelInterface";
import * as channelService from "../channel/channelService";
import * as channelDebtService from "../channel/debt/channelDebtService";
import * as payDebtService from "../pay-debt/payDebtService";
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
  intentMap.set("credit-debt-status", creditDebtStatus);
  intentMap.set("pay-debt", createPayDebt);
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
    `Your Bill for ${bill.bill.description} has been created. You have paid Rp${
      bill.bill.amount
    } for this, so anyone in the channel should pay you Rp${bill.channelDebts[0].amount}.`
  );
}

async function createPayDebt(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  // todo: handle two user with same name
  const payDebt = await payDebtService.createPayDebt(
    agent.parameters["transaction-amount"],
    agent.parameters["channel-name"],
    agent.parameters["creditor-name"],
    agent.originalRequest.payload.data.source.userId
  );

  agent.add(
    `The payment for your debt to ${payDebt.creditorName} is issued. Please wait for the ${
      payDebt.creditorName
    } to confirm or settle it.`
  );
}

async function creditDebtStatus(agent: any) {
  if (!agent.originalRequest.payload.data) {
    agent.add("Please use Line Messenger to be able to use this bot");
    return;
  }

  const response = await channelDebtService.getCreditDebtStatus(agent.originalRequest.payload.data.source.userId);
  agent.add(response);
}

function getVersion(agent: any) {
  agent.add(versionService.getVersion());
}

export default router;
