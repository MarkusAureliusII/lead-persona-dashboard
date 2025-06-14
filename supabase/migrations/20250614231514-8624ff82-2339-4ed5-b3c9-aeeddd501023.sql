
-- Add language support to the personalization_configs table
ALTER TABLE public.personalization_configs 
ADD COLUMN language VARCHAR(5) DEFAULT 'en' NOT NULL;

-- Add language column to csv_leads table for storing personalized messages in different languages
ALTER TABLE public.csv_leads 
ADD COLUMN language VARCHAR(5) DEFAULT 'en';

-- Create a table for storing cultural context and business practices by language/region
CREATE TABLE public.cultural_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language VARCHAR(5) NOT NULL,
  region VARCHAR(50),
  business_practices JSONB,
  communication_style JSONB,
  cultural_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cultural_contexts table
ALTER TABLE public.cultural_contexts ENABLE ROW LEVEL SECURITY;

-- Create policy for cultural contexts (public read access since this is reference data)
CREATE POLICY "Anyone can view cultural contexts" 
  ON public.cultural_contexts 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Insert default cultural context data for supported languages
INSERT INTO public.cultural_contexts (language, region, business_practices, communication_style, cultural_notes) VALUES 
('en', 'US', 
 '{"meeting_culture": "direct", "hierarchy": "flat", "decision_making": "collaborative"}',
 '{"tone": "professional_friendly", "formality": "medium", "directness": "high"}',
 'American business culture values directness, efficiency, and innovation. Networking is important.'
),
('de', 'DE', 
 '{"meeting_culture": "structured", "hierarchy": "moderate", "decision_making": "consensus"}',
 '{"tone": "formal_respectful", "formality": "high", "directness": "medium"}',
 'German business culture emphasizes punctuality, thoroughness, and formal communication. Titles and proper etiquette are important.'
),
('es', 'ES', 
 '{"meeting_culture": "relationship_focused", "hierarchy": "moderate", "decision_making": "relationship_based"}',
 '{"tone": "warm_professional", "formality": "medium", "directness": "medium"}',
 'Spanish business culture values personal relationships, respect for hierarchy, and taking time to build trust.'
),
('zh', 'CN', 
 '{"meeting_culture": "hierarchical", "hierarchy": "high", "decision_making": "top_down"}',
 '{"tone": "respectful_formal", "formality": "very_high", "directness": "low"}',
 'Chinese business culture emphasizes respect for hierarchy, face-saving, and long-term relationship building. Indirect communication is preferred.'
),
('ar', 'AE', 
 '{"meeting_culture": "relationship_first", "hierarchy": "high", "decision_making": "relationship_and_hierarchy"}',
 '{"tone": "respectful_warm", "formality": "high", "directness": "low"}',
 'Arabic business culture values personal relationships, respect for elders/authority, and hospitality. Building trust through personal connections is essential.'
);

-- Add trigger to update updated_at column
CREATE TRIGGER update_cultural_contexts_updated_at
    BEFORE UPDATE ON public.cultural_contexts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
