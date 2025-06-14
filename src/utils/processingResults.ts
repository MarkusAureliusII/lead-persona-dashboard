
import { ProcessingResult } from '@/types/processing';

export class ProcessingResultsManager {
  static initializeResults(csvData: any[]): ProcessingResult[] {
    return csvData.map((leadData, index) => ({
      index,
      leadData,
      status: 'pending'
    }));
  }

  static updateResultStatus(
    results: ProcessingResult[], 
    index: number, 
    status: 'pending' | 'processing' | 'success' | 'error'
  ): ProcessingResult[] {
    return results.map(result => 
      result.index === index ? { ...result, status } : result
    );
  }

  static updateResultWithData(
    results: ProcessingResult[], 
    newResult: ProcessingResult
  ): ProcessingResult[] {
    return results.map(existingResult => 
      existingResult.index === newResult.index ? newResult : existingResult
    );
  }

  static getProcessingStats(results: ProcessingResult[]) {
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    return { successCount, errorCount };
  }
}
