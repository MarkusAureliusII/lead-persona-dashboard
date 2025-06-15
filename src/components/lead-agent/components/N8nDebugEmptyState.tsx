
import React from 'react';
import { Server } from 'lucide-react';

interface N8nDebugEmptyStateProps {
  webhookUrl: string;
}

export function N8nDebugEmptyState({ webhookUrl }: N8nDebugEmptyStateProps) {
  if (webhookUrl) return null;

  return (
    <div className="text-center py-8 text-gray-500">
      <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">Webhook URL erforderlich für Diagnose</p>
    </div>
  );
}
