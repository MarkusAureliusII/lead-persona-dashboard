
import { useEffect, useRef, useState } from 'react';

interface UseChatWidgetProps {
  webhookUrl: string;
  isEnabled: boolean;
  isFullscreen: boolean;
  welcomeMessage: string;
  onNewMessage?: (message: any) => void;
  isOpen: boolean;
}

export function useChatWidget({
  webhookUrl,
  isEnabled,
  isFullscreen,
  welcomeMessage,
  onNewMessage,
  isOpen
}: UseChatWidgetProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [chatInstance, setChatInstance] = useState<any>(null);

  // Chat Widget initialisieren
  useEffect(() => {
    if (!webhookUrl || !isEnabled || !chatContainerRef.current) return;

    const initializeChat = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');

      try {
        // Dynamischer Import des @n8n/chat Moduls
        const { createChat } = await import('@n8n/chat');
        
        // Chat-Konfiguration mit korrekten Typen
        const chatConfig = {
          webhookUrl: webhookUrl,
          mode: isFullscreen ? ('fullscreen' as const) : ('window' as const),
          target: chatContainerRef.current,
          showWelcomeScreen: true,
          initialMessages: [welcomeMessage]
        };
        
        const chat = createChat(chatConfig);
        setChatInstance(chat);
        setConnectionStatus('connected');

        // Message handling über postMessage API
        const handleMessage = (event: MessageEvent) => {
          if (onNewMessage && event.data && event.data.type === 'chat-message') {
            onNewMessage(event.data);
            if (!isOpen) {
              setUnreadCount(prev => prev + 1);
            }
          }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
          window.removeEventListener('message', handleMessage);
        };

      } catch (error) {
        console.error('Fehler beim Initialisieren des Chat-Widgets:', error);
        setConnectionStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (chatInstance && typeof chatInstance.destroy === 'function') {
        chatInstance.destroy();
      }
    };
  }, [webhookUrl, isEnabled, isFullscreen, welcomeMessage, onNewMessage, isOpen]);

  // Unread Count zurücksetzen wenn Chat geöffnet wird
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  return {
    chatContainerRef,
    unreadCount,
    isLoading,
    connectionStatus,
    setUnreadCount
  };
}
