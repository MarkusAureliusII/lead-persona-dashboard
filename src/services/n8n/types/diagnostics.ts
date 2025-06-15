
export interface N8nWebhookTest {
  id: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning';
  httpStatus?: number;
  responseTime: number;
  contentType?: string;
  responseSize?: number;
  errorMessage?: string;
  testPayload: any;
  response?: any;
}

export interface N8nDiagnosticResult {
  connectivity: N8nWebhookTest;
  cors: N8nWebhookTest;
  postRequest: N8nWebhookTest;
  urlValidation: N8nWebhookTest;
  overall: 'healthy' | 'degraded' | 'critical';
  recommendations: string[];
}
