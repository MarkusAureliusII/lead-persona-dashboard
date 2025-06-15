
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DollarSign, Mail } from "lucide-react";
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
        <div className="flex items-start space-x-2">
          <Checkbox
            id="email-verification"
            checked={options.emailVerification}
            onCheckedChange={(checked) => handleOptionChange('emailVerification', checked as boolean)}
            className="mt-1"
          />
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Live Email Validierung
            </Label>
            <p className="text-xs text-muted-foreground">
              15% bessere Zustellbarkeit bei deinen E-Mail Kampagnen
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
