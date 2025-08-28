import React, { useState } from "react";
import { Badge, Card, Group, MultiSelect, Stack, Text } from "@mantine/core";

const Step1 = ({
  formData,
  stepErrors,
  handleInputChange,
  availableGroups,
}) => {
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
              const group = availableGroups.find((g) => g.value === groupId);
              return (
                <Badge key={groupId} variant="light">
                  {group?.label}
                </Badge>
              );
            })}
          </Group>
        </Card>
      )}
    </Stack>
  );
};

export default Step1;
