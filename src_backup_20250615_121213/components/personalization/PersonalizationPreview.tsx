
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  Send, 
  User,
  Building
} from "lucide-react";

export function PersonalizationPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          Nachrichten-Vorschau
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Max Mustermann</span>
            <Badge variant="secondary" className="text-xs">CTO</Badge>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">TechCorp GmbH</span>
          </div>
          <div className="bg-white p-3 rounded border text-sm">
            <p className="mb-2">
              <strong>Betreff:</strong> Innovative Lösungen für TechCorp GmbH
            </p>
            <p className="text-gray-700">
              Hallo Max,<br/><br/>
              ich habe gesehen, dass Sie als CTO bei TechCorp GmbH tätig sind. 
              Ihre Expertise in der Technologiebranche ist beeindruckend...
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Senden
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
