
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, MessageSquare, Palette } from 'lucide-react';

interface N8nEnhancedChatConfigurationProps {
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

export function N8nEnhancedChatConfiguration({
  webhookUrl,
  onWebhookUrlChange,
  isEnabled,
  onEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nEnhancedChatConfigurationProps) {
  
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
          chatInput: 'Test-Nachricht vom Enhanced Chat Widget',
          type: 'test',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        alert('✅ Enhanced Chat Webhook-Test erfolgreich!');
      } else {
        alert('❌ Enhanced Chat Webhook-Test fehlgeschlagen');
      }
    } catch (error) {
      alert('❌ Enhanced Chat Webhook-Verbindung fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      {/* Grundkonfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Enhanced Chat Grundkonfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enhanced Chat-Widget aktivieren</Label>
              <p className="text-sm text-gray-600">Verwendet createChat() für optimale Integration</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={onEnabledChange} />
          </div>

          <div>
            <Label htmlFor="webhookUrl">N8N Chat Webhook URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="webhookUrl"
                placeholder="https://your-n8n.com/webhook/chat-trigger-id"
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
              Die Chat-Trigger Webhook URL aus Ihrem N8N Workflow
            </p>
          </div>

          <div>
            <Label htmlFor="welcomeMessage">Willkommensnachricht</Label>
            <Textarea
              id="welcomeMessage"
              placeholder="🐱 Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?"
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
          <div>
            <Label htmlFor="theme">Farbschema</Label>
            <Select value={customizations.theme} onValueChange={(value) => handleCustomizationChange('theme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Farbschema auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Hell</SelectItem>
                <SelectItem value="dark">Dunkel</SelectItem>
                <SelectItem value="auto">Automatisch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Sprache</Label>
            <Select value={customizations.language} onValueChange={(value) => handleCustomizationChange('language', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sprache auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Select value={customizations.position} onValueChange={(value) => handleCustomizationChange('position', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Position auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Unten rechts</SelectItem>
                <SelectItem value="bottom-left">Unten links</SelectItem>
                <SelectItem value="top-right">Oben rechts</SelectItem>
                <SelectItem value="top-left">Oben links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Verhalten & Features */}
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
              <Label>Chat automatisch öffnen</Label>
              <p className="text-sm text-gray-600">Öffnet das Chat-Widget beim Laden der Seite</p>
            </div>
            <Switch 
              checked={customizations.autoOpen} 
              onCheckedChange={(checked) => handleCustomizationChange('autoOpen', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Tipp-Indikator anzeigen</Label>
              <p className="text-sm text-gray-600">Zeigt an, wenn der Bot tippt</p>
            </div>
            <Switch 
              checked={customizations.showTypingIndicator} 
              onCheckedChange={(checked) => handleCustomizationChange('showTypingIndicator', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Datei-Upload erlauben</Label>
              <p className="text-sm text-gray-600">Ermöglicht das Hochladen von Dateien</p>
            </div>
            <Switch 
              checked={customizations.allowFileUpload} 
              onCheckedChange={(checked) => handleCustomizationChange('allowFileUpload', checked)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Status-Information */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Widget Status:</span>
              <span className={isEnabled ? "text-green-600" : "text-gray-400"}>
                {isEnabled ? "Aktiviert" : "Deaktiviert"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Webhook konfiguriert:</span>
              <span className={webhookUrl ? "text-green-600" : "text-red-600"}>
                {webhookUrl ? "Ja" : "Nein"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Theme:</span>
              <span className="text-gray-900 capitalize">{customizations.theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Position:</span>
              <span className="text-gray-900">{customizations.position}</span>
            </div>
          </div>
          
          {isEnabled && webhookUrl && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Enhanced Chat Widget ist bereit für die Verwendung mit createChat()!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
