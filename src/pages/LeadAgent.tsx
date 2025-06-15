
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { CsvUploadForm } from "@/components/lead-agent/CsvUploadForm";
import { PersonalizationForm } from "@/components/lead-agent/PersonalizationForm";
import { N8nConfiguration } from "@/components/lead-agent/N8nConfiguration";
import { N8nChatWidgetConfig } from "@/components/lead-agent/N8nChatWidgetConfig";
import { ChatSelector } from "@/components/lead-agent/ChatSelector";
import { ProcessControls } from "@/components/lead-agent/ProcessControls";
import { ProcessingDashboard } from "@/components/lead-agent/ProcessingDashboard";
import { LeadAgentChat } from "@/components/lead-agent/LeadAgentChat";
import { N8nChatWidget } from "@/components/lead-agent/N8nChatWidget";
import { PersonalizationConfig, TargetAudience, SearchParameters } from "@/types/leadAgent";
import { useCsvUpload } from "@/hooks/useCsvUpload";
import { useLeadProcessing } from "@/hooks/useLeadProcessing";
import { useCsvData } from "@/hooks/useCsvData";
import { useWebhookConfig } from "@/hooks/useWebhookConfig";
import { useN8nWidgetConfig } from "@/hooks/useN8nWidgetConfig";

const LeadAgent = () => {
  const { savePersonalizationConfig } = useCsvUpload();
  const { isProcessing, processingResults, startProcessing } = useLeadProcessing();
  const { csvFile, setCsvFile, csvData, setCsvData, csvUploadId, handleCsvDataProcessed } = useCsvData();
  const { webhookUrl, handleWebhookUrlChange } = useWebhookConfig();
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange
  } = useN8nWidgetConfig();
  
  const [personalizationConfig, setPersonalizationConfig] = useState<PersonalizationConfig>({
    productService: "",
    tonality: "Professional",
    language: "en",
    upsellOptions: {
      emailVerification: false
    },
    dataStreamingRestrictions: {
      websiteOnly: false,
      privateLinkedIn: false,
      companyLinkedIn: false
    }
  });

  const [chatMode, setChatMode] = useState<'custom' | 'widget'>('widget');
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({});
  
  // Auto-configure the webhook URL on component mount
  useEffect(() => {
    const autoWebhookUrl = "https://n8n-selfhost-u40339.vm.elestio.app/webhook/fa996958-1ecc-4644-bb93-34f060a170a3/chat";
    if (!webhookUrl) {
      handleWebhookUrlChange(autoWebhookUrl);
    }
    
    // Auto-configure widget URL and enable it
    if (!widgetUrl) {
      handleWidgetUrlChange(autoWebhookUrl);
      handleWidgetEnabledChange(true);
      handleCustomizationsChange({
        ...customizations,
        welcomeMessage: '🐱 Miau! Ich bin Ihr Lead-Jagd-Assistent mit Signal-Rausch-Optimierung! Wie kann ich Ihnen bei der Lead-Suche helfen?'
      });
    }
  }, []);
  
  // Target audience for the chat
  const targetAudience: TargetAudience = {
    industry: searchParameters.industry || "",
    companySize: searchParameters.companySize || "",
    jobTitle: searchParameters.jobTitle || "",
    location: searchParameters.location || "",
    techStack: searchParameters.techStack
  };

  const handleStartProcessing = async () => {
    await startProcessing(
      csvData,
      personalizationConfig,
      webhookUrl,
      csvUploadId,
      savePersonalizationConfig
    );
  };

  const handleParametersGenerated = (parameters: SearchParameters) => {
    setSearchParameters(parameters);
  };

  const isWidgetConfigured = isWidgetEnabled && widgetUrl.trim() !== '';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🐱 CSV Lead Personalization mit Katzen-Power</h1>
                <p className="text-gray-600">
                  Upload a CSV file with your leads, configure the personalization, and let our cat-powered AI do the work via your n8n webhook with signal-noise optimization! 🎯
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
                  <N8nChatWidgetConfig
                    widgetUrl={widgetUrl}
                    onWidgetUrlChange={handleWidgetUrlChange}
                    isEnabled={isWidgetEnabled}
                    onEnabledChange={handleWidgetEnabledChange}
                    customizations={customizations}
                    onCustomizationsChange={handleCustomizationsChange}
                  />
                </div>

                {/* Right Column - Controls, Chat and Dashboard */}
                <div className="space-y-8">
                  <ProcessControls
                    csvFile={csvFile}
                    webhookUrl={webhookUrl}
                    personalizationConfig={personalizationConfig}
                    isProcessing={isProcessing}
                    onStartProcessing={handleStartProcessing}
                  />
                  
                  <ChatSelector
                    chatMode={chatMode}
                    onChatModeChange={setChatMode}
                    isWidgetConfigured={isWidgetConfigured}
                  />

                  {chatMode === 'custom' ? (
                    <LeadAgentChat
                      onParametersGenerated={handleParametersGenerated}
                      targetAudience={targetAudience}
                      webhookUrl={webhookUrl}
                    />
                  ) : (
                    <N8nChatWidget
                      widgetUrl={widgetUrl}
                      customizations={customizations}
                      onParametersGenerated={handleParametersGenerated}
                    />
                  )}

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
