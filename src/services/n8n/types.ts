
export interface N8nWebhookPayload {
  message: string;
  targetAudience: {
    industry: string;
    companySize: string;
    jobTitle: string;
    location: string;
    techStack?: string;
  };
  timestamp: string;
  requestId?: string;
  leadData?: any; // Add support for passing through the actual lead data
  batchData?: {
    leads: any[];
    personalizationConfig: {
      productService: string;
      tonality: string;
    };
    csvUploadId: string;
  };
}

export interface N8nResponse {
  success: boolean;
  message: string;
  aiResponse?: string;
  searchParameters?: {
    industry?: string;
    companySize?: string;
    jobTitle?: string;
    location?: string;
    techStack?: string;
    estimatedLeads?: number;
  };
  error?: string;
  debug?: any;
  responseType?: 'json' | 'text' | 'html' | 'unknown';
  batchResults?: Array<{
    index: number;
    success: boolean;
    personalizedMessage?: string;
    error?: string;
  }>;
}

export type ResponseType = 'json' | 'text' | 'html' | 'unknown';
