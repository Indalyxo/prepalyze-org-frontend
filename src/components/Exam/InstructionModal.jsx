import { Modal, Text, Stack, List, Group } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import "./instruction-modal.scss"

const InstructionModal = ({ opened, onClose, section }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconInfoCircle size={24} />
          <Text fw={600} size="lg">
            Instructions for {section.name}
          </Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text size="md" c="dimmed">
          Please read the following instructions carefully before proceeding:
        </Text>

        <List spacing="sm" size="sm">
          {section.instructions?.map((instruction, index) => (
            <List.Item key={index}>{instruction}</List.Item>
          ))}
        </List>

        <Text size="sm" c="dimmed" fs="italic">
          These instructions will also auto-hide after 5 seconds when you start answering questions.
        </Text>
      </Stack>
    </Modal>
  )
}

export default InstructionModal
