import { Modal, Title, Text, Button, Group, Alert, Stack } from "@mantine/core"
import { IconTrash, IconAlertTriangle } from "@tabler/icons-react"
import { useState } from "react"

export default function DeleteModal({ opened, onClose, onConfirm, itemName, itemType, error }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={<Title order={3}>Delete {itemType}</Title>} size="sm">
      <Stack gap="md">
        <Group gap="sm">
          <IconAlertTriangle size={20} color="red" />
          <Text>
            Are you sure you want to delete the {itemType} "{itemName}"? This action cannot be undone.
          </Text>
        </Group>

        {error && (
          <Alert color="red" icon={<IconAlertTriangle size={16} />}>
            {error}
          </Alert>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirm} loading={loading} leftSection={<IconTrash size={16} />}>
            Delete {itemType}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
