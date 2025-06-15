import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, MailCheck, Globe, Linkedin, Building, Wand2, MapPin, Phone, ExternalLink } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Typ-Definition für einen Lead aus der neuen leads Tabelle
type Lead = {
  id: string;
  source_id: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  company_name: string | null;
  person_linkedin_url: string | null;
  company_linkedin_url: string | null;
  facebook_url: string | null;
  keywords: string[] | null;
  raw_scraped_data: any | null;
  enriched_data: any | null;
  scrape_job_id: string | null;
  user_id: string | null;
  // Zusätzliche Daten aus scrape_jobs via JOIN
  scrape_jobs?: {
    job_name: string | null;
    started_at: string;
  };
};

// UI-Komponente für einen einzelnen Lead
function LeadCard({ lead }: { lead: Lead }) {
  const { toast } = useToast();

  // Lead-Informationen zusammenstellen
  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unbekannter Name';
  const location = [lead.city, lead.state, lead.country].filter(Boolean).join(', ') || null;
  const hasEnrichedData = lead.enriched_data && Object.keys(lead.enriched_data).length > 0;

  const handleEnrichment = (serviceName: string) => {
    toast({
      title: "Anreicherung gestartet",
      description: `${serviceName} für ${fullName} wird ausgeführt.`,
    });
    // Hier würde die echte API-Anfrage für den Service gestartet
  };

  const getSourceBadge = () => {
    if (lead.source_id) {
      return <Badge variant="outline">Quelle: {lead.source_id}</Badge>;
    }
    return <Badge variant="secondary">Manuelle Eingabe</Badge>;
  };

  const getEnrichmentStatus = () => {
    if (hasEnrichedData) {
      return <Badge className="bg-green-100 text-green-800">Angereichert</Badge>;
    }
    return <Badge variant="secondary">Basis-Daten</Badge>;
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{fullName}</h3>
            {lead.title && (
              <p className="text-sm text-muted-foreground font-medium">{lead.title}</p>
            )}
            {lead.company_name && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building size={14} /> {lead.company_name}
              </p>
            )}
            {location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin size={14} /> {location}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getSourceBadge()}
            {getEnrichmentStatus()}
          </div>
        </div>

        {/* Kontaktinformationen */}
        <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Kontakt</h4>
          {lead.email ? (
            <div className="flex items-center gap-2 text-sm">
              <MailCheck size={14} className="text-green-600" />
              <span className="text-green-700 font-medium">{lead.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MailCheck size={14} />
              <span>Keine E-Mail verfügbar</span>
            </div>
          )}
          
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-blue-600" />
              <span>{lead.phone}</span>
            </div>
          )}
          
          {lead.person_linkedin_url && (
            <div className="flex items-center gap-2 text-sm">
              <Linkedin size={14} className="text-blue-600" />
              <a 
                href={lead.person_linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate flex items-center gap-1"
              >
                LinkedIn Profil <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Keywords falls vorhanden */}
        {lead.keywords && lead.keywords.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-1">
              {lead.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {lead.keywords.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{lead.keywords.length - 5} weitere
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Angereicherte Daten falls vorhanden */}
        {hasEnrichedData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-xs font-semibold uppercase text-blue-800 mb-2">
              Angereicherte Daten verfügbar
            </h4>
            <p className="text-xs text-blue-700">
              {Object.keys(lead.enriched_data).join(', ')}
            </p>
          </div>
        )}

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
              disabled={!lead.email}
            >
              <MailCheck className="mr-2" size={14} /> 
              E-Mail {lead.email ? 'validieren' : 'finden'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Website Analyse')}>
              <Globe className="mr-2" size={14} /> Website Analyse
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleEnrichment('LinkedIn Profil')}
              disabled={!lead.person_linkedin_url}
            >
              <Linkedin className="mr-2" size={14} /> 
              {lead.person_linkedin_url ? 'LinkedIn analysieren' : 'LinkedIn finden'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEnrichment('Unternehmensprofil')}>
              <Building className="mr-2" size={14} /> Firmendaten
            </Button>
          </div>
        </div>

        {/* Metadaten */}
        <div className="pt-4 border-t">
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-gray-700 mb-2">
              Lead-Details anzeigen
            </summary>
            <div className="bg-gray-100 p-3 rounded text-xs space-y-1">
              <p><strong>ID:</strong> {lead.id}</p>
              {lead.source_id && <p><strong>Quelle:</strong> {lead.source_id}</p>}
              {lead.scrape_job_id && <p><strong>Scrape Job:</strong> {lead.scrape_job_id}</p>}
              <p><strong>Erstellt:</strong> {new Date(lead.created_at).toLocaleString('de-DE')}</p>
              <p><strong>Aktualisiert:</strong> {new Date(lead.updated_at).toLocaleString('de-DE')}</p>
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

// Hauptkomponente für die Personalisierungs-Seite
const Personalization = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      
      try {
        console.log('📊 Lade Leads aus der leads Tabelle...');
        
        // Hole alle Leads mit optional JOIN zu scrape_jobs
        const { data, error } = await supabase
          .from('leads')
          .select(`
            id,
            source_id,
            created_at,
            updated_at,
            first_name,
            last_name,
            title,
            email,
            phone,
            country,
            city,
            state,
            company_name,
            person_linkedin_url,
            company_linkedin_url,
            facebook_url,
            keywords,
            raw_scraped_data,
            enriched_data,
            scrape_job_id,
            user_id,
            scrape_jobs (
              job_name,
              started_at
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error("❌ Fehler beim Laden der Leads:", error);
          toast({
            title: "Fehler beim Laden",
            description: `Die Leads konnten nicht geladen werden: ${error.message}`,
            variant: "destructive"
          });
        } else if (data) {
          console.log(`✅ ${data.length} Leads erfolgreich geladen`);
          setLeads(data as Lead[]);
          toast({
            title: "Leads geladen",
            description: `${data.length} Leads erfolgreich geladen.`
          });
        }
      } catch (error) {
        console.error("❌ Unerwarteter Fehler:", error);
        toast({
          title: "Unerwarteter Fehler",
          description: "Beim Laden der Leads ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [toast]);

  // Statistiken berechnen
  const stats = {
    total: leads.length,
    withEmail: leads.filter(l => l.email).length,
    withPhone: leads.filter(l => l.phone).length,
    withLinkedIn: leads.filter(l => l.person_linkedin_url).length,
    enriched: leads.filter(l => l.enriched_data && Object.keys(l.enriched_data).length > 0).length
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

              {/* Statistik Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    <CardTitle className="text-sm font-medium">Mit Telefon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.withPhone}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mit LinkedIn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.withLinkedIn}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats.withLinkedIn / stats.total) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Angereichert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.enriched}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0}%
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
                      Es wurden noch keine Leads in die Datenbank importiert.
                    </p>
                    <Button asChild>
                      <a href="/lead-agent">Zur Lead-Generierung</a>
                    </Button>
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
