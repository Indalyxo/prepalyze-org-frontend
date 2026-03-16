import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Box, Group, ScrollArea, Title } from "@mantine/core";
import {
  IconCalendarBolt,
  IconContract,
  IconDashboard,
  IconMoneybag,
  IconUsers,
} from "@tabler/icons-react";

import Sidebar, {
  MobileSidebarTrigger,
} from "../../components/Sidebar/Sidebar";

import "./oragnizer-layout.scss";
import { useMediaQuery } from "@mantine/hooks";
import useAuthStore from "../../context/auth-store";

import IntellihubHeader from "../../pages/Organization/components/IntellihubHeader";

const OrganizerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobileMatch = useMediaQuery("(max-width: 768px)");
  const isMobile = isMobileMatch === true;
  const { user } = useAuthStore();

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
    {
      name: "Fees",
      icon: <IconMoneybag />,
      redirectTo: "/organization/fees",
      description: "Your Fees Zone",
    },
  ];

  return (
    <AppShell
      header={{ height: isMobile ? 60 : 64 }}
      navbar={{
        width: isMobile ? 0 : 280,
        breakpoint: "sm",
        collapsed: { mobile: !mobileSidebarOpen }
      }}
      padding="0"
    >
      <AppShell.Header h={isMobile ? 60 : 64} style={{ borderBottom: '1px solid var(--mantine-color-default-border)', background: 'transparent' }}>
        {isMobile ? (
          <Group h="100%" px="md" justify="space-between">
            <MobileSidebarTrigger onToggle={() => setMobileSidebarOpen(true)} />
            <Title order={4}>Prepalyze</Title>
            <div />
          </Group>
        ) : (
          <Sidebar
            data={navItems}
            title="Prepalyze"
            layout="horizontal"
          />
        )}
      </AppShell.Header>

      {!isMobile && (
        <AppShell.Navbar p={0} style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}>
          <ScrollArea h="calc(100vh - 64px)">
             <IntellihubHeader layout="vertical" />
          </ScrollArea>
        </AppShell.Navbar>
      )}

      {isMobile && (
        <Sidebar
          data={navItems}
          title="Organizer Zone"
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={(prop) => setMobileSidebarOpen(prop)}
          layout="vertical"
        />
      )}

      <AppShell.Main>
        <Box 
          p="xl" 
          style={{ 
            minHeight: 'calc(100vh - 64px)', 
            backgroundColor: 'var(--mantine-color-body)',
            backgroundImage: 'radial-gradient(circle at top right, rgba(var(--mantine-color-blue-6), 0.03), transparent 600px)',
            transition: 'all 0.3s ease'
          }}
        >
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default OrganizerLayout;
