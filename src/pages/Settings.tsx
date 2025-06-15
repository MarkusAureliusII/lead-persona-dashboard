
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PersonalizationSettings } from "@/components/settings/PersonalizationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { N8nChatSettings } from "@/components/settings/N8nChatSettings";
import { LeadProcessingSettings } from "@/components/settings/LeadProcessingSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="container mx-auto max-w-4xl">
              <SettingsHeader
                title="Einstellungen"
                description="Verwalte deine Account-Präferenzen und Integrationen."
              />

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="processing">Lead Processing</TabsTrigger>
                  <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
                  <TabsTrigger value="integrations">Integrationen</TabsTrigger>
                  <TabsTrigger value="personalization">Personalisierung</TabsTrigger>
                  <TabsTrigger value="chat">Chat Widget</TabsTrigger>
                  <TabsTrigger value="privacy">Datenschutz</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <ProfileSettings />
                </TabsContent>

                <TabsContent value="processing">
                  <LeadProcessingSettings />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>

                <TabsContent value="integrations">
                  <IntegrationSettings />
                </TabsContent>

                <TabsContent value="personalization">
                  <PersonalizationSettings />
                </TabsContent>

                <TabsContent value="chat">
                  <N8nChatSettings />
                </TabsContent>

                <TabsContent value="privacy">
                  <PrivacySettings />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
