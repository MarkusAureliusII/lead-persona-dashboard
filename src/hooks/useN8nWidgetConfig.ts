
import { useState, useEffect } from 'react';

interface N8nWidgetCustomizations {
  theme: string;
  position: string;
  welcomeMessage: string;
}

export function useN8nWidgetConfig() {
  const [isWidgetEnabled, setIsWidgetEnabled] = useState(() => {
    return localStorage.getItem("n8n-widget-enabled") === "true";
  });

  const [widgetUrl, setWidgetUrl] = useState(() => {
    return localStorage.getItem("n8n-widget-url") || "";
  });

  const [customizations, setCustomizations] = useState<N8nWidgetCustomizations>(() => {
    const stored = localStorage.getItem("n8n-widget-customizations");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored customizations:', error);
      }
    }
    return {
      theme: 'light',
      position: 'bottom-right',
      welcomeMessage: 'Hallo! Wie kann ich Ihnen bei der Lead-Suche helfen?'
    };
  });

  const handleWidgetEnabledChange = (enabled: boolean) => {
    setIsWidgetEnabled(enabled);
    localStorage.setItem("n8n-widget-enabled", enabled.toString());
  };

  const handleWidgetUrlChange = (url: string) => {
    setWidgetUrl(url);
    localStorage.setItem("n8n-widget-url", url);
  };

  const handleCustomizationsChange = (newCustomizations: N8nWidgetCustomizations) => {
    setCustomizations(newCustomizations);
    localStorage.setItem("n8n-widget-customizations", JSON.stringify(newCustomizations));
  };

  return {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange
  };
}
