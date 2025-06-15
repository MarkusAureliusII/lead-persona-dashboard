
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, Bot, TrendingUp, Zap, Target, MessageSquare, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-blue-800">Willkommen beim Lead Agent</h2>
          <p className="text-sm text-blue-700">
            Der AI-Chat ist jetzt aktiv! Klicke auf das Chat-Symbol unten rechts, um deine Lead-Suche zu starten.
          </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.284</div>
            <p className="text-xs text-muted-foreground">+18% seit letztem Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personalisierungs-Rate</CardTitle>
            <Wand2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">+5% seit letztem Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% seit letztem Monat</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Schnellzugriff
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/lead-agent" className="block">
            <Button variant="outline" className="w-full justify-center h-12">
              <Bot className="w-5 h-5 mr-2" />
              Lead Agent
            </Button>
          </Link>
          <Link to="/personalization" className="block">
            <Button variant="outline" className="w-full justify-center h-12">
              <MessageSquare className="w-5 h-5 mr-2" />
              Personalisierung
            </Button>
          </Link>
          <Link to="/integrations" className="block">
            <Button variant="outline" className="w-full justify-center h-12">
              <Zap className="w-5 h-5 mr-2" />
              Integrationen
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
