"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
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
} from "@mantine/core"
import {
  IconCheck,
  IconFileText,
  IconUsers,
  IconQuestionMark,
  IconCalculator,
  IconSend,
  IconAlertCircle,
} from "@tabler/icons-react"
import ModalFrame from "../../Modals/ModalFrame"

const examMetadataSchema = z.object({
  examTitle: z.string().min(1, "Exam title is required").max(100, "Title too long"),
  subtitle: z.string().optional(),
  instructions: z.string().min(1, "Instructions are required"),
  examDate: z.string().min(1, "Exam date is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  examType: z.enum(["Single Subject", "Multi Subject"], {
    errorMap: () => ({ message: "Please select exam type" }),
  }),
  examMode: z.enum(["Online", "Offline"], {
    errorMap: () => ({ message: "Please select exam mode" }),
  }),
  examCategory: z.enum(["NEET", "JEE", "Custom"], {
    errorMap: () => ({ message: "Please select exam category" }),
  }),
})

const participantsSchema = z.object({
  selectedGroups: z.array(z.string()).min(1, "At least one group must be selected"),
})

const questionsSetupSchema = z.object({
  selectedSubjects: z.array(z.string()).min(1, "At least one subject must be selected"),
  selectedChapters: z.array(z.string()).min(1, "At least one chapter must be selected"),
  selectedTopics: z.array(z.string()).optional(),
  questionCounts: z.record(
    z.object({
      mcqs: z.number().min(0, "MCQs count must be 0 or greater"),
      assertionReason: z.number().min(0, "Assertion & Reason count must be 0 or greater"),
      numerical: z.number().min(0, "Numerical count must be 0 or greater"),
    }),
  ),
})

const marksGradingSchema = z.object({
  totalQuestions: z.number().min(1, "Must have at least one question"),
  totalMarks: z.number().min(1, "Must have at least one mark"),
})

const finalizeSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, "Please confirm to create the exam"),
})

const completeFormSchema = z.object({
  ...examMetadataSchema.shape,
  ...participantsSchema.shape,
  ...questionsSetupSchema.shape,
  ...marksGradingSchema.shape,
  ...finalizeSchema.shape,
})

