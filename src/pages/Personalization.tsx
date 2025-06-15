import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  FolderClosed,
  Phone,
  MapPin,
  ExternalLink,
  Linkedin,
  Play,
  Trash2,
  Filter,
  X
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

// Personalisierungs-Optionen
type PersonalizationOptions = {
  emailValidation: boolean;
  privateLinkedInAnalysis: boolean;
  companyLinkedInAnalysis: boolean;
  websiteAnalysis: boolean;
};

// Filter-Optionen
type FilterOptions = {
  excludeWithoutEmail: boolean;
  excludeWithoutPhone: boolean;
};

// Gruppierte Leads nach Scrape-Job
type LeadGroup = {
  scrape_job_id: string | null;
  scrape_job_name: string;
  date: string;
  leads: SimpleLead[];
  filteredLeads: SimpleLead[];
  totalLeads: number;
  withEmail: number;
  personalizationOptions: PersonalizationOptions;
  filterOptions: FilterOptions;
  deletedLeadIds: Set<string>;
};

// UI-Komponente für einen einzelnen Lead
function LeadCard({ 
  lead, 
  onDelete 
}: { 
  lead: SimpleLead;
  onDelete: (leadId: string) => void;
}) {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
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

  const getPhone = () => {
    return lead.phone || lead.raw_scraped_data?.phone || lead.raw_scraped_data?.phoneNumber || null;
  };

  const getCompany = () => {
    return lead.company_name || lead.raw_scraped_data?.company || lead.raw_scraped_data?.companyName || null;
  };

  const getTitle = () => {
    return lead.title || lead.raw_scraped_data?.title || lead.raw_scraped_data?.jobTitle || null;
  };

  const getWebsite = () => {
    const website = lead.raw_scraped_data?.website || lead.raw_scraped_data?.companyWebsite || lead.raw_scraped_data?.url;
    if (website && !website.startsWith('http')) {
      return `https://${website}`;
    }
    return website;
  };

  const getLocation = () => {
    const city = lead.city || lead.raw_scraped_data?.city || lead.raw_scraped_data?.location;
    const country = lead.country || lead.raw_scraped_data?.country;
    const state = lead.state || lead.raw_scraped_data?.state;
    
    return [city, state, country].filter(Boolean).join(', ') || null;
  };

  const getLinkedInUrl = () => {
    return lead.person_linkedin_url || lead.raw_scraped_data?.linkedinUrl || lead.raw_scraped_data?.linkedin;
  };

  const getCompanyLinkedInUrl = () => {
    return lead.company_linkedin_url || lead.raw_scraped_data?.companyLinkedinUrl;
  };

  const handleDelete = () => {
    if (window.confirm(`Möchtest du ${getFullName()} wirklich löschen?`)) {
      onDelete(lead.id);
      toast({
        title: "Lead gelöscht",
        description: `${getFullName()} wurde erfolgreich gelöscht.`
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow mb-3 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 size={14} />
      </Button>
      
      <CardContent className="p-4 pr-12">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-base text-gray-900">{getFullName()}</h4>
            {getTitle() && (
              <p className="text-sm text-muted-foreground font-medium">{getTitle()}</p>
            )}
          </div>
        </div>

        {/* Kontaktinformationen */}
        <div className="space-y-2 mb-3">
          {/* E-Mail */}
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
          
          {/* Telefon */}
          {getPhone() ? (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-blue-600" />
              <span className="text-blue-700">{getPhone()}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} />
              <span>Keine Telefonnummer verfügbar</span>
            </div>
          )}

          {/* LinkedIn Profil */}
          {getLinkedInUrl() && (
            <div className="flex items-center gap-2 text-sm">
              <Linkedin size={14} className="text-blue-600" />
              <a 
                href={getLinkedInUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                LinkedIn Profil <ExternalLink size={10} />
              </a>
            </div>
          )}

          {/* Website Link */}
          {getWebsite() && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-purple-600" />
              <a 
                href={getWebsite()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline flex items-center gap-1"
              >
                Website besuchen <ExternalLink size={10} />
              </a>
            </div>
          )}
        </div>

        {/* Firmendaten - aufklappbar */}
        {(getCompany() || getLocation() || getCompanyLinkedInUrl()) && (
          <div className="border-t pt-3">
            <Collapsible open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-gray-600" />
                    <span className="text-sm font-medium">Firmendaten</span>
                    {getCompany() && (
                      <span className="text-sm text-muted-foreground">({getCompany()})</span>
                    )}
                  </div>
                  {showCompanyDetails ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="space-y-2 mt-2 pl-2">
                  {getCompany() && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={12} className="text-gray-500" />
                      <span><strong>Firma:</strong> {getCompany()}</span>
                    </div>
                  )}
                  
                  {getLocation() && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={12} className="text-gray-500" />
                      <span><strong>Standort:</strong> {getLocation()}</span>
                    </div>
                  )}
                  
                  {getCompanyLinkedInUrl() && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin size={12} className="text-blue-600" />
                      <a 
                        href={getCompanyLinkedInUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Unternehmens-LinkedIn <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// UI-Komponente für Personalisierungs-Optionen
function PersonalizationOptionsCard({ 
  options, 
  filterOptions,
  onOptionsChange,
  onFilterChange,
  onStartPersonalization,
  totalLeads,
  filteredCount
}: { 
  options: PersonalizationOptions;
  filterOptions: FilterOptions;
  onOptionsChange: (newOptions: PersonalizationOptions) => void;
  onFilterChange: (newFilters: FilterOptions) => void;
  onStartPersonalization: () => void;
  totalLeads: number;
  filteredCount: number;
}) {
  const { toast } = useToast();

  const hasSelectedOptions = Object.values(options).some(Boolean);

  const handleOptionChange = (key: keyof PersonalizationOptions, checked: boolean) => {
    onOptionsChange({
      ...options,
      [key]: checked
    });
  };

  const handleFilterChange = (key: keyof FilterOptions, checked: boolean) => {
    onFilterChange({
      ...filterOptions,
      [key]: checked
    });
  };

  const handleStart = () => {
    if (!hasSelectedOptions) {
      toast({
        title: "Keine Optionen ausgewählt",
        description: "Bitte wähle mindestens eine Personalisierungs-Option aus.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Personalisierung gestartet",
      description: `Verarbeite ${filteredCount} Leads mit den ausgewählten Optionen.`
    });
    
    onStartPersonalization();
  };

  return (
    <div className="space-y-4">
      {/* Personalisierungs-Optionen */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Personalisierungs-Optionen
          </CardTitle>
          <CardDescription className="text-blue-700">
            Wähle die gewünschten Anreicherungs-Services für alle Leads aus diesem Scrape-Job.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailValidation"
                checked={options.emailValidation}
                onCheckedChange={(checked) => handleOptionChange('emailValidation', checked as boolean)}
              />
              <label 
                htmlFor="emailValidation" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <MailCheck className="w-4 h-4 text-green-600" />
                E-Mail Validierung
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="privateLinkedIn"
                checked={options.privateLinkedInAnalysis}
                onCheckedChange={(checked) => handleOptionChange('privateLinkedInAnalysis', checked as boolean)}
              />
              <label 
                htmlFor="privateLinkedIn" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                Private LinkedIn Analyse
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="companyLinkedIn"
                checked={options.companyLinkedInAnalysis}
                onCheckedChange={(checked) => handleOptionChange('companyLinkedInAnalysis', checked as boolean)}
              />
              <label 
                htmlFor="companyLinkedIn" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Building className="w-4 h-4 text-blue-600" />
                Unternehmens-LinkedIn Analyse
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="websiteAnalysis"
                checked={options.websiteAnalysis}
                onCheckedChange={(checked) => handleOptionChange('websiteAnalysis', checked as boolean)}
              />
              <label 
                htmlFor="websiteAnalysis" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-purple-600" />
                Website Analyse
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter-Optionen */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lead-Filter
          </CardTitle>
          <CardDescription className="text-orange-700">
            Schließe Leads ohne bestimmte Kontaktdaten von der Personalisierung aus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeWithoutEmail"
                checked={filterOptions.excludeWithoutEmail}
                onCheckedChange={(checked) => handleFilterChange('excludeWithoutEmail', checked as boolean)}
              />
              <label 
                htmlFor="excludeWithoutEmail" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <X className="w-4 h-4 text-red-600" />
                Leads ohne E-Mail ausschließen
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeWithoutPhone"
                checked={filterOptions.excludeWithoutPhone}
                onCheckedChange={(checked) => handleFilterChange('excludeWithoutPhone', checked as boolean)}
              />
              <label 
                htmlFor="excludeWithoutPhone" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <X className="w-4 h-4 text-red-600" />
                Leads ohne Telefon ausschließen
              </label>
            </div>
          </div>

          {(filterOptions.excludeWithoutEmail || filterOptions.excludeWithoutPhone) && (
            <div className="bg-white p-3 rounded border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Gefiltert:</strong> {filteredCount} von {totalLeads} Leads werden verarbeitet
                {totalLeads - filteredCount > 0 && (
                  <span className="text-orange-600"> ({totalLeads - filteredCount} ausgeschlossen)</span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleStart}
          disabled={!hasSelectedOptions || filteredCount === 0}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
        >
          <Play className="w-5 h-5 mr-2" />
          Personalisierung starten ({filteredCount} Leads)
        </Button>
      </div>
    </div>
  );
}

// UI-Komponente für eine Gruppe von Leads
function LeadGroupCard({ 
  group, 
  isExpanded, 
  onToggle,
  onUpdateGroup
}: { 
  group: LeadGroup; 
  isExpanded: boolean; 
  onToggle: () => void; 
  onUpdateGroup: (updatedGroup: LeadGroup) => void;
}) {
  const handlePersonalizationOptionsChange = (newOptions: PersonalizationOptions) => {
    onUpdateGroup({
      ...group,
      personalizationOptions: newOptions
    });
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    const filteredLeads = group.leads.filter(lead => {
      if (group.deletedLeadIds.has(lead.id)) return false;
      
      if (newFilters.excludeWithoutEmail) {
        const hasEmail = lead.email || lead.raw_scraped_data?.email;
        if (!hasEmail) return false;
      }
      
      if (newFilters.excludeWithoutPhone) {
        const hasPhone = lead.phone || lead.raw_scraped_data?.phone || lead.raw_scraped_data?.phoneNumber;
        if (!hasPhone) return false;
      }
      
      return true;
    });

    onUpdateGroup({
      ...group,
      filterOptions: newFilters,
      filteredLeads
    });
  };

  const handleStartPersonalization = () => {
    console.log('Starting personalization for group:', group.scrape_job_id);
    console.log('Options:', group.personalizationOptions);
    console.log('Leads to process:', group.filteredLeads.length);
  };

  const handleDeleteLead = (leadId: string) => {
    const newDeletedIds = new Set(group.deletedLeadIds);
    newDeletedIds.add(leadId);
    
    const filteredLeads = group.leads.filter(lead => {
      if (newDeletedIds.has(lead.id)) return false;
      
      if (group.filterOptions.excludeWithoutEmail) {
        const hasEmail = lead.email || lead.raw_scraped_data?.email;
        if (!hasEmail) return false;
      }
      
      if (group.filterOptions.excludeWithoutPhone) {
        const hasPhone = lead.phone || lead.raw_scraped_data?.phone || lead.raw_scraped_data?.phoneNumber;
        if (!hasPhone) return false;
      }
      
      return true;
    });

    onUpdateGroup({
      ...group,
      deletedLeadIds: newDeletedIds,
      filteredLeads
    });
  };

  const visibleLeads = group.leads.filter(lead => !group.deletedLeadIds.has(lead.id));

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
                  <div className="text-2xl font-bold text-gray-900">{visibleLeads.length}</div>
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
            <div className="border-t pt-4 space-y-6">
              {/* Personalisierungs-Optionen */}
              <PersonalizationOptionsCard
                options={group.personalizationOptions}
                filterOptions={group.filterOptions}
                onOptionsChange={handlePersonalizationOptionsChange}
                onFilterChange={handleFilterChange}
                onStartPersonalization={handleStartPersonalization}
                totalLeads={visibleLeads.length}
                filteredCount={group.filteredLeads.length}
              />
              
              {/* Lead-Liste */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  {group.filteredLeads.length} Leads aus diesem Scrape-Job:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.filteredLeads.map(lead => (
                    <LeadCard 
                      key={lead.id} 
                      lead={lead}
                      onDelete={handleDeleteLead}
                    />
                  ))}
                </div>
                
                {group.filteredLeads.length === 0 && visibleLeads.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Alle Leads wurden durch die Filter ausgeschlossen.</p>
                    <p className="text-sm">Ändere die Filter-Einstellungen, um Leads anzuzeigen.</p>
                  </div>
                )}
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

  const updateGroup = (updatedGroup: LeadGroup) => {
    setLeadGroups(prev => 
      prev.map(group => 
        group.scrape_job_id === updatedGroup.scrape_job_id ? updatedGroup : group
      )
    );
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
      
      // Alle Leads laden
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
        .limit(200);

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
          let jobName = 'Unbekannter Scrape-Job';
          if (jobInfo?.job_name) {
            jobName = jobInfo.job_name;
          } else if (firstLead.source_id) {
            jobName = `Scrape-Job ${firstLead.source_id}`;
          } else {
            // Datum als Fallback
            const date = new Date(firstLead.created_at);
            jobName = `Scrape-Job vom ${date.toLocaleDateString('de-DE')}`;
          }

          // Datum für Sortierung
          const date = jobInfo?.started_at || firstLead.created_at;
          const sortedLeads = leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
            leads: sortedLeads,
            filteredLeads: sortedLeads, // Initial: alle Leads
            totalLeads: leads.length,
            withEmail: leads.filter(l => l.email || l.raw_scraped_data?.email).length,
            personalizationOptions: {
              emailValidation: false,
              privateLinkedInAnalysis: false,
              companyLinkedInAnalysis: false,
              websiteAnalysis: false
            },
            filterOptions: {
              excludeWithoutEmail: false,
              excludeWithoutPhone: false
            },
            deletedLeadIds: new Set()
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
        description: `${data.length} Leads in ${groups.length} Scrape-Jobs geladen.`
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
    totalLeads: leadGroups.reduce((sum, group) => sum + group.leads.filter(l => !group.deletedLeadIds.has(l.id)).length, 0),
    totalWithEmail: leadGroups.reduce((sum, group) => {
      const visibleLeads = group.leads.filter(l => !group.deletedLeadIds.has(l.id));
      return sum + visibleLeads.filter(l => l.email || l.raw_scraped_data?.email).length;
    }, 0),
    totalGroups: leadGroups.length,
    readyForPersonalization: leadGroups.reduce((sum, group) => sum + group.filteredLeads.length, 0)
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
                  Leads nach Scrape-Jobs organisiert. Wähle Personalisierungs-Optionen und verwalte deine Lead-Datenbank.
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scrape-Jobs</CardTitle>
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
                    <CardTitle className="text-sm font-medium">Zur Personalisierung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{totalStats.readyForPersonalization}</div>
                    <p className="text-xs text-muted-foreground">gefiltert</p>
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
                      Scrape-Jobs ({leadGroups.length})
                    </h2>
                  </div>
                  
                  {leadGroups.map((group) => (
                    <LeadGroupCard
                      key={group.scrape_job_id || 'unknown'}
                      group={group}
                      isExpanded={expandedGroups.has(group.scrape_job_id || 'unknown')}
                      onToggle={() => toggleGroup(group.scrape_job_id || 'unknown')}
                      onUpdateGroup={updateGroup}
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
