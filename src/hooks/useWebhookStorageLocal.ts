import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface WebhookSettings {
  global_webhook_url: string;
  lead_processing_webhook: string;
  email_verification_webhook: string;
  linkedin_analysis_webhook: string;
  website_analysis_webhook: string;
  lead_scraping_webhook: string;
  ai_chat_webhook: string;
}

interface DatabaseWebhookSettings extends WebhookSettings {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Fallback to localStorage if database is not ready
export function useWebhookStorageLocal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    global_webhook_url: '',
    lead_processing_webhook: '',
    email_verification_webhook: '',
    linkedin_analysis_webhook: '',
    website_analysis_webhook: '',
    lead_scraping_webhook: '',
    ai_chat_webhook: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getStorageKey = () => user ? `webhook_settings_${user.id}` : 'webhook_settings_anonymous';

  // Try database first, fallback to localStorage
  const loadWebhookSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Try database first
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        console.log('✅ Loaded webhook settings from database');
        setWebhookSettings({
          global_webhook_url: data.global_webhook_url || '',
          lead_processing_webhook: data.lead_processing_webhook || '',
          email_verification_webhook: data.email_verification_webhook || '',
          linkedin_analysis_webhook: data.linkedin_analysis_webhook || '',
          website_analysis_webhook: data.website_analysis_webhook || '',
          lead_scraping_webhook: data.lead_scraping_webhook || '',
          ai_chat_webhook: data.ai_chat_webhook || '',
        });
        return;
      }

      // Fallback to localStorage if database fails
      console.log('📦 Falling back to localStorage for webhook settings');
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setWebhookSettings({
          global_webhook_url: parsed.global_webhook_url || '',
          lead_processing_webhook: parsed.lead_processing_webhook || '',
          email_verification_webhook: parsed.email_verification_webhook || '',
          linkedin_analysis_webhook: parsed.linkedin_analysis_webhook || '',
          website_analysis_webhook: parsed.website_analysis_webhook || '',
          lead_scraping_webhook: parsed.lead_scraping_webhook || '',
          ai_chat_webhook: parsed.ai_chat_webhook || '',
        });
      }
    } catch (error) {
      console.error('Error loading webhook settings:', error);
      // Fallback to localStorage on any error
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setWebhookSettings({
          global_webhook_url: parsed.global_webhook_url || '',
          lead_processing_webhook: parsed.lead_processing_webhook || '',
          email_verification_webhook: parsed.email_verification_webhook || '',
          linkedin_analysis_webhook: parsed.linkedin_analysis_webhook || '',
          website_analysis_webhook: parsed.website_analysis_webhook || '',
          lead_scraping_webhook: parsed.lead_scraping_webhook || '',
          ai_chat_webhook: parsed.ai_chat_webhook || '',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save webhook settings to database and localStorage
  const saveWebhookSettings = async (settings: Partial<WebhookSettings>): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Nicht angemeldet",
        description: "Bitte melde dich an, um Webhook-Einstellungen zu speichern.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsSaving(true);
      const updatedSettings = { ...webhookSettings, ...settings };

      // Try to save to database first
      const { error: upsertError } = await supabase
        .from('webhook_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        });

      if (!upsertError) {
        console.log('✅ Saved webhook settings to database');
        setWebhookSettings(updatedSettings);
        
        toast({
          title: "✅ Erfolgreich gespeichert",
          description: "Deine Webhook-Einstellungen sind jetzt persistent und überleben Logout/Browser-Wechsel.",
          duration: 3000
        });
        return true;
      }

      // Fallback to localStorage if database fails
      console.log('📦 Database save failed, using localStorage fallback');
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(updatedSettings));
      setWebhookSettings(updatedSettings);

      toast({
        title: "⚠️ Nur lokal gespeichert",
        description: "Deine Webhook-Einstellungen gehen beim Logout verloren. Führe die SQL-Migration aus: ALTER TABLE webhook_settings ADD COLUMN IF NOT EXISTS lead_scraping_webhook TEXT, ADD COLUMN IF NOT EXISTS ai_chat_webhook TEXT;",
        variant: "destructive",
        duration: 10000 // Längere Anzeige
      });

      return true;
    } catch (error) {
      console.error('Error saving webhook settings:', error);
      
      // Final fallback to localStorage
      try {
        const updatedSettings = { ...webhookSettings, ...settings };
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));
        setWebhookSettings(updatedSettings);

        toast({
          title: "⚠️ Nur im Browser gespeichert",
          description: "Beim nächsten Logout sind deine Einstellungen weg. Führe die SQL-Migration aus!",
          variant: "destructive",
          duration: 8000
        });
        return true;
      } catch (localError) {
        toast({
          title: "Speichern fehlgeschlagen",
          description: "Webhook-Einstellungen konnten nicht gespeichert werden.",
          variant: "destructive"
        });
        return false;
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Update a specific webhook URL
  const updateWebhookUrl = (key: keyof WebhookSettings, value: string) => {
    setWebhookSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Auto-save function
  const autoSave = async () => {
    return await saveWebhookSettings(webhookSettings);
  };

  // Load settings when user changes
  useEffect(() => {
    loadWebhookSettings();
  }, [user]);

  return {
    webhookSettings,
    updateWebhookUrl,
    saveWebhookSettings,
    autoSave,
    loadWebhookSettings,
    isLoading,
    isSaving,
  };
}