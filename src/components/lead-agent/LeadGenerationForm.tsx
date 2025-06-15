import { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SlidersHorizontal, Rocket, Checkbox, X, Copy } from "lucide-react";
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { Badge } from '@/components/ui/badge';

// Daten basierend auf deinem Prompt
const jobPackages: Record<string, string[]> = {
  "Entscheidungsträger": ["Owner", "Founder", "CEO", "Co-Founder", "Managing Director", "Geschäftsführer", "General Manager", "President", "Inhaber", "Betriebsleiter", "Executive Director"],
  "Marketing": ["Marketing Manager", "Online Marketing Manager", "Digital Marketing Manager", "Head of Marketing", "Marketing Director", "Content Manager"],
  "Recruiting/HR": ["HR Manager", "Recruiter", "Talent Acquisition Manager", "Head of HR", "People Manager", "HR Director"],
  "Vertrieb": ["Sales Manager", "Head of Sales", "Business Development Manager", "Account Manager", "Sales Director"],
  "Technik/IT": ["Technical Director", "IT Manager", "CTO", "Head of IT", "Software Development Manager"],
};

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"];

export function LeadGenerationForm() {
  const { webhookUrl: globalWebhookUrl } = useN8nConfig();
  const [isLoading, setIsLoading] = useState(false);
  
  // State für Mehrfachauswahl und Tag-Eingabe
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [customTitles, setCustomTitles] = useState<string[]>([]);
  const [currentCustomTitle, setCurrentCustomTitle] = useState('');
  
  const [formData, setFormData] = useState({
    companySize: '',
    industry: '',
    keywords: '',
    leadCount: 500,
    formWebhookUrl: ''
  });
  
  const [generatedLink, setGeneratedLink] = useState('');

  const handlePackageToggle = (pkg: string) => {
    setSelectedPackages(prev => 
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>, type: 'location' | 'title') => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const setter = type === 'location' ? setLocations : setCustomTitles;
      const value = (type === 'location' ? currentLocation : currentCustomTitle).trim();
      if (value && !setter(prev => prev.includes(value))) {
        setter(prev => [...prev, value]);
      }
      if (type === 'location') setCurrentLocation('');
      else setCurrentCustomTitle('');
    }
  };

  const removeTag = (tag: string, type: 'location' | 'title') => {
    const setter = type === 'location' ? setLocations : setCustomTitles;
    setter(prev => prev.filter(t => t !== tag));
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({ title: "Link kopiert!", description: "Der generierte Such-Link wurde in die Zwischenablage kopiert."});
  };

  const handleSubmit = async () => {
    if (selectedPackages.length === 0 && customTitles.length === 0) {
        toast({ title: "Fehlende Eingabe", description: "Bitte mindestens eine Zielgruppe oder Berufsbezeichnung angeben.", variant: "destructive"});
        return;
    }
    const finalWebhookUrl = formData.formWebhookUrl || globalWebhookUrl;
    if (!finalWebhookUrl) {
        toast({ title: "Konfiguration fehlt", description: "Es ist keine Webhook-URL konfiguriert.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setGeneratedLink('');

    // URL-Generierung
    const baseUrl = "https://app.apollo.io/#/people?page=1&sortByField=%5Bnone%5D&sortAscending=false&contactEmailStatusV2[]=verified&contactEmailStatusV2[]=unverified";
    const params = new URLSearchParams();
    
    let allTitles: string[] = [...customTitles];
    selectedPackages.forEach(pkg => {
      allTitles.push(...jobPackages[pkg]);
    });
    allTitles.forEach(title => params.append('personTitles[]', title));
    
    locations.forEach(loc => params.append('personLocations[]', loc));
    if (formData.companySize) params.append('organizationNumEmployeesRanges[]', formData.companySize.replace('-', '%2C'));
    if (formData.keywords) params.append('q', formData.keywords);
    
    const finalUrl = `${baseUrl}&${params.toString()}`;
    setGeneratedLink(finalUrl);

    // Webhook-Aufruf
    const payload = { form_submission: true, search_details: { url: finalUrl, totalRecords: formData.leadCount }};

    try {
        const response = await fetch(finalWebhookUrl, {
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
        toast({ title: "Fehler", description: error instanceof Error ? error.message : "Unbekannter Fehler.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" />Alternative: Suche per Formular</CardTitle>
          <CardDescription>Stelle deine Lead-Suche hier manuell zusammen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>1. Zielgruppe (Mehrfachauswahl möglich)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {Object.keys(jobPackages).map(pkg => (
                <div key={pkg} className="flex items-center space-x-2">
                  <Checkbox id={pkg} checked={selectedPackages.includes(pkg)} onCheckedChange={() => handlePackageToggle(pkg)} />
                  <Label htmlFor={pkg} className="font-normal cursor-pointer">{pkg}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="custom-titles">Oder eigene Berufsbezeichnungen (mit Komma oder Enter trennen)</Label>
            <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2 min-h-[40px]">
              {customTitles.map(title => (
                <Badge key={title} variant="secondary">{title}<button onClick={() => removeTag(title, 'title')} className="ml-2 hover:text-red-500"><X size={14}/></button></Badge>
              ))}
              <Input id="custom-titles" placeholder="Titel hinzufügen..." value={currentCustomTitle} onChange={e => setCurrentCustomTitle(e.target.value)} onKeyDown={e => handleTagInput(e, 'title')} className="flex-1 border-none outline-none shadow-none p-0 focus-visible:ring-0" />
            </div>
          </div>
          <div>
            <Label htmlFor="location">2. Standort (mit Komma oder Enter trennen)</Label>
             <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2 min-h-[40px]">
              {locations.map(loc => (
                <Badge key={loc} variant="secondary">{loc}<button onClick={() => removeTag(loc, 'location')} className="ml-2 hover:text-red-500"><X size={14}/></button></Badge>
              ))}
              <Input id="location" placeholder="z.B. DACH, Berlin..." value={currentLocation} onChange={e => setCurrentLocation(e.target.value)} onKeyDown={e => handleTagInput(e, 'location')} className="flex-1 border-none outline-none shadow-none p-0 focus-visible:ring-0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-size">3. Unternehmensgröße</Label>
              <Select onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger id="company-size"><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                <SelectContent>{companySizes.map(size => <SelectItem key={size} value={size}>{size} Mitarbeiter</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lead-count">4. Anzahl Leads</Label>
              <Input id="lead-count" type="number" min="500" step="100" value={formData.leadCount} onChange={e => handleInputChange('leadCount', parseInt(e.target.value, 10) || 500)} />
            </div>
          </div>
          <div>
              <Label htmlFor="form-webhook">Eigene Webhook-URL (optional)</Label>
              <Input id="form-webhook" placeholder="Globale URL aus den Einstellungen wird verwendet..." onChange={e => handleInputChange('formWebhookUrl', e.target.value)} />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            <Rocket className="mr-2 h-4 w-4" />
            {isLoading ? 'Wird gesendet...' : 'Lead-Suche an Workflow senden'}
          </Button>
        </CardContent>
      </Card>
      
      {generatedLink && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generierter Such-Link (Testzwecke)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input readOnly value={generatedLink} className="text-xs" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}><Copy size={16}/></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}