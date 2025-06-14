
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Database, Globe, Linkedin } from "lucide-react";
import { DataStreamingRestrictions as DataStreamingRestrictionsType } from "@/types/leadAgent";

interface DataStreamingRestrictionsProps {
  restrictions: DataStreamingRestrictionsType;
  onRestrictionsChange: (restrictions: DataStreamingRestrictionsType) => void;
}

export function DataStreamingRestrictions({ restrictions, onRestrictionsChange }: DataStreamingRestrictionsProps) {
  const handleRestrictionChange = (key: keyof DataStreamingRestrictionsType, checked: boolean) => {
    onRestrictionsChange({
      ...restrictions,
      [key]: checked
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Datenquellen für Personalisierung
        </CardTitle>
        <CardDescription>
          Wählen Sie aus, welche Datenquellen für die Personalisierung Ihrer Nachrichten verwendet werden sollen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="website-only"
            checked={restrictions.websiteOnly}
            onCheckedChange={(checked) => handleRestrictionChange('websiteOnly', checked as boolean)}
          />
          <Label htmlFor="website-only" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="private-linkedin"
            checked={restrictions.privateLinkedIn}
            onCheckedChange={(checked) => handleRestrictionChange('privateLinkedIn', checked as boolean)}
          />
          <Label htmlFor="private-linkedin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            Privates LinkedIn Profil
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="company-linkedin"
            checked={restrictions.companyLinkedIn}
            onCheckedChange={(checked) => handleRestrictionChange('companyLinkedIn', checked as boolean)}
          />
          <Label htmlFor="company-linkedin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            Unternehmens LinkedIn Profil
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
