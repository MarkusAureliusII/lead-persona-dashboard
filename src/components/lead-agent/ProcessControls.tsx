
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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
        <CardTitle>4. Start Processing</CardTitle>
        <CardDescription>When you're ready, start the personalization process. Results will appear below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onStartProcessing} disabled={!isReady || isProcessing} className="w-full">
          <Play className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Start Personalization"}
        </Button>
        {!isReady && (
          <div className="text-xs text-muted-foreground mt-2">
            <p>Missing: {getMissingItems().join(", ")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
