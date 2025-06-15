
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail } from "lucide-react";

export function PersonalizationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          AI Personalization Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tone">Message Tone</Label>
          <Input id="tone" placeholder="Professional and friendly" className="mt-1" />
          <p className="text-xs text-gray-500 mt-1">Describe the tone for AI-generated messages</p>
        </div>
        <div>
          <Label htmlFor="template">Message Template</Label>
          <textarea 
            id="template"
            className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
            rows={4}
            placeholder="Hi [Name], I noticed your work at [Company] in [Industry]..."
          />
          <p className="text-xs text-gray-500 mt-1">Use [Name], [Company], [Industry] as placeholders</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Auto-approve personalized messages</p>
            <p className="text-sm text-gray-600">Automatically send to mailing lists without review</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
}
