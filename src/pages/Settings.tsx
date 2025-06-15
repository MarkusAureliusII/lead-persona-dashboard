import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MessageSquare, TestTube } from "lucide-react";
import { useN8nConfig } from "@/hooks/useN8nConfig"; 
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { 
    isEnabled, 
    setIsEnabled, 
    webhookUrl, 
    setWebhookUrl, 
    customizations, 
    setCustomizations 
  } = useN8nConfig();
  
  const { toast } = useToast();

  const handleTestConnection = async () => {
    if (!webhookUrl) {
        toast({ title: "Fehler", description: "Bitte eine Webhook URL eingeben.", variant: "destructive" });
        return;
    }
    toast({ title: "Test gesendet", description: "Überprüfe deinen n8n-Workflow auf eingehende Daten." });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-4xl">
              <SettingsHeader
                title="Einstellungen"
                description="Verwalte deine Account-Präferenzen und Integrationen."
              />

              <div className="space-y-8">
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
                        <div>
                          <Label htmlFor="webhookUrl">n8n Chat Webhook URL</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="webhookUrl"
                              placeholder="Deine n8n Chat Webhook URL"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                            />
                            <Button variant="outline" onClick={handleTestConnection}>
                               <TestTube className="w-4 h-4 mr-2" />
                               Testen
                            </Button>
                          </div>
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
