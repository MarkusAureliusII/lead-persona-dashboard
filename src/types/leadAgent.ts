
export interface PersonalizationConfig {
  productService: string;
  tonality: string;
  upsellOptions: UpsellOptions;
  dataStreamingRestrictions: DataStreamingRestrictions;
}

export interface UpsellOptions {
  emailVerification: boolean;
}

export interface DataStreamingRestrictions {
  websiteOnly: boolean;
  privateLinkedIn: boolean;
  companyLinkedIn: boolean;
}

export interface TargetAudience {
  industry: string;
  companySize: string;
  jobTitle: string;
  location: string;
  techStack?: string;
}

export interface SearchParameters {
  industry?: string;
  jobTitle?: string;
  location?: string;
  companySize?: string;
  techStack?: string;
  estimatedLeads?: number;
}
