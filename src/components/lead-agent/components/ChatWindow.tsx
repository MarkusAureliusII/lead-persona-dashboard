
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { ChatHeader } from './ChatHeader';

interface ChatWindowProps {
  isFullscreen: boolean;
  position: string;
  theme: string;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  isLoading: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

export function ChatWindow({
  isFullscreen,
  position,
  theme,
  connectionStatus,
  isLoading,
  onToggleFullscreen,
  onClose,
  chatContainerRef
}: ChatWindowProps) {
  return (
    <div className={`
      fixed z-40 transition-all duration-300 ease-in-out
      ${isFullscreen 
        ? 'inset-0 bg-white' 
        : `${position.includes('right') ? 'right-6' : 'left-6'} 
           ${position.includes('bottom') ? 'bottom-24' : 'top-24'}
           w-96 h-[600px]`
      }
    `}>
      <Card className={`
        h-full flex flex-col shadow-2xl
        ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white'}
      `}>
        <ChatHeader
          theme={theme}
          connectionStatus={connectionStatus}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          onClose={onClose}
        />

        {/* Chat Container */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Chat wird geladen...
                </p>
              </div>
            </div>
          ) : connectionStatus === 'error' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Verbindung zum Chat-Service fehlgeschlagen
                </p>
                <Button 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Erneut versuchen
                </Button>
              </div>
            </div>
          ) : (
            <div 
              ref={chatContainerRef} 
              className="h-full"
              style={{
                '--chat--color-primary': '#4f46e5',
                '--chat--color-secondary': '#10b981',
                '--chat--border-radius': '12px',
                '--chat--message--border-radius': '16px'
              } as React.CSSProperties}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
