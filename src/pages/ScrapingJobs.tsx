import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { 
  Loader2, 
  FolderOpen, 
  Calendar,
  Users,
  Download,
  RefreshCw,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  Play
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

// Status-Icon und Animation
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'running':
    case 'in_progress':
      return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'failed':
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-600" />;
  }
}

// Status-Badge mit Animation
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running':
      case 'in_progress':
        return { 
          variant: 'default' as const, 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Läuft',
          animate: true
        };
      case 'completed':
        return { 
          variant: 'default' as const, 
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Abgeschlossen',
          animate: false
        };
      case 'failed':
      case 'error':
        return { 
          variant: 'destructive' as const, 
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Fehler',
          animate: false
        };
      default:
        return { 
          variant: 'secondary' as const, 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: status,
          animate: false
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge className={`${config.color} ${config.animate ? 'animate-pulse' : ''}`}>
      <StatusIcon status={status} />
      <span className="ml-1">{config.text}</span>
    </Badge>
  );
}

// Job Card Komponente
function JobCard({ job }: { job: ScrapeJob }) {
  const handleExport = () => {
    // Einfache CSV-Export Simulation
    console.log('Exporting job:', job.job_name);
    alert(`Export für ${job.job_name} würde hier gestartet werden.`);
  };

  const isRunning = job.status === 'running' || job.status === 'in_progress';

  return (
    <Card className={`hover:shadow-md transition-shadow ${isRunning ? 'ring-2 ring-yellow-200' : ''}`}>
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
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Statistiken */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`text-center p-3 rounded-lg ${isRunning ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50'}`}>
              <div className={`text-2xl font-bold ${isRunning ? 'text-yellow-600' : 'text-blue-600'}`}>
                {job.lead_count}
                {isRunning && <Loader2 className="w-4 h-4 inline ml-1 animate-spin" />}
              </div>
              <div className={`text-sm ${isRunning ? 'text-yellow-700' : 'text-blue-700'}`}>
                {isRunning ? 'Leads gefunden (läuft)' : 'Leads gefunden'}
              </div>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              job.completed_at 
                ? 'bg-green-50' 
                : job.status === 'failed' || job.status === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className={`text-sm font-medium ${
                job.completed_at 
                  ? 'text-green-600' 
                  : job.status === 'failed' || job.status === 'error'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {job.completed_at 
                  ? 'Abgeschlossen' 
                  : job.status === 'failed' || job.status === 'error'
                  ? 'Fehlgeschlagen'
                  : 'In Bearbeitung'
                }
              </div>
              <div className={`text-xs ${
                job.completed_at 
                  ? 'text-green-700' 
                  : job.status === 'failed' || job.status === 'error'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                {job.completed_at 
                  ? new Date(job.completed_at).toLocaleDateString('de-DE')
                  : isRunning
                  ? 'Läuft...'
                  : 'Gestoppt'
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
          // Simuliere steigenden Lead-Count für laufende Jobs
          const minutesRunning = Math.floor((Date.now() - (Date.now() - 300000)) / 60000) + 5;
          const dynamicLeadCount = Math.min(47 + Math.floor(minutesRunning * 2.3), 110); // Max 110 Leads

          const demoJobs: ScrapeJob[] = [
            {
              id: '1',
              job_name: 'Entscheidungsträger_Dortmund_alle_Branchen_110MA_leads_2025',
              started_at: new Date(Date.now() - 300000).toISOString(), // 5 Minuten ago
              completed_at: null,
              status: 'running',
              lead_count: dynamicLeadCount,
              source_url: 'https://app.apollo.io/searches/...',
              created_at: new Date(Date.now() - 300000).toISOString()
            },
            {
              id: '2',
              job_name: 'Marketing_München_Software_50MA_leads_2025',
              started_at: new Date(Date.now() - 3600000).toISOString(), // 1 Stunde ago
              completed_at: new Date(Date.now() - 300000).toISOString(),
              status: 'completed',
              lead_count: 150,
              source_url: 'https://app.apollo.io/searches/...',
              created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: '3',
              job_name: 'Vertrieb_Berlin_Healthcare_200MA_leads_2025',
              started_at: new Date(Date.now() - 86400000).toISOString(), // 1 Tag ago
              completed_at: new Date(Date.now() - 82800000).toISOString(),
              status: 'completed',
              lead_count: 89,
              source_url: 'https://app.apollo.io/searches/...',
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

  // Auto-refresh für laufende Jobs
  useEffect(() => {
    const hasRunningJobs = jobs.some(job => 
      job.status === 'running' || job.status === 'in_progress'
    );

    if (hasRunningJobs) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing scrape jobs...');
        fetchScrapeJobs();
      }, 10000); // Alle 10 Sekunden aktualisieren

      return () => clearInterval(interval);
    }
  }, [jobs]);

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