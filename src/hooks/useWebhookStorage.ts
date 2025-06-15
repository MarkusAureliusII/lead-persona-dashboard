import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WebhookSettings {
  id?: string;
  user_id?: string;
  global_webhook_url: string;
  lead_processing_webhook: string;
  email_verification_webhook: string;
  linkedin_analysis_webhook: string;
  website_analysis_webhook: string;
  created_at?: string;
  updated_at?: string;
}

export function useWebhookStorage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    global_webhook_url: '',
    lead_processing_webhook: '',
    email_verification_webhook: '',
    linkedin_analysis_webhook: '',
    website_analysis_webhook: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load webhook settings from database
  const loadWebhookSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setWebhookSettings({
          id: data.id,
          user_id: data.user_id,
          global_webhook_url: data.global_webhook_url || '',
          lead_processing_webhook: data.lead_processing_webhook || '',
          email_verification_webhook: data.email_verification_webhook || '',
          linkedin_analysis_webhook: data.linkedin_analysis_webhook || '',
          website_analysis_webhook: data.website_analysis_webhook || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error loading webhook settings:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Webhook-Einstellungen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save webhook settings to database
  const saveWebhookSettings = async (settings: Partial<WebhookSettings>) => {
    if (!user) {
      toast({
        title: "Nicht angemeldet",
        description: "Sie müssen angemeldet sein, um Einstellungen zu speichern.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsSaving(true);

      const updatedSettings = { ...webhookSettings, ...settings };
      
      const { data, error } = await supabase
        .from('webhook_settings')
        .upsert({
          user_id: user.id,
          global_webhook_url: updatedSettings.global_webhook_url,
          lead_processing_webhook: updatedSettings.lead_processing_webhook,
          email_verification_webhook: updatedSettings.email_verification_webhook,
          linkedin_analysis_webhook: updatedSettings.linkedin_analysis_webhook,
          website_analysis_webhook: updatedSettings.website_analysis_webhook,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setWebhookSettings({
        ...updatedSettings,
        id: data.id,
        updated_at: data.updated_at,
      });

      toast({
        title: "Gespeichert",
        description: "Webhook-Einstellungen wurden erfolgreich gespeichert.",
      });

      return true;
    } catch (error) {
      console.error('Error saving webhook settings:', error);
      toast({
        title: "Fehler beim Speichern",
        description: "Webhook-Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
      return false;
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

  // Auto-save function with debounce
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