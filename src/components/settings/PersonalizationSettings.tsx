
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Wand2, Brain, MessageSquare, Target } from "lucide-react";

export function PersonalizationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            KI-Personalisierung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatische Personalisierung</p>
              <p className="text-sm text-gray-600">KI-gestützte Nachrichten automatisch generieren</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Erweiterte Kontextanalyse</p>
              <p className="text-sm text-gray-600">Tiefergehende Analyse der Lead-Daten</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div>
            <Label htmlFor="tone">Nachrichtenton</Label>
            <Select defaultValue="professional-friendly">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professionell</SelectItem>
                <SelectItem value="professional-friendly">Professionell & Freundlich</SelectItem>
                <SelectItem value="casual">Locker</SelectItem>
                <SelectItem value="direct">Direkt</SelectItem>
                <SelectItem value="consultative">Beratend</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Grundton für KI-generierte Nachrichten</p>
          </div>

          <div>
            <Label htmlFor="creativity">Kreativitätslevel</Label>
            <Select defaultValue="balanced">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Konservativ</SelectItem>
                <SelectItem value="balanced">Ausgewogen</SelectItem>
                <SelectItem value="creative">Kreativ</SelectItem>
                <SelectItem value="experimental">Experimentell</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Wie kreativ sollen die generierten Nachrichten sein</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Nachrichtenvorlagen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template">Haupt-Vorlage</Label>
            <Textarea 
              id="template"
              className="mt-1"
              rows={4}
              placeholder="Hallo [Name], ich habe Ihre Arbeit bei [Company] im Bereich [Industry] bemerkt..."
              defaultValue="Hallo [Name],

ich bin auf Ihr Unternehmen [Company] aufmerksam geworden und finde Ihre Arbeit im Bereich [Industry] sehr interessant.

[PersonalizedContent]

Würde mich über ein kurzes Gespräch freuen!

Beste Grüße"
            />
            <p className="text-xs text-gray-500 mt-1">Verwende [Name], [Company], [Industry], [PersonalizedContent] als Platzhalter</p>
          </div>

          <div>
            <Label htmlFor="followupTemplate">Follow-up Vorlage</Label>
            <Textarea 
              id="followupTemplate"
              className="mt-1"
              rows={3}
              placeholder="Hallo [Name], ich wollte nochmal kurz nachfragen..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Vorlagen automatisch verwenden</p>
              <p className="text-sm text-gray-600">Nachrichten ohne manuelle Überprüfung versenden</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Zielgruppen-Segmentierung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Branchenspezifische Anpassung</p>
              <p className="text-sm text-gray-600">Nachrichten an Branche des Leads anpassen</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Unternehmensgrößen-Segmentierung</p>
              <p className="text-sm text-gray-600">Verschiedene Ansätze für verschiedene Unternehmensgrößen</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Geografische Anpassung</p>
              <p className="text-sm text-gray-600">Lokale Referenzen und kulturelle Anpassungen</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            KI-Modell Einstellungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="aiModel">KI-Modell</Label>
            <Select defaultValue="gpt-4">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4 (Empfohlen)</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 (Schneller)</SelectItem>
                <SelectItem value="claude">Claude (Alternative)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxTokens">Maximale Nachrichtenlänge</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Kurz (~100 Wörter)</SelectItem>
                <SelectItem value="medium">Mittel (~200 Wörter)</SelectItem>
                <SelectItem value="long">Lang (~300 Wörter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperatur</Label>
              <Input 
                id="temperature" 
                type="number" 
                min="0" 
                max="1" 
                step="0.1" 
                defaultValue="0.7" 
                className="mt-1" 
              />
              <p className="text-xs text-gray-500 mt-1">0 = konsistent, 1 = kreativ</p>
            </div>
            <div>
              <Label htmlFor="responseCount">Anzahl Varianten</Label>
              <Select defaultValue="3">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Variante</SelectItem>
                  <SelectItem value="3">3 Varianten</SelectItem>
                  <SelectItem value="5">5 Varianten</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Vorschau generieren</Button>
        <Button>Einstellungen speichern</Button>
      </div>
    </div>
  );
}
