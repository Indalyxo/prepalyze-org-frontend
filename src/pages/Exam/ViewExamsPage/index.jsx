import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Select,
  Pagination,
  TextInput,
  Drawer,
  SimpleGrid,
  Card,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconCalendar,
  IconFilter,
} from "@tabler/icons-react";
import styles from "./ViewExamsPage.module.scss";
import { useNavigate } from "react-router-dom";
import { getIcons } from "../../../utils/get-ui";
import { SubjectColors } from "../../../constants";
import ExamCreationForm from "../../../components/Exam/ExamCreationForm/ExamCreationForm";

const mockExams = [
  {
    id: 1,
    title: "Math Exam 1",
    subject: "Mathematics",
    status: "finished",
    duration: "2 hours 30 minutes",
    questions: 45,
    chapters: 5,
    createdDate: "Jan 22, 2025",
    color: "purple",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Science Exam 1",
    subject: "Botany",
    status: "running",
    duration: "3 hours",
    questions: 60,
    chapters: 7,
    createdDate: "Jan 22, 2025",
    color: "yellow",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "History Exam 1",
    subject: "Chemistry",
    status: "upcoming",
    duration: "2 hours",
    questions: 40,
    chapters: 4,
    createdDate: "Jan 22, 2025",
    color: "blue",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "English Exam 1",
    subject: "Physics",
    status: "upcoming",
    duration: "2 hours 15 minutes",
    questions: 35,
    chapters: 6,
    createdDate: "Jan 22, 2025",
    color: "pink",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Zoology Exam 1",
    subject: "Zoology",
    status: "finished",
    duration: "3 hours 30 minutes",
    questions: 55,
    chapters: 8,
    createdDate: "Jan 22, 2025",
    color: "orange",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: "Chemistry Exam 1",
    subject: "Chemistry",
    status: "running",
    duration: "2 hours 45 minutes",
    questions: 50,
    chapters: 6,
    createdDate: "Jan 22, 2025",
    color: "teal",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "History",
  "English",
  "Physics",
  "Chemistry",
];
const examTypes = ["All Types", "Quiz", "Midterm", "Final"];
const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

export default function ViewExamsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedExamType, setSelectedExamType] = useState("All Types");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const navigate = useNavigate();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockExams.length / itemsPerPage);

  return (
    <div className={styles.availableExams}>
      <Container size="xl" py="xl">
        <div className={styles.headerSection}>
          <Group justify="space-between" align="center" mb="lg">
            <Title order={1} className={styles.pageTitle}>
              Exams
            </Title>
            <Button
              leftSection={<IconPlus size={16} />}
              className={styles.addButton}
              onClick={() => setOpenCreateModal(true)}
              size="md"
            >
              Add New Exam
            </Button>
          </Group>
        </div>

        <div className={styles.searchSection}>
          <Group justify="space-between" align="center" mb="xl">
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              className={styles.searchInput}
              size="md"
            />
            <Group gap="sm">
              <Select
                placeholder="Created Date"
                data={["All Dates", "Today", "This Week", "This Month"]}
                className={styles.dateSelect}
                size="md"
              />
              <Button
                variant="outline"
                onClick={() => setSidebarOpened(true)}
                className={styles.categoryButton}
                size="md"
                leftSection={<IconFilter size={16} />}
              >
                Filters
              </Button>
            </Group>
          </Group>
        </div>

        <ExamCreationForm
          opened={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        />

        <Drawer
          opened={sidebarOpened}
          onClose={() => setSidebarOpened(false)}
          title="Filter Exams"
          position="right"
          size="sm"
          className={styles.filterSidebar}
        >
          <Stack gap="md">
            <Select
              label="Subject"
              placeholder="Select subject"
              data={subjects}
              value={selectedSubject}
              onChange={setSelectedSubject}
              className={styles.filterSelect}
            />
            <Select
              label="Exam Type"
              placeholder="Select type"
              data={examTypes}
              value={selectedExamType}
              onChange={setSelectedExamType}
              className={styles.filterSelect}
            />
            <Select
              label="Difficulty"
              placeholder="Select difficulty"
              data={difficulties}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              className={styles.filterSelect}
            />
            <Button
              variant="light"
              onClick={() => {
                setSelectedSubject("All Subjects");
                setSelectedExamType("All Types");
                setSelectedDifficulty("All Levels");
              }}
              className={styles.clearFiltersButton}
            >
              Clear All Filters
            </Button>
          </Stack>
        </Drawer>

        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="lg"
          className={styles.examGrid}
        >
          {mockExams.map((exam) => (
            <Card key={exam.id} className={`${styles.examCard}`} radius="md">
              <div
                className={styles.cardHeader}
                style={{ backgroundColor: SubjectColors[exam.subject] }}
              >
                <div className={styles.iconContainer}>
                  {getIcons(exam.subject, styles)}
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardContent}>
                  <Title order={4} className={styles.examTitle} mb="xs">
                    {exam.title}
                  </Title>

                  <Text size="sm" className={styles.examDuration} mb="xs">
                    Exam Duration about: {exam.duration}
                  </Text>

                  <Group gap="md" mb="sm">
                    <Text size="sm" className={styles.examInfo}>
                      System Admin
                    </Text>
                    <Text size="sm" className={styles.examInfo}>
                      Total {exam.chapters} Chapters
                    </Text>
                  </Group>

                  <Group gap="xs" align="center" mb="md">
                    <IconCalendar size={14} />
                    <Text size="sm" className={styles.createdDate}>
                      Created on {exam.createdDate}
                    </Text>
                  </Group>
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    variant="subtle"
                    fullWidth
                    className={styles.viewMoreButton}
                    onClick={() =>
                      navigate(`/organization/exams/details/${exam.id}`)
                    }
                  >
                    View More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>

        <div className={styles.paginationContainer}>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            className={styles.pagination}
          />
        </div>
      </Container>
    </div>
  );
}
