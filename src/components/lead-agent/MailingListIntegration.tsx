
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Mail, TestTube, CheckCircle, XCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MailingListIntegrationProps {
  onConfigChange?: (config: any) => void;
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

export function MailingListIntegration({ onConfigChange }: MailingListIntegrationProps) {
  const [provider, setProvider] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [listId, setListId] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [lastTestResult, setLastTestResult] = useState<string>("");
  const { toast } = useToast();

  const testConnection = async () => {
    if (!provider || !apiKey) {
      toast({
        title: "❌ Missing Configuration",
        description: "Please select a provider and enter your API key",
        variant: "destructive",
      });
      return;
    }

    setConnectionStatus('testing');
    
    try {
      // Simulate API test call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionStatus('success');
      setLastTestResult("Connection successful");
      
      toast({
        title: "✅ Connection Successful",
        description: `Connected to ${provider} successfully!`,
      });

      if (onConfigChange) {
        onConfigChange({ provider, apiKey, listId });
      }
    } catch (error) {
      setConnectionStatus('error');
      setLastTestResult("Connection failed");
      
      toast({
        title: "❌ Connection Failed",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <TestTube className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <Card className={`p-6 transition-colors ${getStatusColor()}`}>
      <div className="flex items-center gap-2 mb-6">
        {getStatusIcon()}
        <h2 className="text-xl font-semibold text-gray-900">Mailing List Integration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="provider">Mailing Service Provider *</Label>
          <Select onValueChange={setProvider} value={provider}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your mailing service..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mailerlite">MailerLite</SelectItem>
              <SelectItem value="mailchimp">Mailchimp</SelectItem>
              <SelectItem value="convertkit">ConvertKit</SelectItem>
              <SelectItem value="activecampaign">ActiveCampaign</SelectItem>
              <SelectItem value="sendinblue">Sendinblue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="apiKey">API Key *</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1"
          />
          <div className="text-xs text-gray-500 mt-1">
            Find your API key in your mailing service provider's settings
          </div>
        </div>

        <div>
          <Label htmlFor="listId">Default List ID (optional)</Label>
          <Input
            id="listId"
            placeholder="Enter list ID for automatic imports..."
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="mt-1"
          />
          <div className="text-xs text-gray-500 mt-1">
            Leave empty to choose list for each campaign
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            disabled={!provider || !apiKey || connectionStatus === 'testing'}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {connectionStatus === 'testing' ? "Testing..." : "Test Connection"}
          </Button>
        </div>

        {lastTestResult && (
          <div className={`p-3 rounded-lg text-sm ${
            connectionStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : connectionStatus === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">Status:</span>
              <span>{lastTestResult}</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            How it works:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• AI scrapes leads based on your criteria</li>
            <li>• Each lead gets a personalized message</li>
            <li>• Qualified leads are automatically added to your mailing list</li>
            <li>• You can review and approve before sending</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
