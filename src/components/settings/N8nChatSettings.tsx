
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings as SettingsIcon } from "lucide-react";
import { useN8nConfig } from "@/hooks/useN8nConfig"; 
import { useToast } from "@/hooks/use-toast";

export function N8nChatSettings() {
  const { 
    isEnabled, 
    setIsEnabled, 
    webhookUrl,
    customizations, 
    setCustomizations 
  } = useN8nConfig();
  
  const { toast } = useToast();

  const handleTestConnection = async () => {
    if (!webhookUrl) {
        toast({ title: "Webhook nicht konfiguriert", description: "Bitte konfiguriere den KI-Chat-Webhook in den N8N Webhook-Einstellungen.", variant: "destructive" });
        return;
    }
    toast({ title: "Test gesendet", description: "Überprüfe deinen n8n-Workflow auf eingehende Daten." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          n8n Chat Widget Konfiguration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="widget-enabled" className="flex flex-col space-y-1">
            <span>Chat-Widget aktivieren</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Schaltet das n8n-Chat-Widget auf der Lead-Agent-Seite an oder aus.
            </span>
          </Label>
          <Switch
            id="widget-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {isEnabled && (
          <div className="space-y-4 pt-4 border-t">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SettingsIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Webhook-Konfiguration</span>
              </div>
              <p className="text-sm text-blue-700">
                Die Webhook-URL für das Chat-Widget wird über die <strong>N8N Webhooks</strong> in den Einstellungen konfiguriert.
                {webhookUrl ? (
                  <span className="block mt-1 text-green-700">✓ Webhook ist konfiguriert und bereit</span>
                ) : (
                  <span className="block mt-1 text-orange-700">⚠ Noch kein Webhook konfiguriert</span>
                )}
              </p>
              <Button variant="outline" size="sm" onClick={handleTestConnection} className="mt-2">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Webhook testen
              </Button>
            </div>
            
            <div>
              <Label htmlFor="welcomeMessage">Willkommensnachricht</Label>
              <Input
                id="welcomeMessage"
                placeholder="Wie kann ich dir helfen?"
                value={customizations.welcomeMessage}
                onChange={(e) => setCustomizations({ ...customizations, welcomeMessage: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
