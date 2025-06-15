
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  MessageSquare, 
  Webhook, 
  Activity, 
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { N8nConfiguration } from './N8nConfiguration';
import { N8nChatConfiguration } from './N8nChatConfiguration';
import { N8nWorkflowTemplates } from './components/N8nWorkflowTemplates';
import { N8nComprehensiveDiagnostics } from './components/N8nComprehensiveDiagnostics';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';
import { useN8nEnhancedWidgetConfig } from '@/hooks/useN8nEnhancedWidgetConfig';

export function N8nUnifiedConfigurationManager() {
  const [activeTab, setActiveTab] = useState('webhook');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const { webhookUrl, handleWebhookUrlChange } = useWebhookConfig();
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange
  } = useN8nEnhancedWidgetConfig();

  const getConfigurationStatus = () => {
    const webhookConfigured = !!webhookUrl;
    const chatConfigured = isWidgetEnabled && !!widgetUrl;
    
    if (webhookConfigured && chatConfigured) {
      return { status: 'complete', color: 'text-green-600', icon: CheckCircle };
    } else if (webhookConfigured || chatConfigured) {
      return { status: 'partial', color: 'text-yellow-600', icon: AlertCircle };
    } else {
      return { status: 'none', color: 'text-gray-600', icon: Info };
    }
  };

  const configStatus = getConfigurationStatus();
  const StatusIcon = configStatus.icon;

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              🚀 N8N Unified Configuration Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${configStatus.color}`} />
              <Badge variant={
                configStatus.status === 'complete' ? 'default' :
                configStatus.status === 'partial' ? 'secondary' : 'outline'
              }>
                {configStatus.status === 'complete' ? 'Vollständig konfiguriert' :
                 configStatus.status === 'partial' ? 'Teilweise konfiguriert' : 'Nicht konfiguriert'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Webhook className={`w-5 h-5 ${webhookUrl ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium text-sm">Webhook Integration</p>
                <p className="text-xs text-gray-600">
                  {webhookUrl ? 'Konfiguriert' : 'Nicht konfiguriert'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MessageSquare className={`w-5 h-5 ${isWidgetEnabled && widgetUrl ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium text-sm">Chat Widget</p>
                <p className="text-xs text-gray-600">
                  {isWidgetEnabled && widgetUrl ? 'Aktiviert' : 'Deaktiviert'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Diagnose-Tools</p>
                <p className="text-xs text-gray-600">Verfügbar</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              <Activity className="w-4 h-4 mr-1" />
              Diagnose
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FileText className="w-4 h-4 mr-1" />
              Vorlagen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Konfiguration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhook
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Widget
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Erweitert
              </TabsTrigger>
            </TabsList>

            <TabsContent value="webhook" className="mt-6">
              <N8nConfiguration
                webhookUrl={webhookUrl}
                onWebhookUrlChange={handleWebhookUrlChange}
              />
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <N8nChatConfiguration
                webhookUrl={widgetUrl}
                onWebhookUrlChange={handleWidgetUrlChange}
                isEnabled={isWidgetEnabled}
                onEnabledChange={handleWidgetEnabledChange}
                customizations={customizations}
                onCustomizationsChange={handleCustomizationsChange}
              />
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">🔧 Erweiterte Einstellungen</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Hier finden Sie erweiterte Konfigurationsoptionen für Power-User
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDiagnostics(true)}
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      Umfassende Diagnose
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowTemplates(true)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Workflow-Vorlagen
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Performance Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Überwachen Sie die Performance Ihrer N8N Integration
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        <Activity className="w-4 h-4 mr-1" />
                        Bald verfügbar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Backup & Recovery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Sichern Sie Ihre Workflow-Konfigurationen
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        <Settings className="w-4 h-4 mr-1" />
                        Bald verfügbar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comprehensive Diagnostics */}
      <N8nComprehensiveDiagnostics
        webhookUrl={webhookUrl || widgetUrl}
        isVisible={showDiagnostics}
        onToggleVisibility={() => setShowDiagnostics(!showDiagnostics)}
      />

      {/* Workflow Templates */}
      {showTemplates && <N8nWorkflowTemplates />}
    </div>
  );
}
