import React from "react";
import { Card, Text, Group, Stack, Badge, Skeleton, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, Crown, User, TrendingUp } from "lucide-react";
import useAuthStore from "../../../../context/auth-store";
import "./leaderboard-view.scss";

const getRankIcon = (rank) => {
  switch (rank) {
    case 1: return <Crown size={32} color="#FFD700" fill="#FFD700" />;
    case 2: return <Trophy size={28} color="#C0C0C0" fill="#C0C0C0" />;
    case 3: return <Trophy size={26} color="#CD7F32" fill="#CD7F32" />;
    default: return <Award size={20} color="#4A90E2" />;
  }
};

const getRankSuffix = (rank) => {
  const j = rank % 10, k = rank % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const getRankLabel = (rank) => {
  if (rank <= 3) return "Elite Performer";
  if (rank <= 10) return "Top 10 Finalist";
  if (rank <= 20) return "Rising Star";
  return "Participant";
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function LeaderboardView() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const fetchLeaderboard = async () => {
    const response = await apiClient.get("/api/intellihub/leaderboard", {
      params: { limit: 20 },
    });
    return response.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_FULL_LEADERBOARD"],
    queryFn: fetchLeaderboard,
  });

  const handleCardClick = (id) => {
    navigate(`/organization/student/${id}`);
  };

  if (isLoading) {
    return (
      <div className="leaderboard-view-container">
        <div className="page-header">
          <Skeleton height={60} width={400} mx="auto" radius="md" />
          <Skeleton height={24} width={280} mx="auto" mt={16} radius="sm" />
        </div>
        <div className="hall-of-fame">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} height={i === 1 ? 480 : 400} radius="xl" />
          ))}
        </div>
        <Stack gap="md">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} height={80} radius="lg" />
          ))}
        </Stack>
      </div>
    );
  }

  if (error) return <div className="leaderboard-view-container"><Text c="red" ta="center">Failed to load leaderboard</Text></div>;

  const topThree = data?.slice(0, 3) || [];
  const remaining = data?.slice(3) || [];

  return (
    <motion.div 
      className="leaderboard-view-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="page-header" variants={itemVariants}>
        <Text className="page-title">Hall of Fame</Text>
        <Text className="page-subtitle">Celebrating the stars of our institution</Text>
      </motion.div>

      <div className="hall-of-fame">
        <AnimatePresence>
          {topThree.filter(Boolean).map((s) => (
            <motion.div
              key={s._id}
              className={`podium-card rank-${s.rank}`}
              variants={itemVariants}
              whileHover={{ y: -12, scale: s.rank === 1 ? 1.1 : 1.08 }}
              onClick={() => handleCardClick(s._id)}
              style={{ cursor: 'pointer' }}
            >
              {s.rank === 1 && <div className="rank-aura" />}
              
              <div className="podium-avatar-container">
                <img 
                  src={user?.organization?.logoUrl || user?.organization?.logo} 
                  alt={s.name} 
                  className={`podium-avatar rank-${s.rank}`}
                />
                <div className="rank-icon-wrapper">
                  {getRankIcon(s.rank)}
                </div>
              </div>
              
              <Text className="podium-name">{s.name}</Text>
              <Badge variant="light" size="lg" radius="sm" color={s.rank === 1 ? 'yellow' : 'gray'}>
                {s.rank}{getRankSuffix(s.rank)} Place
              </Badge>

              <div className="podium-score">
                <Text className="score-val">{s.score}</Text>
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                  Performance
                </Text>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div className="leaderboard-table-container" variants={containerVariants}>
        {remaining.filter(Boolean).map((s) => (
          <motion.div
            key={s._id}
            variants={itemVariants}
            whileHover={{ x: 10 }}
            onClick={() => handleCardClick(s._id)}
          >
            <Card className="leaderboard-row" radius="lg">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xl" wrap="nowrap">
                  <div className="cell-rank">
                    <div className="rank-pill">
                      <Text>{s.rank}</Text>
                    </div>
                  </div>

                  <div className="cell-user">
                    <img 
                      src={user?.organization?.logoUrl || user?.organization?.logo} 
                      alt={s.name} 
                      className="user-avatar"
                    />
                    <Stack gap={0}>
                      <Text className="user-name">{s.name}</Text>
                      <Group gap={4}>
                        <TrendingUp size={12} color="#4A90E2" />
                        <Text size="xs" c="dimmed" fw={600}>{getRankLabel(s.rank)}</Text>
                      </Group>
                    </Stack>
                  </div>
                </Group>

                <div className="cell-score">
                  <div className="score-badge-full">
                    {s.score}
                  </div>
                </div>
              </Group>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

