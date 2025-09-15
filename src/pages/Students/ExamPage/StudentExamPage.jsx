import {
  Container,
  Title,
  SimpleGrid,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import styles from "./student-exam-page.module.scss";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";
import ExamCard from "../../../components/Generics/ExamCard/ExamCard";
import NoData from "../../../components/Generics/NoData";

export default function ViewStudentsExamsPage() {
  const fetchExams = async (page) => {
    try {
      const response = await apiClient.get("/api/exam/student", {
        params: { page, itemsPerPage },
      });

      return response.data.exams;
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
          </Group>
        </div>

        {exams?.length === 0 ? (
          <NoData message="Currently, no exams are available for you." />
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="lg"
            className={styles.examGrid}
          >
            {exams.map((exam) => (
              <ExamCard exam={exam} route="student" key={exam.examId} />
            ))}
          </SimpleGrid>
        )}

        {/* <div className={styles.paginationContainer}>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            className={styles.pagination}
          />
        </div> */}
      </Container>
    </div>
  );
}
