
import { N8nResponse, ResponseType } from './types';

export class N8nResponseParser {
  static async parseResponse(response: Response, requestId: string): Promise<N8nResponse> {
    const contentType = response.headers.get('content-type') || '';
    console.log("🔍 Response content-type:", contentType);

    let responseType: ResponseType = 'unknown';
    let rawData: any;

    try {
      if (contentType.includes('application/json')) {
        responseType = 'json';
        rawData = await response.json();
        console.log("📥 Parsed JSON response:", rawData);
        return this.parseJsonResponse(rawData, requestId, responseType);
      } else {
        // Alle anderen als Text behandeln
        rawData = await response.text();
        console.log("📥 Received response text:", rawData);
        responseType = 'text';
        return this.parseTextResponse(rawData, requestId, responseType);
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

  private static parseJsonResponse(data: any, requestId: string, responseType: ResponseType): N8nResponse {
    console.log("🔍 Parsing JSON response:", data);

    let aiResponse = "";
    let searchParameters = undefined;
    let batchResults = undefined;

    // Check for batch results first
    if (data.batchResults && Array.isArray(data.batchResults)) {
      batchResults = data.batchResults;
      console.log("📊 Found batch results:", batchResults.length);
    } else if (data.results && Array.isArray(data.results)) {
      batchResults = data.results;
      console.log("📊 Found batch results as 'results':", batchResults.length);
    }

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
        
        // Check if data.data contains batch results
        if (!batchResults && data.data.every((item: any) => 
          typeof item === 'object' && 
          ('index' in item || 'success' in item || 'personalizedMessage' in item)
        )) {
          batchResults = data.data;
          console.log("📊 Found batch results in data array:", batchResults.length);
        }
      } else if (typeof data.data === 'object') {
        aiResponse = data.data.aiResponse || data.data.ai_response || data.data.response || data.data.output || data.data.message;
      }
    }

    // Generate default response if no AI response found and no batch results
    if (!aiResponse && !batchResults) {
      aiResponse = `Ich habe Ihre Anfrage verarbeitet (Request ID: ${requestId}). Die n8n-Workflow-Antwort enthielt keine erkennbare AI-Antwort.`;
      console.log("⚠️ No AI response found in JSON, using fallback");
    }

    return {
      success: true,
      message: batchResults ? "Batch processing completed" : "JSON response received from n8n",
      aiResponse: aiResponse,
      searchParameters: searchParameters,
      batchResults: batchResults,
      responseType: responseType,
      debug: {
        requestId,
        rawResponse: data,
        parsedAiResponse: !!aiResponse,
        parsedParameters: !!searchParameters,
        parsedBatchResults: !!batchResults,
      },
    };
  }

  private static parseTextResponse(data: string, requestId: string, responseType: ResponseType): N8nResponse {
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
}
