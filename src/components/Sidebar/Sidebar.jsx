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
  Button,
  Portal,
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
} from "@tabler/icons-react";
import "./Sidebar.scss";

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
  const [isMobileOpen, setIsMobileOpen] = useState(mobileOpen);
  const { logout } = useAuthStore();

  // Handle mobile state changes
  useEffect(() => {
    if (onMobileToggle) {
      onMobileToggle(isMobileOpen);
    }
  }, [isMobileOpen, onMobileToggle]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobile && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobile, isMobileOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isMobileOpen]);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      if (onToggle) {
        onToggle(newCollapsed);
      }
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleRedirect = (redirectTo) => {
    if (redirectTo) {
      // Close mobile sidebar when navigating
      if (isMobile) {
        setIsMobileOpen(false);
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
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (redirectTo) => {
    return location.pathname === redirectTo;
  };

  const renderNavItem = (item, index) => {
    const active = isActive(item.redirectTo);
    const showCollapsed = !isMobile && isCollapsed;
    
    const navButton = (
      <UnstyledButton
        key={index}
        className={`sidebar__nav-item ${
          active ? "sidebar__nav-item--active" : ""
        }`}
        onClick={() => handleRedirect(item.redirectTo)}
        w="100%"
        disabled={loading}
      >
        <Group gap="md" wrap="nowrap" align="center">
          <Box className="sidebar__nav-icon">{item.icon}</Box>
          {!showCollapsed && (
            <Box className="sidebar__nav-content" style={{ flex: 1 }}>
              <Text className="sidebar__nav-name" size="sm">
                {item.name}
              </Text>
              {item.description && (
                <Text size="xs" className="sidebar__nav-description">
                  {item.description}
                </Text>
              )}
            </Box>
          )}
          {!showCollapsed && item.badge && (
            <Badge className="sidebar__nav-badge" size="sm" variant="filled">
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
      <Box key={sectionIndex} className="sidebar__section">
        {!showCollapsed && section.title && (
          <>
            <Text className="sidebar__section-title" size="xs">
              {section.title}
            </Text>
            <Divider className="sidebar__section-divider" />
          </>
        )}
        <Stack gap="xs" className="sidebar__section-items">
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
              className="sidebar__nav-item sidebar__nav-item--loading"
              h={(!isMobile && isCollapsed) ? 48 : 60}
            />
          ))}
        </Stack>
      );
    }

    // Handle array of sections
    if (Array.isArray(data) && data.length > 0 && data[0].items) {
      return (
        <Stack gap="xl">
          {data.map((section, index) => renderSection(section, index))}
        </Stack>
      );
    }

    // Handle flat array of items
    if (Array.isArray(data)) {
      return (
        <Box className="sidebar__section">
          <Stack gap="xs" className="sidebar__section-items">
            {data.map((item, index) => renderNavItem(item, index))}
          </Stack>
        </Box>
      );
    }

    // Handle single item
    if (data.name) {
      return (
        <Box className="sidebar__section">
          <Stack gap="xs" className="sidebar__section-items">
            {renderNavItem(data, 0)}
          </Stack>
        </Box>
      );
    }

    return (
      <Box className="sidebar__empty">
        <IconSparkles size={48} className="sidebar__empty-icon" />
        <Text c="dimmed" ta="center" size="sm">
          No navigation items
        </Text>
      </Box>
    );
  };

  const sidebarContent = (
    <Box
      className={`sidebar ${
        !isMobile && isCollapsed ? "sidebar--collapsed" : ""
      } ${loading ? "sidebar--loading" : ""} ${
        isMobile && isMobileOpen ? "sidebar--mobile-open" : ""
      }`}
      w={
        isMobile 
          ? 280 
          : (!isMobile && isCollapsed) 
            ? collapsedWidth 
            : width
      }
      h="100vh"
    >
      {/* Header */}
      <Group className="sidebar__header" justify="space-between" p="lg">
        {(!isCollapsed || isMobile) && (
          <Text className="sidebar__title" fw={700} size="lg">
            {title}
          </Text>
        )}
        
        {/* Desktop toggle button */}
        {!isMobile && (
          <ActionIcon
            variant="subtle"
            className="sidebar__toggle"
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
        {isMobile && (
          <ActionIcon
            variant="subtle"
            className="sidebar__close-btn"
            onClick={() => setIsMobileOpen(false)}
            size="md"
            aria-label="Close sidebar"
          >
            <IconX size={20} />
          </ActionIcon>
        )}
      </Group>

      {/* Content */}
      <ScrollArea
        className="sidebar__content"
        h="calc(100vh - 140px)"
        scrollbarSize={4}
        scrollHideDelay={1000}
      >
        <Box p="lg" pt="md">
          {renderContent()}
        </Box>
      </ScrollArea>

      {/* Logout Button */}
      <Box p="lg" pt={0}>
        <Button
          onClick={handleLogout}
          className="sidebar__logout-btn"
          variant="subtle"
          leftSection={<IconLogout size={18} />}
          fullWidth={isMobile || !isCollapsed}
          size={(!isMobile && isCollapsed) ? "sm" : "md"}
        >
          {(isMobile || !isCollapsed) && "Logout"}
        </Button>
      </Box>

      {/* Footer */}
      <Box
        className={`sidebar__footer ${
          (!isMobile && isCollapsed) ? "sidebar__footer--collapsed" : ""
        }`}
        p="lg"
      >
        {(isMobile || !isCollapsed) && (
          <Text size="xs" c="dimmed" ta="center" fw={500} mt="sm">
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
        <Portal>
          <div
            className={`sidebar-overlay ${
              isMobileOpen ? "sidebar-overlay--visible" : ""
            }`}
            onClick={handleOverlayClick}
          />
        </Portal>
        
        {/* Sidebar content */}
        {sidebarContent}
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
      className={`mobile-sidebar-trigger ${className}`}
      aria-label="Open sidebar"
    >
      <IconMenu2 size={24} />
    </ActionIcon>
  );
};

export default Sidebar;