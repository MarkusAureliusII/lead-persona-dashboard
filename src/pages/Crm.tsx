import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
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
  Filter,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
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

// Lead Detail Dialog Komponente
function LeadDetailDialog({ 
  lead, 
  isOpen, 
  onOpenChange 
}: { 
  lead: Lead | null; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  if (!lead) return null;

  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unbekannter Name';
  const location = [lead.city, lead.state, lead.country].filter(Boolean).join(', ');

  // Anreicherungs-Daten auswerten
  const enrichmentData = lead.enriched_data || {};
  const hasWebsiteSummary = enrichmentData.website_summary;
  const hasLinkedInAnalysis = enrichmentData.linkedin_analysis;
  const hasEmailVerification = lead.is_email_valid !== null;
  const hasCompanyInfo = enrichmentData.company_info;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lead Details: {fullName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Grunddaten */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persönliche Daten */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Persönliche Daten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{fullName}</p>
                  </div>
                  
                  {lead.email && (
                    <div>
                      <p className="text-sm text-gray-600">E-Mail</p>
                      <div className="flex items-center gap-2">
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
                    </div>
                  )}
                  
                  {lead.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{lead.phone}</span>
                      </div>
                    </div>
                  )}
                  
                  {location && (
                    <div>
                      <p className="text-sm text-gray-600">Standort</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{location}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Firmendaten */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Firmendaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lead.company_name && (
                    <div>
                      <p className="text-sm text-gray-600">Unternehmen</p>
                      <p className="font-medium">{lead.company_name}</p>
                    </div>
                  )}
                  
                  {lead.title && (
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="font-medium">{lead.title}</p>
                    </div>
                  )}
                  
                  {lead.website && (
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <a 
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline font-medium"
                        >
                          {lead.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={lead.status === 'qualified' ? 'default' : 'secondary'}>
                      {lead.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Anreicherungs-Daten */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Anreicherungs-Daten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Anreicherungs-Status Icons */}
                  <div className={`flex items-center gap-2 p-2 rounded ${hasEmailVerification ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <MailCheck className={`w-5 h-5 ${hasEmailVerification ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm">E-Mail Validierung</span>
                    {hasEmailVerification && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  <div className={`flex items-center gap-2 p-2 rounded ${hasWebsiteSummary ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <Globe className={`w-5 h-5 ${hasWebsiteSummary ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Website Analyse</span>
                    {hasWebsiteSummary && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  <div className={`flex items-center gap-2 p-2 rounded ${hasLinkedInAnalysis ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <Linkedin className={`w-5 h-5 ${hasLinkedInAnalysis ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm">LinkedIn Analyse</span>
                    {hasLinkedInAnalysis && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  <div className={`flex items-center gap-2 p-2 rounded ${hasCompanyInfo ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <Building className={`w-5 h-5 ${hasCompanyInfo ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Firmen-Info</span>
                    {hasCompanyInfo && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                </div>

                {/* Detaillierte Anreicherungs-Daten */}
                <div className="space-y-4">
                  {hasWebsiteSummary && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Website-Zusammenfassung</h4>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{enrichmentData.website_summary}</p>
                      </div>
                    </div>
                  )}
                  
                  {hasLinkedInAnalysis && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">LinkedIn-Analyse</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{enrichmentData.linkedin_analysis}</p>
                      </div>
                    </div>
                  )}
                  
                  {hasCompanyInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Firmen-Informationen</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{JSON.stringify(enrichmentData.company_info, null, 2)}</p>
                      </div>
                    </div>
                  )}
                  
                  {!hasWebsiteSummary && !hasLinkedInAnalysis && !hasCompanyInfo && (
                    <div className="text-center py-4 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Keine Anreicherungs-Daten verfügbar</p>
                      <p className="text-sm">Daten können durch Personalisierungs-Services hinzugefügt werden.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notizen */}
            {lead.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notizen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{lead.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadaten */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadaten</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Erstellt am</p>
                  <p className="font-medium">{new Date(lead.created_at).toLocaleString('de-DE')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Letzte Aktualisierung</p>
                  <p className="font-medium">{new Date(lead.updated_at).toLocaleString('de-DE')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Hauptkomponente
const Crm = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filter-States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [emailFilter, setEmailFilter] = useState<string>('all');
  
  const { toast } = useToast();

  // Leads laden (nur qualifizierte Leads - status != 'new')
  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('📊 Fetching qualified leads from database...');
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .neq('status', 'new')  // Nur Leads, die nicht 'new' sind
        .order('updated_at', { ascending: false });

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
        console.log('⚠️ No qualified leads found');
        setLeads([]);
        setFilteredLeads([]);
        return;
      }

      console.log(`✅ ${data.length} qualified leads loaded successfully`);
      setLeads(data);
      setFilteredLeads(data);
      
      toast({
        title: "CRM-Daten geladen",
        description: `${data.length} qualifizierte Leads erfolgreich geladen.`
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

    // Status-Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // E-Mail-Filter
    if (emailFilter === 'valid') {
      filtered = filtered.filter(lead => lead.is_email_valid === true);
    } else if (emailFilter === 'invalid') {
      filtered = filtered.filter(lead => lead.is_email_valid === false);
    } else if (emailFilter === 'unknown') {
      filtered = filtered.filter(lead => lead.is_email_valid === null);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, emailFilter]);

  // Lead-Details anzeigen
  const showLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  // Filter zurücksetzen
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setEmailFilter('all');
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Statistiken berechnen
  const stats = {
    total: leads.length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    validEmails: leads.filter(lead => lead.is_email_valid === true).length,
    enriched: leads.filter(lead => lead.enriched_data && Object.keys(lead.enriched_data).length > 0).length
  };

  // Anreicherungs-Icons für Tabelle
  const getEnrichmentIcons = (lead: Lead) => {
    const icons = [];
    const enrichmentData = lead.enriched_data || {};
    
    if (lead.is_email_valid) {
      icons.push(<MailCheck key="email" className="w-4 h-4 text-green-600" />);
    }
    if (enrichmentData.website_summary) {
      icons.push(<Globe key="website" className="w-4 h-4 text-purple-600" />);
    }
    if (enrichmentData.linkedin_analysis) {
      icons.push(<Linkedin key="linkedin" className="w-4 h-4 text-blue-600" />);
    }
    if (enrichmentData.company_info) {
      icons.push(<Building key="company" className="w-4 h-4 text-blue-600" />);
    }
    
    return icons;
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
                  Zentrale Ansicht für alle qualifizierten und angereicherten Leads.
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
                    <CardTitle className="text-sm font-medium">Qualifiziert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.qualified}</div>
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

              {/* Filter und Suche */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter & Suche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Suchfeld */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Name, E-Mail, Firma suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="qualified">Qualifiziert</SelectItem>
                        <SelectItem value="contacted">Kontaktiert</SelectItem>
                        <SelectItem value="converted">Konvertiert</SelectItem>
                        <SelectItem value="rejected">Abgelehnt</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* E-Mail Filter */}
                    <Select value={emailFilter} onValueChange={setEmailFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="E-Mail Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle E-Mails</SelectItem>
                        <SelectItem value="valid">Nur gültige</SelectItem>
                        <SelectItem value="invalid">Nur ungültige</SelectItem>
                        <SelectItem value="unknown">Ungeprüft</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Filter Reset */}
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      <X className="w-4 h-4 mr-2" />
                      Filter zurücksetzen
                    </Button>
                  </div>
                  
                  {/* Aktive Filter anzeigen */}
                  {(searchTerm || statusFilter !== 'all' || emailFilter !== 'all') && (
                    <div className="mt-3 text-sm text-gray-600">
                      {filteredLeads.length} von {leads.length} Leads angezeigt
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leads Tabelle */}
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
                      Keine qualifizierten Leads gefunden
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {errorMessage ? 'Fehler beim Laden der Daten.' : 'Es wurden noch keine Leads qualifiziert oder angereichert.'}
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        CRM-Leads ({filteredLeads.length})
                      </CardTitle>
                      <Button onClick={fetchLeads} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Aktualisieren
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Unternehmen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Anreicherungen</TableHead>
                            <TableHead>Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLeads.map((lead) => {
                            const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unbekannt';
                            const enrichmentIcons = getEnrichmentIcons(lead);
                            
                            return (
                              <TableRow 
                                key={lead.id} 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => showLeadDetails(lead)}
                              >
                                <TableCell className="font-medium">{fullName}</TableCell>
                                <TableCell>
                                  {lead.email ? (
                                    <div className="flex items-center gap-2">
                                      <span className={lead.is_email_valid ? 'text-green-600' : 'text-gray-900'}>
                                        {lead.email}
                                      </span>
                                      {lead.is_email_valid && (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Keine E-Mail</span>
                                  )}
                                </TableCell>
                                <TableCell>{lead.title || '-'}</TableCell>
                                <TableCell>{lead.company_name || '-'}</TableCell>
                                <TableCell>
                                  <Badge variant={lead.status === 'qualified' ? 'default' : 'secondary'}>
                                    {lead.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {enrichmentIcons.length > 0 ? enrichmentIcons : (
                                      <span className="text-gray-400 text-sm">Keine</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <LeadDetailDialog
        lead={selectedLead}
        isOpen={showDetails}
        onOpenChange={setShowDetails}
      />
    </SidebarProvider>
  );
};

export default Crm;