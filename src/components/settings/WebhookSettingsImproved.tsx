import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Check, AlertCircle, Webhook, Link, Mail, Linkedin, Globe, Info } from "lucide-react";
import { useWebhookStorageLocal } from '@/hooks/useWebhookStorageLocal';
import { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function WebhookSettingsImproved() {
  const { 
    webhookSettings, 
    updateWebhookUrl, 
    autoSave, 
    isLoading, 
    isSaving 
  } = useWebhookStorageLocal();
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    const success = await autoSave();
    if (success) {
      setLastSaved(new Date());
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const StatusBadge = ({ url }: { url: string }) => {
    if (!url) return <Badge variant="outline" className="text-xs">Optional</Badge>;
    const isValid = isValidUrl(url);
    return isValid ? 
      <Badge className="bg-green-100 text-green-800 text-xs"><Check className="w-3 h-3 mr-1" />Gültig</Badge> : 
      <Badge variant="destructive" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Ungültig</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm text-gray-600">Lade Webhook-Einstellungen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">N8N Automation Setup</h2>
          <p className="text-gray-600 mt-1">Verbinde deine Lead-Verarbeitung mit N8N-Workflows</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Speichere...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </>
          )}
        </Button>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Wie es funktioniert:</strong> Wenn du Leads verarbeitest, werden diese an deine N8N-Webhooks gesendet. 
          N8N kann dann E-Mails verifizieren, LinkedIn-Profile analysieren oder andere Automatisierungen ausführen.
        </AlertDescription>
      </Alert>

      {/* Main Webhook URL */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Webhook className="w-5 h-5 text-blue-600" />
            Haupt-Webhook URL
            <Badge className="bg-blue-100 text-blue-800 text-xs">Empfohlen</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Eine einzige URL für alle Lead-Verarbeitungsschritte. N8N kann basierend auf den Daten entscheiden, was zu tun ist.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="main-webhook" className="text-sm font-medium">Webhook URL</Label>
              <StatusBadge url={webhookSettings.global_webhook_url} />
            </div>
            <Input
              id="main-webhook"
              type="url"
              placeholder="https://deine-n8n-instanz.com/webhook/lead-verarbeitung"
              value={webhookSettings.global_webhook_url}
              onChange={(e) => updateWebhookUrl('global_webhook_url', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Empfohlen: Verwende nur diese URL und lass N8N intern entscheiden, welche Schritte ausgeführt werden sollen.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Advanced Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erweiterte Konfiguration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Optional: Separate Webhooks für spezifische Verarbeitungsschritte. Nur verwenden, wenn du komplexe Workflows hast.
        </p>

        <div className="grid gap-4">
          {/* Lead Processing Webhook */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link className="w-4 h-4 text-gray-600" />
                Lead-Verarbeitung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="lead-processing" className="text-sm">Spezieller Webhook für Batch-Lead-Transfer</Label>
                <StatusBadge url={webhookSettings.lead_processing_webhook} />
              </div>
              <Input
                id="lead-processing"
                type="url"
                placeholder="https://deine-n8n-instanz.com/webhook/batch-leads"
                value={webhookSettings.lead_processing_webhook}
                onChange={(e) => updateWebhookUrl('lead_processing_webhook', e.target.value)}
                onBlur={handleSave}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Email Verification */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="w-4 h-4 text-green-600" />
                E-Mail-Verifizierung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-verification" className="text-sm">Webhook für E-Mail-Validierung</Label>
                <StatusBadge url={webhookSettings.email_verification_webhook} />
              </div>
              <Input
                id="email-verification"
                type="url"
                placeholder="https://deine-n8n-instanz.com/webhook/email-check"
                value={webhookSettings.email_verification_webhook}
                onChange={(e) => updateWebhookUrl('email_verification_webhook', e.target.value)}
                onBlur={handleSave}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* LinkedIn Analysis */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Linkedin className="w-4 h-4 text-blue-600" />
                LinkedIn-Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="linkedin-analysis" className="text-sm">Webhook für LinkedIn-Profil-Analyse</Label>
                <StatusBadge url={webhookSettings.linkedin_analysis_webhook} />
              </div>
              <Input
                id="linkedin-analysis"
                type="url"
                placeholder="https://deine-n8n-instanz.com/webhook/linkedin-scrape"
                value={webhookSettings.linkedin_analysis_webhook}
                onChange={(e) => updateWebhookUrl('linkedin_analysis_webhook', e.target.value)}
                onBlur={handleSave}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Website Analysis */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-4 h-4 text-purple-600" />
                Website-Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="website-analysis" className="text-sm">Webhook für Website-Content-Analyse</Label>
                <StatusBadge url={webhookSettings.website_analysis_webhook} />
              </div>
              <Input
                id="website-analysis"
                type="url"
                placeholder="https://deine-n8n-instanz.com/webhook/website-analyze"
                value={webhookSettings.website_analysis_webhook}
                onChange={(e) => updateWebhookUrl('website_analysis_webhook', e.target.value)}
                onBlur={handleSave}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Example Workflow */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">N8N Workflow-Beispiel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 border">
            <pre className="text-xs text-gray-700 leading-relaxed overflow-x-auto">
{`N8N Workflow-Struktur:
┌─ Webhook Trigger (Empfange Leads)
├─ Switch Node (Entscheide basierend auf Lead-Daten)
│  ├─ E-Mail validieren → Setze "email_verification_status"
│  ├─ LinkedIn analysieren → Setze "analysis_text_personal_linkedin"  
│  └─ Website analysieren → Setze "analysis_text_website"
└─ HTTP Request → Update Lead in Supabase mit Ergebnissen`}
            </pre>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Tipp: Verwende die Haupt-Webhook-URL und lass N8N basierend auf den empfangenen Daten entscheiden, welche Schritte ausgeführt werden sollen.
          </p>
        </CardContent>
      </Card>

      {/* Save Status */}
      {lastSaved && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <Check className="w-4 h-4" />
          Zuletzt gespeichert: {lastSaved.toLocaleTimeString('de-DE')}
        </div>
      )}
    </div>
  );
}