import React, { useEffect } from "react";
import {
  Badge,
  Card,
  Group,
  MultiSelect,
  Stack,
  Switch,
  Text,
} from "@mantine/core";

const Step1 = ({
  formData,
  stepErrors,
  handleInputChange,
  availableGroups = [],
}) => {
  const isOnline = formData.examMode === "Online";
  const isOffline = formData.examMode === "Offline";

  // Enforce mode rules immediately in the UI
  useEffect(() => {
    if (isOnline) {
      // Online exams cannot be open and should allow participant selection
      handleInputChange("isOpenExam", false);
      handleInputChange("selectedGroups", formData.selectedGroups || []);
    } else if (isOffline) {
      // Offline exams are always open and should NOT have participants
      handleInputChange("isOpenExam", true);
      handleInputChange("selectedGroups", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.examMode]);

  return (
    <Stack gap="md">
      <Text size="xl" fw={600} mb="md">
        Participants
      </Text>

      {/* Open Exam Switch - forced by examMode when selected */}
      <Switch
        label="Open Exam (no participants required)"
        checked={!!formData.isOpenExam}
        onChange={(event) =>
          handleInputChange("isOpenExam", event.currentTarget.checked)
        }
        // disable manual toggling when a mode is selected that enforces a value
        disabled={isOnline || isOffline}
      />

      {isOnline && (
        <Text size="sm" c="green">
          Online exams cannot be open. Select participant groups for online exams.
        </Text>
      )}

      {isOffline && (
        <Text size="sm" c="dimmed">
          Offline exams are always open and do not require participant groups.
        </Text>
      )}

      {/* Show group selection only when exam is NOT open */}
      {!formData.isOpenExam && (
        <>
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

          {formData.selectedGroups?.length > 0 && (
            <Card withBorder p="md">
              <Text size="sm" fw={500} mb="xs">
                Selected Groups ({formData.selectedGroups.length})
              </Text>
              <Group gap="xs">
                {formData.selectedGroups.map((groupId) => {
                  const group = availableGroups.find((g) => g.value === groupId);
                  return (
                    <Badge key={groupId} variant="light">
                      {group?.label || groupId}
                    </Badge>
                  );
                })}
              </Group>
            </Card>
          )}
        </>
      )}
    </Stack>
  );
};

export default Step1;