
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from 'lucide-react';

interface BehaviorConfigurationProps {
  autoOpen: boolean;
  showTypingIndicator: boolean;
  allowFileUpload: boolean;
  onAutoOpenChange: (autoOpen: boolean) => void;
  onShowTypingIndicatorChange: (showTypingIndicator: boolean) => void;
  onAllowFileUploadChange: (allowFileUpload: boolean) => void;
}

export function BehaviorConfiguration({
  autoOpen,
  showTypingIndicator,
  allowFileUpload,
  onAutoOpenChange,
  onShowTypingIndicatorChange,
  onAllowFileUploadChange
}: BehaviorConfigurationProps) {
  return (
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
          <Switch checked={autoOpen} onCheckedChange={onAutoOpenChange} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Tipp-Indikator anzeigen</Label>
            <p className="text-sm text-gray-600">Zeigt "Bot tippt..." während der KI-Verarbeitung</p>
          </div>
          <Switch checked={showTypingIndicator} onCheckedChange={onShowTypingIndicatorChange} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Datei-Upload erlauben</Label>
            <p className="text-sm text-gray-600">Benutzer können Dateien an den Chat anhängen</p>
          </div>
          <Switch checked={allowFileUpload} onCheckedChange={onAllowFileUploadChange} />
        </div>
      </CardContent>
    </Card>
  );
}
