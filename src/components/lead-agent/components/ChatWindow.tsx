
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { ChatHeader } from './ChatHeader';

interface ChatWindowProps {
  isFullscreen: boolean;
  position: string;
  theme: string;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  isLoading: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  embeddedChatUrl?: string;
  errorDetails?: string;
}

export function ChatWindow({
  isFullscreen,
  position,
  theme,
  connectionStatus,
  isLoading,
  onToggleFullscreen,
  onClose,
  chatContainerRef,
  embeddedChatUrl,
  errorDetails
}: ChatWindowProps) {
  const handleRetry = () => {
    console.log("🐱 Retrying chat connection...");
    window.location.reload();
  };

  const getPositionClasses = () => {
    if (isFullscreen) return 'inset-0 bg-white';
    
    const rightPos = position.includes('right') ? 'right-6' : 'left-6';
    const topPos = position.includes('bottom') ? 'bottom-24' : 'top-24';
    return `${rightPos} ${topPos} w-96 h-[600px]`;
  };

  const renderErrorState = () => (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-8 h-8 text-red-600" />
        </div>
        <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Verbindung fehlgeschlagen
        </h3>
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {errorDetails || "Chat-Service nicht erreichbar"}
        </p>
        
        {/* Debug Information */}
        <div className={`text-xs p-3 rounded border mb-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-3 h-3" />
            <span className="font-medium">Debug Info:</span>
          </div>
          <div className="space-y-1 text-left">
            <div>Status: {connectionStatus}</div>
            <div>URL: {embeddedChatUrl ? 'Embedded' : 'Direct'}</div>
            <div>Online: {navigator.onLine ? 'Ja' : 'Nein'}</div>
            <div>Zeit: {new Date().toLocaleTimeString('de-DE')}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            size="sm" 
            onClick={handleRetry}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(embeddedChatUrl || '#', '_blank')}
            className="w-full"
            disabled={!embeddedChatUrl}
          >
            In neuem Tab öffnen
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wifi className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          🐱 Chat wird initialisiert...
        </p>
        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          Verbindung zu N8N wird hergestellt
        </p>
      </div>
    </div>
  );

  const renderChatContent = () => {
    if (embeddedChatUrl) {
      // Enhanced iframe with better error handling
      return (
        <iframe
          src={embeddedChatUrl}
          className="w-full h-full border-0 rounded-b-lg"
          title="🐱 N8N Enhanced Chat"
          allow="microphone; camera; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-clipboard-write"
          onLoad={() => console.log("🐱 Chat iframe loaded successfully")}
          onError={(e) => console.error("🐱 Chat iframe error:", e)}
        />
      );
    } else {
      // Fallback to @n8n/chat integration
      return (
        <div 
          ref={chatContainerRef} 
          className="h-full"
          style={{
            '--chat--color-primary': '#4f46e5',
            '--chat--color-secondary': '#10b981',
            '--chat--border-radius': '12px',
            '--chat--message--border-radius': '16px'
          } as React.CSSProperties}
        />
      );
    }
  };

  return (
    <div className={`fixed z-40 transition-all duration-300 ease-in-out ${getPositionClasses()}`}>
      <Card className={`
        h-full flex flex-col shadow-2xl
        ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white'}
      `}>
        <ChatHeader
          theme={theme}
          connectionStatus={connectionStatus}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          onClose={onClose}
        />

        {/* Enhanced Chat Container with better error states */}
        <div className="flex-1 relative">
          {isLoading ? renderLoadingState() : 
           connectionStatus === 'error' ? renderErrorState() : 
           renderChatContent()}
        </div>

        {/* Connection Status Footer */}
        {connectionStatus === 'connected' && (
          <div className={`px-4 py-2 border-t text-xs ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>🐱 Verbunden</span>
              </div>
              <span>{new Date().toLocaleTimeString('de-DE')}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
