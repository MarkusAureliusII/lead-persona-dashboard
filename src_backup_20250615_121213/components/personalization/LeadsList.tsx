
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  Play, 
  User, 
  Building, 
  MapPin,
  Clock
} from "lucide-react";

const mockLeads = [
  {
    id: "1",
    name: "Max Mustermann",
    company: "TechCorp GmbH",
    position: "CTO",
    location: "Berlin, Deutschland",
    status: "pending",
    uploadedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Anna Schmidt",
    company: "StartupX",
    position: "Head of Marketing",
    location: "München, Deutschland",
    status: "processing",
    uploadedAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Thomas Weber",
    company: "InnovateGmbH",
    position: "CEO",
    location: "Hamburg, Deutschland",
    status: "completed",
    uploadedAt: "2024-01-14",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Wartend</Badge>;
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800">Verarbeitung</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Fertig</Badge>;
    case "error":
      return <Badge variant="destructive">Fehler</Badge>;
    default:
      return <Badge variant="secondary">Unbekannt</Badge>;
  }
};

export function LeadsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lead-Liste</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Alle verarbeiten
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{lead.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {lead.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {lead.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lead.uploadedAt}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{lead.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(lead.status)}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
