
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebhookStorageLocal } from '@/hooks/useWebhookStorageLocal';
import { 
  Webhook, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Search,
  MessageCircle
} from "lucide-react";

export function WebhookConfigurations() {
  const { webhookSettings } = useWebhookStorageLocal();

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const getConfiguredWebhooks = () => {
    const webhooks = [];
    
    if (webhookSettings.global_webhook_url) {
      webhooks.push({
        id: "global",
        name: "Haupt-Webhook (N8N)",
        url: webhookSettings.global_webhook_url,
        status: isValidUrl(webhookSettings.global_webhook_url) ? "configured" : "error",
        description: "Hauptendpunkt für alle Lead-Verarbeitungsschritte"
      });
    }

    if (webhookSettings.email_verification_webhook) {
      webhooks.push({
        id: "email",
        name: "E-Mail-Verifizierung",
        url: webhookSettings.email_verification_webhook,
        status: isValidUrl(webhookSettings.email_verification_webhook) ? "configured" : "error",
        description: "Speziell für E-Mail-Validierung"
      });
    }

    if (webhookSettings.linkedin_analysis_webhook) {
      webhooks.push({
        id: "linkedin",
        name: "LinkedIn-Analyse",
        url: webhookSettings.linkedin_analysis_webhook,
        status: isValidUrl(webhookSettings.linkedin_analysis_webhook) ? "configured" : "error",
        description: "LinkedIn-Profil-Analyse"
      });
    }

    if (webhookSettings.lead_scraping_webhook) {
      webhooks.push({
        id: "scraping",
        name: "Lead-Scraping",
        url: webhookSettings.lead_scraping_webhook,
        status: isValidUrl(webhookSettings.lead_scraping_webhook) ? "configured" : "error",
        description: "Apollo.io Lead-Scraping-Formulare"
      });
    }

    if (webhookSettings.ai_chat_webhook) {
      webhooks.push({
        id: "chat",
        name: "KI-Chat-Widget",
        url: webhookSettings.ai_chat_webhook,
        status: isValidUrl(webhookSettings.ai_chat_webhook) ? "configured" : "error",
        description: "N8N KI-Chat-Widget Integration"
      });
    }

    if (webhooks.length === 0) {
      return [{
        id: "none",
        name: "Keine Webhooks konfiguriert",
        url: "",
        status: "inactive",
        description: "Gehe zu Einstellungen → N8N Webhooks zum Konfigurieren"
      }];
    }

    return webhooks;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "configured":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return <Badge className="bg-green-100 text-green-800">Konfiguriert</Badge>;
      case "error":
        return <Badge variant="destructive">Ungültige URL</Badge>;
      default:
        return <Badge variant="secondary">Nicht konfiguriert</Badge>;
    }
  };

  const configuredWebhooks = getConfiguredWebhooks();

  return (
    <div className="space-y-4">
      {configuredWebhooks.map((webhook) => (
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
          
          {webhook.url && (
            <p className="text-xs font-mono text-gray-600 mb-2 bg-gray-50 p-2 rounded">
              {webhook.url}
            </p>
          )}
          
          <p className="text-sm text-gray-600 mb-3">
            {webhook.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {webhook.status === "configured" && "Bereit für Webhook-Calls"}
              {webhook.status === "error" && "URL-Validierung fehlgeschlagen"}
              {webhook.status === "inactive" && "Keine Konfiguration"}
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <a href="/settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Konfigurieren
              </a>
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <ExternalLink className="w-4 h-4 text-blue-600" />
        <div className="flex-1 text-sm text-blue-800">
          <strong>Tipp:</strong> Konfiguriere deine N8N-Webhooks in den Einstellungen für automatische Lead-Verarbeitung.
        </div>
      </div>
    </div>
  );
}
