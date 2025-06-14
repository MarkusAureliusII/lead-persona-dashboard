
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Settings, TestTube, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface N8nConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

export function N8nConfiguration({ webhookUrl, onWebhookUrlChange }: N8nConfigurationProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [lastTestResult, setLastTestResult] = useState<string>("");
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
        const data = await response.json();
        console.log("🧪 Test response data:", data);
        
        setConnectionStatus('success');
        setLastTestResult(`Verbindung erfolgreich (${response.status})`);
        
        toast({
          title: "✅ Verbindung erfolgreich",
          description: "Die n8n Webhook Verbindung wurde erfolgreich getestet!",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("🧪 Connection test failed:", error);
      
      setConnectionStatus('error');
      setLastTestResult(error instanceof Error ? error.message : "Unbekannter Fehler");
      
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

        {lastTestResult && (
          <div className={`p-3 rounded-lg text-sm ${
            connectionStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : connectionStatus === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              {connectionStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : connectionStatus === 'error' ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">Letzter Test:</span>
              <span>{lastTestResult}</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 n8n Workflow Setup Tipps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Webhook Trigger: Akzeptiert POST-Requests</li>
            <li>• Response Format: Sollte 'aiResponse' oder 'response' Feld enthalten</li>
            <li>• Optional: 'searchParameters' Objekt für strukturierte Daten</li>
            <li>• Test Payload wird mit 'test: true' Feld gesendet</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
