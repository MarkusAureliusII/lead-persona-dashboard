
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Bot } from "lucide-react";

interface ChatSelectorProps {
  chatMode: 'custom' | 'widget';
  onChatModeChange: (mode: 'custom' | 'widget') => void;
  isWidgetConfigured: boolean;
}

export function ChatSelector({ 
  chatMode, 
  onChatModeChange, 
  isWidgetConfigured 
}: ChatSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat-Modus auswählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={chatMode} onValueChange={onChatModeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer">
              <Bot className="w-4 h-4" />
              Benutzerdefinierter Chat
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Verwenden Sie den integrierten AI Chat mit direkter n8n Webhook-Integration
          </p>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="widget" 
              id="widget" 
              disabled={!isWidgetConfigured}
            />
            <Label 
              htmlFor="widget" 
              className={`flex items-center gap-2 cursor-pointer ${
                !isWidgetConfigured ? 'opacity-50' : ''
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              n8n Chat Widget
              {!isWidgetConfigured && (
                <span className="text-xs text-orange-600">(Konfiguration erforderlich)</span>
              )}
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Verwenden Sie ein externes n8n Chat Widget mit erweiterten Funktionen
          </p>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
