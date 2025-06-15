
export interface N8nWebhookPayload {
  prompt?: string; // Keep for backward compatibility
  chatInput?: string; // New field for proper chat integration - this is the primary field now
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

export interface SearchParameters {
  industry: string;
  companySize: string;
  jobTitle: string;
  location: string;
  techStack?: string;
  estimatedLeads?: number;
}

export interface N8nResponse {
  success: boolean;
  message: string;
  aiResponse?: string;
  searchParameters?: SearchParameters;
  error?: string;
  debug?: any;
  responseType?: 'json' | 'text' | 'html' | 'unknown' | 'fallback';
}

export type ResponseType = 'json' | 'text' | 'html' | 'unknown' | 'fallback';
