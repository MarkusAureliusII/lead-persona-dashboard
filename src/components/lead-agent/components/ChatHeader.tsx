
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Maximize2, Minimize2, X } from 'lucide-react';
import { ChatStatusIndicator } from './ChatStatusIndicator';

interface ChatHeaderProps {
  theme: string;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export function ChatHeader({
  theme,
  connectionStatus,
  isFullscreen,
  onToggleFullscreen,
  onClose
}: ChatHeaderProps) {
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Online';
      case 'connecting': return 'Verbinde...';
      default: return 'Offline';
    }
  };

  return (
    <div className={`
      flex items-center justify-between p-4 border-b
      ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
    `}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bot className="w-8 h-8 text-blue-600" />
          <ChatStatusIndicator status={connectionStatus} />
        </div>
        <div>
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            🐱 KI Lead Agent
          </h3>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {getStatusText()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleFullscreen}
          className="h-8 w-8 p-0"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
