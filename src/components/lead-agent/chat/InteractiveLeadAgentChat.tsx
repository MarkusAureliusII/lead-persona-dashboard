
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, ExternalLink } from "lucide-react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./useChatMessages";
import type { TargetAudience, SearchParameters } from "@/types/leadAgent";

interface InteractiveLeadAgentChatProps {
  webhookUrl: string; // embedUrl
  targetAudience: TargetAudience;
  onParametersGenerated: (parameters: SearchParameters) => void;
  showDebug?: boolean;
  onToggleDebug?: () => void;
}

export function InteractiveLeadAgentChat({
  webhookUrl,
  targetAudience,
  onParametersGenerated,
  showDebug = false,
  onToggleDebug,
}: InteractiveLeadAgentChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [reuseParams, setReuseParams] = useState<SearchParameters | null>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    mode,
  } = useChatMessages({
    webhookUrl,
    targetAudience,
    onParametersGenerated,
    showDebug,
  });

  // Handle submit (button or Enter key)
  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function handleParametersReuse(params: SearchParameters) {
    setReuseParams(params);
    // Compose a special message using reused params
    sendMessage(
      `Bitte generiere einen neuen Lead-Vorschlag mit folgenden Parametern:\nBranche: ${params.industry}\nPosition: ${params.jobTitle}\nStandort: ${params.location}\nFirmengröße: ${params.companySize}`
    );
  }

  return (
    <Card className="p-0 md:p-6">
      <div className="flex flex-col gap-2 h-[490px] md:h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-white/90 rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-900">🐱 Lead Agent Chat</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {mode === "embed" ? "Embed" : "Webhook"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showDebug ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onToggleDebug && onToggleDebug()}
              className="text-xs"
            >
              <Bug className="w-4 h-4 mr-1" />
              {showDebug ? "Debug: An" : "Debug: Aus"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(webhookUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Vollbild
            </Button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 px-4 overflow-y-auto">
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            onParametersReuse={handleParametersReuse}
          />
        </div>

        {/* Debug Mode */}
        {showDebug && (
          <div className="px-4 pb-2 rounded-b bg-gray-50 border-t text-xs text-gray-700">
            <div className="font-semibold">Debug Modus aktiviert</div>
            <div>
              <strong>Embed/Webhook URL:</strong> <span className="break-all">{webhookUrl}</span>
            </div>
            <div>
              <strong>Modus:</strong> {mode}
            </div>
            <div>
              <strong>Zielgruppe:</strong> {targetAudience.industry} – {targetAudience.jobTitle} ({targetAudience.companySize}) in {targetAudience.location}
            </div>
            <div>
              <strong>Gesehene Nachrichten:</strong> {messages.length}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !webhookUrl}
            placeholder="Ihre Nachricht an die Katze eingeben..."
          />
        </div>
      </div>
    </Card>
  );
}
