
import { N8nWebhookTest } from '../types/diagnostics';

export class CorsTestService {
  async testCorsConfiguration(webhookUrl: string): Promise<N8nWebhookTest> {
    const testId = `cors_${Date.now()}`;
    const startTime = performance.now();

    try {
      const response = await fetch(webhookUrl, {
        method: 'OPTIONS'
      });

      const endTime = performance.now();
      const corsHeaders = {
        origin: response.headers.get('Access-Control-Allow-Origin'),
        methods: response.headers.get('Access-Control-Allow-Methods'),
        headers: response.headers.get('Access-Control-Allow-Headers')
      };

      const hasCors = corsHeaders.origin !== null;

      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: hasCors ? 'success' : 'warning',
        httpStatus: response.status,
        responseTime: endTime - startTime,
        testPayload: { method: 'OPTIONS' },
        response: corsHeaders
      };

      return test;

    } catch (error) {
      const endTime = performance.now();
      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: 'warning',
        responseTime: endTime - startTime,
        errorMessage: 'CORS test failed - may be normal for some N8N configurations',
        testPayload: { method: 'OPTIONS' }
      };

      return test;
    }
  }
}
