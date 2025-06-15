import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ApolloSearchPreview } from "@/components/lead-agent/ApolloSearchPreview";
import type { SearchParameters } from "@/types/leadAgent";

const LeadAgent = () => {
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({});

  // Dieser useEffect Hook hört auf Nachrichten aus dem Chat-iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Sicherheitsüberprüfung ist hier optional, da der iFrame von derselben Domain kommt
      const data = event.data;

      // Suchen nach searchParameters in der Nachricht vom Chat
      if (data && data.searchParameters) {
        console.log("Parameter aus iFrame-Chat empfangen:", data.searchParameters);
        setSearchParameters(data.searchParameters);
      }
    };

    window.addEventListener('message', handleMessage);

    // Aufräumen, wenn die Komponente verlassen wird
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Leeres Array, damit der Listener nur einmal registriert wird

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-150px)]">
              
              {/* Linke Spalte: Das Chat-Fenster */}
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Lead Agent</h2>
                <div className="flex-1 border rounded-lg overflow-hidden shadow-sm">
                  <iframe
                    src="/n8n-chat.html"
                    className="w-full h-full border-0"
                    title="n8n Chat Agent"
                  />
                </div>
              </div>

              {/* Rechte Spalte: Die Ergebnisse/Vorschau */}
              <div className="flex flex-col h-full">
                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Suchergebnis-Vorschau</h2>
                <div className="flex-1">
                  <ApolloSearchPreview searchParameters={searchParameters} />
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadAgent;
