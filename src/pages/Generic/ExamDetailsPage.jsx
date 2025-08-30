import { useEffect, useMemo, useState } from "react";
import {
  Title,
  Text,
  Badge,
  Stack,
  Button,
  Group,
  Modal,
  ScrollArea,
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
  IconFileTypeDoc,
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
  if (score >= 90) return "accent";
  if (score >= 75) return "brand";
  return "gray";
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

function buildDummyMetrics(participants = [], totalQuestions = 30) {
  if (!participants.length) {
    return { withMetrics: [], top: [], avgScore: 0, completionRate: 0 };
  }
  const withMetrics = participants.map((p, idx) => {
    const base = 65 + ((idx * 7) % 30); // 65..94
    const score = Math.min(100, Math.max(30, base));
    const correct = Math.round((score / 100) * totalQuestions);
    const wrong = Math.max(0, totalQuestions - correct);
    const mins = 40 + ((idx * 9) % 40); // 40..79 mins
    const timeSpent = `${Math.floor(mins / 60)}h ${mins % 60}m`;

    return {
      id: p._id || String(idx + 1),
      name: p.name || `Participant ${idx + 1}`,
      email: p.email || "unknown@example.com",
      score,
      correctAnswers: correct,
      wrongAnswers: wrong,
      attended:
        correct + wrong > 0
          ? correct + wrong
          : Math.min(totalQuestions, correct + wrong),
      notAttended: Math.max(0, totalQuestions - (correct + wrong)),
      timeSpent,
    };
  });

  const top = [...withMetrics].sort((a, b) => b.score - a.score).slice(0, 5);
  const avgScore =
    Math.round(
      (withMetrics.reduce((acc, cur) => acc + cur.score, 0) /
        withMetrics.length || 0) * 10
    ) / 10;
  const completionRate =
    Math.round(
      (withMetrics.filter((x) => (x.attended || 0) > 0).length /
        withMetrics.length) *
        100
    ) || 0;

  return { withMetrics, top, avgScore, completionRate };
}

function flattenQuestionsFromSections(sections = []) {
  const flat = [];
  sections.forEach((sec) => {
    (sec?.questions || []).forEach((q) => {
      flat.push({
        section: sec.name,
        number: flat.length + 1,
        id: q.id || flat.length + 1,
        type: q.type || "MCQ",
        question: q.text || "",
      });
    });
  });
  return flat;
}

export default function ExamDetails({ examId }) {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);

  const { examId: routeExamId } = useParams();
  const navigate = useNavigate();

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
        console.error("[v0] exam fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [examId]);

  const flattenedQuestions = useMemo(
    () => flattenQuestionsFromSections(examData?.sections || []),
    [examData]
  );
  const metrics = useMemo(
    () =>
      buildDummyMetrics(
        examData?.participants || [],
        examData?.totalQuestions || 0
      ),
    [examData]
  );

  if (loading)
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
              aria-label={`Attendees ${participants.length}`}
            >
              <IconUsers size={14} />
              <span>Attendees</span>
              <strong>{participants.length}</strong>
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
            View Questions ({flattenedQuestions.length})
          </Button>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            className="ghost"
            variant="outline"
            color="brand"
            onClick={() => console.log("Download PDF...")}
            size="md"
          >
            Download PDF
          </Button>
          <Button
            leftSection={<IconFileTypeDoc size={18} />}
            className="ghost"
            variant="outline"
            color="accent"
            onClick={() => console.log("Download Word...")}
            size="md"
          >
            Download Word
          </Button>
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
              {participants.length}
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
              {metrics.avgScore}%
            </Text>
            <Text size="sm" c="dimmed" className="kpi-label">
              Avg. Score (dummy)
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
              {metrics.completionRate}%
            </Text>
            <Text size="sm" c="dimmed" className="kpi-label">
              Completion Rate (dummy)
            </Text>
          </Card>
          {organization?.logoUrl ? (
            <Tooltip label={organization?.name || "Organization"} withArrow>
              <Avatar src={organization.logoUrl} radius="xl" size="lg" />
            </Tooltip>
          ) : null}
        </Group>
      </Card>

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
          Celebrating the highest achievers in this exam (dummy metrics for
          organizer preview)
        </Text>

        <div className="leaderboard-list">
          {metrics.top.map((performer, index) => (
            <div
              key={performer.id}
              className={`leaderboard-item ${index < 3 ? "podium" : ""}`}
              onClick={() => console.log("Open result for", performer.id)}
            >
              <div className="rank-section">{getRankIcon(index + 1)}</div>

              <Avatar
                size="lg"
                radius="xl"
                color={getScoreColor(performer.score)}
                className="performer-avatar"
              >
                {performer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Avatar>

              <div className="performer-info">
                <Text fw={600} size="lg" className="performer-name">
                  {performer.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {performer.email}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Completed in {performer.timeSpent}
                </Text>
              </div>

              <div className="performance-metrics">
                <div className="score-display">
                  <Text size="xl" fw={700} c={getScoreColor(performer.score)}>
                    {performer.score}%
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
              onClick={() => console.log("Open result for", attendee.id)}
            >
              <Avatar
                size="lg"
                radius="xl"
                color={getScoreColor(attendee.score)}
                className="attendee-avatar"
              >
                {organization?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={organization.logoUrl || "/placeholder.svg"}
                    alt={attendee.name}
                  />
                ) : (
                  (attendee.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                )}
              </Avatar>

              <div className="attendee-details">
                <div className="attendee-name">{attendee.name}</div>
                <div className="attendee-email">{attendee.email}</div>
                <div className="attendee-metrics">
                  <div className="metric">
                    <span className="metric-value">{attendee.score}%</span>
                    <span className="metric-label">Score</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {attendee.attended || 0}/{totalQuestions || 1}
                    </span>
                    <span className="metric-label">Completed</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{attendee.timeSpent}</span>
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

      <Modal
        opened={questionsModalOpen}
        onClose={() => setQuestionsModalOpen(false)}
        title={
          <Group gap="sm">
            <IconQuestionMark size={24} />
            <Text size="lg" fw={600}>
              Exam Questions ({flattenedQuestions.length})
            </Text>
          </Group>
        }
        size="xl"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="md">
          {flattenedQuestions.map((q) => (
            <div key={`${q.section}-${q.id}`} className="question-item-modal">
              <div className="question-header">
                <span className="question-number">
                  Q{q.number} • {q.section}
                </span>
                <Badge variant="light" color="accent" size="sm">
                  {q.type}
                </Badge>
              </div>
              <div className="question-text">{q.question}</div>
            </div>
          ))}
        </Stack>
      </Modal>
    </div>
  );
}
