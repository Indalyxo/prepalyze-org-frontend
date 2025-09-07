import {
  Modal,
  Title,
  TextInput,
  Button,
  Stack,
  Checkbox,
  Group,
  Text,
  ScrollArea,
} from "@mantine/core";
import { IconUsers, IconPlus } from "@tabler/icons-react";

export default function CreateGroupModal({
  groupModalOpened,
  handleCloseModal,
  editGroupId,
  newGroupName,
  setNewGroupName,
  availableStudents,
  selectedStudents,
  handleStudentToggle,
  submitting,
  handleSubmitGroup,
}) {
  return (
    <Modal
      opened={groupModalOpened}
      onClose={handleCloseModal}
      styles={{
        content: {
          borderRadius: "12px",
          padding: "24px",
        },
        header: {
          borderBottom: "1px solid #e9ecef",
          marginBottom: "16px",
          paddingBottom: "12px",
        },
        title: {
          fontWeight: 600,
          fontSize: "18px",
        },
      }}
      title={
        <Group gap="sm">
          <IconUsers size={20} />
          <Title order={3}>
            {editGroupId ? "Edit Group" : "Create New Group"}
          </Title>
        </Group>
      }
      size="md"
    >
      <form onSubmit={handleSubmitGroup}>
        <Stack gap="md">
          <TextInput
            label="Group Name"
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            required
          />

          {availableStudents.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">
                Select Students
              </Text>
              <ScrollArea h={200} type="scroll">
                <Stack gap="xs">
                  {availableStudents.map((student) => (
                    <Checkbox
                      key={student._id || student.id}
                      label={`${student.name} (${student.email})`}
                      checked={selectedStudents.includes(
                        student._id || student.id
                      )}
                      onChange={() =>
                        handleStudentToggle(student._id || student.id)
                      }
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </div>
          )}

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              leftSection={<IconPlus size={16} />}
            >
              {editGroupId ? "Update Group" : "Create Group"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
