import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Badge,
  Stack,
  Button,
  Group,
  Card,
  Avatar,
  Progress,
  Divider,
  Tooltip,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconQuestionMark,
  IconCalendar,
  IconEye,
  IconFileTypePdf,
  IconTrophy,
  IconMedal,
  IconAward,
  IconChevronRight,
  IconBook2,
  IconTags,
  IconListNumbers,
} from "@tabler/icons-react";
import "./generic.scss";
import apiClient from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import NoData from "../../components/Generics/NoData";
import useAuthStore from "../../context/auth-store";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import BackButton from "../../components/Generics/BackButton";

function formatDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// Map scores to Mantine colors (kept minimal to match 5-color theme usage)
function getScoreColor(score = 0) {
  if (score >= 90) return "teal";
  if (score >= 75) return "green";
  return "blue";
}

function getRankIcon(rank) {
  switch (rank) {
    case 1:
      return <IconTrophy size={24} className="rank-icon gold" />;
    case 2:
      return <IconMedal size={24} className="rank-icon silver" />;
    case 3:
      return <IconAward size={24} className="rank-icon bronze" />;
    default:
      return <span className="rank-number">#{rank}</span>;
  }
}

export default function ExamDetails() {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { examId: routeExamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/exam/${routeExamId}`, {
          cache: "no-store",
        });
        if (mounted) setExamData(res?.data?.examData || null);
      } catch (err) {
        console.error("[idxo] exam fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [routeExamId]);

  const examEnd = dayjs(examData?.timing?.end);
  const [hasTimeEnded, setHasTimeEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      if (now.isAfter(examEnd)) {
        setHasTimeEnded(true);
        clearInterval(interval);
      }
    }, 1000); // Check every second

    // Cleanup function
    return () => clearInterval(interval);
  }, [examEnd]); // Re-run effect if endTime changes

  const fetchMetrics = async () => {
    try {
      const response = await apiClient.get(`/api/exam/${routeExamId}/metrics`);
      return response.data.metrics;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data: metrics, isLoading: isMeticsLoading } = useQuery({
    queryKey: ["exam-metrics", routeExamId],
    queryFn: fetchMetrics,
  });

  if (loading || isMeticsLoading)
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  if (!examData) return <NoData />;

  const {
    examTitle,
    subTitle,
    duration,
    totalQuestions,
    participants = [],
    organization,
    examMode,
    examType,
    examCategory,
    totalMarks,
    status,
    timing,
    subjects = [],
    topics = [],
    chapters = [],
  } = examData;

  return (
    <div className="exam-details-container exam-page">
      <BackButton />
      <Card
        className="exam-header page-header"
        shadow="sm"
        padding="lg"
        radius="md"
      >
        <div className="header-content">
          <Title order={1} className="title exam-title">
            {examTitle}
          </Title>
          <Text className="subtitle exam-description">{subTitle}</Text>

          <div className="exam-meta" aria-label="Exam metadata">
            <div className="meta-item badge neutral">
              <IconCalendar size={16} className="meta-icon" />
              <span>
                {formatDateTime(timing?.start)} — {formatDateTime(timing?.end)}
              </span>
            </div>
            <div className="meta-item badge neutral">
              <IconClock size={16} className="meta-icon" />
              <span>{duration} min</span>
            </div>
            <div className="meta-item badge neutral">
              <IconQuestionMark size={16} className="meta-icon" />
              <span>{totalQuestions} Questions</span>
            </div>
            <div className="meta-item badge neutral">
              <IconUsers size={16} className="meta-icon" />
              <span>{participants.length} Attendees</span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        className="section-card exam-info-card"
        shadow="sm"
        padding="lg"
        radius="md"
        mt="md"
      >
        <Stack gap="md">
          <div className="info-header">
            <Title order={3} className="title info-title">
              Exam Details
            </Title>
            <Text size="sm" c="dimmed">
              Quick overview and content tags
            </Text>
          </div>

          <Group gap="xs" wrap="wrap" className="info-pills">
            {status ? (
              <div
                className="badge neutral"
                role="status"
                aria-label={`Status ${status}`}
              >
                <IconAward size={14} />
                <span>Status</span>
                <strong>{status}</strong>
              </div>
            ) : null}

            {examMode ? (
              <div className="badge neutral" aria-label={`Mode ${examMode}`}>
                <IconEye size={14} />
                <span>Mode</span>
                <strong>{examMode}</strong>
              </div>
            ) : null}

            {examType ? (
              <div className="badge neutral" aria-label={`Type ${examType}`}>
                <IconMedal size={14} />
                <span>Type</span>
                <strong>{examType}</strong>
              </div>
            ) : null}

            {examCategory ? (
              <div
                className="badge neutral"
                aria-label={`Category ${examCategory}`}
              >
                <IconTrophy size={14} />
                <span>Category</span>
                <strong>{examCategory}</strong>
              </div>
            ) : null}

            {typeof duration === "number" ? (
              <div
                className="badge neutral"
                aria-label={`Duration ${duration} min`}
              >
                <IconClock size={14} />
                <span>Duration</span>
                <strong>{duration} min</strong>
              </div>
            ) : null}

            {typeof totalMarks === "number" ? (
              <div
                className="badge neutral"
                aria-label={`Total Marks ${totalMarks}`}
              >
                <IconAward size={14} />
                <span>Total Marks</span>
                <strong>{totalMarks}</strong>
              </div>
            ) : null}

            {typeof totalQuestions === "number" ? (
              <div
                className="badge neutral"
                aria-label={`Total Questions ${totalQuestions}`}
              >
                <IconQuestionMark size={14} />
                <span>Questions</span>
                <strong>{totalQuestions}</strong>
              </div>
            ) : null}

            <div
              className="badge neutral"
              aria-label={`Attendees ${examData?.participants?.length || 0}`}
            >
              <IconUsers size={14} />
              <span>Attendees</span>
              <strong>{examData?.participants?.length || 0}</strong>
            </div>
          </Group>

          <Divider my="xs" />

          <div className="tags-section">
            {/* Subjects */}
            <div className="tags-row">
              <div className="tags-row-head">
                <IconBook2 size={18} className="tags-icon" />
                <Text fw={600} className="tags-title">
                  Subjects
                </Text>
              </div>
              <Group gap="sm" wrap="wrap">
                {subjects.length ? (
                  subjects.map((s) => (
                    <div key={`subject-${s}`} className="badge accent">
                      <IconBook2 size={14} />
                      <span>{s}</span>
                    </div>
                  ))
                ) : (
                  <Text size="sm" c="dimmed">
                    No subjects
                  </Text>
                )}
              </Group>
            </div>

            {/* Chapters */}
            <div className="tags-row">
              <div className="tags-row-head">
                <IconListNumbers size={18} className="tags-icon" />
                <Text fw={600} className="tags-title">
                  Chapters
                </Text>
              </div>
              <Group gap="sm" wrap="wrap">
                {chapters.length ? (
                  chapters.map((c) => (
                    <div key={`chapter-${c}`} className="badge neutral">
                      <IconListNumbers size={12} />
                      <span>{c}</span>
                    </div>
                  ))
                ) : (
                  <Text size="sm" c="dimmed">
                    No chapters
                  </Text>
                )}
              </Group>
            </div>

            {/* Topics */}
            <div className="tags-row">
              <div className="tags-row-head">
                <IconTags size={18} className="tags-icon" />
                <Text fw={600} className="tags-title">
                  Topics
                </Text>
              </div>
              <Group gap="sm" wrap="wrap">
                {topics.length ? (
                  topics.map((t) => (
                    <div key={`topic-${t}`} className="badge neutral">
                      <IconTags size={12} />
                      <span>{t}</span>
                    </div>
                  ))
                ) : (
                  <Text size="sm" c="dimmed">
                    No topics
                  </Text>
                )}
              </Group>
            </div>
          </div>
        </Stack>
      </Card>

      <Card
        className="section-card options-section"
        shadow="sm"
        padding="lg"
        radius="md"
        mt="md"
      >
        <Title order={3} className="title options-title">
          Exam Options
        </Title>
        <div className="options-buttons">
          <Button
            leftSection={<IconEye size={18} />}
            className="cta"
            variant="filled"
            color="brand"
            onClick={() =>
              navigate(
                `/organization/exams/details/${examData.examId}/questions`
              )
            }
            size="md"
          >
            View Questions ({examData.totalQuestions})
          </Button>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            className="ghost"
            variant="outline"
            color="brand"
            onClick={() => navigate(`/print/${examData.examId}`)}
            size="md"
          >
            Download PDF
          </Button>
          {/* <Button
            leftSection={<IconFileTypeDoc size={18} />}
            className="ghost"
            variant="outline"
            color="accent"
            onClick={() => console.log("Download Word...")}
            size="md"
          >
            Download Word
          </Button> */}
        </div>

        <Group mt="lg" gap="lg" wrap="wrap">
          <Card
            shadow="xs"
            radius="md"
            padding="md"
            withBorder
            className="section-card kpi-card"
          >
            <Text fw={700} size="xl" className="kpi-value">
              {examData?.participants?.length || 0}
            </Text>
            <Text size="sm" c="dimmed" className="kpi-label">
              Registered Attendees
            </Text>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            padding="md"
            withBorder
            className="section-card kpi-card"
          >
            <Text fw={700} size="xl" className="kpi-value">
              {metrics?.averageScore?.toFixed(2)}%
            </Text>
            <Text size="sm" c="dimmed" className="kpi-label">
              Avg. Score
            </Text>
          </Card>
          {/* <Card
            shadow="xs"
            radius="md"
            padding="md"
            withBorder
            className="section-card kpi-card"
          >
            <Text fw={700} size="xl" className="kpi-value">
              {metrics.completionRate}%
            </Text>
            <Text size="sm" c="dimmed" className="kpi-label">
              Completion Rate
            </Text>
          </Card> */}
          {organization?.logoUrl ? (
            <Tooltip label={organization?.name || "Organization"} withArrow>
              <Avatar src={organization.logoUrl || user.organization.logo} radius="xl" size="lg" />
            </Tooltip>
          ) : null}
        </Group>
      </Card>

      {hasTimeEnded && (
        <>
          <Card
            className="section-card leaderboard-section"
            shadow="sm"
            padding="lg"
            radius="md"
            mt="md"
          >
            <Title order={2} className="title section-title">
              <IconTrophy size={24} className="title-icon" />
              Top Performers
            </Title>
            <Text size="sm" c="dimmed" mb="lg">
              Celebrating the highest achievers in this exam
            </Text>

            <div className="leaderboard-list">
              {metrics.top.map((performer, index) => (
                <div
                  key={performer.id}
                  className={`leaderboard-item ${index < 3 ? "podium" : ""}`}
                  onClick={() =>
                    navigate(
                      `/organization/exams/details/${examData.examId}/result/${performer.resultId}?userId=${performer.id}`
                    )
                  }
                >
                  <div className="rank-section">{getRankIcon(index + 1)}</div>

                  <Avatar
                    size="lg"
                    radius="xl"
                    src={user.organization.logoUrl || user.organization.logo}
                    alt={performer.name}
                    className="performer-avatar"
                    color={getScoreColor(performer.score)}
                  />

                  <div className="performer-info">
                    <Text fw={600} size="lg" className="performer-name">
                      {performer.name}
                    </Text>
                    {/* <Text size="sm" c="dimmed">
                  {performer.email}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Completed in {performer.timeSpent}
                </Text> */}
                  </div>

                  <div className="performance-metrics">
                    <div className="score-display">
                      <Text
                        size="xl"
                        fw={700}
                        c={getScoreColor(performer.score)}
                      >
                        {performer.score?.toFixed(2)}%
                      </Text>
                      <Progress
                        value={performer.score}
                        color={getScoreColor(performer.score)}
                        size="sm"
                        radius="xl"
                        mt={4}
                      />
                    </div>
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{ textAlign: "center" }}
                      mt={4}
                    >
                      {performer.correctAnswers}/{totalQuestions} correct
                    </Text>
                  </div>

                  <IconChevronRight size={20} className="chevron-icon" />
                </div>
              ))}
            </div>
          </Card>

          <Divider my="xl" />

          <Card
            className="section-card attendance-section"
            shadow="sm"
            padding="lg"
            radius="md"
            mt="md"
          >
            <Title order={2} className="title section-title">
              <IconUsers size={20} className="title-icon" />
              All Attendees ({participants.length})
            </Title>

            <div className="attendees-grid">
              {metrics.withMetrics.map((attendee) => (
                <div
                  key={attendee.id}
                  className="attendee-card-new"
                  onClick={() =>
                    navigate(
                      `/organization/exams/details/${examData.examId}/result/${attendee.resultId}?userId=${attendee.id}`
                    )
                  }
                >
                  <Avatar
                    size="lg"
                    radius="xl"
                    src={user.organization.logo || user.organization.logoUrl}
                    alt={attendee.name}
                    className="performer-avatar"
                    color={getScoreColor(attendee.score)}
                  />

                  <div className="attendee-details">
                    <div className="attendee-name">{attendee.name}</div>
                    {/* <div className="attendee-email">{attendee.email}</div> */}
                    <div className="attendee-metrics">
                      <div className="metric">
                        <span className="metric-value">
                          {attendee.score?.toFixed(0)}%
                        </span>
                        <span className="metric-label">Score</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">
                          {attendee.attended || 0}/{totalQuestions || 1}
                        </span>
                        <span className="metric-label">Completed</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">
                          {attendee.timeSpent}
                        </span>
                        <span className="metric-label">Time Spent</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    color={getScoreColor(attendee.score)}
                    variant="filled"
                    size="lg"
                    className="attendee-score-badge"
                  >
                    {attendee.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
