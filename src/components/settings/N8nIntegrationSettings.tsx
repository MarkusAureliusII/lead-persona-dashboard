
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Webhook, MessageSquare } from "lucide-react";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { N8nChatWidgetManager } from "@/components/lead-agent/N8nChatWidgetManager";
import { N8nChatWidgetConfig } from "@/components/lead-agent/N8nChatWidgetConfig";

interface N8nIntegrationSettingsProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
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
  webhookUrl,
  onWebhookUrlChange,
  isWidgetEnabled,
  widgetUrl,
  onWidgetUrlChange,
  onWidgetEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nIntegrationSettingsProps) {
  return (
    <div className="space-y-8">
      {/* n8n Integration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            n8n Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Konfigurieren Sie Ihre n8n Webhook-Integration für den AI Lead Agent
          </p>
          <N8nConfiguration
            webhookUrl={webhookUrl}
            onWebhookUrlChange={onWebhookUrlChange}
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
