
import React from 'react';
import { BasicConfiguration } from './components/BasicConfiguration';
import { DesignConfiguration } from './components/DesignConfiguration';
import { BehaviorConfiguration } from './components/BehaviorConfiguration';
import { StatusInformation } from './components/StatusInformation';

interface N8nChatConfigurationProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  isEnabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  customizations: {
    theme: string;
    position: string;
    welcomeMessage: string;
    language: string;
    autoOpen: boolean;
    showTypingIndicator: boolean;
    allowFileUpload: boolean;
  };
  onCustomizationsChange: (customizations: any) => void;
}

export function N8nChatConfiguration({
  webhookUrl,
  onWebhookUrlChange,
  isEnabled,
  onEnabledChange,
  customizations,
  onCustomizationsChange
}: N8nChatConfigurationProps) {
  
  const handleCustomizationChange = (key: string, value: any) => {
    onCustomizationsChange({
      ...customizations,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Grundkonfiguration */}
      <BasicConfiguration
        webhookUrl={webhookUrl}
        onWebhookUrlChange={onWebhookUrlChange}
        isEnabled={isEnabled}
        onEnabledChange={onEnabledChange}
        welcomeMessage={customizations.welcomeMessage}
        onWelcomeMessageChange={(message) => handleCustomizationChange('welcomeMessage', message)}
      />

      {/* Design & Darstellung */}
      <DesignConfiguration
        theme={customizations.theme}
        position={customizations.position}
        language={customizations.language}
        onThemeChange={(theme) => handleCustomizationChange('theme', theme)}
        onPositionChange={(position) => handleCustomizationChange('position', position)}
        onLanguageChange={(language) => handleCustomizationChange('language', language)}
      />

      {/* Verhalten & Features */}
      <BehaviorConfiguration
        autoOpen={customizations.autoOpen}
        showTypingIndicator={customizations.showTypingIndicator}
        allowFileUpload={customizations.allowFileUpload}
        onAutoOpenChange={(autoOpen) => handleCustomizationChange('autoOpen', autoOpen)}
        onShowTypingIndicatorChange={(showTypingIndicator) => handleCustomizationChange('showTypingIndicator', showTypingIndicator)}
        onAllowFileUploadChange={(allowFileUpload) => handleCustomizationChange('allowFileUpload', allowFileUpload)}
      />

      {/* Status & Informationen */}
      <StatusInformation
        isEnabled={isEnabled}
        webhookUrl={webhookUrl}
        theme={customizations.theme}
        position={customizations.position}
      />
    </div>
  );
}
