
import { Info } from "lucide-react";

export function N8nSetupRecommendations() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
        <Info className="w-4 h-4" />
        n8n Workflow Setup Empfehlungen:
      </h3>
      <div className="space-y-3 text-sm text-blue-800">
        <div>
          <h4 className="font-medium">🎯 Optimale Konfiguration:</h4>
          <ul className="mt-1 space-y-1">
            <li>• Webhook Trigger: Akzeptiert POST-Requests</li>
            <li>• Response Format: JSON mit "aiResponse" Feld</li>
            <li>• Optional: "searchParameters" Objekt für strukturierte Daten</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">✅ Unterstützte Response-Formate:</h4>
          <ul className="mt-1 space-y-1">
            <li>• JSON: <code>{`{"aiResponse": "Ihre AI-Antwort"}`}</code></li>
            <li>• Text: Einfache Textantworten werden auch verarbeitet</li>
            <li>• HTML: Wird erkannt, aber nicht empfohlen</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">🔧 Troubleshooting:</h4>
          <ul className="mt-1 space-y-1">
            <li>• Test-Payload wird mit 'test: true' Feld gesendet</li>
            <li>• Überprüfen Sie die Logs in n8n für Details</li>
            <li>• Stellen Sie sicher, dass der Workflow aktiviert ist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
