
import { N8nWebhookTest } from '../types/diagnostics';

export class ConnectivityTestService {
  async testConnectivity(webhookUrl: string): Promise<N8nWebhookTest> {
    const testId = `connectivity_${Date.now()}`;
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(webhookUrl, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();

      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: 'success',
        responseTime: endTime - startTime,
        testPayload: { method: 'HEAD' }
      };

      return test;

    } catch (error) {
      const endTime = performance.now();
      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: 'error',
        responseTime: endTime - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown connectivity error',
        testPayload: { method: 'HEAD' }
      };

      return test;
    }
  }
}


