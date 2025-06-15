
import { N8nWebhookTest } from '../types/diagnostics';

export class PostRequestTestService {
  async testPostRequest(webhookUrl: string): Promise<N8nWebhookTest> {
    const testId = `post_${Date.now()}`;
    const startTime = performance.now();

    const testPayload = {
      test: true,
      testId: testId,
      timestamp: new Date().toISOString(),
      source: 'EnhancedN8nService',
      data: {
        industry: 'Technology',
        companySize: '50-200',
        jobTitle: 'Software Engineer',
        location: 'Remote'
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Request': 'true'
        },
        body: JSON.stringify(testPayload)
      });

      const endTime = performance.now();
      const contentType = response.headers.get('content-type') || '';
      let responseData: any;

      try {
        if (contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (parseError) {
        responseData = 'Unable to parse response';
      }

      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: response.ok ? 'success' : 'error',
        httpStatus: response.status,
        responseTime: endTime - startTime,
        contentType: contentType,
        responseSize: JSON.stringify(responseData).length,
        testPayload: testPayload,
        response: responseData
      };

      return test;

    } catch (error) {
      const endTime = performance.now();
      const test: N8nWebhookTest = {
        id: testId,
        timestamp: new Date().toISOString(),
        status: 'error',
        responseTime: endTime - startTime,
        errorMessage: error instanceof Error ? error.message : 'POST request failed',
        testPayload: testPayload
      };

      return test;
    }
  }
}
