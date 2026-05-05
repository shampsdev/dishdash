import axios from "axios";

export interface IMetricService {
  sendTagEvent(userId: number, tag: string): Promise<void>;
}

export class MetricService implements IMetricService {
  private apiUrl: string;
  private domain: string;

  constructor(apiUrl: string, domain: string) {
    this.apiUrl = apiUrl;
    this.domain = domain;
  }

  async sendTagEvent(userId: number, tag: string): Promise<void> {
    const payload = {
      name: "tag",
      url: `https://${this.domain}`,
      domain: this.domain,
      props: {
        tag: tag,
        user: userId,
      },
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          "X-Forwarded-For": "127.0.0.1",
          "Content-Type": "application/json",
        },
      });

      console.log(
        `Tag event "${tag}" "${userId}" sent successfully.`,
        response.data,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Failed to send tag event: ${error.response?.status} ${error.response?.statusText}`,
        );
      } else {
        console.error("Error sending tag event:", error);
      }
    }
  }
}
