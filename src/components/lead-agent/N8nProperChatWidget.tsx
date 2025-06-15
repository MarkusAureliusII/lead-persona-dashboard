
import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, ExternalLink, Settings, Wifi, WifiOff } from "lucide-react";

interface N8nProperChatWidgetProps {
  webhookUrl: string;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
    language: string;
    autoOpen: boolean;
    showTypingIndicator: boolean;
    allowFileUpload: boolean;
  };
  onParametersGenerated?: (parameters: any) => void;
  showDebug?: boolean;
}

export function N8nProperChatWidget({ 
  webhookUrl, 
  customizations,
  onParametersGenerated,
  showDebug = false
}: N8nProperChatWidgetProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!webhookUrl || !chatContainerRef.current) {
      setConnectionStatus('idle');
      return;
    }

    const initializeChat = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      setErrorDetails(null);

      try {
        console.log("🐱 Initializing proper n8n chat with URL:", webhookUrl);
        
        // Import the createChat function from @n8n/chat
        const { createChat } = await import('@n8n/chat');
        
        // Destroy existing chat instance if it exists
        if (chatInstanceRef.current) {
          try {
            chatInstanceRef.current.unmount();
          } catch (error) {
            console.warn("🐱 Error unmounting existing chat:", error);
          }
        }

        // Create chat configuration
        const chatConfig = {
          webhookUrl: webhookUrl,
          target: chatContainerRef.current,
          mode: 'window' as const,
          loadPreviousSession: true,
          chatInputKey: 'chatInput', // Use chatInput instead of prompt
          theme: {
            '--chat--color-primary': customizations.theme === 'dark' ? '#10b981' : '#4f46e5',
            '--chat--color-secondary': '#6b7280',
            '--chat--border-radius': '12px',
            '--chat--message--border-radius': '16px',
            '--chat--background': customizations.theme === 'dark' ? '#1f2937' : '#ffffff',
            '--chat--text-color': customizations.theme === 'dark' ? '#f3f4f6' : '#1f2937'
          },
          initialMessages: customizations.welcomeMessage ? [customizations.welcomeMessage] : undefined,
        };

        console.log("🐱 Creating chat with config:", chatConfig);
        
        // Create the chat instance
        const chatInstance = createChat(chatConfig);
        chatInstanceRef.current = chatInstance;
        
        setConnectionStatus('connected');
        console.log("🐱 Chat initialized successfully");

        // Set up message listener for parameter extraction
        const handleMessage = (event: MessageEvent) => {
          try {
            setMessageCount(prev => prev + 1);
            
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            console.log('📨🐱 Received message from n8n chat:', data);
            
            // Handle search parameters from chat responses
            if (data.searchParameters && onParametersGenerated) {
              console.log('🎯🐱 Extracted search parameters:', data.searchParameters);
              onParametersGenerated(data.searchParameters);
            } else if (data.type === 'searchParameters' && data.parameters && onParametersGenerated) {
              console.log('🎯🐱 Extracted search parameters (alt format):', data.parameters);
              onParametersGenerated(data.parameters);
            }
            
            // Handle AI responses that might contain structured data
            if (data.type === 'message' && data.text) {
              try {
                // Try to extract JSON from AI response
                const jsonMatch = data.text.match(/\{[^}]*"industry"[^}]*\}/);
                if (jsonMatch) {
                  const extractedParams = JSON.parse(jsonMatch[0]);
                  if (onParametersGenerated) {
                    console.log('🎯🐱 Extracted parameters from AI response:', extractedParams);
                    onParametersGenerated(extractedParams);
                  }
                }
              } catch (parseError) {
                // Not JSON, continue normally
              }
            }
          } catch (error) {
            console.error('❌🐱 Error handling chat message:', error);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Cleanup function
        return () => {
          window.removeEventListener('message', handleMessage);
        };

      } catch (error) {
        console.error('❌🐱 Error initializing chat:', error);
        setConnectionStatus('error');
        setErrorDetails(error instanceof Error ? error.message : 'Chat initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (chatInstanceRef.current) {
        try {
          chatInstanceRef.current.unmount();
        } catch (error) {
          console.warn("🐱 Error cleaning up chat instance:", error);
        }
      }
    };
  }, [webhookUrl, customizations.theme, customizations.welcomeMessage, onParametersGenerated]);

  const handleRetry = () => {
    setConnectionStatus('idle');
    // Trigger re-initialization
    setTimeout(() => {
      if (chatContainerRef.current) {
        setConnectionStatus('connecting');
      }
    }, 100);
  };

  if (!webhookUrl) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">🐱 Webhook URL erforderlich</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Bitte konfigurieren Sie zunächst die n8n Chat Webhook URL in den Einstellungen für Katzen-Power! 🚀
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">🐱 n8n Proper Chat Widget</h2>
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-700">Verbunden</span>
              </div>
            )}
            {messageCount > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {messageCount} Nachrichten
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {connectionStatus === 'error' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
              >
                <WifiOff className="w-4 h-4 mr-1" />
                Erneut versuchen
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(webhookUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Webhook testen
            </Button>
          </div>
        </div>
        
        {/* Chat Container */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">🐱 Chat wird initialisiert...</p>
              </div>
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
              <div className="text-center max-w-sm">
                <WifiOff className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-red-900 mb-2">Verbindung fehlgeschlagen</h3>
                <p className="text-sm text-red-700 mb-4">{errorDetails}</p>
                <Button size="sm" onClick={handleRetry}>
                  Erneut versuchen
                </Button>
              </div>
            </div>
          )}
          
          <div 
            ref={chatContainerRef} 
            className="min-h-96 border border-gray-200 rounded-lg"
            style={{
              '--chat--color-primary': customizations.theme === 'dark' ? '#10b981' : '#4f46e5',
              '--chat--color-secondary': '#6b7280',
              '--chat--border-radius': '12px',
              '--chat--message--border-radius': '16px',
              '--chat--background': customizations.theme === 'dark' ? '#1f2937' : '#ffffff',
              '--chat--text-color': customizations.theme === 'dark' ? '#f3f4f6' : '#1f2937'
            } as React.CSSProperties}
          />
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>🐱💡 Proper n8n Chat Widget mit createChat() Integration</p>
          <p>🔄🎯 Automatische Parameter-Extraktion aus Chat-Antworten</p>
          <p>📈 Optimierte Performance durch direkte Integration</p>
          {showDebug && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <div><strong>Status:</strong> {connectionStatus}</div>
              <div><strong>Theme:</strong> {customizations.theme}</div>
              <div><strong>Webhook:</strong> {webhookUrl}</div>
              <div><strong>Nachrichten:</strong> {messageCount}</div>
              <div><strong>Auto Open:</strong> {customizations.autoOpen ? 'Ja' : 'Nein'}</div>
              <div><strong>Typing Indicator:</strong> {customizations.showTypingIndicator ? 'Ja' : 'Nein'}</div>
              <div><strong>File Upload:</strong> {customizations.allowFileUpload ? 'Ja' : 'Nein'}</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
