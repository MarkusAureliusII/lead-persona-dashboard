
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'warning' | 'error';

export interface TestResult {
  status: ConnectionStatus;
  message: string;
  responseType?: string;
  details?: string;
  httpStatus?: number;
  errorCode?: string;
  timestamp?: string;
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
    const timestamp = new Date().toISOString();
    
    try {
      console.log("🧪 Starting enhanced n8n webhook connection test:", webhookUrl);
      
      // Create test payload with proper structure
      const testPayload = {
        test: true,
        message: "Enhanced n8n Verbindungstest vom Lead Agent",
        testId: testId,
        timestamp: timestamp,
        userAgent: navigator.userAgent,
        origin: window.location.origin,
        targetAudience: {
          industry: "Test-Branche",
          companySize: "Test-Unternehmensgröße",
          jobTitle: "Test-Position",
          location: "Test-Standort"
        },
        metadata: {
          source: "lead-agent-test",
          version: "2.0.0",
          capabilities: ["json", "text", "error-handling"]
        }
      };

      console.log("🧪 Test payload:", testPayload);
      
      // Enhanced fetch with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Test-Request": "true",
          "X-Test-ID": testId,
          "User-Agent": "LeadAgent-Test/2.0.0"
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("🧪 Enhanced test response status:", response.status);
      console.log("🧪 Enhanced test response headers:", Object.fromEntries(response.headers.entries()));

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
          console.error("🧪 Parse error:", parseError);
          responseData = await response.text();
          responseType = 'Raw';
        }

        console.log("🧪 Enhanced test response data:", responseData);

        // Enhanced success handling
        const result: TestResult = {
          status: 'success',
          message: `Verbindung erfolgreich - ${responseType} Response`,
          responseType: responseType,
          httpStatus: response.status,
          timestamp: timestamp,
          details: responseType === 'JSON' 
            ? `JSON-Response erhalten. Workflow ist bereit für AI-Integration!` 
            : `Text-Response: "${responseData.toString().substring(0, 100)}${responseData.toString().length > 100 ? '...' : ''}"`
        };

        setConnectionStatus('success');
        setTestResult(result);
        
        toast({
          title: "✅ Verbindung erfolgreich",
          description: `N8N Webhook funktioniert! ${responseType}-Response erhalten.`,
        });

      } else {
        // Enhanced error handling for non-200 responses
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorDetails += ` - ${errorText.substring(0, 200)}`;
          }
        } catch (e) {
          console.warn("Could not read error response body:", e);
        }

        throw new Error(errorDetails);
      }

    } catch (error) {
      console.error("🧪 Enhanced connection test failed:", error);
      
      let errorMessage = "Unbekannter Fehler";
      let errorCode = "UNKNOWN_ERROR";

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Verbindung timeout (15s überschritten)";
          errorCode = "TIMEOUT_ERROR";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Netzwerkfehler - Server nicht erreichbar";
          errorCode = "NETWORK_ERROR";
        } else if (error.message.includes('CORS')) {
          errorMessage = "CORS-Fehler - Webhook-Konfiguration prüfen";
          errorCode = "CORS_ERROR";
        } else {
          errorMessage = error.message;
          errorCode = "HTTP_ERROR";
        }
      }
      
      const result: TestResult = {
        status: 'error',
        message: 'Verbindung fehlgeschlagen',
        details: errorMessage,
        errorCode: errorCode,
        timestamp: timestamp
      };

      setConnectionStatus('error');
      setTestResult(result);
      
      toast({
        title: "❌ Verbindung fehlgeschlagen",
        description: `${errorMessage}. Überprüfen Sie die URL und N8N Workflow-Konfiguration.`,
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
