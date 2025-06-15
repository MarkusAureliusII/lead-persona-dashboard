import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SlidersHorizontal, Rocket } from "lucide-react";
import { useN8nConfig } from '@/hooks/useN8nConfig';

// Daten und Logik basierend auf deinem Prompt
const jobPackages: Record<string, string[]> = {
  "Entscheidungsträger": ["Owner", "Founder", "CEO", "Co-Founder", "Managing Director", "Geschäftsführer", "General Manager", "President", "Inhaber", "Betriebsleiter", "Executive Director"],
  "Marketing": ["Marketing Manager", "Online Marketing Manager", "Digital Marketing Manager", "Head of Marketing", "Marketing Director", "Content Manager", "Brand Manager", "Growth Manager", "Performance Marketing Manager", "CMO"],
  "Recruiting/HR": ["HR Manager", "Recruiter", "Talent Acquisition Manager", "Head of HR", "People Manager", "HR Director"],
  "Vertrieb": ["Sales Manager", "Head of Sales", "Business Development Manager", "Account Manager", "Sales Director"],
  "Technik/IT": ["Technical Director", "IT Manager", "CTO", "Head of IT", "Software Development Manager"],
  // weitere Pakete können hier hinzugefügt werden
};

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"];

const industryTags: Record<string, string> = {
  "Healthcare": "5567cd4773696439b10b0000",
  "Software": "5567cd467369644d39040000",
  "E-Commerce": "5567cd4773696439dd350000",
  "Technology": "5567cd477369645401010000",
  "Finance": "5567cddb7369644d250c0000",
  "Marketing": "5567cdd47369643dbf260000",
};

export function LeadGenerationForm() {
  const { webhookUrl } = useN8nConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobPackage: '',
    customTitles: '',
    location: '',
    companySize: '',
    industry: '',
    keywords: '',
    leadCount: 500
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSearchUrl = () => {
    const baseUrl = "https://app.apollo.io/#/people?page=1&sortByField=%5Bnone%5D&sortAscending=false&contactEmailStatusV2[]=verified&contactEmailStatusV2[]=unverified";
    const params = new URLSearchParams();

    // Job Titles
    const titles = formData.jobPackage ? jobPackages[formData.jobPackage] : [];
    if (formData.customTitles) {
        titles.push(...formData.customTitles.split(',').map(t => t.trim()));
    }
    titles.forEach(title => params.append('personTitles[]', title));

    // Location
    if (formData.location) {
        // Simples Mapping für DACH
        const locations = formData.location.split(',').map(l => l.trim().toLowerCase());
        if (locations.includes('dach')) {
            params.append('personLocations[]', 'Germany');
            params.append('personLocations[]', 'Austria');
            params.append('personLocations[]', 'Switzerland');
        } else {
            locations.forEach(loc => params.append('personLocations[]', loc));
        }
    }

    // Company Size
    if (formData.companySize) {
        params.append('organizationNumEmployeesRanges[]', formData.companySize.replace('-', '%2C'));
    }
    
    // Industry
    if (formData.industry && industryTags[formData.industry]) {
        params.append('organizationIndustryTagIds[]', industryTags[formData.industry]);
    }

    // Keywords
    if (formData.keywords) {
        params.append('q', formData.keywords);
    }
    
    return `${baseUrl}&${params.toString()}`;
  };

  const handleSubmit = async () => {
    if (!formData.jobPackage && !formData.customTitles) {
        toast({ title: "Fehlende Eingabe", description: "Bitte eine Zielgruppe oder eigene Berufsbezeichnungen angeben.", variant: "destructive"});
        return;
    }
    if (!webhookUrl) {
        toast({ title: "Konfiguration fehlt", description: "Die n8n-Webhook-URL ist nicht konfiguriert.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    const generatedUrl = generateSearchUrl();
    
    const payload = {
        form_submission: true, // Um im Workflow zwischen Chat und Formular zu unterscheiden
        search_details: {
            url: generatedUrl,
            totalRecords: formData.leadCount,
            fileName: `${formData.jobPackage || 'custom'}_${formData.location || 'anywhere'}_leads.csv`,
            getPersonalEmails: true,
            getWorkEmails: true
        }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Fehler bei der Übertragung an den Workflow.");

        toast({
            title: "🚀 Auftrag übermittelt",
            description: "Deine Lead-Suche wurde erfolgreich an den Workflow gesendet.",
        });

    } catch (error) {
        toast({
            title: "Fehler",
            description: error instanceof Error ? error.message : "Unbekannter Fehler.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Alternative: Suche per Formular
        </CardTitle>
        <CardDescription>
          Stelle deine Lead-Suche hier manuell zusammen, wenn du nicht den Chat verwenden möchtest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="job-package">1. Zielgruppe (Paket)</Label>
          <Select onValueChange={(value) => handleInputChange('jobPackage', value)}>
            <SelectTrigger id="job-package"><SelectValue placeholder="Vordefiniertes Paket wählen..." /></SelectTrigger>
            <SelectContent>
              {Object.keys(jobPackages).map(pkg => <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
         <div>
          <Label htmlFor="custom-titles">Oder eigene Berufsbezeichnungen (kommagetrennt)</Label>
          <Input id="custom-titles" placeholder="z.B. Head of Innovation, Digital Manager" onChange={e => handleInputChange('customTitles', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="location">2. Standort</Label>
          <Input id="location" placeholder="z.B. DACH, Berlin, München" onChange={e => handleInputChange('location', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="company-size">3. Unternehmensgröße</Label>
          <Select onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger id="company-size"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
            <SelectContent>
              {companySizes.map(size => <SelectItem key={size} value={size}>{size} Mitarbeiter</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
            <Label htmlFor="industry">4. Branche (optional)</Label>
            <Select onValueChange={(value) => handleInputChange('industry', value)}>
              <SelectTrigger id="industry"><SelectValue placeholder="Branche wählen..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle Branchen</SelectItem>
                {Object.keys(industryTags).map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="keywords">5. Keywords (optional)</Label>
            <Input id="keywords" placeholder="z.B. SaaS, Cloud, AI" onChange={e => handleInputChange('keywords', e.target.value)} />
        </div>
        <div>
            <Label htmlFor="lead-count">6. Anzahl Leads</Label>
            <Input id="lead-count" type="number" min="500" step="100" value={formData.leadCount} onChange={e => handleInputChange('leadCount', parseInt(e.target.value, 10) || 500)} />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          <Rocket className="mr-2 h-4 w-4" />
          {isLoading ? 'Wird gesendet...' : 'Lead-Suche an Workflow senden'}
        </Button>
      </CardContent>
    </Card>
  );
}