import {
  Card,
  Text,
  Title,
  Badge,
  Group,
  Button,
  Stack,
  Grid,
} from "@mantine/core";
import {
  IconClock,
  IconCalendar,
  IconUsers,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./ExamCard.module.scss";

export default function ExamCard({ exam, route = "organization" }) {
  const navigate = useNavigate();

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
        <Group gap="md" mt="sm" className={styles.metaInfo}>
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
          {route === "organization" && (
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="sm">{exam.participants.length} Participants</Text>
            </Group>
          )}
        </Group>

        {/* Chapters & Topics */}
        <Text size="sm" className={styles.secondaryText}>
          📘 {exam.chapters.length} Chapters · {exam.topics.length} Topics
        </Text>

        {/* Status */}
        {/* <Badge
          size="sm"
          color={exam.status === "Scheduled" ? "yellow" : "green"}
          leftSection={<IconCircleCheck size={14} />}
        >
          {exam.status}
        </Badge> */}
      </Stack>

      {/* Footer */}
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
          (() => {
            const now = dayjs();
            const start = dayjs(exam.timing.start);
            const end = dayjs(exam.timing.end);

            // exam ended → no button
            if (now.isAfter(end)) return null;

            // exam not started yet → disabled button
            return (
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "indigo" }}
                radius="md"
                disabled={now.isBefore(start)}
                onClick={() => navigate(`/exam/${exam.examId}`)}
              >
                Take Exam
              </Button>
            );
          })()}
      </Group>
    </Card>
  );
}
