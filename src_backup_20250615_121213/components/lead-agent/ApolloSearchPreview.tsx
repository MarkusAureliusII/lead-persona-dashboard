
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, RotateCcw } from "lucide-react";
import { SearchParameters } from "@/types/leadAgent";
import { useState } from "react";

interface ApolloSearchPreviewProps {
  searchParameters: SearchParameters;
  onParametersReuse?: (parameters: SearchParameters) => void;
}

export function ApolloSearchPreview({ searchParameters, onParametersReuse }: ApolloSearchPreviewProps) {
  const [copied, setCopied] = useState(false);

  const generateApolloLink = (params: SearchParameters): string => {
    const baseUrl = "https://app.apollo.io/#/people";
    const searchParams = new URLSearchParams();
    
    if (params.industry) searchParams.append("industry", params.industry);
    if (params.jobTitle) searchParams.append("title", params.jobTitle);
    if (params.location) searchParams.append("location", params.location);
    if (params.companySize) searchParams.append("company_size", params.companySize);
    
    return `${baseUrl}?${searchParams.toString()}`;
  };

  const apolloLink = Object.keys(searchParameters).length > 0 ? generateApolloLink(searchParameters) : "";

  const copyToClipboard = async () => {
    if (apolloLink) {
      await navigator.clipboard.writeText(apolloLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReuseParameters = () => {
    if (onParametersReuse) {
      onParametersReuse(searchParameters);
    }
  };

  const hasParameters = Object.keys(searchParameters).length > 0;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Apollo Search Preview</h2>
      
      {!hasParameters ? (
        <div className="text-center py-8 text-gray-500">
          <p>Keine Suchparameter definiert.</p>
          <p className="text-sm mt-1">Verwenden Sie das Formular oder den Chat-Agent, um Parameter zu generieren.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Generierte Suchparameter:</h3>
            <div className="space-y-2">
              {searchParameters.industry && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Branche</Badge>
                  <span className="text-sm">{searchParameters.industry}</span>
                </div>
              )}
              {searchParameters.jobTitle && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Position</Badge>
                  <span className="text-sm">{searchParameters.jobTitle}</span>
                </div>
              )}
              {searchParameters.location && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Location</Badge>
                  <span className="text-sm">{searchParameters.location}</span>
                </div>
              )}
              {searchParameters.companySize && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Firmengröße</Badge>
                  <span className="text-sm">{searchParameters.companySize}</span>
                </div>
              )}
            </div>
          </div>

          {searchParameters.estimatedLeads && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Geschätzte Leads</h3>
                  <p className="text-2xl font-bold text-blue-600">{searchParameters.estimatedLeads}</p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Apollo Link:</h3>
            <div className="bg-gray-50 border rounded-lg p-3">
              <code className="text-xs text-gray-600 break-all">{apolloLink}</code>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Kopiert!" : "Link kopieren"}
              </Button>
              
              <Button
                asChild
                size="sm"
                className="flex items-center gap-2"
              >
                <a href={apolloLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  In Apollo öffnen
                </a>
              </Button>

              {onParametersReuse && (
                <Button
                  onClick={handleReuseParameters}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Parameter wiederverwenden
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
