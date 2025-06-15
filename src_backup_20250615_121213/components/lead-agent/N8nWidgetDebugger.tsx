
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

interface WidgetMessage {
  timestamp: Date;
  type: 'sent' | 'received' | 'error';
  data: any;
  origin?: string;
}

interface N8nWidgetDebuggerProps {
  widgetUrl: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function N8nWidgetDebugger({ widgetUrl, isVisible, onToggleVisibility }: N8nWidgetDebuggerProps) {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    console.log("🐛 Starting widget message listener for debugging");
    
    const handleMessage = (event: MessageEvent) => {
      const newMessage: WidgetMessage = {
        timestamp: new Date(),
        type: event.origin === new URL(widgetUrl).origin ? 'received' : 'error',
        data: event.data,
        origin: event.origin
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, 50)); // Keep last 50 messages
      console.log("🐛 Widget message captured:", newMessage);
    };

    window.addEventListener('message', handleMessage);
    
    // Cleanup function would be returned if this was a useEffect
    return () => {
      window.removeEventListener('message', handleMessage);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    setIsListening(false);
    console.log("🐛 Stopped widget message listener");
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent':
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'received':
        return <Badge className="bg-green-100 text-green-800">Empfangen</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Gesendet</Badge>;
      case 'error':
        return <Badge variant="destructive">Fehler</Badge>;
      default:
        return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleVisibility}
        className="flex items-center gap-2"
      >
        <Bug className="w-4 h-4" />
        Widget Debugger
        <Eye className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className="border-dashed border-orange-300 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bug className="w-5 h-5 text-orange-600" />
            🐛 n8n Widget Debugger
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? "Stop" : "Start"} Listening
          </Button>
          <Button variant="outline" size="sm" onClick={clearMessages}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">
              {isListening ? "🎧 Warte auf Widget-Nachrichten..." : "▶️ Klicken Sie 'Start Listening' um zu beginnen"}
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="border rounded p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon(message.type)}
                    <span className="text-xs font-mono text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {getMessageTypeBadge(message.type)}
                </div>
                {message.origin && (
                  <p className="text-xs text-gray-500 mb-1">
                    Origin: {message.origin}
                  </p>
                )}
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(message.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 text-xs text-gray-600 bg-white p-3 rounded border">
          <p className="font-medium mb-1">🔍 Debugging-Tipps:</p>
          <ul className="space-y-1">
            <li>• Überprüfen Sie, ob "firstEntryJson" in den Nachrichten erscheint</li>
            <li>• Achten Sie auf die Origin-URL der Nachrichten</li>
            <li>• Suchen Sie nach strukturierten searchParameters</li>
            <li>• Fehler-Nachrichten zeigen Kommunikationsprobleme</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
