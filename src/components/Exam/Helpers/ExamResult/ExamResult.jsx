import { useMemo, useState } from "react";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Grid,
  Progress,
  Badge,
  RingProgress,
  Tooltip,
  Divider,
  Paper,
  Loader,
  ThemeIcon,
  Alert,
  Avatar,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconClock,
  IconTarget,
  IconBulb,
  IconAlertCircle,
  IconCircleCheck as IconCheckCircle,
  IconX,
  IconUsers,
} from "@tabler/icons-react";
import styles from "./exam-result.module.scss";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../utils/api";
import BackButton from "../../../Generics/BackButton";
import useAuthStore from "../../../../context/auth-store";

function StatCard({
  label,
  value,
  subtext,
  color = "blue",
  rightSection,
  icon,
}) {
  return (
    <Card withBorder radius="md" padding="lg" className={styles.statCard}>
      <Group justify="space-between" align="flex-start" mb="xs">
        <Group gap="xs">
          {icon && (
            <ThemeIcon variant="light" color={color} size="sm">
              {icon}
            </ThemeIcon>
          )}
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
        </Group>
        {rightSection}
      </Group>
      <Text fw={700} fz="xl" className={styles.statValue}>
        {value}
      </Text>
      {subtext ? (
        <Text size="sm" c={color} mt={4} fw={500}>
          {subtext}
        </Text>
      ) : null}
    </Card>
  );
}

function MistakeDots({ answers = [] }) {
  return (
    <Group gap="xs" wrap="wrap" className={styles.mistakeDots}>
      {answers.map((a, idx) => {
        const color =
          a.isCorrect === false && a.selectedOption === null
            ? styles.eaDotGray
            : a.isCorrect
            ? styles.eaDotGreen
            : styles.eaDotRed;
        return (
          <Tooltip
            key={idx}
            label={`Question ${idx + 1} • ${
              a.isCorrect === false && a.selectedOption === null
                ? "Not Answered"
                : a.isCorrect
                ? "Correct"
                : "Incorrect"
            }`}
          >
            <span className={`${styles.eaDot} ${color}`} />
          </Tooltip>
        );
      })}
    </Group>
  );
}

