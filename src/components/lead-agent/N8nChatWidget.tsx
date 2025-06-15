
import React, { useEffect, useRef, useState } from 'react';
import type { N8nChatCustomizations } from '@/hooks/useN8nConfig';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, WifiOff } from "lucide-react";

interface N8nChatWidgetProps {
  webhookUrl: string;
  customizations: N8nChatCustomizations;
  onParametersGenerated?: (parameters: any) => void;
}

export function N8nChatWidget({ webhookUrl, customizations, onParametersGenerated }: N8nChatWidgetProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const initializeChat = async () => {
    if (!webhookUrl || !chatContainerRef.current) {
      setStatus('idle');
      return;
    }
    
    setStatus('loading');
    setErrorDetails(null);
    try {
      const { createChat } = await import('@n8n/chat');
      
      if (chatInstanceRef.current?.unmount) {
        chatInstanceRef.current.unmount();
      }
      const chatConfig = {
        webhookUrl,
        target: chatContainerRef.current!,
        mode: 'window' as const,
        chatInputKey: 'chatInput',
        theme: {
          '--chat--background': customizations.theme === 'dark' ? '#1f2937' : '#ffffff',
          '--chat--text-color': customizations.theme === 'dark' ? '#f3f4f6' : '#1f2937',
        },
        initialMessages: customizations.welcomeMessage ? [customizations.welcomeMessage] : undefined,
      };
      const chatInstance = createChat(chatConfig);
      chatInstanceRef.current = chatInstance;
      setStatus('connected');
    } catch (error) {
      console.error("Failed to initialize n8n chat widget:", error);
      setStatus('error');
      setErrorDetails(error instanceof Error ? error.message : "Unbekannter Initialisierungsfehler");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      if (isMounted) {
        await initializeChat();
      }
    };
    initialize();
    return () => {
      isMounted = false;
      if (chatInstanceRef.current?.unmount) {
        chatInstanceRef.current.unmount();
      }
    };
  }, [webhookUrl, customizations]);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'n8n-chat-message' && data.payload?.searchParameters && onParametersGenerated) {
                onParametersGenerated(data.payload.searchParameters);
            }
        } catch (e) {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onParametersGenerated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          AI Lead Agent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chatContainerRef} className="relative min-h-[500px] border rounded-lg">
          {status === 'loading' && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">Lade Chat...</div>}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <WifiOff className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="font-semibold text-red-700">Verbindung fehlgeschlagen</h3>
              <p className="text-sm text-red-600 mb-4">{errorDetails}</p>
              <Button onClick={() => initializeChat()}>Erneut versuchen</Button>
            </div>
          )}
          {status === 'idle' && !webhookUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
               <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
               <p className="text-sm">Bitte konfigurieren Sie die n8n Webhook URL in den Einstellungen.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
