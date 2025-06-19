import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from '@/lib/supabase';
import { useWebhookStorageLocal } from '@/hooks/useWebhookStorageLocal';
import { usePersistedForm } from '@/hooks/usePersistedState';

import { Loader2, Users, MailCheck, Globe, Building, Wand2, RefreshCw, ChevronDown, ChevronRight, Calendar, FolderOpen, FolderClosed, Phone, MapPin, ExternalLink, Linkedin, Play, Trash2, Filter, X, Link, Clock, Hourglass, Zap, CheckCircle2 } from "lucide-react";
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

// Moderne Lead-Card mit Anreicherungs-Services
function LeadCard({
  lead,
  onDelete,
  onEnrichmentAction
}: {
  lead: SimpleLead;
  onDelete: (leadId: string) => void;
  onEnrichmentAction: (leadId: string, service: string) => void;
}) {
  const { toast } = useToast();
  const [processingServices, setProcessingServices] = useState<Set<string>>(new Set());

  // Kerninformationen extrahieren
  const getFullName = () => {
    const firstName = lead.first_name || lead.raw_scraped_data?.firstName || '';
    const lastName = lead.last_name || lead.raw_scraped_data?.lastName || '';
    
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (lead.raw_scraped_data?.name) return lead.raw_scraped_data.name;
    return 'Unbekannter Name';
  };

  const getTitle = () => {
    return lead.title || lead.raw_scraped_data?.title || lead.raw_scraped_data?.jobTitle || 'Position unbekannt';
  };

  const getCompany = () => {
    return lead.company_name || lead.raw_scraped_data?.company || lead.raw_scraped_data?.companyName || 'Firma unbekannt';
  };

  const getEmail = () => {
    return lead.email || lead.raw_scraped_data?.email || null;
  };

  const getLinkedInUrl = () => {
    return lead.person_linkedin_url || lead.raw_scraped_data?.linkedinUrl || lead.raw_scraped_data?.linkedin;
  };

  const getWebsite = () => {
    const website = lead.website || lead.raw_scraped_data?.website || lead.raw_scraped_data?.companyWebsite;
    if (website && !website.startsWith('http')) {
      return `https://${website}`;
    }
    return website;
  };

  // Anreicherungs-Service ausführen
  const handleEnrichment = async (service: string) => {
    setProcessingServices(prev => new Set([...prev, service]));
    
    try {
      await onEnrichmentAction(lead.id, service);
      toast({
        title: `${service} gestartet`,
        description: `Anreicherung für ${getFullName()} wurde gestartet.`,
      });
    } catch (error) {
      toast({
        title: "Fehler bei Anreicherung",
        description: `${service} konnte nicht gestartet werden.`,
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setProcessingServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(service);
          return newSet;
        });
      }, 2000);
    }
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

  // Service-Status prüfen
  const isEmailVerified = lead.is_email_verified || lead.email_verification_status === 'valid';
  const hasLinkedInAnalysis = lead.is_personal_linkedin_analyzed;
  const hasWebsiteAnalysis = lead.is_website_analyzed;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 relative group">
      {/* Delete Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete} 
        className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-opacity"
      >
        <Trash2 size={14} />
      </Button>
      
      <CardContent className="p-6">
        {/* Hauptinformationen */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{getFullName()}</h3>
          <p className="text-blue-600 font-medium text-sm mb-1">{getTitle()}</p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <Building size={14} />
            {getCompany()}
          </p>
        </div>

        {/* Kontakt-Status */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <MailCheck size={14} className={getEmail() ? 'text-green-600' : 'text-gray-400'} />
            <span className={getEmail() ? 'text-green-700' : 'text-gray-500'}>
              {getEmail() ? 'E-Mail verfügbar' : 'Keine E-Mail'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Linkedin size={14} className={getLinkedInUrl() ? 'text-blue-600' : 'text-gray-400'} />
            <span className={getLinkedInUrl() ? 'text-blue-700' : 'text-gray-500'}>
              {getLinkedInUrl() ? 'LinkedIn verfügbar' : 'Kein LinkedIn'}
            </span>
          </div>
        </div>

        {/* Anreicherungs-Services */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Anreicherungs-Services:</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {/* E-Mail Validierung */}
            <Button
              variant={isEmailVerified ? "default" : "outline"}
              size="sm"
              onClick={() => handleEnrichment('E-Mail Validierung')}
              disabled={processingServices.has('E-Mail Validierung') || !getEmail()}
              className="h-8 text-xs"
            >
              {processingServices.has('E-Mail Validierung') ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : isEmailVerified ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <MailCheck className="w-3 h-3 mr-1" />
              )}
              E-Mail Validierung
            </Button>

            {/* LinkedIn Analyse */}
            <Button
              variant={hasLinkedInAnalysis ? "default" : "outline"}
              size="sm"
              onClick={() => handleEnrichment('LinkedIn Analyse')}
              disabled={processingServices.has('LinkedIn Analyse') || !getLinkedInUrl()}
              className="h-8 text-xs"
            >
              {processingServices.has('LinkedIn Analyse') ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : hasLinkedInAnalysis ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <Linkedin className="w-3 h-3 mr-1" />
              )}
              LinkedIn Analyse
            </Button>

            {/* Website Analyse */}
            <Button
              variant={hasWebsiteAnalysis ? "default" : "outline"}
              size="sm"
              onClick={() => handleEnrichment('Website Analyse')}
              disabled={processingServices.has('Website Analyse') || !getWebsite()}
              className="h-8 text-xs"
            >
              {processingServices.has('Website Analyse') ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : hasWebsiteAnalysis ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <Globe className="w-3 h-3 mr-1" />
              )}
              Website Analyse
            </Button>

            {/* Alle Services */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEnrichment('Alle Services')}
              disabled={processingServices.size > 0}
              className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {processingServices.size > 0 ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Zap className="w-3 h-3 mr-1" />
              )}
              Alle Services
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// "Warten auf Leads" Komponente mit Animation
function WaitingForLeadsState() {
  return (
    <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Animiertes Icon */}
        <div className="relative mb-6">
          <Hourglass className="w-16 h-16 text-yellow-600 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Nachricht */}
        <h3 className="text-xl font-semibold text-yellow-800 mb-3">
          Warten auf neue Leads...
        </h3>
        
        <p className="text-yellow-700 mb-6 max-w-md leading-relaxed">
          Derzeit warten wir auf neue Leads. Starte einen neuen Vorgang auf der 
          <strong> 'Lead Scraping'</strong>-Seite. Diese Ansicht aktualisiert sich 
          automatisch, sobald die Ergebnisse eintreffen.
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
            <a href="/lead-agent">
              <Play className="w-4 h-4 mr-2" />
              Neuen Scrape starten
            </a>
          </Button>
          
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>
        
        {/* Auto-Refresh Indikator */}
        <div className="flex items-center gap-2 mt-4 text-sm text-yellow-600">
          <Clock className="w-4 h-4" />
          <span>Automatische Aktualisierung alle 30 Sekunden</span>
        </div>
      </CardContent>
    </Card>
  );
}

