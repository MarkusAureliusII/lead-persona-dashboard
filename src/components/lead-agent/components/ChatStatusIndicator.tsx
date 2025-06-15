
import React from 'react';

interface ChatStatusIndicatorProps {
  status: 'idle' | 'connecting' | 'connected' | 'error';
}

export function ChatStatusIndicator({ status }: ChatStatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()}`} />
  );
}
