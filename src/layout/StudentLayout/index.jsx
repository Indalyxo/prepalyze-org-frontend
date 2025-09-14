import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { IconCalendarBolt, IconContract, IconDashboard } from "@tabler/icons-react";

import Sidebar from "../../components/Sidebar/Sidebar";

import "./student-layout.scss";
import useAuthStore from "../../context/auth-store";

const StudentLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

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
    }
  ];

  return (
    <AppShell
      navbar={{
        width: sidebarCollapsed ? 80 : 280,
        breakpoint: "sm",
      }}
    >
      <AppShell.Navbar>
        <Sidebar
          data={navItems}
          title="Student Zone"
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          width={280}
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
