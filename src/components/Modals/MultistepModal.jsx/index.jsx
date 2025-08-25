import { useState } from "react"
import { Stack, Text, Button, Group, Box, Progress, Badge } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import ModalFrame from "../ModalFrame"
import "./multistep-form.css"

const ReusableMultiStepForm = ({
  opened,
  onClose,
  title = "Multi-Step Form",
  subtitle = "Complete the form",
  steps = [],
  initialStep = 0,
  currentStep: controlledCurrentStep,
  onStepChange,
  onSubmit,
  onNext,
  onPrevious,
  formData = {},
  onFormDataChange,
  showProgress = true,
  allowStepClick = true,
  submitButtonText = "Submit",
  nextButtonText = "Next Step",
  previousButtonText = "Previous",
  submitDisabled = false,
  hideNavigation = false,
  customFooter,
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(initialStep)

  // Use controlled or uncontrolled step state
  const currentStep = controlledCurrentStep !== undefined ? controlledCurrentStep : internalCurrentStep

  const handleStepChange = (stepIndex) => {
    if (!allowStepClick) return

    if (controlledCurrentStep === undefined) {
      setInternalCurrentStep(stepIndex)
    }

    if (onStepChange) {
      onStepChange(stepIndex)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1

      if (controlledCurrentStep === undefined) {
        setInternalCurrentStep(nextStep)
      }

      if (onNext) {
        onNext(nextStep, currentStep)
      } else if (onStepChange) {
        onStepChange(nextStep)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1

      if (controlledCurrentStep === undefined) {
        setInternalCurrentStep(prevStep)
      }

      if (onPrevious) {
        onPrevious(prevStep, currentStep)
      } else if (onStepChange) {
        onStepChange(prevStep)
      }
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData, currentStep)
    }
  }

  const sidebarContent = (
    <Stack gap="sm" className="steps-sidebar">
      {showProgress && (
        <Box mb="md">
          <Text size="sm" c="dimmed" mb="xs">
            Step {currentStep + 1} of {steps.length}
          </Text>
          <Progress value={((currentStep + 1) / steps.length) * 100} size="sm" color="blue" />
        </Box>
      )}

      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = step.completed || index < currentStep

        return (
          <Box
            key={step.id || index}
            className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${
              allowStepClick ? "clickable" : ""
            }`}
            onClick={() => handleStepChange(index)}
            style={{ cursor: allowStepClick ? "pointer" : "default" }}
          >
            <Group gap="sm" align="center">
              <Box className="step-icon">{isCompleted ? <IconCheck size={16} /> : Icon && <Icon size={16} />}</Box>
              <Box flex={1}>
                <Text size="sm" fw={isActive ? 600 : 400} c="white">
                  {step.title || step.name}
                </Text>
                {step.subtitle && (
                  <Text size="xs" c="dimmed">
                    {step.subtitle}
                  </Text>
                )}
              </Box>
              {isCompleted && (
                <Badge size="xs" color="green" variant="filled">
                  Done
                </Badge>
              )}
            </Group>
          </Box>
        )
      })}
    </Stack>
  )

  const renderDefaultFooter = () => (
    <Group justify="space-between" mt="xl" pt="md" style={{ borderTop: "1px solid #e9ecef" }}>
      <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
        {previousButtonText}
      </Button>

      {currentStep === steps.length - 1 ? (
        <Button onClick={handleSubmit} disabled={submitDisabled}>
          {submitButtonText}
        </Button>
      ) : (
        <Button onClick={handleNext}>{nextButtonText}</Button>
      )}
    </Group>
  )

  return (
    <ModalFrame opened={opened} onClose={onClose} title={title} subtitle={subtitle} sidebarContent={sidebarContent}>
      <Box className="form-content">
        {/* Render current step content */}
        {steps[currentStep]?.content}

        {/* Footer navigation */}
        {!hideNavigation && (customFooter || renderDefaultFooter())}
      </Box>
    </ModalFrame>
  )
}

export default ReusableMultiStepForm
