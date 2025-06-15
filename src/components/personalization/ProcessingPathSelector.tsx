
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  Target, 
  Cpu,
  ArrowRight
} from "lucide-react";

const processingPaths = [
  {
    id: "express",
    name: "Express Verarbeitung",
    description: "Schnelle Personalisierung mit Standard-Templates",
    duration: "2-5 Minuten",
    quality: "Standard",
    icon: Zap,
    color: "blue",
  },
  {
    id: "premium",
    name: "Premium Personalisierung",
    description: "Hochwertige, individuell angepasste Nachrichten",
    duration: "10-15 Minuten",
    quality: "Premium",
    icon: Target,
    color: "purple",
  },
  {
    id: "ai-enhanced",
    name: "KI-Enhanced",
    description: "Maximale Personalisierung mit fortgeschrittener KI",
    duration: "20-30 Minuten",
    quality: "Exzellent",
    icon: Cpu,
    color: "green",
  },
];

export function ProcessingPathSelector() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Verarbeitungspfad wählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processingPaths.map((path) => (
            <div
              key={path.id}
              className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${path.color}-100`}>
                  <path.icon className={`w-5 h-5 text-${path.color}-600`} />
                </div>
                <Badge variant="secondary">{path.quality}</Badge>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{path.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{path.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {path.duration}
                </div>
                <Button size="sm" variant="outline">
                  Wählen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
