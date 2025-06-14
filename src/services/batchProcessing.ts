
import { N8nService } from '@/services/n8n';
import { PersonalizationConfig } from '@/types/leadAgent';
import { ProcessingResult } from '@/types/processing';

export class BatchProcessingService {
  static async processBatch(
    csvData: any[],
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    csvUploadId: string,
    updateLeadProcessingResult: (
      csvUploadId: string, 
      rowIndex: number, 
      status: 'pending' | 'processing' | 'success' | 'error',
      personalizedMessage?: string,
      errorMessage?: string
    ) => Promise<boolean>
  ): Promise<ProcessingResult[]> {
    console.log(`🚀 Starting batch processing for ${csvData.length} leads`);
    
    // Update all leads to processing status
    for (let i = 0; i < csvData.length; i++) {
      await updateLeadProcessingResult(csvUploadId, i, 'processing');
    }

    const n8nService = new N8nService(webhookUrl);
    const requestPayload = {
      message: `Please process this batch of leads and create personalized outreach messages for each one using the following context:
      
Product/Service: ${personalizationConfig.productService}
Desired Tone: ${personalizationConfig.tonality}

Please return an array of results with personalized messages for each lead.`,
      targetAudience: {
        industry: "Batch Processing",
        companySize: "Multiple",
        jobTitle: "Multiple",
        location: "Multiple"
      },
      timestamp: new Date().toISOString(),
      batchData: {
        leads: csvData,
        personalizationConfig,
        csvUploadId
      }
    };

    try {
      const response = await n8nService.sendMessage(requestPayload);
      
      if (response.success && response.batchResults) {
        // Process batch results
        const results: ProcessingResult[] = [];
        
        for (const batchResult of response.batchResults) {
          const { index, success, personalizedMessage, error } = batchResult;
          
          if (success && personalizedMessage) {
            // Update success status in database
            await updateLeadProcessingResult(
              csvUploadId, 
              index, 
              'success', 
              personalizedMessage
            );
            
            results.push({
              index,
              leadData: csvData[index],
              status: 'success',
              result: response,
              personalizedMessage
            });
          } else {
            // Update error status in database
            await updateLeadProcessingResult(
              csvUploadId, 
              index, 
              'error', 
              undefined, 
              error || 'Processing failed'
            );
            
            results.push({
              index,
              leadData: csvData[index],
              status: 'error',
              error: error || 'Processing failed'
            });
          }
        }
        
        return results;
      } else {
        // Fallback: mark all as error if batch processing failed
        const results: ProcessingResult[] = [];
        const errorMessage = response.error || 'Batch processing failed';
        
        for (let i = 0; i < csvData.length; i++) {
          await updateLeadProcessingResult(
            csvUploadId, 
            i, 
            'error', 
            undefined, 
            errorMessage
          );
          
          results.push({
            index: i,
            leadData: csvData[i],
            status: 'error',
            error: errorMessage
          });
        }
        
        return results;
      }
    } catch (error) {
      console.error(`❌ Error in batch processing:`, error);
      
      // Mark all leads as error
      const results: ProcessingResult[] = [];
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      for (let i = 0; i < csvData.length; i++) {
        await updateLeadProcessingResult(
          csvUploadId, 
          i, 
          'error', 
          undefined, 
          errorMessage
        );
        
        results.push({
          index: i,
          leadData: csvData[i],
          status: 'error',
          error: errorMessage
        });
      }
      
      return results;
    }
  }
}
