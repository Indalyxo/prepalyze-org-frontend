import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconCalendar,
} from "@tabler/icons-react";
import styles from "./student-exam-page.module.scss";
import { useNavigate } from "react-router-dom";
import { getIcons } from "../../../utils/get-ui";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";

export default function ViewStudentsExamsPage() {
  const navigate = useNavigate();

  const fetchExams = async (page) => {
    try {
      const response = await apiClient.get("/api/exam/student", {
        params: { page, itemsPerPage },
      });

      console.log(response);
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

        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="lg"
          className={styles.examGrid}
        >
          {exams.map((exam) => (
            <Card key={exam.id} className={`${styles.examCard}`} radius="md">
              <div
                className={styles.cardHeader}
                style={{
                  backgroundImage: `url(/images/${exam.subjects[0].toLowerCase()}.webp)`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition:
                    exam.subjects[0] === "Physics" ? "40% 40%" : "40% 10%",
                }}
              >
                <div className={styles.iconContainer}>
                  {getIcons(exam.subjects[0], styles)}
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardContent}>
                  <Title order={4} className={styles.examTitle} mb="xs">
                    {exam.examTitle}
                  </Title>

                  <Text size="sm" className={styles.examDuration} mb="xs">
                    Exam Duration about: {exam?.duration || "N/A"}
                  </Text>

                  <Group gap="md" mb="sm">
                    <Text size="sm" className={styles.examInfo}>
                      System Admin
                    </Text>
                    <Text size="sm" className={styles.examInfo}>
                      Total {exam.chapters.length} Chapters
                    </Text>
                  </Group>

                  <Group gap="xs" align="center" mb="md">
                    <IconCalendar size={14} />
                    <Text size="sm" className={styles.createdDate}>
                      Created on {exam?.createdAt || "N/A"}
                    </Text>
                  </Group>
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    variant="subtle"
                    fullWidth
                    className={styles.viewMoreButton}
                    onClick={() =>
                      navigate(`/organization/exams/details/${exam.examId}`)
                    }
                  >
                    View More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>

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
