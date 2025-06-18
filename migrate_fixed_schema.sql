-- Fixed migration script for existing Supabase schema
-- This fixes type issues and properly creates the lead management tables

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can manage all leads" ON public.leads;

DROP POLICY IF EXISTS "Users can view their own scrape jobs" ON public.scrape_jobs;
DROP POLICY IF EXISTS "Users can insert their own scrape jobs" ON public.scrape_jobs;
DROP POLICY IF EXISTS "Users can update their own scrape jobs" ON public.scrape_jobs;
DROP POLICY IF EXISTS "Users can delete their own scrape jobs" ON public.scrape_jobs;
DROP POLICY IF EXISTS "Service role can manage all scrape jobs" ON public.scrape_jobs;

DROP POLICY IF EXISTS "Users can view their own webhook settings" ON public.webhook_settings;
DROP POLICY IF EXISTS "Users can insert their own webhook settings" ON public.webhook_settings;
DROP POLICY IF EXISTS "Users can update their own webhook settings" ON public.webhook_settings;
DROP POLICY IF EXISTS "Users can delete their own webhook settings" ON public.webhook_settings;
DROP POLICY IF EXISTS "Service role can manage all webhook settings" ON public.webhook_settings;

-- Fix RLS policies with proper auth.uid() function and type casting
CREATE POLICY "Users can view their own leads" ON public.leads 
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own leads" ON public.leads 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own leads" ON public.leads 
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own leads" ON public.leads 
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for scrape_jobs table
CREATE POLICY "Users can view their own scrape jobs" ON public.scrape_jobs 
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own scrape jobs" ON public.scrape_jobs 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own scrape jobs" ON public.scrape_jobs 
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own scrape jobs" ON public.scrape_jobs 
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for webhook_settings table
CREATE POLICY "Users can view their own webhook settings" ON public.webhook_settings 
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own webhook settings" ON public.webhook_settings 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own webhook settings" ON public.webhook_settings 
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own webhook settings" ON public.webhook_settings 
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Service role policies for full access
CREATE POLICY "Service role can manage all leads" ON public.leads 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage all scrape jobs" ON public.scrape_jobs 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage all webhook settings" ON public.webhook_settings 
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Drop and recreate the view with proper type casting
DROP VIEW IF EXISTS public.leads_with_jobs;
CREATE OR REPLACE VIEW public.leads_with_jobs AS
SELECT 
    l.*,
    sj.job_name,
    sj.apify_run_id,
    sj.started_at as job_started_at,
    sj.finished_at as job_finished_at
FROM public.leads l
LEFT JOIN public.scrape_jobs sj ON l.scrape_job_id::text = sj.id::text;

-- Grant access to the view
GRANT SELECT ON public.leads_with_jobs TO anon, authenticated, service_role;

-- Drop and recreate the function with proper type handling
DROP FUNCTION IF EXISTS public.get_user_stats(uuid);
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT json_build_object(
        'total_leads', (SELECT COUNT(*) FROM public.leads WHERE user_id::text = target_user_id),
        'total_scrape_jobs', (SELECT COUNT(*) FROM public.scrape_jobs WHERE user_id::text = target_user_id),
        'verified_emails', (SELECT COUNT(*) FROM public.leads WHERE user_id::text = target_user_id AND is_email_verified = true),
        'analyzed_profiles', (SELECT COUNT(*) FROM public.leads WHERE user_id::text = target_user_id AND is_personal_linkedin_analyzed = true)
    );
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_stats TO anon, authenticated, service_role;

-- Insert some sample data for testing
INSERT INTO public.scrape_jobs (job_name, user_id, lead_count) VALUES 
('Sample Job 1', (SELECT id FROM auth.users LIMIT 1), 0)
ON CONFLICT DO NOTHING;

SELECT 'Lead management schema migration fixed and completed successfully!' as status;