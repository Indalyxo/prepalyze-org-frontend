import {
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import AdvancedEditor from "../../../Generics/RichTextEditor";

const Step0 = ({ formData, handleInputChange, stepErrors }) => {
  const examTypeData = [
    { value: "Single Subject", label: "Single Subject" },
    { value: "Multi Subject", label: "Multi Subject" },
  ];

  const examModeData = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const examCategoryData = [
    { value: "NEET", label: "NEET" },
    { value: "JEE", label: "JEE" },
    { value: "Custom", label: "Custom" },
  ];
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

      <AdvancedEditor
        label="Instructions"
        placeholder="Enter exam instructions here..."
        value={formData.instructions}
        onChange={(value) => handleInputChange("instructions", value)}
        error={stepErrors.instructions}
        minRows={6}
        minHeight={200}
        basic={true}
        required
      />

      <Group grow>
        <DateTimePicker
          label="Exam Date"
          placeholder="Select exam date"
          timePickerProps={{
            withDropdown: true,
            popoverProps: { withinPortal: false },
            format: "12h",
          }}
          value={formData.examDate}
          onChange={(date) => handleInputChange("examDate", date)}
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
          onChange={(value) => handleInputChange("examType", value)}
          error={stepErrors.examType}
          data={examTypeData}
          required
          withAsterisk
        />
        <Select
          label="Exam Mode"
          placeholder="Select exam mode"
          value={formData.examMode}
          onChange={(value) => handleInputChange("examMode", value)}
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
        onChange={(value) => handleInputChange("examCategory", value)}
        error={stepErrors.examCategory}
        data={examCategoryData}
        searchable
        clearable
        required
        withAsterisk
      />
    </Stack>
  );
};

export default Step0;
