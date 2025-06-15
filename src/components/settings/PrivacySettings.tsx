
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Data Retention</p>
            <p className="text-sm text-gray-600">Keep scraped lead data for 90 days</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Analytics Tracking</p>
            <p className="text-sm text-gray-600">Allow usage analytics for service improvement</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="pt-4 border-t">
          <Button variant="destructive" size="sm">
            Delete All Data
          </Button>
          <p className="text-xs text-gray-500 mt-2">This action cannot be undone</p>
        </div>
      </CardContent>
    </Card>
  );
}
