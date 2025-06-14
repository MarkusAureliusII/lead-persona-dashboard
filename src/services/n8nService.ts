
export interface N8nWebhookPayload {
  message: string;
  targetAudience: {
    industry: string;
    companySize: string;
    jobTitle: string;
    location: string;
    techStack?: string;
  };
  timestamp: string;
}

export interface N8nResponse {
  success: boolean;
  message: string;
  searchParameters?: {
    industry?: string;
    companySize?: string;
    jobTitle?: string;
    location?: string;
    techStack?: string;
    estimatedLeads?: number;
  };
  error?: string;
}

export class N8nService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(payload: N8nWebhookPayload): Promise<N8nResponse> {
    try {
      console.log("Sending message to n8n webhook:", this.webhookUrl);
      console.log("Payload:", payload);

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("n8n response:", data);

      return {
        success: true,
        message: data.message || "Response received from n8n",
        searchParameters: data.searchParameters,
      };
    } catch (error) {
      console.error("Error calling n8n webhook:", error);
      return {
        success: false,
        message: "Sorry, I encountered an error while processing your request. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