function SectionCard({ section }) {
  const total =
    section.sectionCorrect + section.sectionWrong + section.sectionUnattempted;
  const correctPct = Math.round(
    (section.sectionCorrect / Math.max(1, total)) * 100
  );
  const color =
    correctPct >= 85
      ? "green"
      : correctPct >= 70
      ? "blue"
      : correctPct >= 50
      ? "yellow"
      : "red";

  return (
    <Card withBorder radius="md" padding="lg" className={styles.sectionCard}>
      <Group justify="space-between" mb="sm">
        <Title order={5} className={styles.sectionTitle}>
          {section.sectionName}
        </Title>
        <Badge variant="light" color={color} size="lg">
          {correctPct}% correct
        </Badge>
      </Group>
      <Group align="center" justify="space-between" wrap="wrap" gap="lg">
        <RingProgress
          size={120}
          thickness={12}
          sections={[{ value: section.sectionPercentage, color }]}
          label={
            <Stack gap={0} align="center">
              <Text fw={700} fz="lg">
                {section.sectionScore}
              </Text>
              <Text size="xs" c="dimmed">
                Score
              </Text>
            </Stack>
          }
        />
        <Stack gap="sm" style={{ minWidth: 220, flex: 1 }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed" fw={500}>
              Distribution
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {total} Q
            </Text>
          </Group>
          <Progress value={correctPct} color={color} size="md" />
          <Group gap="xs" wrap="wrap">
            <Badge color="green" variant="light">
              {section.sectionCorrect} correct
            </Badge>
            <Badge color="red" variant="light">
              {section.sectionWrong} incorrect
            </Badge>
            <Badge color="gray" variant="light">
              {section.sectionUnattempted} skipped
            </Badge>
          </Group>
        </Stack>
      </Group>
      {section.answers?.length ? (
        <>
          <Divider my="md" />
          <Stack gap="xs">
            <Text size="sm" c="dimmed" fw={500}>
              Answer Pattern
            </Text>
            <MistakeDots answers={section.answers} />
          </Stack>
        </>
      ) : null}
    </Card>
  );
}

function InsightsSection({ result }) {
  const insights = useMemo(() => {
    if (!result) return [];

    const { percentage, sections, metaCounts } = result;
    const timeSpent = Math.round(
      (new Date(result.submittedAt).getTime() -
        new Date(result.startedAt).getTime()) /
        60000
    );

    const insights = [];

    // Performance insight
    if (percentage >= 80) {
      insights.push({
        type: "positive",
        icon: <IconTrendingUp size={16} />,
        title: "Excellent Performance",
        description: `Outstanding score of ${percentage.toFixed(
          1
        )}%! You've demonstrated strong understanding across most topics.`,
      });
    } else if (percentage >= 60) {
      insights.push({
        type: "neutral",
        icon: <IconTarget size={16} />,
        title: "Good Foundation",
        description: `Solid performance at ${percentage.toFixed(
          1
        )}%. With focused practice, you can reach excellence.`,
      });
    } else {
      insights.push({
        type: "negative",
        icon: <IconAlertCircle size={16} />,
        title: "Needs Improvement",
        description: `Score of ${percentage.toFixed(
          1
        )}% indicates areas requiring significant attention and practice.`,
      });
    }

    // Subject strength/weakness
    const bestSection = sections.reduce((best, current) =>
      current.sectionPercentage > best.sectionPercentage ? current : best
    );
    const worstSection = sections.reduce((worst, current) =>
      current.sectionPercentage < worst.sectionPercentage ? current : worst
    );

    if (bestSection.sectionPercentage >= 80) {
      insights.push({
        type: "positive",
        icon: <IconCheckCircle size={16} />,
        title: `${bestSection.sectionName} Mastery`,
        description: `Excellent command in ${bestSection.sectionName} with ${bestSection.sectionPercentage}% accuracy. This is your strongest subject.`,
      });
    }

    if (worstSection.sectionPercentage < 70 && sections.length > 1) {
      insights.push({
        type: "negative",
        icon: <IconX size={16} />,
        title: `${worstSection.sectionName} Challenge`,
        description: `${worstSection.sectionName} needs attention with ${worstSection.sectionPercentage}% accuracy. Focus practice here for improvement.`,
      });
    }

    // Time management insight
    if (timeSpent <= 45) {
      insights.push({
        type: "positive",
        icon: <IconClock size={16} />,
        title: "Efficient Time Management",
        description: `Completed in ${timeSpent} minutes. Good pace management allows time for review and careful consideration.`,
      });
    } else if (timeSpent > 60) {
      insights.push({
        type: "neutral",
        icon: <IconClock size={16} />,
        title: "Time Optimization Needed",
        description: `Took ${timeSpent} minutes. Consider practicing time management strategies for better exam efficiency.`,
      });
    }

    // Strategy insight
    if (metaCounts.totalUnattempted === 0) {
      insights.push({
        type: "positive",
        icon: <IconBulb size={16} />,
        title: "Complete Attempt Strategy",
        description:
          "Attempted all questions showing good exam strategy. This maximizes your scoring potential.",
      });
    } else {
      insights.push({
        type: "neutral",
        icon: <IconBulb size={16} />,
        title: "Strategic Approach",
        description: `Left ${metaCounts.totalUnattempted} questions unattempted. Consider educated guessing to maximize scores.`,
      });
    }

    return insights.slice(0, 4); // Return only first 4 insights
  }, [result]);

  return (
    <Card withBorder radius="md" padding="lg" className={styles.insightsCard}>
      <Group mb="lg" align="center">
        <ThemeIcon variant="light" color="blue" size="lg">
          <IconBulb size={20} />
        </ThemeIcon>
        <Title order={4}>Performance Insights</Title>
      </Group>

      <Grid>
        {insights.map((insight, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
            <Alert
              variant="light"
              color={
                insight.type === "positive"
                  ? "green"
                  : insight.type === "negative"
                  ? "red"
                  : "blue"
              }
              icon={insight.icon}
              className={styles.insightAlert}
            >
              <Text fw={600} size="sm" mb={4}>
                {insight.title}
              </Text>
              <Text size="xs" c="dimmed">
                {insight.description}
              </Text>
            </Alert>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
}

export default function ExamResult({ primary = "blue", path = "student" }) {
  // Using mock data for demonstration
  const { examId } = useParams();
  const user = useAuthStore().user;
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const fetchAttendance = async (examId) => {
    try {
      const params = {};

      if (path === "organization") {
        params.userId = userId;
      }
      const res = await apiClient.get(`/api/exam/${examId}/attendance`, {
        params: params,
      });

      return res.data.result; // shape depends on backend response
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const {
    data: result,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useQuery({
    queryKey: ["attendance", examId],
    queryFn: () => fetchAttendance(examId),
    onError: () => toast.error("Failed to fetch attendance"),
  });

  const scoreColor = useMemo(() => {
    if (!result) return "gray";
    if (result.percentage >= 85) return "green";
    if (result.percentage >= 70) return "blue";
    if (result.percentage >= 50) return "yellow";
    return "red";
  }, [result]);

  const incorrectCount = useMemo(
    () => (result ? result.metaCounts.totalWrong : 0),
    [result]
  );

  const timeSpent = useMemo(() => {
    if (!result) return "N/A";
    const start = new Date(result.startedAt).getTime();
    const end = new Date(result.submittedAt).getTime();
    const durationInMinutes = Math.round((end - start) / 60000);
    return durationInMinutes;
  }, [result]);

  const isPassed = result?.percentage >= 50;
  const abspath = `/${
    user.role === "organizer" ? "organization" : "student"
  }/exams/details/${examId}`;

  if (isAttendanceLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="lg" />
      </div>
    );
  }

  if (result?.status === "absent") {
    return (
      <Container size="md" p="lg" className={styles.examAnalytics}>
        <BackButton path={abspath} />
        <Card withBorder radius="lg" padding="xl" shadow="sm">
          <Group justify="space-between" align="center" mb="lg">
            <Title order={2}>Exam Attendance</Title>
            <Badge color="red" variant="filled" size="lg">
              Absent
            </Badge>
          </Group>
          <Stack gap="sm">
            <Text size="lg" fw={600} c="dimmed">
              This student did not attend the exam.
            </Text>
            <Divider my="md" />
            <Alert
              variant="light"
              color="orange"
              title="No performance data"
              icon={<IconAlertCircle size={18} />}
            >
              Since the student was absent, no score, insights, or section-wise
              analysis is available.
            </Alert>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <div className={styles.examAnalytics}>
      <Container size="xl" p="md">
        <BackButton path={abspath} />
        <Stack gap="xl">
          <div className={styles.headerSection}>
            <Group justify="space-between" align="center">
              <div>
                <Title order={1} className={styles.mainTitle}>
                  Exam Results Analysis
                </Title>
                <Text c="dimmed" size="lg" className={styles.subtitle}>
                  Comprehensive performance breakdown and insights
                </Text>
                <Group align="center" spacing={4} mt="md">
                  <Avatar
                    radius="xl"
                    size={40}
                    src={user.organization.logo || user.organization.logoUrl}
                  />
                  <Text size="lg" fw={500}>
                    {user.role === "organizer" ? result.userId.name : "You"}
                  </Text>
                </Group>
              </div>
              <Badge
                color={isPassed ? "green" : "red"}
                variant="filled"
                size="xl"
                radius="md"
                className={styles.statusBadge}
              >
                {isPassed ? "✓ Passed" : "✗ Failed"}
              </Badge>
            </Group>
          </div>

          <Grid align="stretch" gutter="xl">
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Card
                withBorder
                radius="lg"
                padding="xl"
                className={styles.scoreCard}
              >
                <Group
                  align="center"
                  justify="center"
                  className={styles.eaRingWrap}
                >
                  <RingProgress
                    size={220}
                    thickness={16}
                    sections={[
                      { value: result?.percentage, color: scoreColor },
                    ]}
                    label={
                      <Stack gap={4} align="center">
                        <Text fw={900} fz={42} className={styles.scoreText}>
                          {result?.totalScore}
                        </Text>
                        <Text c="dimmed" size="sm" fw={500}>
                          Total Score
                        </Text>
                        <Text fw={700} fz="lg" c={scoreColor}>
                          {result?.percentage.toFixed(1)}%
                        </Text>
                      </Stack>
                    }
                  />
                </Group>
                <Divider my="xl" />
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <StatCard
                      label="Status"
                      value={isPassed ? "Passed" : "Failed"}
                      icon={
                        isPassed ? (
                          <IconCheckCircle size={16} />
                        ) : (
                          <IconX size={16} />
                        )
                      }
                      rightSection={
                        <Badge
                          color={isPassed ? "green" : "red"}
                          variant="light"
                        >
                          {isPassed ? "Success" : "Retry"}
                        </Badge>
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <StatCard
                      label="Time Spent"
                      value={`${timeSpent} min`}
                      subtext={
                        timeSpent <= 45
                          ? "Efficient pace"
                          : "Consider time management"
                      }
                      color={timeSpent <= 45 ? "green" : "orange"}
                      icon={<IconClock size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12 }}>
                    <Card
                      withBorder
                      radius="md"
                      padding="lg"
                      className={styles.progressCard}
                    >
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>
                          Overall Mastery
                        </Text>
                        <Text size="sm" c={scoreColor} fw={600}>
                          {result?.percentage.toFixed(1)}%
                        </Text>
                      </Group>
                      <Progress
                        value={result?.percentage || 0}
                        size="lg"
                        color={scoreColor}
                      />
                    </Card>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Stack gap="lg">
                <Paper
                  withBorder
                  radius="lg"
                  p="xl"
                  className={styles.breakdownCard}
                >
                  <Group justify="space-between" align="center" mb="sm">
                    <Title order={4} className={styles.sectionTitle}>
                      Answer Breakdown
                    </Title>
                    <Badge
                      color={incorrectCount > 0 ? "red" : "green"}
                      variant="light"
                      size="lg"
                    >
                      {incorrectCount} incorrect
                    </Badge>
                  </Group>
                  <Divider mb="lg" />
                  <Stack gap="md">
                    <Text size="sm" c="dimmed" fw={500}>
                      Question-by-question performance visualization
                    </Text>
                    {result?.sections?.length > 0 && (
                      <MistakeDots answers={result.sections[0].answers} />
                    )}
                  </Stack>
                </Paper>

                <InsightsSection result={result} />
              </Stack>
            </Grid.Col>
          </Grid>

          {result?.sections?.length ? (
            <Stack gap="lg">
              <Group align="center" gap="sm">
                <ThemeIcon variant="light" color="blue" size="lg">
                  <IconTarget size={20} />
                </ThemeIcon>
                <Title order={3} className={styles.sectionTitle}>
                  Subject-wise Performance
                </Title>
              </Group>
              <Grid>
                {result.sections?.map((sec, idx) => (
                  <Grid.Col key={idx} span={{ base: 12, md: 6 }}>
                    <SectionCard section={sec} />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </div>
  );
}
