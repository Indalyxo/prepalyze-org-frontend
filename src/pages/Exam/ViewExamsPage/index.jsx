import { useState } from "react";
import {
  Container,
  Title,
  Button,
  Stack,
  Select,
  SimpleGrid,
  Group,
  LoadingOverlay,
  Paper,
  Box,
  Center,
  Loader,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconX,
  IconCalendar,
  IconBook,
  IconTrendingUp,
} from "@tabler/icons-react";
import styles from "./ViewExamsPage.module.scss";
import { useSearchParams } from "react-router-dom";
import ExamCreationForm from "../../../components/Exam/ExamCreationForm/ExamCreationForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";
import ExamCard from "../../../components/Generics/ExamCard/ExamCard";
import { SearchBar } from "../../../components/Generics/Searchbar/Searchbar";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import dayjs from "dayjs";
import NoData from "../../../components/Generics/NoData";

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];
const examTypes = ["All Types", "NEET-UG", "JEE-Main"];
const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

export default function ViewExamsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedExamType, setSelectedExamType] = useState("All Types");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const { ref, inView } = useInView();

  const [searchParams, setSearchParams] = useSearchParams();
  const create = searchParams.get("create");
  const date = searchParams.get("date");

  const [openCreateModal, setOpenCreateModal] = useState(create || false);
  const itemsPerPage = 6;

  const fetchExams = async ({ pageParam = 0 }) => {
    try {
      const response = await apiClient.get("/api/exam", {
        params: {
          page: pageParam,
          limit: itemsPerPage,
          dateFilter: selectedDate,
          subject: selectedSubject,
          examType: selectedExamType,
          difficulty: selectedDifficulty,
          search: searchQuery, // Use the direct searchQuery
        },
      });
      const exams = response.data.data;
      return {
        exams,
        nextPage: exams.length === itemsPerPage ? pageParam + 1 : undefined,
      };
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exams. Please try again.");
      throw error;
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "exams",
      {
        selectedSubject,
        selectedExamType,
        selectedDifficulty,
        selectedDate,
        searchQuery, // The query key now uses the direct searchQuery
      },
    ],
    queryFn: fetchExams,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleSearch = () => {
    // This will trigger a re-fetch of the query due to the change in the queryKey.
    // The queryKey now directly depends on the searchQuery state, which is updated
    // by the user and then used to refetch when refetch() is called.
    refetch();
  };

  const clearAllFilters = () => {
    setSelectedSubject("All Subjects");
    setSelectedExamType("All Types");
    setSelectedDifficulty("All Levels");
    setSelectedDate("All Dates");
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedSubject !== "All Subjects") count++;
    if (selectedExamType !== "All Types") count++;
    if (selectedDifficulty !== "All Levels") count++;
    if (selectedDate !== "All Dates") count++;
    if (searchQuery.trim()) count++;
    return count;
  };

  if (isLoading)
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  const allExams = data ? data.pages.flatMap((page) => page.exams) : [];

  return (
    <div className={styles.availableExams}>
      <Container size="xl" py="xl">
        <div className={styles.headerSection}>
          <Group justify="space-between" align="center" mb="xl">
            <Box>
              <Title order={1} className={styles.pageTitle}>
                Exams
              </Title>
            </Box>
            <Button
              leftSection={<IconPlus size={18} />}
              className={styles.addButton}
              onClick={() => setOpenCreateModal(true)}
              size="md"
            >
              Add Exam
            </Button>
          </Group>
        </div>
        <Paper className={styles.searchFilterCard} p="md" mb="xl" shadow="xs">
          <Stack gap="md">
            <Group>
              <SearchBar
                variant="filled"
                placeholder="Search exams..."
                value={searchQuery}
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery("")}
                size="md"
              />
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Group>
            <Group gap="sm" className={styles.filterRow}>
              <Select
                placeholder="All Dates"
                data={["All Dates", "Today", "This Week", "This Month"]}
                value={selectedDate}
                onChange={setSelectedDate}
                className={styles.filterSelect}
                size="sm"
                leftSection={<IconCalendar size={16} />}
              />
              <Select
                placeholder="All Subjects"
                data={subjects}
                value={selectedSubject}
                onChange={setSelectedSubject}
                className={styles.filterSelect}
                size="sm"
                leftSection={<IconBook size={16} />}
              />
              <Select
                placeholder="All Exam Types"
                data={examTypes}
                value={selectedExamType}
                onChange={setSelectedExamType}
                className={styles.filterSelect}
                size="sm"
              />
              {/* <Select
                  placeholder="All Levels"
                  data={difficulties}
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  className={styles.filterSelect}
                  size="sm"
                  leftSection={<IconTrendingUp size={16} />}
                /> */}
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="light"
                  onClick={clearAllFilters}
                  className={styles.clearButton}
                  size="sm"
                  leftSection={<IconX size={14} />}
                >
                  Clear ({getActiveFilterCount()})
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
        <ExamCreationForm
          opened={openCreateModal}
          date={date || null}
          onClose={() => {
            setOpenCreateModal(false);
            searchParams.delete("create");
            searchParams.delete("date");
            setSearchParams(searchParams);
          }}
        />
        {allExams.length === 0 ? (
          <NoData />
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="lg"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            className={styles.examGrid}
          >
            {allExams.map((exam) => (
              <ExamCard exam={exam} key={exam.examId} />
            ))}
          </SimpleGrid>
        )}
        <div className={styles.paginationContainer} ref={ref}>
          {isFetchingNextPage && (
            <Center>
              <Loader />
            </Center>
          )}
          {!hasNextPage && !isFetchingNextPage && allExams.length !== 0 && (
            <p>You have viewed all the exams!</p>
          )}
        </div>
      </Container>
    </div>
  );
}
