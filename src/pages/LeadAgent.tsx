import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useState } from "react";
import { CsvUploadForm } from "@/components/lead-agent/CsvUploadForm";
import { PersonalizationForm } from "@/components/lead-agent/PersonalizationForm";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { ProcessControls } from "@/components/lead-agent/ProcessControls";
import { ProcessingDashboard } from "@/components/lead-agent/ProcessingDashboard";
import { PersonalizationConfig } from "@/types/leadAgent";
import { useCsvUpload } from "@/hooks/useCsvUpload";
import { useLeadProcessing } from "@/hooks/useLeadProcessing";
import { useCsvData } from "@/hooks/useCsvData";
import { useWebhookConfig } from "@/hooks/useWebhookConfig";

const LeadAgent = () => {
  const { savePersonalizationConfig } = useCsvUpload();
  const { isProcessing, processingResults, startProcessing } = useLeadProcessing();
  const { csvFile, setCsvFile, csvData, setCsvData, csvUploadId, handleCsvDataProcessed } = useCsvData();
  const { webhookUrl, handleWebhookUrlChange } = useWebhookConfig();
  
  const [personalizationConfig, setPersonalizationConfig] = useState<PersonalizationConfig>({
    productService: "",
    tonality: "Professional",
    language: "en", // Default to English
    upsellOptions: {
      emailVerification: false
    },
    dataStreamingRestrictions: {
      websiteOnly: false,
      privateLinkedIn: false,
      companyLinkedIn: false
    }
  });

  const handleStartProcessing = async () => {
    await startProcessing(
      csvData,
      personalizationConfig,
      webhookUrl,
      csvUploadId,
      savePersonalizationConfig
    );
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">CSV Lead Personalization</h1>
                <p className="text-gray-600">
                  Upload a CSV file with your leads, configure the personalization, and let our AI do the work via your n8n webhook.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Configuration */}
                <div className="space-y-8">
                  <CsvUploadForm 
                    onFileSelect={setCsvFile} 
                    setCsvData={setCsvData}
                    onDataProcessed={handleCsvDataProcessed}
                  />
                  <PersonalizationForm 
                    config={personalizationConfig}
                    onConfigChange={setPersonalizationConfig} 
                  />
                  <N8nConfiguration 
                    webhookUrl={webhookUrl}
                    onWebhookUrlChange={handleWebhookUrlChange}
                  />
                </div>

                {/* Right Column - Controls and Dashboard */}
                <div className="space-y-8">
                   <ProcessControls
                    csvFile={csvFile}
                    webhookUrl={webhookUrl}
                    personalizationConfig={personalizationConfig}
                    isProcessing={isProcessing}
                    onStartProcessing={handleStartProcessing}
                  />
                  <ProcessingDashboard
                    csvData={csvData}
                    processingResults={processingResults}
                    isProcessing={isProcessing}
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
