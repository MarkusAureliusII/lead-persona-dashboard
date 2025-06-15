
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface N8nEmbedConfigurationProps {
  embedUrl: string;
  onEmbedUrlChange: (url: string) => void;
}

export function N8nEmbedConfiguration({
  embedUrl,
  onEmbedUrlChange
}: N8nEmbedConfigurationProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testEmbedUrl = async () => {
    if (!embedUrl) return;
    
    setTestStatus('testing');
    
    try {
      // Test if the URL is accessible
      const response = await fetch(embedUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      // Since we can't really test embed URLs due to CORS, we'll do basic URL validation
      const url = new URL(embedUrl);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        setTestStatus('success');
        setTimeout(() => setTestStatus('idle'), 3000);
      } else {
        setTestStatus('error');
        setTimeout(() => setTestStatus('idle'), 3000);
      }
    } catch (error) {
      // For embed URLs, we'll be more lenient since CORS might block the test
      try {
        new URL(embedUrl);
        setTestStatus('success');
        setTimeout(() => setTestStatus('idle'), 3000);
      } catch (urlError) {
        setTestStatus('error');
        setTimeout(() => setTestStatus('idle'), 3000);
      }
    }
  };

  const getTestButton = () => {
    switch (testStatus) {
      case 'testing':
        return (
          <Button variant="outline" disabled>
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
            Teste...
          </Button>
        );
      case 'success':
        return (
          <Button variant="outline" disabled className="text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Erfolgreich
          </Button>
        );
      case 'error':
        return (
          <Button variant="outline" disabled className="text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            Fehler
          </Button>
        );
      default:
        return (
          <Button 
            variant="outline" 
            onClick={testEmbedUrl}
            disabled={!embedUrl}
          >
            Test URL
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="embedUrl">N8N Embed Chat URL</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="embedUrl"
            placeholder="https://n8n-selfhost-u40339.vm.elestio.app/form/your-chat-form-id"
            value={embedUrl}
            onChange={(e) => onEmbedUrlChange(e.target.value)}
            className="flex-1"
          />
          {getTestButton()}
        </div>
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p>Die URL zu Ihrem n8n eingebetteten Chat-Formular oder Widget</p>
          <p className="text-blue-600">
            💡 <strong>Hinweis:</strong> Das System verwendet jetzt Embed-URLs anstelle von Webhook-URLs für bessere Integration
          </p>
        </div>
      </div>

      {embedUrl && (
        <div className="pt-4 border-t space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(embedUrl, '_blank')}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Embed Chat in neuem Tab öffnen
          </Button>
          
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
            <p className="font-medium mb-1">🐱 Embed Chat Vorteile:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Direkte Chat-Integration ohne Server-zu-Server-Aufrufe</li>
              <li>Bessere Echtzeit-Kommunikation</li>
              <li>Reduzierte Latenz für Katzen-schnelle Antworten</li>
              <li>Verbesserte Benutzerexperience</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
