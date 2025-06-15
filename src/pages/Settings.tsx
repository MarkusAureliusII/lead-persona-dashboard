
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Shield,
  Bell,
  Webhook,
  MessageSquare
} from "lucide-react";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { N8nChatWidgetConfig } from "@/components/lead-agent/N8nChatWidgetConfig";
import { N8nChatWidgetManager } from "@/components/lead-agent/N8nChatWidgetManager";
import { N8nUnifiedConfigurationManager } from "@/components/lead-agent/N8nUnifiedConfigurationManager";
import { useWebhookConfig } from "@/hooks/useWebhookConfig";
import { useN8nWidgetConfig } from "@/hooks/useN8nWidgetConfig";

const Settings = () => {
  const { webhookUrl, handleWebhookUrlChange } = useWebhookConfig();
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange
  } = useN8nWidgetConfig();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-4xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">
                  Manage your account, preferences, and integrations.
                </p>
              </div>

              <div className="space-y-8">
                {/* n8n Integration Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="w-5 h-5" />
                      n8n Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-6">
                      Konfigurieren Sie Ihre n8n Webhook-Integration für den AI Lead Agent
                    </p>
                    <N8nConfiguration
                      webhookUrl={webhookUrl}
                      onWebhookUrlChange={handleWebhookUrlChange}
                    />
                  </CardContent>
                </Card>

                {/* Erweiterte n8n Chat Widget Konfiguration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Erweiterte Chat Widget Konfiguration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-6">
                      Vollständige Konfiguration des @n8n/chat Widgets mit erweiterten Features
                    </p>
                    <N8nChatWidgetManager showConfiguration={true} />
                  </CardContent>
                </Card>

                {/* Legacy n8n Chat Widget Configuration */}
                <N8nChatWidgetConfig
                  widgetUrl={widgetUrl}
                  onWidgetUrlChange={handleWidgetUrlChange}
                  isEnabled={isWidgetEnabled}
                  onEnabledChange={handleWidgetEnabledChange}
                  customizations={customizations}
                  onCustomizationsChange={handleCustomizationsChange}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lead Scraping Completed</p>
                        <p className="text-sm text-gray-600">Get notified when a scraping job finishes</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalization Ready</p>
                        <p className="text-sm text-gray-600">Alert when personalized messages are ready to review</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      AI Personalization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tone">Message Tone</Label>
                      <Input id="tone" placeholder="Professional and friendly" className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">Describe the tone for AI-generated messages</p>
                    </div>
                    <div>
                      <Label htmlFor="template">Message Template</Label>
                      <textarea 
                        id="template"
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                        rows={4}
                        placeholder="Hi [Name], I noticed your work at [Company] in [Industry]..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Use [Name], [Company], [Industry] as placeholders</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-approve personalized messages</p>
                        <p className="text-sm text-gray-600">Automatically send to mailing lists without review</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy & Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Retention</p>
                        <p className="text-sm text-gray-600">Keep scraped lead data for 90 days</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Tracking</p>
                        <p className="text-sm text-gray-600">Allow usage analytics for service improvement</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="destructive" size="sm">
                        Delete All Data
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">This action cannot be undone</p>
                    </div>
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
