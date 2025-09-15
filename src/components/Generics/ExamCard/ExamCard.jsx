import {
  Card,
  Text,
  Title,
  Badge,
  Group,
  Button,
  Stack,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  IconClock,
  IconCalendar,
  IconUsers,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./ExamCard.module.scss";

export default function ExamCard({ exam, route = "organization" }) {
  const navigate = useNavigate();
  // ✅ Compute exam status
  const now = dayjs();
  const start = dayjs(exam.timing.start);
  const end = dayjs(exam.timing.end);

  let examStatus = "Scheduled";
  if (now.isAfter(end)) {
    examStatus = "Ended";
  } else if (now.isAfter(start) && now.isBefore(end)) {
    examStatus = "Ongoing";
  }

  return (
    <Card shadow="md" radius="lg" className={styles.examCard} withBorder>
      {/* Header Background */}
      <div
        className={styles.cardHeader}
        style={{
          backgroundImage: `url(/images/${exam.subjects[0].toLowerCase()}.webp)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition:
            exam?.subjects?.[1] === "Physics" ? "40% 40%" : "40% 10%",
        }}
      >
        <Badge
          variant="gradient"
          gradient={{ from: "blue", to: "indigo" }}
          className={styles.examTypeBadge}
        >
          {exam.examType}
        </Badge>

        {/* Three dot menu */}
        <Menu shadow="md" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              radius="xl"
              size="lg"
              className={styles.actionMenu}
            >
              <IconDots size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate(`/exam/${exam.examId}/edit`)}
            >
              Postpone Exam
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => console.log("Delete exam", exam.examId)}
            >
              Cancel Exam
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      {/* Content */}
      <Stack gap="xs" className={styles.cardBody}>
        <Title order={4} className={styles.examTitle}>
          {exam.examTitle}
        </Title>
        <Text size="sm" className={styles.subTitle}>
          {exam.subTitle}
        </Text>

        {/* Exam Meta */}
        <Group gap="md" mt="auto" className={styles.metaInfo}>
          <Group gap={4}>
            <IconClock size={16} />
            <Text size="sm">{exam.duration} mins</Text>
          </Group>
          <Group gap={4}>
            <IconCalendar size={16} />
            <Text size="sm">
              {dayjs(exam.timing.start).format("DD MMM, YYYY hh:mm A")}
            </Text>
          </Group>

          {route === "organization" && exam.isOpenExam ? (
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="sm">Open Exam</Text>
            </Group>
          ) : (
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="sm">{exam.participants.length} Participants</Text>
            </Group>
          )}
          {/* Exam Status Badge */}
          <Badge
            variant="filled"
            color={
              examStatus === "Ongoing"
                ? "green"
                : examStatus === "Ended"
                ? "red"
                : "yellow"
            }
            className={styles.examStatusBadge}
          >
            {examStatus}
          </Badge>
        </Group>

        {/* Chapters & Topics */}
        <Text size="sm" className={styles.secondaryText}>
          📘 {exam.chapters.length} Chapters · {exam.topics.length} Topics
        </Text>
      </Stack>

      {/* Footer */}
      <Group grow className={styles.cardFooter}>
        <Button
          variant="light"
          radius="md"
          onClick={() => navigate(`/${route}/exams/details/${exam.examId}`)}
        >
          View Details
        </Button>

        {route === "student" &&
          exam.examMode === "Online" &&
          examStatus !== "Ended" && (
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "indigo" }}
              radius="md"
              disabled={examStatus === "Scheduled"}
              onClick={() =>
                navigate(`/exams/start/${exam.examId}`, {
                  state: {
                    examTitle: exam.examTitle,
                    examId: exam.examId,
                    instruction: exam?.instruction || "<p></p>",
                    timing: exam.timing,
                    duration: exam.duration,
                    totalQuestions: exam.totalQuestions,
                    totalMarks: exam.totalMarks,
                    sections: exam.subjects.length || 0,
                  },
                })
              }
            >
              Take Exam
            </Button>
          )}
      </Group>
    </Card>
  );
}
