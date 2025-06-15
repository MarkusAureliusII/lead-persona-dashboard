-- Fix für das LinkedIn URL Unique Constraint Problem
-- Entfernt den falschen UNIQUE-Constraint auf person_linkedin_url

-- 1. Zuerst den problematischen Constraint entfernen
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_person_linkedin_url_key;

-- 2. Auch andere potentiell problematische Unique Constraints entfernen
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_email_key;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_company_linkedin_url_key;

-- 3. Optional: Einen Index für Performance behalten (ohne UNIQUE)
CREATE INDEX IF NOT EXISTS idx_leads_person_linkedin_url ON leads(person_linkedin_url);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_company_linkedin_url ON leads(company_linkedin_url);

-- 4. Composite Unique Constraint für echte Duplikate (falls gewünscht)
-- Verhindert identische Leads im SELBEN Scrape-Job
-- ALTER TABLE leads ADD CONSTRAINT unique_lead_per_scrape_job 
--   UNIQUE (scrape_job_id, person_linkedin_url, email) 
--   DEFERRABLE INITIALLY DEFERRED;

-- Kommentar: 
-- Leads sollten identifiziert werden durch ihre ID, nicht durch LinkedIn-URLs
-- LinkedIn-URLs können durchaus mehrfach vorkommen (verschiedene Scrape-Jobs, Datenqualität, etc.)