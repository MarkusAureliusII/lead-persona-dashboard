
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, ExternalLink } from "lucide-react";
import { useState } from "react";

interface N8nChatWidgetConfigProps {
  widgetUrl: string;
  onWidgetUrlChange: (url: string) => void;
  isEnabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
  };
  onCustomizationsChange: (customizations: any) => void;
}

export function N8nChatWidgetConfig({
  widgetUrl,
  onWidgetUrlChange,
  isEnabled,
  onEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nChatWidgetConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCustomizationChange = (key: string, value: string) => {
    onCustomizationsChange({
      ...customizations,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          n8n Chat Widget
        </CardTitle>
        <CardDescription>
          Konfigurieren Sie das n8n Chat Widget als Alternative zum benutzerdefinierten Chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="widget-enabled">n8n Chat Widget aktivieren</Label>
            <p className="text-xs text-gray-500">Verwende das n8n Widget anstelle des benutzerdefinierten Chats</p>
          </div>
          <Switch
            id="widget-enabled"
            checked={isEnabled}
            onCheckedChange={onEnabledChange}
          />
        </div>

        {isEnabled && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="widget-url">Widget URL *</Label>
              <Input
                id="widget-url"
                placeholder="https://your-n8n-instance.com/widget/your-widget-id"
                value={widgetUrl}
                onChange={(e) => onWidgetUrlChange(e.target.value)}
                className="mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                <p>Die vollständige URL zu Ihrem n8n Chat Widget</p>
              </div>
            </div>

            <div>
              <Label htmlFor="welcome-message">Willkommensnachricht</Label>
              <Input
                id="welcome-message"
                placeholder="Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?"
                value={customizations.welcomeMessage}
                onChange={(e) => handleCustomizationChange('welcomeMessage', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Erweiterte Einstellungen</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="w-4 h-4 mr-1" />
                {showAdvanced ? 'Weniger' : 'Mehr'}
              </Button>
            </div>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="widget-theme">Theme</Label>
                  <select
                    id="widget-theme"
                    value={customizations.theme}
                    onChange={(e) => handleCustomizationChange('theme', e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="light">Hell</option>
                    <option value="dark">Dunkel</option>
                    <option value="auto">Automatisch</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="widget-position">Position</Label>
                  <select
                    id="widget-position"
                    value={customizations.position}
                    onChange={(e) => handleCustomizationChange('position', e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="bottom-right">Unten rechts</option>
                    <option value="bottom-left">Unten links</option>
                    <option value="top-right">Oben rechts</option>
                    <option value="top-left">Oben links</option>
                  </select>
                </div>
              </div>
            )}

            {widgetUrl && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(widgetUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Widget in neuem Tab öffnen
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
