
import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Target,
  Calendar,
  BarChart3,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Types für Statistiken
type Statistics = {
  totalLeadsScraped: number;
  mailingListAdditions: number;
  personalizationRate: number;
  conversionRate: number;
  newLeads: number;
  emailVerifiedLeads: number;
  enrichedLeads: number;
  personalizedLeads: number;
  readyForOutreachLeads: number;
  contactedLeads: number;
  validEmails: number;
  totalScrapeJobs: number;
};

const Statistics = () => {
  const [stats, setStats] = useState<Statistics>({
    totalLeadsScraped: 0,
    mailingListAdditions: 0,
    personalizationRate: 0,
    conversionRate: 0,
    newLeads: 0,
    emailVerifiedLeads: 0,
    enrichedLeads: 0,
    personalizedLeads: 0,
    readyForOutreachLeads: 0,
    contactedLeads: 0,
    validEmails: 0,
    totalScrapeJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Statistiken laden
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching statistics from database...');

      // Parallel requests für bessere Performance
      const [
        totalLeadsResult,
        mailingListResult,
        newLeadsResult,
        emailVerifiedResult,
        enrichedResult,
        personalizedResult,
        readyForOutreachResult,
        contactedLeadsResult,
        validEmailsResult,
        scrapeJobsResult
      ] = await Promise.all([
        // Total Leads Scraped
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        
        // Mailing List Additions (Leads mit Status contacted)
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
        
        // New Leads (Status = new)
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        
        // Email Verified Leads
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'email_verified'),
        
        // Enriched Leads
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'enriched'),
        
        // Personalized Leads
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'personalized'),
        
        // Ready for Outreach Leads
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'ready_for_outreach'),
        
        // Contacted Leads (Status = contacted)
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
        
        // Valid Emails
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('is_email_valid', true),
        
        // Total Scrape Jobs
        supabase.from('scrape_jobs').select('*', { count: 'exact', head: true })
      ]);

      // Fehler prüfen
      const errors = [
        totalLeadsResult.error,
        mailingListResult.error,
        newLeadsResult.error,
        emailVerifiedResult.error,
        enrichedResult.error,
        personalizedResult.error,
        readyForOutreachResult.error,
        contactedLeadsResult.error,
        validEmailsResult.error,
        scrapeJobsResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        throw new Error(`Database errors: ${errors.map(e => e?.message).join(', ')}`);
      }

      // Statistiken berechnen
      const totalLeads = totalLeadsResult.count || 0;
      const contactedLeads = contactedLeadsResult.count || 0;
      const newLeads = newLeadsResult.count || 0;
      const emailVerifiedLeads = emailVerifiedResult.count || 0;
      const enrichedLeads = enrichedResult.count || 0;
      const personalizedLeads = personalizedResult.count || 0;
      const readyForOutreachLeads = readyForOutreachResult.count || 0;
      const validEmails = validEmailsResult.count || 0;
      const totalScrapeJobs = scrapeJobsResult.count || 0;

      // Personalization Rate: Prozentsatz der Leads, die personalisiert wurden
      const personalizationRate = totalLeads > 0 ? Math.round((personalizedLeads / totalLeads) * 100) : 0;

      // Conversion Rate: Verhältnis von contacted zu ready_for_outreach
      const conversionRate = readyForOutreachLeads > 0 ? Math.round((contactedLeads / readyForOutreachLeads) * 100) : 0;

      const newStats: Statistics = {
        totalLeadsScraped: totalLeads,
        mailingListAdditions: contactedLeads,
        personalizationRate,
        conversionRate,
        newLeads,
        emailVerifiedLeads,
        enrichedLeads,
        personalizedLeads,
        readyForOutreachLeads,
        contactedLeads,
        validEmails,
        totalScrapeJobs
      };

      setStats(newStats);

      console.log('✅ Statistics loaded successfully:', newStats);
      
      toast({
        title: "Statistiken aktualisiert",
        description: "Alle Daten wurden erfolgreich geladen."
      });

    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setError(errorMessage);
      
      toast({
        title: "Fehler beim Laden der Statistiken",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Format große Zahlen
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics & Analytics</h1>
                    <p className="text-gray-600">
                      Live-Daten zu Lead-Scraping, Personalisierung und Mailing-List-Performance.
                    </p>
                  </div>
                  <Button onClick={fetchStatistics} disabled={isLoading} variant="outline">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Aktualisieren
                  </Button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-800">Fehler beim Laden der Statistiken</h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Lade Statistiken...</span>
                </div>
              ) : (
                <>
                  {/* Main Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads Scraped</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.totalLeadsScraped)}</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.newLeads > 0 && `${stats.newLeads} neue Leads im Posteingang`}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personalization Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.personalizationRate}%</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.totalLeadsScraped - stats.newLeads} von {stats.totalLeadsScraped} Leads verarbeitet
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mailing List Additions</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.mailingListAdditions)}</div>
                        <p className="text-xs text-muted-foreground">
                          Leads mit Status "contacted"
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.contactedLeads} von {stats.readyForOutreachLeads} outreach-bereiten Leads
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Zusätzliche Statistiken */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Scrape Jobs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{stats.totalScrapeJobs}</div>
                        <p className="text-xs text-muted-foreground">Gesamt durchgeführt</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">E-Mail Verifiziert</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.emailVerifiedLeads}</div>
                        <p className="text-xs text-muted-foreground">Gültige E-Mails</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Angereichert</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{stats.enrichedLeads}</div>
                        <p className="text-xs text-muted-foreground">Mit Zusatzdaten</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Personalisiert</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.personalizedLeads}</div>
                        <p className="text-xs text-muted-foreground">KI-bearbeitet</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">CRM-Ready</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-teal-600">{stats.readyForOutreachLeads}</div>
                        <p className="text-xs text-muted-foreground">Outreach-bereit</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Validierte E-Mails</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-cyan-600">{stats.validEmails}</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.totalLeadsScraped > 0 
                            ? `${Math.round((stats.validEmails / stats.totalLeadsScraped) * 100)}% aller Leads`
                            : 'Keine Daten'
                          }
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Neue Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.newLeads}</div>
                        <p className="text-xs text-muted-foreground">Warten auf Bearbeitung</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Pipeline Overview */}
              {!isLoading && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Lead-Pipeline Übersicht
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Neue Leads (Posteingang)</p>
                            <p className="text-sm text-gray-600">Warten auf Personalisierung</p>
                          </div>
                        </div>
                        <div className="text-amber-600 font-bold text-xl">{stats.newLeads}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">E-Mail Verifiziert</p>
                            <p className="text-sm text-gray-600">Gültige E-Mail-Adressen</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-bold text-xl">{stats.emailVerifiedLeads}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Angereichert</p>
                            <p className="text-sm text-gray-600">LinkedIn/Website-Daten hinzugefügt</p>
                          </div>
                        </div>
                        <div className="text-indigo-600 font-bold text-xl">{stats.enrichedLeads}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Personalisiert</p>
                            <p className="text-sm text-gray-600">KI-Personalisierung abgeschlossen</p>
                          </div>
                        </div>
                        <div className="text-green-600 font-bold text-xl">{stats.personalizedLeads}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">CRM-Ready</p>
                            <p className="text-sm text-gray-600">Bereit für Outreach-Kampagnen</p>
                          </div>
                        </div>
                        <div className="text-teal-600 font-bold text-xl">{stats.readyForOutreachLeads}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Kontaktierte Leads</p>
                            <p className="text-sm text-gray-600">In Mailing-Liste aufgenommen</p>
                          </div>
                        </div>
                        <div className="text-purple-600 font-bold text-xl">{stats.contactedLeads}</div>
                      </div>
                      
                      {stats.validEmails > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">
                            E-Mail Qualität: {Math.round((stats.validEmails / stats.totalLeadsScraped) * 100)}%
                          </p>
                          <p className="text-xs text-blue-700">
                            {stats.validEmails} von {stats.totalLeadsScraped} E-Mails sind validiert
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Statistics;
