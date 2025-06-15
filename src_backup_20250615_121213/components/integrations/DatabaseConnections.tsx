
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Plus, 
  Settings, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

const databases = [
  {
    id: "supabase-main",
    name: "Supabase (Haupt-DB)",
    type: "PostgreSQL",
    status: "connected",
    lastSync: "Live",
    records: 15847,
  },
  {
    id: "airtable-crm",
    name: "Airtable CRM",
    type: "Airtable",
    status: "connected",
    lastSync: "30 Minuten",
    records: 3456,
  },
];

export function DatabaseConnections() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-400" />;
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
      {databases.map((db) => (
        <div
          key={db.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(db.status)}
            <div>
              <h4 className="font-medium text-gray-900">{db.name}</h4>
              <p className="text-sm text-gray-600">
                {db.type} • {db.records.toLocaleString()} Datensätze
              </p>
              <p className="text-xs text-gray-500">
                Letzter Sync: {db.lastSync}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(db.status)}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Neue Datenbank-Verbindung
      </Button>
    </div>
  );
}
