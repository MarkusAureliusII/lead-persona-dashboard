
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Webhook, 
  Plus, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

const webhooks = [
  {
    id: "n8n-lead",
    name: "n8n Lead Processing",
    url: "https://n8n.example.com/webhook/leads",
    status: "active",
    lastTriggered: "5 Minuten",
    calls24h: 247,
  },
  {
    id: "zapier-sync",
    name: "Zapier CRM Sync",
    url: "https://hooks.zapier.com/hooks/catch/...",
    status: "active",
    lastTriggered: "1 Stunde",
    calls24h: 89,
  },
];

export function WebhookConfigurations() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktiv</Badge>;
      case "error":
        return <Badge variant="destructive">Fehler</Badge>;
      default:
        return <Badge variant="secondary">Inaktiv</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <div
          key={webhook.id}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(webhook.status)}
              <h4 className="font-medium text-gray-900">{webhook.name}</h4>
            </div>
            {getStatusBadge(webhook.status)}
          </div>
          <p className="text-xs font-mono text-gray-600 mb-3 bg-gray-50 p-2 rounded">
            {webhook.url}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <span>Letzter Aufruf: {webhook.lastTriggered}</span>
              <span>24h Calls: {webhook.calls24h}</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Neuen Webhook hinzufügen
      </Button>
    </div>
  );
}
