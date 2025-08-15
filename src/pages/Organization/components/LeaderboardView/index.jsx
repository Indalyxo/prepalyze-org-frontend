import React from "react";
import { Card, Text, Group, Stack, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom"; // for navigation

const students = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, // unique id
  rank: i + 1,
  name: `Student ${i + 1}`,
  title: `Grade ${10 + (i % 3)}`,
  time: `${(8 + (i % 5))}:${(10 + i) % 60}min`,
  score: 300 - i * 5,
}));

const getScoreBadgeColor = (rank) => {
  if (rank === 1) return "#4A90E2";
  if (rank === 2) return "#5BA3F5";
  if (rank === 3) return "#20B2AA";
  if (rank <= 5) return "#52C41A";
  return "#8C8C8C";
};

export default function Index() {
  const navigate = useNavigate();

 const handleCardClick = (id) => {
  navigate(`/organization/student/${id}`); // absolute path with /organization
};


  return (
    <div style={{ padding: 20 }}>
      <Text size="xl" fw={700} mb="md">Full Leaderboard</Text>
      <Stack gap="sm">
        {students.map((s) => (
          <Card
            key={s.id}
            withBorder
            radius="lg"
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick(s.id)}
          >
            <Group justify="space-between">
              <Group gap="md">
                <Text fw={700}>{s.rank}</Text>
                <Stack gap={0}>
                  <Text fw={600}>{s.name}</Text>
                  <Text size="sm" c="dimmed">{s.title} • {s.time}</Text>
                </Stack>
              </Group>
              <Badge size="lg" style={{ backgroundColor: getScoreBadgeColor(s.rank) }}>
                {s.score}
              </Badge>
            </Group>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
