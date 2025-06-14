
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ProcessControlsProps {
  csvFile: File | null;
  webhookUrl: string;
  isProcessing: boolean;
  onStartProcessing: () => void;
}

export function ProcessControls({ csvFile, webhookUrl, isProcessing, onStartProcessing }: ProcessControlsProps) {
  const isReady = csvFile && webhookUrl;

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
          <p className="text-xs text-muted-foreground mt-2">
            Please upload a CSV file and configure your n8n webhook URL to begin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
