
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

        // Vereinfachte Logik - jede erfolgreiche Response ist gut
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
        } else {
          // Alle Text-Responses als Erfolg behandeln
          const text = responseData.toString().trim();
          setConnectionStatus('success');
          setTestResult({
            status: 'success',
            message: 'Verbindung erfolgreich - Text Response',
            responseType: 'Text',
            details: `Text-Response erhalten: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`
          });
          
          toast({
            title: "✅ Verbindung erfolgreich",
            description: "Die n8n Webhook Verbindung funktioniert! Response erhalten.",
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
