
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export function useN8nDiagnostics() {
  const [debugResults, setDebugResults] = useState<DiagnosticResult[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async (webhookUrl: string) => {
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
    const results: DiagnosticResult[] = [];

    // Test 1: Basic connectivity
    try {
      console.log("🔍 Running basic connectivity test...");
      const startTime = Date.now();
      
      const response = await fetch(webhookUrl, {
        method: 'HEAD',
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

  return {
    debugResults,
    isDebugging,
    runDiagnostics
  };
}
