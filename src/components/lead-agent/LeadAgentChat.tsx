
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, Settings, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TargetAudience, SearchParameters } from "@/types/leadAgent";

interface LeadAgentChatProps {
  onParametersGenerated: (parameters: SearchParameters) => void;
  targetAudience: TargetAudience;
  embedUrl?: string;
}

export function LeadAgentChat({ onParametersGenerated, targetAudience, embedUrl }: LeadAgentChatProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Enhanced message handling for embedded chat
    const handleMessage = (event: MessageEvent) => {
      if (!embedUrl) return;
      
      // Ensure the message is from the embed URL
      try {
        const embedOrigin = new URL(embedUrl).origin;
        if (event.origin !== embedOrigin) {
          console.log("🚫 Ignoring message from different origin:", event.origin);
          return;
        }
      } catch (error) {
        console.warn("🐱 Could not parse embed URL origin:", error);
        return;
      }

      setMessageCount(prev => prev + 1);

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        console.log('📨🐱 Received message from embedded chat:', data);
        
        // Handle different message types from the embedded chat
        if (data.type === 'searchParameters' && onParametersGenerated) {
          console.log('📨🐱 Received search parameters from embedded chat:', data.parameters);
          onParametersGenerated(data.parameters);
        } else if (data.searchParameters && onParametersGenerated) {
          // Alternative format
          console.log('📨🐱 Received search parameters (alternative format):', data.searchParameters);
          onParametersGenerated(data.searchParameters);
        }
      } catch (error) {
        console.error('❌🐱 Error parsing message from embedded chat:', error);
        console.error('Raw message data:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [embedUrl, onParametersGenerated]);

  if (!embedUrl) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Lead Agent Chat</h2>
          <div className="flex items-center text-orange-600">
            <Settings className="w-4 h-4 mr-1" />
            <span className="text-xs">Embed URL erforderlich</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">🐱 Embed URL erforderlich</h3>
          <p className="text-gray-600 text-sm mb-4">
            Bitte konfigurieren Sie zunächst die n8n Embed Chat URL in den Einstellungen für Katzen-Power! 🚀
          </p>
          <p className="text-xs text-gray-500">
            Das System verwendet jetzt ein eingebettetes Chat-Widget anstelle von Webhook-Aufrufen
          </p>
        </div>
      </Card>
    );
  }

  // Construct the embed URL with customizations
  const customizedUrl = new URL(embedUrl);
  customizedUrl.searchParams.set('welcomeMessage', '🐱 Miau! Willkommen beim Lead-Jagd-Assistenten!');
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">🐱 Lead Agent Chat</h2>
          {messageCount > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {messageCount} Nachrichten
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs"
          >
            <Bug className="w-4 h-4 mr-1" />
            {showDebug ? "Debug: An" : "Debug: Aus"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(embedUrl, '_blank')}
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
          title="🐱 n8n Embedded Lead Agent Chat"
          allow="microphone; camera"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600">
          🐱 Embed Chat Mode
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>🐱💡 Das eingebettete Chat-Widget kommuniziert direkt mit Ihrem n8n Workflow</p>
        <p>🔄🎯 Lead-Parameter werden automatisch übernommen</p>
        <p>📈 Verbesserte Performance durch eingebettetes System</p>
        {messageCount === 0 && (
          <p className="text-orange-600 mt-1">⚠️ Noch keine Nachrichten empfangen - prüfen Sie die Embed-URL</p>
        )}
        {showDebug && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Embed URL: {embedUrl}</p>
            <p>Nachrichten: {messageCount}</p>
            <p>Zielgruppe: {targetAudience.industry} - {targetAudience.jobTitle}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
