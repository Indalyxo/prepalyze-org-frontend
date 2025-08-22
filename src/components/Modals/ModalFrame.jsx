import React from "react";
import { Overlay, Text, Group, Stack, Box, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const ModalFrame = ({
  opened,
  onClose,
  title,
  subtitle,
  children,
  sidebarContent,
  showHeader = false,
  headerContent,
}) => {
  if (!opened) return null;

  return (
    <>
      {/* Overlay with blur */}
      <Overlay
        color="#000"
        backgroundOpacity={0.4}
        blur={6}
        onClick={onClose}
        style={{ zIndex: 999 }}
      />

      <Box
        className="modal-frame"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1)",
          width: "92vw",
          maxWidth: "1200px",
          height: "85vh",
          maxHeight: "800px",
          display: "flex",
          flexDirection: "row", // default desktop
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
          background: "white",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Left Section - Main Content */}
        <Box
          className="modal-main"
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          {showHeader && headerContent}

          {(title || subtitle) && (
            <Stack gap={4} mb="lg">
              {subtitle && (
                <Text size="sm" c="dimmed">
                  {subtitle}
                </Text>
              )}
            </Stack>
          )}

          {children}
        </Box>

        {/* Right Section - Sidebar */}
        <Box
          className="modal-sidebar"
          style={{
            width: "320px",
            backgroundColor: "var(--mantine-color-dark-7)",
            padding: "1.5rem",
            borderLeft: "1px solid var(--mantine-color-dark-5)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            {title && (
              <Text size="lg" fw={600} c="white">
                {title}
              </Text>
            )}
            <ActionIcon
              variant="light"
              color="gray"
              onClick={onClose}
              style={{ color: "white" }}
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          {sidebarContent && sidebarContent}
        </Box>
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .modal-frame {
              flex-direction: column;
              width: 95vw;
              height: 90vh;
            }
            .modal-main {
              padding: 1rem;
            }
            .modal-sidebar {
              width: 100%;
              border-left: none;
              border-top: 1px solid var(--mantine-color-dark-5);
              padding: 1rem;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
            .modal-sidebar h1,
            .modal-sidebar span,
            .modal-sidebar div {
              font-size: 1rem !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ModalFrame;
