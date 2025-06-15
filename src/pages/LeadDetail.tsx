import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Linkedin,
  ExternalLink,
  Check,
  X,
  Shield,
  Eye,
  Loader2,
  FileText,
  MessageSquare
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  phone_number: string;
  website: string;
  linkedin_url: string;
  company_linkedin_url: string;
  city: string;
  country: string;
  created_at: string;
  is_personal_linkedin_analyzed: boolean;
  is_email_verified: boolean;
  is_company_linkedin_analyzed: boolean;
  is_website_analyzed: boolean;
  is_custom_field_1_analyzed: boolean;
  analysis_text_personal_linkedin: string;
  analysis_text_company_linkedin: string;
  analysis_text_website: string;
  email_verification_status: string;
  is_email_verification_processed: boolean;
}

const BooleanStatus = ({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: boolean; 
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value ? (
        <>
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-600 font-medium">Ja</span>
        </>
      ) : (
        <>
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-600 font-medium">Nein</span>
        </>
      )}
    </div>
  </div>
);

const EmailStatusDisplay = ({ 
  status, 
  isProcessed 
}: { 
  status: string | null; 
  isProcessed: boolean;
}) => {
  const getStatusColor = (status: string | null) => {
    if (!status) return 'text-gray-500';
    switch (status.toLowerCase()) {
      case 'valid': return 'text-green-600';
      case 'invalid': return 'text-red-600';
      case 'risky': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string | null) => {
    if (!status) return <X className="w-5 h-5 text-gray-500" />;
    switch (status.toLowerCase()) {
      case 'valid': return <Check className="w-5 h-5 text-green-600" />;
      case 'invalid': return <X className="w-5 h-5 text-red-600" />;
      case 'risky': return <Eye className="w-5 h-5 text-yellow-600" />;
      default: return <Eye className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-gray-600" />
        <span className="font-medium">E-Mail verifiziert</span>
      </div>
      <div className="flex items-center gap-2">
        {getStatusIcon(status)}
        <span className={`font-medium ${getStatusColor(status)}`}>
          {isProcessed && status ? `Status: ${status}` : 'Nicht verarbeitet'}
        </span>
      </div>
    </div>
  );
};

const AnalysisTextDisplay = ({
  title,
  content,
  icon: Icon
}: {
  title: string;
  content: string | null;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  if (!content) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 max-h-64 overflow-y-auto">
            {content}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

const LeadDetail = () => {
  const { leadId } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (leadId) {
      fetchLeadDetails(leadId);
    }
  }, [leadId]);

  const fetchLeadDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          name,
          company,
          email,
          phone,
          phone_number,
          website,
          linkedin_url,
          company_linkedin_url,
          city,
          country,
          created_at,
          is_personal_linkedin_analyzed,
          is_email_verified,
          is_company_linkedin_analyzed,
          is_website_analyzed,
          is_custom_field_1_analyzed,
          analysis_text_personal_linkedin,
          analysis_text_company_linkedin,
          analysis_text_website,
          email_verification_status,
          is_email_verification_processed
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Lead nicht gefunden');
      }

      setLead(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden des Leads';
      setError(errorMessage);
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Lade Lead-Details...</span>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error || !lead) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <Link to="/personalization">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Zurück zur Übersicht
                    </Button>
                  </Link>
                </div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Fehler</h2>
                    <p className="text-gray-600">{error || 'Lead nicht gefunden'}</p>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Link to="/personalization">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück zur Übersicht
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Erstellt am {new Date(lead.created_at).toLocaleDateString('de-DE')}
                </div>
              </div>

              {/* Lead-Informationen */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {lead.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Persönliche Daten */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Kontaktdaten</h3>
                      
                      {lead.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                      
                      {(lead.phone || lead.phone_number) && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-600" />
                          <a 
                            href={`tel:${lead.phone || lead.phone_number}`}
                            className="text-green-600 hover:underline"
                          >
                            {lead.phone || lead.phone_number}
                          </a>
                        </div>
                      )}
                      
                      {lead.linkedin_url && (
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                          <a 
                            href={lead.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            LinkedIn Profil <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      
                      {(lead.city || lead.country) && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <span>{[lead.city, lead.country].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Unternehmensdaten */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Unternehmen</h3>
                      
                      {lead.company && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{lead.company}</span>
                        </div>
                      )}
                      
                      {lead.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-purple-600" />
                          <a 
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline flex items-center gap-1"
                          >
                            Website besuchen <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      
                      {lead.company_linkedin_url && (
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                          <a 
                            href={lead.company_linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Unternehmens-LinkedIn <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anreicherungs-Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Anreicherungs-Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BooleanStatus
                      label="Pers. LinkedIn analysiert"
                      value={lead.is_personal_linkedin_analyzed}
                      icon={Linkedin}
                    />
                    
                    <EmailStatusDisplay
                      status={lead.email_verification_status}
                      isProcessed={lead.is_email_verification_processed}
                    />
                    
                    <BooleanStatus
                      label="Firma LinkedIn analysiert"
                      value={lead.is_company_linkedin_analyzed}
                      icon={Building}
                    />
                    
                    <BooleanStatus
                      label="Webseite analysiert"
                      value={lead.is_website_analyzed}
                      icon={Globe}
                    />
                    
                    {lead.is_custom_field_1_analyzed !== undefined && (
                      <BooleanStatus
                        label="Custom Field 1 analysiert"
                        value={lead.is_custom_field_1_analyzed}
                        icon={Eye}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Analyse-Ergebnisse */}
              <AnalysisTextDisplay
                title="Personal LinkedIn Analyse"
                content={lead.analysis_text_personal_linkedin}
                icon={Linkedin}
              />

              <AnalysisTextDisplay
                title="Unternehmens-LinkedIn Analyse"
                content={lead.analysis_text_company_linkedin}
                icon={Building}
              />

              <AnalysisTextDisplay
                title="Website-Analyse"
                content={lead.analysis_text_website}
                icon={Globe}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadDetail;