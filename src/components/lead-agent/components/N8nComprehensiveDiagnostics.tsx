
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Globe,
  Shield,
  Server,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedN8nService, N8nDiagnosticResult, N8nWebhookTest } from '../../../services/n8n/EnhancedN8nService';

interface N8nComprehensiveDiagnosticsProps {
  webhookUrl: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function N8nComprehensiveDiagnostics({ 
  webhookUrl, 
  isVisible, 
  onToggleVisibility 
}: N8nComprehensiveDiagnosticsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosticResult, setDiagnosticResult] = useState<N8nDiagnosticResult | null>(null);
  const [testHistory, setTestHistory] = useState<N8nWebhookTest[]>([]);
  const [showDetails, setShowDetails] = useState(false);
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

    setIsRunning(true);
    setProgress(0);
    setDiagnosticResult(null);

    try {
      const service = new EnhancedN8nService(webhookUrl);
      
      // Simulate progress updates
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(75);
      const result = await service.runComprehensiveDiagnostics();
      
      setProgress(100);
      setDiagnosticResult(result);
      setTestHistory(service.getTestHistory());

      // Show result toast
      const statusEmoji = result.overall === 'healthy' ? '✅' : 
                         result.overall === 'degraded' ? '⚠️' : '❌';
      
      toast({
        title: `${statusEmoji} Diagnose abgeschlossen`,
        description: `Status: ${result.overall}`,
        variant: result.overall === 'critical' ? "destructive" : "default",
      });

    } catch (error) {
      console.error('Diagnostic error:', error);
      toast({
        title: "❌ Diagnose fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const exportResults = () => {
    if (!diagnosticResult) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      webhookUrl: webhookUrl,
      diagnosticResult: diagnosticResult,
      testHistory: testHistory
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTestIcon = (testKey: string) => {
    switch (testKey) {
      case 'connectivity': return <Globe className="w-4 h-4" />;
      case 'cors': return <Shield className="w-4 h-4" />;
      case 'postRequest': return <Server className="w-4 h-4" />;
      case 'urlValidation': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 border-green-300';
      case 'degraded': return 'bg-yellow-100 border-yellow-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        onClick={onToggleVisibility}
        className="flex items-center gap-2"
      >
        <Activity className="w-4 h-4" />
        Erweiterte Diagnose
        <Eye className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className={`${diagnosticResult ? getOverallStatusColor(diagnosticResult.overall) : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            🔬 N8N Umfassende Diagnose
          </CardTitle>
          <div className="flex gap-2">
            {diagnosticResult && (
              <Button variant="ghost" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggleVisibility}>
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">Führe umfassende Tests durch...</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostics}
            disabled={isRunning || !webhookUrl}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Läuft...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Vollständige Diagnose starten
              </>
            )}
          </Button>
          
          {diagnosticResult && (
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Weniger' : 'Details'}
            </Button>
          )}
        </div>

        {diagnosticResult && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  diagnosticResult.overall === 'healthy' ? 'bg-green-100' :
                  diagnosticResult.overall === 'degraded' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  {diagnosticResult.overall === 'healthy' ? 
                    <CheckCircle className="w-5 h-5 text-green-600" /> :
                    diagnosticResult.overall === 'degraded' ?
                    <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                    <XCircle className="w-5 h-5 text-red-600" />
                  }
                </div>
                <div>
                  <h3 className="font-semibold">Gesamtstatus</h3>
                  <p className="text-sm text-gray-600 capitalize">{diagnosticResult.overall}</p>
                </div>
              </div>
              <Badge variant={
                diagnosticResult.overall === 'healthy' ? 'default' :
                diagnosticResult.overall === 'degraded' ? 'secondary' :
                'destructive'
              }>
                {diagnosticResult.overall}
              </Badge>
            </div>

            {/* Test Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(diagnosticResult).map(([key, result]) => {
                if (key === 'overall' || key === 'recommendations' || typeof result !== 'object') return null;
                
                return (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTestIcon(key)}
                        <span className="font-medium text-sm">
                          {key === 'connectivity' ? 'Konnektivität' :
                           key === 'cors' ? 'CORS-Konfiguration' :
                           key === 'postRequest' ? 'POST-Anfrage' :
                           key === 'urlValidation' ? 'URL-Validierung' : key}
                        </span>
                      </div>
                      {getStatusIcon(result.status)}
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      {result.responseTime && (
                        <p>⏱️ {Math.round(result.responseTime)}ms</p>
                      )}
                      {result.httpStatus && (
                        <p>📊 HTTP {result.httpStatus}</p>
                      )}
                      {result.errorMessage && (
                        <p className="text-red-600">❌ {result.errorMessage}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {diagnosticResult.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📋 Empfehlungen:</h4>
                <ul className="space-y-1">
                  {diagnosticResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Results */}
            {showDetails && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">🔍 Detaillierte Testergebnisse:</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {testHistory.map((test, index) => (
                    <details key={index} className="border rounded p-2">
                      <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        {test.id} - {new Date(test.timestamp).toLocaleTimeString()}
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test, null, 2)}
                      </pre>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!diagnosticResult && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Klicken Sie auf "Vollständige Diagnose starten" für eine umfassende Analyse</p>
            <p className="text-xs mt-1">Tests: Konnektivität, CORS, POST-Anfragen, URL-Validierung</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
