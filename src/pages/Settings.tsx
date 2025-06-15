
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useEmbedConfig } from "@/hooks/useEmbedConfig";
import { useN8nWidgetConfig } from "@/hooks/useN8nWidgetConfig";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { N8nIntegrationSettings } from "@/components/settings/N8nIntegrationSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PersonalizationSettings } from "@/components/settings/PersonalizationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";

const Settings = () => {
  const { embedUrl, handleEmbedUrlChange } = useEmbedConfig();
  const {
    isWidgetEnabled,
    widgetUrl,
    customizations,
    handleWidgetEnabledChange,
    handleWidgetUrlChange,
    handleCustomizationsChange
  } = useN8nWidgetConfig();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-4xl">
              <SettingsHeader
                title="Settings"
                description="Manage your account, preferences, and integrations."
              />

              <div className="space-y-8">
                <N8nIntegrationSettings
                  embedUrl={embedUrl}
                  onEmbedUrlChange={handleEmbedUrlChange}
                  isWidgetEnabled={isWidgetEnabled}
                  widgetUrl={widgetUrl}
                  onWidgetUrlChange={handleWidgetUrlChange}
                  onWidgetEnabledChange={handleWidgetEnabledChange}
                  customizations={customizations}
                  onCustomizationsChange={handleCustomizationsChange}
                />

                <ProfileSettings />
                <NotificationSettings />
                <PersonalizationSettings />
                <PrivacySettings />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
