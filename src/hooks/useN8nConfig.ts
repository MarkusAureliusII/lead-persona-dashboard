
import { useState, useEffect } from 'react';
import { useWebhookStorageLocal } from './useWebhookStorageLocal';

export interface N8nChatCustomizations {
  theme: 'light' | 'dark' | 'auto';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage: string;
  language: string;
  autoOpen: boolean;
  showTypingIndicator: boolean;
  allowFileUpload: boolean;
}

export function useN8nConfig() {
  const { webhookSettings } = useWebhookStorageLocal();
  
  const [isEnabled, setIsEnabled] = useState(() => 
    localStorage.getItem("n8n:widget:enabled") === "true"
  );

  // Use webhook from central settings, fallback to old localStorage or hardcoded URL
  const webhookUrl = webhookSettings.ai_chat_webhook || 
    localStorage.getItem("n8n:widget:url") || 
    "";

  const setWebhookUrl = (url: string) => {
    // This function is deprecated - webhooks should be set via Settings page
    console.warn("setWebhookUrl is deprecated. Please use Settings page to configure webhooks.");
    localStorage.setItem("n8n:widget:url", url);
  };

  const [customizations, setCustomizations] = useState<N8nChatCustomizations>(() => {
    const stored = localStorage.getItem("n8n:widget:customizations");
    try {
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse n8n customizations from localStorage", error);
    }
    return {
      theme: 'light',
      position: 'bottom-right',
      welcomeMessage: 'Hallo! Ich helfe dir dabei, passende Leads zu finden. Lass uns die wichtigsten Kriterien durchgehen.',
      language: 'de',
      autoOpen: false,
      showTypingIndicator: true,
      allowFileUpload: false,
    };
  });

  useEffect(() => {
    localStorage.setItem("n8n:widget:enabled", String(isEnabled));
  }, [isEnabled]);

  // Remove the useEffect for webhookUrl since it's now managed centrally

  useEffect(() => {
    localStorage.setItem("n8n:widget:customizations", JSON.stringify(customizations));
  }, [customizations]);

  return {
    isEnabled,
    setIsEnabled,
    webhookUrl,
    setWebhookUrl,
    customizations,
    setCustomizations,
  };
}
