import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { LeadGenerationForm } from "@/components/lead-agent/LeadGenerationForm";
import { Bot } from "lucide-react";

const LeadAgent = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Sektion 1: AI Chat Agent via iFrame */}
              <section>
                <div className="flex flex-col h-[600px]">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <Bot className="w-7 h-7 text-blue-600" />
                    Option 1: AI Lead Agent (via Chat)
                  </h2>
                  <div className="flex-1 border rounded-xl overflow-hidden shadow-lg bg-white">
                    <iframe
                      src="/n8n-chat.html"
                      className="w-full h-full border-0"
                      title="n8n Chat Agent"
                    />
                  </div>
                </div>
              </section>

              {/* Sektion 2: Manuelles Formular als Alternative */}
              <section>
                <LeadGenerationForm />
              </section>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadAgent;
