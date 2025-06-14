
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

    console.log("🚀 Starting individual processing with live view:", {
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
      description: `Processing ${csvData.length} leads individually. You'll see real-time updates as each lead is processed.`,
    });

    try {
      // Process leads individually with live updates
      for (let i = 0; i < csvData.length; i++) {
        const leadData = csvData[i];
        
        // Update UI to show processing status
        setProcessingResults(prev => prev.map(result => 
          result.index === i 
            ? { ...result, status: 'processing' }
            : result
        ));

        try {
          const result = await LeadProcessingService.processLead(
            leadData,
            i,
            personalizationConfig,
            webhookUrl,
            csvUploadId,
            updateLeadProcessingResult
          );

          // Update UI with result
          setProcessingResults(prev => prev.map(existingResult => 
            existingResult.index === i ? result : existingResult
          ));

          console.log(`✅ Lead ${i + 1} processed successfully`);
        } catch (error) {
          console.error(`❌ Error processing lead ${i + 1}:`, error);
          
          // Update UI with error
          setProcessingResults(prev => prev.map(result => 
            result.index === i 
              ? { ...result, status: 'error', error: error instanceof Error ? error.message : 'Processing failed' }
              : result
          ));
        }

        // Small delay to show live updates
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const finalResults = await new Promise<ProcessingResult[]>((resolve) => {
        setProcessingResults(current => {
          const { successCount, errorCount } = ProcessingResultsManager.getProcessingStats(current);
          
          toast({
            title: "Processing Complete",
            description: `Processed ${csvData.length} leads. ${successCount} successful, ${errorCount} errors.`,
          });
          
          resolve(current);
          return current;
        });
      });

    } catch (error) {
      console.error('❌ Processing failed:', error);
      
      toast({
        title: "Processing Failed",
        description: "Lead processing failed. Please check your n8n configuration and try again.",
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
