import { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // KORREKTUR: Fehlender Import hinzugefügt
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SlidersHorizontal, Rocket, X, Copy } from "lucide-react";
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { Badge } from '@/components/ui/badge';

// Daten basierend auf deinem Prompt
const jobPackages: Record<string, string[]> = {
  "Entscheidungsträger": ["Owner", "Founder", "CEO", "Co-Founder", "Managing Director", "Geschäftsführer", "General Manager", "President", "Inhaber", "Betriebsleiter", "Executive Director"],
  "Marketing": ["Marketing Manager", "Head of Marketing", "CMO"],
  "Recruiting/HR": ["HR Manager", "Recruiter", "Head of HR"],
  "Vertrieb": ["Sales Manager", "Head of Sales", "Business Development Manager"],
  "Technik/IT": ["CTO", "IT Manager", "Technical Director"],
  "Operations": ["Operations Manager", "COO"],
  "Finanzen": ["CFO", "Finance Manager"],
  "Produkt": ["Product Manager", "Head of Product"],
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
  const { webhookUrl: globalWebhookUrl } = useN8nConfig();
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [customTitles, setCustomTitles] = useState<string[]>([]);
  const [currentCustomTitle, setCurrentCustomTitle] = useState('');
  
  const [formData, setFormData] = useState({
    companySize: '',
    industry: 'all', // Standardwert setzen, um leere Auswahl zu vermeiden
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
      if (value) {
        setter(prev => [...new Set([...prev, value])]); // Verhindert Duplikate
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
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    toast({ title: "Link kopiert!", description: "Der generierte Such-Link wurde in die Zwischenablage kopiert."});
  };

  const handleSubmit = async () => {
    // ... (Logik bleibt gleich)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" />Alternative: Suche per Formular</CardTitle>
        <CardDescription>Stelle deine Lead-Suche hier manuell zusammen.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <Label>1. Zielgruppe (Mehrfachauswahl möglich)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {Object.keys(jobPackages).map(pkg => (
                <div key={pkg} className="flex items-center space-x-2">
                  <Checkbox id={pkg} checked={selectedPackages.includes(pkg)} onCheckedChange={() => handlePackageToggle(pkg)} />
                  <Label htmlFor={pkg} className="font-normal cursor-pointer">{pkg}</Label>
                </div>
              ))}
            </div>
        </div>
        {/* Restliches Formular... */}
        <div className="pt-4 border-t">
          <Label htmlFor="industry">4. Branche (optional)</Label>
          <Select defaultValue="all" onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger id="industry"><SelectValue placeholder="Branche wählen..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Branchen</SelectItem>
              {Object.keys(industryTags).map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {/* ... weiterer Formularcode ... */}
         <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          <Rocket className="mr-2 h-4 w-4" />
          {isLoading ? 'Wird gesendet...' : 'Lead-Suche an Workflow senden'}
        </Button>
      </CardContent>
    </Card>
  );
}
