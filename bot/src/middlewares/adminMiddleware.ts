import { Context, MiddlewareFn } from "telegraf";
import { ADMIN_IDS } from "../config";

export const adminMiddleware: MiddlewareFn<Context> = (ctx, next) => {
  const userId = ctx.from?.id.toString();

  if (userId && ADMIN_IDS.includes(userId)) {
    return next();
  } else {
    ctx.reply("Access denied: You do not have permission to use this command.");
    return;
  }
};
