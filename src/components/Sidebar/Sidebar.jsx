import React, { useState } from 'react';
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
  Badge
} from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconSparkles
} from '@tabler/icons-react';
import './Sidebar.scss';

const Sidebar = ({
  data = [],
  title = "Navigation",
  collapsed = false,
  onToggle,
  width = 300,
  collapsedWidth = 80,
  loading = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onToggle) {
      onToggle(newCollapsed);
    }
  };

  const handleRedirect = (redirectTo) => {
    if (redirectTo) {
      // Check if it's an external URL
      if (redirectTo.startsWith('http')) {
        window.open(redirectTo, '_blank');
      } else {
        // Internal route
        navigate(redirectTo);
      }
    }
  };

  const isActive = (redirectTo) => {
    return location.pathname === redirectTo;
  };

  const renderNavItem = (item, index) => {
    const active = isActive(item.redirectTo);
    
    const navButton = (
      <UnstyledButton
        key={index}
        className={`sidebar__nav-item ${active ? 'sidebar__nav-item--active' : ''}`}
        onClick={() => handleRedirect(item.redirectTo)}
        w="100%"
        disabled={loading}
      >
        <Group gap="md" wrap="nowrap" align="center">
          <Box className="sidebar__nav-icon">
            {item.icon}
          </Box>
          {!isCollapsed && (
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
          {!isCollapsed && item.badge && (
            <Badge 
              className="sidebar__nav-badge"
              size="sm"
              variant="filled"
            >
              {item.badge}
            </Badge>
          )}
        </Group>
      </UnstyledButton>
    );

    // Wrap with tooltip when collapsed
    if (isCollapsed) {
      return (
        <Tooltip
          key={index}
          label={
            <Box>
              <Text size="sm" fw={600}>{item.name}</Text>
              {item.description && (
                <Text size="xs" c="dimmed">{item.description}</Text>
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
    return (
      <Box key={sectionIndex} className="sidebar__section">
        {!isCollapsed && section.title && (
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
              className="sidebar__nav-item"
              h={isCollapsed ? 48 : 60}
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
        <IconSparkles size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
        <Text c="dimmed" ta="center" size="sm">
          No navigation items
        </Text>
      </Box>
    );
  };

  return (
    <Box
      className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${loading ? 'sidebar--loading' : ''}`}
      w={isCollapsed ? collapsedWidth : width}
      h="100vh"
    >
      {/* Header */}
      <Group className="sidebar__header" justify="space-between" p="lg">
        {!isCollapsed && (
          <Text className="sidebar__title" fw={700} size="lg">
            {title}
          </Text>
        )}
        <ActionIcon
          variant="subtle"
          className="sidebar__toggle"
          onClick={handleToggle}
          size="md"
          disabled={loading}
        >
          {isCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
        </ActionIcon>
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

      {/* Footer */}
      {!isCollapsed && (
        <Box className="sidebar__footer" p="lg">
          <Text size="xs" c="dimmed" ta="center" fw={500}>
            © 2025 Prepalyze
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
