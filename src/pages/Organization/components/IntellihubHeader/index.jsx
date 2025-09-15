import React, { useEffect, useState } from "react";
import {
  Paper,
  Title,
  Text,
  Group,
  SimpleGrid,
  ThemeIcon,
  Skeleton,
} from "@mantine/core";
import {
  IconClipboardList,
  IconClockHour4,
  IconPlayerPlay,
  IconListCheck,
  IconSum,
} from "@tabler/icons-react";
import useAuthStore from "../../../../context/auth-store";
import "./intellihub-header.scss";
import { toast } from "sonner";
import apiClient from "../../../../utils/api";

const examStatusIcons = [
  {
    key: "completed",
    label: "Completed",
    icon: IconClipboardList,
    color: "green",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    icon: IconClockHour4,
    color: "blue",
  },
  {
    key: "ongoing",
    label: "Ongoing",
    icon: IconPlayerPlay,
    color: "orange",
  },
  {
    key: "total",
    label: "Total",
    icon: IconSum,
    color: "gray",
  },
];

const IntellihubHeader = () => {
  const [headerData, setHeaderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/api/intellihub/exam-count`);
        // A safety check for the data structure
        if (response.data && Array.isArray(response.data.data)) {
          setHeaderData(response.data.data);
        } else {
          console.error("API returned an unexpected data format:", response.data);
          toast.error("Failed to parse progress data.");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="dashboard-header-section">
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          {[...Array(4)].map((_, index) => (
            <Paper key={index} shadow="sm" p="md" className="stat-card">
              <Group position="apart" noWrap>
                <div style={{ flex: 1 }}>
                  <Skeleton height={14} width="60%" mb="xs" />
                  <Skeleton height={20} width="40%" mb="xs" />
                  <Skeleton height={12} width="80%" />
                </div>
                <Skeleton height={40} width={40} radius="md" />
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </div>
    );
  }

  return (
    <div className="dashboard-header-section">
      <SimpleGrid
        cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {headerData.map((stat) => {
          const matchedIcon = examStatusIcons.find(
            (icon) => icon.key === stat.title.toLowerCase()
          );
          const IconComponent = matchedIcon?.icon;

          return (
            <Paper key={stat.title} shadow="sm" p="md" className="stat-card">
              <Group position="apart" noWrap>
                <div>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    {stat.title}
                  </Text>
                  <Text size="xl" weight={700} mt="xs">
                    {stat.count}
                  </Text>
                  <Text color="dimmed" size="sm" mt="xs">
                    {stat.description}
                  </Text>
                </div>
                <ThemeIcon
                  color={matchedIcon?.color}
                  variant="light"
                  size="xl"
                  radius="md"
                >
                  {IconComponent ? <IconComponent size={24} /> : null}
                </ThemeIcon>
              </Group>
            </Paper>
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default IntellihubHeader;