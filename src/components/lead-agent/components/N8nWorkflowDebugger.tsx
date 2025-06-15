
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug } from 'lucide-react';
import { useN8nDiagnostics } from '../hooks/useN8nDiagnostics';
import { N8nDebugControls } from './N8nDebugControls';
import { N8nDiagnosticResult } from './N8nDiagnosticResult';
import { N8nDebugEmptyState } from './N8nDebugEmptyState';

interface N8nWorkflowDebuggerProps {
  webhookUrl: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function N8nWorkflowDebugger({ 
  webhookUrl, 
  isVisible, 
  onToggleVisibility 
}: N8nWorkflowDebuggerProps) {
  const { debugResults, isDebugging, runDiagnostics } = useN8nDiagnostics();

  const handleRunDiagnostics = () => {
    runDiagnostics(webhookUrl);
  };

  if (!isVisible) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            🐱 N8N Workflow Debugger
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleVisibility}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <N8nDebugControls
          webhookUrl={webhookUrl}
          isDebugging={isDebugging}
          debugResults={debugResults}
          onRunDiagnostics={handleRunDiagnostics}
        />

        {debugResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Diagnose Ergebnisse:</h4>
            {debugResults.map((result, index) => (
              <N8nDiagnosticResult key={index} result={result} />
            ))}
          </div>
        )}

        <N8nDebugEmptyState webhookUrl={webhookUrl} />
      </CardContent>
    </Card>
  );
}
