
import { N8nService } from '@/services/n8n';
import { PersonalizationConfig } from '@/types/leadAgent';
import { ProcessingResult } from '@/types/processing';

export class LeadProcessingService {
  static async processLead(
    leadData: any, 
    index: number, 
    personalizationConfig: PersonalizationConfig,
    webhookUrl: string,
    csvUploadId: string | null,
    updateLeadProcessingResult: (
      csvUploadId: string, 
      rowIndex: number, 
      status: 'pending' | 'processing' | 'success' | 'error',
      personalizedMessage?: string,
      errorMessage?: string
    ) => Promise<boolean>
  ): Promise<ProcessingResult> {
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
      leadData: leadData,
      upsellOptions: personalizationConfig.upsellOptions,
      dataStreamingRestrictions: personalizationConfig.dataStreamingRestrictions
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
  }
}
