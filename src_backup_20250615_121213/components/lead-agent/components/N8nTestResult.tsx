
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { TestResult } from "../hooks/useN8nConnectionTest";

interface N8nTestResultProps {
  testResult: TestResult;
}

export function N8nTestResult({ testResult }: N8nTestResultProps) {
  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColors = () => {
    switch (testResult.status) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          details: 'text-green-700'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          title: 'text-yellow-800',
          details: 'text-yellow-700'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          title: 'text-red-800',
          details: 'text-red-700'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          title: 'text-gray-800',
          details: 'text-gray-700'
        };
    }
  };

  const colors = getStatusColors();

  return (
    <div className={`p-4 rounded-lg border ${colors.container}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${colors.title}`}>
            {testResult.message}
            {testResult.responseType && (
              <span className="ml-2 text-xs bg-white px-2 py-1 rounded border">
                {testResult.responseType}
              </span>
            )}
          </p>
          {testResult.details && (
            <p className={`text-sm mt-1 ${colors.details}`}>
              {testResult.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
