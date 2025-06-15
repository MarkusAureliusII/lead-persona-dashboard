
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User, Building2, Globe, Clock } from "lucide-react";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Persönliche Informationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Vorname</Label>
              <Input id="firstName" placeholder="Max" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lastName">Nachname</Label>
              <Input id="lastName" placeholder="Mustermann" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input id="email" type="email" placeholder="max@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input id="phone" type="tel" placeholder="+49 123 456789" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Unternehmensinformationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company">Unternehmen</Label>
            <Input id="company" placeholder="Muster GmbH" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="jobTitle">Position</Label>
            <Input id="jobTitle" placeholder="Marketing Manager" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="industry">Branche</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Branche auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technologie</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Vertrieb</SelectItem>
                <SelectItem value="consulting">Beratung</SelectItem>
                <SelectItem value="finance">Finanzen</SelectItem>
                <SelectItem value="healthcare">Gesundheitswesen</SelectItem>
                <SelectItem value="education">Bildung</SelectItem>
                <SelectItem value="other">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://www.example.com" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Lokalisierung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Sprache</Label>
              <Select defaultValue="de">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Zeitzone</Label>
              <Select defaultValue="europe/berlin">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe/berlin">Europe/Berlin (CET)</SelectItem>
                  <SelectItem value="europe/london">Europe/London (GMT)</SelectItem>
                  <SelectItem value="america/new_york">America/New_York (EST)</SelectItem>
                  <SelectItem value="america/los_angeles">America/Los_Angeles (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="currency">Währung</Label>
            <Select defaultValue="eur">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Arbeitszeiten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workStart">Arbeitsbeginn</Label>
              <Input id="workStart" type="time" defaultValue="09:00" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="workEnd">Arbeitsende</Label>
              <Input id="workEnd" type="time" defaultValue="17:00" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wochenend-Benachrichtigungen</p>
              <p className="text-sm text-gray-600">Benachrichtigungen am Wochenende erhalten</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Änderungen speichern</Button>
      </div>
    </div>
  );
}
