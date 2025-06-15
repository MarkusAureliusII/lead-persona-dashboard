
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, X, Filter, Download } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  company: string | null;
  created_at: string;
  is_personal_linkedin_analyzed: boolean | null;
  is_email_verified: boolean | null;
  is_company_linkedin_analyzed: boolean | null;
  is_website_analyzed: boolean | null;
}

interface Filters {
  is_personal_linkedin_analyzed: boolean;
  is_email_verified: boolean;
  is_company_linkedin_analyzed: boolean;
  is_website_analyzed: boolean;
}

const BooleanIcon = ({ value }: { value: boolean | null }) => (
  value === true ? (
    <Check className="w-4 h-4 text-green-600" />
  ) : (
    <X className="w-4 h-4 text-red-600" />
  )
);

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    is_personal_linkedin_analyzed: false,
    is_email_verified: false,
    is_company_linkedin_analyzed: false,
    is_website_analyzed: false,
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('leads')
        .select(`
          id,
          name,
          company,
          created_at,
          is_personal_linkedin_analyzed,
          is_email_verified,
          is_company_linkedin_analyzed,
          is_website_analyzed
        `);

      // Dynamisch Filter anwenden (UND-Verknüpfung)
      if (filters.is_personal_linkedin_analyzed) {
        query = query.eq('is_personal_linkedin_analyzed', true);
      }
      if (filters.is_email_verified) {
        query = query.eq('is_email_verified', true);
      }
      if (filters.is_company_linkedin_analyzed) {
        query = query.eq('is_company_linkedin_analyzed', true);
      }
      if (filters.is_website_analyzed) {
        query = query.eq('is_website_analyzed', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Leads');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey: keyof Filters, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: checked
    }));
  };

  const convertToCSV = (data: Lead[]): string => {
    const headers = [
      'Lead-Name',
      'Unternehmen', 
      'Erstellt am',
      'Pers. LinkedIn analysiert',
      'E-Mail verifiziert',
      'Firma LinkedIn analysiert',
      'Webseite analysiert'
    ];

    const csvRows = [
      headers.join(','),
      ...data.map(lead => [
        `"${lead.name}"`,
        `"${lead.company}"`,
        `"${new Date(lead.created_at).toLocaleDateString('de-DE')}"`,
        lead.is_personal_linkedin_analyzed ? 'Ja' : 'Nein',
        lead.is_email_verified ? 'Ja' : 'Nein',
        lead.is_company_linkedin_analyzed ? 'Ja' : 'Nein',
        lead.is_website_analyzed ? 'Ja' : 'Nein'
      ].join(','))
    ];

    return csvRows.join('\n');
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('Keine Leads zum Exportieren verfügbar');
      return;
    }

    const csvContent = convertToCSV(leads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      // Dateiname mit aktueller Zeitstempel und angewendeten Filtern
      const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, _]) => key.replace('is_', '').replace('_', '-'))
        .join('-');
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads-export-${timestamp}${activeFilters ? '-' + activeFilters : ''}.csv`;
      
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Lade Leads...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Fehler: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Lead-Liste ({leads.length} Leads)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filterleiste */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Filter nach Anreicherungsstatus:</h3>
            <Button 
              onClick={handleExportCSV}
              variant="outline" 
              size="sm"
              disabled={leads.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Als CSV exportieren ({leads.length})
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="linkedin-personal"
                checked={filters.is_personal_linkedin_analyzed}
                onCheckedChange={(checked) => 
                  handleFilterChange('is_personal_linkedin_analyzed', checked as boolean)
                }
              />
              <label htmlFor="linkedin-personal" className="text-sm font-medium">
                Pers. LinkedIn analysiert
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email-verified"
                checked={filters.is_email_verified}
                onCheckedChange={(checked) => 
                  handleFilterChange('is_email_verified', checked as boolean)
                }
              />
              <label htmlFor="email-verified" className="text-sm font-medium">
                E-Mail verifiziert
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="linkedin-company"
                checked={filters.is_company_linkedin_analyzed}
                onCheckedChange={(checked) => 
                  handleFilterChange('is_company_linkedin_analyzed', checked as boolean)
                }
              />
              <label htmlFor="linkedin-company" className="text-sm font-medium">
                Firma LinkedIn analysiert
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="website-analyzed"
                checked={filters.is_website_analyzed}
                onCheckedChange={(checked) => 
                  handleFilterChange('is_website_analyzed', checked as boolean)
                }
              />
              <label htmlFor="website-analyzed" className="text-sm font-medium">
                Webseite analysiert
              </label>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead-Name</TableHead>
              <TableHead>Unternehmen</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead>Pers. LinkedIn analysiert</TableHead>
              <TableHead>E-Mail verifiziert</TableHead>
              <TableHead>Firma LinkedIn analysiert</TableHead>
              <TableHead>Webseite analysiert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow 
                key={lead.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => window.open(`/lead/${lead.id}`, '_blank')}
              >
                <TableCell className="font-medium">{lead.name || 'Unbekannt'}</TableCell>
                <TableCell>{lead.company || 'Unbekannt'}</TableCell>
                <TableCell>
                  {new Date(lead.created_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  <BooleanIcon value={lead.is_personal_linkedin_analyzed} />
                </TableCell>
                <TableCell>
                  <BooleanIcon value={lead.is_email_verified} />
                </TableCell>
                <TableCell>
                  <BooleanIcon value={lead.is_company_linkedin_analyzed} />
                </TableCell>
                <TableCell>
                  <BooleanIcon value={lead.is_website_analyzed} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {leads.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Keine Leads gefunden
          </div>
        )}
      </CardContent>
    </Card>
  );
}
