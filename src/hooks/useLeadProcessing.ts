
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { N8nService } from '@/services/n8n';
import { PersonalizationConfig } from '@/types/leadAgent';
import { ProcessingResult } from '@/types/processing';
import { useCsvUpload } from '@/hooks/useCsvUpload';

export function useLeadProcessing() {
  const { toast } = useToast();
  const { updateLeadProcessingResult } = useCsvUpload();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);

  const processLead = async (
    leadData: any, 
    index: number, 
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    csvUploadId: string | null
  ): Promise<ProcessingResult> => {
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

  const startProcessing = async (
    csvData: any[],
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    csvUploadId: string | null,
    savePersonalizationConfig: (csvUploadId: string, productService: string, tonality: string) => Promise<boolean>
  ) => {
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
        const result = await processLead(csvData[i], i, personalizationConfig, webhookUrl, csvUploadId);
        
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

  return {
    isProcessing,
    processingResults,
    startProcessing,
    setProcessingResults
  };
}
