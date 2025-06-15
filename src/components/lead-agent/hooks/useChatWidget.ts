
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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Enhanced chat widget initialization with better error handling
  useEffect(() => {
    if (!webhookUrl || !isEnabled || !chatContainerRef.current) {
      setConnectionStatus('idle');
      return;
    }

    const initializeChat = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      setErrorDetails(null);

      try {
        console.log("🐱 Initializing enhanced chat widget with URL:", webhookUrl);
        
        // Check if URL is embedded chat format
        const isEmbeddedUrl = webhookUrl.includes('/webhook/') || 
                              webhookUrl.includes('elestio.app') ||
                              webhookUrl.includes('n8n');

        if (isEmbeddedUrl) {
          console.log("🐱 Detected embedded chat URL format - using iframe approach");
          setConnectionStatus('connected');
          setIsLoading(false);
          return;
        }

        // Try to use @n8n/chat for direct integration
        try {
          const { createChat } = await import('@n8n/chat');
          
          // Enhanced chat configuration
          const chatConfig = {
            webhookUrl: webhookUrl,
            mode: isFullscreen ? ('fullscreen' as const) : ('window' as const),
            target: chatContainerRef.current,
            showWelcomeScreen: true,
            initialMessages: [welcomeMessage],
            theme: {
              primaryColor: '#4f46e5',
              secondaryColor: '#10b981',
              borderRadius: '12px'
            },
            onError: (error: any) => {
              console.error("🐱 Chat widget error:", error);
              setConnectionStatus('error');
              setErrorDetails(error.message || 'Chat widget initialization failed');
            },
            onConnect: () => {
              console.log("🐱 Chat widget connected successfully");
              setConnectionStatus('connected');
            }
          };
          
          console.log("🐱 Creating chat with config:", chatConfig);
          const chat = createChat(chatConfig);
          setChatInstance(chat);
          setConnectionStatus('connected');

          // Enhanced message handling
          const handleMessage = (event: MessageEvent) => {
            try {
              if (onNewMessage && event.data && event.data.type === 'chat-message') {
                console.log("🐱 Received chat message:", event.data);
                onNewMessage(event.data);
                if (!isOpen) {
                  setUnreadCount(prev => prev + 1);
                }
              }
            } catch (error) {
              console.error("🐱 Error handling message:", error);
            }
          };

          window.addEventListener('message', handleMessage);
          
          return () => {
            window.removeEventListener('message', handleMessage);
          };

        } catch (importError) {
          console.warn("🐱 @n8n/chat import failed, falling back to iframe:", importError);
          // Fallback to iframe approach
          setConnectionStatus('connected');
        }

      } catch (error) {
        console.error('🐱 Enhanced error during chat initialization:', error);
        setConnectionStatus('error');
        setErrorDetails(error instanceof Error ? error.message : 'Unknown initialization error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (chatInstance && typeof chatInstance.destroy === 'function') {
        try {
          chatInstance.destroy();
          console.log("🐱 Chat instance destroyed");
        } catch (error) {
          console.warn("🐱 Error destroying chat instance:", error);
        }
      }
    };
  }, [webhookUrl, isEnabled, isFullscreen, welcomeMessage, onNewMessage, isOpen]);

  // Reset unread count when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Health check for connection status
  useEffect(() => {
    if (connectionStatus === 'connected' && webhookUrl) {
      const healthCheck = setInterval(() => {
        // Simple health check by testing if the URL is still reachable
        if (navigator.onLine === false) {
          setConnectionStatus('error');
          setErrorDetails('No internet connection');
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(healthCheck);
    }
  }, [connectionStatus, webhookUrl]);

  return {
    chatContainerRef,
    unreadCount,
    isLoading,
    connectionStatus,
    errorDetails,
    setUnreadCount
  };
}
