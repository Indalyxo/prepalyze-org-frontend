"use client"

import { useState } from "react"
import {
  Container,
  Title,
  Button,
  Stack,
  Select,
  Pagination,
  TextInput,
  SimpleGrid,
  Group,
  LoadingOverlay,
  Paper,
  ActionIcon,
  Box,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconSearch, IconPlus, IconX, IconCalendar, IconBook, IconTrendingUp } from "@tabler/icons-react"
import styles from "./ViewExamsPage.module.scss"
import { useNavigate } from "react-router-dom"
import ExamCreationForm from "../../../components/Exam/ExamCreationForm/ExamCreationForm"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import apiClient from "../../../utils/api"
import ExamCard from "../../../components/Generics/ExamCard/ExamCard"
import { SearchBar } from "../../../components/Generics/Searchbar/Searchbar"

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Botany", "Zoology"]
const examTypes = ["NEET-UG", "JEE-MAINS"]
const difficulties = ["All Levels", "Easy", "Medium", "Hard"]

export default function ViewExamsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedExamType, setSelectedExamType] = useState("All Types")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [searchQuery, setSearchQuery] = useState("")
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("All Dates")

  const navigate = useNavigate()

  const fetchExams = async (page) => {
    try {
      const response = await apiClient.get("/api/exam", {
        params: { page, itemsPerPage },
      })

      console.log(response)
      return response.data.data
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch exams. Please try again.")
      throw error
    }
  }

  const {
    data: exams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["GET_EXAMS"],
    queryFn: fetchExams,
  })

  const itemsPerPage = 6
  const totalPages = Math.ceil(exams?.length ?? 0 / itemsPerPage)

  const clearAllFilters = () => {
    setSelectedSubject("All Subjects")
    setSelectedExamType("All Types")
    setSelectedDifficulty("All Levels")
    setSelectedDate("All Dates")
    setSearchQuery("")
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedSubject !== "All Subjects") count++
    if (selectedExamType !== "All Types") count++
    if (selectedDifficulty !== "All Levels") count++
    if (selectedDate !== "All Dates") count++
    if (searchQuery.trim()) count++
    return count
  }

  if (isLoading)
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    )

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
            {/* Search Bar */}
            {/* <TextInput
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={18} />}
              rightSection={
                searchQuery && (
                  <ActionIcon variant="subtle" onClick={() => setSearchQuery("")} size="sm">
                    <IconX size={14} />
                  </ActionIcon>
                )
              }
              className={styles.searchInput}
              size="md"
            /> */}

              <SearchBar variant="filled" placeholder="Search exams..." onSearch={setSearchQuery} onClear={() => setSearchQuery("")} size="md" />
            {/* Inline Filter Row */}
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
                data={subjects.map((s) => (s === "All" ? "All Subjects" : s))}
                value={selectedSubject}
                onChange={setSelectedSubject}
                className={styles.filterSelect}
                size="sm"
                leftSection={<IconBook size={16} />}
              />

              <Select
                placeholder="All Types"
                data={["All Types", ...examTypes]}
                value={selectedExamType}
                onChange={setSelectedExamType}
                className={styles.filterSelect}
                size="sm"
              />

              <Select
                placeholder="All Levels"
                data={difficulties}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                className={styles.filterSelect}
                size="sm"
                leftSection={<IconTrendingUp size={16} />}
              />

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

        <ExamCreationForm opened={openCreateModal} onClose={() => setOpenCreateModal(false)} />

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" className={styles.examGrid}>
          {exams?.map((exam) => (
            <ExamCard exam={exam} key={exam.examId} />
          ))}
        </SimpleGrid>

        <div className={styles.paginationContainer}>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            className={styles.pagination}
            size="md"
          />
        </div>
      </Container>
    </div>
  )
}
