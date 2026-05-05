import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/types";
import Transport from "winston-transport";

export class TelegramTransport extends Transport {
  debug: boolean;
  bot: Telegraf<Context<Update>>;
  chat_id: number | undefined;
  constructor(
    opts: Transport.TransportStreamOptions & {
      debug: boolean;
      bot: Telegraf<Context<Update>>;
      chat_id: number | undefined;
    },
  ) {
    super(opts);
    this.debug = opts.debug;
    this.bot = opts.bot;
    this.chat_id = opts.chat_id;
  }

  log(info: unknown, callback: () => void) {
    const log = info as { message: string; level: string };

    setImmediate(() => {
      this.emit("logged", info);
    });

    if (!this.debug && this.chat_id !== undefined) {
      this.bot.telegram.sendMessage(this.chat_id, `[REPORT] ${log.message}`);
    }

    callback();
  }
}
