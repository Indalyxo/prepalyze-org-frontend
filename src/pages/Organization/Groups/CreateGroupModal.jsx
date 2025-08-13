import {
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

const CreateGroupModal = ({
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
  styles,
}) => {
  return (
    <Modal
      opened={groupModalOpened}
      onClose={handleCloseModal}
      title={editGroupId ? "Edit Group" : "Create New Group"}
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
            disabled={submitting}
          />

          <div style={styles.studentsSection}>
            <Text fw={500} size="sm" mb="xs">
              Select Students ({selectedStudents.length} selected)
            </Text>
            {availableStudents.length === 0 ? (
              <Text size="sm" c="dimmed">
                No students available
              </Text>
            ) : (
              <div style={styles.studentsList}>
                {availableStudents.map((student) => (
                  <Box key={student._id || student.id} mb="xs">
                    <Checkbox
                      label={`${
                        student.name || student.firstName || "Unnamed"
                      } ${student.email ? `(${student.email})` : ""}`}
                      checked={selectedStudents.includes(
                        student._id || student.id
                      )}
                      onChange={() =>
                        handleStudentToggle(student._id || student.id)
                      }
                      disabled={submitting}
                    />
                  </Box>
                ))}
              </div>
            )}
          </div>

          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              disabled={!newGroupName.trim()}
            >
              {editGroupId ? "Update Group" : "Create Group"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
