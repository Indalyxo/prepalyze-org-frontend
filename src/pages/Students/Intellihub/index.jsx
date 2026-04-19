import React from "react";
import { Container, Title, Text, Stack, Box, Group, SimpleGrid, Paper, ThemeIcon } from "@mantine/core";
import { IconRocket, IconTarget, IconFlame, IconBook } from "@tabler/icons-react";
import StudentProgressChart from "./StudentProgressChart/StudentProgressChart";
import IntellihubHeader from "../../Organization/components/IntellihubHeader";
import useAuthStore from "../../../context/auth-store";
import { useNavigate } from "react-router-dom";
import "./student-intellihub.scss";

const StudentIntellihub = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard-content-area">
      <Container size="xxl" py="xl">
        <Stack gap={40}>
          {/* Welcome Section */}
          <Box className="welcome-hero">
            <Group justify="space-between" align="flex-end">
              <Stack gap={4}>
                <Text size="sm" fw={700} c="blue.6" style={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {today}
                </Text>
                <Title order={1} className="hero-title" style={{ fontSize: '2.8rem', letterSpacing: '-0.02em', fontWeight: 900 }}>
                  Ready to excel, {user?.name?.split(' ')[0] || "Student"}?
                </Title>
                <Text c="dimmed" size="lg" fw={500} style={{ maxWidth: '600px' }}>
                  Track your progress, challenge yourself with new exams, and master your subjects.
                </Text>
              </Stack>
              
              <Group gap="md" visibleFrom="md">
                <Box className="stat-quick-card">
                  <Text size="xs" fw={700} c="dimmed">STREAK</Text>
                  <Group gap={4}>
                    <IconFlame size={16} color="var(--mantine-color-orange-6)" />
                    <Text size="xl" fw={900}>5 Days</Text>
                  </Group>
                </Box>
              </Group>
            </Group>
          </Box>

          {/* Student Quick Actions */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/student/exams")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconRocket size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Active Exams</Text>
                  <Text size="xs" c="dimmed">Continue your assessments</Text>
                </div>
              </Group>
            </Paper>
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/student/calendar")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="teal">
                  <IconTarget size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Schedule</Text>
                  <Text size="xs" c="dimmed">View upcoming tests</Text>
                </div>
              </Group>
            </Paper>
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/student/exams")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="indigo">
                  <IconBook size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Practice Zone</Text>
                  <Text size="xs" c="dimmed">Review previous topics</Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          <IntellihubHeader />
          <StudentProgressChart />
        </Stack>
      </Container>
    </div>
  );
};

export default StudentIntellihub;
