import { Container, Grid, Title, Text, Stack, Box, Group, SimpleGrid, Paper, ThemeIcon } from "@mantine/core";
import { IconPlus, IconUsers, IconBuilding, IconBusinessplan } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AverageMarksChart from "../components/AverageMarksChart";
import AverageTimeChart from "../components/AverageTimeChart";
import Leaderboard from "../components/Leaderboard";
import useAuthStore from "../../../context/auth-store";

import "./organization-intellihub.scss";
import IntellihubHeader from "../components/IntellihubHeader";

const OrganizationIntellihub = () => {
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
          {/* Welcome Hero Section */}
          <Box className="welcome-hero">
            <Group justify="space-between" align="flex-end">
              <Stack gap={4}>
                <Text size="sm" fw={700} c="blue.6" style={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {today}
                </Text>
                <Title order={1} className="hero-title" style={{ fontSize: '2.8rem', letterSpacing: '-0.02em', fontWeight: 900 }}>
                  Welcome back, {user?.organization?.name || "Organizer"}
                </Title>
                <Text c="dimmed" size="lg" fw={500} style={{ maxWidth: '600px' }}>
                  Your organization is growing! Here's a quick overview of your progress and key activities.
                </Text>
              </Stack>
              
              <Group gap="md" visibleFrom="md">
                <Box className="stat-quick-card">
                  <Text size="xs" fw={700} c="dimmed">ACTIVE EXAMS</Text>
                  <Text size="xl" fw={900}>24</Text>
                </Box>
                <Box className="stat-quick-card">
                  <Text size="xs" fw={700} c="dimmed">TOTAL STUDENTS</Text>
                  <Text size="xl" fw={900}>1,280</Text>
                </Box>
              </Group>
            </Group>
          </Box>

          {/* Quick Actions Grid */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/organization/exams?create=true")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconPlus size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Create Exam</Text>
                  <Text size="xs" c="dimmed">New assessment</Text>
                </div>
              </Group>
            </Paper>
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/organization/leaderboard")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="teal">
                  <IconUsers size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Manage Students</Text>
                  <Text size="xs" c="dimmed">View all profiles</Text>
                </div>
              </Group>
            </Paper>
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/organization/group")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="indigo">
                  <IconBuilding size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Batch Groups</Text>
                  <Text size="xs" c="dimmed">Organize classes</Text>
                </div>
              </Group>
            </Paper>
            <Paper className="quick-action-card" p="md" radius="lg" withBorder onClick={() => navigate("/organization/fees")}>
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                  <IconBusinessplan size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="sm">Fee Records</Text>
                  <Text size="xs" c="dimmed">Finance overview</Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          <Stack gap={40}>
            {/* Full width Leaderboard */}
            <Box>
              <Leaderboard />
            </Box>
            
            {/* Charts side-by-side */}
            <Grid gutter={32}>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Box className="chart-wrapper-card" p="xl" h="100%">
                  <Title order={3} mb="xl" size="h5" fw={700} c="dimmed" tt="uppercase" lts={1}>Performance Distribution</Title>
                  <AverageMarksChart />
                </Box>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Box className="chart-wrapper-card" p="xl" h="100%">
                  <Title order={3} mb="xl" size="h5" fw={700} c="dimmed" tt="uppercase" lts={1}>Time Management Analytics</Title>
                  <AverageTimeChart />
                </Box>
              </Grid.Col>
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};

export default OrganizationIntellihub;
