import { useState } from "react"
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  Alert,
} from "@mantine/core"
import {
  IconAlertTriangle,
  IconTrash,
} from "@tabler/icons-react"

const styles = {
  modalHeader: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1b1e",
  },
  warningIcon: {
    color: "#fa5252",
    marginBottom: "16px",
  },
  warningTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1b1e",
    marginBottom: "8px",
  },
  warningText: {
    fontSize: "14px",
    color: "#495057",
    lineHeight: 1.5,
    marginBottom: "16px",
  },
  className: {
    fontWeight: 600,
    color: "#1a1b1e",
  },
  deleteButton: {
    backgroundColor: "#fa5252",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#e03131",
    },
  },
  cancelButton: {
    backgroundColor: "transparent",
    border: "1px solid #ced4da",
    color: "#495057",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
}

export default function DeleteModal({
  opened,
  onClose,
  onConfirm,
  itemName,
  itemType = "class",
  loading = false,
  error = null,
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      // Error handling is managed by parent component
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting && !loading) {
      onClose()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text style={styles.modalHeader}>
          Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </Text>
      }
      size="sm"
      centered
      closeOnClickOutside={!isDeleting && !loading}
      closeOnEscape={!isDeleting && !loading}
    >
      <Stack gap="md">
        <div style={{ textAlign: "center" }}>
          <IconAlertTriangle size={48} style={styles.warningIcon} />
          
          <Text style={styles.warningTitle}>
            Are you sure you want to delete this {itemType}?
          </Text>
          
          <Text style={styles.warningText}>
            You are about to permanently delete{" "}
            <span style={styles.className}>"{itemName}"</span>.
            This action cannot be undone and all associated data will be lost.
          </Text>
        </div>

        {error && (
          <Alert
            color="red"
            variant="light"
            styles={{
              root: { fontSize: "14px" },
            }}
          >
            {error}
          </Alert>
        )}

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="default"
            onClick={handleClose}
            disabled={isDeleting || loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={isDeleting || loading}
            leftSection={!isDeleting && !loading ? <IconTrash size={16} /> : null}
            style={styles.deleteButton}
          >
            {isDeleting || loading ? "Deleting..." : `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
