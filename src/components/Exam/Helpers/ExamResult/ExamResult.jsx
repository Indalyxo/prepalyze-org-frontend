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
  Button,
} from "@mantine/core";
import styles from "./exam-result.module.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../utils/api";

function StatCard({ label, value, subtext, color = "blue", rightSection }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" align="flex-start" mb="xs">
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        {rightSection}
      </Group>
      <Text fw={700} fz="xl">
        {value}
      </Text>
      {subtext ? (
        <Text size="sm" c={color} mt={4}>
          {subtext}
        </Text>
      ) : null}
    </Card>
  );
}

function MistakeDots({ answers = [] }) {
  return (
    <Group gap="xs" wrap="wrap">
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
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="sm">
        <Title order={5}>{section.sectionName}</Title>
        <Badge variant="light" color={color}>
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
            <Text size="sm" c="dimmed">
              Distribution
            </Text>
            <Text size="sm" c="dimmed">
              {total} Q
            </Text>
          </Group>
          <Progress value={correctPct} color={color} />
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
            <Text size="sm" c="dimmed">
              Answers
            </Text>
            <MistakeDots answers={section.answers} />
          </Stack>
        </>
      ) : null}
    </Card>
  );
}

export default function ExamResult({ primary = "blue" }) {
  const { examId } = useParams();

  const fetchAttendance = async (examId) => {
    try {
      console.log('hi')
      const res = await apiClient.get(`/api/exam/${examId}/attendance`);
      console.log(res.data.result, "jlk")
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

  const isPassed = result?.percentage >= 50; // Assuming a passing score of 50%

  if (isAttendanceLoading) {
    return <div>Loading...</div>;
  }
  console.log(result);
  return (
    <MantineProvider theme={{ primaryColor: primary }}>
      <div className={styles.examAnalytics}>
        <Container size="lg" p="md">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2}>Your Exam Result</Title>
                <Text c="dimmed" size="sm">
                  Personalized performance summary for your latest attempt.
                </Text>
              </div>
              <Badge
                color={isPassed ? "green" : "red"}
                variant="light"
                size="lg"
                radius="sm"
              >
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </Group>
            <Grid align="stretch">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Card withBorder radius="md" padding="lg">
                  <Group
                    align="center"
                    justify="center"
                    className={styles.eaRingWrap}
                  >
                    <RingProgress
                      size={200}
                      thickness={14}
                      sections={[
                        { value: result?.percentage, color: scoreColor },
                      ]}
                      label={
                        <Stack gap={2} align="center">
                          <Text fw={800} fz={36}>
                            {result?.totalScore}
                          </Text>
                          <Text c="dimmed" size="sm">
                            Score
                          </Text>
                        </Stack>
                      }
                    />
                  </Group>
                  <Divider my="lg" />
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <StatCard
                        label="Status"
                        value={isPassed ? "Passed" : "Failed"}
                        rightSection={
                          <Badge
                            color={isPassed ? "green" : "red"}
                            variant="light"
                          >
                            {isPassed ? "Good" : "Retry"}
                          </Badge>
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <StatCard
                        label="Time Spent"
                        value={`${timeSpent} min`}
                        subtext={timeSpent <= 45 ? "On pace" : "Running long"}
                        color={timeSpent <= 45 ? "green" : "red"}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <Card withBorder radius="md" padding="lg">
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" c="dimmed">
                            Mastery Progress
                          </Text>
                          <Text size="sm" c="dimmed">
                            {result?.percentage}%
                          </Text>
                        </Group>
                        <Progress value={result?.percentage || 0} />
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper withBorder radius="md" p="lg">
                  <Group justify="space-between" align="center" mb="sm">
                    <Title order={4}>Answer Breakdown</Title>
                    <Badge
                      color={incorrectCount > 0 ? "red" : "green"}
                      variant="light"
                    >
                      {incorrectCount} incorrect
                    </Badge>
                  </Group>
                  <Divider mb="lg" />
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      Tap the dots to see correctness by question.
                    </Text>
                    {result?.sections?.length > 0 && (
                      <MistakeDots answers={result.sections[0].answers} />
                    )}
                  </Stack>
                </Paper>
                {result?.sections?.length ? (
                  <Stack mt="lg" gap="md">
                    <Title order={4}>Section Results</Title>
                    <Grid>
                      {result.sections?.map((sec, idx) => (
                        <Grid.Col key={idx} span={{ base: 12, sm: 6 }}>
                          <SectionCard section={sec} />
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Stack>
                ) : null}
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="light"
                    onClick={() => {
                      console.log(
                        "[v0] Download summary for user:",
                        result?.userId?.$oid
                      );
                    }}
                  >
                    Download Summary
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}
