import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Group, Title } from "@mantine/core";
import {
  IconCalendarBolt,
  IconContract,
  IconDashboard,
} from "@tabler/icons-react";

import Sidebar, {
  MobileSidebarTrigger,
} from "../../components/Sidebar/Sidebar";

import "./student-layout.scss";
import useAuthStore from "../../context/auth-store";
import { useMediaQuery } from "@mantine/hooks";

const StudentLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isAuthenticated || user?.role !== "student") {
    return null;
  }

  const navItems = [
    {
      name: "Intellihub",
      icon: <IconDashboard />,
      redirectTo: "/student",
      description: "Your Performance Zone",
    },
    {
      name: "Exams",
      icon: <IconContract />,
      redirectTo: "/student/exams",
      description: "Your Exam Zone",
    },
    {
      name: "Calendar",
      icon: <IconCalendarBolt />,
      redirectTo: "/student/calendar",
      description: "Your Calendar",
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
            <MobileSidebarTrigger
              onToggle={() => setMobileSidebarOpen(true)}
            />
            <Title order={4}>Prepalyze</Title>
            <div />
          </Group>
        </AppShell.Header>
      )}
      <AppShell.Navbar p={0}>
        <Sidebar
          data={navItems}
          title="Student Zone"
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

export default StudentLayout;