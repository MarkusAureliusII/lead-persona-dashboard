
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
        <CardTitle>Design & Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
