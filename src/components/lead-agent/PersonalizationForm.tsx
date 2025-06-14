import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot } from "lucide-react";
import { PersonalizationConfig } from "@/types/leadAgent";

interface PersonalizationFormProps {
  config: PersonalizationConfig;
  onConfigChange: (config: PersonalizationConfig) => void;
}

export function PersonalizationForm({ config, onConfigChange }: PersonalizationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot /> 2. Configure Personalization</CardTitle>
        <CardDescription>Tell the AI about your product and the desired tone for the outreach messages.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="product-service">Your Product/Service</Label>
          <Textarea
            id="product-service"
            placeholder="Describe your product or service. What problem does it solve? Who is it for?"
            value={config.productService}
            onChange={(e) => onConfigChange({ ...config, productService: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tonality">Email Tonality</Label>
          <Select
            value={config.tonality}
            onValueChange={(value) => onConfigChange({ ...config, tonality: value })}
          >
            <SelectTrigger id="tonality" className="w-full mt-1">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
              <SelectItem value="Humorous">Humorous</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
