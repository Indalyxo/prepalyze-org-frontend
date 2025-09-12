import React from "react";
import {
  Accordion,
  Box,
  MultiSelect,
  NumberInput,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";

const Step2 = ({
  formData,
  stepErrors,
  handleInputChange,
  renderSubjectConfiguration,
  setFormData,
}) => {
  const [availableSubjects] = useState([
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
  ]);

  useEffect(() => {
    const validChapters = formData.selectedChapters.filter((chapterId) => {
      return formData.selectedSubjects.some((subjectId) => {
        const chapters = availableChapters[subjectId] || [];
        return chapters.some((chapter) => chapter.value === chapterId);
      });
    });

    const validTopics = formData.selectedTopics.filter((topicId) => {
      return validChapters.some((chapterId) => {
        const topics = availableTopics[chapterId] || [];
        return topics.some((topic) => topic.value === topicId);
      });
    });

    if (
      validChapters.length !== formData.selectedChapters.length ||
      validTopics.length !== formData.selectedTopics.length
    ) {
      // Also clean up topic question counts for invalid topics
      const newTopicQuestionCounts = { ...formData.topicQuestionCounts };
      let countsChanged = false;

      Object.keys(newTopicQuestionCounts).forEach((topicId) => {
        if (!validTopics.includes(topicId)) {
          delete newTopicQuestionCounts[topicId];
          countsChanged = true;
        }
      });

      setFormData((prev) => ({
        ...prev,
        selectedChapters: validChapters,
        selectedTopics: validTopics,
        ...(countsChanged
          ? { topicQuestionCounts: newTopicQuestionCounts }
          : {}),
      }));
    }
  }, [
    formData.selectedSubjects,
    formData.selectedChapters,
    availableChapters,
    availableTopics,
  ]);

  const renderSubjectConfiguration = (subjectId) => {
    const subject = availableSubjects.find((s) => s.value === subjectId);
    const subjectChapters = availableChapters[subjectId] || [];

    return (
      <Box>
        <Text size="lg" fw={500} mb="md">
          {subject?.label}
        </Text>

        <Accordion multiple variant="contained">
          {subjectChapters.map((chapter) => {
            const chapterTopics = availableTopics[chapter.value] || [];
            const selectedTopicsForChapter =
              formData.selectedTopics?.filter((topicId) =>
                chapterTopics.some((topic) => topic.value === topicId)
              ) || [];

            return (
              <Accordion.Item key={chapter.value} value={chapter.value}>
                <Accordion.Control>
                  <Group justify="space-between" pr="md">
                    <Text fw={500}>{chapter.label}</Text>
                    <Badge variant="light" size="sm">
                      {selectedTopicsForChapter.length} topics selected
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" fw={500} mb="xs">
                      Select Topics:
                    </Text>

                    {chapterTopics.map((topic) => {
                      const isSelected =
                        formData.selectedTopics?.includes(topic.value) || false;
                      const questionCount =
                        formData.topicQuestionCounts?.[topic.value] || 0;
                      const totalAvailable = topic.totalQuestions || 50; // Mock data - replace with actual count

                      return (
                        <Box
                          key={`topic-${topic.value}`}
                          className="topic-checkbox-container"
                          p="sm"
                          style={{
                            border: "1px solid #e9ecef",
                            borderRadius: "4px",
                          }}
                        >
                          <Group justify="space-between" align="flex-start">
                            <Box style={{ flex: 1 }}>
                              <Checkbox
                                label={topic.label}
                                checked={isSelected}
                                onChange={(event) => {
                                  const newSelectedTopics = event.currentTarget
                                    .checked
                                    ? [
                                        ...(formData.selectedTopics || []),
                                        topic.value,
                                      ]
                                    : (formData.selectedTopics || []).filter(
                                        (id) => id !== topic.value
                                      );


                                  // FIXED: Update both selectedTopics and topicQuestionCounts in a single state update
                                  setFormData((prev) => {

                                    const newCounts = {
                                      ...prev.topicQuestionCounts,
                                    };

                                    if (!event.currentTarget.checked) {
                                      // Remove count when unchecking
                                      delete newCounts[topic.value];
                                    }

                                    const newState = {
                                      ...prev,
                                      selectedTopics: newSelectedTopics,
                                      topicQuestionCounts: newCounts,
                                    };

                                    return newState;
                                  });
                                }}
                              />
                              <Text size="xs" c="dimmed" mt={4}>
                                Available: {totalAvailable} questions (MCQ:{" "}
                                {Math.floor(totalAvailable * 0.6)}, A&R:{" "}
                                {Math.floor(totalAvailable * 0.3)}, Numerical:{" "}
                                {Math.floor(totalAvailable * 0.1)})
                              </Text>
                            </Box>

                            <Box
                              style={{
                                minWidth: "120px",
                                visibility: isSelected ? "visible" : "hidden",
                              }}
                            >
                              <NumberInput
                                label="Questions"
                                placeholder="0"
                                value={questionCount}
                                onChange={(value) => {
                                  const newCounts = {
                                    ...formData.topicQuestionCounts,
                                    [topic.value]: Math.min(
                                      value || 0,
                                      totalAvailable
                                    ),
                                  };
                                  handleInputChange(
                                    "topicQuestionCounts",
                                    newCounts
                                  );
                                }}
                                min={0}
                                max={totalAvailable}
                                size="sm"
                                disabled={!isSelected}
                              />
                            </Box>
                          </Group>
                        </Box>
                      );
                    })}

                    {/* Chapter Summary */}
                    {selectedTopicsForChapter.length > 0 && (
                      <Box
                        mt="md"
                        p="sm"
                        style={{
                          backgroundColor: "rgba(34, 139, 34, 0.1)",
                          borderRadius: "4px",
                        }}
                      >
                        <Text size="sm" fw={500} c="green">
                          Chapter Total:{" "}
                          {selectedTopicsForChapter.reduce(
                            (sum, topicId) =>
                              sum +
                              (formData.topicQuestionCounts?.[topicId] || 0),
                            0
                          )}{" "}
                          questions
                        </Text>
                      </Box>
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>

        {/* Subject Summary */}
        <Box
          mt="lg"
          p="md"
          style={{
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Text size="md" fw={500} c="blue" mb="xs">
            {subject?.label} Summary
          </Text>
          <Group>
            <Text size="sm">
              Total Questions:{" "}
              {Object.entries(formData.topicQuestionCounts || {})
                .filter(([topicId]) => {
                  // Check if this topic belongs to current subject
                  return subjectChapters.some((chapter) =>
                    (availableTopics[chapter.value] || []).some(
                      (topic) => topic.value === topicId
                    )
                  );
                })
                .reduce((sum, [, count]) => sum + count, 0)}
            </Text>
            <Text size="sm">
              Topics Selected:{" "}
              {
                (formData.selectedTopics || []).filter((topicId) =>
                  subjectChapters.some((chapter) =>
                    (availableTopics[chapter.value] || []).some(
                      (topic) => topic.value === topicId
                    )
                  )
                ).length
              }
            </Text>
          </Group>
        </Box>
      </Box>
    );
  };

  return (
    <Stack gap="md">
      <Text size="xl" fw={600} mb="md">
        Questions Setup
      </Text>

      {/* Step 1: Select Subjects */}
      <MultiSelect
        label="Select Subjects"
        placeholder="Choose subjects for the exam"
        value={formData.selectedSubjects}
        onChange={(value) => handleInputChange("selectedSubjects", value)}
        error={stepErrors.selectedSubjects}
        data={availableSubjects}
        required
      />

      {/* Step 2: Configure Questions by Subject using Tabs */}
      {formData.selectedSubjects.length > 0 && (
        <Box mt="md">
          <Title order={4} mb="md">
            Configure Questions by Subject
          </Title>

          {formData.selectedSubjects.length === 1 ? (
            // Single subject - no tabs needed
            <Box>
              {renderSubjectConfiguration(formData.selectedSubjects[0])}
            </Box>
          ) : (
            // Multiple subjects - use tabs
            <Tabs
              variant="outline"
              value={tabValue}
              onChange={(value) => {
                setTabValue(value);
              }}
            >
              <Tabs.List>
                {formData.selectedSubjects.map((subjectId) => {
                  const subject = availableSubjects.find(
                    (s) => s.value === subjectId
                  );
                  return (
                    <Tabs.Tab key={subjectId} value={subjectId}>
                      {subject?.label}
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>

              {formData.selectedSubjects.map((subjectId) => (
                <Tabs.Panel key={subjectId} value={subjectId} pt="md">
                  {renderSubjectConfiguration(subjectId)}
                </Tabs.Panel>
              ))}
            </Tabs>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default Step2;
