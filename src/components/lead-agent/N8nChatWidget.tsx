
import React, { useEffect, useRef, useState } from 'react';
import type { N8nChatCustomizations } from '@/hooks/useN8nConfig';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, WifiOff, RefreshCw } from "lucide-react";

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

  // Stabile Abhängigkeit für useEffect erstellen, um unnötige Neuausführungen zu vermeiden
  const customizationsJSON = JSON.stringify(customizations);

  const initializeChat = async () => {
    // Nur ausführen, wenn die Bedingungen erfüllt sind
    if (!webhookUrl || !chatContainerRef.current) {
      setStatus('idle');
      if (!webhookUrl) {
          setErrorDetails("Bitte die n8n Webhook URL in den Einstellungen konfigurieren.");
      }
      return;
    }
    
    setStatus('loading');
    setErrorDetails(null);

    try {
      const { createChat } = await import('@n8n/chat');
      
      // Alte Instanz sicher entfernen, falls vorhanden
      if (chatInstanceRef.current?.unmount) {
          try {
              chatInstanceRef.current.unmount();
          } catch (e) {
              console.warn("Fehler beim unmounten der alten Chat-Instanz (war evtl. schon weg):", e);
          }
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
    initializeChat();

    // Cleanup-Funktion bei Zerstörung der Komponente
    return () => {
      if (chatInstanceRef.current?.unmount) {
        try {
            chatInstanceRef.current.unmount();
        } catch(e) {
            // Dies kann passieren und ist oft unkritisch, wenn das DOM schon weg ist.
            console.warn("Fehler beim Cleanup der Chat-Instanz:", e);
        }
        chatInstanceRef.current = null;
      }
    };
  // Führe den Effekt nur aus, wenn sich die URL oder die serialisierten Customizations ändern
  }, [webhookUrl, customizationsJSON]);
  
  // Effekt für die Verarbeitung von Nachrichten
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
              <Button onClick={initializeChat}><RefreshCw className="mr-2 h-4 w-4"/>Erneut versuchen</Button>
            </div>
          )}
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
               <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
               <p className="text-sm">{errorDetails || "Chat-Widget ist bereit zur Initialisierung."}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
