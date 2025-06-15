
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { TargetAudience, SearchParameters } from "@/types/leadAgent";
import { InteractiveLeadAgentChat } from "./chat/InteractiveLeadAgentChat";

interface LeadAgentChatProps {
  onParametersGenerated: (parameters: SearchParameters) => void;
  targetAudience: TargetAudience;
  embedUrl?: string;
}

export function LeadAgentChat({ onParametersGenerated, targetAudience, embedUrl }: LeadAgentChatProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (!embedUrl) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Lead Agent Chat</h2>
          <div className="flex items-center text-orange-600">
            <Settings className="w-4 h-4 mr-1" />
            <span className="text-xs">Embed URL erforderlich</span>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">🐱 Embed URL erforderlich</h3>
          <p className="text-gray-600 text-sm mb-4">
            Bitte konfigurieren Sie zunächst die n8n Embed Chat URL in den Einstellungen für Katzen-Power! 🚀
          </p>
          <p className="text-xs text-gray-500">
            Das System verwendet jetzt ein eingebettetes Chat-Widget anstelle von Webhook-Aufrufen
          </p>
        </div>
      </Card>
    );
  }

  // Always interactive chat now, never the raw iframe!
  return (
    <InteractiveLeadAgentChat
      webhookUrl={embedUrl}
      targetAudience={targetAudience}
      onParametersGenerated={onParametersGenerated}
      showDebug={showDebug}
      onToggleDebug={() => setShowDebug((b) => !b)}
    />
  );
}
