
import React, { useState } from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import { useChatWidget } from './hooks/useChatWidget';
import { ChatToggleButton } from './components/ChatToggleButton';
import { ChatWindow } from './components/ChatWindow';

interface N8nEnhancedChatWidgetProps {
  webhookUrl: string;
  mode?: 'window' | 'fullscreen';
  isEnabled?: boolean;
  customizations?: {
    theme: string;
    position: string;
    welcomeMessage: string;
  };
  onNewMessage?: (message: any) => void;
  className?: string;
}

export function N8nEnhancedChatWidget({
  webhookUrl,
  mode = 'window',
  isEnabled = true,
  customizations = {
    theme: 'light',
    position: 'bottom-right',
    welcomeMessage: 'Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?'
  },
  onNewMessage,
  className = ''
}: N8nEnhancedChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(mode === 'fullscreen');

  const {
    chatContainerRef,
    unreadCount,
    isLoading,
    connectionStatus,
    errorDetails
  } = useChatWidget({
    webhookUrl,
    isEnabled,
    isFullscreen,
    welcomeMessage: customizations.welcomeMessage,
    onNewMessage,
    isOpen
  });

  const getPositionClasses = () => {
    switch (customizations.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  // Check if the URL is an embedded chat URL
  const isEmbeddedChatUrl = webhookUrl && (
    webhookUrl.includes('/webhook/') || 
    webhookUrl.includes('elestio.app') ||
    webhookUrl.includes('n8n')
  );

  if (!isEnabled || !webhookUrl) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Chat-Widget nicht konfiguriert</span>
          </div>
          <p className="text-xs text-gray-500">
            Bitte konfigurieren Sie die n8n Chat Widget URL in den Einstellungen
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there are critical issues
  if (connectionStatus === 'error' && !isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Verbindungsfehler</span>
          </div>
          <p className="text-xs text-red-600 mb-3">
            {errorDetails || "Chat-Service nicht erreichbar"}
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors"
          >
            Trotzdem öffnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <ChatToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        unreadCount={unreadCount}
        connectionStatus={connectionStatus}
        theme={customizations.theme}
        position={customizations.position}
      />

      {/* Enhanced Chat Window */}
      {isOpen && (
        <ChatWindow
          isFullscreen={isFullscreen}
          position={customizations.position}
          theme={customizations.theme}
          connectionStatus={connectionStatus}
          isLoading={isLoading}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onClose={() => setIsOpen(false)}
          chatContainerRef={chatContainerRef}
          embeddedChatUrl={isEmbeddedChatUrl ? webhookUrl : undefined}
          errorDetails={errorDetails}
        />
      )}
    </>
  );
}
