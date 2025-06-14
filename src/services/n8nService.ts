
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
  aiResponse?: string;
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

      // Parse the AI agent response from n8n
      let aiResponse = "";
      let searchParameters = undefined;

      // Check if n8n returned structured data
      if (data.aiResponse) {
        aiResponse = data.aiResponse;
      } else if (data.response) {
        aiResponse = data.response;
      } else if (data.message && data.message !== "Workflow was started") {
        aiResponse = data.message;
      } else {
        // If no meaningful response, generate a default response
        aiResponse = `Ich habe Ihre Anfrage "${payload.message}" verarbeitet und erstelle entsprechende Suchparameter für Ihre Zielgruppe.`;
      }

      // Extract search parameters if provided
      if (data.searchParameters) {
        searchParameters = data.searchParameters;
      } else if (data.parameters) {
        searchParameters = data.parameters;
      }

      return {
        success: true,
        message: "AI Agent Response received",
        aiResponse: aiResponse,
        searchParameters: searchParameters,
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
