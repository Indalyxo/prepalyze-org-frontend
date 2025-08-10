import React from 'react';
import { Paper, Title, Text, Badge, Group, Avatar, Stack } from '@mantine/core';
import { IconTrophy, IconMedal, IconAward } from '@tabler/icons-react';
import './leaderboard.scss';

const leaderboardData = [
  { rank: 1, name: "Sarah Johnson", score: 94, tests: 6, avatar: "SJ" },
  { rank: 2, name: "Mike Chen", score: 91, tests: 6, avatar: "MC" },
  { rank: 3, name: "Emma Davis", score: 89, tests: 6, avatar: "ED" },
  { rank: 4, name: "Alex Rodriguez", score: 87, tests: 5, avatar: "AR" },
  { rank: 5, name: "Lisa Wang", score: 85, tests: 6, avatar: "LW" },
  { rank: 6, name: "David Brown", score: 83, tests: 5, avatar: "DB" },
  { rank: 7, name: "Anna Wilson", score: 81, tests: 6, avatar: "AW" },
  { rank: 8, name: "Tom Miller", score: 79, tests: 4, avatar: "TM" },
];

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <IconTrophy size={24} stroke={1.5} />; // Slightly larger, thinner stroke
    case 2:
      return <IconMedal size={24} stroke={1.5} />;
    case 3:
      return <IconAward size={24} stroke={1.5} />;
    default:
      return <span className="rank-number">#{rank}</span>;
  }
};

const Leaderboard = () => {
  return (
    <Paper className="leaderboard-container" shadow="sm" p="md">
      <div className="leaderboard-header">
        <Title order={3}>Top Student Leaderboard</Title>
        <Text size="sm" color="dimmed">Rankings based on overall average scores.</Text>
      </div>
      <Stack spacing="sm">
        {leaderboardData.map((student) => (
          <div
            key={student.rank}
            className={`leaderboard-item rank-${student.rank}`} // Add specific rank class
          >
            <Group position="apart" align="center" noWrap>
              <Group align="center" spacing="md" noWrap>
                <div className="rank-icon-wrapper">
                  {getRankIcon(student.rank)}
                </div>
                <Avatar color="blue" radius="xl" size="md">
                  {student.avatar}
                </Avatar>
                <div>
                  <Text weight={500} size="md">{student.name}</Text>
                  <Text size="sm" color="dimmed">
                    {student.tests} tests completed
                  </Text>
                </div>
              </Group>
              <Badge
                variant={student.rank <= 3 ? "filled" : "light"}
                color={student.rank === 1 ? "yellow" : student.rank === 2 ? "gray" : student.rank === 3 ? "orange" : "blue"}
                size="lg"
                radius="sm"
              >
                {student.score}%
              </Badge>
            </Group>
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default Leaderboard;