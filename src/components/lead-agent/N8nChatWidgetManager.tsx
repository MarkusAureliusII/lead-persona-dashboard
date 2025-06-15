
import React from 'react';
import { N8nEnhancedChatWidget } from './N8nEnhancedChatWidget';
import { N8nChatConfiguration } from './N8nChatConfiguration';
import { useN8nEnhancedWidgetConfig } from '@/hooks/useN8nEnhancedWidgetConfig';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Settings, BarChart3 } from 'lucide-react';

interface N8nChatWidgetManagerProps {
  showConfiguration?: boolean;
}

export function N8nChatWidgetManager({ 
  showConfiguration = false 
}: N8nChatWidgetManagerProps) {
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    sessionData,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange,
    updateSessionData,
    clearSession
  } = useN8nEnhancedWidgetConfig();

  const handleNewMessage = (message: any) => {
    // Neue Nachricht zur Session hinzufügen
    const updatedHistory = [...sessionData.messageHistory, {
      ...message,
      timestamp: new Date().toISOString(),
      id: `msg_${Date.now()}`
    }];

    updateSessionData({
      messageHistory: updatedHistory
    });

    console.log('🐱 Neue Chat-Nachricht:', message);
  };

  if (showConfiguration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            N8N Chat Widget - Erweiterte Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Konfiguration
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Vorschau
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-6">
              <N8nChatConfiguration
                webhookUrl={widgetUrl}
                onWebhookUrlChange={handleWidgetUrlChange}
                isEnabled={isWidgetEnabled}
                onEnabledChange={handleWidgetEnabledChange}
                customizations={{
                  ...customizations
                }}
                onCustomizationsChange={handleCustomizationsChange}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg min-h-[400px] relative">
                  <div className="text-center text-gray-600 mb-4">
                    <h3 className="font-medium mb-2">Widget Vorschau</h3>
                    <p className="text-sm">
                      So wird das Chat-Widget auf Ihrer Website erscheinen
                    </p>
                  </div>
                  
                  {/* Simulierter Website-Hintergrund */}
                  <div className="bg-white p-4 rounded border h-64 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2"></div>
                      <p className="text-sm">Ihre Website-Inhalte</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chat-Statistiken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {sessionData.messageHistory.length}
                        </div>
                        <div className="text-sm text-gray-600">Nachrichten</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {sessionData.sessionId ? '1' : '0'}
                        </div>
                        <div className="text-sm text-gray-600">Aktive Session</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {sessionData.lastActive ? 
                            new Date(sessionData.lastActive).toLocaleDateString('de-DE') : 
                            'N/A'
                          }
                        </div>
                        <div className="text-sm text-gray-600">Letzte Aktivität</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Das eigentliche Chat Widget */}
      <N8nEnhancedChatWidget
        webhookUrl={widgetUrl}
        isEnabled={isWidgetEnabled}
        customizations={customizations}
        onNewMessage={handleNewMessage}
      />
    </>
  );
}
