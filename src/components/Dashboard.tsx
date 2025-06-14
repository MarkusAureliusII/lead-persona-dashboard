
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Mail, 
  Bot,
  TrendingUp,
  Zap,
  Target
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Leads Scraped Today
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">247</div>
            <p className="text-xs text-green-600 mt-1">
              +23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Personalized Messages
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">189</div>
            <p className="text-xs text-blue-600 mt-1">
              76% personalization rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Sent to Mailing Lists
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-green-600 mt-1">
              +12% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start space-x-3 h-12 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Bot className="w-5 h-5" />
              <span>Start Lead Scraping</span>
            </Button>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              💡 <strong>Tip:</strong> Describe your ideal customer profile to our AI agent, and it will automatically scrape, personalize, and add qualified leads to your mailing lists.
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SaaS CTOs Campaign</p>
                <p className="text-sm text-gray-600">47 leads → MailerLite</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">✅ Completed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Fintech Marketing Managers</p>
                <p className="text-sm text-gray-600">23 leads personalizing...</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">🔄 In Progress</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Startup HR Directors</p>
                <p className="text-sm text-gray-600">12 leads scraped</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600">⏳ Pending</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
