import dotenv from "dotenv";
import logger from "./utils/logger";
dotenv.config();

logger.info("Loading envs...");
export const DEBUG = process.env.DEBUG ? true : false;
logger.info("DEBUG: " + DEBUG);

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const HTTP_PORT = process.env.HTTP_PORT;

export const BOT_TOKEN = process.env.BOT_TOKEN || "";

export const ADMIN_IDS = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
  : [];

export const BOT_URL = process.env.BOT_URL;
export const FEEDBACK_CHAT_ID =
  process.env.FEEDBACK_CHAT_ID !== undefined
    ? parseInt(process.env.FEEDBACK_CHAT_ID)
    : undefined;
export const API_BASE_URL = process.env.API_BASE_URL || "";

export const BOT_USERNAME = process.env.BOT_USERNAME || "";

if (DEBUG) {
  logger.info("Bot token: " + BOT_TOKEN);
  logger.info("Admin ids: " + ADMIN_IDS.join(", "));
}

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;

export const WHISPER_API_KEY = process.env.WHISPER_API_KEY;
