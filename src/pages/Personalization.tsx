
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Play
} from "lucide-react";
import { LeadsList } from "@/components/personalization/LeadsList";
import { ProcessingPathSelector } from "@/components/personalization/ProcessingPathSelector";
import { PersonalizationPreview } from "@/components/personalization/PersonalizationPreview";

const Personalization = () => {
  // Mock function for enrichment action
  const handleEnrichmentAction = (leadId: string, service: string) => {
    console.log('Enrichment action for lead:', leadId, 'service:', service);
  };

  // Mock function for lead deletion
  const handleLeadDelete = (leadId: string) => {
    console.log('Delete lead:', leadId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ Personalization</h1>
                  <p className="text-gray-600">
                    Verwandeln Sie Ihre Leads in personalisierte Nachrichten mit KI-Power
                  </p>
                </div>
                <Button className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Neue Personalisierung starten
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Verfügbare Leads
                    </CardTitle>
                    <FileText className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <p className="text-xs text-blue-600 mt-1">
                      Bereit zur Personalisierung
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      In Bearbeitung
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">89</div>
                    <p className="text-xs text-yellow-600 mt-1">
                      Wird personalisiert
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Fertiggestellt
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">3,456</div>
                    <p className="text-xs text-green-600 mt-1">
                      Bereit zum Versand
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Fehler
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <p className="text-xs text-red-600 mt-1">
                      Benötigen Aufmerksamkeit
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  <ProcessingPathSelector />
                  <LeadsList />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <PersonalizationPreview />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-purple-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        Vorschau aller Nachrichten
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Als CSV exportieren
                      </Button>
                      <Button className="w-full justify-start">
                        <Play className="w-4 h-4 mr-2" />
                        Batch-Verarbeitung starten
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Personalization;
