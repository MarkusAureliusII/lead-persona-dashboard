
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            placeholder="Enter your n8n webhook URL"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="chat-enabled"
            checked={isEnabled}
            onCheckedChange={onEnabledChange}
          />
          <Label htmlFor="chat-enabled">Enable Chat Widget</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="welcome-message">Welcome Message</Label>
          <Textarea
            id="welcome-message"
            value={welcomeMessage}
            onChange={(e) => onWelcomeMessageChange(e.target.value)}
            placeholder="Enter welcome message"
          />
        </div>
      </CardContent>
    </Card>
  );
}