// UI-Komponente für Personalisierungs-Optionen
function PersonalizationOptionsCard({
  options,
  filterOptions,
  webhookUrl,
  onOptionsChange,
  onFilterChange,
  onWebhookUrlChange,
  onStartPersonalization,
  totalLeads,
  filteredCount
}: {
  options: PersonalizationOptions;
  filterOptions: FilterOptions;
  webhookUrl: string;
  onOptionsChange: (newOptions: PersonalizationOptions) => void;
  onFilterChange: (newFilters: FilterOptions) => void;
  onWebhookUrlChange: (url: string) => void;
  onStartPersonalization: () => void;
  totalLeads: number;
  filteredCount: number;
}) {
  const {
    toast
  } = useToast();
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
    if (!webhookUrl) {
      toast({
        title: "Webhook URL fehlt",
        description: "Bitte gib eine Webhook URL ein.",
        variant: "destructive"
      });
      return;
    }
    onStartPersonalization();
  };
  return <div className="space-y-4">
      {/* Webhook URL Eingabe */}
      

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
              <Checkbox id="emailValidation" checked={options.emailValidation} onCheckedChange={checked => handleOptionChange('emailValidation', checked as boolean)} />
              <label htmlFor="emailValidation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <MailCheck className="w-4 h-4 text-green-600" />
                E-Mail Validierung
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="privateLinkedIn" checked={options.privateLinkedInAnalysis} onCheckedChange={checked => handleOptionChange('privateLinkedInAnalysis', checked as boolean)} />
              <label htmlFor="privateLinkedIn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-600" />
                Private LinkedIn Analyse
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="companyLinkedIn" checked={options.companyLinkedInAnalysis} onCheckedChange={checked => handleOptionChange('companyLinkedInAnalysis', checked as boolean)} />
              <label htmlFor="companyLinkedIn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Unternehmens-LinkedIn Analyse
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="websiteAnalysis" checked={options.websiteAnalysis} onCheckedChange={checked => handleOptionChange('websiteAnalysis', checked as boolean)} />
              <label htmlFor="websiteAnalysis" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
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
              <Checkbox id="excludeWithoutEmail" checked={filterOptions.excludeWithoutEmail} onCheckedChange={checked => handleFilterChange('excludeWithoutEmail', checked as boolean)} />
              <label htmlFor="excludeWithoutEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                Leads ohne E-Mail ausschließen
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="excludeWithoutPhone" checked={filterOptions.excludeWithoutPhone} onCheckedChange={checked => handleFilterChange('excludeWithoutPhone', checked as boolean)} />
              <label htmlFor="excludeWithoutPhone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                Leads ohne Telefon ausschließen
              </label>
            </div>
          </div>

          {(filterOptions.excludeWithoutEmail || filterOptions.excludeWithoutPhone) && <div className="bg-white p-3 rounded border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Gefiltert:</strong> {filteredCount} von {totalLeads} Leads werden verarbeitet
                {totalLeads - filteredCount > 0 && <span className="text-orange-600"> ({totalLeads - filteredCount} ausgeschlossen)</span>}
              </p>
            </div>}
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button onClick={handleStart} disabled={!hasSelectedOptions || filteredCount === 0 || !webhookUrl} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
          <Play className="w-5 h-5 mr-2" />
          Personalisierung starten ({filteredCount} Leads)
        </Button>
      </div>
    </div>;
}

