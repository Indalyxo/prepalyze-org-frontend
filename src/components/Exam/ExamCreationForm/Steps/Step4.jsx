import React from "react";
import { Text, Stack, Group, Card, Checkbox, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const Step4 = ({ formData, stepErrors, handleInputChange }) => (
  <Stack gap="md">
    <Text size="xl" fw={600} mb="md">
      Finalize Exam
    </Text>

    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Review Your Exam"
      color="blue"
    >
      Please review all the details carefully before creating the exam.
    </Alert>

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
          <Text size="sm">Category:</Text>
          <Text size="sm" fw={500}>
            {formData.examCategory || "Not set"}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">Participants:</Text>
          <Text size="sm" fw={500}>
            {(formData.selectedGroups || []).length} groups
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">Subjects:</Text>
          <Text size="sm" fw={500}>
            {(formData.selectedSubjects || []).length} subjects
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">Chapters:</Text>
          <Text size="sm" fw={500}>
            {(formData.selectedChapters || []).length} chapters
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
      label="I confirm that all details are correct and I want to create this exam"
      checked={formData.confirmed}
      onChange={(event) =>
        handleInputChange("confirmed", event.currentTarget.checked)
      }
      error={stepErrors.confirmed}
    />

    {stepErrors.confirmed && (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        {stepErrors.confirmed}
      </Alert>
    )}
  </Stack>
);
export default Step4;
