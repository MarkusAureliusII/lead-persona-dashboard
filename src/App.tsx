
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { N8nChatWidgetManager } from "@/components/lead-agent/N8nChatWidgetManager";
import Index from "./pages/Index";
import LeadAgent from "./pages/LeadAgent";
import Personalization from "./pages/Personalization";
import Integrations from "./pages/Integrations";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/lead-agent" element={
              <ProtectedRoute>
                <LeadAgent />
              </ProtectedRoute>
            } />
            <Route path="/personalization" element={
              <ProtectedRoute>
                <Personalization />
              </ProtectedRoute>
            } />
            <Route path="/integrations" element={
              <ProtectedRoute>
                <Integrations />
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Globales Chat Widget - wird auf allen geschützten Seiten angezeigt */}
          <ProtectedRoute>
            <N8nChatWidgetManager />
          </ProtectedRoute>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
