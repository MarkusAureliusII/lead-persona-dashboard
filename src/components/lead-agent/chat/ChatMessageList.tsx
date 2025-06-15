
import { Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SearchParameters } from "@/types/leadAgent";
import { ChatMessage as ChatMessageType } from "./ChatMessage";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onParametersReuse: (parameters: SearchParameters) => void;
}

export function ChatMessageList({ messages, isLoading, onParametersReuse }: ChatMessageListProps) {
  return (
    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onParametersReuse={onParametersReuse}
        />
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
  );
}
