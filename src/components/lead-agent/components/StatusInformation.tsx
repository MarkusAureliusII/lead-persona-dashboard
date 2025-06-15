
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from 'lucide-react';

interface StatusInformationProps {
  isEnabled: boolean;
  webhookUrl: string;
  theme: string;
  position: string;
}

export function StatusInformation({
  isEnabled,
  webhookUrl,
  theme,
  position
}: StatusInformationProps) {
  return (
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
            <span className="text-sm font-medium">Embedded Chat URL:</span>
            <Badge variant={webhookUrl ? "default" : "secondary"}>
              {webhookUrl ? "Konfiguriert" : "Nicht konfiguriert"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme:</span>
            <Badge variant="outline">{theme}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Position:</span>
            <Badge variant="outline">{position}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
