import { MyContext } from "src/bot";
import { Telegraf } from "telegraf";

interface Feedback {
  username: string;
}

export interface IFeedbackService {
  sendFeedback(feedback: Feedback): void;
  sendFeedbackEnd(feedback: Feedback): void;
}

export class FeedbackService implements IFeedbackService {
  private bot: Telegraf<MyContext>;
  private feedbackChatId: number;

  constructor(bot: Telegraf<MyContext>, feedbackChatId: number) {
    this.bot = bot;
    this.feedbackChatId = feedbackChatId;
  }

  async sendFeedback(feedback: Feedback) {
    const escapeMarkdown = (text: string): string =>
      text.replace(/([*_[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

    const username = escapeMarkdown(feedback.username);

    const message = `💌 **Feedback from ${username}**💌`;
    await this.bot.telegram.sendMessage(this.feedbackChatId, message, {
      parse_mode: "MarkdownV2",
    });
  }

  sendFeedbackEnd(feedback: Feedback) {
    const escapeMarkdown = (text: string): string =>
      text.replace(/([*_[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

    const username = escapeMarkdown(feedback.username);

    const message = `❌**END Feedback from ${username}**❌`;
    this.bot.telegram.sendMessage(this.feedbackChatId, message, {
      parse_mode: "MarkdownV2",
    });
  }
}
