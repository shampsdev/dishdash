import { BOT_USERNAME } from "src/config";
import { createLobby } from "src/services/lobbyService";
import { Context, Telegraf } from "telegraf";

export function setupJoinCommand(bot: Telegraf<Context>) {
  bot.command("join", async (ctx) => {
    const getLobbyUrl = async () => {
      const lobby = await createLobby({
        location: { lat: 59.9311, lon: 30.3609 },
      });

      return lobby?.data;
    };

    const lobby = await getLobbyUrl();

    if (lobby) {
      await ctx.reply(
        `Лобби успешно создано! Присоединяйтесь по ссылке: [Lobby #${lobby.id}](https://t.me/${BOT_USERNAME}/app?startapp=${lobby.id})`,
      );
    } else {
      await ctx.reply("К сожалению, не удалось создать лобби.");
    }
  });
}
