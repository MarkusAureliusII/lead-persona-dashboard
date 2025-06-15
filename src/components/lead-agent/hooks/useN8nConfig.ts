import { useState, useEffect } from 'react';

// Defines the shape of the chat widget's customizable settings
export interface N8nChatCustomizations {
  theme: 'light' | 'dark' | 'auto';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage: string;
  language: string;
  autoOpen: boolean;
  showTypingIndicator: boolean;
  allowFileUpload: boolean;
}

// Custom hook to manage n8n chat widget configuration with persistence
export function useN8nConfig() {
  // State for enabling/disabling the widget, persisted in localStorage
  const [isEnabled, setIsEnabled] = useState(() => 
    localStorage.getItem("n8n:widget:enabled") === "true"
  );

  // State for the n8n webhook URL, persisted in localStorage
  const [webhookUrl, setWebhookUrl] = useState(() =>
    localStorage.getItem("n8n:widget:url") || "https://n8n-selfhost-u40339.vm.elestio.app/webhook/fa996958-1ecc-4644-bb93-34f060a170a3/chat"
  );

  // State for widget customizations, persisted in localStorage
  const [customizations, setCustomizations] = useState<N8nChatCustomizations>(() => {
    const stored = localStorage.getItem("n8n:widget:customizations");
    try {
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse n8n customizations from localStorage", error);
    }
    // Default customizations if none are stored or parsing fails
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

  // Effect to update localStorage when isEnabled state changes
  useEffect(() => {
    localStorage.setItem("n8n:widget:enabled", String(isEnabled));
  }, [isEnabled]);

  // Effect to update localStorage when webhookUrl state changes
  useEffect(() => {
    localStorage.setItem("n8n:widget:url", webhookUrl);
  }, [webhookUrl]);

  // Effect to update localStorage when customizations state changes
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