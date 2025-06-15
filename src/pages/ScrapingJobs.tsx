import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  FolderOpen, 
  Calendar,
  Users,
  Download,
  RefreshCw,
  Database
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Types für Scrape Jobs
type ScrapeJob = {
  id: string;
  job_name: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  lead_count: number;
  source_url: string | null;
  created_at: string;
};

// Job Card Komponente
function JobCard({ job }: { job: ScrapeJob }) {
  const handleExport = () => {
    // Einfache CSV-Export Simulation
    console.log('Exporting job:', job.job_name);
    alert(`Export für ${job.job_name} würde hier gestartet werden.`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              {job.job_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(job.started_at).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Statistiken */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{job.lead_count}</div>
              <div className="text-sm text-blue-700">Leads gefunden</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">
                {job.completed_at ? 'Abgeschlossen' : 'In Bearbeitung'}
              </div>
              <div className="text-xs text-green-700">
                {job.completed_at 
                  ? new Date(job.completed_at).toLocaleDateString('de-DE')
                  : 'Läuft...'
                }
              </div>
            </div>
          </div>

          {/* Source URL */}
          {job.source_url && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Quelle:</span>{' '}
              <span className="text-blue-600">{job.source_url}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleExport}
              className="flex-1"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV Export
            </Button>
            <Button 
              onClick={() => alert('Lead-Details würden hier angezeigt werden.')}
              className="flex-1"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hauptkomponente
const ScrapingJobs = () => {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Scrape Jobs laden
  const fetchScrapeJobs = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('📊 Fetching scrape jobs from database...');
      
      const { data, error } = await supabase
        .from('scrape_jobs')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) {
        console.error("❌ Database error:", error);
        setErrorMessage(`Datenbankfehler: ${error.message}`);
        
        // Fallback: Zeige Demo-Daten wenn Tabelle nicht existiert
        if (error.message.includes('relation "scrape_jobs" does not exist')) {
          const demoJobs: ScrapeJob[] = [
            {
              id: '1',
              job_name: 'Demo Scrape Job #1',
              started_at: new Date().toISOString(),
              completed_at: new Date().toISOString(),
              status: 'completed',
              lead_count: 150,
              source_url: 'https://example.com',
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              job_name: 'Demo Scrape Job #2',
              started_at: new Date(Date.now() - 86400000).toISOString(),
              completed_at: null,
              status: 'running',
              lead_count: 89,
              source_url: 'https://another-example.com',
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          setJobs(demoJobs);
          setErrorMessage('Demo-Daten werden angezeigt (scrape_jobs Tabelle nicht vorhanden)');
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
        console.log('⚠️ No scrape jobs found');
        setJobs([]);
        return;
      }

      console.log(`✅ ${data.length} scrape jobs loaded successfully`);
      setJobs(data);
      
      toast({
        title: "Scrape-Jobs geladen",
        description: `${data.length} Scrape-Jobs erfolgreich geladen.`
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
    fetchScrapeJobs();
  }, []);

  // Statistiken berechnen
  const totalLeads = jobs.reduce((sum, job) => sum + job.lead_count, 0);
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const activeJobs = jobs.filter(job => job.status !== 'completed').length;

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
                  <Database /> Scraping-Vorgänge
                </h1>
                <p className="text-gray-600">
                  Übersicht aller abgeschlossenen und laufenden Scraper-Läufe mit detaillierter Lead-Analyse.
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
                      <Button onClick={fetchScrapeJobs} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut versuchen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statistiken */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Aktiv</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{activeJobs}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{totalLeads}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Jobs Liste */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Lade Scrape-Jobs...</span>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Keine Scrape-Jobs gefunden
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Es wurden noch keine Scraping-Vorgänge gestartet.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={fetchScrapeJobs} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Erneut laden
                      </Button>
                      <Button asChild>
                        <a href="/lead-agent">Zum Lead-Scraper</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Scrape-Jobs ({jobs.length})
                    </h2>
                    <Button onClick={fetchScrapeJobs} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Aktualisieren
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
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

export default ScrapingJobs;