
import { N8nWebhookPayload, N8nResponse } from './types';
import { N8nResponseParser } from './responseParser';

export class N8nService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(payload: N8nWebhookPayload): Promise<N8nResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log("🚀 Sending message to n8n webhook:", this.webhookUrl);
      console.log("📤 Payload:", { ...payload, requestId });

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
        },
        body: JSON.stringify({
          ...payload,
          requestId,
        }),
      });

      console.log("📨 Response status:", response.status);
      console.log("📨 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      return await N8nResponseParser.parseResponse(response, requestId);
    } catch (error) {
      console.error("❌ Error calling n8n webhook:", error);
      return {
        success: false,
        message: "Es ist ein Fehler beim Verarbeiten Ihrer Anfrage aufgetreten. Bitte überprüfen Sie Ihre n8n-Konfiguration und versuchen Sie es erneut.",
        error: error instanceof Error ? error.message : "Unknown error",
        debug: { requestId, webhookUrl: this.webhookUrl },
      };
    }
  }
}