// UI-Komponente für eine Gruppe von Leads
function LeadGroupCard({
  group,
  isExpanded,
  onToggle,
  onUpdateGroup,
  webhookUrl
}: {
  group: LeadGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateGroup: (updatedGroup: LeadGroup) => void;
  webhookUrl: string;
}) {
  const {
    toast
  } = useToast();
  
  // Persistiere Webhook-URL und Personalisierungsoptionen pro Gruppe
  const [localWebhookUrl, setLocalWebhookUrl] = usePersistedForm(
    `webhook-url-${group.scrape_job_id}`, 
    webhookUrl
  );
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
  const handleStartPersonalization = async () => {
    console.log('Starting batch personalization for group:', group.scrape_job_id);
    console.log('Options:', group.personalizationOptions);
    console.log('Leads to process:', group.filteredLeads.length);
    console.log('Webhook URL:', localWebhookUrl);
    toast({
      title: "Sende Leads als Batch...",
      description: `Verarbeite ${group.filteredLeads.length} Leads in einem einzelnen Webhook-Call...`
    });

    // Prepare batch payload for all leads
    const batchPayload = {
      scrape_job_id: group.scrape_job_id,
      scrape_job_name: group.scrape_job_name,
      personalization_options: {
        email_validation: group.personalizationOptions.emailValidation,
        private_linkedin_analysis: group.personalizationOptions.privateLinkedInAnalysis,
        company_linkedin_analysis: group.personalizationOptions.companyLinkedInAnalysis,
        website_analysis: group.personalizationOptions.websiteAnalysis
      },
      leads: group.filteredLeads.map(lead => ({
        id: lead.id,
        first_name: lead.first_name || lead.raw_scraped_data?.firstName || '',
        last_name: lead.last_name || lead.raw_scraped_data?.lastName || '',
        email: lead.email || lead.raw_scraped_data?.email || null,
        phone: lead.phone || lead.raw_scraped_data?.phone || lead.raw_scraped_data?.phoneNumber || null,
        company_name: lead.company_name || lead.raw_scraped_data?.company || lead.raw_scraped_data?.companyName || null,
        title: lead.title || lead.raw_scraped_data?.title || lead.raw_scraped_data?.jobTitle || null,
        website: lead.website || lead.raw_scraped_data?.website || lead.raw_scraped_data?.companyWebsite || lead.raw_scraped_data?.url || null,
        location: {
          city: lead.city || lead.raw_scraped_data?.city || lead.raw_scraped_data?.location || null,
          state: lead.state || lead.raw_scraped_data?.state || null,
          country: lead.country || lead.raw_scraped_data?.country || null
        },
        linkedin_url: lead.person_linkedin_url || lead.raw_scraped_data?.linkedinUrl || lead.raw_scraped_data?.linkedin || null,
        company_linkedin_url: lead.company_linkedin_url || lead.raw_scraped_data?.companyLinkedinUrl || null,
        raw_data: lead.raw_scraped_data
      })),
      batchMode: true,
      batchSize: group.filteredLeads.length,
      timestamp: new Date().toISOString()
    };
    try {
      // Validate webhook URL first
      if (!localWebhookUrl || !localWebhookUrl.startsWith('http')) {
        throw new Error('Invalid webhook URL. Please enter a valid HTTP/HTTPS URL.');
      }
      console.log('🚀 Sending batch payload to n8n:', {
        scrape_job_id: batchPayload.scrape_job_id,
        scrape_job_name: batchPayload.scrape_job_name,
        personalization_options: batchPayload.personalization_options,
        batchMode: batchPayload.batchMode,
        batchSize: batchPayload.batchSize,
        leadsCount: batchPayload.leads.length,
        firstLead: batchPayload.leads[0],
        // Show first lead as example
        webhookUrl: localWebhookUrl,
        payloadSize: `${Math.round(JSON.stringify(batchPayload).length / 1024)} KB`
      });
      const response = await fetch(localWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchPayload)
      });
      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Webhook error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      const responseData = await response.json();
      console.log('✅ Batch webhook response:', responseData);
      toast({
        title: "Batch-Personalisierung erfolgreich gestartet",
        description: `Alle ${group.filteredLeads.length} Leads wurden in einem einzelnen Webhook-Call gesendet.`,
        variant: "default"
      });
    } catch (error) {
      console.error('❌ Failed to send batch webhook:', error);
      toast({
        title: "Fehler beim Senden der Batch-Anfrage",
        description: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        variant: "destructive"
      });
    }
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
  return <Card className="mb-4">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? <FolderOpen className="w-5 h-5 text-blue-600" /> : <FolderClosed className="w-5 h-5 text-gray-600" />}
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
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4 space-y-6">
              {/* Personalisierungs-Optionen */}
              <PersonalizationOptionsCard options={group.personalizationOptions} filterOptions={group.filterOptions} webhookUrl={localWebhookUrl} onOptionsChange={handlePersonalizationOptionsChange} onFilterChange={handleFilterChange} onWebhookUrlChange={setLocalWebhookUrl} onStartPersonalization={handleStartPersonalization} totalLeads={visibleLeads.length} filteredCount={group.filteredLeads.length} />
              
              {/* Lead-Liste */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  {group.filteredLeads.length} Leads aus diesem Scrape-Job:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.filteredLeads.map(lead => <LeadCard key={lead.id} lead={lead} onDelete={handleDeleteLead} />)}
                </div>
                
                {group.filteredLeads.length === 0 && visibleLeads.length > 0 && <div className="text-center py-8 text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Alle Leads wurden durch die Filter ausgeschlossen.</p>
                    <p className="text-sm">Ändere die Filter-Einstellungen, um Leads anzuzeigen.</p>
                  </div>}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>;
}

