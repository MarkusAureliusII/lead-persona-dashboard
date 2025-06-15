
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Zap, Mail, Database, Globe, TestTube, Plus } from "lucide-react";

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            E-Mail-Integrationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Mailchimp</p>
                <p className="text-sm text-gray-600">E-Mail-Marketing Plattform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Nicht verbunden</Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Verbinden
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">HubSpot</p>
                <p className="text-sm text-gray-600">CRM und Marketing Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Verbunden</Badge>
              <Button variant="outline" size="sm">
                <TestTube className="w-4 h-4 mr-2" />
                Testen
              </Button>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-green-900">HubSpot Konfiguration</p>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="hubspotList">Standard-Liste</Label>
                <Select defaultValue="qualified-leads">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualified-leads">Qualifizierte Leads</SelectItem>
                    <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            CRM-Integrationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Pipedrive</p>
                <p className="text-sm text-gray-600">Sales CRM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Nicht verbunden</Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Verbinden
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Salesforce</p>
                <p className="text-sm text-gray-600">Enterprise CRM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Nicht verbunden</Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Verbinden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Webhook-Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook-url.com/endpoint"
              />
              <Button variant="outline">
                <TestTube className="w-4 h-4 mr-2" />
                Testen
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Webhook für Lead-Events konfigurieren</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Webhook aktiviert</p>
              <p className="text-sm text-gray-600">Lead-Events an externe Services senden</p>
            </div>
            <Switch />
          </div>

          <div>
            <Label>Ereignisse</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead erstellt</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead qualifiziert</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead kontaktiert</span>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
