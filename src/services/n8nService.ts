
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
  responseType?: 'json' | 'text' | 'html' | 'unknown';
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

      return await this.parseResponse(response, requestId);
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

  private async parseResponse(response: Response, requestId: string): Promise<N8nResponse> {
    const contentType = response.headers.get('content-type') || '';
    console.log("🔍 Response content-type:", contentType);

    let responseType: 'json' | 'text' | 'html' | 'unknown' = 'unknown';
    let rawData: any;

    try {
      if (contentType.includes('application/json')) {
        responseType = 'json';
        rawData = await response.json();
        console.log("📥 Parsed JSON response:", rawData);
        return this.parseJsonResponse(rawData, requestId, responseType);
      } else {
        // Get the text content first
        rawData = await response.text();
        console.log("📥 Received response text:", rawData);
        
        // Determine if it's actually HTML or just text
        const isActualHtml = this.isHtmlContent(rawData);
        
        if (isActualHtml) {
          responseType = 'html';
          return this.parseHtmlResponse(rawData, requestId, responseType);
        } else {
          responseType = 'text';
          return this.parseTextResponse(rawData, requestId, responseType);
        }
      }
    } catch (parseError) {
      console.error("❌ Error parsing response:", parseError);
      return {
        success: false,
        message: "Die n8n-Antwort konnte nicht verarbeitet werden. Möglicherweise gibt Ihr Workflow ein unerwartetes Format zurück.",
        error: `Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`,
        debug: { requestId, responseType, rawData },
      };
    }
  }

  private isHtmlContent(content: string): boolean {
    const trimmedContent = content.trim();
    
    // Check for common HTML indicators
    const htmlPatterns = [
      /^<!DOCTYPE/i,
      /^<html/i,
      /<\/html>\s*$/i,
      /<head>/i,
      /<body>/i,
      /<div[^>]*>/i,
      /<span[^>]*>/i,
      /<p[^>]*>/i
    ];
    
    // If it contains multiple HTML tags, it's likely HTML
    const htmlTagCount = (trimmedContent.match(/<[^>]+>/g) || []).length;
    
    return htmlPatterns.some(pattern => pattern.test(trimmedContent)) || htmlTagCount > 2;
  }

  private parseJsonResponse(data: any, requestId: string, responseType: 'json' | 'text' | 'html' | 'unknown'): N8nResponse {
    console.log("🔍 Parsing JSON response:", data);

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
    } else if (data.message && typeof data.message === 'string') {
      aiResponse = data.message;
    }

    // Strategy 2: Check for nested response structures (common in n8n)
    if (!aiResponse && data.data) {
      if (Array.isArray(data.data) && data.data.length > 0) {
        const firstItem = data.data[0];
        aiResponse = firstItem.aiResponse || firstItem.ai_response || firstItem.response || firstItem.output || firstItem.message;
      } else if (typeof data.data === 'object') {
        aiResponse = data.data.aiResponse || data.data.ai_response || data.data.response || data.data.output || data.data.message;
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
      aiResponse = `Ich habe Ihre Anfrage verarbeitet (Request ID: ${requestId}). Die n8n-Workflow-Antwort enthielt keine erkennbare AI-Antwort.`;
      console.log("⚠️ No AI response found in JSON, using fallback");
    }

    return {
      success: true,
      message: "JSON response received from n8n",
      aiResponse: aiResponse,
      searchParameters: searchParameters,
      responseType: responseType,
      debug: {
        requestId,
        rawResponse: data,
        parsedAiResponse: !!aiResponse,
        parsedParameters: !!searchParameters,
      },
    };
  }

  private parseTextResponse(data: string, requestId: string, responseType: 'json' | 'text' | 'html' | 'unknown'): N8nResponse {
    console.log("🔍 Parsing text response:", data.substring(0, 100) + "...");

    // Try to extract JSON from text response
    try {
      const jsonMatch = data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log("📥 Found JSON in text response:", jsonData);
        return this.parseJsonResponse(jsonData, requestId, 'json');
      }
    } catch (e) {
      console.log("📥 No valid JSON found in text response");
    }

    // Handle common n8n text responses
    if (data.includes("Workflow was started")) {
      return {
        success: true,
        message: "n8n Workflow wurde gestartet",
        aiResponse: "Ihr n8n-Workflow wurde erfolgreich gestartet. Die Verarbeitung läuft im Hintergrund.",
        responseType: responseType,
        debug: { requestId, rawResponse: data },
      };
    }

    // Handle plain text responses (including simple responses like "Hallo")
    if (data.trim().length > 0) {
      return {
        success: true,
        message: "Text response received from n8n",
        aiResponse: data.trim(),
        responseType: responseType,
        debug: { requestId, rawResponse: data },
      };
    }

    // Empty response
    return {
      success: false,
      message: "Leere Antwort von n8n erhalten",
      aiResponse: "Ihr n8n-Workflow hat eine leere Antwort zurückgegeben. Bitte überprüfen Sie Ihre Workflow-Konfiguration.",
      error: "Empty response",
      responseType: responseType,
      debug: { requestId, rawResponse: data },
    };
  }

  private parseHtmlResponse(data: string, requestId: string, responseType: 'json' | 'text' | 'html' | 'unknown'): N8nResponse {
    console.log("🔍 Parsing HTML response:", data.substring(0, 100) + "...");

    return {
      success: false,
      message: "n8n hat eine HTML-Seite zurückgegeben",
      aiResponse: "Ihr n8n-Webhook scheint eine HTML-Seite statt einer API-Antwort zurückzugeben. Bitte überprüfen Sie Ihre Webhook-URL und stellen Sie sicher, dass sie zu einem n8n-Webhook und nicht zu einer Webseite führt.",
      error: "HTML response received instead of JSON",
      responseType: responseType,
      debug: { requestId, rawResponse: data.substring(0, 500) },
    };
  }
}
