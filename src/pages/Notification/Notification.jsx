import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Title,
  Stack,
  Input,
  Divider,
  Modal,
  Badge,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBell,
  IconInfoCircle,
  IconMail,
  IconSearch,
  IconShieldExclamation,
} from "@tabler/icons-react";
import { toast } from "sonner";
import apiClient from "../../utils/api";
import NoData from "../../components/Generics/NoData";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../../components/Loading/LoadingPage";
import ModalFrame from "../../components/Modals/ModalFrame";
import { formatKey } from "../../utils/generals";

const notificationSidebarContent = {
  malpractice: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#ef4444", // red-500
      }}
    >
      <IconShieldExclamation size={28} />
      <span
        style={{
          fontSize: "1.5rem", // ~text-2xl
          fontWeight: 600,
        }}
      >
        Malpractice Detected
      </span>
    </div>
  ),
  info: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#3b82f6", // blue-500
      }}
    >
      <IconInfoCircle size={28} />
      <span
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        Just So You Know
      </span>
    </div>
  ),
  warning: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#f59e0b", // yellow-500
      }}
    >
      <IconAlertTriangle size={28} />
      <span
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        Heads Up!
      </span>
    </div>
  ),
};

const Notification = () => {
  const [opened, setOpened] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
  });
  const [count, setCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get("/notifications");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch notifications");
      throw error; // Re-throw to let React Query handle the error
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      const { count, success, ...notificationData } = data;
      setNotifications(notificationData.data || { today: [], yesterday: [] });
      setCount(count || 0);
    }
  }, [data]);

  console.log(count, notifications);

  const handleCardClick = (section, id) => {
    // Mark notification as seen
    const updated = { ...notifications };
    if (updated[section]) {
      updated[section] = updated[section].map((item) =>
        item.id === id ? { ...item, seen: true } : item
      );
      setNotifications(updated);

      // Find selected notification from the correct section
      const selected = updated[section].find((item) => item.id === id);

      if (selected) {
        setSelectedNotification(selected);
        setOpened(true);
      }
    }
  };

  const renderSection = (title, section) => {
    const sectionData = notifications?.[section];

    // Don't render section if no data
    if (!sectionData || sectionData.length === 0) {
      return null;
    }

    return (
      <div style={{ textAlign: "left" }}>
        <Title order={4} mb="sm">
          {title}
        </Title>
        <Stack px="lg" py="md" spacing="sm">
          {sectionData.map((item) => (
            <Card
              key={item.id}
              shadow="xs"
              radius="md"
              withBorder
              padding="md"
              onClick={() => handleCardClick(section, item.id)}
              style={{
                cursor: "pointer",
                backgroundColor: item.seen
                  ? "white"
                  : "var(--mantine-color-gray-0)",
              }}
            >
              <Group align="center" spacing="md" noWrap>
                <div
                  style={{
                    width: 30,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconMail
                    size={20}
                    color={item.seen ? "gray" : "var(--mantine-color-blue-6)"}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Text fw={item.seen ? 400 : 600}>
                    {item.title}{" "}
                    <Badge
                      size="xs"
                      color={item.seen ? "gray" : "blue"}
                      ml="xs"
                    >
                      {item.seen ? "Seen" : "Unseen"}
                    </Badge>
                  </Text>
                </div>
                <Text size="xs" color="dimmed">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Show error state
  if (error) {
    return <div>Error loading notifications. Please try again.</div>;
  }

  // Show no data if count is 0
  if (count === 0) {
    return (
      <NoData message="It looks like there's nothing here yet. Try adjusting your filters or come back later." />
    );
  }

  return (
    <div
      className="notification-container"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Search Bar */}
      <Input
        icon={<IconSearch size={18} />}
        placeholder="Search mail"
        radius="md"
        size="md"
        mb="lg"
      />

      {/* Sections */}
      {Object.keys(notifications).map((section, index, arr) => {
        const isNotEmpty = notifications?.[section]?.length > 0;
        const nextSection = arr[index + 1];
        const nextNotEmpty =
          nextSection && notifications?.[nextSection]?.length > 0;

        return (
          <React.Fragment key={section}>
            {renderSection(formatKey(section), section)}
            {isNotEmpty && nextNotEmpty && <Divider my="lg" />}
          </React.Fragment>
        );
      })}

      <ModalFrame
        opened={opened}
        onClose={() => setOpened(false)}
        title={selectedNotification?.title}
        subtitle={""}
        showHeader={true}
        headerContent={
          <Group spacing="sm">
            <IconBell size={28} color="#000" />
            <Title order={3} fw={700} c="dark">
              Notifications
            </Title>
          </Group>
        }
      >
        {selectedNotification?.message && (
          <div
            dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
          />
        )}
      </ModalFrame>
    </div>
  );
};

export default Notification;
