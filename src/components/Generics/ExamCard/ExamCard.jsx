import {
  Card,
  Text,
  Title,
  Badge,
  Group,
  Button,
  Stack,
  Modal,
  ActionIcon,
  Loader,
  Menu,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
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
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import apiClient from "../../../utils/api";
import styles from "./ExamCard.module.scss";

export default function ExamCard({ exam, route = "organization" }) {
  const navigate = useNavigate();
  const [isPostponeModalOpen, setIsPostponeModalOpen] = useState(false);
  const [newStartDate, setNewStartDate] = useState(exam?.timing?.start ? new Date(exam.timing.start) : new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  // ✅ Compute exam status
  const now = dayjs();
  const start = dayjs(exam?.timing?.start);
  const end = dayjs(exam?.timing?.end);

  let examStatus = "Scheduled";
  if (now.isAfter(end)) {
    examStatus = "Ended";
  } else if (now.isAfter(start) && now.isBefore(end)) {
    examStatus = "Ongoing";
  }

  const handleCancelExam = async () => {
    try {
      setIsCanceling(true);
      const response = await apiClient.patch(`/api/exam/${exam.examId}/cancel`);
      if (response.data.success) {
        notifications.show({
          title: "Success",
          message: "Exam cancelled successfully",
          color: "green"
        });
        // We'd ideally want to refetch the exams list here. For now, a reload will work.
        window.location.reload();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to cancel exam",
        color: "red"
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handlePostponeExam = async () => {
    if (!newStartDate) return;
    
    try {
      setIsUpdating(true);
      const newStart = dayjs(newStartDate);
      const newEnd = newStart.add(exam.duration, "minute");
      
      const payload = {
        timing: {
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        }
      };

      const response = await apiClient.patch(`/api/exam/${exam.examId}/update`, payload);
      if (response.data.success) {
        notifications.show({
          title: "Success",
          message: "Exam postponed successfully",
          color: "green"
        });
        setIsPostponeModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to postpone exam",
        color: "red"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card shadow="md" radius="lg" className={styles.examCard} withBorder>
      {/* Header Background */}
      <div
        className={styles.cardHeader}
        style={{
          backgroundImage: `url(/images/${exam?.subjects?.[0]?.toLowerCase() || 'default'}.webp)`,
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

        {/* Three dot menu (Organization only) */}
        {route === "organization" && (
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
                onClick={() => setIsPostponeModalOpen(true)}
              >
                Postpone Exam
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={isCanceling ? <Loader size={16} /> : <IconTrash size={16} />}
                onClick={handleCancelExam}
                disabled={isCanceling}
              >
                Cancel Exam
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
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
              {dayjs(exam?.timing?.start).format("DD MMM, YYYY hh:mm A")}
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
              <Text size="sm">{exam?.participants?.length || 0} Participants</Text>
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
          📘 {exam?.chapters?.length || 0} Chapters · {exam?.topics?.length || 0} Topics
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
                navigate(`/${route}/exams/start/${exam.examId}`, {
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

      {/* Postpone Exam Modal */}
      <Modal
        opened={isPostponeModalOpen}
        onClose={() => setIsPostponeModalOpen(false)}
        title="Postpone Exam"
        centered
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Select a new start date and time for the exam. The duration ({exam.duration} mins) will be preserved.
          </Text>
          
          <DateTimePicker
            label="New Start Time"
            placeholder="Pick date and time"
            value={newStartDate}
            onChange={setNewStartDate}
            minDate={new Date()}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setIsPostponeModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={isUpdating} onClick={handlePostponeExam}>
              Confirm Postpone
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}
