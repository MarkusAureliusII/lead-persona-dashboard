
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X } from 'lucide-react';
import { ChatStatusIndicator } from './ChatStatusIndicator';

interface ChatToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount: number;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  theme: string;
  position: string;
}

export function ChatToggleButton({
  isOpen,
  onToggle,
  unreadCount,
  connectionStatus,
  theme,
  position
}: ChatToggleButtonProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <div className="relative">
        <Button
          onClick={onToggle}
          size="lg"
          className={`
            rounded-full h-14 w-14 shadow-lg transition-all duration-300 transform hover:scale-110
            ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
            ${isOpen ? 'rotate-180' : ''}
          `}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}

        {/* Connection Status Indicator */}
        <ChatStatusIndicator status={connectionStatus} />
      </div>
    </div>
  );
}
