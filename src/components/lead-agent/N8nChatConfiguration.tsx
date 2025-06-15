
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Palette, Settings, Globe } from 'lucide-react';

interface N8nChatConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  isEnabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
    language: string;
    autoOpen: boolean;
    showTypingIndicator: boolean;
    allowFileUpload: boolean;
  };
  onCustomizationsChange: (customizations: any) => void;
}

export function N8nChatConfiguration({
  webhookUrl,
  onWebhookUrlChange,
  isEnabled,
  onEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nChatConfigurationProps) {
  
  const handleCustomizationChange = (key: string, value: any) => {
    onCustomizationsChange({
      ...customizations,
      [key]: value
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) return;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test-Nachricht vom Chat-Widget',
          type: 'test',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        alert('✅ Webhook-Test erfolgreich!');
      } else {
        alert('❌ Webhook-Test fehlgeschlagen');
      }
    } catch (error) {
      alert('❌ Webhook-Verbindung fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      {/* Grundkonfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Grundkonfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Chat-Widget aktivieren</Label>
              <p className="text-sm text-gray-600">Aktiviert das schwebende Chat-Widget</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={onEnabledChange} />
          </div>

          <div>
            <Label htmlFor="webhookUrl">N8N Webhook URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="webhookUrl"
                placeholder="https://your-n8n-instance.com/webhook/chat-webhook"
                value={webhookUrl}
                onChange={(e) => onWebhookUrlChange(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={testWebhook}
                disabled={!webhookUrl}
              >
                Test
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Die Webhook-URL Ihres N8N Chat-Workflows
            </p>
          </div>

          <div>
            <Label htmlFor="welcomeMessage">Willkommensnachricht</Label>
            <Textarea
              id="welcomeMessage"
              placeholder="Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?"
              value={customizations.welcomeMessage}
              onChange={(e) => handleCustomizationChange('welcomeMessage', e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Design & Darstellung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Design & Darstellung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Farbschema</Label>
              <Select 
                value={customizations.theme} 
                onValueChange={(value) => handleCustomizationChange('theme', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Hell</SelectItem>
                  <SelectItem value="dark">Dunkel</SelectItem>
                  <SelectItem value="auto">Automatisch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Position</Label>
              <Select 
                value={customizations.position} 
                onValueChange={(value) => handleCustomizationChange('position', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Unten rechts</SelectItem>
                  <SelectItem value="bottom-left">Unten links</SelectItem>
                  <SelectItem value="top-right">Oben rechts</SelectItem>
                  <SelectItem value="top-left">Oben links</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Sprache</Label>
            <Select 
              value={customizations.language} 
              onValueChange={(value) => handleCustomizationChange('language', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Erweiterte Einstellungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Verhalten & Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Automatisch öffnen</Label>
              <p className="text-sm text-gray-600">Chat automatisch beim Seitenaufruf öffnen</p>
            </div>
            <Switch 
              checked={customizations.autoOpen} 
              onCheckedChange={(checked) => handleCustomizationChange('autoOpen', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Tipp-Indikator anzeigen</Label>
              <p className="text-sm text-gray-600">Zeigt "Bot tippt..." während der KI-Verarbeitung</p>
            </div>
            <Switch 
              checked={customizations.showTypingIndicator} 
              onCheckedChange={(checked) => handleCustomizationChange('showTypingIndicator', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Datei-Upload erlauben</Label>
              <p className="text-sm text-gray-600">Benutzer können Dateien an den Chat anhängen</p>
            </div>
            <Switch 
              checked={customizations.allowFileUpload} 
              onCheckedChange={(checked) => handleCustomizationChange('allowFileUpload', checked)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Status & Informationen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Status & Informationen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Widget Status:</span>
              <Badge variant={isEnabled ? "default" : "secondary"}>
                {isEnabled ? "Aktiviert" : "Deaktiviert"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Webhook konfiguriert:</span>
              <Badge variant={webhookUrl ? "default" : "secondary"}>
                {webhookUrl ? "Ja" : "Nein"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme:</span>
              <Badge variant="outline">{customizations.theme}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Position:</span>
              <Badge variant="outline">{customizations.position}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
