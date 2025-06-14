
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Clock,
  Upload,
  Bot,
  Send,
  Settings
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Statistiken Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verarbeitete Leads heute
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-green-600 mt-1">
              +12% seit gestern
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              E-Mail Öffnungsrate
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24.5%</div>
            <p className="text-xs text-green-600 mt-1">
              +2.1% diese Woche
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aktive Workflows
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-gray-600 mt-1">
              3 in Bearbeitung
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Konversionsrate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">18.2%</div>
            <p className="text-xs text-green-600 mt-1">
              +5.4% diese Woche
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Status */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Aktuelle Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Neue Lead-Kampagne</p>
                <p className="text-sm text-gray-600">500 Leads in Bearbeitung</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">75% abgeschlossen</p>
                <div className="w-20 h-2 bg-blue-200 rounded-full mt-1">
                  <div className="w-3/4 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Follow-up E-Mails</p>
                <p className="text-sm text-gray-600">1,200 E-Mails versendet</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Abgeschlossen</p>
                <div className="w-20 h-2 bg-green-200 rounded-full mt-1">
                  <div className="w-full h-2 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Personalisierung</p>
                <p className="text-sm text-gray-600">300 Leads ausstehend</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600">45% abgeschlossen</p>
                <div className="w-20 h-2 bg-yellow-200 rounded-full mt-1">
                  <div className="w-2/5 h-2 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Schnellaktionen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start space-x-3 h-12 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              <span>Neue Leads importieren</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              <Bot className="w-5 h-5" />
              <span>KI-Agent starten</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
              size="lg"
            >
              <Send className="w-5 h-5" />
              <span>E-Mail-Kampagne erstellen</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
              size="lg"
            >
              <Settings className="w-5 h-5" />
              <span>Einstellungen verwalten</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
