import { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { SlidersHorizontal, Rocket, X, Copy, Check } from "lucide-react";
import { useWebhookStorageLocal } from '@/hooks/useWebhookStorageLocal';
import { usePersistedForm } from '@/hooks/usePersistedState';
import { Badge } from '@/components/ui/badge';
import { FormResetButton } from '@/components/ui/form-reset-button';

// Vollständige Berufspakete basierend auf dem Prompt
const jobPackages: Record<string, string[]> = {
  "Entscheidungsträger": [
    "Owner", "Founder", "CEO", "Co-Founder", "Managing Director", 
    "Geschäftsführer", "General Manager", "President", "Inhaber", 
    "Betriebsleiter", "Executive Director"
  ],
  "Marketing": [
    "Marketing Manager", "Online Marketing Manager", "Digital Marketing Manager",
    "Head of Marketing", "Marketing Director", "Content Manager", "Brand Manager",
    "Growth Manager", "Performance Marketing Manager", "CMO"
  ],
  "Recruiting/HR": [
    "HR Manager", "Recruiter", "Talent Acquisition Manager", "Head of HR",
    "People Manager", "HR Director", "Talent Manager", "CHRO", "People Operations Manager"
  ],
  "Vertrieb": [
    "Sales Manager", "Head of Sales", "Business Development Manager", "Account Manager",
    "Sales Director", "VP Sales", "Regional Sales Manager", "CSO"
  ],
  "Technik/IT": [
    "Technical Director", "IT Manager", "CTO", "Head of IT", "Software Development Manager",
    "Engineering Manager", "IT Director", "Head of Engineering", "Technical Lead"
  ],
  "Operations": [
    "Operations Manager", "COO", "Head of Operations", "Operations Director",
    "Project Manager", "Program Manager", "Supply Chain Manager"
  ],
  "Finanzen": [
    "CFO", "Finance Manager", "Head of Finance", "Finance Director",
    "Controller", "Accounting Manager"
  ],
  "Produkt": [
    "Product Manager", "Head of Product", "Product Owner", "CPO",
    "Product Director", "VP Product"
  ]
};

const companySizes = [
  { value: "1,10", label: "1-10 Mitarbeiter" },
  { value: "11,50", label: "11-50 Mitarbeiter" },
  { value: "51,200", label: "51-200 Mitarbeiter" },
  { value: "201,500", label: "201-500 Mitarbeiter" },
  { value: "501,1000", label: "501-1000 Mitarbeiter" },
  { value: "1001,5000", label: "1001-5000 Mitarbeiter" },
  { value: "5001,10000", label: "5001-10000 Mitarbeiter" },
  { value: "10001,1000000", label: "10001+ Mitarbeiter" }
];

// Standort-Mapping
const locationMapping: Record<string, string> = {
  "Köln": "Cologne, Germany",
  "München": "Munich, Germany",
  "Berlin": "Berlin, Germany",
  "Hamburg": "Hamburg, Germany",
  "Frankfurt": "Frankfurt, Germany",
  "Stuttgart": "Stuttgart, Germany",
  "Düsseldorf": "Düsseldorf, Germany",
  "Leipzig": "Leipzig, Germany",
  "Dresden": "Dresden, Germany",
  "Nürnberg": "Nuremberg, Germany",
  "Wien": "Vienna, Austria",
  "Zürich": "Zurich, Switzerland",
  "Deutschland": "Germany",
  "Österreich": "Austria",
  "Schweiz": "Switzerland",
  "DACH": "DACH" // Special handling needed
};

// Branchen-IDs
const industryIds: Record<string, string> = {
  "Healthcare": "5567cd4773696439b10b0000",
  "Software": "5567cd467369644d39040000",
  "E-Commerce": "5567cd4773696439dd350000",
  "Technology": "5567cd477369645401010000",
  "Finance": "5567cddb7369644d250c0000",
  "Marketing": "5567cdd47369643dbf260000"
};

export function LeadGenerationForm() {
  const { webhookSettings } = useWebhookStorageLocal();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Persistierte Form-States - überleben Browser-Wechsel, Seiten-Navigation, etc.
  const [selectedPackages, setSelectedPackages] = usePersistedForm('leadgen-packages', [] as string[]);
  const [locations, setLocations] = usePersistedForm('leadgen-locations', [] as string[]);
  const [currentLocation, setCurrentLocation] = usePersistedForm('leadgen-current-location', '');
  const [customTitles, setCustomTitles] = usePersistedForm('leadgen-custom-titles', [] as string[]);
  const [currentCustomTitle, setCurrentCustomTitle] = usePersistedForm('leadgen-current-title', '');
  const [industries, setIndustries] = usePersistedForm('leadgen-industries', [] as string[]);
  const [currentIndustry, setCurrentIndustry] = usePersistedForm('leadgen-current-industry', '');
  const [selectedSizes, setSelectedSizes] = usePersistedForm('leadgen-sizes', [] as string[]);
  
  const [formData, setFormData] = usePersistedForm('leadgen-form-data', {
    keywords: '',
    leadCount: 500
  });
  
  const [generatedLink, setGeneratedLink] = useState('');

  const handlePackageToggle = (pkg: string) => {
    setSelectedPackages(prev => 
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>, type: 'location' | 'title' | 'industry') => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      let value = '';
      let setter: any;
      
      if (type === 'location') {
        value = currentLocation.trim();
        setter = setLocations;
      } else if (type === 'title') {
        value = currentCustomTitle.trim();
        setter = setCustomTitles;
      } else {
        value = currentIndustry.trim();
        setter = setIndustries;
      }
      
      if (value) {
        setter((prev: string[]) => [...new Set([...prev, value])]);
      }
      
      if (type === 'location') setCurrentLocation('');
      else if (type === 'title') setCurrentCustomTitle('');
      else setCurrentIndustry('');
    }
  };

  const removeTag = (tagToRemove: string, type: 'location' | 'title' | 'industry') => {
    const setter = type === 'location' ? setLocations : type === 'title' ? setCustomTitles : setIndustries;
    setter(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const mapLocation = (location: string): string[] => {
    if (location === 'DACH') {
      return ['Germany', 'Austria', 'Switzerland'];
    }
    return [locationMapping[location] || location];
  };

  const generateApolloLink = () => {
    let baseUrl = 'https://app.apollo.io/#/people?page=1&sortByField=%5Bnone%5D&sortAscending=false&contactEmailStatusV2[]=verified&contactEmailStatusV2[]=unverified';
    const params: string[] = [];

    // Keywords
    if (formData.keywords) {
      params.push(`q=${encodeURIComponent(formData.keywords)}`);
    }

    // Job Titles
    const allTitles: string[] = [];
    selectedPackages.forEach(pkg => {
      allTitles.push(...jobPackages[pkg]);
    });
    allTitles.push(...customTitles);
    
    allTitles.forEach(title => {
      params.push(`personTitles[]=${encodeURIComponent(title)}`);
    });

    // Locations
    const allLocations: string[] = [];
    locations.forEach(loc => {
      allLocations.push(...mapLocation(loc));
    });
    
    allLocations.forEach(location => {
      params.push(`personLocations[]=${encodeURIComponent(location)}`);
    });

    // Company Sizes
    selectedSizes.forEach(size => {
      params.push(`organizationNumEmployeesRanges[]=${encodeURIComponent(size)}`);
    });

    // Industries
    industries.forEach(industry => {
      const industryId = industryIds[industry];
      if (industryId) {
        params.push(`organizationIndustryTagIds[]=${industryId}`);
      }
    });

    return baseUrl + (params.length > 0 ? '&' + params.join('&') : '');
  };

  const generateFileName = () => {
    const parts: string[] = [];
    
    // Zielgruppe
    if (selectedPackages.length > 0) {
      parts.push(selectedPackages[0]);
    } else if (customTitles.length > 0) {
      parts.push('Custom');
    }
    
    // Standort
    if (locations.length > 0) {
      parts.push(locations[0].replace(/[,\s]/g, '_'));
    }
    
    // Branche
    if (industries.length > 0) {
      parts.push(industries[0]);
    } else {
      parts.push('alle_Branchen');
    }
    
    // Größe
    if (selectedSizes.length > 0) {
      const sizeLabel = companySizes.find(s => s.value === selectedSizes[0])?.label || '';
      parts.push(sizeLabel.replace(' Mitarbeiter', 'MA').replace(/[\s-]/g, ''));
    }
    
    parts.push('leads_2025.csv');
    
    return parts.join('_');
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ 
      title: "Link kopiert!", 
      description: "Der Apollo.io Link wurde in die Zwischenablage kopiert."
    });
  };

  const handleSubmit = async () => {
    if (selectedPackages.length === 0 && customTitles.length === 0) {
      toast({ 
        title: "Fehlende Eingabe", 
        description: "Bitte mindestens eine Zielgruppe oder Berufsbezeichnung angeben.", 
        variant: "destructive"
      });
      return;
    }

    if (locations.length === 0) {
      toast({ 
        title: "Fehlende Eingabe", 
        description: "Bitte mindestens einen Standort angeben.", 
        variant: "destructive"
      });
      return;
    }

    if (selectedSizes.length === 0) {
      toast({ 
        title: "Fehlende Eingabe", 
        description: "Bitte mindestens eine Unternehmensgröße wählen.", 
        variant: "destructive"
      });
      return;
    }

    const finalWebhookUrl = webhookSettings.lead_scraping_webhook || webhookSettings.global_webhook_url;
    if (!finalWebhookUrl) {
      toast({ 
        title: "Konfiguration fehlt", 
        description: "Bitte Lead-Scraping Webhook in den Einstellungen konfigurieren.", 
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const apolloUrl = generateApolloLink();
    setGeneratedLink(apolloUrl);

    const payload = {
      url: apolloUrl,
      totalRecords: formData.leadCount,
      fileName: generateFileName(),
      getPersonalEmails: true,
      getWorkEmails: true
    };

    try {
      const response = await fetch(finalWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({ 
          title: "Erfolgreich gesendet!", 
          description: `Lead-Suche mit ${formData.leadCount} Leads wurde gestartet.`
        });
      } else {
        throw new Error('Webhook-Fehler');
      }
    } catch (error) {
      toast({ 
        title: "Fehler", 
        description: "Beim Senden an den Webhook ist ein Fehler aufgetreten.", 
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Apollo.io Lead-Suche per Formular
              </CardTitle>
              <CardDescription>
                Stelle deine Lead-Suche hier manuell zusammen - Alternative zum Chat-Bot.
              </CardDescription>
            </div>
            <FormResetButton 
              formKeys={[
                'leadgen-packages', 'leadgen-locations', 'leadgen-current-location',
                'leadgen-custom-titles', 'leadgen-current-title', 'leadgen-industries', 
                'leadgen-current-industry', 'leadgen-sizes', 'leadgen-form-data'
              ]}
              className="shrink-0"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schritt 1: Zielgruppe */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              1. Zielgruppe wählen (Mehrfachauswahl möglich)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(jobPackages).map(pkg => (
                <div key={pkg} className="flex items-center space-x-2">
                  <Checkbox 
                    id={pkg} 
                    checked={selectedPackages.includes(pkg)} 
                    onCheckedChange={() => handlePackageToggle(pkg)} 
                  />
                  <Label 
                    htmlFor={pkg} 
                    className="font-normal cursor-pointer text-sm"
                  >
                    {pkg}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="custom-titles" className="text-sm">
                Oder eigene Berufsbezeichnungen hinzufügen:
              </Label>
              <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2 min-h-[42px] items-center">
                {customTitles.map(title => (
                  <Badge key={title} variant="secondary" className="flex items-center gap-1">
                    {title}
                    <button 
                      onClick={() => removeTag(title, 'title')} 
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={14}/>
                    </button>
                  </Badge>
                ))}
                <Input 
                  id="custom-titles" 
                  placeholder="Titel eingeben und Enter drücken..." 
                  value={currentCustomTitle} 
                  onChange={e => setCurrentCustomTitle(e.target.value)} 
                  onKeyDown={e => handleTagInput(e, 'title')} 
                  className="flex-1 border-none outline-none shadow-none p-0 h-auto focus-visible:ring-0" 
                />
              </div>
            </div>
          </div>

          {/* Schritt 2: Standort */}
          <div>
            <Label htmlFor="location" className="text-base font-semibold mb-3 block">
              2. Standort(e) angeben
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              💡 Tipp: "DACH" umfasst Deutschland, Österreich und Schweiz
            </p>
            <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[42px] items-center">
              {locations.map(loc => (
                <Badge key={loc} variant="secondary" className="flex items-center gap-1">
                  {loc}
                  <button 
                    onClick={() => removeTag(loc, 'location')} 
                    className="ml-1 hover:text-red-500"
                  >
                    <X size={14}/>
                  </button>
                </Badge>
              ))}
              <Input 
                id="location" 
                placeholder="z.B. DACH, Berlin, München..." 
                value={currentLocation} 
                onChange={e => setCurrentLocation(e.target.value)} 
                onKeyDown={e => handleTagInput(e, 'location')} 
                className="flex-1 border-none outline-none shadow-none p-0 h-auto focus-visible:ring-0" 
              />
            </div>
          </div>

          {/* Schritt 3: Unternehmensgröße */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              3. Unternehmensgröße (Mehrfachauswahl möglich)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {companySizes.map(size => (
                <div key={size.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={size.value} 
                    checked={selectedSizes.includes(size.value)} 
                    onCheckedChange={() => handleSizeToggle(size.value)} 
                  />
                  <Label 
                    htmlFor={size.value} 
                    className="font-normal cursor-pointer text-sm"
                  >
                    {size.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Schritt 4: Branchen (optional) */}
          <div>
            <Label htmlFor="industries" className="text-base font-semibold mb-3 block">
              4. Branchen (optional)
            </Label>
            <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[42px] items-center">
              {industries.map(industry => (
                <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                  {industry}
                  <button 
                    onClick={() => removeTag(industry, 'industry')} 
                    className="ml-1 hover:text-red-500"
                  >
                    <X size={14}/>
                  </button>
                </Badge>
              ))}
              <Input 
                id="industries" 
                placeholder="z.B. Software, Healthcare, E-Commerce..." 
                value={currentIndustry} 
                onChange={e => setCurrentIndustry(e.target.value)} 
                onKeyDown={e => handleTagInput(e, 'industry')} 
                className="flex-1 border-none outline-none shadow-none p-0 h-auto focus-visible:ring-0" 
              />
            </div>
          </div>

          {/* Schritt 5: Keywords (optional) */}
          <div>
            <Label htmlFor="keywords" className="text-base font-semibold mb-3 block">
              5. Keywords (optional)
            </Label>
            <Input 
              id="keywords" 
              placeholder="z.B. SaaS, Cloud, AI, Startup" 
              value={formData.keywords}
              onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            />
          </div>

          {/* Schritt 6: Lead-Anzahl */}
          <div>
            <Label htmlFor="lead-count" className="text-base font-semibold mb-3 block">
              6. Anzahl Leads
            </Label>
            <Input 
              id="lead-count" 
              type="number" 
              min="500" 
              step="100" 
              value={formData.leadCount} 
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                leadCount: Math.max(500, parseInt(e.target.value, 10) || 500)
              }))} 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum: 500 Leads • Webhook wird aus Einstellungen geladen
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="w-full" 
            size="lg"
          >
            <Rocket className="mr-2 h-4 w-4" />
            {isLoading ? 'Wird gesendet...' : 'Lead-Suche starten'}
          </Button>
        </CardContent>
      </Card>
      
      {generatedLink && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generierter Apollo.io Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                readOnly 
                value={generatedLink} 
                className="text-xs font-mono" 
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
              >
                {copied ? <Check size={16}/> : <Copy size={16}/>}
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(generatedLink, '_blank')}
                className="flex-1"
              >
                In Apollo.io öffnen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
