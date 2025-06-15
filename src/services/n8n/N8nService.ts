
import { N8nWebhookPayload, N8nResponse } from './types';
import { N8nResponseParser } from './responseParser';
import { N8nFallbackService } from './fallbackService';

export class N8nService {
  private webhookUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor(webhookUrl: string, options: { timeout?: number; maxRetries?: number } = {}) {
    this.webhookUrl = webhookUrl;
    this.timeout = options.timeout || 15000; // 15 seconds default
    this.maxRetries = options.maxRetries || 2;
  }

  async sendMessage(payload: N8nWebhookPayload): Promise<N8nResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("🚀 Sending message to n8n webhook:", this.webhookUrl);
    console.log("📤 Payload:", { ...payload, requestId });

    // Try the actual webhook with retries
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt}/${this.maxRetries} for request ${requestId}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
            "X-Attempt": attempt.toString(),
          },
          body: JSON.stringify({
            ...payload,
            requestId,
            attempt,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`📨 Response status (attempt ${attempt}):`, response.status);
        console.log("📨 Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          // If it's a 500 error and we have more attempts, try again
          if (response.status >= 500 && attempt < this.maxRetries) {
            console.log(`⚠️ Server error (${response.status}), retrying...`);
            await this.delay(1000 * attempt); // Progressive delay
            continue;
          }
          
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Successfully got a response, parse it
        const parsedResponse = await N8nResponseParser.parseResponse(response, requestId);
        
        // Check if the response indicates a workflow error
        if (this.isWorkflowError(parsedResponse)) {
          console.log("⚠️ Workflow error detected, considering fallback...");
          
          if (attempt < this.maxRetries) {
            await this.delay(1000 * attempt);
            continue;
          } else {
            // Last attempt failed, use fallback
            console.log("🔄 All attempts failed, using fallback service");
            return this.createFallbackWithError(payload, parsedResponse, requestId);
          }
        }

        // Success!
        console.log("✅ Successfully processed n8n response");
        return parsedResponse;

      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error);
        
        if (attempt === this.maxRetries) {
          // Final attempt failed, use fallback
          console.log("🔄 All attempts failed, using fallback service");
          return this.createFallbackWithError(payload, null, requestId, error);
        }
        
        // Wait before retrying
        await this.delay(1000 * attempt);
      }
    }

    // This should never be reached, but just in case
    return this.createFallbackWithError(payload, null, requestId, new Error("Unexpected error"));
  }

  private isWorkflowError(response: N8nResponse): boolean {
    // Check for common workflow error indicators
    const errorIndicators = [
      'Error in workflow',
      'Workflow execution failed',
      'Internal server error',
      'firstEntryJson'
    ];
    
    const responseText = response.aiResponse?.toLowerCase() || '';
    return errorIndicators.some(indicator => responseText.includes(indicator.toLowerCase()));
  }

  private createFallbackWithError(
    payload: N8nWebhookPayload, 
    originalResponse: N8nResponse | null, 
    requestId: string,
    error?: any
  ): N8nResponse {
    const fallbackResponse = N8nFallbackService.generateFallbackResponse(payload);
    
    // Enhance with error information
    return {
      ...fallbackResponse,
      message: "n8n workflow issues detected - using local fallback",
      debug: {
        ...fallbackResponse.debug,
        originalError: error?.message,
        originalResponse: originalResponse,
        fallbackActivated: true,
        webhookUrl: this.webhookUrl
      }
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
