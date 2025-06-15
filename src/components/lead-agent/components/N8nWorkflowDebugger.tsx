
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Code,
  Network,
  Server
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const [debugResults, setDebugResults] = useState<any[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    if (!webhookUrl) {
      toast({
        title: "⚠️ Keine URL",
        description: "Bitte geben Sie eine Webhook URL ein",
        variant: "destructive",
      });
      return;
    }

    setIsDebugging(true);
    setDebugResults([]);
    const results: any[] = [];

    // Test 1: Basic connectivity
    try {
      console.log("🔍 Running basic connectivity test...");
      const startTime = Date.now();
      
      const response = await fetch(webhookUrl, {
        method: 'HEAD', // Just check if server responds
        mode: 'no-cors'
      });
      
      const endTime = Date.now();
      results.push({
        test: 'Basic Connectivity',
        status: 'success',
        message: `Server erreichbar (${endTime - startTime}ms)`,
        details: 'HEAD request successful'
      });
    } catch (error) {
      results.push({
        test: 'Basic Connectivity',
        status: 'error',
        message: 'Server nicht erreichbar',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: OPTIONS preflight check
    try {
      console.log("🔍 Running CORS preflight test...");
      const response = await fetch(webhookUrl, {
        method: 'OPTIONS'
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      };

      results.push({
        test: 'CORS Configuration',
        status: corsHeaders['Access-Control-Allow-Origin'] ? 'success' : 'warning',
        message: corsHeaders['Access-Control-Allow-Origin'] ? 'CORS konfiguriert' : 'CORS möglicherweise nicht konfiguriert',
        details: JSON.stringify(corsHeaders, null, 2)
      });
    } catch (error) {
      results.push({
        test: 'CORS Configuration',
        status: 'warning',
        message: 'CORS Test fehlgeschlagen',
        details: 'Möglicherweise blockiert - normal für einige N8N Konfigurationen'
      });
    }

    // Test 3: POST request with test data
    try {
      console.log("🔍 Running POST request test...");
      const testPayload = {
        debugTest: true,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'n8n-workflow-debugger'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      const responseText = await response.text();
      
      results.push({
        test: 'POST Request',
        status: response.ok ? 'success' : 'error',
        message: `HTTP ${response.status} - ${response.statusText}`,
        details: `Response: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`
      });
    } catch (error) {
      results.push({
        test: 'POST Request',
        status: 'error',
        message: 'POST Request fehlgeschlagen',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: URL format validation
    try {
      const url = new URL(webhookUrl);
      const isN8nFormat = url.pathname.includes('/webhook/') || url.hostname.includes('n8n');
      
      results.push({
        test: 'URL Format',
        status: isN8nFormat ? 'success' : 'warning',
        message: isN8nFormat ? 'N8N Webhook Format erkannt' : 'Unbekanntes URL Format',
        details: `Host: ${url.hostname}, Path: ${url.pathname}`
      });
    } catch (error) {
      results.push({
        test: 'URL Format',
        status: 'error',
        message: 'Ungültige URL',
        details: error instanceof Error ? error.message : 'Invalid URL format'
      });
    }

    setDebugResults(results);
    setIsDebugging(false);

    // Show summary toast
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    toast({
      title: "🔍 Diagnose abgeschlossen",
      description: `${successCount} erfolgreich, ${errorCount} Fehler`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

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
        <div className="flex items-center gap-2">
          <Button 
            onClick={runDiagnostics}
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

        {debugResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Diagnose Ergebnisse:</h4>
            {debugResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
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
            ))}
          </div>
        )}

        {!webhookUrl && (
          <div className="text-center py-8 text-gray-500">
            <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Webhook URL erforderlich für Diagnose</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
