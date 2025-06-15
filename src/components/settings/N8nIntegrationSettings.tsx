
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Webhook, MessageSquare } from "lucide-react";
import { N8nEmbedConfiguration } from "@/components/lead-agent/N8nEmbedConfiguration";
import { N8nChatWidgetManager } from "@/components/lead-agent/N8nChatWidgetManager";
import { N8nChatWidgetConfig } from "@/components/lead-agent/N8nChatWidgetConfig";

interface N8nIntegrationSettingsProps {
  embedUrl: string;
  onEmbedUrlChange: (url: string) => void;
  isWidgetEnabled: boolean;
  widgetUrl: string;
  onWidgetUrlChange: (url: string) => void;
  onWidgetEnabledChange: (enabled: boolean) => void;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
  };
  onCustomizationsChange: (customizations: any) => void;
}

export function N8nIntegrationSettings({
  embedUrl,
  onEmbedUrlChange,
  isWidgetEnabled,
  widgetUrl,
  onWidgetUrlChange,
  onWidgetEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nIntegrationSettingsProps) {
  return (
    <div className="space-y-8">
      {/* n8n Embed Integration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            n8n Embed Chat Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Konfigurieren Sie Ihre n8n Embed Chat URL für den AI Lead Agent (neues eingebettetes System)
          </p>
          <N8nEmbedConfiguration
            embedUrl={embedUrl}
            onEmbedUrlChange={onEmbedUrlChange}
          />
        </CardContent>
      </Card>

      {/* Erweiterte n8n Chat Widget Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Erweiterte Chat Widget Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Vollständige Konfiguration des @n8n/chat Widgets mit erweiterten Features
          </p>
          <N8nChatWidgetManager showConfiguration={true} />
        </CardContent>
      </Card>

      {/* Legacy n8n Chat Widget Configuration */}
      <N8nChatWidgetConfig
        widgetUrl={widgetUrl}
        onWidgetUrlChange={onWidgetUrlChange}
        isEnabled={isWidgetEnabled}
        onEnabledChange={onWidgetEnabledChange}
        customizations={customizations}
        onCustomizationsChange={onCustomizationsChange}
      />
    </div>
  );
}
