import { Modal, Text, Button, Paper, List } from "@mantine/core"
import "./instruction-modal.scss"

const InstructionModal = ({ opened, onClose, section, gradeSchema }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${section.name} - Instructions`}
      size="lg"
      className="instruction-modal"
    >
      <Paper className="instruction-content">
        <Text size="lg" weight={600} mb="md">
          Section Instructions
        </Text>

        <List spacing="sm" mb="md">
          <List.Item>This section contains {section.questions.length} questions.</List.Item>
          <List.Item>Each question has FOUR options. ONLY ONE of these four options is the correct answer.</List.Item>
          <List.Item>For each question, choose the option corresponding to the correct answer.</List.Item>
          <List.Item>Maximum marks for this section: {section.maxMarks}</List.Item>
        </List>

        <Text size="md" weight={600} mb="sm">
          Marking Scheme:
        </Text>
        <List spacing="xs" mb="md">
          <List.Item>
            <Text color="green">Full Marks: +{section.positiveMarks}</Text> If ONLY the correct option is chosen.
          </List.Item>
          <List.Item>
            <Text color="gray">Zero Marks: 0</Text> If none of the options is chosen (i.e. the question is unanswered).
          </List.Item>
          <List.Item>
            <Text color="red">Negative Marks: {section.negativeMarks}</Text> In all other cases.
          </List.Item>
        </List>

        <Text size="sm" color="dimmed" mb="md">
          Please read all instructions carefully before proceeding with the examination.
        </Text>

        <Button fullWidth onClick={onClose}>
          I Understand, Start Section
        </Button>
      </Paper>
    </Modal>
  )
}

export default InstructionModal
