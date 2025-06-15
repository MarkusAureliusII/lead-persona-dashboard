import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { 
  Loader2, 
  Users, 
  MailCheck,
  Building,
  Globe,
  Linkedin,
  Phone,
  MapPin,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Types für Leads
type Lead = {
  id: string;
  scrape_job_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  title: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  status: string;
  is_email_valid: boolean | null;
  enriched_data: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Lead Card Komponente
function LeadCard({ lead }: { lead: Lead }) {
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unbekannter Name';
  const location = [lead.city, lead.state, lead.country].filter(Boolean).join(', ');
  
  // Anreicherungs-Daten auswerten
  const enrichmentData = lead.enriched_data || {};
  const hasEnrichments = Object.keys(enrichmentData).length > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{fullName}</CardTitle>
            {lead.title && (
              <p className="text-sm text-muted-foreground font-medium">{lead.title}</p>
            )}
            {lead.company_name && (
              <p className="text-sm text-gray-600">{lead.company_name}</p>
            )}
          </div>
          <Badge variant={lead.status === 'ready_for_outreach' ? 'default' : 'secondary'}>
            {lead.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* E-Mail */}
          {lead.email && (
            <div className="flex items-center gap-2 text-sm">
              <MailCheck size={14} className={lead.is_email_valid ? 'text-green-600' : 'text-blue-600'} />
              <span className={`font-medium ${lead.is_email_valid ? 'text-green-600' : 'text-gray-900'}`}>
                {lead.email}
              </span>
              {lead.is_email_valid && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              {lead.is_email_valid === false && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          )}
          
          {/* Telefon */}
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-blue-600" />
              <span className="font-medium">{lead.phone}</span>
            </div>
          )}
          
          {/* Standort */}
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-gray-500" />
              <span className="text-gray-600">{location}</span>
            </div>
          )}
          
          {/* Website */}
          {lead.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-purple-600" />
              <a 
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {lead.website}
              </a>
            </div>
          )}

          {/* Anreicherungs-Status */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Star className={`w-4 h-4 ${hasEnrichments ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {hasEnrichments ? 'Angereichert' : 'Grunddaten'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hauptkomponente
const Crm = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Leads laden (nur qualifizierte Leads - status != 'new')
  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('📊 Fetching CRM-ready leads from database...');
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('status', ['ready_for_outreach', 'contacted'])  // Nur verarbeitete Leads für CRM
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("❌ Database error:", error);
        setErrorMessage(`Datenbankfehler: ${error.message}`);
        
        // Fallback: Zeige Demo-Daten wenn Tabelle nicht existiert
        if (error.message.includes('relation "leads" does not exist')) {
          const demoLeads: Lead[] = [
            {
              id: '1',
              scrape_job_id: '1',
              first_name: 'Max',
              last_name: 'Mustermann',
              email: 'max.mustermann@example.com',
              phone: '+49 123 456789',
              company_name: 'Demo GmbH',
              title: 'Geschäftsführer',
              website: 'https://demo.com',
              city: 'München',
              state: 'Bayern',
              country: 'Deutschland',
              status: 'qualified',
              is_email_valid: true,
              enriched_data: { website_summary: 'Demo Zusammenfassung' },
              notes: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              scrape_job_id: '1',
              first_name: 'Anna',
              last_name: 'Schmidt',
              email: 'anna.schmidt@test.com',
              phone: null,
              company_name: 'Test AG',
              title: 'Marketing Director',
              website: null,
              city: 'Berlin',
              state: null,
              country: 'Deutschland',
              status: 'contacted',
              is_email_valid: true,
              enriched_data: {},
              notes: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setLeads(demoLeads);
          setFilteredLeads(demoLeads);
          setErrorMessage('Demo-Daten werden angezeigt (leads Tabelle nicht vorhanden)');
          return;
        }
        
        toast({
          title: "Datenbankfehler",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No qualified leads found');
        setLeads([]);
        setFilteredLeads([]);
        return;
      }

      console.log(`✅ ${data.length} CRM-ready leads loaded successfully`);
      setLeads(data);
      setFilteredLeads(data);
      
      toast({
        title: "CRM-Daten geladen",
        description: `${data.length} CRM-ready Leads erfolgreich geladen.`
      });

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

  // Filter anwenden
  useEffect(() => {
    let filtered = leads;

    // Text-Suche
    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const company = (lead.company_name || '').toLowerCase();
        const title = (lead.title || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) ||
               email.includes(search) ||
               company.includes(search) ||
               title.includes(search);
      });
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  useEffect(() => {
    fetchLeads();
  }, []);

  // Statistiken berechnen
  const stats = {
    total: leads.length,
    ready_for_outreach: leads.filter(lead => lead.status === 'ready_for_outreach').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    validEmails: leads.filter(lead => lead.is_email_valid === true).length,
    enriched: leads.filter(lead => lead.enriched_data && Object.keys(lead.enriched_data).length > 0).length
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Users /> CRM
                </h1>
                <p className="text-gray-600">
                  Zentrale Ansicht für alle personalisierten und outreach-bereiten Leads.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-orange-800">Information</h3>
                        <p className="text-sm text-orange-700">{errorMessage}</p>
                      </div>
                      <Button onClick={fetchLeads} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut versuchen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statistiken */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Outreach-Ready</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.ready_for_outreach}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Kontaktiert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.contacted}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valide E-Mails</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.validEmails}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Angereichert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.enriched}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Suche */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Name, E-Mail, Firma suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchTerm && (
                    <div className="mt-2 text-sm text-gray-600">
                      {filteredLeads.length} von {leads.length} Leads angezeigt
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leads Liste */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Lade CRM-Daten...</span>
                </div>
              ) : leads.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Keine CRM-Ready Leads gefunden
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Es wurden noch keine Leads für Outreach vorbereitet.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={fetchLeads} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut laden
                      </Button>
                      <Button asChild>
                        <a href="/personalization">Zum Posteingang</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      CRM-Leads ({filteredLeads.length})
                    </h2>
                    <Button onClick={fetchLeads} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Aktualisieren
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Crm;