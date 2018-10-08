import requestPromise = require("request-promise");
import config from "../../config/index";
import ErrorResponse from "../../error/ErrorResponse";
import logger from "../../util/logger";
import { LineProfileInterface } from "./LineProfileInterface";

export async function getUserProfile(userId: string): Promise<LineProfileInterface> {
  try {
    return await requestPromise({
      headers: {
        Authorization: `Bearer ${config.line.channelAccessToken}`
      },
      json: true,
      uri: `https://api.line.me/v2/bot/profile/${userId}`
    });
  } catch (error) {
    logger.error(`Error at lineService.getUserProfile, message: ${error.message}`);
    throw new ErrorResponse(error.message, 404);
  }
}
