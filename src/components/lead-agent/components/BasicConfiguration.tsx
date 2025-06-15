
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface BasicConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  isEnabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  welcomeMessage: string;
  onWelcomeMessageChange: (message: string) => void;
}

export function BasicConfiguration({
  webhookUrl,
  onWebhookUrlChange,
  isEnabled,
  onEnabledChange,
  welcomeMessage,
  onWelcomeMessageChange
}: BasicConfigurationProps) {
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
            <p className="text-sm text-gray-600">Aktiviert das eingebettete Chat-Widget</p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={onEnabledChange} />
        </div>

        <div>
          <Label htmlFor="webhookUrl">N8N Embedded Chat URL</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="webhookUrl"
              placeholder="https://n8n-selfhost-u40339.vm.elestio.app/webhook/your-chat-id"
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
            Die eingebettete Chat-URL Ihres N8N Workflows (Modus: Embedded Chat)
          </p>
        </div>

        <div>
          <Label htmlFor="welcomeMessage">Willkommensnachricht</Label>
          <Textarea
            id="welcomeMessage"
            placeholder="🐱 Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?"
            value={welcomeMessage}
            onChange={(e) => onWelcomeMessageChange(e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
