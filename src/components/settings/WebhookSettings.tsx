import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Check, AlertCircle, Webhook } from "lucide-react";
import { useWebhookStorageLocal } from '@/hooks/useWebhookStorageLocal';
import { useState } from 'react';

export function WebhookSettings() {
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
    if (!url) return true; // Empty URLs are valid (optional)
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const getUrlStatus = (url: string) => {
    if (!url) return 'empty';
    return isValidUrl(url) ? 'valid' : 'invalid';
  };

  const StatusBadge = ({ url }: { url: string }) => {
    const status = getUrlStatus(url);
    
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Gültig</Badge>;
      case 'invalid':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Ungültig</Badge>;
      default:
        return <Badge variant="secondary">Nicht konfiguriert</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Lade Webhook-Einstellungen...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Migration Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Lokale Speicherung</h3>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Die Webhook-Einstellungen werden derzeit lokal im Browser gespeichert. 
          Für persistente Speicherung führe die SQL-Migration in Supabase aus:
        </p>
        <code className="block bg-yellow-100 text-yellow-800 p-2 rounded mt-2 text-xs">
          supabase_webhook_settings_table.sql
        </code>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">N8N Webhook-Einstellungen</h2>
          <p className="text-gray-600">Konfiguriere deine N8N-Workflow-Webhooks für die Lead-Verarbeitung</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Speichere...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Alle speichern
            </>
          )}
        </Button>
      </div>

      {lastSaved && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" />
          Zuletzt gespeichert: {lastSaved.toLocaleTimeString('de-DE')}
        </div>
      )}

      {/* Globale Webhook URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Standard Webhook URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="global-webhook">Standard Webhook für alle Prozesse</Label>
              <StatusBadge url={webhookSettings.global_webhook_url} />
            </div>
            <Input
              id="global-webhook"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/global-processing"
              value={webhookSettings.global_webhook_url}
              onChange={(e) => updateWebhookUrl('global_webhook_url', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Diese URL wird verwendet, wenn keine spezifische Webhook-URL für einen Prozess konfiguriert ist.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Spezifische Webhook URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Spezifische Webhook-URLs</CardTitle>
          <p className="text-sm text-gray-600">
            Konfiguriere separate Webhooks für verschiedene Verarbeitungsschritte (optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lead Processing Webhook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="lead-processing">Lead-Verarbeitung</Label>
              <StatusBadge url={webhookSettings.lead_processing_webhook} />
            </div>
            <Input
              id="lead-processing"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/lead-processing"
              value={webhookSettings.lead_processing_webhook}
              onChange={(e) => updateWebhookUrl('lead_processing_webhook', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Webhook für die allgemeine Lead-Verarbeitung und Batch-Übertragung
            </p>
          </div>

          {/* Email Verification Webhook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-verification">E-Mail-Verifizierung</Label>
              <StatusBadge url={webhookSettings.email_verification_webhook} />
            </div>
            <Input
              id="email-verification"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/email-verification"
              value={webhookSettings.email_verification_webhook}
              onChange={(e) => updateWebhookUrl('email_verification_webhook', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Webhook für E-Mail-Validierung und -Verifizierung
            </p>
          </div>

          {/* LinkedIn Analysis Webhook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="linkedin-analysis">LinkedIn-Analyse</Label>
              <StatusBadge url={webhookSettings.linkedin_analysis_webhook} />
            </div>
            <Input
              id="linkedin-analysis"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/linkedin-analysis"
              value={webhookSettings.linkedin_analysis_webhook}
              onChange={(e) => updateWebhookUrl('linkedin_analysis_webhook', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Webhook für persönliche und Unternehmens-LinkedIn-Analyse
            </p>
          </div>

          {/* Website Analysis Webhook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="website-analysis">Website-Analyse</Label>
              <StatusBadge url={webhookSettings.website_analysis_webhook} />
            </div>
            <Input
              id="website-analysis"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/website-analysis"
              value={webhookSettings.website_analysis_webhook}
              onChange={(e) => updateWebhookUrl('website_analysis_webhook', e.target.value)}
              onBlur={handleSave}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Webhook für Website-Analyse und Content-Extraktion
            </p>
          </div>
        </CardContent>
      </Card>

      {/* N8N Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>N8N Workflow-Vorlagen</CardTitle>
          <p className="text-sm text-gray-600">
            Beispiel-Workflows für deine N8N-Installation
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Basis-Workflow-Struktur:</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`1. Webhook Trigger
   └── Empfange Lead-Daten

2. E-Mail Validierung (falls aktiviert)
   └── Überprüfe E-Mail-Adresse
   └── Setze email_verification_status

3. LinkedIn-Analyse (falls aktiviert)
   └── Analysiere persönliches Profil
   └── Analysiere Unternehmens-Profil
   └── Setze analysis_text_personal_linkedin
   └── Setze analysis_text_company_linkedin

4. Website-Analyse (falls aktiviert)
   └── Analysiere Firmen-Website
   └── Setze analysis_text_website

5. Supabase Update
   └── Aktualisiere Lead mit Ergebnissen
   └── Setze entsprechende Boolean-Flags`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}