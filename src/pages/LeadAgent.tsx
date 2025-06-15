
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { N8nChatWidget } from "@/components/lead-agent/N8nChatWidget";
import { useN8nConfig } from "@/hooks/useN8nConfig";
import { ApolloSearchPreview } from "@/components/lead-agent/ApolloSearchPreview";
import { useState } from "react";
import type { SearchParameters } from "@/types/leadAgent";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const LeadAgent = () => {
  const { isEnabled, webhookUrl, customizations } = useN8nConfig();
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({});

  const handleParametersGenerated = (parameters: SearchParameters) => {
    console.log("Empfangene Suchparameter:", parameters);
    setSearchParameters(parameters);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isEnabled ? (
                <N8nChatWidget
                  webhookUrl={webhookUrl}
                  customizations={customizations}
                  onParametersGenerated={handleParametersGenerated}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-full p-10 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                    <h3 className="font-semibold">Chat-Widget ist deaktiviert</h3>
                    <p className="text-sm text-muted-foreground">Aktiviere das n8n-Widget in den Einstellungen, um den AI Lead Agent zu nutzen.</p>
                  </CardContent>
                </Card>
              )}
              
              <ApolloSearchPreview searchParameters={searchParameters} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadAgent;
