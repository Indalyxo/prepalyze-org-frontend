import { useState, useEffect } from "react";
import {
  Box,
  ScrollArea,
  Text,
  UnstyledButton,
  Tooltip,
  Divider,
  ActionIcon,
  Stack,
  Group,
  Badge,
  Portal,
  Avatar,
  Menu,
  Indicator,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import useAuthStore from "../../context/auth-store";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconSparkles,
  IconX,
  IconMenu2,
  IconUser,
  IconSettings,
  IconChevronDown,
  IconBell,
} from "@tabler/icons-react";
// import "./sidebar.scss";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/api";

const Sidebar = ({
  data = [],
  title = "Navigation",
  collapsed = false,
  onToggle,
  width = 300,
  collapsedWidth = 80,
  loading = false,
  mobileOpen = false,
  onMobileToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const { logout, user } = useAuthStore();

  const fetchNotificationCount = async () => {
    try {
      const notifications = await apiClient.get(`/notifications/count`);
      return notifications.data.count;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch notification count");
    }
  };

  const { data: notificationCount } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: fetchNotificationCount,
    enabled: !!user?.id && user?.role === "organizer",
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && mobileOpen && onMobileToggle) {
      onMobileToggle(false);
    }
  }, [location.pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobile && mobileOpen && onMobileToggle) {
        onMobileToggle(false);
      }
    };
    
    if (isMobile && mobileOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMobile, mobileOpen, onMobileToggle]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isMobile, mobileOpen]);

  const handleToggle = () => {
    if (isMobile && onMobileToggle) {
      onMobileToggle(!mobileOpen);
    } else {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      if (onToggle) {
        onToggle(newCollapsed);
      }
    }
  };

  const handleOverlayClick = () => {
    if (isMobile && mobileOpen && onMobileToggle) {
      onMobileToggle(false);
    }
  };

  const handleRedirect = (redirectTo) => {
    if (redirectTo) {
      // Close mobile sidebar when navigating
      if (isMobile && mobileOpen && onMobileToggle) {
        onMobileToggle(false);
      }
      // Check if it's an external URL
      if (redirectTo.startsWith("http")) {
        window.open(redirectTo, "_blank");
      } else {
        // Internal route
        navigate(redirectTo);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    if (isMobile && mobileOpen && onMobileToggle) {
      onMobileToggle(false);
    }
  };

  const handleProfileAction = (action) => {
    if (isMobile && mobileOpen && onMobileToggle) {
      onMobileToggle(false);
    }

    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/organization/settings");
        break;
      case "notifications":
        navigate("/organization/notification");
        break;
      default:
        break;
    }
  };

  const isActive = (redirectTo) => {
    return location.pathname === redirectTo;
  };

  const renderUserProfile = () => {
    const showCollapsed = !isMobile && isCollapsed;
    const userName = user?.name || user?.email || "User";
    const userRole = user?.role || "Member";
    const userAvatar =
      user?.organization?.logo || user?.organization?.logoUrl || null;
    const initials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    if (showCollapsed) {
      return (
        <Menu shadow="md" width={200} position="right-start" offset={10}>
          <Menu.Target>
            <UnstyledButton 
              style={{ 
                padding: '8px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Tooltip
                label={
                  <Box>
                    <Text size="sm" fw={600}>
                      {userName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {userRole}
                    </Text>
                  </Box>
                }
                position="right"
                withArrow
                offset={10}
              >
                {user?.role === "organizer" && notificationCount > 0 ? (
                  <Indicator
                    inline
                    size={16}
                    offset={4}
                    color="red"
                    label={notificationCount > 0 ? notificationCount : null}
                  >
                    <Avatar
                      src={userAvatar}
                      size="md"
                      radius="xl"
                    >
                      {initials}
                    </Avatar>
                  </Indicator>
                ) : (
                  <Avatar
                    src={userAvatar}
                    size="md"
                    radius="xl"
                  >
                    {initials}
                  </Avatar>
                )}
              </Tooltip>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconUser size={16} />}
              onClick={() => handleProfileAction("profile")}
            >
              View Profile
            </Menu.Item>
            {user?.role === "organizer" && (
              <>
                <Menu.Item
                  leftSection={<IconSettings size={16} />}
                  onClick={() => handleProfileAction("settings")}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconBell size={16} />}
                  onClick={() => handleProfileAction("notifications")}
                >
                  Notifications
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Menu shadow="md" width={280} position="bottom-start">
        <Menu.Target>
          <UnstyledButton 
            style={{
              padding: '12px',
              borderRadius: '8px',
              width: '100%',
              border: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <Group gap="md" wrap="nowrap" align="center" w="100%">
              {user?.role === "organizer" && notificationCount > 0 ? (
                <Indicator
                  inline
                  size={16}
                  offset={4}
                  color="red"
                  label={notificationCount > 0 ? notificationCount : null}
                >
                  <Avatar
                    src={userAvatar}
                    size="md"
                    radius="xl"
                  >
                    {initials}
                  </Avatar>
                </Indicator>
              ) : (
                <Avatar
                  src={userAvatar}
                  size="md"
                  radius="xl"
                >
                  {initials}
                </Avatar>
              )}
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={600} truncate>
                  {userName}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {userRole === "organizer" ? "Organization" : "Student"}
                </Text>
              </Box>
              <ActionIcon variant="subtle" size="sm">
                <IconChevronDown size={16} />
              </ActionIcon>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Actions</Menu.Label>
          {user?.role === "organizer" && (
            <>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => handleProfileAction("settings")}
              >
                Settings
              </Menu.Item>
              <Menu.Item
                leftSection={<IconBell size={16} />}
                onClick={() => handleProfileAction("notifications")}
              >
                Notifications
              </Menu.Item>
            </>
          )}
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            color="red"
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const renderNavItem = (item, index) => {
    const active = isActive(item.redirectTo);
    const showCollapsed = !isMobile && isCollapsed;

    const navButton = (
      <UnstyledButton
        key={index}
        onClick={() => handleRedirect(item.redirectTo)}
        w="100%"
        disabled={loading}
        style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: active ? 'var(--mantine-color-blue-0)' : 'transparent',
          border: active ? '1px solid var(--mantine-color-blue-3)' : '1px solid transparent',
          color: active ? 'var(--mantine-color-blue-7)' : 'inherit',
        }}
      >
        <Group gap="md" wrap="nowrap" align="center">
          <Box style={{ color: 'inherit' }}>{item.icon}</Box>
          {!showCollapsed && (
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={active ? 600 : 400}>
                {item.name}
              </Text>
              {item.description && (
                <Text size="xs" c="dimmed">
                  {item.description}
                </Text>
              )}
            </Box>
          )}
          {!showCollapsed && item.badge && (
            <Badge size="sm" variant="filled">
              {item.badge}
            </Badge>
          )}
        </Group>
      </UnstyledButton>
    );

    // Wrap with tooltip when collapsed (desktop only)
    if (showCollapsed) {
      return (
        <Tooltip
          key={index}
          label={
            <Box>
              <Text size="sm" fw={600}>
                {item.name}
              </Text>
              {item.description && (
                <Text size="xs" c="dimmed">
                  {item.description}
                </Text>
              )}
            </Box>
          }
          position="right"
          withArrow
          transitionProps={{ duration: 200 }}
          offset={10}
        >
          {navButton}
        </Tooltip>
      );
    }

    return navButton;
  };

  const renderSection = (section, sectionIndex) => {
    const showCollapsed = !isMobile && isCollapsed;

    return (
      <Box key={sectionIndex}>
        {!showCollapsed && section.title && (
          <>
            <Text size="xs" fw={600} c="dimmed" mb="sm" tt="uppercase">
              {section.title}
            </Text>
            <Divider mb="md" />
          </>
        )}
        <Stack gap="xs">
          {section.items.map((item, itemIndex) =>
            renderNavItem(item, `${sectionIndex}-${itemIndex}`)
          )}
        </Stack>
      </Box>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Stack gap="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Box
              key={index}
              style={{
                height: !isMobile && isCollapsed ? 48 : 60,
                backgroundColor: 'var(--mantine-color-gray-1)',
                borderRadius: '8px',
                opacity: 0.5,
              }}
            />
          ))}
        </Stack>
      );
    }

    // Handle array of sections
    if (Array.isArray(data) && data.length > 0 && data[0]?.items) {
      return (
        <Stack gap="xl">
          {data.map((section, index) => renderSection(section, index))}
        </Stack>
      );
    }

    // Handle flat array of items
    if (Array.isArray(data) && data.length > 0) {
      return (
        <Stack gap="xs">
          {data.map((item, index) => renderNavItem(item, index))}
        </Stack>
      );
    }

    // Handle single item
    if (data?.name) {
      return renderNavItem(data, 0);
    }

    return (
      <Box style={{ textAlign: 'center', padding: '40px 20px' }}>
        <IconSparkles size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
        <Text c="dimmed" size="sm">
          No navigation items
        </Text>
      </Box>
    );
  };

  const sidebarStyles = {
    width: isMobile ? 280 : (!isMobile && isCollapsed ? collapsedWidth : width),
    height: '100vh',
    backgroundColor: 'var(--mantine-color-white)',
    borderRight: '1px solid var(--mantine-color-gray-3)',
    display: 'flex',
    flexDirection: 'column',
  };

  const sidebarContent = (
    <Box style={sidebarStyles}>
      {/* Header */}
      <Group justify="space-between" p="lg" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        {(!isCollapsed || isMobile) && (
          <Text fw={700} size="lg">
            {title}
          </Text>
        )}

        {/* Desktop toggle button */}
        {!isMobile && (
          <ActionIcon
            variant="subtle"
            onClick={handleToggle}
            size="md"
            disabled={loading}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <IconChevronRight size={20} />
            ) : (
              <IconChevronLeft size={20} />
            )}
          </ActionIcon>
        )}

        {/* Mobile close button */}
        {isMobile && mobileOpen && (
          <ActionIcon
            variant="subtle"
            onClick={() => onMobileToggle?.(false)}
            size="md"
            aria-label="Close sidebar"
          >
            <IconX size={20} />
          </ActionIcon>
        )}
      </Group>

      {/* User Profile Section */}
      <Box p="lg" pb="md">
        {renderUserProfile()}
      </Box>

      {/* Content */}
      <ScrollArea
        style={{ flex: 1 }}
        scrollbarSize={4}
        scrollHideDelay={1000}
      >
        <Box p="lg" pt="md">
          {renderContent()}
        </Box>
      </ScrollArea>

      {/* Footer */}
      <Box p="lg" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        {(isMobile || !isCollapsed) && (
          <Text size="xs" c="dimmed" ta="center" fw={500}>
            © 2025 Prepalyze
          </Text>
        )}
      </Box>
    </Box>
  );

  // Mobile rendering with overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <Portal>
            <div
              onClick={handleOverlayClick}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
                opacity: mobileOpen ? 1 : 0,
                visibility: mobileOpen ? 'visible' : 'hidden',
                transition: 'opacity 0.3s ease, visibility 0.3s ease'
              }}
            />
          </Portal>
        )}

        {/* Sidebar content with proper positioning */}
        {mobileOpen && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 1000,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease'
              }}
            >
              {sidebarContent}
            </div>
          </Portal>
        )}
      </>
    );
  }

  // Desktop rendering
  return sidebarContent;
};

// Mobile trigger button component
export const MobileSidebarTrigger = ({ onToggle, className = "" }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isMobile) return null;

  return (
    <ActionIcon
      variant="subtle"
      onClick={onToggle}
      size="lg"
      className={className}
      aria-label="Open sidebar"
    >
      <IconMenu2 size={24} />
    </ActionIcon>
  );
};

export default Sidebar;