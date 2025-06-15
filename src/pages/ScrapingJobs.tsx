import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  FolderOpen, 
  Calendar,
  Users,
  Download,
  ExternalLink,
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

// Types für Leads
type Lead = {
  id: string;
  scrape_job_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  title: string | null;
  website: string | null;
  city: string | null;
  country: string | null;
  status: string;
  raw_scraped_data: any;
  created_at: string;
};

// Job Details Dialog Komponente
function JobDetailsDialog({ 
  job, 
  isOpen, 
  onOpenChange 
}: { 
  job: ScrapeJob; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Leads für den Job laden
  const fetchJobLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('scrape_job_id', job.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fehler beim Laden der Leads:', error);
        toast({
          title: "Fehler",
          description: "Leads konnten nicht geladen werden.",
          variant: "destructive"
        });
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Unerwarteter Fehler:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // CSV Export Funktion
  const exportToCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "Keine Daten",
        description: "Es sind keine Leads zum Exportieren vorhanden.",
        variant: "destructive"
      });
      return;
    }

    // CSV Header
    const headers = [
      'Name',
      'E-Mail',
      'Telefon',
      'Unternehmen',
      'Position',
      'Website',
      'Stadt',
      'Land',
      'Status',
      'Erstellt am'
    ];

    // CSV Daten
    const csvData = leads.map(lead => [
      `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unbekannt',
      lead.email || '',
      lead.phone || '',
      lead.company_name || '',
      lead.title || '',
      lead.website || '',
      lead.city || '',
      lead.country || '',
      lead.status || '',
      new Date(lead.created_at).toLocaleDateString('de-DE')
    ]);

    // CSV zusammenbauen
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scrape-job-${job.job_name}-leads.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export erfolgreich",
      description: `${leads.length} Leads wurden als CSV exportiert.`,
    });
  };

  // Leads laden wenn Dialog geöffnet wird
  useEffect(() => {
    if (isOpen) {
      fetchJobLeads();
    }
  }, [isOpen, job.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Job Details: {job.job_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Gestartet</p>
              <p className="font-medium">{new Date(job.started_at).toLocaleString('de-DE')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Leads</p>
              <p className="font-medium">{job.lead_count}</p>
            </div>
            <div>
              <Button onClick={exportToCSV} size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Als CSV exportieren
              </Button>
            </div>
          </div>

          {/* Leads Tabelle */}
          <div>
            <h4 className="font-semibold mb-3">Leads ({leads.length})</h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Lade Leads...</span>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Keine Leads für diesen Job gefunden.</p>
              </div>
            ) : (
              <ScrollArea className="h-96 w-full border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Unternehmen</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Ort</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {`${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unbekannt'}
                        </TableCell>
                        <TableCell>
                          {lead.email ? (
                            <span className="text-blue-600">{lead.email}</span>
                          ) : (
                            <span className="text-gray-400">Keine E-Mail</span>
                          )}
                        </TableCell>
                        <TableCell>{lead.company_name || '-'}</TableCell>
                        <TableCell>{lead.title || '-'}</TableCell>
                        <TableCell>
                          {[lead.city, lead.country].filter(Boolean).join(', ') || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Job Card Komponente
function JobCard({ job }: { job: ScrapeJob }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                {job.job_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {new Date(job.started_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
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
                <a 
                  href={job.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {job.source_url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={() => setShowDetails(true)}
              className="w-full"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Details anzeigen & Exportieren
            </Button>
          </div>
        </CardContent>
      </Card>

      <JobDetailsDialog
        job={job}
        isOpen={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
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
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-800">Fehler beim Laden der Daten</h3>
                        <p className="text-sm text-red-700">{errorMessage}</p>
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
                      {errorMessage ? 'Fehler beim Laden der Daten.' : 'Es wurden noch keine Scraping-Vorgänge gestartet.'}
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