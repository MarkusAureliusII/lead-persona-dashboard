
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";
import { PersonalizationConfig } from "@/types/leadAgent";

interface ProcessControlsProps {
  csvFile: File | null;
  webhookUrl: string;
  personalizationConfig: PersonalizationConfig;
  isProcessing: boolean;
  onStartProcessing: () => void;
}

export function ProcessControls({ 
  csvFile, 
  webhookUrl, 
  personalizationConfig,
  isProcessing, 
  onStartProcessing 
}: ProcessControlsProps) {
  const isReady = csvFile && webhookUrl && personalizationConfig.productService.trim();

  const getMissingItems = () => {
    const missing = [];
    if (!csvFile) missing.push("CSV file");
    if (!webhookUrl) missing.push("n8n webhook URL");
    if (!personalizationConfig.productService.trim()) missing.push("product/service description");
    return missing;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          4. Start Individual Processing
        </CardTitle>
        <CardDescription>
          Process each lead individually with real-time status updates. You'll see live progress as each lead is processed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onStartProcessing} disabled={!isReady || isProcessing} className="w-full">
          <Play className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing Leads..." : "Start Individual Personalization"}
        </Button>
        {!isReady && (
          <div className="text-xs text-muted-foreground mt-2">
            <p>Missing: {getMissingItems().join(", ")}</p>
          </div>
        )}
        {isReady && (
          <div className="text-xs text-green-600 mt-2">
            <p>✓ Ready for individual processing - you'll see live updates for each lead</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
