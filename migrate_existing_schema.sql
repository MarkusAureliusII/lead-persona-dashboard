-- Migration script for existing Supabase schema
-- This adds the lead management tables to the current self-hosted setup

-- Create scrape_jobs table first (referenced by leads table)
CREATE TABLE IF NOT EXISTS public.scrape_jobs (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  job_name text,
  apify_run_id text,
  started_at timestamp with time zone DEFAULT now(),
  finished_at timestamp with time zone,
  lead_count integer DEFAULT 0,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT scrape_jobs_pkey PRIMARY KEY (id)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  source_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  title text,
  email text,
  phone text,
  country text,
  city text,
  state text,
  company_name text,
  person_linkedin_url text,
  company_linkedin_url text,
  facebook_url text,
  keywords text[], -- Using text[] instead of ARRAY for PostgreSQL compatibility
  raw_scraped_data jsonb,
  enriched_data jsonb,
  scrape_job_id uuid,
  user_id uuid,
  website text DEFAULT 'NULL'::text,
  is_personal_linkedin_analyzed boolean DEFAULT false,
  is_email_verified boolean DEFAULT false,
  is_company_linkedin_analyzed boolean DEFAULT false,
  is_website_analyzed boolean DEFAULT false,
  is_custom_field_1_analyzed boolean DEFAULT false,
  phone_number text,
  analysis_text_personal_linkedin text,
  analysis_text_company_linkedin text,
  analysis_text_website text,
  email_verification_status text,
  is_email_verification_processed boolean DEFAULT false,
  actor_run_id text,
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_scrape_job_id_fkey FOREIGN KEY (scrape_job_id) REFERENCES public.scrape_jobs(id),
  CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create webhook_settings table
CREATE TABLE IF NOT EXISTS public.webhook_settings (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  global_webhook_url text,
  lead_processing_webhook text,
  email_verification_webhook text,
  linkedin_analysis_webhook text,
  website_analysis_webhook text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  lead_scraping_webhook text,
  ai_chat_webhook text,
  CONSTRAINT webhook_settings_pkey PRIMARY KEY (id),
  CONSTRAINT webhook_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON public.leads (user_id);
CREATE INDEX IF NOT EXISTS leads_scrape_job_id_idx ON public.leads (scrape_job_id);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS scrape_jobs_user_id_idx ON public.scrape_jobs (user_id);
CREATE INDEX IF NOT EXISTS webhook_settings_user_id_idx ON public.webhook_settings (user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_scrape_jobs_updated_at 
    BEFORE UPDATE ON public.scrape_jobs 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_webhook_settings_updated_at 
    BEFORE UPDATE ON public.webhook_settings 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leads table
CREATE POLICY "Users can view their own leads" ON public.leads 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON public.leads 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON public.leads 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON public.leads 
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for scrape_jobs table
CREATE POLICY "Users can view their own scrape jobs" ON public.scrape_jobs 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scrape jobs" ON public.scrape_jobs 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scrape jobs" ON public.scrape_jobs 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scrape jobs" ON public.scrape_jobs 
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for webhook_settings table
CREATE POLICY "Users can view their own webhook settings" ON public.webhook_settings 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own webhook settings" ON public.webhook_settings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook settings" ON public.webhook_settings 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook settings" ON public.webhook_settings 
    FOR DELETE USING (auth.uid() = user_id);

-- Service role policies for full access
CREATE POLICY "Service role can manage all leads" ON public.leads 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage all scrape jobs" ON public.scrape_jobs 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage all webhook settings" ON public.webhook_settings 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Grant permissions to roles
GRANT ALL ON public.leads TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.scrape_jobs TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.webhook_settings TO postgres, anon, authenticated, service_role;

-- Grant usage on sequences (for auto-increment functionality)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Create views for easier data access
CREATE OR REPLACE VIEW public.leads_with_jobs AS
SELECT 
    l.*,
    sj.job_name,
    sj.apify_run_id,
    sj.started_at as job_started_at,
    sj.finished_at as job_finished_at
FROM public.leads l
LEFT JOIN public.scrape_jobs sj ON l.scrape_job_id = sj.id;

-- Grant access to the view
GRANT SELECT ON public.leads_with_jobs TO anon, authenticated, service_role;

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id uuid)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT json_build_object(
        'total_leads', (SELECT COUNT(*) FROM public.leads WHERE user_id = target_user_id),
        'total_scrape_jobs', (SELECT COUNT(*) FROM public.scrape_jobs WHERE user_id = target_user_id),
        'verified_emails', (SELECT COUNT(*) FROM public.leads WHERE user_id = target_user_id AND is_email_verified = true),
        'analyzed_profiles', (SELECT COUNT(*) FROM public.leads WHERE user_id = target_user_id AND is_personal_linkedin_analyzed = true)
    );
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_stats TO anon, authenticated, service_role;

SELECT 'Lead management schema migration completed successfully!' as status;