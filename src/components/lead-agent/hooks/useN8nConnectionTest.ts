
import { useState } from 'react';

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error' | 'warning';

export interface TestResult {
  status: ConnectionStatus;
  message: string;
  details?: string;
}

export function useN8nConnectionTest() {
  const [testResult, setTestResult] = useState<TestResult>({
    status: 'idle',
    message: 'Not tested yet'
  });
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async (webhookUrl: string) => {
    if (!webhookUrl) {
      setTestResult({
        status: 'error',
        message: 'No webhook URL provided'
      });
      return;
    }

    setIsLoading(true);
    setTestResult({
      status: 'testing',
      message: 'Testing connection...'
    });

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setTestResult({
          status: 'success',
          message: 'Connection successful',
          details: `Status: ${response.status}`
        });
      } else {
        setTestResult({
          status: 'warning',
          message: 'Connection reached but returned error',
          details: `Status: ${response.status} - ${response.statusText}`
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    testResult,
    isLoading,
    testConnection
  };
}
