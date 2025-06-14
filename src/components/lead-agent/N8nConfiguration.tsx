
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Settings, TestTube, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface N8nConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'warning' | 'error';

interface TestResult {
  status: ConnectionStatus;
  message: string;
  responseType?: string;
  details?: string;
}

export function N8nConfiguration({ webhookUrl, onWebhookUrlChange }: N8nConfigurationProps) {
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

  const testConnection = async () => {
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

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <TestTube className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <Card className={`p-6 transition-colors ${getStatusColor()}`}>
      <div className="flex items-center gap-2 mb-6">
        {getStatusIcon()}
        <h2 className="text-xl font-semibold text-gray-900">n8n Integration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="webhookUrl">n8n Webhook URL *</Label>
          <Input
            id="webhookUrl"
            placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            className="mt-1"
          />
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <p>Geben Sie die vollständige Webhook URL aus Ihrem n8n Workflow ein</p>
            <p>• Format: https://domain.com/webhook/webhook-id</p>
            <p>• Der Workflow sollte POST-Requests akzeptieren</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            disabled={!webhookUrl || connectionStatus === 'testing'}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {connectionStatus === 'testing' ? "Teste..." : "Verbindung testen"}
          </Button>
        </div>

        {testResult && (
          <div className={`p-4 rounded-lg border ${
            testResult.status === 'success' 
              ? 'bg-green-50 border-green-200'
              : testResult.status === 'warning'
              ? 'bg-yellow-50 border-yellow-200'
              : testResult.status === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {testResult.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : testResult.status === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                ) : testResult.status === 'error' ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Info className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${
                  testResult.status === 'success' 
                    ? 'text-green-800'
                    : testResult.status === 'warning'
                    ? 'text-yellow-800'
                    : testResult.status === 'error'
                    ? 'text-red-800'
                    : 'text-gray-800'
                }`}>
                  {testResult.message}
                  {testResult.responseType && (
                    <span className="ml-2 text-xs bg-white px-2 py-1 rounded border">
                      {testResult.responseType}
                    </span>
                  )}
                </p>
                {testResult.details && (
                  <p className={`text-sm mt-1 ${
                    testResult.status === 'success' 
                      ? 'text-green-700'
                      : testResult.status === 'warning'
                      ? 'text-yellow-700'
                      : testResult.status === 'error'
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {testResult.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            n8n Workflow Setup Empfehlungen:
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <h4 className="font-medium">🎯 Optimale Konfiguration:</h4>
              <ul className="mt-1 space-y-1">
                <li>• Webhook Trigger: Akzeptiert POST-Requests</li>
                <li>• Response Format: JSON mit "aiResponse" Feld</li>
                <li>• Optional: "searchParameters" Objekt für strukturierte Daten</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">✅ Unterstützte Response-Formate:</h4>
              <ul className="mt-1 space-y-1">
                <li>• JSON: <code>{`{"aiResponse": "Ihre AI-Antwort"}`}</code></li>
                <li>• Text: Einfache Textantworten werden auch verarbeitet</li>
                <li>• HTML: Wird erkannt, aber nicht empfohlen</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">🔧 Troubleshooting:</h4>
              <ul className="mt-1 space-y-1">
                <li>• Test-Payload wird mit 'test: true' Feld gesendet</li>
                <li>• Überprüfen Sie die Logs in n8n für Details</li>
                <li>• Stellen Sie sicher, dass der Workflow aktiviert ist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
