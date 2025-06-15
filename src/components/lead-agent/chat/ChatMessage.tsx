
import { Bot, User, AlertCircle, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchParameters } from "@/types/leadAgent";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "error" | "debug";
  content: string;
  timestamp: Date;
  parameters?: SearchParameters;
  debug?: any;
}

interface ChatMessageProps {
  message: ChatMessage;
  onParametersReuse: (parameters: SearchParameters) => void;
}

export function ChatMessage({ message, onParametersReuse }: ChatMessageProps) {
  const getMessageIcon = () => {
    switch (message.type) {
      case "user":
        return <User className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "debug":
        return <Bug className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageStyles = () => {
    const baseStyles = "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center";
    switch (message.type) {
      case "user":
        return `${baseStyles} bg-blue-600 text-white`;
      case "error":
        return `${baseStyles} bg-red-100 text-red-600`;
      case "debug":
        return `${baseStyles} bg-purple-100 text-purple-600`;
      default:
        return `${baseStyles} bg-green-100 text-green-600`;
    }
  };

  const getContentStyles = () => {
    const baseStyles = "inline-block p-3 rounded-lg max-w-xs lg:max-w-md";
    switch (message.type) {
      case "user":
        return `${baseStyles} bg-blue-600 text-white`;
      case "error":
        return `${baseStyles} bg-red-50 text-red-900 border border-red-200`;
      case "debug":
        return `${baseStyles} bg-purple-50 text-purple-900 border border-purple-200`;
      default:
        return `${baseStyles} bg-green-50 text-green-900 border border-green-200`;
    }
  };

  return (
    <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
      <div className={getMessageStyles()}>
        {getMessageIcon()}
      </div>
      
      <div className={`flex-1 ${message.type === "user" ? "text-right" : ""}`}>
        <div className={getContentStyles()}>
          <div className="whitespace-pre-line text-sm">{message.content}</div>
        </div>
        
        {message.parameters && (
          <div className="mt-2">
            <Button
              size="sm"
              onClick={() => onParametersReuse(message.parameters!)}
              className="text-xs"
            >
              Parameter erneut übernehmen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export type { ChatMessage };
