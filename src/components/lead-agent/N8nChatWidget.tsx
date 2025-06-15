
import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { MessageSquare, AlertCircle, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { N8nWidgetDebugger } from "./N8nWidgetDebugger";

interface N8nChatWidgetProps {
  widgetUrl: string;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
  };
  onParametersGenerated?: (parameters: any) => void;
}

export function N8nChatWidget({ 
  widgetUrl, 
  customizations,
  onParametersGenerated 
}: N8nChatWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // Enhanced message handling with better debugging
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from the n8n widget
      if (event.origin !== new URL(widgetUrl).origin) {
        console.log("🚫 Ignoring message from different origin:", event.origin);
        return;
      }

      setMessageCount(prev => prev + 1);

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        console.log('📨🐱 Received message from n8n widget:', data);
        
        // Check for the problematic "firstEntryJson" message
        if (typeof data === 'string' && data.includes('firstEntryJson')) {
          console.warn('⚠️🐱 Detected "firstEntryJson" in widget message - this indicates a configuration issue');
          return;
        }
        
        // Handle different message types from the widget
        if (data.type === 'searchParameters' && onParametersGenerated) {
          console.log('📨🐱 Received cat-optimized search parameters from n8n widget:', data.parameters);
          onParametersGenerated(data.parameters);
        } else if (data.searchParameters && onParametersGenerated) {
          // Alternative format
          console.log('📨🐱 Received search parameters (alternative format):', data.searchParameters);
          onParametersGenerated(data.searchParameters);
        }
      } catch (error) {
        console.error('❌🐱 Error parsing message from n8n widget:', error);
        console.error('Raw message data:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [widgetUrl, onParametersGenerated]);

  if (!widgetUrl) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">🐱 Widget URL erforderlich</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Bitte konfigurieren Sie zunächst die n8n Chat Widget URL in den Einstellungen oberhalb für Katzen-Power! 🚀
        </p>
      </Card>
    );
  }

  // Construct the widget URL with cat-optimized customizations
  const customizedUrl = new URL(widgetUrl);
  customizedUrl.searchParams.set('theme', customizations.theme);
  customizedUrl.searchParams.set('welcomeMessage', customizations.welcomeMessage || '🐱 Miau! Willkommen beim Lead-Jagd-Assistenten mit Signal-Rausch-Optimierung!');
  
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">🐱 n8n Chat Widget mit Katzen-Power</h2>
            {messageCount > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {messageCount} Nachrichten
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugger(!showDebugger)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Debug
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(widgetUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Vollbild
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <iframe
            ref={iframeRef}
            src={customizedUrl.toString()}
            className="w-full h-96 border border-gray-200 rounded-lg"
            title="n8n Cat-Powered Chat Widget"
            allow="microphone; camera"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600">
            🐱 Powered by n8n + Cats
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>🐱💡 Das Katzen-Widget kommuniziert direkt mit Ihrem n8n Workflow</p>
          <p>🔄🎯 Signal-Rausch-optimierte Parameter werden automatisch übernommen</p>
          <p>📈 Verbesserte Konversionsraten durch Katzen-Algorithmus</p>
          {messageCount === 0 && (
            <p className="text-orange-600 mt-1">⚠️ Noch keine Nachrichten empfangen - prüfen Sie die Widget-Konfiguration</p>
          )}
        </div>
      </Card>

      <N8nWidgetDebugger
        widgetUrl={widgetUrl}
        isVisible={showDebugger}
        onToggleVisibility={() => setShowDebugger(!showDebugger)}
      />
    </div>
  );
}
