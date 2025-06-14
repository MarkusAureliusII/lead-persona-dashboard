
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { TargetAudience, SearchParameters } from "@/pages/LeadAgent";
import { N8nService } from "@/services/n8nService";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "error";
  content: string;
  timestamp: Date;
  parameters?: SearchParameters;
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
        ? "Hallo! Ich bin Ihr n8n-powered Lead Agent. Beschreiben Sie mir in natürlicher Sprache, welche Art von Leads Sie suchen. Zum Beispiel: 'Suche CTOs von SaaS Unternehmen in Deutschland'"
        : "Konfigurieren Sie zunächst Ihre n8n Webhook URL in den Einstellungen, um den AI Agent zu verwenden.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSearchParameters = (userInput: string): SearchParameters => {
    // Simulate AI processing by extracting keywords and mapping to search parameters
    const lowerInput = userInput.toLowerCase();
    
    let industry = targetAudience.industry;
    let jobTitle = targetAudience.jobTitle;
    let location = targetAudience.location;
    let companySize = targetAudience.companySize;

    // Extract information from natural language input
    if (lowerInput.includes("saas") || lowerInput.includes("software")) {
      industry = "SaaS/Software";
    }
    if (lowerInput.includes("cto") || lowerInput.includes("chief technology")) {
      jobTitle = "CTO";
    }
    if (lowerInput.includes("deutschland") || lowerInput.includes("germany")) {
      location = "Deutschland";
    }
    if (lowerInput.includes("startup")) {
      companySize = "1-50";
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
        title: "Konfiguration erforderlich",
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

      if (response.success) {
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: response.message,
          timestamp: new Date(),
          parameters: response.searchParameters
        };

        setMessages(prev => [...prev, agentMessage]);
        
        if (response.searchParameters) {
          onParametersGenerated(response.searchParameters);
        }
      } else {
        // Fallback to local processing if n8n fails
        console.log("n8n failed, using fallback logic");
        const parameters = generateSearchParameters(currentInput);
        
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: `Basierend auf Ihrer Anfrage habe ich folgende Suchparameter generiert (Fallback-Modus):

🎯 **Branche:** ${parameters.industry}
👔 **Position:** ${parameters.jobTitle}
📍 **Location:** ${parameters.location}
🏢 **Firmengröße:** ${parameters.companySize}

**Geschätzte Leads:** ~${parameters.estimatedLeads}

*Hinweis: n8n Agent nicht verfügbar, lokale Verarbeitung verwendet.*`,
          timestamp: new Date(),
          parameters
        };

        setMessages(prev => [...prev, agentMessage]);
        onParametersGenerated(parameters);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "error",
        content: "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Agent Chat</h2>
      
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
                : "bg-gray-200 text-gray-600"
            }`}>
              {message.type === "user" ? (
                <User className="w-4 h-4" />
              ) : message.type === "error" ? (
                <AlertCircle className="w-4 h-4" />
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
                  : "bg-gray-100 text-gray-900"
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
                    Parameter übernehmen
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
