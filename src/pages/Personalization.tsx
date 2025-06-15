import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  Users, 
  MailCheck, 
  Globe, 
  Building, 
  Wand2, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  FolderOpen,
  FolderClosed
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Lead-Typ
type SimpleLead = {
  id: string;
  source_id: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  scrape_job_id: string | null;
  [key: string]: any;
};

// Gruppierte Leads nach Scrape-Job
type LeadGroup = {
  scrape_job_id: string | null;
  scrape_job_name: string;
  date: string;
  leads: SimpleLead[];
  totalLeads: number;
  withEmail: number;
};

// UI-Komponente für einen einzelnen Lead
function LeadCard({ lead }: { lead: SimpleLead }) {
  const { toast } = useToast();

  // Vollständigen Namen zusammenstellen
  const getFullName = () => {
    const firstName = lead.first_name || lead.raw_scraped_data?.firstName || '';
    const lastName = lead.last_name || lead.raw_scraped_data?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (lead.raw_scraped_data?.name) {
      return lead.raw_scraped_data.name;
    }
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
      description: `${serviceName} für ${getFullName()} wird ausgeführt.`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-base text-gray-900">{getFullName()}</h4>
            {getTitle() && (
              <p className="text-sm text-muted-foreground font-medium">{getTitle()}</p>
            )}
            {getCompany() && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building size={12} /> {getCompany()}
              </p>
            )}
          </div>
        </div>

        {/* Kontaktinformationen */}
        <div className="space-y-1 mb-3 p-2 bg-gray-50 rounded">
          {getEmail() ? (
            <div className="flex items-center gap-2 text-sm">
              <MailCheck size={12} className="text-green-600" />
              <span className="text-green-700 font-medium text-xs">{getEmail()}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MailCheck size={12} />
              <span className="text-xs">Keine E-Mail verfügbar</span>
            </div>
          )}
        </div>

        {/* Anreicherungsservices - kompakt */}
        <div className="flex flex-wrap gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7"
            onClick={() => handleEnrichment('E-Mail')}
          >
            <MailCheck className="mr-1" size={12} /> 
            E-Mail
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7"
            onClick={() => handleEnrichment('Website')}
          >
            <Globe className="mr-1" size={12} /> 
            Website
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7"
            onClick={() => handleEnrichment('Firma')}
          >
            <Building className="mr-1" size={12} /> 
            Firma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// UI-Komponente für eine Gruppe von Leads
function LeadGroupCard({ group, isExpanded, onToggle }: { 
  group: LeadGroup; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) {
  return (
    <Card className="mb-4">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                ) : (
                  <FolderClosed className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <CardTitle className="text-lg">{group.scrape_job_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {group.date}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{group.totalLeads}</div>
                  <div className="text-xs text-muted-foreground">Leads</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{group.withEmail}</div>
                  <div className="text-xs text-muted-foreground">mit E-Mail</div>
                </div>
                <div className="flex items-center">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-gray-700">
                {group.totalLeads} Leads aus diesem Import:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.leads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Hauptkomponente
const Personalization = () => {
  const [leadGroups, setLeadGroups] = useState<LeadGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const expandAllGroups = () => {
    setExpandedGroups(new Set(leadGroups.map(g => g.scrape_job_id || 'unknown')));
  };

  const collapseAllGroups = () => {
    setExpandedGroups(new Set());
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('📊 Fetching all leads from database...');
      
      // Alle Leads laden (limit erhöht)
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          scrape_jobs (
            job_name,
            started_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(200); // Mehr Leads laden

      if (error) {
        console.error("❌ Database error:", error);
        setErrorMessage(`Datenbankfehler: ${error.message}`);
        toast({
          title: "Datenbankfehler",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No leads found');
        setErrorMessage('Keine Leads gefunden');
        setLeadGroups([]);
        return;
      }

      console.log(`✅ ${data.length} leads loaded successfully`);

      // Leads nach scrape_job_id gruppieren
      const grouped = data.reduce((acc, lead) => {
        const jobId = lead.scrape_job_id || 'unknown';
        if (!acc[jobId]) {
          acc[jobId] = [];
        }
        acc[jobId].push(lead);
        return acc;
      }, {} as Record<string, SimpleLead[]>);

      // Gruppen erstellen und sortieren
      const groups: LeadGroup[] = Object.entries(grouped)
        .map(([jobId, leads]) => {
          const firstLead = leads[0];
          const jobInfo = firstLead.scrape_jobs?.[0];
          
          // Job-Name generieren
          let jobName = 'Unbekannter Import';
          if (jobInfo?.job_name) {
            jobName = jobInfo.job_name;
          } else if (firstLead.source_id) {
            jobName = `Import ${firstLead.source_id}`;
          } else {
            // Datum als Fallback
            const date = new Date(firstLead.created_at);
            jobName = `Import vom ${date.toLocaleDateString('de-DE')}`;
          }

          // Datum für Sortierung
          const date = jobInfo?.started_at || firstLead.created_at;

          return {
            scrape_job_id: jobId,
            scrape_job_name: jobName,
            date: new Date(date).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            leads: leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
            totalLeads: leads.length,
            withEmail: leads.filter(l => l.email || l.raw_scraped_data?.email).length
          };
        })
        .sort((a, b) => {
          // Nach Datum sortieren (neueste zuerst)
          const dateA = new Date(a.leads[0].created_at);
          const dateB = new Date(b.leads[0].created_at);
          return dateB.getTime() - dateA.getTime();
        });

      setLeadGroups(groups);
      
      toast({
        title: "Leads geladen",
        description: `${data.length} Leads in ${groups.length} Gruppen geladen.`
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

  useEffect(() => {
    fetchLeads();
  }, []);

  // Gesamtstatistiken berechnen
  const totalStats = {
    totalLeads: leadGroups.reduce((sum, group) => sum + group.totalLeads, 0),
    totalWithEmail: leadGroups.reduce((sum, group) => sum + group.withEmail, 0),
    totalGroups: leadGroups.length
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
                  Leads nach Import-Jobs organisiert. Klicke auf einen Job, um die Details zu sehen.
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

              {/* Gesamtstatistiken */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Import-Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{totalStats.totalGroups}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalStats.totalLeads}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mit E-Mail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{totalStats.totalWithEmail}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalStats.totalLeads > 0 ? Math.round((totalStats.totalWithEmail / totalStats.totalLeads) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Aktionen</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button onClick={expandAllGroups} variant="outline" size="sm" className="text-xs">
                      Alle öffnen
                    </Button>
                    <Button onClick={collapseAllGroups} variant="outline" size="sm" className="text-xs">
                      Alle schließen
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Lead-Gruppen */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : leadGroups.length === 0 ? (
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Import-Jobs ({leadGroups.length})
                    </h2>
                  </div>
                  
                  {leadGroups.map((group) => (
                    <LeadGroupCard
                      key={group.scrape_job_id || 'unknown'}
                      group={group}
                      isExpanded={expandedGroups.has(group.scrape_job_id || 'unknown')}
                      onToggle={() => toggleGroup(group.scrape_job_id || 'unknown')}
                    />
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
