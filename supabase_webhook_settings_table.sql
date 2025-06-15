-- Create webhook_settings table for persistent storage
-- Run this in Supabase SQL Editor

-- 1. Create the webhook_settings table
CREATE TABLE IF NOT EXISTS webhook_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  global_webhook_url TEXT,
  lead_processing_webhook TEXT,
  email_verification_webhook TEXT,
  linkedin_analysis_webhook TEXT,
  website_analysis_webhook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Enable RLS (Row Level Security)
ALTER TABLE webhook_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view their own webhook settings" ON webhook_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own webhook settings" ON webhook_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook settings" ON webhook_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook settings" ON webhook_settings
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Create index for better performance
CREATE INDEX idx_webhook_settings_user_id ON webhook_settings(user_id);

-- 5. Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webhook_settings_updated_at
  BEFORE UPDATE ON webhook_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_settings_updated_at();