// Hauptkomponente
const Personalization = () => {
  const [leadGroups, setLeadGroups] = useState<LeadGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { webhookSettings } = useWebhookStorageLocal();

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
    setLeadGroups(prev => prev.map(group => 
      group.scrape_job_id === updatedGroup.scrape_job_id ? updatedGroup : group
    ));
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
      const groups: LeadGroup[] = Object.entries(grouped).map(([jobId, leads]) => {
        const firstLead = leads[0];
        const jobInfo = firstLead.scrape_jobs?.[0];

        // Job-Name generieren
        let jobName = 'Unbekannter Scrape-Job';
        if (jobInfo?.job_name) {
          jobName = jobInfo.job_name;
        } else if (firstLead.source_id) {
          jobName = `Scrape-Job ${firstLead.source_id}`;
        } else {
          const date = new Date(firstLead.created_at);
          jobName = `Scrape-Job vom ${date.toLocaleDateString('de-DE')}`;
        }

        // Datum für Sortierung
        const date = jobInfo?.started_at || firstLead.created_at;
        const sortedLeads = leads.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

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
          filteredLeads: sortedLeads,
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
          deletedLeadIds: new Set<string>()
        };
      }).sort((a, b) => {
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

  // Auto-refresh alle 30 Sekunden für neue Leads
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing leads...');
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Anreicherungs-Service-Handler
  const handleEnrichmentAction = async (leadId: string, service: string) => {
    const webhookUrl = webhookSettings.global_webhook_url;
    
    if (!webhookUrl) {
      throw new Error('Keine Webhook-URL konfiguriert');
    }

    // Finde den Lead
    const lead = leadGroups.flatMap(g => g.leads).find(l => l.id === leadId);
    if (!lead) {
      throw new Error('Lead nicht gefunden');
    }

    // Payload für N8N Webhook
    const payload = {
      lead_id: leadId,
      service: service,
      lead_data: {
        full_name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        email: lead.email || lead.raw_scraped_data?.email,
        company: lead.company_name || lead.raw_scraped_data?.company,
        linkedin_url: lead.person_linkedin_url || lead.raw_scraped_data?.linkedinUrl,
        website: lead.website || lead.raw_scraped_data?.website
      },
      timestamp: new Date().toISOString()
    };

    // Webhook aufrufen
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook-Fehler: ${response.status}`);
    }
  };

  // Gesamtstatistiken berechnen
  const totalStats = {
    totalLeads: leadGroups.reduce((sum, group) => 
      sum + group.leads.filter(l => !group.deletedLeadIds.has(l.id)).length, 0
    ),
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
                  <Wand2 /> Posteingang
                </h1>
                <p className="text-gray-600">
                  Neue, unbearbeitete Leads aus Scraping-Vorgängen. Wähle Personalisierungs-Optionen für die Weiterverarbeitung.
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
                      {totalStats.totalLeads > 0 ? Math.round(totalStats.totalWithEmail / totalStats.totalLeads * 100) : 0}%
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

              {/* Lead-Übersicht */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Lade Leads...</span>
                </div>
              ) : totalStats.totalLeads === 0 ? (
                <WaitingForLeadsState />
              ) : (
                <div className="space-y-6">
                  {/* Lead-Grid Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Lead-Übersicht ({totalStats.totalLeads} Leads)
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Klicke auf die Service-Buttons um individuelle Anreicherungen zu starten
                      </p>
                    </div>
                    <Button onClick={fetchLeads} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Aktualisieren
                    </Button>
                  </div>

                  {/* Leads als Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {leadGroups.flatMap(group => 
                      group.leads
                        .filter(lead => !group.deletedLeadIds.has(lead.id))
                        .map(lead => (
                          <LeadCard
                            key={lead.id}
                            lead={lead}
                            onDelete={(leadId) => {
                              // Update the specific group
                              const updatedGroups = leadGroups.map(g => {
                                if (g.scrape_job_id === group.scrape_job_id) {
                                  const newDeletedIds = new Set(g.deletedLeadIds);
                                  newDeletedIds.add(leadId);
                                  return { ...g, deletedLeadIds: newDeletedIds };
                                }
                                return g;
                              });
                              setLeadGroups(updatedGroups);
                            }}
                            onEnrichmentAction={handleEnrichmentAction}
                          />
                        ))
                    )}
                  </div>

                  {/* Scrape-Job Gruppierung (optional einklappbar) */}
                  <div className="mt-8">
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span>Gruppierung nach Scrape-Jobs anzeigen ({leadGroups.length} Jobs)</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 mt-4">
                        {leadGroups.map(group => (
                          <Card key={group.scrape_job_id || 'unknown'} className="border-l-4 border-l-gray-400">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <FolderOpen className="w-5 h-5 text-gray-600" />
                                {group.scrape_job_name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {group.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {group.leads.filter(l => !group.deletedLeadIds.has(l.id)).length} Leads
                                </span>
                                <span className="flex items-center gap-1">
                                  <MailCheck className="w-4 h-4" />
                                  {group.withEmail} mit E-Mail
                                </span>
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
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

export default Personalization;
