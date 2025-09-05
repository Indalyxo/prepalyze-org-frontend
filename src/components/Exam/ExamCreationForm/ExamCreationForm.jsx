import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Stack,
  Text,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Box,
  Progress,
  Badge,
  NumberInput,
  Checkbox,
  MultiSelect,
  Alert,
  Divider,
  Card,
  Accordion,
  Title,
  Tabs,
  Grid,
} from "@mantine/core";
import {
  IconCheck,
  IconFileText,
  IconUsers,
  IconQuestionMark,
  IconCalculator,
  IconSend,
  IconAlertCircle,
} from "@tabler/icons-react";
import ModalFrame from "../../Modals/ModalFrame";
import "./exam-creation-form.scss";
import {
  examMetadataSchema,
  finalizeSchema,
  marksGradingSchema,
  participantsSchema,
  questionsSetupSchema,
  completeFormSchema,
} from "../../../utils/Schemas/createExamFormSchema";
import Step0 from "./Steps/Step0";
import Step1 from "./Steps/Step1";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";
import dayjs from "dayjs";

const initialFormData = {
  // Exam Metadata
  examTitle: "",
  subtitle: "",
  instructions: "",
  examDate: null,
  duration: 60,
  examType: "",
  examMode: "",
  examCategory: "",

  // Participants
  selectedGroups: [],

  // Questions Setup
  selectedSubjects: [],
  selectedChapters: [],
  selectedTopics: [],
  topicQuestionCounts: {}, // Changed structure: { topicId: { mcq: 0, assertionReason: 0, numerical: 0 } }
  questionCounts: {},

  // Marks & Grading
  totalQuestions: 0,
  totalMarks: 0,

  // Finalize
  confirmed: false,
};
const ExamCreationForm = ({ opened, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [tabValue, setTabValue] = useState("");
  const queryClient = useQueryClient();

  const fetchExamData = async () => {
    try {
      const response = await apiClient.get("/api/exam/data");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exam data");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_EXAM_DATA"],
    queryFn: fetchExamData,
  });

  const [availableGroups, setAvailableGroups] = useState([]);

  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [availableChapters, setAvailableChapters] = useState({});

  const [availableTopics, setAvailableTopics] = useState({});

  useEffect(() => {
    if (data) {
      console.log(data);
      setAvailableChapters(data.availableChapters);
      setAvailableGroups(data.groups);
      setAvailableSubjects(data.availableSubjects);
      setAvailableTopics(data.availableTopics);
    }
  }, [data]);

  // Calculate totals when topic question counts change
  useEffect(() => {
    let totalQuestions = 0;
    let totalMarks = 0;

    Object.entries(formData.topicQuestionCounts).forEach(
      ([topicId, counts]) => {
        if (counts && typeof counts === "object") {
          totalQuestions +=
            (counts.mcq || 0) +
            (counts.assertionReason || 0) +
            (counts.numerical || 0);
        }
      }
    );

    const markingScheme = {
      "JEE-MAINS": { mcq: 4, assertionReason: 4, numerical: 4, negative: -1 },
      "NEET-UG": { mcq: 4, assertionReason: 4, numerical: 4, negative: -1 },
      Custom: { mcq: 1, assertionReason: 1, numerical: 1, negative: 0 },
    };

    const scheme =
      markingScheme[formData.examCategory] || markingScheme["Custom"];

    Object.entries(formData.topicQuestionCounts).forEach(
      ([topicId, counts]) => {
        if (counts && typeof counts === "object") {
          totalMarks += (counts.mcq || 0) * scheme.mcq;
          totalMarks += (counts.assertionReason || 0) * scheme.assertionReason;
          totalMarks += (counts.numerical || 0) * scheme.numerical;
        }
      }
    );

    setFormData((prev) => ({
      ...prev,
      totalQuestions,
      totalMarks,
    }));
  }, [formData.topicQuestionCounts, formData.examCategory]);

  // Manage tab selection
  useEffect(() => {
    if (formData.selectedSubjects.length > 0) {
      if (!tabValue || !formData.selectedSubjects.includes(tabValue)) {
        setTabValue(formData.selectedSubjects[0]);
      }
    } else {
      setTabValue("");
    }
  }, [formData.selectedSubjects, tabValue]);

  // Auto-select chapters based on selected topics
  useEffect(() => {
    const chaptersToSelect = [];

    (formData.selectedTopics || []).forEach((topicId) => {
      for (const [chapterId, topics] of Object.entries(availableTopics)) {
        if (topics.some((topic) => topic.value === topicId)) {
          if (!chaptersToSelect.includes(chapterId)) {
            chaptersToSelect.push(chapterId);
          }
          break;
        }
      }
    });

    if (
      JSON.stringify(chaptersToSelect.sort()) !==
      JSON.stringify((formData.selectedChapters || []).sort())
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedChapters: chaptersToSelect,
      }));
    }
  }, [formData.selectedTopics, availableTopics, formData.selectedChapters]);

  // Clean up invalid selections
  useEffect(() => {
    const validChapters = (formData.selectedChapters || []).filter(
      (chapterId) => {
        return (formData.selectedSubjects || []).some((subjectId) => {
          const chapters = availableChapters[subjectId] || [];
          return chapters.some((chapter) => chapter.value === chapterId);
        });
      }
    );

    const validTopics = (formData.selectedTopics || []).filter((topicId) => {
      return validChapters.some((chapterId) => {
        const topics = availableTopics[chapterId] || [];
        return topics.some((topic) => topic.value === topicId);
      });
    });

    if (
      validChapters.length !== (formData.selectedChapters || []).length ||
      validTopics.length !== (formData.selectedTopics || []).length
    ) {
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
  }, [formData.selectedSubjects, availableChapters, availableTopics]);

  const validateStep = (stepIndex) => {
    const errors = {};

    switch (stepIndex) {
      case 0:
        if (!formData.examTitle?.trim())
          errors.examTitle = "Exam title is required";
        if (!formData.examCategory)
          errors.examCategory = "Exam category is required";
        if (!formData.examDate) errors.examDate = "Exam date is required";
        if (!formData.examType) errors.examType = "Exam type is required";
        if (!formData.examMode) errors.examMode = "Exam mode is required";
        if (!formData.instructions?.trim())
          errors.instructions = "Instructions are required";
        if (formData.duration < 30)
          errors.duration = "Duration must be at least 30 minutes";
        break;

      case 1:
        if ((formData.selectedGroups || []).length === 0) {
          errors.selectedGroups = "At least one group must be selected";
        }
        break;

      case 2:
        if ((formData.selectedSubjects || []).length === 0) {
          errors.selectedSubjects = "At least one subject must be selected";
        }

        const hasQuestionsSelected = Object.values(
          formData.topicQuestionCounts || {}
        ).some((counts) => {
          if (counts && typeof counts === "object") {
            return (
              (counts.mcq || 0) +
                (counts.assertionReason || 0) +
                (counts.numerical || 0) >
              0
            );
          }
          return false;
        });

        if (!hasQuestionsSelected) {
          errors.selectedTopics =
            "Please select at least one topic and specify question count";
        }
        break;

      case 3:
        if (formData.totalQuestions < 1)
          errors.totalQuestions = "Must have at least one question";
        if (formData.totalMarks < 1)
          errors.totalMarks = "Must have at least one mark";
        break;

      case 4:
        if (!formData.confirmed)
          errors.confirmed = "Please confirm to create the exam";
        break;
    }

    setErrors((prev) => ({ ...prev, [`step_${stepIndex}`]: errors }));
    return Object.keys(errors).length === 0;
  };

  const validateField = (field, value) => {
    // Simple field validation - you can enhance this as needed
    setErrors((prev) => ({
      ...prev,
      [`step_${currentStep}`]: {
        ...(prev[`step_${currentStep}`] || {}),
        [field]: undefined,
      },
    }));
  };

  const handleInputChange = (field, value) => {
    console.log(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleStepClick = (stepIndex) => {
    if (
      stepIndex <= currentStep ||
      (stepIndex === currentStep + 1 && validateStep(currentStep))
    ) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const transformToFinalStructure = (formData) => {
    const result = [];

    Object.entries(formData.topicQuestionCounts || {}).forEach(
      ([topicId, questionCounts]) => {
        // Skip if no questions selected for this topic
        const totalQuestions =
          (questionCounts?.mcq || 0) +
          (questionCounts?.assertionReason || 0) +
          (questionCounts?.numerical || 0);
        if (totalQuestions === 0) return;

        // Find topic, chapter, and subject information
        let topicData = null;
        let chapterData = null;
        let subjectData = null;

        // Find the topic in availableTopics
        for (const [chapterId, topics] of Object.entries(availableTopics)) {
          const foundTopic = topics.find((topic) => topic.value === topicId);
          if (foundTopic) {
            topicData = foundTopic;

            // Find the chapter
            for (const [subjectId, chapters] of Object.entries(
              availableChapters
            )) {
              const foundChapter = chapters.find(
                (chapter) => chapter.value === chapterId
              );
              if (foundChapter) {
                chapterData = foundChapter;

                // Find the subject
                subjectData = availableSubjects.find(
                  (subject) => subject.value === subjectId
                );
                break;
              }
            }
            break;
          }
        }

        // Add to result array
        result.push({
          topic: topicData?.label || "Unknown Topic",
          subject: subjectData?.label || "Unknown Subject",
          chapter: chapterData?.label || "Unknown Chapter",
          questions_counts: {
            mcq: questionCounts?.mcq || 0,
            assertionReason: questionCounts?.assertionReason || 0,
            numerical: questionCounts?.numerical || 0,
            total: totalQuestions,
          },
        });
      }
    );

    return result;
  };

  function processExamData(input) {
    // Convert examDate + duration → start and end timing
    const start = dayjs(input.examDate);
    const end = start.add(input.duration, "minute");

    return {
      examTitle: input.examTitle,
      subtitle: input.subtitle,
      instructions: input.instructions,
      examType: input.examType,
      examMode: input.examMode,
      examCategory: input.examCategory,
      duration: input.duration,
      groups: input.selectedGroups || [],
      subjects: input.selectedSubjects || [],
      chapters: input.selectedChapters || [],
      topics: input.selectedTopics || [],
      topicQuestionCounts: input.topicQuestionCounts || {},
      totalQuestions: input.totalQuestions,
      totalMarks: input.totalMarks,
      confirmed: input.confirmed || false,

      timing: {
        start: start.toISOString(), // string instead of Date
        end: end.toISOString(),
      },
    };
  }

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationKey: ["exam-create"],
    mutationFn: async () => {
      const validatedData = completeFormSchema.parse(formData);

      const res = await apiClient.post("/api/exam/", {
        ...processExamData(formData),
        questionData: transformToFinalStructure(formData) || [],
      });

      toast.success("Exam created successfully!");
      handleClose();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["GET_EXAMS"]);
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        const allErrors = {};
        error.issues.forEach((err) => {
          const stepIndex = steps.findIndex((step) =>
            Object.keys(step.schema.shape).includes(err.path[0])
          );
          if (stepIndex !== -1) {
            if (!allErrors[`step_${stepIndex}`]) {
              allErrors[`step_${stepIndex}`] = {};
            }
            const path = err.path.join(".");
            allErrors[`step_${stepIndex}`][path] = err.message;
          }
        });
        toast.error("Validation failed. Please check the form.");
        setErrors(allErrors);
      }
    },

  });

  const handleSaveDraft = () => {
    console.log("Exam saved as draft:", formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setErrors({});
    setTabValue("");
    onClose();
  };

  const getCurrentStepErrors = () => {
    return errors[`step_${currentStep}`] || {};
  };

  const renderSubjectConfiguration = (subjectId) => {
    console.log(subjectId, "<--");
    const subject = availableSubjects.find((s) => s.value === subjectId);
    const subjectChapters = availableChapters[subjectId] || [];
    console.log({ subjectChapters });
    return (
      <Box>
        <Text size="lg" fw={500} mb="md">
          {subject?.label}
        </Text>

        <Accordion multiple variant="contained">
          {subjectChapters.map((chapter) => {
            const chapterTopics = availableTopics[chapter.value] || [];
            const selectedTopicsForChapter = (
              formData.selectedTopics || []
            ).filter((topicId) =>
              chapterTopics.some((topic) => topic.value === topicId)
            );
            console.log({
              chapterTopics,
              selectedTopicsForChapter,
              availableTopics,
            });
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
                      const isSelected = (
                        formData.selectedTopics || []
                      ).includes(topic.value);
                      const questionCounts = formData.topicQuestionCounts?.[
                        topic.value
                      ] || { mcq: 0, assertionReason: 0, numerical: 0 };
                      const totalAvailable = topic.totalQuestions || {
                        mcq: 30,
                        assertionReason: 15,
                        numerical: 5,
                      };

                      console.log(topic);

                      return (
                        <Box
                          key={`topic-${topic.value}`}
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

                                  const newCounts = {
                                    ...formData.topicQuestionCounts,
                                  };
                                  if (!event.currentTarget.checked) {
                                    delete newCounts[topic.value];
                                  }

                                  setFormData((prev) => ({
                                    ...prev,
                                    selectedTopics: newSelectedTopics,
                                    topicQuestionCounts: newCounts,
                                  }));
                                }}
                              />
                              <Text size="xs" c="dimmed" mt={4}>
                                Available: MCQ: {totalAvailable.mcq}, A&R:{" "}
                                {totalAvailable.assertionReason}, Numerical:{" "}
                                {totalAvailable.numerical}
                              </Text>
                            </Box>

                            {isSelected && (
                              <Box style={{ minWidth: "300px" }}>
                                <Text size="sm" fw={500} mb="xs">
                                  Question Types:
                                </Text>
                                <Grid>
                                  <Grid.Col span={4}>
                                    <NumberInput
                                      label="MCQ"
                                      placeholder="0"
                                      value={questionCounts.mcq || 0}
                                      onChange={(value) => {
                                        const newCounts = {
                                          ...formData.topicQuestionCounts,
                                          [topic.value]: {
                                            ...(formData.topicQuestionCounts[
                                              topic.value
                                            ] || {}),
                                            mcq: Math.min(
                                              value || 0,
                                              totalAvailable.mcq
                                            ),
                                          },
                                        };
                                        handleInputChange(
                                          "topicQuestionCounts",
                                          newCounts
                                        );
                                      }}
                                      min={0}
                                      max={totalAvailable.mcq}
                                      size="sm"
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <NumberInput
                                      label="A&R"
                                      placeholder="0"
                                      value={
                                        questionCounts.assertionReason || 0
                                      }
                                      onChange={(value) => {
                                        const newCounts = {
                                          ...formData.topicQuestionCounts,
                                          [topic.value]: {
                                            ...(formData.topicQuestionCounts[
                                              topic.value
                                            ] || {}),
                                            assertionReason: Math.min(
                                              value || 0,
                                              totalAvailable.assertionReason
                                            ),
                                          },
                                        };
                                        handleInputChange(
                                          "topicQuestionCounts",
                                          newCounts
                                        );
                                      }}
                                      min={0}
                                      max={totalAvailable.assertionReason}
                                      size="sm"
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <NumberInput
                                      label="Numerical"
                                      placeholder="0"
                                      value={questionCounts.numerical || 0}
                                      onChange={(value) => {
                                        const newCounts = {
                                          ...formData.topicQuestionCounts,
                                          [topic.value]: {
                                            ...(formData.topicQuestionCounts[
                                              topic.value
                                            ] || {}),
                                            numerical: Math.min(
                                              value || 0,
                                              totalAvailable.numerical
                                            ),
                                          },
                                        };
                                        handleInputChange(
                                          "topicQuestionCounts",
                                          newCounts
                                        );
                                      }}
                                      min={0}
                                      max={totalAvailable.numerical}
                                      size="sm"
                                    />
                                  </Grid.Col>
                                </Grid>

                                <Text size="xs" c="blue" mt="xs" ta="center">
                                  Total:{" "}
                                  {(questionCounts.mcq || 0) +
                                    (questionCounts.assertionReason || 0) +
                                    (questionCounts.numerical || 0)}{" "}
                                  questions
                                </Text>
                              </Box>
                            )}
                          </Group>
                        </Box>
                      );
                    })}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Box>
    );
  };

  const renderStepContent = () => {
    const stepErrors = getCurrentStepErrors();

    switch (currentStep) {
      case 0:
        return (
          <Step0
            formData={formData}
            handleInputChange={handleInputChange}
            stepErrors={stepErrors}
          />
        );

      case 1:
        return (
          <Step1
            formData={formData}
            handleInputChange={handleInputChange}
            stepErrors={stepErrors}
            availableGroups={availableGroups}
          />
        );

      case 2:
        return (
          <Stack gap="md">
            <Text size="xl" fw={600} mb="md">
              Questions Setup
            </Text>

            <MultiSelect
              label="Select Subjects"
              placeholder="Choose subjects for the exam"
              value={formData.selectedSubjects}
              onChange={(value) => {
                if (formData.examType === "Single Subject") {
                  handleInputChange("selectedSubjects", value.slice(-1));
                } else {
                  handleInputChange("selectedSubjects", value);
                }
              }}
              error={stepErrors.selectedSubjects}
              data={availableSubjects}
              required
            />

            {formData.selectedSubjects.length > 0 && (
              <Box
                p="md"
                style={{
                  backgroundColor: "rgba(255, 193, 7, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                }}
              >
                <Text size="md" fw={500} c="orange" mb="sm">
                  Exam Overview
                </Text>
                <Grid>
                  <Grid.Col span={2}>
                    <Text size="sm" fw={500}>
                      Total MCQ:{" "}
                      {Object.values(formData.topicQuestionCounts || {}).reduce(
                        (sum, counts) => sum + (counts?.mcq || 0),
                        0
                      )}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text size="sm" fw={500}>
                      Total A&R:{" "}
                      {Object.values(formData.topicQuestionCounts || {}).reduce(
                        (sum, counts) => sum + (counts?.assertionReason || 0),
                        0
                      )}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Text size="sm" fw={500}>
                      Total Numerical:{" "}
                      {Object.values(formData.topicQuestionCounts || {}).reduce(
                        (sum, counts) => sum + (counts?.numerical || 0),
                        0
                      )}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Text size="sm" fw={600}>
                      Grand Total: {formData.totalQuestions}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text size="sm" fw={600}>
                      Total Marks: {formData.totalMarks}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Box>
            )}

            {formData.selectedSubjects.length > 0 && (
              <Box mt="md">
                <Title order={4} mb="md">
                  Configure Questions by Subject
                </Title>

                {formData.selectedSubjects.length === 1 ? (
                  <Box>
                    {renderSubjectConfiguration(formData.selectedSubjects[0])}
                  </Box>
                ) : (
                  <Tabs
                    variant="outline"
                    value={tabValue}
                    onChange={(value) => setTabValue(value)}
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
                        {console.log(subjectId)}
                        {renderSubjectConfiguration(subjectId)}
                      </Tabs.Panel>
                    ))}
                  </Tabs>
                )}
              </Box>
            )}

            {stepErrors.selectedTopics && (
              <Alert color="red" icon={<IconAlertCircle size={16} />}>
                {stepErrors.selectedTopics}
              </Alert>
            )}
          </Stack>
        );

      case 3:
        return (
          <Step3
            formData={formData}
            availableTopics={availableTopics}
            availableChapters={availableChapters}
            availableSubjects={availableSubjects}
          />
        );

      case 4:
        return (
          <Step4
            formData={formData}
            stepErrors={stepErrors}
            handleInputChange={handleInputChange}
          />
        );

      default:
        return null;
    }
  };

  const steps = [
    {
      id: 0,
      title: "Exam Metadata",
      subtitle: "Basic exam details",
      icon: IconFileText,
      schema: examMetadataSchema,
    },
    {
      id: 1,
      title: "Participants",
      subtitle: "Select groups",
      icon: IconUsers,
      schema: participantsSchema,
    },
    {
      id: 2,
      title: "Questions Setup",
      subtitle: "Configure questions",
      icon: IconQuestionMark,
      schema: questionsSetupSchema,
    },
    {
      id: 3,
      title: "Marks & Grading",
      subtitle: "Review totals",
      icon: IconCalculator,
      schema: marksGradingSchema,
    },
    {
      id: 4,
      title: "Finalize",
      subtitle: "Create exam",
      icon: IconSend,
      schema: finalizeSchema,
    },
  ];

  const getStepItemStyles = (isActive, isCompleted, hasErrors) => ({
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
    backgroundColor: isActive
      ? "rgba(34, 139, 230, 0.15)"
      : hasErrors
      ? "rgba(255, 0, 0, 0.1)"
      : "transparent",
    borderColor: isActive ? "rgba(34, 139, 230, 0.3)" : "transparent",
  });

  const getStepIconStyles = (isActive, isCompleted) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: isCompleted
      ? "#51cf66"
      : isActive
      ? "#228be6"
      : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    transition: "all 0.2s ease",
  });

  const sidebarContent = (
    <Stack gap="sm">
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="xs">
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Progress
          value={((currentStep + 1) / steps.length) * 100}
          size="sm"
          color="blue"
        />
      </Box>

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const stepErrors = errors[`step_${index}`] || {};
        const hasErrors = Object.keys(stepErrors).length > 0;
        const isCompleted = index < currentStep && !hasErrors;

        return (
          <Box
            key={`step-${step.id}`}
            style={getStepItemStyles(isActive, isCompleted, hasErrors)}
            onClick={() => handleStepClick(index)}
          >
            <Group gap="sm" align="center">
              <Box style={getStepIconStyles(isActive, isCompleted)}>
                {isCompleted ? <IconCheck size={16} /> : <Icon size={16} />}
              </Box>
              <Box flex={1}>
                <Text size="sm" fw={isActive ? 600 : 400} c="white">
                  {step.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {step.subtitle}
                </Text>
              </Box>
              {isCompleted && !hasErrors && (
                <Badge size="xs" color="green" variant="filled">
                  Done
                </Badge>
              )}
              {hasErrors && (
                <Badge size="xs" color="red" variant="filled">
                  Error
                </Badge>
              )}
            </Group>
          </Box>
        );
      })}
    </Stack>
  );

  return (
    <ModalFrame
      opened={opened}
      onClose={handleClose}
      title="Create Exam"
      subtitle="Set up your exam configuration"
      sidebarContent={sidebarContent}
    >
      <Box
        style={{
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isLoading ? "loading" : renderStepContent()}

        <Group
          justify="space-between"
          mt="xl"
          pt="md"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Group gap="sm">
            {currentStep === steps.length - 1 ? (
              <>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.confirmed || isPending}
                  loading={isPending}
                >
                  Create Exam
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>Next Step</Button>
            )}
          </Group>
        </Group>
      </Box>
    </ModalFrame>
  );
};

export default ExamCreationForm;
