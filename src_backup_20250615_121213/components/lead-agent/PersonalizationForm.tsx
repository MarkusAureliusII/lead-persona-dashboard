
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot } from "lucide-react";
import { PersonalizationConfig } from "@/types/leadAgent";
import { UpsellOptions } from "./UpsellOptions";
import { DataStreamingRestrictions } from "./DataStreamingRestrictions";
import { LanguageSelector } from "./LanguageSelector";
import { CulturalContextDisplay } from "./CulturalContextDisplay";
import { useCulturalContexts } from "@/hooks/useCulturalContexts";

interface PersonalizationFormProps {
  config: PersonalizationConfig;
  onConfigChange: (config: PersonalizationConfig) => void;
}

export function PersonalizationForm({ config, onConfigChange }: PersonalizationFormProps) {
  const { getCulturalContextByLanguage } = useCulturalContexts();
  const currentContext = getCulturalContextByLanguage(config.language);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> 2. Personalisierung konfigurieren</CardTitle>
          <CardDescription>Erzählen Sie der KI von Ihrem Produkt und dem gewünschten Ton für die Outreach-Nachrichten.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-service">Ihr Produkt/Service</Label>
            <Textarea
              id="product-service"
              placeholder="Beschreiben Sie Ihr Produkt oder Ihren Service. Welches Problem löst es? Für wen ist es gedacht?"
              value={config.productService}
              onChange={(e) => onConfigChange({ ...config, productService: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tonality">E-Mail-Tonalität</Label>
            <Select
              value={config.tonality}
              onValueChange={(value) => onConfigChange({ ...config, tonality: value })}
            >
              <SelectTrigger id="tonality" className="w-full mt-1">
                <SelectValue placeholder="Wählen Sie einen Ton" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professionell</SelectItem>
                <SelectItem value="Friendly">Freundlich</SelectItem>
                <SelectItem value="Casual">Lässig</SelectItem>
                <SelectItem value="Direct">Direkt</SelectItem>
                <SelectItem value="Humorous">Humorvoll</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <LanguageSelector
        selectedLanguage={config.language}
        onLanguageChange={(language) => onConfigChange({ ...config, language })}
      />

      <CulturalContextDisplay context={currentContext} />

      <UpsellOptions
        options={config.upsellOptions}
        onOptionsChange={(upsellOptions) => onConfigChange({ ...config, upsellOptions })}
      />

      <DataStreamingRestrictions
        restrictions={config.dataStreamingRestrictions}
        onRestrictionsChange={(dataStreamingRestrictions) => onConfigChange({ ...config, dataStreamingRestrictions })}
      />
    </div>
  );
}
