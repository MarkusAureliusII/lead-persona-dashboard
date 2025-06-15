
export interface ProcessingResult {
  index: number;
  leadData: any;
  status: 'pending' | 'processing' | 'success' | 'error';
  result?: any;
  error?: string;
  personalizedMessage?: string;
}
