import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useState } from "react";
import { CsvUploadForm } from "@/components/lead-agent/CsvUploadForm";
import { PersonalizationForm } from "@/components/lead-agent/PersonalizationForm";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { ProcessControls } from "@/components/lead-agent/ProcessControls";
import { ProcessingDashboard } from "@/components/lead-agent/ProcessingDashboard";
import { useToast } from "@/hooks/use-toast";
import { PersonalizationConfig } from "@/types/leadAgent";

const LeadAgent = () => {
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [personalizationConfig, setPersonalizationConfig] = useState<PersonalizationConfig>({
    productService: "",
    tonality: "Professional",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<any[]>([]);

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("n8n-webhook-url") || "";
  });

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("n8n-webhook-url", url);
  };

  const handleStartProcessing = () => {
    console.log("Starting processing with:", {
      csvData,
      personalizationConfig,
      webhookUrl,
    });
    toast({
      title: "Processing Started",
      description: "This is a placeholder. The processing logic will be implemented next.",
    });
    // Placeholder logic. Will be implemented in the next step.
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing Finished",
        description: "This is a placeholder.",
      });
    }, 3000);
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
