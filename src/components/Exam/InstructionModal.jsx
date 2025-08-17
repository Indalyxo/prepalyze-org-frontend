import { Modal, Text, Button, Paper, List, Group } from "@mantine/core"
import { IconInfoCircle, IconCheck } from "@tabler/icons-react"

const InstructionModal = ({ opened, onClose, section, gradeSchema }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconInfoCircle size={24} style={{ color: "var(--primary-600)" }} />
          <Text size="xl" fw={700}>
            {section?.name || "Section"} - Instructions
          </Text>
        </Group>
      }
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        content: {
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-2xl)",
          border: "2px solid var(--primary-100)",
        },
        header: {
          background: "linear-gradient(135deg, var(--primary-50) 0%, white 100%)",
          borderBottom: "2px solid var(--primary-100)",
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
        },
        title: {
          color: "var(--primary-700)",
          fontWeight: 700,
        },
      }}
    >
      <Paper
        p="xl"
        radius="md"
        style={{
          background: "linear-gradient(135deg, var(--primary-50) 0%, white 100%)",
          border: "none",
        }}
      >
        <Text size="lg" fw={600} mb="md" style={{ color: "var(--primary-700)" }}>
          Section Overview
        </Text>

        <List spacing="sm" mb="xl">
          <List.Item
            icon={<IconCheck size={16} style={{ color: "var(--success-500)" }} />}
            style={{
              padding: "var(--spacing-sm)",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-xs)",
              border: "1px solid var(--primary-100)",
            }}
          >
            This section contains <strong>{section?.questions?.length || 0}</strong> questions.
          </List.Item>
          <List.Item
            icon={<IconCheck size={16} style={{ color: "var(--success-500)" }} />}
            style={{
              padding: "var(--spacing-sm)",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-xs)",
              border: "1px solid var(--primary-100)",
            }}
          >
            Each question has <strong>FOUR</strong> options. <strong>ONLY ONE</strong> of these four options is the
            correct answer.
          </List.Item>
          <List.Item
            icon={<IconCheck size={16} style={{ color: "var(--success-500)" }} />}
            style={{
              padding: "var(--spacing-sm)",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-xs)",
              border: "1px solid var(--primary-100)",
            }}
          >
            For each question, choose the option corresponding to the correct answer.
          </List.Item>
          <List.Item
            icon={<IconCheck size={16} style={{ color: "var(--success-500)" }} />}
            style={{
              padding: "var(--spacing-sm)",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-xs)",
              border: "1px solid var(--primary-100)",
            }}
          >
            Maximum marks for this section: <strong>{section?.maxMarks || 0}</strong>
          </List.Item>
          {section?.duration && (
            <List.Item
              icon={<IconCheck size={16} style={{ color: "var(--success-500)" }} />}
              style={{
                padding: "var(--spacing-sm)",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--spacing-xs)",
                border: "1px solid var(--primary-100)",
              }}
            >
              Recommended time: <strong>{section.duration}</strong>
            </List.Item>
          )}
        </List>

        <Text size="md" fw={600} mb="sm" style={{ color: "var(--primary-700)" }}>
          Marking Scheme:
        </Text>
        <List spacing="xs" mb="xl">
          <List.Item
            style={{
              padding: "var(--spacing-md)",
              background: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-sm)",
              border: "1px solid var(--gray-200)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Group gap="xs">
              <Text style={{ color: "var(--success-600)" }} fw={600}>
                Full Marks: +{section?.positiveMarks || 4}
              </Text>
              <Text size="sm" c="dimmed">
                If ONLY the correct option is chosen.
              </Text>
            </Group>
          </List.Item>
          <List.Item
            style={{
              padding: "var(--spacing-md)",
              background: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-sm)",
              border: "1px solid var(--gray-200)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Group gap="xs">
              <Text style={{ color: "var(--gray-600)" }} fw={600}>
                Zero Marks: 0
              </Text>
              <Text size="sm" c="dimmed">
                If none of the options is chosen (i.e. the question is unanswered).
              </Text>
            </Group>
          </List.Item>
          <List.Item
            style={{
              padding: "var(--spacing-md)",
              background: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-sm)",
              border: "1px solid var(--gray-200)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Group gap="xs">
              <Text style={{ color: "var(--error-600)" }} fw={600}>
                Negative Marks: {section?.negativeMarks || -1}
              </Text>
              <Text size="sm" c="dimmed">
                In all other cases.
              </Text>
            </Group>
          </List.Item>
        </List>

        <Paper
          p="md"
          radius="md"
          mb="xl"
          style={{
            background: "linear-gradient(135deg, var(--blue-50) 0%, var(--primary-50) 100%)",
            border: "2px solid var(--blue-200)",
          }}
        >
          <Text size="sm" c="dimmed" ta="center" fw={500}>
            📋 Please read all instructions carefully before proceeding with the examination.
          </Text>
        </Paper>

        <Button
          fullWidth
          size="md"
          onClick={onClose}
          leftSection={<IconCheck size={18} />}
          style={{
            background: "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)",
            border: "none",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
          styles={{
            root: {
              "&:hover": {
                background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
                transform: "translateY(-1px)",
                boxShadow: "var(--shadow-lg)",
              },
            },
          }}
        >
          I Understand, Start Section
        </Button>
      </Paper>
    </Modal>
  )
}

export default InstructionModal
