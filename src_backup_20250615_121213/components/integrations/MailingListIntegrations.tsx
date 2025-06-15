
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Plus, 
  Settings, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

const mailingServices = [
  {
    id: "mailerlite",
    name: "MailerLite",
    status: "connected",
    subscribers: 12547,
    lastSync: "2 Stunden",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    status: "connected", 
    subscribers: 8934,
    lastSync: "1 Tag",
  },
  {
    id: "constantcontact",
    name: "Constant Contact",
    status: "error",
    subscribers: 0,
    lastSync: "Nie",
  },
];

export function MailingListIntegrations() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Verbunden</Badge>;
      case "error":
        return <Badge variant="destructive">Fehler</Badge>;
      default:
        return <Badge variant="secondary">Getrennt</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {mailingServices.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(service.status)}
            <div>
              <h4 className="font-medium text-gray-900">{service.name}</h4>
              <p className="text-sm text-gray-600">
                {service.subscribers > 0 
                  ? `${service.subscribers.toLocaleString()} Abonnenten`
                  : "Nicht konfiguriert"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(service.status)}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Neue E-Mail Integration hinzufügen
      </Button>
    </div>
  );
}
