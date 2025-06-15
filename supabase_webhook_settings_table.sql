-- Webhook Settings Table für N8N Integration
-- Diese Tabelle speichert die Webhook-URLs für verschiedene Automatisierungs-Workflows

-- Tabelle für Webhook-Einstellungen erstellen
CREATE TABLE IF NOT EXISTS webhook_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Haupt-Webhook URL (empfohlen für alle Prozesse)
    global_webhook_url TEXT,
    
    -- Spezifische Webhook URLs für verschiedene Verarbeitungsschritte
    lead_processing_webhook TEXT,
    email_verification_webhook TEXT,
    linkedin_analysis_webhook TEXT,
    website_analysis_webhook TEXT,
    
    -- Lead Scraping und KI Agent Webhooks
    lead_scraping_webhook TEXT,
    ai_chat_webhook TEXT,
    
    -- Metadaten
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ein Nutzer kann nur eine Webhook-Konfiguration haben
    UNIQUE(user_id)
);

-- Row Level Security aktivieren
ALTER TABLE webhook_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Nutzer können nur ihre eigenen Webhook-Einstellungen sehen und bearbeiten
CREATE POLICY "Users can only access their own webhook settings" ON webhook_settings
    FOR ALL USING (auth.uid() = user_id);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_webhook_settings_user_id ON webhook_settings(user_id);

-- Trigger für automatisches Update des updated_at Feldes
CREATE OR REPLACE FUNCTION update_webhook_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger löschen falls er existiert, dann neu erstellen
DROP TRIGGER IF EXISTS trigger_update_webhook_settings_updated_at ON webhook_settings;
CREATE TRIGGER trigger_update_webhook_settings_updated_at
    BEFORE UPDATE ON webhook_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_webhook_settings_updated_at();

-- Kommentare für bessere Dokumentation
COMMENT ON TABLE webhook_settings IS 'Speichert N8N Webhook-URLs für Lead-Automatisierung';
COMMENT ON COLUMN webhook_settings.global_webhook_url IS 'Haupt-Webhook URL für alle Verarbeitungsschritte (empfohlen)';
COMMENT ON COLUMN webhook_settings.lead_processing_webhook IS 'Spezieller Webhook für Batch-Lead-Transfer';
COMMENT ON COLUMN webhook_settings.email_verification_webhook IS 'Webhook für E-Mail-Validierung';
COMMENT ON COLUMN webhook_settings.linkedin_analysis_webhook IS 'Webhook für LinkedIn-Profil-Analyse';
COMMENT ON COLUMN webhook_settings.website_analysis_webhook IS 'Webhook für Website-Content-Analyse';
COMMENT ON COLUMN webhook_settings.lead_scraping_webhook IS 'Webhook für Apollo.io Lead-Scraping-Formulare';
COMMENT ON COLUMN webhook_settings.ai_chat_webhook IS 'Webhook für N8N KI-Chat-Widget Integration';