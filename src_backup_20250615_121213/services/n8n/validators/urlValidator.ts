
import { N8nWebhookTest } from '../types/diagnostics';

export class UrlValidatorService {
  validateUrlFormat(webhookUrl: string): N8nWebhookTest {
    const testId = `url_validation_${Date.now()}`;

    try {
      const url = new URL(webhookUrl);
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
        testPayload: { url: webhookUrl },
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
        testPayload: { url: webhookUrl }
      };
    }
  }
}
