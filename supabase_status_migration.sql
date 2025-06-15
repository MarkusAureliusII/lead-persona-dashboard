-- Migration: Ersetze status-Spalte durch boolesche Anreicherungsfortschritt-Spalten
-- Datum: 2025-06-15
-- Für Supabase SQL Editor

-- 1. Füge neue boolesche Spalten hinzu (alle mit DEFAULT false)
ALTER TABLE leads 
ADD COLUMN is_personal_linkedin_analyzed BOOLEAN DEFAULT false;

-- 2. Füge Email-Verifizierung-Status hinzu
ALTER TABLE leads 
ADD COLUMN is_email_verified BOOLEAN DEFAULT false;

-- 3. Füge Company LinkedIn Analyse-Status hinzu
ALTER TABLE leads 
ADD COLUMN is_company_linkedin_analyzed BOOLEAN DEFAULT false;

-- 4. Füge Website-Analyse-Status hinzu
ALTER TABLE leads 
ADD COLUMN is_website_analyzed BOOLEAN DEFAULT false;

-- 5. Füge Custom Field 1 Analyse-Status hinzu (Platzhalter für zukünftige Checks)
ALTER TABLE leads 
ADD COLUMN is_custom_field_1_analyzed BOOLEAN DEFAULT false;

-- 6. Entferne die alte status-Spalte
ALTER TABLE leads 
DROP COLUMN status;

-- Migration abgeschlossen
-- Die Tabelle verwendet jetzt granulare boolesche Felder statt einem generischen Status