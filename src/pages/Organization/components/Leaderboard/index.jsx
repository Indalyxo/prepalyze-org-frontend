import { Card, Text, Group, Badge, Stack, Flex, Button, Skeleton } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import useAuthStore from "../../../../context/auth-store.js";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../utils/api.jsx";
import "./leaderboard.scss";

const getScoreBadgeColor = (rank) => {
  switch (rank) {
    case 1: return "#4A90E2";
    case 2: return "#5BA3F5";
    case 3: return "#20B2AA";
    case 4: return "#48CAE4";
    case 5: return "#52C41A";
    default: return "#8C8C8C";
  }
};

const getRankSuffix = (rank) => {
  switch (rank) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export default function Leaderboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    const response = await apiClient.get("/api/intellihub/leaderboard", {
      params: { limit: 5 }
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_LEADERBOARD"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) {
    return (
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <Skeleton height={24} width={220} radius="sm" />
          <Skeleton height={16} width={320} mt={8} radius="sm" />
        </div>

        <div className="leaderboard-content">
          {/* Left Panel - Top Performer Skeleton */}
          <Card className="featured-card" radius="xl" shadow="lg">
            <Stack align="center" gap="md">
              <Skeleton height={30} width={100} radius="xl" />
              <Skeleton circle height={120} width={120} />
              <Group className="stars" gap="xs">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={24} width={24} radius="xl" />
                ))}
              </Group>
              <Skeleton height={20} width={140} radius="sm" />
              <Skeleton height={40} width={80} radius="sm" />
            </Stack>
          </Card>

          {/* Right Panel - Rankings List Skeleton */}
          <Stack className="leaderboard-list" gap="sm">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="leaderboard-item" radius="lg" shadow="sm" withBorder>
                <Group justify="space-between" align="center">
                  <Group gap="md" align="center">
                    <Skeleton height={30} width={30} radius="md" />
                    <Skeleton circle height={40} width={40} />
                    <Stack gap="xs">
                      <Skeleton height={16} width={100} radius="sm" />
                      <Skeleton height={12} width={60} radius="sm" />
                    </Stack>
                  </Group>
                  <Skeleton height={24} width={60} radius="md" />
                </Group>
              </Card>
            ))}

            <Flex justify="center" mt="md" w="100%">
              <Skeleton height={36} width={120} radius="md" />
            </Flex>
          </Stack>
        </div>
      </div>
    );
  }

  if (error || !data?.success) return <div>Failed to load leaderboard</div>;

  const leaderboardData = data.data || [];
  const topPerformer = leaderboardData[0];

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header">
        <Text className="leaderboard-title">STUDENT LEADERBOARD</Text>
        <Text className="leaderboard-subtitle">
          Top performing students based on their latest assessment scores.
        </Text>
      </div>

      <div className="leaderboard-content">
        {/* Left Panel - Top Performer */}
        {topPerformer && (
          <Card className="featured-card" radius="xl" shadow="lg">
            <Stack align="center" gap="md">
              <Badge
                className="rank-badge"
                style={{ backgroundColor: "#4A90E2" }}
                size="lg"
                radius="xl"
              >
                1<sup>st</sup> Rank
              </Badge>

              <img
                src={user?.organization?.logoUrl || user?.organization?.logo}
                alt={`${topPerformer.name}'s profile`}
                className="profile-circle"
              />

              <Group className="stars" gap="xs">
                {[1, 2, 3].map((star) => (
                  <IconStar key={star} size={24} fill="#FFD700" color="#FFD700" />
                ))}
              </Group>

              <Stack align="center" gap="xs">
                <Text className="featured-name" fw={700}>
                  {topPerformer.name}
                </Text>
              </Stack>

              <div className="featured-score">
                <Text className="score-number" size="4rem" fw={700}>
                  {topPerformer.score}
                </Text>
                <Text c="dimmed" size="sm">
                  Points
                </Text>
              </div>
            </Stack>
          </Card>
        )}

        {/* Right Panel - Rankings List */}
        <Stack className="leaderboard-list" gap="sm">
          {leaderboardData.slice(1).map((student) => (
            <Card
              key={student.rank}
              className="leaderboard-item"
              radius="lg"
              shadow="sm"
              withBorder
            >
              <Group justify="space-between" align="center">
                <Group gap="md" align="center">
                  <div className="rank-number">
                    <Text size="xl" fw={700} c="dimmed">
                      {student.rank}
                    </Text>
                    <Text size="xs" className="rank-suffix">
                      {getRankSuffix(student.rank)}
                    </Text>
                  </div>

                  <img
                    src={user?.organization?.logoUrl || user?.organization?.logo}
                    alt={`${student.name}'s avatar`}
                    className="profile-placeholder"
                  />

                  <Stack gap="xs">
                    <Text className="entry-name" fw={600} size="md">
                      {student.name}
                    </Text>
                    <Group gap="md">
                      <Text className="duration" size="sm">
                        {student.time}
                      </Text>
                    </Group>
                  </Stack>
                </Group>

                <Stack align="center" gap="xs">
                  <Badge
                    className="score-badge"
                    style={{ backgroundColor: getScoreBadgeColor(student.rank) }}
                    size="lg"
                    radius="md"
                  >
                    <Stack align="center" gap={2}>
                      <Text fw={700} size="lg">
                        {student.score}
                      </Text>
                    </Stack>
                  </Badge>
                </Stack>
              </Group>
            </Card>
          ))}

          <Flex justify="center" mt="md" w="100%">
            <Button
              className="view-button"
              onClick={() => navigate("/organization/leaderboard")}
            >
              View All
            </Button>
          </Flex>
        </Stack>
      </div>
    </div>
  );
}
