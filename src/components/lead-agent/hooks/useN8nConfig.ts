import { useState, useEffect } from 'react';

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
  const [isEnabled, setIsEnabled] = useState(() => 
    localStorage.getItem("n8n:widget:enabled") === "true"
  );

  const [webhookUrl, setWebhookUrl] = useState(() =>
    localStorage.getItem("n8n:widget:url") || "https://n8n-selfhost-u40339.vm.elestio.app/webhook/fa996958-1ecc-4644-bb93-34f060a170a3/chat"
  );

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

  useEffect(() => {
    localStorage.setItem("n8n:widget:url", webhookUrl);
  }, [webhookUrl]);

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
