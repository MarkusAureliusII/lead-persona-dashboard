
import { N8nService } from '@/services/n8n';
import { PersonalizationConfig } from '@/types/leadAgent';

export interface ProcessingResult {
  index: number;
  leadData: any;
  status: 'success' | 'error';
  result?: any;
  personalizedMessage?: string;
  error?: string;
}

export class LeadProcessingService {
  static async processLeadsBatch(
    leads: Array<{ data: any; index: number }>,
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    onProgress?: (results: ProcessingResult[]) => void
  ): Promise<ProcessingResult[]> {
    console.log(`🔄 Processing all ${leads.length} leads in a single batch`);
    
    const results = await this.processBatch(
      leads,
      personalizationConfig,
      webhookUrl,
      onProgress
    );
    
    return results;
  }

  private static async processBatch(
    leads: Array<{ data: any; index: number }>,
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    onProgress?: (results: ProcessingResult[]) => void
  ): Promise<ProcessingResult[]> {
    const n8nService = new N8nService(webhookUrl);
    
    const batchPayload = {
      chatInput: `Please create personalized outreach messages for the following ${leads.length} leads using the specified context:

Product/Service: ${personalizationConfig.productService}
Desired Tone: ${personalizationConfig.tonality}

Please process each lead and return an array of personalized messages in the same order as the leads provided.`,
      leads: leads.map(({ data, index }) => ({
        index,
        leadData: data,
        targetAudience: {
          industry: data.industry || data.companyName || "Unknown",
          companySize: data.companySize || "Unknown", 
          jobTitle: data.jobTitle || data.title || "Unknown",
          location: data.location || data.city || "Unknown",
          techStack: data.techStack || data.technology
        }
      })),
      timestamp: new Date().toISOString(),
      upsellOptions: personalizationConfig.upsellOptions,
      dataStreamingRestrictions: personalizationConfig.dataStreamingRestrictions,
      batchMode: true,
      batchSize: leads.length
    };

    try {
      const response = await n8nService.sendMessage(batchPayload);
      
      if (response.success && response.batchResults) {
        const results: ProcessingResult[] = [];
        
        for (let i = 0; i < leads.length; i++) {
          const { data: leadData, index } = leads[i];
          const batchResult = response.batchResults[i];
          
          if (batchResult?.success) {
            const result = {
              index,
              leadData,
              status: 'success' as const,
              result: batchResult,
              personalizedMessage: batchResult.aiResponse || batchResult.message
            };

            results.push(result);
          } else {
            const result = {
              index,
              leadData,
              status: 'error' as const,
              error: batchResult?.error || 'Batch processing failed for this lead'
            };

            results.push(result);
          }
        }
        
        if (onProgress) {
          onProgress(results);
        }
        
        return results;
      } else {
        const errorResults = leads.map(({ data: leadData, index }) => ({
          index,
          leadData,
          status: 'error' as const,
          error: response.error || 'Batch processing failed'
        }));
        
        if (onProgress) {
          onProgress(errorResults);
        }
        
        return errorResults;
      }
    } catch (error) {
      console.error(`❌ Error processing batch:`, error);
      const errorResults = leads.map(({ data: leadData, index }) => ({
        index,
        leadData,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown batch error'
      }));
      
      if (onProgress) {
        onProgress(errorResults);
      }
      
      return errorResults;
    }
  }

}
