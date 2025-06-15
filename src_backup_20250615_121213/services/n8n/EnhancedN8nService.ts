
import { N8nWebhookTest, N8nDiagnosticResult } from './types/diagnostics';
import { ConnectivityTestService } from './tests/connectivityTest';
import { CorsTestService } from './tests/corsTest';
import { PostRequestTestService } from './tests/postRequestTest';
import { UrlValidatorService } from './validators/urlValidator';
import { RecommendationGenerator } from './utils/recommendationGenerator';
import { HealthAnalyzer } from './utils/healthAnalyzer';

export class EnhancedN8nService {
  private baseUrl: string;
  private testHistory: N8nWebhookTest[] = [];
  
  // Service instances
  private connectivityTest: ConnectivityTestService;
  private corsTest: CorsTestService;
  private postRequestTest: PostRequestTestService;
  private urlValidator: UrlValidatorService;
  private recommendationGenerator: RecommendationGenerator;
  private healthAnalyzer: HealthAnalyzer;

  constructor(webhookUrl: string) {
    this.baseUrl = webhookUrl;
    
    // Initialize service instances
    this.connectivityTest = new ConnectivityTestService();
    this.corsTest = new CorsTestService();
    this.postRequestTest = new PostRequestTestService();
    this.urlValidator = new UrlValidatorService();
    this.recommendationGenerator = new RecommendationGenerator();
    this.healthAnalyzer = new HealthAnalyzer();
  }

  async runComprehensiveDiagnostics(): Promise<N8nDiagnosticResult> {
    const results: N8nDiagnosticResult = {
      connectivity: await this.connectivityTest.testConnectivity(this.baseUrl),
      cors: await this.corsTest.testCorsConfiguration(this.baseUrl),
      postRequest: await this.postRequestTest.testPostRequest(this.baseUrl),
      urlValidation: this.urlValidator.validateUrlFormat(this.baseUrl),
      overall: 'healthy',
      recommendations: []
    };

    // Store test results in history
    this.testHistory.push(results.connectivity);
    this.testHistory.push(results.cors);
    this.testHistory.push(results.postRequest);
    this.testHistory.push(results.urlValidation);

    // Analyze overall health
    results.overall = this.healthAnalyzer.analyzeOverallHealth(results);

    // Generate recommendations
    results.recommendations = this.recommendationGenerator.generateRecommendations(results);

    return results;
  }

  getTestHistory(): N8nWebhookTest[] {
    return this.testHistory.slice(-10); // Return last 10 tests
  }

  clearTestHistory(): void {
    this.testHistory = [];
  }
}

// Re-export types for backward compatibility
export type { N8nWebhookTest, N8nDiagnosticResult } from './types/diagnostics';
