
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Settings, 
  Maximize2, 
  Minimize2,
  X,
  Bot
} from 'lucide-react';
import '@n8n/chat/style.css';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(mode === 'fullscreen');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [chatInstance, setChatInstance] = useState<any>(null);

  // Chat-Konfiguration mit deutschen Texten
  const chatConfig = {
    webhookUrl: webhookUrl,
    mode: isFullscreen ? 'fullscreen' : 'window',
    target: chatContainerRef.current,
    showWelcomeScreen: true,
    defaultLanguage: 'de',
    initialMessages: [
      customizations.welcomeMessage,
      'Ich bin Ihr KI-gestützter Lead-Assistent. Stellen Sie mir Fragen zur Lead-Generierung!'
    ],
    i18n: {
      de: {
        title: '🐱 KI Lead Agent',
        subtitle: 'Ihr intelligenter Assistent für Lead-Generierung',
        inputPlaceholder: 'Beschreiben Sie Ihre Lead-Anforderungen...',
        getStarted: 'Neue Lead-Suche starten',
        sendButtonText: 'Senden',
        loadingText: 'Verarbeite Anfrage...',
        errorText: 'Verbindungsfehler - bitte versuchen Sie es erneut'
      }
    },
    metadata: {
      source: 'lead-agent-widget',
      version: '1.0.0',
      sessionId: `session_${Date.now()}`
    }
  };

  // Chat Widget initialisieren
  useEffect(() => {
    if (!webhookUrl || !isEnabled || !chatContainerRef.current) return;

    const initializeChat = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');

      try {
        // Dynamischer Import des @n8n/chat Moduls
        const { createChat } = await import('@n8n/chat');
        
        const chat = createChat(chatConfig);
        setChatInstance(chat);
        setConnectionStatus('connected');

        // Event Listener für neue Nachrichten
        if (onNewMessage) {
          chat.on('message', (message: any) => {
            onNewMessage(message);
            if (!isOpen) {
              setUnreadCount(prev => prev + 1);
            }
          });
        }

      } catch (error) {
        console.error('Fehler beim Initialisieren des Chat-Widgets:', error);
        setConnectionStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (chatInstance) {
        chatInstance.destroy?.();
      }
    };
  }, [webhookUrl, isEnabled]);

  // Unread Count zurücksetzen wenn Chat geöffnet wird
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <div className="relative">
          <Button
            onClick={toggleChat}
            size="lg"
            className={`
              rounded-full h-14 w-14 shadow-lg transition-all duration-300 transform hover:scale-110
              ${customizations.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
              ${isOpen ? 'rotate-180' : ''}
            `}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </Button>
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}

          {/* Connection Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()}`} />
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`
          fixed z-40 transition-all duration-300 ease-in-out
          ${isFullscreen 
            ? 'inset-0 bg-white' 
            : `${customizations.position.includes('right') ? 'right-6' : 'left-6'} 
               ${customizations.position.includes('bottom') ? 'bottom-24' : 'top-24'}
               w-96 h-[600px]`
          }
        `}>
          <Card className={`
            h-full flex flex-col shadow-2xl
            ${customizations.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white'}
          `}>
            {/* Chat Header */}
            <div className={`
              flex items-center justify-between p-4 border-b
              ${customizations.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-8 h-8 text-blue-600" />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${customizations.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    🐱 KI Lead Agent
                  </h3>
                  <p className={`text-xs ${customizations.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {connectionStatus === 'connected' ? 'Online' : 
                     connectionStatus === 'connecting' ? 'Verbinde...' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFullscreen}
                  className="h-8 w-8 p-0"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleChat}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className={`text-sm ${customizations.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Chat wird geladen...
                    </p>
                  </div>
                </div>
              ) : connectionStatus === 'error' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className={`text-sm ${customizations.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      Verbindung zum Chat-Service fehlgeschlagen
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Erneut versuchen
                    </Button>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
