
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
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
    connectionStatus
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

  if (!isEnabled || !webhookUrl) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Chat-Widget nicht konfiguriert</span>
          </div>
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

      {/* Chat Window */}
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
        />
      )}
    </>
  );
}
