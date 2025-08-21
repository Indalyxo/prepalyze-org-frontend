import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Select,
  Box,
  Pagination,
  Flex,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CountdownTimer from "./CountdownTimer";
import styles from "./ViewExamsPage.module.scss";
import { useNavigate } from "react-router-dom";

// Mock exam data with countdown timers
const mockExams = [
  {
    id: 1,
    title: "Math Exam 1",
    subject: "Mathematics",
    status: "finished",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 2,
    title: "Science Exam 1",
    subject: "Science",
    status: "running",
    startTime: new Date(Date.now()), // Now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
  },
  {
    id: 3,
    title: "History Exam 1",
    subject: "History",
    status: "finished",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    endTime: new Date(Date.now() + 60 * 1000), // 1 hour from now
  },
  {
    id: 4,
    title: "English Exam 1",
    subject: "English",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
  },
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "History",
  "English",
];
const examTypes = ["All Types", "Quiz", "Midterm", "Final"];
const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

export default function ViewExamsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedExamType, setSelectedExamType] = useState("All Types");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");

  const navigate = useNavigate();

  const itemsPerPage = 4;
  const totalPages = Math.ceil(mockExams.length / itemsPerPage);

  return (
    <div className={styles.availableExams}>
      <Container size="xl" py="xl">
        {/* Header */}
        <Stack gap="lg" mb="xl">
          <div>
            <Title order={1} className={styles.pageTitle}>
              Available Exams
            </Title>
          </div>

          {/* Filters */}
          <Group gap="md" className={styles.filters}>
            <Select
              placeholder="Subject"
              data={subjects}
              value={selectedSubject}
              onChange={setSelectedSubject}
              className={styles.filterSelect}
            />
            <Select
              placeholder="Exam Type"
              data={examTypes}
              value={selectedExamType}
              onChange={setSelectedExamType}
              className={styles.filterSelect}
            />
            <Select
              placeholder="Difficulty"
              data={difficulties}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              className={styles.filterSelect}
            />
          </Group>
        </Stack>

        {/* Exams List */}
        <Stack gap="md" mb="xl">
          {mockExams.map((exam) => (
            <Box key={exam.id} className={styles.examCard}>
              <Flex
                direction={isMobile ? "column" : "row"}
                align={isMobile ? "stretch" : "center"}
                justify="space-between"
                gap="md"
              >
                {/* Left side - Exam info and button */}
                <Flex direction="column" gap="xs" className={styles.examInfo}>
                  <Title order={3} className={styles.examTitle}>
                    {exam.title}
                  </Title>
                  <Text>
                    <Badge
                      variant="light"
                      size="sm"
                      className={styles.examBadge}
                    >
                      {exam.status}
                    </Badge>
                  </Text>
                  <Text className={styles.examSubject}>{exam.subject}</Text>
                  <Button
                    variant="outline"
                    size="sm"
                    className={styles.viewDetailsBtn}
                    onClick={() => navigate(`/organization/exams/details/${exam.id}`)}
                  >
                    View Details
                  </Button>
                </Flex>

                {/* Right side - Countdown timer */}
                <Box className={styles.timerContainer}>
                  <CountdownTimer
                    startTime={exam.startTime}
                    endTime={exam.endTime}
                    title="Time Remaining"
                    size="sm"
                    variant="default"
                    showTitle={true}
                    showDescription={true}
                  />
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>

        {/* Pagination */}
        <Flex justify="center">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            className={styles.pagination}
          />
        </Flex>
      </Container>
    </div>
  );
}
