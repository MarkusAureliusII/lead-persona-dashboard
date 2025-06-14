
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Settings, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface N8nConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

export function N8nConfiguration({ webhookUrl, onWebhookUrlChange }: N8nConfigurationProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          message: "Connection test",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "n8n webhook connection test successful!",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the n8n webhook. Please check the URL.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">n8n Integration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="webhookUrl">n8n Webhook URL</Label>
          <Input
            id="webhookUrl"
            placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your n8n webhook URL to enable AI agent integration
          </p>
        </div>

        <Button
          onClick={testConnection}
          disabled={!webhookUrl || isTestingConnection}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <TestTube className="w-4 h-4 mr-2" />
          {isTestingConnection ? "Testing..." : "Test Connection"}
        </Button>
      </div>
    </Card>
  );
}
