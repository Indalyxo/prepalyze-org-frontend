import { Box, Stack, Text, Progress, Group, Badge } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import React from 'react'

const SidebarContent = ({
    steps,
    currentStep,
    errors,
    handleStepClick,
    getStepItemStyles,
    getStepIconStyles
}) => (
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
)

export default SidebarContent