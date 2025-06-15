
// Re-export from the refactored n8n module
export { N8nService } from './n8n';
export type { N8nWebhookPayload, N8nResponse } from './n8n';

// Ensure future imports reference the correct new property 'prompt'
// If you use N8nWebhookPayload elsewhere in the app, the correct type is now applied.
