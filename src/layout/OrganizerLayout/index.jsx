import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Title } from "@mantine/core";
import { IconCalendarBolt, IconContract, IconDashboard, IconUsers } from "@tabler/icons-react";

import Sidebar, {
  MobileSidebarTrigger,
} from "../../components/Sidebar/Sidebar";

import "./oragnizer-layout.scss";
import { useMediaQuery } from "@mantine/hooks";
import useAuthStore from "../../context/auth-store";

const OrganizerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { settings } = useAuthStore();

  const navItems = [
    {
      name: "Intellihub",
      icon: <IconDashboard />,
      redirectTo: "/organization/",
      description: "Your Performance Zone",
    },
    {
      name: "Groups",
      icon: <IconUsers />,
      redirectTo: "/organization/group",
      description: "Your Group Management Area",
    },
    {
      name: "Calendar",
      icon: <IconCalendarBolt />,
      redirectTo: "/organization/calendar",
      description: "Your Calendar",
    },
    {
      name: "Exams",
      icon: <IconContract />,
      redirectTo: "/organization/exams",
      description: "Your Assessment Zone",
    },

  ];
  return (
    <AppShell
      navbar={{
        width: isMobile ? 0 : sidebarCollapsed ? 80 : 300,
        breakpoint: 0,
      }}
      header={{ height: isMobile ? 60 : 0 }}
    >
      {isMobile && (
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <MobileSidebarTrigger onToggle={() => setMobileSidebarOpen(true)} />
            <Title order={4}>Prepalyze</Title>
            <div /> {/* Spacer */}
          </Group>
        </AppShell.Header>
      )}
      <AppShell.Navbar p={0}>
        <Sidebar
          data={navItems}
          title="Organizer Zone"
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={setMobileSidebarOpen}
          width={300}
          collapsedWidth={80}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default OrganizerLayout;
