
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Mail, 
  Database, 
  Webhook,
  CheckCircle,
  Plus,
  Settings,
  ExternalLink
} from "lucide-react";
import { MailingListIntegrations } from "@/components/integrations/MailingListIntegrations";
import { WebhookConfigurations } from "@/components/integrations/WebhookConfigurations";
import { DatabaseConnections } from "@/components/integrations/DatabaseConnections";

const Integrations = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 Integrations</h1>
                  <p className="text-gray-600">
                    Verbinden Sie Ihre Tools und automatisieren Sie Ihre Workflows
                  </p>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Neue Integration
                </Button>
              </div>

              {/* Integration Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Aktive Integrationen
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">7</div>
                    <p className="text-xs text-green-600 mt-1">
                      Von 12 verfügbaren
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Webhook Calls (24h)
                    </CardTitle>
                    <Webhook className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <p className="text-xs text-blue-600 mt-1">
                      +23% vs. gestern
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Versendete E-Mails
                    </CardTitle>
                    <Mail className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">3,456</div>
                    <p className="text-xs text-purple-600 mt-1">
                      Über alle Listen
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-600" />
                        E-Mail Marketing
                        <Badge variant="secondary">3 aktiv</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MailingListIntegrations />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-green-600" />
                        Datenbanken
                        <Badge variant="secondary">2 aktiv</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DatabaseConnections />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Webhook className="w-5 h-5 text-blue-600" />
                        Webhooks & APIs
                        <Badge variant="secondary">2 aktiv</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WebhookConfigurations />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Verfügbare Integrationen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="justify-start">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Zapier
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Make.com
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Pipedrive
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          HubSpot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Integrations;
