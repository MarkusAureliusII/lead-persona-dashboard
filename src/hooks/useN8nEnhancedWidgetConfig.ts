
import { useState, useEffect } from 'react';

interface N8nEnhancedWidgetCustomizations {
  theme: string;
  position: string;
  welcomeMessage: string;
  language: string;
  autoOpen: boolean;
  showTypingIndicator: boolean;
  allowFileUpload: boolean;
}

export function useN8nEnhancedWidgetConfig() {
  const [isWidgetEnabled, setIsWidgetEnabled] = useState(() => {
    return localStorage.getItem("n8n-enhanced-widget-enabled") === "true";
  });

  const [widgetUrl, setWidgetUrl] = useState(() => {
    return localStorage.getItem("n8n-enhanced-widget-url") || "";
  });

  const [customizations, setCustomizations] = useState<N8nEnhancedWidgetCustomizations>(() => {
    const stored = localStorage.getItem("n8n-enhanced-widget-customizations");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored enhanced customizations:', error);
      }
    }
    return {
      theme: 'light',
      position: 'bottom-right',
      welcomeMessage: 'Hallo! 👋 Ich bin Ihr KI-gestützter Lead-Agent. Wie kann ich Ihnen bei der Lead-Generierung helfen?',
      language: 'de',
      autoOpen: false,
      showTypingIndicator: true,
      allowFileUpload: false
    };
  });

  const [sessionData, setSessionData] = useState(() => {
    const stored = localStorage.getItem("n8n-chat-session");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored session data:', error);
      }
    }
    return {
      sessionId: `session_${Date.now()}`,
      messageHistory: [],
      lastActive: new Date().toISOString()
    };
  });

  const handleWidgetEnabledChange = (enabled: boolean) => {
    setIsWidgetEnabled(enabled);
    localStorage.setItem("n8n-enhanced-widget-enabled", enabled.toString());
  };

  const handleWidgetUrlChange = (url: string) => {
    setWidgetUrl(url);
    localStorage.setItem("n8n-enhanced-widget-url", url);
  };

  const handleCustomizationsChange = (newCustomizations: N8nEnhancedWidgetCustomizations) => {
    setCustomizations(newCustomizations);
    localStorage.setItem("n8n-enhanced-widget-customizations", JSON.stringify(newCustomizations));
  };

  const updateSessionData = (newData: any) => {
    const updatedSession = {
      ...sessionData,
      ...newData,
      lastActive: new Date().toISOString()
    };
    setSessionData(updatedSession);
    localStorage.setItem("n8n-chat-session", JSON.stringify(updatedSession));
  };

  const clearSession = () => {
    const newSession = {
      sessionId: `session_${Date.now()}`,
      messageHistory: [],
      lastActive: new Date().toISOString()
    };
    setSessionData(newSession);
    localStorage.setItem("n8n-chat-session", JSON.stringify(newSession));
  };

  // Auto-save session data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionData.messageHistory.length > 0) {
        localStorage.setItem("n8n-chat-session", JSON.stringify(sessionData));
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [sessionData]);

  return {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    sessionData,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange,
    updateSessionData,
    clearSession
  };
}
