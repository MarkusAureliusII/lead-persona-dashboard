
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function N8nConfigurationGuide() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "📋 Kopiert!",
        description: `${description} wurde in die Zwischenablage kopiert.`,
      });
    } catch (error) {
      toast({
        title: "❌ Fehler",
        description: "Konnte nicht in die Zwischenablage kopieren.",
        variant: "destructive",
      });
    }
  };

  const sampleWorkflow = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-agent",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "gpt-3.5-turbo",
        "messages": {
          "messageValues": [
            {
              "role": "system",
              "content": "Du bist ein AI-Assistent für Lead-Generierung. Antworte auf Deutsch und extrahiere Suchparameter aus der Benutzeranfrage."
            },
            {
              "role": "user", 
              "content": "={{ $json.message }}"
            }
          ]
        }
      },
      "id": "openai-node",
      "name": "OpenAI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": {
          "aiResponse": "={{ $json.choices[0].message.content }}",
          "searchParameters": {
            "industry": "Technologie",
            "jobTitle": "Manager", 
            "location": "Deutschland",
            "companySize": "50-200"
          }
        }
      },
      "id": "respond-node",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [680, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "OpenAI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    }
  }
}`;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          🐱 n8n Konfigurationshilfe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Häufige Probleme und Lösungen:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>"firstEntryJson" Fehler:</strong> Überprüfen Sie Ihre Workflow-Ausgabe</li>
              <li><strong>500 Server Error:</strong> Workflow-Logik oder API-Schlüssel prüfen</li>
              <li><strong>Timeout:</strong> Workflow zu langsam oder hängt</li>
              <li><strong>Keine Response:</strong> "Respond to Webhook" Node fehlt</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Empfohlene Workflow-Struktur
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <Badge className="mb-2">1. Webhook Trigger</Badge>
              <p className="text-sm text-gray-600">
                Empfängt POST-Requests vom Lead Agent
              </p>
              <ul className="text-xs text-gray-500 mt-2">
                <li>• HTTP Method: POST</li>
                <li>• Path: /lead-agent</li>
                <li>• Response Mode: Response Node</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <Badge className="mb-2">2. AI Processing</Badge>
              <p className="text-sm text-gray-600">
                OpenAI oder andere AI-Services
              </p>
              <ul className="text-xs text-gray-500 mt-2">
                <li>• Verarbeitet Benutzeranfrage</li>
                <li>• Extrahiert Parameter</li>
                <li>• Generiert Antwort</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <Badge className="mb-2">3. Response Node</Badge>
              <p className="text-sm text-gray-600">
                Sendet strukturierte Antwort zurück
              </p>
              <ul className="text-xs text-gray-500 mt-2">
                <li>• aiResponse: String</li>
                <li>• searchParameters: Object</li>
                <li>• JSON Format</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">📋 Beispiel-Workflow (Kopieren & Importieren)</h4>
          <div className="relative">
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-40">
              {sampleWorkflow}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(sampleWorkflow, "Beispiel-Workflow")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pro-Tipps für bessere Performance</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Verwenden Sie Timeouts in Ihren AI-Nodes (max. 30 Sekunden)</li>
            <li>• Implementieren Sie Error-Handling mit "On Error" Branches</li>
            <li>• Nutzen Sie "Set" Nodes für Datenverarbeitung</li>
            <li>• Testen Sie Ihren Workflow mit dem n8n-eigenen Test-Feature</li>
            <li>• Aktivieren Sie Workflow-Logs für besseres Debugging</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://docs.n8n.io/workflows/webhooks/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              n8n Webhook Docs
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Response Node Docs
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
