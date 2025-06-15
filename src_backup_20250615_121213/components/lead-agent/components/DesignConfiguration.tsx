
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from 'lucide-react';

interface DesignConfigurationProps {
  theme: string;
  position: string;
  language: string;
  onThemeChange: (theme: string) => void;
  onPositionChange: (position: string) => void;
  onLanguageChange: (language: string) => void;
}

export function DesignConfiguration({
  theme,
  position,
  language,
  onThemeChange,
  onPositionChange,
  onLanguageChange
}: DesignConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Design & Darstellung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Farbschema</Label>
            <Select value={theme} onValueChange={onThemeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Hell</SelectItem>
                <SelectItem value="dark">Dunkel</SelectItem>
                <SelectItem value="auto">Automatisch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Position</Label>
            <Select value={position} onValueChange={onPositionChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Unten rechts</SelectItem>
                <SelectItem value="bottom-left">Unten links</SelectItem>
                <SelectItem value="top-right">Oben rechts</SelectItem>
                <SelectItem value="top-left">Oben links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Sprache</Label>
          <Select value={language} onValueChange={onLanguageChange}>
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
      </CardContent>
    </Card>
  );
}
