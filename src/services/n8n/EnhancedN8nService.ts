
import { useToast } from "@/hooks/use-toast";

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

export class EnhancedN8nService {
  private baseUrl: string;
  private testHistory: N8nWebhookTest[] = [];

  constructor(webhookUrl: string) {
    this.baseUrl = webhookUrl;
  }

  async runComprehensiveDiagnostics(): Promise<N8nDiagnosticResult> {
    const results: N8nDiagnosticResult = {
      connectivity: await this.testConnectivity(),
      cors: await this.testCorsConfiguration(),
      postRequest: await this.testPostRequest(),
      urlValidation: this.validateUrlFormat(),
      overall: 'healthy',
      recommendations: []
    };

    // Determine overall health
    const errors = Object.values(results)
      .filter(test => typeof test === 'object' && test.status === 'error').length;
    const warnings = Object.values(results)
      .filter(test => typeof test === 'object' && test.status === 'warning').length;

    if (errors > 1) {
      results.overall = 'critical';
    } else if (errors > 0 || warnings > 1) {
      results.overall = 'degraded';
    }

    // Generate recommendations
    results.recommendations = this.generateRecommendations(results);

    return results;
  }

  private async testConnectivity(): Promise<N8nWebhookTest> {
    const testId = `connectivity_${Date.now()}`;
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(this.baseUrl, {
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

      this.testHistory.push(test);
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

      this.testHistory.push(test);
      return test;
    }
  }

  private async testCorsConfiguration(): Promise<N8nWebhookTest> {
    const testId = `cors_${Date.now()}`;
    const startTime = performance.now();

    try {
      const response = await fetch(this.baseUrl, {
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

      this.testHistory.push(test);
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

      this.testHistory.push(test);
      return test;
    }
  }

  private async testPostRequest(): Promise<N8nWebhookTest> {
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
      const response = await fetch(this.baseUrl, {
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

      this.testHistory.push(test);
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

      this.testHistory.push(test);
      return test;
    }
  }

  private validateUrlFormat(): N8nWebhookTest {
    const testId = `url_validation_${Date.now()}`;

    try {
      const url = new URL(this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const hasWebhookPath = url.pathname.includes('/webhook/');
      const isN8nDomain = url.hostname.includes('n8n') || url.hostname.includes('elestio');

      let status: 'success' | 'warning' | 'error' = 'success';
      let errorMessage = '';

      if (!isHttps) {
        status = 'warning';
        errorMessage = 'HTTP instead of HTTPS detected';
      }

      if (!hasWebhookPath && !isN8nDomain) {
        status = 'warning';
        errorMessage = 'URL format may not be a standard N8N webhook';
      }

      return {
        id: testId,
        timestamp: new Date().toISOString(),
        status: status,
        responseTime: 0,
        testPayload: { url: this.baseUrl },
        response: {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          isHttps: isHttps,
          hasWebhookPath: hasWebhookPath,
          isN8nDomain: isN8nDomain
        },
        errorMessage: errorMessage || undefined
      };

    } catch (error) {
      return {
        id: testId,
        timestamp: new Date().toISOString(),
        status: 'error',
        responseTime: 0,
        errorMessage: 'Invalid URL format',
        testPayload: { url: this.baseUrl }
      };
    }
  }

  private generateRecommendations(results: N8nDiagnosticResult): string[] {
    const recommendations: string[] = [];

    if (results.connectivity.status === 'error') {
      recommendations.push('Check if your N8N instance is running and accessible');
      recommendations.push('Verify the webhook URL is correct');
    }

    if (results.cors.status === 'warning') {
      recommendations.push('Consider configuring CORS headers in your N8N webhook');
    }

    if (results.postRequest.status === 'error') {
      recommendations.push('Verify your N8N workflow accepts POST requests');
      recommendations.push('Check if the webhook node is properly configured');
    }

    if (results.urlValidation.status === 'warning') {
      recommendations.push('Consider using HTTPS for better security');
      recommendations.push('Verify the webhook URL format matches N8N standards');
    }

    if (recommendations.length === 0) {
      recommendations.push('Your N8N integration is working well!');
      recommendations.push('Consider enabling logging in your workflow for debugging');
    }

    return recommendations;
  }

  getTestHistory(): N8nWebhookTest[] {
    return this.testHistory.slice(-10); // Return last 10 tests
  }

  clearTestHistory(): void {
    this.testHistory = [];
  }
}
