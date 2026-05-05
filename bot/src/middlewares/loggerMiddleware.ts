import { Context } from "telegraf";
import logger from "../utils/logger";

export async function loggerMiddleware(
  ctx: Context,
  next: () => Promise<void>,
) {
  const start = Date.now();
  const username = ctx.from?.username || "unknown";

  if (ctx.message && "text" in ctx.message) {
    const text = (ctx.message as { text: string }).text;
    logger.info(`User ${username} sent: ${text}`);
  } else {
    logger.info(`User ${username} sent a non-text message.`);
  }

  await next();

  const ms = Date.now() - start;
  logger.info(`Processed update from ${username} in ${ms}ms`);
}
