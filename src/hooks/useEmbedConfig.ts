
import { useState } from 'react';

export function useEmbedConfig() {
  const [embedUrl, setEmbedUrl] = useState(() => {
    return localStorage.getItem("n8n-embed-url") || "";
  });

  const handleEmbedUrlChange = (url: string) => {
    setEmbedUrl(url);
    localStorage.setItem("n8n-embed-url", url);
  };

  return {
    embedUrl,
    handleEmbedUrlChange
  };
}
