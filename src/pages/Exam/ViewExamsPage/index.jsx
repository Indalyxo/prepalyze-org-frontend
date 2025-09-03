import { useState } from "react";
import {
  Container,
  Title,
  Button,
  Stack,
  Select,
  Pagination,
  TextInput,
  Drawer,
  SimpleGrid,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconFilter,
} from "@tabler/icons-react";
import styles from "./ViewExamsPage.module.scss";
import { useNavigate } from "react-router-dom";
import ExamCreationForm from "../../../components/Exam/ExamCreationForm/ExamCreationForm";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";
import ExamCard from "../../../components/Generics/ExamCard/ExamCard";

const subjects = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];
const examTypes = ["NEET-UG", "JEE-MAINS"];
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

  const fetchExams = async (page) => {
    try {
      const response = await apiClient.get("/api/exam", {
        params: { page, itemsPerPage },
      });

      console.log(response);
      return response.data.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exams. Please try again.");
      throw error;
    }
  };

  const {
    data: exams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["GET_EXAMS"],
    queryFn: fetchExams,
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(exams?.length ?? 0 / itemsPerPage);

  if (isLoading)
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

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
          {exams.map((exam) => (
            <ExamCard exam={exam} key={exam.examId} />
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
