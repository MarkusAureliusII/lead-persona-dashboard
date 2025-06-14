
import { useState } from 'react';

export function useWebhookConfig() {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("n8n-webhook-url") || "";
  });

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("n8n-webhook-url", url);
  };

  return {
    webhookUrl,
    handleWebhookUrlChange
  };
}
