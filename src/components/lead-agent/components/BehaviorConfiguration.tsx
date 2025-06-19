
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
        <CardTitle>Behavior & Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-open"
            checked={autoOpen}
            onCheckedChange={onAutoOpenChange}
          />
          <Label htmlFor="auto-open">Auto Open Chat</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="typing-indicator"
            checked={showTypingIndicator}
            onCheckedChange={onShowTypingIndicatorChange}
          />
          <Label htmlFor="typing-indicator">Show Typing Indicator</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="file-upload"
            checked={allowFileUpload}
            onCheckedChange={onAllowFileUploadChange}
          />
          <Label htmlFor="file-upload">Allow File Upload</Label>
        </div>
      </CardContent>
    </Card>
  );
}
