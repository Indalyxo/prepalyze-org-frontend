import React from "react"
import { Overlay, Text, Group, Stack, Box, ActionIcon } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

const ModalFrame = ({
  opened,
  onClose,
  title,
  subtitle,
  children,
  sidebarContent,
  showHeader = true,
  headerContent,
}) => {
  const defaultHeaderContent = (
    <Group justify="space-between" mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
      <Group gap="md">
        <Box
          style={{
            width: 32,
            height: 32,
            backgroundColor: "var(--mantine-color-dark-8)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="sm" fw={700} c="white">
            S
          </Text>
        </Box>
        <Text size="lg" fw={600}>
          StudySmart
        </Text>
      </Group>

      <Group gap="lg">
        <Text size="sm" c="dimmed">
          Dashboard
        </Text>
        <Text size="sm" c="dimmed">
          Courses
        </Text>
        <Text size="sm" c="dimmed">
          Exams
        </Text>
        <Text size="sm" c="dimmed">
          Resources
        </Text>
        <Text size="sm" c="dimmed">
          Community
        </Text>
      </Group>
    </Group>
  )

  const defaultSidebarContent = (
    <Stack gap="lg" style={{ height: "100%" }}>
      <Group justify="space-between" align="center">
        <Text size="lg" fw={600} c="white">
          Options
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={onClose}
          style={{ color: "white" }}
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
      <Text size="sm" c="gray.3">
        Additional options and controls can be placed here.
      </Text>
    </Stack>
  )

  if (!opened) return null

  return (
    <>
      <Overlay color="#000" backgroundOpacity={0.55} onClick={onClose} />

      <Box
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          maxWidth: "1200px",
          height: "85vh",
          maxHeight: "800px",
          display: "flex",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "var(--mantine-shadow-xl)",
          zIndex: 1000,
        }}
      >
        {/* Left Section - Main Content (White Background) */}
        <Box
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          {/* Header Section */}
          {showHeader && (headerContent || defaultHeaderContent)}

          {/* Title Section */}
          {(title || subtitle) && (
            <Stack gap={4} mb="xl">
              {title && (
                <Text size="2rem" fw={600} c="dark">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text size="md" c="dimmed">
                  {subtitle}
                </Text>
              )}
            </Stack>
          )}

          {/* Main Content */}
          {children}
        </Box>

        {/* Right Section - Sidebar (Dark Background) */}
        <Box
          style={{
            width: "320px",
            backgroundColor: "var(--mantine-color-dark-8)",
            padding: "1.5rem",
            borderLeft: "1px solid var(--mantine-color-gray-7)",
          }}
        >
          {sidebarContent || defaultSidebarContent}
        </Box>
      </Box>
    </>
  )
}

export default ModalFrame
