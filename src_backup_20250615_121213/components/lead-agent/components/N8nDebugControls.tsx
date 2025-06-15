
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw } from 'lucide-react';
import { DiagnosticResult } from '../hooks/useN8nDiagnostics';

interface N8nDebugControlsProps {
  webhookUrl: string;
  isDebugging: boolean;
  debugResults: DiagnosticResult[];
  onRunDiagnostics: () => void;
}

export function N8nDebugControls({ 
  webhookUrl, 
  isDebugging, 
  debugResults, 
  onRunDiagnostics 
}: N8nDebugControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onRunDiagnostics}
        disabled={isDebugging || !webhookUrl}
        size="sm"
      >
        {isDebugging ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Läuft...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Diagnose starten
          </>
        )}
      </Button>
      
      {debugResults.length > 0 && (
        <div className="flex gap-2">
          <Badge variant="outline">
            {debugResults.filter(r => r.status === 'success').length} ✓
          </Badge>
          <Badge variant="outline">
            {debugResults.filter(r => r.status === 'error').length} ✗
          </Badge>
          <Badge variant="outline">
            {debugResults.filter(r => r.status === 'warning').length} ⚠
          </Badge>
        </div>
      )}
    </div>
  );
}
