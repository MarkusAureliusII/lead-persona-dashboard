
import { useState } from "react";
import { TargetAudience, SearchParameters } from "@/types/leadAgent";
import { N8nService } from "@/services/n8nService";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "./ChatMessage";

interface UseChatMessagesProps {
  webhookUrl?: string;
  targetAudience: TargetAudience;
  onParametersGenerated: (parameters: SearchParameters) => void;
  showDebug: boolean;
}

export function useChatMessages({ 
  webhookUrl, 
  targetAudience, 
  onParametersGenerated, 
  showDebug 
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "agent",
      content: webhookUrl 
        ? "🐱 **Miau! Willkommen beim Lead-Jagd-Assistenten!**\n\nIch bin Ihr schnurrfähiger n8n-powered Lead Agent mit Extra-Signal-Rausch-Filterung für bessere Konversionen! 🎯\n\nBeschreiben Sie mir in natürlicher Sprache, welche Art von Leads Sie jagen möchten:\n\n💡 **Katzen-getestete Beispiele:**\n• 'Suche CTOs von SaaS Unternehmen in Deutschland'\n• 'Finde Marketing Manager in Startups mit 10-50 Mitarbeitern'\n• 'Zeige mir HR Directors in Fintech Unternehmen in Berlin'\n\n🔥 **Signal-Rausch-Optimierung aktiviert für bessere Lead-Qualität!**"
        : "⚠️ **n8n Webhook nicht konfiguriert**\n\nBitte konfigurieren Sie zunächst Ihre n8n Webhook URL in den Einstellungen oberhalb, um den AI Agent zu verwenden.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateFallbackParameters = (userInput: string): SearchParameters => {
    const lowerInput = userInput.toLowerCase();
    
    let industry = targetAudience.industry;
    let jobTitle = targetAudience.jobTitle;
    let location = targetAudience.location;
    let companySize = targetAudience.companySize;

    // Enhanced extraction logic
    if (lowerInput.includes("saas") || lowerInput.includes("software")) {
      industry = "SaaS/Software";
    } else if (lowerInput.includes("fintech") || lowerInput.includes("finance")) {
      industry = "Fintech";
    } else if (lowerInput.includes("startup")) {
      industry = "Startup";
    }

    if (lowerInput.includes("cto") || lowerInput.includes("chief technology")) {
      jobTitle = "CTO";
    } else if (lowerInput.includes("marketing")) {
      jobTitle = "Marketing Manager";
    } else if (lowerInput.includes("hr") || lowerInput.includes("human resources")) {
      jobTitle = "HR Director";
    }

    if (lowerInput.includes("deutschland") || lowerInput.includes("germany")) {
      location = "Deutschland";
    } else if (lowerInput.includes("berlin")) {
      location = "Berlin, Deutschland";
    }

    if (lowerInput.includes("startup") || lowerInput.includes("10-50")) {
      companySize = "10-50";
    } else if (lowerInput.includes("enterprise") || lowerInput.includes("1000+")) {
      companySize = "1000+";
    }

    return {
      industry: industry || "Technologie",
      jobTitle: jobTitle || "Executive",
      location: location || "Deutschland",
      companySize: companySize || "50-200",
      estimatedLeads: Math.floor(Math.random() * 500) + 100
    };
  };

  const sendMessage = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    if (!webhookUrl) {
      toast({
        title: "⚠️ Konfiguration erforderlich",
        description: "Bitte konfigurieren Sie zunächst Ihre n8n Webhook URL.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const n8nService = new N8nService(webhookUrl);
      const response = await n8nService.sendMessage({
        message: inputValue,
        targetAudience,
        timestamp: new Date().toISOString(),
      });

      console.log("🔄 Processing n8n response:", response);

      if (response.success && response.aiResponse) {
        // Display the AI agent response with cat enhancement
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: `🐱 **Schnurr!** ${response.aiResponse}\n\n🔊 **Signal-Rausch-Filter aktiviert für optimale Lead-Qualität!**`,
          timestamp: new Date(),
          parameters: response.searchParameters,
          debug: response.debug
        };

        setMessages(prev => [...prev, agentMessage]);
        
        // Show debug info if enabled
        if (showDebug && response.debug) {
          const debugMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: "debug",
            content: `🔍 **Debug Info:**\nRequest ID: ${response.debug.requestId}\nParsed AI Response: ${response.debug.parsedAiResponse ? '✅' : '❌'}\nParsed Parameters: ${response.debug.parsedParameters ? '✅' : '❌'}`,
            timestamp: new Date(),
            debug: response.debug
          };
          setMessages(prev => [...prev, debugMessage]);
        }
        
        // Handle search parameters
        if (response.searchParameters) {
          onParametersGenerated(response.searchParameters);
          
          const parameterMessage: ChatMessage = {
            id: (Date.now() + 3).toString(),
            type: "agent",
            content: `🎯 **Katzen-optimierte Suchparameter generiert:**

**Branche:** ${response.searchParameters.industry || 'Nicht spezifiziert'}
**Position:** ${response.searchParameters.jobTitle || 'Nicht spezifiziert'}
**Standort:** ${response.searchParameters.location || 'Nicht spezifiziert'}
**Firmengröße:** ${response.searchParameters.companySize || 'Nicht spezifiziert'}
**Geschätzte Leads:** ~${response.searchParameters.estimatedLeads || 'Unbekannt'}

🐱✅ Die Parameter wurden mit Katzen-Präzision in die Vorschau übernommen!`,
            timestamp: new Date(),
            parameters: response.searchParameters
          };

          setTimeout(() => {
            setMessages(prev => [...prev, parameterMessage]);
          }, 1000);
        } else {
          // Generate fallback parameters if none provided
          const fallbackParams = generateFallbackParameters(inputValue);
          onParametersGenerated(fallbackParams);
          
          const fallbackMessage: ChatMessage = {
            id: (Date.now() + 4).toString(),
            type: "agent",
            content: `⚡🐱 **Katzen-Fallback-Parameter mit Signal-Rausch-Optimierung:**

Da keine strukturierten Parameter vom AI Agent empfangen wurden, habe ich mit meinen Katzen-Instinkten folgende Parameter erstellt:

**Branche:** ${fallbackParams.industry}
**Position:** ${fallbackParams.jobTitle}
**Standort:** ${fallbackParams.location}
**Firmengröße:** ${fallbackParams.companySize}
**Geschätzte Leads:** ~${fallbackParams.estimatedLeads}

💡 *Schnurr-Tipp: Optimieren Sie Ihren n8n Workflow für noch bessere Katzen-Power!*`,
            timestamp: new Date(),
            parameters: fallbackParams
          };

          setTimeout(() => {
            setMessages(prev => [...prev, fallbackMessage]);
          }, 1000);
        }
      } else {
        // Enhanced error handling with cat theme
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "error",
          content: `❌🐱 **Katzen-Alarm! Fehler beim Verarbeiten:**

${response.message}

${response.error ? `**Technische Details:** ${response.error}` : ''}

🔧 **Katzen-Lösungsvorschläge:**
• Überprüfen Sie Ihre n8n Webhook URL
• Stellen Sie sicher, dass Ihr n8n Workflow läuft
• Prüfen Sie die n8n Workflow-Logs auf Fehler
• Füttern Sie die Server-Katze 🐱`,
          timestamp: new Date(),
          debug: response.debug
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("💥 Critical error in handleSendMessage:", error);
      
      const criticalErrorMessage: ChatMessage = {
        id: (Date.now() + 5).toString(),
        type: "error",
        content: `💥🐱 **Kritischer Katzen-Notfall:**

Es ist ein unerwarteter Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}

🔧 **Sofortige Katzen-Hilfe:**
• Überprüfen Sie Ihre Internetverbindung
• Validieren Sie die n8n Webhook URL
• Kontaktieren Sie den Support (mit Katzenbildern für schnellere Hilfe)`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, criticalErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}
