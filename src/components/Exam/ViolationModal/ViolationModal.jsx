import { useState, useEffect } from "react"
import { Modal, Text, Button, Progress, Group, Stack, Center, Box, Alert } from "@mantine/core"
import { IconClock, IconAlertTriangle, IconShieldCheck } from "@tabler/icons-react"

const DetentionModal = ({
  opened,
  onClose,
  ruleViolated = "Community Guidelines",
  detentionMinutes = 5,
  onDetentionComplete,
  reset,
  setReset
}) => {
  const [timeRemaining, setTimeRemaining] = useState(detentionMinutes * 60) // Convert to seconds
  const [isActive, setIsActive] = useState(false)

  if (reset) {
    setTimeRemaining(detentionMinutes * 60)
    setIsActive(true)
  }

  useEffect(() => {
    if (opened) {
      setTimeRemaining(detentionMinutes * 60)
      setIsActive(true)
    }
  }, [opened, detentionMinutes])

  useEffect(() => {
    let interval = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false)
            onDetentionComplete?.()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (timeRemaining === 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, timeRemaining, onDetentionComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressValue = ((detentionMinutes * 60 - timeRemaining) / (detentionMinutes * 60)) * 100

  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Prevent closing during detention
      title={null}
      centered
      size="md"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.75,
        blur: 3,
      }}
      styles={{
        modal: {
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        body: {
          padding: "2rem",
        },
      }}
    >
      <Stack gap="xl" align="center">
        <Alert
          icon={<IconAlertTriangle size={20} />}
          title="Rule Violation Detected"
          color="red"
          variant="light"
          styles={{
            root: {
              width: "100%",
              borderRadius: "8px",
            },
            title: {
              fontSize: "1.1rem",
              fontWeight: 600,
            },
          }}
        >
          <Text size="sm" c="dimmed">
            You have violated:{" "}
            <Text span fw={500} c="dark">
              {ruleViolated}
            </Text>
          </Text>
        </Alert>

        <Center>
          <Box
            style={{
              animation: "bounce 2s infinite ease-in-out",
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
            }}
          >
            <img
              src="/images/police-owl.webp"
              alt="Police Owl Mascot"
              style={{
                width: "120px",
                height: "auto",
              }}
            />
          </Box>
        </Center>

        <Box
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            padding: "1.5rem",
            width: "100%",
          }}
        >
          <Group justify="center" align="center" mb="md">
            <IconShieldCheck size={24} color="#d97706" />
            <Text size="lg" fw={600} c="#92400e">
              Detention Notice
            </Text>
          </Group>

          <Text size="sm" ta="center" c="#92400e" mb="lg">
            You are detained for{" "}
            <Text span fw={600}>
              {detentionMinutes} minutes
            </Text>
          </Text>

          <Group justify="center" align="center" gap="sm">
            <IconClock size={20} color="#92400e" />
            <Text
              size="xl"
              fw={700}
              c="#92400e"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                letterSpacing: "1px",
              }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </Group>
        </Box>

        <Box style={{ width: "100%" }}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              Progress
            </Text>
            <Text size="sm" fw={500} c="blue">
              {Math.round(progressValue)}%
            </Text>
          </Group>
          <Progress
            value={progressValue}
            size="md"
            radius="sm"
            color="blue"
            styles={{
              root: {
                backgroundColor: "#e5e7eb",
              },
            }}
          />
        </Box>

        {timeRemaining === 0 && (
          <Button
            onClick={onClose}
            size="md"
            color="green"
            variant="filled"
            fullWidth
            styles={{
              root: {
                borderRadius: "8px",
                fontWeight: 500,
              },
            }}
          >
            Continue
          </Button>
        )}

        <Text size="xs" ta="center" c="dimmed" lh={1.5}>
          Please use this time to review our community guidelines.
          <br />
          Thank you for your understanding.
        </Text>
      </Stack>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </Modal>
  )
}

export default DetentionModal
