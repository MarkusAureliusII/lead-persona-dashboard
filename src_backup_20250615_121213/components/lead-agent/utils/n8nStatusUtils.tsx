
import { Settings, TestTube, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ConnectionStatus } from "../hooks/useN8nConnectionTest";

export function getStatusIcon(status: ConnectionStatus) {
  switch (status) {
    case 'testing':
      return <TestTube className="w-4 h-4 animate-spin text-blue-500" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Settings className="w-4 h-4 text-gray-500" />;
  }
}

export function getStatusColor(status: ConnectionStatus): string {
  switch (status) {
    case 'success':
      return 'border-green-200 bg-green-50';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50';
    case 'error':
      return 'border-red-200 bg-red-50';
    case 'testing':
      return 'border-blue-200 bg-blue-50';
    default:
      return 'border-gray-200 bg-white';
  }
}
