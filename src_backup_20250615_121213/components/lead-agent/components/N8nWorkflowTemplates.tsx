
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Copy, 
  ExternalLink, 
  FileText, 
  MessageSquare,
  Database,
  Mail,
  Webhook,
  Zap
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'integration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  workflow: any;
  setupInstructions: string[];
  requiredNodes: string[];
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'basic-lead-capture',
    name: 'Basis Lead-Erfassung',
    description: 'Einfacher Workflow für die Erfassung von Lead-Daten über Webhook',
    category: 'basic',
    difficulty: 'beginner',
    features: ['Webhook-Empfang', 'Datenvalidierung', 'JSON-Response'],
    requiredNodes: ['Webhook', 'Set', 'Respond to Webhook'],
    setupInstructions: [
      'Webhook-Node mit POST-Methode konfigurieren',
      'Set-Node für Datenverarbeitung hinzufügen',
      'Respond-Node für Antwort konfigurieren'
    ],
    workflow: {
      nodes: [
        {
          name: "Webhook",
          type: "n8n-nodes-base.webhook",
          position: [240, 300],
          parameters: {
            path: "lead-capture",
            httpMethod: "POST",
            responseMode: "responseNode"
          }
        },
        {
          name: "Process Lead Data",
          type: "n8n-nodes-base.set",
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "leadId",
                  value: "={{ $json.testId || 'lead_' + Date.now() }}"
                },
                {
                  name: "industry",
                  value: "={{ $json.targetAudience?.industry || $json.industry || 'Unknown' }}"
                },
                {
                  name: "companySize",
                  value: "={{ $json.targetAudience?.companySize || $json.companySize || 'Unknown' }}"
                },
                {
                  name: "processed",
                  value: "true"
                }
              ]
            }
          }
        },
        {
          name: "Respond",
          type: "n8n-nodes-base.respondToWebhook",
          position: [680, 300],
          parameters: {
            respondWith: "json",
            responseBody: {
              success: true,
              leadId: "={{ $json.leadId }}",
              message: "Lead erfolgreich verarbeitet",
              data: {
                industry: "={{ $json.industry }}",
                companySize: "={{ $json.companySize }}"
              }
            }
          }
        }
      ],
      connections: {
        "Webhook": {
          "main": [
            [
              {
                "node": "Process Lead Data",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Process Lead Data": {
          "main": [
            [
              {
                "node": "Respond",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      }
    }
  },
  {
    id: 'advanced-lead-processing',
    name: 'Erweiterte Lead-Verarbeitung',
    description: 'Komplexer Workflow mit Datenvalidierung, Anreicherung und Weiterleitung',
    category: 'advanced',
    difficulty: 'intermediate',
    features: ['Datenvalidierung', 'Lead-Anreicherung', 'Conditional Logic', 'Error Handling'],
    requiredNodes: ['Webhook', 'Function', 'IF', 'HTTP Request', 'Set'],
    setupInstructions: [
      'Webhook für Lead-Empfang konfigurieren',
      'Function-Node für Datenvalidierung',
      'IF-Node für Conditional Logic',
      'HTTP Request für externe APIs',
      'Error-Handling implementieren'
    ],
    workflow: {
      nodes: [
        {
          name: "Lead Webhook",
          type: "n8n-nodes-base.webhook",
          position: [120, 300],
          parameters: {
            path: "advanced-lead",
            httpMethod: "POST"
          }
        },
        {
          name: "Validate Data",
          type: "n8n-nodes-base.function",
          position: [320, 300],
          parameters: {
            functionCode: `
const requiredFields = ['industry', 'companySize', 'jobTitle'];
const data = items[0].json;

// Validate required fields
for (const field of requiredFields) {
  if (!data[field] && !data.targetAudience?.[field]) {
    throw new Error(\`Missing required field: \${field}\`);
  }
}

// Normalize data
const normalizedData = {
  industry: data.targetAudience?.industry || data.industry,
  companySize: data.targetAudience?.companySize || data.companySize,
  jobTitle: data.targetAudience?.jobTitle || data.jobTitle,
  location: data.targetAudience?.location || data.location || 'Unknown',
  timestamp: new Date().toISOString(),
  source: 'lead-agent'
};

return [{ json: normalizedData }];
            `
          }
        },
        {
          name: "Check Industry",
          type: "n8n-nodes-base.if",
          position: [520, 300],
          parameters: {
            conditions: {
              string: [
                {
                  value1: "={{ $json.industry }}",
                  operation: "contains",
                  value2: "Technology"
                }
              ]
            }
          }
        },
        {
          name: "Enrich Tech Lead",
          type: "n8n-nodes-base.set",
          position: [720, 240],
          parameters: {
            values: {
              string: [
                {
                  name: "priority",
                  value: "high"
                },
                {
                  name: "segment",
                  value: "tech"
                }
              ]
            }
          }
        },
        {
          name: "Standard Processing",
          type: "n8n-nodes-base.set",
          position: [720, 360],
          parameters: {
            values: {
              string: [
                {
                  name: "priority",
                  value: "medium"
                },
                {
                  name: "segment",
                  value: "general"
                }
              ]
            }
          }
        }
      ]
    }
  },
  {
    id: 'chat-widget-integration',
    name: 'Chat Widget Integration',
    description: 'Vollständige Integration für Chat-Widget mit Nachrichtenverlauf',
    category: 'integration',
    difficulty: 'advanced',
    features: ['Chat-Interface', 'Session Management', 'Message History', 'AI Integration'],
    requiredNodes: ['Webhook', 'Function', 'Set', 'HTTP Request', 'Merge'],
    setupInstructions: [
      'Chat Widget Webhook konfigurieren',
      'Session-Management implementieren',
      'Nachrichtenverlauf speichern',
      'AI-Service integrieren'
    ],
    workflow: {
      nodes: [
        {
          name: "Chat Webhook",
          type: "n8n-nodes-base.webhook",
          position: [120, 300],
          parameters: {
            path: "chat-widget",
            httpMethod: "POST",
            responseMode: "responseNode"
          }
        },
        {
          name: "Process Message",
          type: "n8n-nodes-base.function",
          parameters: {
            functionCode: `
const message = items[0].json;

// Extract session info
const sessionId = message.sessionId || 'session_' + Date.now();
const userMessage = message.message || message.text;
const messageType = message.type || 'user';

// Process based on message type
if (messageType === 'search_parameters') {
  return [{
    json: {
      sessionId,
      type: 'search_parameters',
      data: message.parameters,
      timestamp: new Date().toISOString()
    }
  }];
}

return [{
  json: {
    sessionId,
    userMessage,
    messageType,
    timestamp: new Date().toISOString(),
    needsResponse: true
  }
}];
            `
          }
        }
      ]
    }
  }
];

export function N8nWorkflowTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const { toast } = useToast();

  const copyToClipboard = (workflow: any) => {
    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
    toast({
      title: "📋 Kopiert!",
      description: "Workflow wurde in die Zwischenablage kopiert",
    });
  };

  const downloadWorkflow = (template: WorkflowTemplate) => {
    const blob = new Blob([JSON.stringify(template.workflow, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}-workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return <FileText className="w-4 h-4" />;
      case 'advanced': return <Zap className="w-4 h-4" />;
      case 'integration': return <Database className="w-4 h-4" />;
      default: return <Webhook className="w-4 h-4" />;
    }
  };

  const filteredTemplates = workflowTemplates.filter(t => t.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          📚 N8N Workflow-Vorlagen
        </CardTitle>
        <p className="text-sm text-gray-600">
          Vorgefertigte Workflows für verschiedene Lead-Agent Anwendungsfälle
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Basis
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Erweitert
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(template.category)}
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">✨ Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Required Nodes */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">🔧 Benötigte Nodes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredNodes.map((node, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {node}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Setup Instructions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">📋 Setup-Anweisungen:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {template.setupInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(template.workflow)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Kopieren
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadWorkflow(template)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://docs.n8n.io/workflows/import/', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      N8N Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Verwendungshinweise:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Workflows können direkt in N8N importiert werden</li>
            <li>• Passen Sie die Webhook-URLs an Ihre Domain an</li>
            <li>• Testen Sie alle Workflows vor dem Produktiveinsatz</li>
            <li>• Erweitern Sie die Workflows nach Ihren Anforderungen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
