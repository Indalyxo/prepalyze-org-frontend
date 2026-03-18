import { Card, Text, Group, Badge, Stack, Flex, Button, Skeleton } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../../../context/auth-store.js";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../utils/api.jsx";
import "./leaderboard.scss";

const getRankIcon = (rank) => {
  switch (rank) {
    case 1: return <Trophy size={20} color="#FFD700" strokeWidth={2.5} />;
    case 2: return <Medal size={20} color="#C0C0C0" strokeWidth={2.5} />;
    case 3: return <Medal size={20} color="#CD7F32" strokeWidth={2.5} />;
    default: return <Award size={20} color="#8C8C8C" />;
  }
};

const getScoreBadgeColor = (rank) => {
  switch (rank) {
    case 1: return "#FFD700";
    case 2: return "#C0C0C0";
    case 3: return "#CD7F32";
    default: return "#4A90E2";
  }
};

const getRankSuffix = (rank) => {
  const j = rank % 10, k = rank % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
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
        <div className="leaderboard-header">
          <Skeleton height={40} width={300} mx="auto" radius="md" />
          <Skeleton height={20} width={400} mx="auto" mt={16} radius="sm" />
        </div>

        <div className="leaderboard-content" style={{ opacity: 0.6 }}>
          <Card className="featured-card" radius="xl">
            <Stack align="center" gap="xl">
              <Skeleton height={36} width={120} radius="xl" />
              <Skeleton circle height={160} width={160} />
              <Group gap="xs">
                {[1, 2, 3].map((i) => <Skeleton key={i} height={32} width={32} radius="xl" />)}
              </Group>
              <Skeleton height={30} width={180} radius="sm" />
              <Skeleton height={80} width={120} radius="md" />
            </Stack>
          </Card>

          <Stack className="leaderboard-list" gap="md">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="leaderboard-item" radius="lg">
                <Group justify="space-between" align="center">
                  <Group gap="lg">
                    <Skeleton height={45} width={45} radius="md" />
                    <Skeleton height={55} width={55} radius="md" />
                    <Stack gap="xs">
                      <Skeleton height={20} width={140} radius="sm" />
                      <Skeleton height={14} width={80} radius="sm" />
                    </Stack>
                  </Group>
                  <Skeleton height={40} width={100} radius="md" />
                </Group>
              </Card>
            ))}
          </Stack>
        </div>
      </div>
    );
  }

  if (error || !data?.success) return <div className="leaderboard-container"><Text c="red" ta="center">Failed to load leaderboard</Text></div>;

  const leaderboardData = data.data || [];
  const topPerformer = leaderboardData[0];

  if (leaderboardData.length === 0) return <div className="leaderboard-container"><Text ta="center">No data available yet</Text></div>;

  return (
    <motion.div 
      className="leaderboard-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="leaderboard-header" variants={itemVariants}>
        <Text className="leaderboard-title">STUDENT LEADERBOARD</Text>
        <Text className="leaderboard-subtitle">
          Celebrating excellence: Our top performers in the latest assessment.
        </Text>
      </motion.div>

      <div className="leaderboard-content">
        <AnimatePresence>
          {topPerformer && (
            <motion.div
              layoutId="top-performer"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card className="featured-card" radius="xl">
                <Stack align="center" gap="lg">
                  <Badge
                    className="rank-badge"
                    variant="gradient"
                    gradient={{ from: "#FFD700", to: "#FFA500", deg: 45 }}
                    size="xl"
                    radius="md"
                    leftSection={<Crown size={16} />}
                  >
                    1<sup>st</sup> POSITION
                  </Badge>

                  <div className="profile-circle-container">
                    <img
                      src={user?.organization?.logoUrl || user?.organization?.logo}
                      alt={`${topPerformer.name}`}
                      className="profile-circle"
                    />
                  </div>

                  <Group className="stars" gap="xs">
                    {[1, 2, 3].map((star) => (
                      <IconStar key={star} size={28} fill="#FFD700" color="#FFD700" />
                    ))}
                  </Group>

                  <Text className="featured-name" fw={800} ta="center">
                    {topPerformer.name}
                  </Text>

                  <div className="featured-score">
                    <Text className="score-number" size="5rem" fw={900} ta="center">
                      {topPerformer.score}
                    </Text>
                    <Text ta="center" fw={600} c="dimmed" style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: '10px' }}>
                      Performance Points
                    </Text>
                  </div>
                </Stack>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="leaderboard-list" variants={containerVariants}>
          {leaderboardData.slice(1).filter(Boolean).map((student, index) => (
            <motion.div
              key={student.rank}
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <Card
                className={`leaderboard-item rank-${student.rank}`}
                radius="lg"
              >
                <Group justify="space-between" align="center">
                  <Group gap="xl" align="center">
                    <div className="rank-number-box">
                      <Text size="xl" fw={800} className="rank-text">
                        {student.rank}
                      </Text>
                      <Text className="rank-suffix">
                        {getRankSuffix(student.rank)}
                      </Text>
                    </div>

                    <img
                      src={user?.organization?.logoUrl || user?.organization?.logo}
                      alt={student.name}
                      className="profile-placeholder"
                    />

                    <Stack gap={4}>
                      <Text className="entry-name" fw={700}>
                        {student.name}
                      </Text>
                      <Group gap="xs">
                        {getRankIcon(student.rank)}
                        <Text className="duration" fw={600}>
                          {student.time}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Badge
                    className="score-badge"
                    style={{ backgroundColor: getScoreBadgeColor(student.rank) }}
                    size="xl"
                    radius="md"
                  >
                    <Text fw={900} size="lg" style={{ color: student.rank <= 3 ? '#000' : '#fff' }}>
                      {student.score}
                    </Text>
                  </Badge>
                </Group>
              </Card>
            </motion.div>
          ))}

          <motion.div 
            variants={itemVariants} 
            className="flex-center"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
          >
            <Button
              className="view-button"
              onClick={() => navigate("/organization/leaderboard")}
              leftSection={<Award size={18} />}
            >
              View Full Leaderboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

