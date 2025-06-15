
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Mail, 
  Bot,
  TrendingUp,
  Zap,
  Target,
  MessageSquare,
  Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Aktionen
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/lead-agent">
            <Button 
              className="w-full justify-center space-x-3 h-12 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Bot className="w-5 h-5" />
              <span>AI Lead Agent starten</span>
            </Button>
          </Link>

          <Link to="/personalization">
            <Button 
              variant="outline"
              className="w-full justify-center space-x-3 h-12"
              size="lg"
            >
              <Wand2 className="w-5 h-5" />
              <span>Personalisierungen</span>
            </Button>
          </Link>

          <Link to="/integrations">
            <Button 
              variant="outline"
              className="w-full justify-center space-x-3 h-12"
              size="lg"
            >
              <Zap className="w-5 h-5" />
              <span>Integrationen</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Scraped Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personalized Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">76% personalization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent to Mailing Lists</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12% conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Letzte Aktivitäten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Hier können später dynamische Daten geladen werden */}
        </CardContent>
      </Card>
    </div>
  );
}
