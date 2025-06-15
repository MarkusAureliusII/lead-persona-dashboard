
import { N8nDiagnosticResult } from '../types/diagnostics';

export class RecommendationGenerator {
  generateRecommendations(results: N8nDiagnosticResult): string[] {
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
}
