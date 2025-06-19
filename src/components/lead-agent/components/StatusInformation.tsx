
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
  const getStatusIcon = () => {
    if (!isEnabled) return <XCircle className="w-4 h-4 text-red-500" />;
    if (!webhookUrl) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isEnabled) return "Disabled";
    if (!webhookUrl) return "Configuration Required";
    return "Active";
  };

  const getStatusColor = () => {
    if (!isEnabled) return "destructive";
    if (!webhookUrl) return "secondary";
    return "default";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status & Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div>Theme: <span className="font-medium">{theme}</span></div>
          <div>Position: <span className="font-medium">{position}</span></div>
          {webhookUrl && (
            <div>Webhook: <span className="font-medium">Configured</span></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
