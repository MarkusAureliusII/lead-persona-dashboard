
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Database, Filter, Zap, Clock } from "lucide-react";

export function LeadProcessingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Lead-Verarbeitung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatische Lead-Verarbeitung</p>
              <p className="text-sm text-gray-600">Leads automatisch nach dem Scraping verarbeiten</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">E-Mail-Validierung aktivieren</p>
              <p className="text-sm text-gray-600">E-Mail-Adressen automatisch validieren</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batchSize">Batch-Größe</Label>
              <Input id="batchSize" type="number" placeholder="50" defaultValue="50" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Anzahl Leads pro Verarbeitungsdurchgang</p>
            </div>
            <div>
              <Label htmlFor="processingDelay">Verarbeitungsintervall (Sekunden)</Label>
              <Input id="processingDelay" type="number" placeholder="30" defaultValue="30" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Pause zwischen Verarbeitungsdurchgängen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lead-Qualitätsfilter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Duplikate automatisch entfernen</p>
              <p className="text-sm text-gray-600">Leads mit identischen E-Mail-Adressen filtern</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ungültige E-Mails ausschließen</p>
              <p className="text-sm text-gray-600">Leads ohne gültige E-Mail-Adresse nicht verarbeiten</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <Label htmlFor="minQualityScore">Mindest-Qualitätsscore</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Niedrig (30%)</SelectItem>
                <SelectItem value="medium">Mittel (60%)</SelectItem>
                <SelectItem value="high">Hoch (80%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Nur Leads über diesem Score verarbeiten</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Datenaufbewahrung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataRetention">Aufbewahrungsdauer</Label>
            <Select defaultValue="90">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Tage</SelectItem>
                <SelectItem value="90">90 Tage</SelectItem>
                <SelectItem value="180">180 Tage</SelectItem>
                <SelectItem value="365">1 Jahr</SelectItem>
                <SelectItem value="forever">Unbegrenzt</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Wie lange Lead-Daten gespeichert werden</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatische Bereinigung</p>
              <p className="text-sm text-gray-600">Alte Daten automatisch löschen</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
