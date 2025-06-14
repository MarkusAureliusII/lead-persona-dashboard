import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { TargetAudienceForm } from "@/components/lead-agent/TargetAudienceForm";
import { LeadAgentChat } from "@/components/lead-agent/LeadAgentChat";
import { ApolloSearchPreview } from "@/components/lead-agent/ApolloSearchPreview";
import { SearchConfiguration } from "@/components/lead-agent/SearchConfiguration";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { useState } from "react";

export interface TargetAudience {
  industry: string;
  companySize: string;
  jobTitle: string;
  location: string;
  techStack?: string;
}

export interface SearchParameters {
  industry?: string;
  companySize?: string;
  jobTitle?: string;
  location?: string;
  techStack?: string;
  estimatedLeads?: number;
}

const LeadAgent = () => {
  const [targetAudience, setTargetAudience] = useState<TargetAudience>({
    industry: "",
    companySize: "",
    jobTitle: "",
    location: "",
    techStack: ""
  });

  const [searchParameters, setSearchParameters] = useState<SearchParameters>({});
  const [searchConfig, setSearchConfig] = useState({
    maxLeads: 100,
    qualityFilter: "high",
    exportFormat: "csv"
  });

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("n8n-webhook-url") || "";
  });

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("n8n-webhook-url", url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Agent</h1>
                <p className="text-gray-600">
                  Definieren Sie Ihre Zielgruppe und lassen Sie unseren AI-Agent die perfekten Suchparameter erstellen.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Linke Spalte */}
                <div className="space-y-8">
                  <TargetAudienceForm 
                    targetAudience={targetAudience}
                    onUpdate={setTargetAudience}
                  />
                  
                  <N8nConfiguration 
                    webhookUrl={webhookUrl}
                    onWebhookUrlChange={handleWebhookUrlChange}
                  />
                  
                  <LeadAgentChat 
                    onParametersGenerated={setSearchParameters}
                    targetAudience={targetAudience}
                    webhookUrl={webhookUrl}
                  />
                </div>

                {/* Rechte Spalte */}
                <div className="space-y-8">
                  <ApolloSearchPreview 
                    searchParameters={searchParameters}
                  />
                  
                  <SearchConfiguration 
                    config={searchConfig}
                    onConfigChange={setSearchConfig}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadAgent;
