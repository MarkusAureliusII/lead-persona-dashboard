
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Bug } from 'lucide-react';
import { DiagnosticResult } from '../hooks/useN8nDiagnostics';

interface N8nDiagnosticResultProps {
  result: DiagnosticResult;
}

export function N8nDiagnosticResult({ result }: N8nDiagnosticResultProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Bug className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-green-100 text-green-800">Erfolgreich</Badge>;
      case 'error': return <Badge variant="destructive">Fehler</Badge>;
      case 'warning': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warnung</Badge>;
      default: return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(result.status)}
          <span className="font-medium text-sm">{result.test}</span>
        </div>
        {getStatusBadge(result.status)}
      </div>
      
      <p className="text-sm text-gray-600">{result.message}</p>
      
      {result.details && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            Details anzeigen
          </summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
            {result.details}
          </pre>
        </details>
      )}
    </div>
  );
}
