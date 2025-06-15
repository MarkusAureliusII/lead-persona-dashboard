
import { N8nWebhookPayload, N8nResponse, SearchParameters } from './types';

export class N8nFallbackService {
  static generateFallbackResponse(payload: N8nWebhookPayload): N8nResponse {
    console.log("🔄 Generating fallback response for payload:", payload);
    
    const fallbackParameters = this.extractParametersFromMessage(payload.message);
    
    return {
      success: true,
      message: "Fallback response generated due to n8n workflow issues",
      aiResponse: this.generateFallbackAiResponse(payload.message, fallbackParameters),
      searchParameters: fallbackParameters,
      responseType: 'fallback',
      debug: {
        requestId: payload.requestId || `fallback_${Date.now()}`,
        fallbackReason: 'n8n workflow error or timeout',
        originalMessage: payload.message
      }
    };
  }

  private static extractParametersFromMessage(message: string): SearchParameters {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced parameter extraction with better defaults
    let industry = "Technologie";
    let jobTitle = "Manager";
    let location = "Deutschland";
    let companySize = "50-200";

    // Industry detection
    if (lowerMessage.includes("saas") || lowerMessage.includes("software")) {
      industry = "SaaS/Software";
    } else if (lowerMessage.includes("fintech") || lowerMessage.includes("finance")) {
      industry = "Fintech";
    } else if (lowerMessage.includes("startup")) {
      industry = "Startup";
    } else if (lowerMessage.includes("healthcare") || lowerMessage.includes("gesundheit")) {
      industry = "Healthcare";
    } else if (lowerMessage.includes("ecommerce") || lowerMessage.includes("e-commerce")) {
      industry = "E-Commerce";
    }

    // Job title detection
    if (lowerMessage.includes("cto") || lowerMessage.includes("chief technology")) {
      jobTitle = "CTO";
    } else if (lowerMessage.includes("ceo") || lowerMessage.includes("chief executive")) {
      jobTitle = "CEO";
    } else if (lowerMessage.includes("marketing")) {
      jobTitle = "Marketing Manager";
    } else if (lowerMessage.includes("hr") || lowerMessage.includes("human resources")) {
      jobTitle = "HR Director";
    } else if (lowerMessage.includes("sales")) {
      jobTitle = "Sales Manager";
    }

    // Location detection
    if (lowerMessage.includes("berlin")) {
      location = "Berlin, Deutschland";
    } else if (lowerMessage.includes("münchen") || lowerMessage.includes("munich")) {
      location = "München, Deutschland";
    } else if (lowerMessage.includes("hamburg")) {
      location = "Hamburg, Deutschland";
    } else if (lowerMessage.includes("österreich") || lowerMessage.includes("austria")) {
      location = "Österreich";
    } else if (lowerMessage.includes("schweiz") || lowerMessage.includes("switzerland")) {
      location = "Schweiz";
    }

    // Company size detection
    if (lowerMessage.includes("startup") || lowerMessage.includes("klein")) {
      companySize = "1-10";
    } else if (lowerMessage.includes("mittelstand") || lowerMessage.includes("medium")) {
      companySize = "50-200";
    } else if (lowerMessage.includes("enterprise") || lowerMessage.includes("groß")) {
      companySize = "1000+";
    }

    return {
      industry,
      jobTitle,
      location,
      companySize,
      estimatedLeads: Math.floor(Math.random() * 300) + 50
    };
  }

  private static generateFallbackAiResponse(originalMessage: string, parameters: SearchParameters): string {
    return `🔄 **Fallback-Modus aktiviert!**

Aufgrund von n8n-Workflow-Problemen habe ich Ihre Anfrage "${originalMessage}" lokal verarbeitet.

**Extrahierte Parameter:**
• **Branche:** ${parameters.industry}
• **Position:** ${parameters.jobTitle}
• **Standort:** ${parameters.location}
• **Firmengröße:** ${parameters.companySize}
• **Geschätzte Leads:** ~${parameters.estimatedLeads}

🔧 **Nächste Schritte:**
1. Überprüfen Sie Ihre n8n-Workflow-Konfiguration
2. Testen Sie die Webhook-Verbindung in den Einstellungen
3. Prüfen Sie die n8n-Logs auf Fehler

💡 **Tipp:** Diese Parameter können Sie trotzdem für Ihre Lead-Suche verwenden!`;
  }
}
