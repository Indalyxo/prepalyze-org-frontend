import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Button,
  Progress,
  Group,
  Stack,
  Center,
  Box,
  Alert,
} from "@mantine/core";
import {
  IconClock,
  IconAlertTriangle,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

const DetentionModal = ({
  opened,
  onClose,
  ruleViolated = "Community Guidelines",
  detentionMinutes = 5,
  onDetentionComplete,
  reset,
  attendance,
  setReset,
}) => {
  const detentionInfo = attendance?.detention;
  const now = new Date();

  // If detention exists and is active, calculate remaining time
  const detentionActive =
    detentionInfo?.isActive &&
    new Date(detentionInfo.startedAt) <= now &&
    new Date(detentionInfo.endedAt) > now;

  const initialRemaining = detentionActive
    ? Math.max(
        Math.floor((new Date(detentionInfo.endedAt) - now) / 1000), // seconds left
        0
      )
    : detentionMinutes * 60;

  const [timeRemaining, setTimeRemaining] = useState(initialRemaining);
  const [isActive, setIsActive] = useState(detentionActive);

  // Handle reset trigger
  useEffect(() => {
    if (reset) {
      setTimeRemaining(detentionMinutes * 60);
      setIsActive(true);
      setReset?.(false);
    }
  }, [reset, detentionMinutes, setReset]);

  // If modal is opened manually
  useEffect(() => {
    if (opened && !detentionActive) {
      setTimeRemaining(detentionMinutes * 60);
      setIsActive(true);
    }
  }, [opened, detentionMinutes, detentionActive]);

  const clearDetention = async () => {
    try {
      const res = await apiClient.post(
        `/api/exam/${attendance?.examId}/detention/complete`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const detentionMutation = useMutation({
    mutationFn: clearDetention,
    onSuccess: () => {
      toast.success("Detention cleared successfully ✅");
      queryClient.invalidateQueries(["attendance", attendance?.examId]);
    },
    onError: () => {
      toast.error("Failed to clear detention ❌");
    },
  })

  // Countdown effect
  useEffect(() => {
    let interval = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsActive(false);
            detentionMutation.mutate();
            onDetentionComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onDetentionComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressValue = detentionInfo.isActive
    ? ((detentionInfo.duration * 60 - timeRemaining) /
        (detentionInfo.duration * 60)) *
      100
    : ((detentionMinutes * 60 - timeRemaining) / (detentionMinutes * 60)) * 100;

  const reason = detentionInfo?.reason || ruleViolated;
  const duration = detentionInfo?.duration || detentionMinutes;

  return (
    <Modal
      opened={detentionActive || opened}
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
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
              {reason}
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
              {duration} minutes
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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </Modal>
  );
};

export default DetentionModal;
