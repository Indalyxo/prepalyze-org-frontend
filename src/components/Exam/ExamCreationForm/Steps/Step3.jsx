import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Divider,
  Box,
  Grid,
} from "@mantine/core";

const Step3 = ({
  formData,
  availableTopics,
  availableChapters,
  availableSubjects,
}) => (
  <Stack gap="md">
    <Text size="xl" fw={600} mb="md">
      Marks & Grading
    </Text>

    <Card withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Total Questions:</Text>
          <Badge size="lg" variant="filled" color="blue">
            {formData.totalQuestions}
          </Badge>
        </Group>
        <Group justify="space-between">
          <Text fw={500}>Total Marks:</Text>
          <Badge size="lg" variant="filled" color="green">
            {formData.totalMarks}
          </Badge>
        </Group>
        <Divider />
        <Box>
          <Text size="sm" fw={500} mb="xs">
            Marking Scheme:
          </Text>
          <Text size="sm" c="dimmed">
            {formData.examCategory === "JEE-MAIN" &&
              "JEE: +4 for correct, -1 for incorrect"}
            {formData.examCategory === "NEET-UG" &&
              "NEET: +4 for correct, -1 for incorrect"}
            {formData.examCategory === "Custom" &&
              "Custom: +1 for correct, 0 for incorrect"}
            {!formData.examCategory &&
              "Please select exam category to see marking scheme"}
          </Text>
        </Box>

        {/* Question type breakdown */}
        <Box>
          <Text size="sm" fw={500} mb="xs">
            Question Type Breakdown:
          </Text>
          <Grid>
            <Grid.Col span={4}>
              <Card withBorder p="sm">
                <Text size="sm" ta="center">
                  MCQ:{" "}
                  {Object.values(formData.topicQuestionCounts || {}).reduce(
                    (sum, counts) => sum + (counts?.mcq || 0),
                    0
                  )}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder p="sm">
                <Text size="sm" ta="center">
                  A&R:{" "}
                  {Object.values(formData.topicQuestionCounts || {}).reduce(
                    (sum, counts) => sum + (counts?.assertionReason || 0),
                    0
                  )}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder p="sm">
                <Text size="sm" ta="center">
                  Numerical:{" "}
                  {Object.values(formData.topicQuestionCounts || {}).reduce(
                    (sum, counts) => sum + (counts?.numerical || 0),
                    0
                  )}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>

        {Object.keys(formData.topicQuestionCounts || {}).length > 0 && (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Topic-wise Breakdown:
            </Text>
            <Stack gap="xs">
              {Object.entries(formData.topicQuestionCounts || {}).map(
                ([topicId, counts]) => {
                  const totalQuestions =
                    (counts?.mcq || 0) +
                    (counts?.assertionReason || 0) +
                    (counts?.numerical || 0);
                  if (totalQuestions === 0) return null;

                  // Find topic data
                  let topicData = null;
                  let subjectData = null;
                  for (const [chapterId, topics] of Object.entries(
                    availableTopics
                  )) {
                    const foundTopic = topics.find((t) => t.value === topicId);
                    if (foundTopic) {
                      topicData = foundTopic;
                      // Find subject for this chapter
                      for (const [subjectId, chapters] of Object.entries(
                        availableChapters
                      )) {
                        if (chapters.some((c) => c.value === chapterId)) {
                          subjectData = availableSubjects.find(
                            (s) => s.value === subjectId
                          );
                          break;
                        }
                      }
                      break;
                    }
                  }

                  return (
                    <Group key={topicId} justify="space-between">
                      <Text size="sm">
                        {subjectData?.label || "Unknown Subject"} -{" "}
                        {topicData?.label || "Unknown Topic"}:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {totalQuestions} questions (MCQ: {counts?.mcq || 0},
                        A&R: {counts?.assertionReason || 0}, Num:{" "}
                        {counts?.numerical || 0})
                      </Text>
                    </Group>
                  );
                }
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  </Stack>
);

export default Step3;
