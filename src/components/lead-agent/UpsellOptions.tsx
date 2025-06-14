
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { UpsellOptions as UpsellOptionsType } from "@/types/leadAgent";

interface UpsellOptionsProps {
  options: UpsellOptionsType;
  onOptionsChange: (options: UpsellOptionsType) => void;
}

export function UpsellOptions({ options, onOptionsChange }: UpsellOptionsProps) {
  const handleOptionChange = (key: keyof UpsellOptionsType, checked: boolean) => {
    onOptionsChange({
      ...options,
      [key]: checked
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Extra Services
        </CardTitle>
        <CardDescription>
          Wählen Sie zusätzliche Premium-Features aus, um Ihren Lead-Verarbeitungsworkflow zu verbessern.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="email-verification"
            checked={options.emailVerification}
            onCheckedChange={(checked) => handleOptionChange('emailVerification', checked as boolean)}
          />
          <Label htmlFor="email-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Live Email Validierung
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="premium-features"
            checked={options.premiumFeatures}
            onCheckedChange={(checked) => handleOptionChange('premiumFeatures', checked as boolean)}
          />
          <Label htmlFor="premium-features" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Bevorzugte Behandlung deiner Anfrage
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
