
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PersonalizationConfig } from '@/types/leadAgent';
import { ProcessingResult } from '@/types/processing';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { BatchProcessingService } from '@/services/batchProcessing';
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

    console.log("🚀 Starting batch processing with:", {
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
      title: "Batch Processing Started",
      description: `Starting to process ${csvData.length} leads in a single batch. This should be much faster than individual processing.`,
    });

    try {
      // Process all leads in a single batch
      const batchResults = await BatchProcessingService.processBatch(
        csvData,
        personalizationConfig,
        webhookUrl,
        csvUploadId,
        updateLeadProcessingResult
      );

      // Update processing results with batch results
      setProcessingResults(batchResults);

      const { successCount, errorCount } = ProcessingResultsManager.getProcessingStats(batchResults);
      
      toast({
        title: "Batch Processing Complete",
        description: `Processed ${csvData.length} leads. ${successCount} successful, ${errorCount} errors.`,
      });

    } catch (error) {
      console.error('❌ Batch processing failed:', error);
      
      // Mark all as error if batch processing completely fails
      const errorResults = csvData.map((leadData, index) => ({
        index,
        leadData,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Batch processing failed'
      }));
      
      setProcessingResults(errorResults);
      
      toast({
        title: "Batch Processing Failed",
        description: "The batch processing failed. Please check your n8n configuration and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processingResults,
    startProcessing,
    setProcessingResults
  };
}
