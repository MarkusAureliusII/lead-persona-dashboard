
export interface PersonalizationConfig {
  productService: string;
  tonality: string;
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