const ExamCreationForm = ({ opened, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Exam Metadata
    examTitle: "",
    subtitle: "",
    instructions: "",
    examDate: "",
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
    questionCounts: {},

    // Marks & Grading
    totalQuestions: 0,
    totalMarks: 0,

    // Finalize
    confirmed: false,
  })

  // Fixed: Correct data format for Mantine v8
  const examTypeData = [
    { value: "Single Subject", label: "Single Subject" },
    { value: "Multi Subject", label: "Multi Subject" }
  ]

  const examModeData = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" }
  ]

  const examCategoryData = [
    { value: "NEET", label: "NEET" },
    { value: "JEE", label: "JEE" },
    { value: "Custom", label: "Custom" }
  ]

  const [availableGroups] = useState([
    { value: "batch-1", label: "Batch 1 - Morning" },
    { value: "batch-2", label: "Batch 2 - Evening" },
    { value: "group-a", label: "Group A - Advanced" },
    { value: "group-b", label: "Group B - Intermediate" },
  ])

  const [availableSubjects] = useState([
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
  ])

  const [availableChapters] = useState({
    physics: [
      { value: "mechanics", label: "Mechanics" },
      { value: "thermodynamics", label: "Thermodynamics" },
      { value: "optics", label: "Optics" },
    ],
    chemistry: [
      { value: "organic", label: "Organic Chemistry" },
      { value: "inorganic", label: "Inorganic Chemistry" },
      { value: "physical", label: "Physical Chemistry" },
    ],
    mathematics: [
      { value: "calculus", label: "Calculus" },
      { value: "algebra", label: "Algebra" },
      { value: "geometry", label: "Geometry" },
    ],
    biology: [
      { value: "botany", label: "Botany" },
      { value: "zoology", label: "Zoology" },
      { value: "genetics", label: "Genetics" },
    ],
  })

  const [availableTopics] = useState({
    mechanics: [
      { value: "kinematics", label: "Kinematics" },
      { value: "dynamics", label: "Dynamics" },
      { value: "statics", label: "Statics" },
    ],
    thermodynamics: [
      { value: "laws", label: "Laws of Thermodynamics" },
      { value: "entropy", label: "Entropy" },
    ],
    // Add more topics as needed
  })

  // Fixed: Better calculation logic
  useEffect(() => {
    let totalQuestions = 0
    let totalMarks = 0

    Object.values(formData.questionCounts).forEach((counts) => {
      if (counts) {
        totalQuestions += (counts.mcqs || 0) + (counts.assertionReason || 0) + (counts.numerical || 0)
      }
    })

    const markingScheme = {
      JEE: { positive: 4, negative: -1 },
      NEET: { positive: 4, negative: -1 },
      Custom: { positive: 1, negative: 0 },
    }

    const scheme = markingScheme[formData.examCategory] || markingScheme["Custom"]
    totalMarks = totalQuestions * scheme.positive

    setFormData((prev) => ({
      ...prev,
      totalQuestions,
      totalMarks,
    }))
  }, [formData.questionCounts, formData.examCategory])

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex]
    try {
      step.schema.parse(formData)
      setErrors((prev) => ({ ...prev, [`step_${stepIndex}`]: {} }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const stepErrors = {}
        error.errors.forEach((err) => {
          stepErrors[err.path[0]] = err.message
        })
        setErrors((prev) => ({ ...prev, [`step_${stepIndex}`]: stepErrors }))
      }
      return false
    }
  }

  const validateField = (field, value) => {
    // Find which step this field belongs to
    let stepIndex = -1
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].schema.shape[field]) {
        stepIndex = i
        break
      }
    }

    if (stepIndex !== -1) {
      try {
        const fieldSchema = steps[stepIndex].schema.shape[field]
        if (fieldSchema) {
          fieldSchema.parse(value)
          setErrors((prev) => ({
            ...prev,
            [`step_${stepIndex}`]: {
              ...(prev[`step_${stepIndex}`] || {}),
              [field]: undefined,
            },
          }))
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [`step_${stepIndex}`]: {
              ...(prev[`step_${stepIndex}`] || {}),
              [field]: error.errors[0].message,
            },
          }))
        }
      }
    }
  }

  const handleInputChange = (field, value) => {
    console.log("[v0] Input changed:", field, value)
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex)
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    try {
      const validatedData = completeFormSchema.parse(formData)
      console.log("Exam created with validated data:", validatedData)
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const allErrors = {}
        error.errors.forEach((err) => {
          const stepIndex = steps.findIndex((step) => step.schema.shape[err.path[0]])
          if (stepIndex !== -1) {
            if (!allErrors[`step_${stepIndex}`]) {
              allErrors[`step_${stepIndex}`] = {}
            }
            allErrors[`step_${stepIndex}`][err.path[0]] = err.message
          }
        })
        setErrors(allErrors)
      }
    }
  }

  const handleSaveDraft = () => {
    console.log("Exam saved as draft:", formData)
    // Implement draft saving logic
  }

  const getCurrentStepErrors = () => {
    return errors[`step_${currentStep}`] || {}
  }

  const renderStepContent = () => {
    const stepErrors = getCurrentStepErrors()

    switch (currentStep) {
      case 0:
        return (
          <Stack gap="md">
            <Text size="xl" fw={600} mb="md">
              Exam Metadata
            </Text>
            <TextInput
              label="Exam Title"
              placeholder="Enter exam title"
              value={formData.examTitle}
              onChange={(e) => handleInputChange("examTitle", e.target.value)}
              error={stepErrors.examTitle}
              required
            />
            <Textarea
              label="Subtitle / Description"
              placeholder="Brief description of the exam"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              error={stepErrors.subtitle}
              minRows={2}
            />
            
            {/* Fixed: Simple textarea for instructions instead of rich text editor */}
            <Textarea
              label="Instructions"
              placeholder="Enter exam instructions here..."
              value={formData.instructions}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              error={stepErrors.instructions}
              minRows={6}
              required
            />

            <Group grow>
              <TextInput
                label="Exam Date"
                placeholder="Select exam date"
                type="date"
                value={formData.examDate}
                onChange={(e) => handleInputChange("examDate", e.target.value)}
                error={stepErrors.examDate}
                required
              />
              <NumberInput
                label="Duration (minutes)"
                placeholder="60"
                value={formData.duration}
                onChange={(value) => handleInputChange("duration", value || 60)}
                error={stepErrors.duration}
                min={1}
                required
              />
            </Group>
            <Group grow>
              <Select
                label="Exam Type"
                placeholder="Select exam type"
                value={formData.examType}
                onChange={(value) => {
                  console.log("[v0] Exam type selected:", value)
                  handleInputChange("examType", value)
                }}
                error={stepErrors.examType}
                data={examTypeData}
                required
                withAsterisk
              />
              <Select
                label="Exam Mode"
                placeholder="Select exam mode"
                value={formData.examMode}
                onChange={(value) => {
                  console.log("[v0] Exam mode selected:", value)
                  handleInputChange("examMode", value)
                }}
                error={stepErrors.examMode}
                data={examModeData}
                searchable
                clearable
                required
                withAsterisk
              />
            </Group>
            <Select
              label="Exam Category"
              placeholder="Select exam category"
              value={formData.examCategory}
              onChange={(value) => {
                console.log("[v0] Exam category selected:", value)
                handleInputChange("examCategory", value)
              }}
              error={stepErrors.examCategory}
              data={examCategoryData}
              searchable
              clearable
              required
              withAsterisk
            />
          </Stack>
        )

      case 1:
        return (
          <Stack gap="md">
            <Text size="xl" fw={600} mb="md">
              Participants
            </Text>
            <MultiSelect
              label="Choose Groups / Batches / Users"
              placeholder="Select participants for the exam"
              value={formData.selectedGroups}
              onChange={(value) => handleInputChange("selectedGroups", value)}
              error={stepErrors.selectedGroups}
              data={availableGroups}
              searchable
              required
            />
            {formData.selectedGroups.length > 0 && (
              <Card withBorder p="md">
                <Text size="sm" fw={500} mb="xs">
                  Selected Groups ({formData.selectedGroups.length})
                </Text>
                <Group gap="xs">
                  {formData.selectedGroups.map((groupId) => {
                    const group = availableGroups.find((g) => g.value === groupId)
                    return (
                      <Badge key={groupId} variant="light">
                        {group?.label}
                      </Badge>
                    )
                  })}
                </Group>
              </Card>
            )}
          </Stack>
        )

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
              onChange={(value) => handleInputChange("selectedSubjects", value)}
              error={stepErrors.selectedSubjects}
              data={availableSubjects}
              required
            />

            {formData.selectedSubjects.length > 0 && (
              <Stack gap="md">
                {formData.selectedSubjects.map((subjectId) => {
                  const subject = availableSubjects.find((s) => s.value === subjectId)
                  const chapters = availableChapters[subjectId] || []

                  return (
                    <Card key={subjectId} withBorder p="md">
                      <Text fw={500} mb="md">
                        {subject?.label}
                      </Text>

                      <Stack gap="sm">
                        <Text size="sm" fw={500}>
                          Chapters:
                        </Text>
                        <Checkbox.Group
                          value={formData.selectedChapters}
                          onChange={(value) => handleInputChange("selectedChapters", value)}
                        >
                          <Stack gap="xs">
                            {chapters.map((chapter) => (
                              <Checkbox key={chapter.value} value={chapter.value} label={chapter.label} />
                            ))}
                          </Stack>
                        </Checkbox.Group>

                        {formData.selectedChapters.some((chapterId) => chapters.find((c) => c.value === chapterId)) && (
                          <Box mt="md">
                            <Text size="sm" fw={500} mb="sm">
                              Question Distribution:
                            </Text>
                            <Group grow>
                              <NumberInput
                                label="MCQs"
                                placeholder="0"
                                value={formData.questionCounts[subjectId]?.mcqs || 0}
                                onChange={(value) => {
                                  const newCounts = {
                                    ...formData.questionCounts,
                                    [subjectId]: {
                                      ...formData.questionCounts[subjectId],
                                      mcqs: value || 0,
                                    },
                                  }
                                  handleInputChange("questionCounts", newCounts)
                                }}
                                min={0}
                              />
                              <NumberInput
                                label="Assertion & Reason"
                                placeholder="0"
                                value={formData.questionCounts[subjectId]?.assertionReason || 0}
                                onChange={(value) => {
                                  const newCounts = {
                                    ...formData.questionCounts,
                                    [subjectId]: {
                                      ...formData.questionCounts[subjectId],
                                      assertionReason: value || 0,
                                    },
                                  }
                                  handleInputChange("questionCounts", newCounts)
                                }}
                                min={0}
                              />
                              <NumberInput
                                label="Numerical"
                                placeholder="0"
                                value={formData.questionCounts[subjectId]?.numerical || 0}
                                onChange={(value) => {
                                  const newCounts = {
                                    ...formData.questionCounts,
                                    [subjectId]: {
                                      ...formData.questionCounts[subjectId],
                                      numerical: value || 0,
                                    },
                                  }
                                  handleInputChange("questionCounts", newCounts)
                                }}
                                min={0}
                              />
                            </Group>
                          </Box>
                        )}
                      </Stack>
                    </Card>
                  )
                })}
              </Stack>
            )}
          </Stack>
        )

      case 3:
        return (
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
                    {formData.examCategory === "JEE" && "JEE: +4 for correct, -1 for incorrect"}
                    {formData.examCategory === "NEET" && "NEET: +4 for correct, -1 for incorrect"}
                    {formData.examCategory === "Custom" && "Custom: +1 for correct, 0 for incorrect"}
                    {!formData.examCategory && "Please select exam category to see marking scheme"}
                  </Text>
                </Box>

                {Object.keys(formData.questionCounts).length > 0 && (
                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      Question Breakdown:
                    </Text>
                    <Stack gap="xs">
                      {Object.entries(formData.questionCounts).map(([subjectId, counts]) => {
                        const subject = availableSubjects.find((s) => s.value === subjectId)
                        const total = (counts.mcqs || 0) + (counts.assertionReason || 0) + (counts.numerical || 0)
                        return (
                          <Group key={subjectId} justify="space-between">
                            <Text size="sm">{subject?.label}:</Text>
                            <Text size="sm" c="dimmed">
                              {counts.mcqs || 0} MCQs, {counts.assertionReason || 0} A&R, {counts.numerical || 0}{" "}
                              Numerical ({total} total)
                            </Text>
                          </Group>
                        )
                      })}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Card>
          </Stack>
        )

      case 4:
        return (
          <Stack gap="md">
            <Text size="xl" fw={600} mb="md">
              Finalize Exam
            </Text>

            <Card withBorder p="md">
              <Stack gap="md">
                <Text fw={500}>Exam Summary:</Text>
                <Group justify="space-between">
                  <Text size="sm">Title:</Text>
                  <Text size="sm" fw={500}>
                    {formData.examTitle || "Not set"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Date:</Text>
                  <Text size="sm" fw={500}>
                    {formData.examDate || "Not set"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Duration:</Text>
                  <Text size="sm" fw={500}>
                    {formData.duration} minutes
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Type:</Text>
                  <Text size="sm" fw={500}>
                    {formData.examType || "Not set"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Participants:</Text>
                  <Text size="sm" fw={500}>
                    {formData.selectedGroups.length} groups
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Total Questions:</Text>
                  <Text size="sm" fw={500}>
                    {formData.totalQuestions}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Total Marks:</Text>
                  <Text size="sm" fw={500}>
                    {formData.totalMarks}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Checkbox
              label="I confirm that all the exam details are correct and I want to create this exam"
              checked={formData.confirmed}
              onChange={(e) => handleInputChange("confirmed", e.currentTarget.checked)}
              error={stepErrors.confirmed}
              required
            />

            {stepErrors.confirmed && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="light">
                {stepErrors.confirmed}
              </Alert>
            )}
          </Stack>
        )

      default:
        return null
    }
  }

  const steps = [
    {
      id: 0,
      title: "Exam Metadata",
      subtitle: "Basic exam details",
      icon: IconFileText,
      schema: examMetadataSchema,
      completed: false,
    },
    {
      id: 1,
      title: "Participants",
      subtitle: "Select groups",
      icon: IconUsers,
      schema: participantsSchema,
      completed: false,
    },
    {
      id: 2,
      title: "Questions Setup",
      subtitle: "Configure questions",
      icon: IconQuestionMark,
      schema: questionsSetupSchema,
      completed: false,
    },
    {
      id: 3,
      title: "Marks & Grading",
      subtitle: "Review totals",
      icon: IconCalculator,
      schema: marksGradingSchema,
      completed: false,
    },
    {
      id: 4,
      title: "Finalize",
      subtitle: "Create exam",
      icon: IconSend,
      schema: finalizeSchema,
      completed: false,
    },
  ]

  const getStepItemStyles = (isActive, isCompleted, hasErrors) => ({
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
    backgroundColor: isActive ? "rgba(34, 139, 230, 0.15)" : hasErrors ? "rgba(255, 0, 0, 0.1)" : "transparent",
    borderColor: isActive ? "rgba(34, 139, 230, 0.3)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
  })

  const getStepIconStyles = (isActive, isCompleted) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: isCompleted ? "#51cf66" : isActive ? "#228be6" : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    transition: "all 0.2s ease",
  })

  const sidebarContent = (
    <Stack gap="sm">
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="xs">
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Progress value={((currentStep + 1) / steps.length) * 100} size="sm" color="blue" />
      </Box>

      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep && !errors[`step_${index}`]
        const hasErrors = errors[`step_${index}`] && Object.keys(errors[`step_${index}`]).length > 0

        return (
          <Box
            key={step.id}
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
        )
      })}
    </Stack>
  )

  return (
    <ModalFrame
      opened={opened}
      onClose={onClose}
      title="Create Exam"
      subtitle="Set up your exam configuration"
      sidebarContent={sidebarContent}
    >
      <Box style={{ minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {renderStepContent()}

        <Group justify="space-between" mt="xl" pt="md" style={{ borderTop: "1px solid #e9ecef" }}>
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>

          <Group gap="sm">
            {currentStep === steps.length - 1 ? (
              <>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.confirmed}>
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
  )
}

export default ExamCreationForm