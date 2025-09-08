import { useEffect, useMemo, useState } from "react";
import {
  Title,
  Text,
  Badge,
  Stack,
  Button,
  Group,
  Card,
  Progress,
  Divider,
  LoadingOverlay,
  UnstyledButton,
  Tooltip,
  ActionIcon,
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
  IconBook2,
  IconTags,
  IconListNumbers,
  IconTrophyFilled,
  IconArrowBigLeftFilled,
} from "@tabler/icons-react";
import "./student-view-details.scss";
import apiClient from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import NoData from "../../../components/Generics/NoData";
import useAuthStore from "../../../context/auth-store";
import dayjs from "dayjs";

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

function getScoreColor(score = 0) {
  if (score >= 90) return "accent";
  if (score >= 75) return "brand";
  return "blue";
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

export default function StudentsViewDetailsPage() {
  const [examData, setExamData] = useState(null);
  const [userScoreData, setUserScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { examId: routeExamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const examEnd = dayjs(examData?.timing?.end);
  const [hasTimeEnded, setHasTimeEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      if (now.isAfter(examEnd)) {
        setHasTimeEnded(true);
        clearInterval(interval);
      }
    }, 2000); // Check every second

    // Cleanup function
    return () => clearInterval(interval);
  }, [examEnd]); // Re-run effect if endTime changes

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Fetch exam details
        const examRes = await apiClient.get(`/api/exam/${routeExamId}`, {
          cache: "no-store",
        });
        if (mounted) setExamData(examRes?.data?.examData || null);

        // Fetch individual user's score if authenticated
        if (user?.id) {
          const scoreRes = await apiClient.get(
            `/api/exam/${routeExamId}/attendance`
          );
          if (mounted) setUserScoreData(scoreRes?.data?.result || null);
        }
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
  }, [routeExamId, user?.id]);

  const flattenedQuestions = useMemo(
    () => flattenQuestionsFromSections(examData?.sections || []),
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

  console.log(userScoreData, timing, user, "userScoreData");
  const userHasScore = hasTimeEnded;
  const yourScorePercentage = userHasScore ? userScoreData.percentage : 0;
  const yourScoreColor = getScoreColor(yourScorePercentage);

  return (
    <div className="exam-details-container exam-page">
      <UnstyledButton
        onClick={() => navigate("/student/exams")}
        aria-label="Go back"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 0.6rem",
          borderRadius: "8px",
          transition: "background 0.2s ease",
        }}
        className="back-btn"
      >
        <Tooltip label="Go back" position="bottom" withArrow>
          <ActionIcon variant="light" color="blue" size="xl" radius="xl">
            <IconArrowBigLeftFilled size={26} />
          </ActionIcon>
        </Tooltip>
        <Text size="lg" c="dimmed" style={{ fontWeight: 500 }}>
          Back
        </Text>
      </UnstyledButton>
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

      {userHasScore ? (
        <Card
          className="section-card user-score-section"
          shadow="sm"
          padding="lg"
          radius="md"
          mt="md"
        >
          <Group
            className="card-header"
            justify="space-between"
            align="flex-start"
            mb="sm"
          >
            <div>
              <Title order={3} className="title info-title">
                Your Score
              </Title>
              <Text size="sm" c="dimmed">
                Your personal performance on this exam.
              </Text>
            </div>
            <Badge
              color={userScoreData.status === "present" ? "green" : "red"}
              size="lg"
              variant="light"
            >
              {userScoreData.status}
            </Badge>
          </Group>
          <Divider my="md" />
          <Stack gap="md">
            <Group justify="space-between" align="center" wrap="wrap">
              <Group gap="xs">
                <IconTrophyFilled color="yellow" size={24} />
                <Text size="xl" fw={700}>
                  {userScoreData.totalScore}
                  <Text span size="sm" c="dimmed" ml={4}>
                    / {examData.totalMarks}
                  </Text>
                </Text>
              </Group>
              <Badge color={yourScoreColor} size="lg" variant="light">
                {yourScorePercentage.toFixed(0)}%
              </Badge>
            </Group>
            <Progress
              value={yourScorePercentage}
              color={yourScoreColor}
              size="xl"
              radius="sm"
              style={{ flexGrow: 1 }}
            />
            <Group grow mt="xs">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Correct
                </Text>
                <Badge color="green" size="lg" variant="light">
                  {userScoreData.metaCounts.totalCorrect}
                </Badge>
              </Stack>
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Incorrect
                </Text>
                <Badge color="red" size="lg" variant="light">
                  {userScoreData.metaCounts.totalWrong}
                </Badge>
              </Stack>
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Unattempted
                </Text>
                <Badge color="gray" size="lg" variant="light">
                  {userScoreData.metaCounts.totalUnattempted}
                </Badge>
              </Stack>
            </Group>
          </Stack>
        </Card>
      ) : null}

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
              navigate(`/student/exams/details/${examData.examId}/questions`)
            }
            disabled={!hasTimeEnded}
            size="md"
          >
            View Questions ({flattenedQuestions.length})
          </Button>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            className="ghost"
            variant="outline"
            color="brand"
            onClick={() => navigate(`/print/${examData.examId}`)}
            size="md"
            disabled={!hasTimeEnded}
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
            disabled={!hasTimeEnded}
          >
            Download Word
          </Button> */}
        </div>
      </Card>
    </div>
  );
}
