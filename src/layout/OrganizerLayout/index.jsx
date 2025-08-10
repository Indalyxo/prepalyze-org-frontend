import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Title } from "@mantine/core";
import {
  IconContract,
  IconDashboard,
  IconQuestionMark,
} from "@tabler/icons-react";

import Sidebar, { MobileSidebarTrigger } from "../../components/Sidebar/Sidebar";

import "./oragnizer-layout.scss";
import { useMediaQuery } from "@mantine/hooks";

const OrganizerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    {
      name: "Intellihub",
      icon: <IconDashboard />,
      redirectTo: "/organization/",
      description: "Your Performance Zone",
    },
    {
      name: "Question",
      icon: <IconQuestionMark />,
      redirectTo: "/organization/question",
      description: "Your Question Zone",
    },
    {
      name: "Tests",
      icon: <IconContract />,
      redirectTo: "/organization/tests",
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
