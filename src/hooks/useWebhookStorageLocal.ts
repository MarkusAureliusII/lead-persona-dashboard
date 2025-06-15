import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WebhookSettings {
  global_webhook_url: string;
  lead_processing_webhook: string;
  email_verification_webhook: string;
  linkedin_analysis_webhook: string;
  website_analysis_webhook: string;
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
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getStorageKey = () => user ? `webhook_settings_${user.id}` : 'webhook_settings_anonymous';

  // Load webhook settings from localStorage
  const loadWebhookSettings = () => {
    try {
      setIsLoading(true);
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
        });
      }
    } catch (error) {
      console.error('Error loading webhook settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save webhook settings to localStorage
  const saveWebhookSettings = async (settings: Partial<WebhookSettings>): Promise<boolean> => {
    try {
      setIsSaving(true);
      const updatedSettings = { ...webhookSettings, ...settings };
      const storageKey = getStorageKey();
      
      localStorage.setItem(storageKey, JSON.stringify(updatedSettings));
      setWebhookSettings(updatedSettings);

      toast({
        title: "Webhook-Einstellungen gespeichert",
        description: "Deine N8N-Webhook-Konfiguration wurde erfolgreich gespeichert.",
      });

      return true;
    } catch (error) {
      console.error('Error saving webhook settings to localStorage:', error);
      toast({
        title: "Speichern fehlgeschlagen",
        description: "Webhook-Einstellungen konnten nicht gespeichert werden. Bitte versuche es erneut.",
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