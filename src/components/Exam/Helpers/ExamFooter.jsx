import { Button, Container, Group } from "@mantine/core";
import { IconBookmark, IconCheck, IconX } from "@tabler/icons-react";

const ExamFooter = ({
  answers,
  getCurrentQuestionKey,
  markedForReview,
  handleClearResponse,
  handleMarkForReview,
  handleMarkAndNext,
  handleSaveAndNext,
  handleSubmit,
}) => (
  <div className="exam-footer">
    <Container fluid>
      <Group justify="space-between" align="center">
        <Group gap="md">
          <Button
            variant="light"
            color="gray"
            size="md"
            onClick={handleClearResponse}
            disabled={answers[getCurrentQuestionKey()] === undefined}
            leftSection={<IconX size={16} />}
          >
            Clear Response
          </Button>
        </Group>

        <Group gap="md">
          <Button
            variant="light"
            color="orange"
            size="md"
            onClick={handleMarkAndNext}
            leftSection={<IconBookmark size={16} />}
          >
            Mark & Next
          </Button>
          <Button
            variant="light"
            color="orange"
            size="sm"
            onClick={handleMarkForReview}
            leftSection={<IconBookmark size={16} />}
          >
            {markedForReview.has(getCurrentQuestionKey())
              ? "Unmark"
              : "Mark for Review"}
          </Button>

          <Button
            size="md"
            onClick={handleSaveAndNext}
            leftSection={<IconCheck size={16} />}
          >
            Save & Next
          </Button>

          <Button
            size="md"
            color="red"
            variant="filled"
            onClick={handleSubmit}
            leftSection={<IconCheck size={16} />}
          >
            Submit Exam
          </Button>
        </Group>
      </Group>
    </Container>
  </div>
);

export default ExamFooter;
