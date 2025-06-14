
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
import { N8nService } from "@/services/n8n";
import { useCsvUpload } from "@/hooks/useCsvUpload";

interface ProcessingResult {
  index: number;
  leadData: any;
  status: 'pending' | 'processing' | 'success' | 'error';
  result?: any;
  error?: string;
  personalizedMessage?: string;
}

const LeadAgent = () => {
  const { toast } = useToast();
  const { createCsvUpload, saveCsvLeads, savePersonalizationConfig, updateLeadProcessingResult } = useCsvUpload();
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvUploadId, setCsvUploadId] = useState<string | null>(null);
  const [personalizationConfig, setPersonalizationConfig] = useState<PersonalizationConfig>({
    productService: "",
    tonality: "Professional",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("n8n-webhook-url") || "";
  });

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("n8n-webhook-url", url);
  };

  const handleCsvDataProcessed = async (file: File, data: any[]) => {
    console.log("📊 Processing CSV data for database storage:", { filename: file.name, rowCount: data.length });
    
    // Create CSV upload record in database
    const uploadId = await createCsvUpload(file.name, data.length);
    if (uploadId) {
      setCsvUploadId(uploadId);
      
      // Save CSV leads to database
      const success = await saveCsvLeads(uploadId, data);
      if (success) {
        toast({
          title: "CSV Data Saved",
          description: `Successfully saved ${data.length} leads to database.`,
        });
      }
    }
  };

  const processLead = async (leadData: any, index: number): Promise<ProcessingResult> => {
    console.log(`🔄 Processing lead ${index + 1}:`, leadData);
    
    // Update status to processing in database
    if (csvUploadId) {
      await updateLeadProcessingResult(csvUploadId, index, 'processing');
    }
    
    const n8nService = new N8nService(webhookUrl);
    const requestPayload = {
      message: `Please create a personalized outreach message for this lead using the following context:
      
Product/Service: ${personalizationConfig.productService}
Desired Tone: ${personalizationConfig.tonality}

Lead Information:
${Object.entries(leadData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Please generate a personalized message that addresses this specific lead's context and follows the specified tone.`,
      targetAudience: {
        industry: leadData.industry || leadData.companyName || "Unknown",
        companySize: leadData.companySize || "Unknown", 
        jobTitle: leadData.jobTitle || leadData.title || "Unknown",
        location: leadData.location || leadData.city || "Unknown",
        techStack: leadData.techStack || leadData.technology
      },
      timestamp: new Date().toISOString(),
      leadData: leadData
    };

    try {
      const response = await n8nService.sendMessage(requestPayload);
      
      if (response.success) {
        const result = {
          index,
          leadData,
          status: 'success' as const,
          result: response,
          personalizedMessage: response.aiResponse || response.message
        };

        // Update success status in database
        if (csvUploadId) {
          await updateLeadProcessingResult(
            csvUploadId, 
            index, 
            'success', 
            result.personalizedMessage
          );
        }

        return result;
      } else {
        const result = {
          index,
          leadData,
          status: 'error' as const,
          error: response.error || 'Processing failed'
        };

        // Update error status in database
        if (csvUploadId) {
          await updateLeadProcessingResult(
            csvUploadId, 
            index, 
            'error', 
            undefined, 
            result.error
          );
        }

        return result;
      }
    } catch (error) {
      console.error(`❌ Error processing lead ${index + 1}:`, error);
      const result = {
        index,
        leadData,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Update error status in database
      if (csvUploadId) {
        await updateLeadProcessingResult(
          csvUploadId, 
          index, 
          'error', 
          undefined, 
          result.error
        );
      }

      return result;
    }
  };

  const handleStartProcessing = async () => {
    if (!csvData.length || !webhookUrl || !personalizationConfig.productService) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have uploaded a CSV file, configured personalization, and set up n8n webhook.",
        variant: "destructive"
      });
      return;
    }

    if (!csvUploadId) {
      toast({
        title: "CSV Not Saved",
        description: "Please re-upload your CSV file to save it to the database first.",
        variant: "destructive"
      });
      return;
    }

    console.log("🚀 Starting processing with:", {
      leadCount: csvData.length,
      personalizationConfig,
      webhookUrl,
      csvUploadId
    });

    // Save personalization config to database
    await savePersonalizationConfig(
      csvUploadId, 
      personalizationConfig.productService, 
      personalizationConfig.tonality
    );

    setIsProcessing(true);
    
    // Initialize processing results
    const initialResults: ProcessingResult[] = csvData.map((leadData, index) => ({
      index,
      leadData,
      status: 'pending'
    }));
    setProcessingResults(initialResults);

    toast({
      title: "Processing Started",
      description: `Starting to process ${csvData.length} leads. This may take a few minutes.`,
    });

    // Process leads one by one to avoid overwhelming the webhook
    for (let i = 0; i < csvData.length; i++) {
      console.log(`📤 Processing lead ${i + 1}/${csvData.length}`);
      
      // Update status to processing
      setProcessingResults(prev => prev.map(result => 
        result.index === i ? { ...result, status: 'processing' } : result
      ));

      try {
        const result = await processLead(csvData[i], i);
        
        // Update with result
        setProcessingResults(prev => prev.map(existingResult => 
          existingResult.index === i ? result : existingResult
        ));

        // Small delay between requests to be respectful to the webhook
        if (i < csvData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error processing lead ${i + 1}:`, error);
        setProcessingResults(prev => prev.map(result => 
          result.index === i ? { ...result, status: 'error', error: 'Processing failed' } : result
        ));
      }
    }

    setIsProcessing(false);
    
    const successCount = processingResults.filter(r => r.status === 'success').length;
    const errorCount = processingResults.filter(r => r.status === 'error').length;
    
    toast({
      title: "Processing Complete",
      description: `Processed ${csvData.length} leads. ${successCount} successful, ${errorCount} errors.`,
    });
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
