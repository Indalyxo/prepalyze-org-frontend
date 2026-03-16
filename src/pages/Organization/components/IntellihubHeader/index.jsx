import React, { useEffect, useState } from "react";
import {
  Paper,
  Title,
  Text,
  Group,
  SimpleGrid,
  ThemeIcon,
  Skeleton,
  Stack,
  Box,
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

import { motion } from "framer-motion";

const IntellihubHeader = ({ layout = "horizontal" }) => {
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

  const isVertical = layout === "vertical";

  if (isLoading) {
    return (
      <div className={`${isVertical ? "vertical-stats" : "dashboard-header-section"}`}>
        {isVertical ? (
          <Stack gap="md" p="md">
            {[...Array(4)].map((_, index) => (
              <Paper key={index} shadow="sm" p="md" className="stat-card" radius="lg">
                <Group justify="space-between" wrap="nowrap">
                  <div style={{ flex: 1 }}>
                    <Skeleton height={14} width="60%" mb="xs" />
                    <Skeleton height={20} width="40%" />
                  </div>
                  <Skeleton height={44} width={44} radius="md" />
                </Group>
              </Paper>
            ))}
          </Stack>
        ) : (
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {[...Array(4)].map((_, index) => (
              <Paper key={index} shadow="sm" p="md" className="stat-card" radius="lg">
                <Group justify="space-between" wrap="nowrap">
                  <div style={{ flex: 1 }}>
                    <Skeleton height={14} width="60%" mb="xs" />
                    <Skeleton height={20} width="40%" mb="xs" />
                    <Skeleton height={12} width="80%" />
                  </div>
                  <Skeleton height={44} width={44} radius="md" />
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: isVertical ? -20 : 0, y: isVertical ? 0 : 20 },
    show: { opacity: 1, x: 0, y: 0 }
  };

  const content = headerData.map((stat) => {
    const matchedIcon = examStatusIcons.find(
      (icon) => icon.key === stat?.title?.toLowerCase()
    );
    const IconComponent = matchedIcon?.icon;
    const color = `var(--mantine-color-${matchedIcon?.color || 'blue'}-filled)`;
    const glow = `var(--mantine-color-${matchedIcon?.color || 'blue'}-filled-hover)`;
    
    // Map Mantine colors to RGB for custom transparency in SCSS
    const colorRGB = matchedIcon?.color === 'green' ? '64, 192, 87' : 
                     matchedIcon?.color === 'blue' ? '34, 139, 230' :
                     matchedIcon?.color === 'orange' ? '253, 126, 20' : '34, 139, 230';

    return (
      <motion.div key={stat.title} variants={item}>
        <Paper 
          p="md" 
          className="stat-card" 
          style={{ 
            '--stat-color': color,
            '--stat-glow': glow,
            '--stat-color-rgb': colorRGB
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Text
                c="dimmed"
                size="xs"
                tt="uppercase"
                fw={800}
                lts={1.5}
                style={{ opacity: 0.8 }}
              >
                {stat.title}
              </Text>
              <Text size="28px" fw={900} mt={2} style={{ letterSpacing: -1, fontFamily: 'Outfit, sans-serif' }}>
                {stat.count}
              </Text>
            </Box>
            <Box className="icon-container" style={{ width: 48, height: 48, borderRadius: 12 }}>
              {IconComponent ? <IconComponent size={24} stroke={2.5} /> : null}
            </Box>
          </Group>
        </Paper>
      </motion.div>
    );
  });

  return (
    <div className={`${isVertical ? "vertical-stats" : "dashboard-header-section"}`}>
      {isVertical ? (
        <motion.div variants={container} initial="hidden" animate="show">
          <Stack gap="lg" p="md">
            <Text fw={900} size="xs" c="dimmed" tt="uppercase" px="xs" mb={-10} lts={2.5}>Analytics</Text>
            {content}
          </Stack>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          <SimpleGrid
            cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
            spacing="xl"
          >
            {content}
          </SimpleGrid>
        </motion.div>
      )}
    </div>
  );
};

export default IntellihubHeader;