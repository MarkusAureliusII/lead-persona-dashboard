
import {
  BarChart3,
  Bot,
  Settings,
  Home,
  Wand2,
  Zap,
  Database,
  Users,
  Inbox
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Lead Scraping",
    url: "/lead-agent",
    icon: Bot,
  },
  {
    title: "Posteingang",
    url: "/personalization",
    icon: Inbox,
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Scraping-Vorgänge",
    url: "/scraping-jobs",
    icon: Database,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: BarChart3,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Zap,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LeadPersonalizer</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-start space-x-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                  >
                    <a href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
