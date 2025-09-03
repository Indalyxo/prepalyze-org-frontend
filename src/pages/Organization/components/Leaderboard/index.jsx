import { Card, Text, Group, Badge, Stack, Flex, Button } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import useAuthStore from "../../../../context/auth-store.js";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../utils/api.jsx";
import "./leaderboard.scss";

const getScoreBadgeColor = (rank) => {
  switch (rank) {
    case 1:
      return "#4A90E2";
    case 2:
      return "#5BA3F5";
    case 3:
      return "#20B2AA";
    case 4:
      return "#48CAE4";
    case 5:
      return "#52C41A";
    default:
      return "#8C8C8C";
  }
};

const getRankSuffix = (rank) => {
  switch (rank) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default function Leaderboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    const response = await apiClient.get("/api/intellihub/leaderboard");
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_LEADERBOARD"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) return <div>Loading...</div>;
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
              {/* Rank Badge */}
              <Badge
                className="rank-badge"
                style={{ backgroundColor: "#4A90E2" }}
                size="lg"
                radius="xl"
              >
                1<sup>st</sup> Rank
              </Badge>

              {/* Profile Circle Placeholder */}
              <img
                src={user?.organization?.logoUrl || user?.organization?.logo}
                alt={`${topPerformer.name}'s profile`}
                className="profile-circle"
              />

              {/* Stars */}
              <Group className="stars" gap="xs">
                {[1, 2, 3].map((star) => (
                  <IconStar
                    key={star}
                    size={24}
                    fill="#FFD700"
                    color="#FFD700"
                  />
                ))}
              </Group>

              {/* Name and Title */}
              <Stack align="center" gap="xs">
                <Text className="featured-name" fw={700}>
                  {topPerformer.name}
                </Text>
                {/* <Text className="featured-title" size="sm">
                  {topPerformer.title}
                </Text> */}
              </Stack>

              {/* Score */}
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
                {/* Left Side - Rank, Avatar, Info */}
                <Group gap="md" align="center">
                  {/* Rank */}
                  <div className="rank-number">
                    <Text size="xl" fw={700} c="dimmed">
                      {student.rank}
                    </Text>
                    <Text size="xs" className="rank-suffix">
                      {getRankSuffix(student.rank)}
                    </Text>
                  </div>

                  {/* Avatar Placeholder */}
                  <img
                    src={user?.organization?.logoUrl || user?.organization?.logo}
                    alt={`${student.name}'s avatar`}
                    className="profile-placeholder"
                  />

                  {/* Name and Info */}
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

                {/* Right Side - Score Badge */}
                <Stack align="center" gap="xs">
                  <Badge
                    className="score-badge"
                    style={{
                      backgroundColor: getScoreBadgeColor(student.rank),
                    }}
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
