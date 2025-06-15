
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ApolloSearchPreview } from "@/components/lead-agent/ApolloSearchPreview";
import type { SearchParameters } from "@/types/leadAgent";

const LeadAgent = () => {
  // Dieser State kann später durch Nachrichten vom Chat-Widget befüllt werden
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({});

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Agent</h1>
            <p className="text-gray-600 mb-6">
              Nutze das Chat-Widget unten rechts, um deine Lead-Suche zu starten. Die Ergebnisse werden hier angezeigt.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Die linke Seite ist jetzt frei für andere Inhalte oder bleibt leer */}
              <div>
                {/* Hier könnten später Konfigurations- oder Filteroptionen angezeigt werden */}
              </div>
              
              <ApolloSearchPreview searchParameters={searchParameters} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadAgent;
