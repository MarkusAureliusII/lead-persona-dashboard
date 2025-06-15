
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, Settings } from "lucide-react";
import { useState } from "react";
import { TargetAudience, SearchParameters } from "@/types/leadAgent";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { useChatMessages } from "./chat/useChatMessages";

interface LeadAgentChatProps {
  onParametersGenerated: (parameters: SearchParameters) => void;
  targetAudience: TargetAudience;
  webhookUrl?: string;
}

export function LeadAgentChat({ onParametersGenerated, targetAudience, webhookUrl }: LeadAgentChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  
  const { messages, isLoading, sendMessage } = useChatMessages({
    webhookUrl,
    targetAudience,
    onParametersGenerated,
    showDebug
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const currentInput = inputValue;
    setInputValue("");
    await sendMessage(currentInput);
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
      
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onParametersReuse={onParametersGenerated}
      />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        disabled={isLoading || !webhookUrl}
        placeholder={webhookUrl ? "z.B. 'Suche CTOs von SaaS Unternehmen in Deutschland'" : "Konfigurieren Sie zunächst die n8n Webhook URL"}
      />
    </Card>
  );
}
