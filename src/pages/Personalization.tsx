
import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, MailCheck, Globe, Linkedin, Building, Wand2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Typ-Definition für einen Lead aus unserer neuen Tabelle
type Lead = {
  id: string;
  full_name: string | null;
  title: string | null;
  company_name: string | null;
  location: string | null;
  is_email_verified: boolean;
  website_analysis_summary: string | null;
};

// UI-Komponente für einen einzelnen Lead
function LeadCard({ lead }: { lead: Lead }) {
  const { toast } = useToast();

  const handleEnrichment = (serviceName: string) => {
    toast({
      title: "Anreicherung gestartet (Simulation)",
      description: `${serviceName} für ${lead.full_name || 'diesen Lead'} wird ausgeführt.`,
    });
    // Hier würde die echte API-Anfrage für den Service gestartet
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{lead.full_name || 'Unbekannter Name'}</h3>
            <p className="text-sm text-muted-foreground">{lead.title || 'Kein Titel'}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Building size={14} /> {lead.company_name || 'Kein Unternehmen'}
            </p>
          </div>
          <Badge variant={lead.is_email_verified ? 'default' : 'secondary'}>
            {lead.is_email_verified ? 'E-Mail verifiziert' : 'Unverifiziert'}
          </Badge>
        </div>
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Anreicherungsservices</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('E-Mail Validierung')}>
              <MailCheck className="mr-2" size={16} /> E-Mail Validierung
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Website Analyse')}>
              <Globe className="mr-2" size={16} /> Website Analyse
            </Button>
             <Button size="sm" variant="outline" onClick={() => handleEnrichment('Privates LinkedIn Profil')}>
              <Linkedin className="mr-2" size={16} /> Privates Profil
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Unternehmensprofil Analyse')}>
              <Linkedin className="mr-2" size={16} /> Unternehmensprofil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hauptkomponente für die Personalisierungs-Seite
const Personalization = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('id, full_name, title, company_name, location, is_email_verified, website_analysis_summary')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Fehler beim Laden der Leads:", error);
      } else if (data) {
        setLeads(data as Lead[]);
      }
      setIsLoading(false);
    };

    fetchLeads();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Wand2 /> Personalization
                </h1>
                <p className="text-gray-600">
                  Veredle deine Leads mit zusätzlichen Daten aus verschiedenen Quellen.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users /> Verfügbare Leads</CardTitle>
                  <CardDescription>
                    {isLoading ? 'Lade Leads...' : `Insgesamt ${leads.length} Leads zur Bearbeitung verfügbar.`}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Personalization;
