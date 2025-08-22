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
import { IconMail, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import apiClient from "../../utils/api";

const Notification = () => {
  const [opened, setOpened] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotification();
  }, [])

  const fetchNotification = async () => { 
    try {
        const response = await apiClient.get("/notifications");
        setNotifications(response.data.data);
        console.log("Fetched notifications:", response.data.data);
    } catch (error) {
        console.error(error);
        toast.error("Failed to fetch notifications");
    }
   }

  const handleCardClick = (section, id) => {
    // Mark notification as seen
    const updated = { ...notifications };
    updated[section] = updated[section].map((item) =>
      item.id === id ? { ...item, seen: true } : item
    );
    setNotifications(updated);

    // Open modal
    const selected =
      updated.today.find((item) => item.id === id) ||
      updated.yesterday.find((item) => item.id === id);

    setSelectedNotification(selected);
    setOpened(true);
  };

  const renderSection = (title, section) => (
    <div style={{ textAlign: "left" }}>
      <Title order={4} mb="sm">
        {title}
      </Title>
      <Stack px={"lg"} py={"md"} spacing="sm">
        {notifications?.[section]?.map((item) => (
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
                <div dangerouslySetInnerHTML={{ __html: item.message }} />
              </div>
            </Group>
          </Card>
        ))}
      </Stack>
    </div>
  );

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
      {renderSection("Today", "today")}
      <Divider my="lg" />
      {renderSection("Yesterday", "yesterday")}

      {/* Popup Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton
        centered
        size="md"
        title={selectedNotification?.title}
      >
        <Text size="sm" mb="xs" c="dimmed">
          {selectedNotification?.description}
        </Text>
        <Text>{selectedNotification?.details}</Text>
      </Modal>
    </div>
  );
};

export default Notification;
