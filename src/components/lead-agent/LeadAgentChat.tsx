
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, AlertCircle, Settings, Bug } from "lucide-react";
import { useState } from "react";
import { TargetAudience, SearchParameters } from "@/pages/LeadAgent";
import { N8nService } from "@/services/n8nService";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "error" | "debug";
  content: string;
  timestamp: Date;
  parameters?: SearchParameters;
  debug?: any;
}

interface LeadAgentChatProps {
  onParametersGenerated: (parameters: SearchParameters) => void;
  targetAudience: TargetAudience;
  webhookUrl?: string;
}

export function LeadAgentChat({ onParametersGenerated, targetAudience, webhookUrl }: LeadAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "agent",
      content: webhookUrl 
        ? "🤖 Hallo! Ich bin Ihr n8n-powered Lead Agent. Beschreiben Sie mir in natürlicher Sprache, welche Art von Leads Sie suchen.\n\n💡 **Beispiele:**\n• 'Suche CTOs von SaaS Unternehmen in Deutschland'\n• 'Finde Marketing Manager in Startups mit 10-50 Mitarbeitern'\n• 'Zeige mir HR Directors in Fintech Unternehmen in Berlin'"
        : "⚠️ **n8n Webhook nicht konfiguriert**\n\nBitte konfigurieren Sie zunächst Ihre n8n Webhook URL in den Einstellungen oberhalb, um den AI Agent zu verwenden.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
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

  const handleSendMessage = async () => {
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
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const n8nService = new N8nService(webhookUrl);
      const response = await n8nService.sendMessage({
        message: currentInput,
        targetAudience,
        timestamp: new Date().toISOString(),
      });

      console.log("🔄 Processing n8n response:", response);

      if (response.success && response.aiResponse) {
        // Display the AI agent response
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: response.aiResponse,
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
            content: `🎯 **Suchparameter automatisch generiert:**

**Branche:** ${response.searchParameters.industry || 'Nicht spezifiziert'}
**Position:** ${response.searchParameters.jobTitle || 'Nicht spezifiziert'}
**Standort:** ${response.searchParameters.location || 'Nicht spezifiziert'}
**Firmengröße:** ${response.searchParameters.companySize || 'Nicht spezifiziert'}
**Geschätzte Leads:** ~${response.searchParameters.estimatedLeads || 'Unbekannt'}

✅ Die Parameter wurden automatisch in die Vorschau übernommen.`,
            timestamp: new Date(),
            parameters: response.searchParameters
          };

          setTimeout(() => {
            setMessages(prev => [...prev, parameterMessage]);
          }, 1000);
        } else {
          // Generate fallback parameters if none provided
          const fallbackParams = generateFallbackParameters(currentInput);
          onParametersGenerated(fallbackParams);
          
          const fallbackMessage: ChatMessage = {
            id: (Date.now() + 4).toString(),
            type: "agent",
            content: `⚡ **Fallback-Parameter generiert:**

Da keine strukturierten Parameter vom AI Agent empfangen wurden, habe ich basierend auf Ihrer Anfrage folgende Parameter erstellt:

**Branche:** ${fallbackParams.industry}
**Position:** ${fallbackParams.jobTitle}
**Standort:** ${fallbackParams.location}
**Firmengröße:** ${fallbackParams.companySize}
**Geschätzte Leads:** ~${fallbackParams.estimatedLeads}

💡 *Tipp: Optimieren Sie Ihren n8n Workflow, um strukturierte Parameter zurückzugeben.*`,
            timestamp: new Date(),
            parameters: fallbackParams
          };

          setTimeout(() => {
            setMessages(prev => [...prev, fallbackMessage]);
          }, 1000);
        }
      } else {
        // Enhanced error handling
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "error",
          content: `❌ **Fehler beim Verarbeiten der Anfrage:**

${response.message}

${response.error ? `**Technische Details:** ${response.error}` : ''}

🔧 **Lösungsvorschläge:**
• Überprüfen Sie Ihre n8n Webhook URL
• Stellen Sie sicher, dass Ihr n8n Workflow läuft
• Prüfen Sie die n8n Workflow-Logs auf Fehler`,
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
        content: `💥 **Kritischer Fehler:**

Es ist ein unerwarteter Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}

🔧 **Sofortige Hilfe:**
• Überprüfen Sie Ihre Internetverbindung
• Validieren Sie die n8n Webhook URL
• Kontaktieren Sie den Support, falls das Problem weiterhin besteht`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, criticalErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Lead Agent Chat</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs"
          >
            <Bug className="w-4 h-4 mr-1" />
            {showDebug ? "Debug: An" : "Debug: Aus"}
          </Button>
          {!webhookUrl && (
            <div className="flex items-center text-orange-600">
              <Settings className="w-4 h-4 mr-1" />
              <span className="text-xs">Konfiguration erforderlich</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.type === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === "user" 
                ? "bg-blue-600 text-white" 
                : message.type === "error"
                ? "bg-red-100 text-red-600"
                : message.type === "debug"
                ? "bg-purple-100 text-purple-600"
                : "bg-green-100 text-green-600"
            }`}>
              {message.type === "user" ? (
                <User className="w-4 h-4" />
              ) : message.type === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : message.type === "debug" ? (
                <Bug className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            
            <div className={`flex-1 ${message.type === "user" ? "text-right" : ""}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "error"
                  ? "bg-red-50 text-red-900 border border-red-200"
                  : message.type === "debug"
                  ? "bg-purple-50 text-purple-900 border border-purple-200"
                  : "bg-green-50 text-green-900 border border-green-200"
              }`}>
                <div className="whitespace-pre-line text-sm">{message.content}</div>
              </div>
              
              {message.parameters && (
                <div className="mt-2">
                  <Button
                    size="sm"
                    onClick={() => onParametersGenerated(message.parameters!)}
                    className="text-xs"
                  >
                    Parameter erneut übernehmen
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-xs text-green-600">AI Agent arbeitet...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder={webhookUrl ? "z.B. 'Suche CTOs von SaaS Unternehmen in Deutschland'" : "Konfigurieren Sie zunächst die n8n Webhook URL"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !webhookUrl}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim() || !webhookUrl}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
