
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import LeadAgent from "./pages/LeadAgent";
import Personalization from "./pages/Personalization";
import Integrations from "./pages/Integrations";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// n8n Chat Integration
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useN8nConfig } from "./hooks/useN8nConfig";

const queryClient = new QueryClient();

const App = () => {
  const { isEnabled, webhookUrl, customizations } = useN8nConfig();

  // Dieser useEffect-Hook verwaltet den gesamten Lebenszyklus des Chat-Widgets
  useEffect(() => {
    let chatInstance: { unmount: () => void } | undefined;

    // Erstelle den Chat nur, wenn er aktiviert ist und eine URL hat
    if (isEnabled && webhookUrl) {
      chatInstance = createChat({
        webhookUrl: webhookUrl,
        // Hier können wir die restlichen Anpassungen aus dem Hook übergeben
        ...customizations,
      });
    }

    // Cleanup-Funktion: Diese wird ausgeführt, wenn die App geschlossen
    // oder die Konfiguration geändert wird. Sie entfernt das Widget sauber.
    return () => {
      if (chatInstance) {
        try {
          chatInstance.unmount();
        } catch (error) {
          console.error("Fehler beim Entfernen des Chat-Widgets:", error);
        }
      }
    };
  }, [isEnabled, webhookUrl, customizations]); // Führe den Effekt neu aus, wenn sich die Konfiguration ändert

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/lead-agent" element={<ProtectedRoute><LeadAgent /></ProtectedRoute>} />
              <Route path="/personalization" element={<ProtectedRoute><Personalization /></ProtectedRoute>} />
              <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
              <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
