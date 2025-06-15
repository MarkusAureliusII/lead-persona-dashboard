
// This file is deprecated - we've reverted to individual processing for better live view experience
// Individual processing is handled by LeadProcessingService

export class BatchProcessingService {
  static async processBatch() {
    throw new Error('Batch processing has been deprecated. Use individual processing instead.');
  }
}
