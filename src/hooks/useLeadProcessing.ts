
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PersonalizationConfig } from '@/types/leadAgent';
import { ProcessingResult } from '@/types/processing';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { LeadProcessingService } from '@/services/leadProcessing';
import { ProcessingResultsManager } from '@/utils/processingResults';

export function useLeadProcessing() {
  const { toast } = useToast();
  const { updateLeadProcessingResult } = useCsvUpload();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);

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
    const initialResults = ProcessingResultsManager.initializeResults(csvData);
    setProcessingResults(initialResults);

    toast({
      title: "Processing Started",
      description: `Starting to process ${csvData.length} leads. This may take a few minutes.`,
    });

    // Process leads one by one to avoid overwhelming the webhook
    for (let i = 0; i < csvData.length; i++) {
      console.log(`📤 Processing lead ${i + 1}/${csvData.length}`);
      
      // Update status to processing
      setProcessingResults(prev => 
        ProcessingResultsManager.updateResultStatus(prev, i, 'processing')
      );

      try {
        const result = await LeadProcessingService.processLead(
          csvData[i], 
          i, 
          personalizationConfig, 
          webhookUrl, 
          csvUploadId,
          updateLeadProcessingResult
        );
        
        // Update with result
        setProcessingResults(prev => 
          ProcessingResultsManager.updateResultWithData(prev, result)
        );

        // Small delay between requests to be respectful to the webhook
        if (i < csvData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error processing lead ${i + 1}:`, error);
        setProcessingResults(prev => 
          ProcessingResultsManager.updateResultStatus(prev, i, 'error')
        );
      }
    }

    setIsProcessing(false);
    
    const { successCount, errorCount } = ProcessingResultsManager.getProcessingStats(processingResults);
    
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
