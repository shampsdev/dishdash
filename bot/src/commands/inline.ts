import { BOT_URL, BOT_USERNAME } from "src/config";
import { createLobby } from "src/services/lobbyService";
import { Context, Telegraf } from "telegraf";
import {
  InlineKeyboardButton,
  InlineQueryResult,
  Location,
} from "telegraf/types";

export function setupInlineQuery(bot: Telegraf<Context>) {
  bot.on("inline_query", async (ctx) => {
    const button: InlineKeyboardButton = {
      text: "создаем лобби...",
      callback_data: "creating-lobby",
    };

    const results: InlineQueryResult[] = [
      {
        type: "article",
        id: "create-lobby",
        title: "Создать Лобби",
        description:
          "Создать новое лобби, чтобы легко и быстро выбрать место для встречи в компании.",
        thumbnail_url: `${BOT_URL}/cover.jpg`,
        input_message_content: {
          link_preview_options: {
            url: "https://dishdash.ru/",
          },
          message_text: `Не знаете, куда пойти? Давайте подберем вам место!`,
          parse_mode: "HTML",
        },
        reply_markup: {
          inline_keyboard: [[button]],
        },
      },
    ];

    await ctx.answerInlineQuery(results, {
      button: {
        start_parameter: "support",
        text: "cвязатся с поддержкой",
      },
      cache_time: 0,
    });
  });

  bot.on("chosen_inline_result", async (ctx) => {
    const messageId = ctx.chosenInlineResult.inline_message_id;

    const getLobbyUrl = async (location: Location) => {
      const lobby = await createLobby({
        location: {
          lat: location.latitude,
          lon: location.longitude,
        },
      });

      return lobby?.data;
    };

    const coords = ctx.chosenInlineResult.location;

    if (coords) {
      const lobby = await getLobbyUrl(coords);

      await bot.telegram.editMessageText(
        undefined,
        undefined,
        messageId,
        `Не знаете, куда пойти?? Давайте подберем вам место! (инвайт в лобби ${lobby?.id})`,
        {
          parse_mode: "Markdown",
          link_preview_options: {
            url: `https://t.me/${BOT_USERNAME}/app?startapp=${lobby?.id}`,
          },
        },
      );
    } else {
      await bot.telegram.editMessageText(
        undefined,
        undefined,
        messageId,
        "Бот создает лобби на основе ваших координат, чтобы предлагать вам места поближе к вам. К сожалению, у нас нет доступа к ним, поэтому не можем создать лобби.",
      );
    }
  });
}
