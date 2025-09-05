import React from "react";
import { Card, Text, Group, Stack, Badge, Skeleton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";

const getScoreBadgeColor = (rank) => {
  if (rank === 1) return "#4A90E2";
  if (rank === 2) return "#5BA3F5";
  if (rank === 3) return "#20B2AA";
  if (rank <= 5) return "#52C41A";
  return "#8C8C8C";
};

export default function Index() {
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get("/api/intellihub/leaderboard", {
        params: { limit: 5 },
      });
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_LEADERBOARD_VIEW"],
    queryFn: fetchLeaderboard,
  });

  const handleCardClick = (id) => {
    navigate(`/organization/student/${id}`);
  };
  console.log({ data, isLoading, error });
  if (isLoading) {
    return (
      <div style={{ padding: 20 }}>
        <Text size="xl" fw={700} mb="md">
          Full Leaderboard
        </Text>
        <Stack gap="sm">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} withBorder radius="lg">
              <Group justify="space-between">
                <Group gap="md">
                  <Skeleton height={20} width={20} />
                  <Stack gap={4}>
                    <Skeleton height={16} width={120} />
                  </Stack>
                </Group>
                <Skeleton height={24} width={60} radius="xl" />
              </Group>
            </Card>
          ))}
        </Stack>
      </div>
    );
  }

  if (error) return <div>Failed to load leaderboard</div>;

  return (
    <div style={{ padding: 20 }}>
      <Text size="xl" fw={700} mb="md">
        Full Leaderboard
      </Text>
      <Stack gap="sm">
        {data?.map((s) => (
          <Card
            key={s._id}
            withBorder
            radius="lg"
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick(s._id)}
          >
            <Group justify="space-between">
              <Group gap="md">
                <Text fw={700}>{s.rank}</Text>
                <Stack gap={0}>
                  <Text fw={600}>{s.name}</Text>
                </Stack>
              </Group>
              <Badge
                size="lg"
                style={{ backgroundColor: getScoreBadgeColor(s.rank) }}
              >
                {s.score}
              </Badge>
            </Group>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
