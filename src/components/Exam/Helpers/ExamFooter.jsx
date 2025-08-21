import { Container, Group, Button } from "@mantine/core";
import { IconCheck, IconFlag, IconTrash, IconSend } from "@tabler/icons-react";

const ExamFooter = ({
  answers,
  getCurrentQuestionKey,
  markedForReview,
  handleClearResponse,
  handleMarkForReview,
  handleMarkAndNext,
  handleSaveAndNext,
  handleSubmit,
}) => {
  const currentKey = getCurrentQuestionKey();
  const isAnswered = answers[currentKey] !== undefined;
  const isMarked = markedForReview.has(currentKey);

  return (
    <div className="exam-footer">
      <Container fluid>
        <Group justify="space-between">
          <Group>
            <Button
              variant="outline"
              leftSection={<IconTrash size={16} />}
              onClick={handleClearResponse}
              disabled={!isAnswered}
            >
              Clear Response
            </Button>

            <Button
              variant={isMarked ? "filled" : "outline"}
              leftSection={<IconFlag size={16} />}
              onClick={handleMarkForReview}
              color={isMarked ? "yellow" : "blue"}
            >
              {isMarked ? "Unmark" : "Mark for Review"}
            </Button>
          </Group>

          <Group>
            <Button
              variant="outline"
              leftSection={<IconFlag size={16} />}
              onClick={handleMarkAndNext}
              color="yellow"
            >
              Mark & Next
            </Button>

            <Button
              leftSection={<IconCheck size={16} />}
              onClick={handleSaveAndNext}
            >
              Save & Next
            </Button>

            <Button
              variant="filled"
              color="red"
              leftSection={<IconSend size={16} />}
              onClick={handleSubmit}
            >
              Submit Exam
            </Button>
          </Group>
        </Group>
      </Container>
    </div>
  );
};

export default ExamFooter;
