
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchConfig {
  maxLeads: number;
  qualityFilter: string;
  exportFormat: string;
}

interface SearchConfigurationProps {
  config: SearchConfig;
  onConfigChange: (config: SearchConfig) => void;
}

export function SearchConfiguration({ config, onConfigChange }: SearchConfigurationProps) {
  const handleConfigChange = (field: keyof SearchConfig, value: string | number) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  const qualityOptions = [
    { value: "high", label: "Hoch - Nur verifizierte E-Mails" },
    { value: "medium", label: "Mittel - Standard Qualitätskontrolle" },
    { value: "low", label: "Niedrig - Alle verfügbaren Daten" }
  ];

  const exportOptions = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "json", label: "JSON" }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Search Configuration</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="maxLeads">Maximale Anzahl Leads</Label>
          <Input
            id="maxLeads"
            type="number"
            min="1"
            max="10000"
            value={config.maxLeads}
            onChange={(e) => handleConfigChange("maxLeads", parseInt(e.target.value) || 100)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Empfohlen: 100-1000 Leads für optimale Qualität
          </p>
        </div>

        <div>
          <Label htmlFor="qualityFilter">Datenqualitäts-Filter</Label>
          <select
            id="qualityFilter"
            value={config.qualityFilter}
            onChange={(e) => handleConfigChange("qualityFilter", e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {qualityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="exportFormat">Export-Format</Label>
          <select
            id="exportFormat"
            value={config.exportFormat}
            onChange={(e) => handleConfigChange("exportFormat", e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {exportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full" size="lg">
            Lead Search starten
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Kosten: ~{Math.ceil(config.maxLeads * 0.15)}€ für {config.maxLeads} Leads
          </p>
        </div>
      </div>
    </Card>
  );
}
