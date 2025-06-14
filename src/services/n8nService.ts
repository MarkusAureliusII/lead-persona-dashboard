
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
  requestId?: string;
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
  debug?: any;
}

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

      const data = await response.json();
      console.log("📥 Raw n8n response:", data);

      return this.parseN8nResponse(data, requestId);
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

  private parseN8nResponse(data: any, requestId: string): N8nResponse {
    console.log("🔍 Parsing n8n response:", data);

    // Handle different n8n response formats
    let aiResponse = "";
    let searchParameters = undefined;

    // Strategy 1: Check for direct AI response fields
    if (data.aiResponse) {
      aiResponse = data.aiResponse;
    } else if (data.ai_response) {
      aiResponse = data.ai_response;
    } else if (data.response && typeof data.response === 'string' && data.response !== "Workflow was started") {
      aiResponse = data.response;
    } else if (data.output) {
      aiResponse = data.output;
    } else if (data.result) {
      aiResponse = data.result;
    }

    // Strategy 2: Check for nested response structures (common in n8n)
    if (!aiResponse && data.data) {
      if (Array.isArray(data.data) && data.data.length > 0) {
        const firstItem = data.data[0];
        aiResponse = firstItem.aiResponse || firstItem.ai_response || firstItem.response || firstItem.output;
      } else if (typeof data.data === 'object') {
        aiResponse = data.data.aiResponse || data.data.ai_response || data.data.response || data.data.output;
      }
    }

    // Strategy 3: Check for parameters in various formats
    if (data.searchParameters) {
      searchParameters = data.searchParameters;
    } else if (data.search_parameters) {
      searchParameters = data.search_parameters;
    } else if (data.parameters) {
      searchParameters = data.parameters;
    } else if (data.params) {
      searchParameters = data.params;
    }

    // Strategy 4: Extract from nested data structures
    if (!searchParameters && data.data) {
      if (Array.isArray(data.data) && data.data.length > 0) {
        const firstItem = data.data[0];
        searchParameters = firstItem.searchParameters || firstItem.search_parameters || firstItem.parameters;
      } else if (typeof data.data === 'object') {
        searchParameters = data.data.searchParameters || data.data.search_parameters || data.data.parameters;
      }
    }

    // Generate default response if no AI response found
    if (!aiResponse) {
      aiResponse = `Ich habe Ihre Anfrage verarbeitet (Request ID: ${requestId}). Die n8n-Workflow-Antwort war: ${JSON.stringify(data).substring(0, 200)}...`;
      console.log("⚠️ No AI response found, using fallback");
    }

    const result: N8nResponse = {
      success: true,
      message: "AI Agent Response received",
      aiResponse: aiResponse,
      searchParameters: searchParameters,
      debug: {
        requestId,
        rawResponse: data,
        parsedAiResponse: !!aiResponse,
        parsedParameters: !!searchParameters,
      },
    };

    console.log("✅ Parsed response:", result);
    return result;
  }
}
