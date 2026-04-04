import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Group,
  NumberInput,
  Select,
  MultiSelect,
  Button,
  Switch,
  Card,
  Text,
  Badge,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../utils/api";
import useAuthStore from "../../../context/auth-store";
import AdvancedEditor from "../../Generics/RichTextEditor";

const AICreateExamModal = ({ opened, onClose, aiQuestions }) => {
  const { settings } = useAuthStore();
  const [formData, setFormData] = useState({
    examTitle: "",
    subtitle: "",
    instructions: settings?.exam?.instructions || "",
    examDate: new Date(),
    duration: 60,
    examType: "Multi Subject",
    examMode: "Online",
    examCategory: "NEET-UG",
    selectedGroups: [],
    // Online is the default mode → open exam by default (no groups required)
    isOpenExam: true,
    grade: "10th",
    totalMarks: 0,
  });

  const { data: examData } = useQuery({
    queryKey: ["GET_EXAM_DATA"],
    queryFn: async () => {
      const res = await apiClient.get("/api/exam/data");
      return res.data;
    },
    enabled: opened,
  });

  const availableGroups = examData?.groups || [];

  useEffect(() => {
    if (aiQuestions?.length > 0) {
      // Default marks calculation
      const marksPerQuestion = formData.examCategory === "JEE-Main" ? 4 : 4;
      setFormData((prev) => ({
        ...prev,
        grade: aiQuestions[0]?.grade || prev.grade,
        totalMarks: aiQuestions.length * marksPerQuestion,
      }));
    }
  }, [aiQuestions, formData.examCategory]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      
      // Enforce mode rules
      if (field === "examMode") {
        if (value === "Online") {
          // Online exams default to open (no groups required).
          // User can still uncheck if they want specific groups.
          next.isOpenExam = true;
          next.selectedGroups = [];
        } else if (value === "Offline") {
          // Offline exams always require specific groups.
          next.isOpenExam = false;
        }
      }
      
      return next;
    });
  };

  const { mutate: handleUpload, isPending } = useMutation({
    mutationFn: async () => {
      // Frontend validation before hitting the API
      if (!formData.isOpenExam && (formData.selectedGroups || []).length === 0) {
        throw new Error("At least one group must be selected");
      }
      const res = await apiClient.post("/api/exam/create-from-ai", {
        // Map selectedGroups → groups because the backend reads examMetadata.groups
        examMetadata: { ...formData, groups: formData.selectedGroups },
        aiQuestions,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Exam created successfully from AI questions!");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || error.message || "Failed to create exam");
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
          Create Exam from AI Questions
        </Text>
      }
      size="lg"
      radius="md"
    >
      <Stack gap="md">
        <TextInput
          label="Exam Title"
          placeholder="e.g., Weekly Mock Test"
          required
          value={formData.examTitle}
          onChange={(e) => handleInputChange("examTitle", e.target.value)}
        />
        
        <Textarea
          label="Subtitle / Description"
          placeholder="Briefly describe this exam"
          value={formData.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          minRows={2}
        />

        <AdvancedEditor
          label="Instructions"
          placeholder="Enter exam instructions here..."
          value={formData.instructions}
          onChange={(value) => handleInputChange("instructions", value)}
          minHeight={150}
          basic={true}
          required
        />

        <Group grow>
          <DateTimePicker
            label="Exam Date"
            required
            value={formData.examDate}
            onChange={(val) => handleInputChange("examDate", val)}
            placeholder="Select date and time"
          />
          <NumberInput
            label="Duration (minutes)"
            required
            min={1}
            value={formData.duration}
            onChange={(val) => handleInputChange("duration", val || 60)}
          />
        </Group>

        <Group grow>
          <Select
            label="Category"
            data={[
              { value: "NEET-UG", label: "NEET-UG" },
              { value: "JEE-Main", label: "JEE-Main" },
            ]}
            value={formData.examCategory}
            onChange={(val) => handleInputChange("examCategory", val)}
            required
          />
          <Select
            label="Mode"
            data={[
              { value: "Online", label: "Online" },
              { value: "Offline", label: "Offline" },
            ]}
            value={formData.examMode}
            onChange={(val) => handleInputChange("examMode", val)}
            required
          />
          <Select
            label="Grade"
            data={["6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
            value={formData.grade}
            onChange={(val) => handleInputChange("grade", val)}
            required
          />
        </Group>

        <Stack gap="xs">
          <Switch
            label="Open Exam (no specific participants required)"
            checked={formData.isOpenExam}
            onChange={(e) => handleInputChange("isOpenExam", e.currentTarget.checked)}
            disabled={formData.examMode === "Offline"}
          />

          {formData.examMode === "Online" && formData.isOpenExam && (
            <Text size="xs" c="blue">Note: Open exams — any student with access can take this exam.</Text>
          )}
          {(formData.examMode === "Offline" || (formData.examMode === "Online" && !formData.isOpenExam)) && (
            <Text size="xs" c="dimmed">Note: Select the groups/batches that should participate.</Text>
          )}
        </Stack>

        {!formData.isOpenExam && (
          <MultiSelect
            label="Select Groups / Batches"
            placeholder="Search for groups..."
            data={availableGroups}
            value={formData.selectedGroups}
            onChange={(val) => handleInputChange("selectedGroups", val)}
            searchable
            required
          />
        )}

        <Card withBorder p="sm" radius="md" bg="var(--mantine-light-color-gray-0)">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed">Total Questions</Text>
              <Text fw={700}>{aiQuestions?.length || 0}</Text>
            </Stack>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">Total Marks</Text>
              <Text fw={700}>{formData.totalMarks}</Text>
            </Stack>
          </Group>
        </Card>

        <Group justify="flex-end" mt="xl">
          <Button variant="subtle" onClick={onClose} color="gray">
            Cancel
          </Button>
          <Button 
            onClick={() => handleUpload()} 
            loading={isPending}
            variant="gradient" 
            gradient={{ from: "teal", to: "cyan" }}
          >
            Create Exam
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AICreateExamModal;
