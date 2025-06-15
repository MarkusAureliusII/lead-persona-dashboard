
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestTube, Bug, Activity, FileText } from "lucide-react";
import { useN8nConnectionTest } from "./hooks/useN8nConnectionTest";
import { N8nTestResult } from "./components/N8nTestResult";
import { N8nSetupRecommendations } from "./components/N8nSetupRecommendations";
import { N8nConfigurationGuide } from "./N8nConfigurationGuide";
import { N8nWorkflowDebugger } from "./components/N8nWorkflowDebugger";
import { N8nComprehensiveDiagnostics } from "./components/N8nComprehensiveDiagnostics";
import { N8nWorkflowTemplates } from "./components/N8nWorkflowTemplates";
import { getStatusIcon, getStatusColor } from "./utils/n8nStatusUtils";
import { useState } from "react";

interface N8nConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

export function N8nConfiguration({ webhookUrl, onWebhookUrlChange }: N8nConfigurationProps) {
  const { connectionStatus, testResult, testConnection } = useN8nConnectionTest();
  const [showDebugger, setShowDebugger] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTestConnection = () => {
    testConnection(webhookUrl);
  };

  return (
    <div className="space-y-6">
      <Card className={`p-6 transition-colors ${getStatusColor(connectionStatus)}`}>
        <div className="flex items-center gap-2 mb-6">
          {getStatusIcon(connectionStatus)}
          <h2 className="text-xl font-semibold text-gray-900">3. n8n Integration</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={!webhookUrl || connectionStatus === 'testing'}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {connectionStatus === 'testing' ? "Teste..." : "Schnelltest"}
            </Button>
            
            <Button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              variant="outline"
              size="sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              Volldiagnose
            </Button>

            <Button
              onClick={() => setShowDebugger(!showDebugger)}
              variant="outline"
              size="sm"
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </Button>

            <Button
              onClick={() => setShowTemplates(!showTemplates)}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Vorlagen
            </Button>
          </div>

          {testResult && <N8nTestResult testResult={testResult} />}

          <N8nSetupRecommendations />
        </div>
      </Card>

      {/* Enhanced Comprehensive Diagnostics */}
      <N8nComprehensiveDiagnostics
        webhookUrl={webhookUrl}
        isVisible={showDiagnostics}
        onToggleVisibility={() => setShowDiagnostics(!showDiagnostics)}
      />

      {/* Workflow Templates */}
      {showTemplates && <N8nWorkflowTemplates />}

      {/* Enhanced Workflow Debugger */}
      <N8nWorkflowDebugger
        webhookUrl={webhookUrl}
        isVisible={showDebugger}
        onToggleVisibility={() => setShowDebugger(!showDebugger)}
      />

      <N8nConfigurationGuide />
    </div>
  );
}
