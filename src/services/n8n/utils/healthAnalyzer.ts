
import { N8nDiagnosticResult } from '../types/diagnostics';

export class HealthAnalyzer {
  analyzeOverallHealth(results: N8nDiagnosticResult): 'healthy' | 'degraded' | 'critical' {
    // Count errors and warnings from test results
    const testResults = [
      results.connectivity,
      results.cors,
      results.postRequest,
      results.urlValidation
    ];

    const errors = testResults.filter(test => test.status === 'error').length;
    const warnings = testResults.filter(test => test.status === 'warning').length;

    if (errors > 1) {
      return 'critical';
    } else if (errors > 0 || warnings > 1) {
      return 'degraded';
    }

    return 'healthy';
  }
}
