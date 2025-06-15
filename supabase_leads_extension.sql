-- Erweiterung der leads-Tabelle um zusätzliche Felder
-- Für Supabase SQL Editor

-- 1. Telefonnummer-Feld hinzufügen
ALTER TABLE leads 
ADD COLUMN phone_number TEXT;

-- 2. Analyse-Ergebnisse für Personal LinkedIn hinzufügen
ALTER TABLE leads 
ADD COLUMN analysis_text_personal_linkedin TEXT;

-- 3. Analyse-Ergebnisse für Company LinkedIn hinzufügen
ALTER TABLE leads 
ADD COLUMN analysis_text_company_linkedin TEXT;

-- 4. Analyse-Ergebnisse für Website hinzufügen
ALTER TABLE leads 
ADD COLUMN analysis_text_website TEXT;

-- 5. E-Mail-Verifizierungsstatus hinzufügen
ALTER TABLE leads 
ADD COLUMN email_verification_status TEXT;

-- 6. E-Mail-Verifizierungsverarbeitung Status hinzufügen
ALTER TABLE leads 
ADD COLUMN is_email_verification_processed BOOLEAN DEFAULT false;