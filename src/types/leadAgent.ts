
export interface PersonalizationConfig {
  productService: string;
  tonality: string;
  language: string;
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

export interface CulturalContext {
  id: string;
  language: string;
  region: string | null;
  business_practices: any;
  communication_style: any;
  cultural_notes: string | null;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' }
];
