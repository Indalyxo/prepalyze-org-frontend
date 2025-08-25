import { Overlay, Text, Group, Stack, Box, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";

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
  // Fixed: Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && opened) {
        onClose();
      }
    };

    if (opened) {
      document.addEventListener('keydown', handleEscapeKey);
      // Fixed: Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [opened, onClose]);

  if (!opened) return null;

  // Fixed: Add click event handler to prevent modal from closing when clicking inside
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay with blur */}
      <Overlay
        color="#000"
        backgroundOpacity={0.4}
        blur={6}
        onClick={onClose}
        style={{
          zIndex: 299,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Box
        className="modal-frame invisible-scrollbar"
        onClick={handleModalClick} // Fixed: Prevent modal from closing when clicking inside
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92vw",
          maxWidth: "1200px",
          height: "81vh",
          maxHeight: "90vh", // Fixed: Add maxHeight to prevent overflow on small screens
          display: "flex",
          flexDirection: "row",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
          background: "white",
          zIndex: 300,
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Left Section - Main Content */}
        <Box
          className="modal-main modal-frame invisible-scrollbar"
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "2rem",
            overflowY: "auto",
            minHeight: 0, // Fixed: Allow flex child to shrink
          }}
        >
          {showHeader && headerContent}

          {(title || subtitle) && (
            <Stack gap={4} mb="lg">
              {title && ( // Fixed: Add title display in main content if needed
                <Text size="xl" fw={600}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text size="sm" c="dimmed">
                  {subtitle}
                </Text>
              )}
            </Stack>
          )}

          <Box style={{ minHeight: 0 }}> {/* Fixed: Ensure content area can scroll */}
            {children}
          </Box>
        </Box>

        {/* Right Section - Sidebar */}
        <Box
          className="modal-sidebar invisible-scrollbar"
          style={{
            width: "320px",
            minWidth: "320px", // Fixed: Prevent sidebar from shrinking too much
            backgroundColor: "var(--mantine-color-dark-7)",
            padding: "1.5rem",
            borderLeft: "1px solid var(--mantine-color-dark-5)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "auto", // Fixed: Add scroll to sidebar if content overflows
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            {title && (
              <Text size="lg" fw={600} c="white" style={{ flex: 1 }}> {/* Fixed: Allow title to take available space */}
                {title}
              </Text>
            )}
            <ActionIcon
              variant="light"
              color="gray"
              onClick={onClose}
              style={{ 
                color: "white",
                flexShrink: 0 // Fixed: Prevent close button from shrinking
              }}
              aria-label="Close modal" // Fixed: Add accessibility label
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Box style={{ flex: 1, minHeight: 0 }}> {/* Fixed: Allow sidebar content to scroll */}
            {sidebarContent}
          </Box>
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

          /* Fixed: Better scrollbar styling */
          .invisible-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .invisible-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .invisible-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
          }

          .invisible-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.4);
          }

          /* Fixed: Improved mobile responsiveness */
          @media (max-width: 768px) {
            .modal-frame {
              flex-direction: column !important;
              width: 95vw !important;
              height: 95vh !important;
              maxHeight: 95vh !important;
            }
            
            .modal-main {
              padding: 1rem !important;
              flex: 1 !important;
              minHeight: 0 !important;
            }
            
            .modal-sidebar {
              width: 100% !important;
              minWidth: unset !important;
              height: auto !important;
              max-height: 40% !important;
              border-left: none !important;
              border-top: 1px solid var(--mantine-color-dark-5) !important;
              padding: 1rem !important;
              flex: none !important;
            }
            
            .modal-sidebar > *:first-child {
              margin-bottom: 0.5rem !important;
            }
          }

          /* Fixed: Handle very small screens */
          @media (max-width: 480px) {
            .modal-frame {
              width: 100vw !important;
              height: 100vh !important;
              border-radius: 0 !important;
            }
            
            .modal-main {
              padding: 0.75rem !important;
            }
            
            .modal-sidebar {
              padding: 0.75rem !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ModalFrame;