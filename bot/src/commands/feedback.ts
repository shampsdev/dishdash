import { MyContext } from "src/bot";
import { IFeedbackService } from "src/services/feedbackService";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";
import { FEEDBACK_CHAT_ID } from "src/config";
// TODO: voice message transcription
export function setupFeedbackCommand(
  bot: Telegraf<MyContext>,
  fbService: IFeedbackService,
) {
  bot.command("feedback", async (ctx) => {
    if (ctx.session?.feedback_mode) {
      return;
    }
    logger.info(
      `Feedback mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    await ctx.replyWithPhoto(
      "https://storage.yandexcloud.net/dishash-s3/assets/bot/feedback.png",
      {
        caption: `Поделитесь своим мнением о DishDash в любом удобном формате\\. Отправьте фото\\, видео или текст прямо здесь\\, а бот передаст отзыв команде разработки\\!`,
        parse_mode: "MarkdownV2",
      },
    );
    ctx.session = {
      feedback_mode: true,
    };
  });

  bot.on("message", async (ctx, next) => {
    if (ctx.session === undefined || ctx.session.feedback_mode !== true)
      return next();

    const targetChatId = FEEDBACK_CHAT_ID;
    if (targetChatId === undefined) {
      return next();
    }
    await fbService.sendFeedback({
      username: ctx.message.from.username
        ? `@${ctx.message.from.username}`
        : ctx.message.from.id.toString(),
    });
    await ctx.forwardMessage(targetChatId);
    await ctx.replyWithMarkdownV2(
      `Большое спасибо :3\n\nВаше мнение правда очень важно для нас\\!`,
    );
    ctx.session.feedback_mode = false;
    return next();
  });
}
