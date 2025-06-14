
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'warning' | 'error';

export interface TestResult {
  status: ConnectionStatus;
  message: string;
  responseType?: string;
  details?: string;
}

export function useN8nConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const validateWebhookUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const testConnection = async (webhookUrl: string) => {
    if (!webhookUrl) {
      toast({
        title: "❌ Fehler",
        description: "Bitte geben Sie zunächst eine Webhook URL ein",
        variant: "destructive",
      });
      return;
    }

    if (!validateWebhookUrl(webhookUrl)) {
      toast({
        title: "❌ Ungültige URL",
        description: "Bitte geben Sie eine gültige HTTP/HTTPS URL ein",
        variant: "destructive",
      });
      return;
    }

    setConnectionStatus('testing');
    setTestResult(null);
    const testId = `test_${Date.now()}`;
    
    try {
      console.log("🧪 Testing n8n webhook connection:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Test-Request": "true",
        },
        body: JSON.stringify({
          test: true,
          message: "n8n Verbindungstest vom Lead Agent",
          testId: testId,
          timestamp: new Date().toISOString(),
          targetAudience: {
            industry: "Test",
            companySize: "Test",
            jobTitle: "Test",
            location: "Test"
          }
        }),
      });

      console.log("🧪 Test response status:", response.status);
      console.log("🧪 Test response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        console.log("🧪 Content-Type:", contentType);

        let responseData: any;
        let responseType = 'unknown';
        
        try {
          if (contentType.includes('application/json')) {
            responseData = await response.json();
            responseType = 'JSON';
          } else if (contentType.includes('text/html')) {
            responseData = await response.text();
            responseType = 'HTML';
          } else {
            responseData = await response.text();
            responseType = 'Text';
          }
        } catch (parseError) {
          console.error("Parse error:", parseError);
          responseData = await response.text();
          responseType = 'Raw';
        }

        console.log("🧪 Test response data:", responseData);

        // Analyze the response
        if (responseType === 'JSON') {
          setConnectionStatus('success');
          setTestResult({
            status: 'success',
            message: 'Verbindung erfolgreich - JSON Response',
            responseType: 'JSON',
            details: 'Ihr n8n-Workflow gibt strukturierte JSON-Daten zurück. Perfekt für die AI-Integration!'
          });
          
          toast({
            title: "✅ Verbindung erfolgreich",
            description: "Die n8n Webhook Verbindung wurde erfolgreich getestet! JSON-Response erhalten.",
          });
        } else if (responseType === 'HTML') {
          setConnectionStatus('error');
          setTestResult({
            status: 'error',
            message: 'HTML-Seite statt API-Response',
            responseType: 'HTML',
            details: 'Die URL führt zu einer HTML-Seite. Bitte überprüfen Sie, ob Sie die richtige Webhook-URL verwenden.'
          });
          
          toast({
            title: "❌ Falsche URL",
            description: "Die URL führt zu einer HTML-Seite statt zu einem n8n-Webhook. Bitte überprüfen Sie die URL.",
            variant: "destructive",
          });
        } else if (responseType === 'Text') {
          const text = responseData.toString().trim();
          if (text === "Workflow was started" || text.includes("started")) {
            setConnectionStatus('warning');
            setTestResult({
              status: 'warning',
              message: 'Workflow gestartet - Keine AI-Response',
              responseType: 'Text',
              details: 'Der Workflow wurde gestartet, gibt aber keine AI-Antwort zurück. Für optimale Ergebnisse sollte Ihr Workflow eine JSON-Response mit einem "aiResponse" Feld zurückgeben.'
            });
            
            toast({
              title: "⚠️ Teilweise erfolgreich",
              description: "Workflow wurde gestartet, aber keine AI-Response erhalten. Überprüfen Sie Ihre Workflow-Konfiguration.",
            });
          } else {
            setConnectionStatus('success');
            setTestResult({
              status: 'success',
              message: 'Verbindung erfolgreich - Text Response',
              responseType: 'Text',
              details: `Text-Response erhalten: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`
            });
            
            toast({
              title: "✅ Verbindung erfolgreich",
              description: "Die n8n Webhook Verbindung funktioniert! Text-Response erhalten.",
            });
          }
        } else {
          setConnectionStatus('warning');
          setTestResult({
            status: 'warning',
            message: 'Unbekanntes Response-Format',
            responseType: responseType,
            details: 'Response erhalten, aber Format ist unbekannt.'
          });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("🧪 Connection test failed:", error);
      
      setConnectionStatus('error');
      setTestResult({
        status: 'error',
        message: 'Verbindung fehlgeschlagen',
        details: error instanceof Error ? error.message : "Unbekannter Fehler"
      });
      
      toast({
        title: "❌ Verbindung fehlgeschlagen",
        description: "Die n8n Webhook Verbindung konnte nicht hergestellt werden. Überprüfen Sie die URL und Ihren n8n Workflow.",
        variant: "destructive",
      });
    }
  };

  return {
    connectionStatus,
    testResult,
    testConnection
  };
}
