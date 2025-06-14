
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
  leadData?: any; // Individual lead data for processing
  language?: string;
  upsellOptions?: {
    emailVerification: boolean;
  };
  dataStreamingRestrictions?: {
    websiteOnly: boolean;
    privateLinkedIn: boolean;
    companyLinkedIn: boolean;
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
}

export type ResponseType = 'json' | 'text' | 'html' | 'unknown';
