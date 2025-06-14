
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { TargetAudienceForm } from "@/components/lead-agent/TargetAudienceForm";
import { LeadAgentChat } from "@/components/lead-agent/LeadAgentChat";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { MailingListIntegration } from "@/components/lead-agent/MailingListIntegration";
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
  const [mailingConfig, setMailingConfig] = useState({});

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Lead Scraping & Personalization</h1>
                <p className="text-gray-600">
                  Describe your ideal customers to our AI agent. It will scrape leads, create personalized messages, and add them to your mailing lists.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Configuration */}
                <div className="space-y-8">
                  <TargetAudienceForm 
                    targetAudience={targetAudience}
                    onUpdate={setTargetAudience}
                  />
                  
                  <MailingListIntegration 
                    onConfigChange={setMailingConfig}
                  />
                  
                  <N8nConfiguration 
                    webhookUrl={webhookUrl}
                    onWebhookUrlChange={handleWebhookUrlChange}
                  />
                </div>

                {/* Right Column - AI Chat */}
                <div className="space-y-8">
                  <LeadAgentChat 
                    onParametersGenerated={setSearchParameters}
                    targetAudience={targetAudience}
                    webhookUrl={webhookUrl}
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
