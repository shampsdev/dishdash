import { MyContext } from "src/bot";
import { BOT_USERNAME } from "src/config";
import { IMetricService } from "src/services/metricService";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";
import { createUser } from "src/api/createUser";
import User from "src/api/interfaces/User";

export function setupStartCommand(
  bot: Telegraf<MyContext>,
  metricService: IMetricService,
) {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    metricService.sendTagEvent(userId, ctx.payload);

    const user: User = {
      name: ctx.from.first_name,
      telegram: userId,
    };

    await createUser(user);

    const paramsPayload = ctx.payload;

    if (paramsPayload === "feedback") {
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
    } else {
      await ctx.replyWithPhoto(
        "https://storage.yandexcloud.net/dishash-s3/assets/bot/cover.jpeg",
        {
          caption: `*Как найти идеальное место для встречи?*\n\n1\\. Нажмите кнопку «Open»\n2\\. Создайте лобби\n3\\. Отправьте приглашения, если будете выбирать вместе\n4\\. Настройте параметры поиска под ваши цели и бюджет\n5\\. Все готово – начинайте свайпать\\!`,
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Открыть DishDash 🤌",
                  url: `https://t.me/${BOT_USERNAME}/app`,
                },
              ],
            ],
          },
        },
      );
    }
  });
}
