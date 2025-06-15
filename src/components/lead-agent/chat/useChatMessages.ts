import { useState, useEffect, useRef, useCallback } from "react";
import { TargetAudience, SearchParameters } from "@/types/leadAgent";
import { N8nService } from "@/services/n8n/N8nService";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "./ChatMessage";

/**
 * Returns true if value seems to be an embed URL (from settings logic)
 */
const isEmbedUrl = (url?: string) =>
  !!url && /(form|embed|elestio\.app|\.n8n\.)/.test(url);

interface UseChatMessagesProps {
  webhookUrl?: string;
  targetAudience: TargetAudience;
  onParametersGenerated: (parameters: SearchParameters) => void;
  showDebug: boolean;
}

/**
 * Unified chat messages hook for n8n webhook and embed/chat integration.
 */
export function useChatMessages({
  webhookUrl,
  targetAudience,
  onParametersGenerated,
  showDebug
}: UseChatMessagesProps) {

  // Used for postMessage to iframe in embed mode
  const chatIframeRef = useRef<HTMLIFrameElement | null>(null);
  // "Embed" vs "Webhook" determines chat mode
  const [mode, setMode] = useState<'webhook' | 'embed'>('webhook');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initial welcome message (real, always shown)
  const WELCOME_MESSAGE = "🐱 **Miau! Willkommen beim Lead-Jagd-Assistenten!**\n\nIch bin Ihr schnurrfähiger n8n-powered Lead Agent.\n\nBeschreiben Sie mir, welche Art von Leads Sie suchen:";
  // Give a fallback message if nothing else works
  const NO_CONFIG_MSG = "⚠️ **n8n Chat ist noch nicht konfiguriert.**\n\nBitte richten Sie in den Einstellungen eine gültige n8n Embed/Widget URL ein!";

  // Set mode according to url
  useEffect(() => {
    setMode(isEmbedUrl(webhookUrl) ? "embed" : "webhook");
  }, [webhookUrl]);

  // Show the welcome message when chat opens OR url switches
  useEffect(() => {
    setMessages([
      {
        id: "1",
        type: "agent",
        content: webhookUrl ? WELCOME_MESSAGE : NO_CONFIG_MSG,
        timestamp: new Date()
      }
    ]);
  // Use webhookUrl as a reset: shows welcome message on chat config switch!
  }, [webhookUrl]);

  // Handler for messages (user -> n8n)
  const sendMessage = useCallback(async (inputValue: string) => {
    if (!inputValue.trim()) return;

    // Warn if no config
    if (!webhookUrl) {
      toast({
        title: "⚠️ Konfiguration erforderlich",
        description: "Bitte konfigurieren Sie die n8n Embed URL.",
        variant: "destructive",
      });
      return;
    }

    // Show user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    // "Embed" mode means we talk to an iframe, not a webhook
    if (mode === "embed") {
      // Post message to the embedded chat iframe if it exists
      const iframes = window.document.querySelectorAll("iframe");
      let chatWindow: Window | null = null;
      // Try to find the right iframe using src
      for (const iframe of Array.from(iframes)) {
        try {
          if (
            iframe.src &&
            isEmbedUrl(iframe.src) &&
            (!webhookUrl || iframe.src.includes(webhookUrl))
          ) {
            chatWindow = iframe.contentWindow;
            break;
          }
        } catch { /* ignore CORS here */ }
      }

      if (chatWindow) {
        // Standard for chatbots: 
        chatWindow.postMessage(JSON.stringify({ type: "userMessage", content: inputValue }), "*");
      }

      // Add visual message, display loading/typing
      setIsLoading(true);

      // Auto-fallback: No guarantee we'll get a response from iframe!
      setTimeout(() => setIsLoading(false), 1200);
      return;
    }

    // WEBHOOK Mode = API call for answer
    setIsLoading(true);

    try {
      const n8nService = new N8nService(webhookUrl, { timeout: 15000 });
      const response = await n8nService.sendMessage({
        prompt: inputValue, // <-- SEND AS 'prompt' instead of 'message'
        targetAudience,
        timestamp: new Date().toISOString(),
      });

      // Success? Show message(s) + parameters
      if (response.success) {
        // Main agent message, fallback/welcome/regular AI message
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "agent",
            content: response.aiResponse || "🐱 Signal-Rausch-optimierte Antwort.",
            timestamp: new Date(),
            parameters: response.searchParameters,
            debug: response.debug,
          }
        ]);
        if (showDebug && response.debug) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              type: "debug",
              content: `🔍 Debug Info: ${JSON.stringify(response.debug, null, 2)}`,
              timestamp: new Date(),
              debug: response.debug,
            }
          ]);
        }
        // Add summary with parameters if available to chat + to parent hook
        if (response.searchParameters) {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                id: (Date.now() + 3).toString(),
                type: "agent",
                content:
                  `🎯 **Suchparameter:**\n` +
                  `**Branche:** ${response.searchParameters.industry || 'Nicht spezifiziert'}\n` +
                  `**Position:** ${response.searchParameters.jobTitle || 'Nicht spezifiziert'}\n` +
                  `**Standort:** ${response.searchParameters.location || 'Nicht spezifiziert'}\n` +
                  `**Firmengröße:** ${response.searchParameters.companySize || 'Nicht spezifiziert'}\n` +
                  `**Leads geschätzt:** ~${response.searchParameters.estimatedLeads || 'Unbekannt'}\n`,
                timestamp: new Date(),
                parameters: response.searchParameters,
              }
            ]);
          }, 500);
          onParametersGenerated(response.searchParameters);
        }
      } else {
        // Should not normally happen, fallback error
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 5).toString(),
            type: "error",
            content: `❌ Fehler: ${response.message}`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 9).toString(),
          type: "error",
          content: `💥🐱 Fehler: ${error instanceof Error ? error.message : 'Unbekanntes Problem.'}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, mode, onParametersGenerated, showDebug, targetAudience, toast]);

  // Listen to embedded chat responses ("embed" mode)
  useEffect(() => {
    if (mode !== "embed" || !webhookUrl) return;

    function handleEmbedMessage(event: MessageEvent) {
      // Must match origin (ignore others)
      try {
        const expectedOrigin = new URL(webhookUrl).origin;
        if (event.origin !== expectedOrigin) {
          // Ignore noise from other iframes/windows
          return;
        }
      } catch {}

      let data: unknown;
      try {
        data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch { }

      if (!data) return;

      // If it's just a firstEntryJson "json dump", only handle if no other messages yet
      if (typeof data === "string" && data.includes("firstEntryJson")) {
        if (messages.length <= 1) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 12).toString(),
              type: "agent",
              content: "⚠️🚧 Das eingebettete Chat-Widget ist noch nicht korrekt konfiguriert (firstEntryJson empfangen, keine echte Antwort).",
              timestamp: new Date()
            }
          ]);
        }
        return;
      }

      // Embed chat: "type: agentMessage" or object with searchParameters
      if ((data as any)?.type === "searchParameters" && (data as any)?.parameters) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 30).toString(),
            type: "agent",
            content: "🎯 Suchparameter generiert über das Embed-Widget!",
            parameters: (data as any).parameters,
            timestamp: new Date()
          }
        ]);
        onParametersGenerated((data as any).parameters);
      } else if ((data as any)?.searchParameters) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 45).toString(),
            type: "agent",
            content: "🎯 Suchparameter empfangen (Alternative Format, Embed).",
            parameters: (data as any).searchParameters,
            timestamp: new Date()
          }
        ]);
        onParametersGenerated((data as any).searchParameters);
      } else if ((data as any)?.type === "agentMessage" && (data as any)?.content) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 31).toString(),
            type: "agent",
            content: (data as any).content,
            timestamp: new Date()
          }
        ]);
      }
    }

    window.addEventListener("message", handleEmbedMessage);
    return () => window.removeEventListener("message", handleEmbedMessage);
    // Only reset when webhookUrl or mode actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookUrl, mode, onParametersGenerated]);

  return {
    messages,
    isLoading,
    sendMessage,
    chatIframeRef, // not yet used in consumer, but here for future referencing
    mode
  };
}

// This file is now over 200 lines and keeping all logic unified.
// You should consider splitting embed/webhook logic into smaller files for better maintainability!
