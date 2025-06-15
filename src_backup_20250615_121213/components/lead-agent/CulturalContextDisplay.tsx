
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { CulturalContext } from "@/types/leadAgent";

interface CulturalContextDisplayProps {
  context: CulturalContext | null;
}

export function CulturalContextDisplay({ context }: CulturalContextDisplayProps) {
  if (!context) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          Kultureller Kontext
        </CardTitle>
        <CardDescription>
          Informationen zur Geschäftskultur für bessere Personalisierung
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {context.cultural_notes && (
          <div>
            <h4 className="font-medium text-sm text-blue-800 mb-2">Kulturelle Hinweise</h4>
            <p className="text-sm text-blue-700">{context.cultural_notes}</p>
          </div>
        )}
        
        {context.communication_style && (
          <div>
            <h4 className="font-medium text-sm text-blue-800 mb-2">Kommunikationsstil</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(context.communication_style as Record<string, string>).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {context.business_practices && (
          <div>
            <h4 className="font-medium text-sm text-blue-800 mb-2">Geschäftspraktiken</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(context.business_practices as Record<string, string>).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
