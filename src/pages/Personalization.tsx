import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, MailCheck, Globe, Building, Wand2, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Einfacher Lead-Typ basierend auf dem was wir sehen können
type SimpleLead = {
  id: string;
  source_id: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  // Weitere Felder werden dynamisch aus raw_scraped_data extrahiert
  [key: string]: any;
};

// UI-Komponente für einen einzelnen Lead
function LeadCard({ lead }: { lead: SimpleLead }) {
  const { toast } = useToast();

  // Versuche Daten aus verschiedenen Quellen zu extrahieren
  const getName = () => {
    if (lead.first_name) return lead.first_name;
    if (lead.raw_scraped_data?.name) return lead.raw_scraped_data.name;
    if (lead.raw_scraped_data?.firstName) return lead.raw_scraped_data.firstName;
    return 'Unbekannter Name';
  };

  const getEmail = () => {
    return lead.email || lead.raw_scraped_data?.email || null;
  };

  const getCompany = () => {
    return lead.company_name || lead.raw_scraped_data?.company || lead.raw_scraped_data?.companyName || null;
  };

  const getTitle = () => {
    return lead.title || lead.raw_scraped_data?.title || lead.raw_scraped_data?.jobTitle || null;
  };

  const handleEnrichment = (serviceName: string) => {
    toast({
      title: "Anreicherung gestartet",
      description: `${serviceName} für ${getName()} wird ausgeführt.`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{getName()}</h3>
            {getTitle() && (
              <p className="text-sm text-muted-foreground font-medium">{getTitle()}</p>
            )}
            {getCompany() && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building size={14} /> {getCompany()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {lead.source_id && (
              <Badge variant="outline">Quelle: {lead.source_id}</Badge>
            )}
          </div>
        </div>

        {/* Kontaktinformationen */}
        <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Kontakt</h4>
          {getEmail() ? (
            <div className="flex items-center gap-2 text-sm">
              <MailCheck size={14} className="text-green-600" />
              <span className="text-green-700 font-medium">{getEmail()}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MailCheck size={14} />
              <span>Keine E-Mail verfügbar</span>
            </div>
          )}
        </div>

        {/* Anreicherungsservices */}
        <div className="mb-4 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
            Anreicherungsservices
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleEnrichment('E-Mail Validierung')}
            >
              <MailCheck className="mr-2" size={14} /> 
              E-Mail {getEmail() ? 'validieren' : 'finden'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Website Analyse')}>
              <Globe className="mr-2" size={14} /> Website Analyse
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Firmendaten')}>
              <Building className="mr-2" size={14} /> Firmendaten
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="pt-4 border-t">
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-gray-700 mb-2">
              Lead Details
            </summary>
            <div className="bg-gray-100 p-3 rounded text-xs space-y-1">
              <p><strong>ID:</strong> {lead.id}</p>
              <p><strong>Source:</strong> {lead.source_id || 'Unbekannt'}</p>
              <p><strong>Erstellt:</strong> {new Date(lead.created_at).toLocaleString('de-DE')}</p>
              {lead.raw_scraped_data && (
                <div className="mt-2">
                  <strong>Raw Data:</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(lead.raw_scraped_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}

// Hauptkomponente
const Personalization = () => {
  const [leads, setLeads] = useState<SimpleLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('📊 Fetching leads from database...');
      
      // Einfachste mögliche Query - nur die Basics
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("❌ Database error:", error);
        setErrorMessage(`Datenbankfehler: ${error.message}`);
        toast({
          title: "Datenbankfehler",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        console.log(`✅ ${data.length} leads loaded successfully`);
        console.log('First lead sample:', data[0]);
        setLeads(data as SimpleLead[]);
        toast({
          title: "Leads geladen",
          description: `${data.length} Leads erfolgreich geladen.`
        });
      } else {
        console.log('⚠️ No data returned');
        setErrorMessage('Keine Daten zurückgegeben');
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setErrorMessage(errorMsg);
      toast({
        title: "Unerwarteter Fehler",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Statistiken berechnen
  const stats = {
    total: leads.length,
    withEmail: leads.filter(l => l.email || l.raw_scraped_data?.email).length,
    withCompany: leads.filter(l => l.company_name || l.raw_scraped_data?.company).length
  };

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

              {/* Error Message */}
              {errorMessage && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-800">Fehler beim Laden der Daten</h3>
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                      <Button onClick={fetchLeads} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut versuchen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statistik Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mit E-Mail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.withEmail}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mit Firma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.withCompany}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats.withCompany / stats.total) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users /> Lead-Datenbank
                  </CardTitle>
                  <CardDescription>
                    {isLoading ? 'Lade Leads...' : `${leads.length} Leads in der Datenbank.`}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : leads.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Keine Leads gefunden
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {errorMessage ? 'Fehler beim Laden der Daten.' : 'Es wurden noch keine Leads importiert.'}
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={fetchLeads} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut laden
                      </Button>
                      <Button asChild>
                        <a href="/lead-agent">Zur Lead-Generierung</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
