
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Settings, Bot, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { LeadAgentChat } from "./LeadAgentChat";
import { N8nChatWidget } from "./N8nChatWidget";
import { ChatSelector } from "./ChatSelector";
import { ApolloSearchPreview } from "./ApolloSearchPreview";
import { TargetAudience, SearchParameters, ChatMode } from "@/types/leadAgent";
import { useWebhookConfig } from "@/hooks/useWebhookConfig";
import { useN8nWidgetConfig } from "@/hooks/useN8nWidgetConfig";

export function SimplifiedLeadAgent() {
  const { webhookUrl } = useWebhookConfig();
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations
  } = useN8nWidgetConfig();

  const [chatMode, setChatMode] = useState<ChatMode>('custom');
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    industry: "Technologie",
    jobTitle: "CTO",
    location: "Deutschland",
    companySize: "50-200",
    estimatedLeads: 150
  });

  const [targetAudience] = useState<TargetAudience>({
    industry: "Technologie",
    companySize: "50-200",
    jobTitle: "CTO",
    location: "Deutschland"
  });

  const handleParametersGenerated = (parameters: SearchParameters) => {
    setSearchParameters(parameters);
  };

  const handleParametersReuse = (parameters: SearchParameters) => {
    setSearchParameters(parameters);
  };

  // Check if basic configuration is available
  const isBasicConfigAvailable = webhookUrl || (isWidgetEnabled && widgetUrl);

  if (!isBasicConfigAvailable) {
    return (
      <div className="space-y-6">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Bitte konfigurieren Sie zunächst Ihre n8n Integration in den Einstellungen.</span>
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Zu den Einstellungen
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🐱 Lead Agent</h1>
          <p className="text-gray-600">
            Vollständiger AI-gestützter Lead-Generierungs-Assistent mit Katzen-Power
          </p>
        </div>
        <Link to="/settings">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Konfiguration
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Section */}
        <div className="space-y-4">
          {/* Chat Mode Selection */}
          <ChatSelector
            chatMode={chatMode}
            onChatModeChange={setChatMode}
            isWidgetConfigured={isWidgetEnabled && !!widgetUrl}
          />

          {/* Conditional Chat Rendering */}
          {chatMode === 'custom' ? (
            <LeadAgentChat
              onParametersGenerated={handleParametersGenerated}
              targetAudience={targetAudience}
              webhookUrl={webhookUrl}
            />
          ) : (
            <N8nChatWidget
              widgetUrl={widgetUrl}
              customizations={customizations}
              onParametersGenerated={handleParametersGenerated}
            />
          )}
        </div>

        {/* Search Preview */}
        <div className="space-y-4">
          <ApolloSearchPreview
            searchParameters={searchParameters}
            onParametersReuse={handleParametersReuse}
          />
        </div>
      </div>
    </div>
  );
}
