import { Badge, Modal, Table, Tabs, Title } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

const ViewGroup = ({
  viewModalOpened,
  setViewModalOpened,
  selectedGroup,
  styles,
  getStudentDetails,
  getStudentIds,
}) => {
  return (
    <Modal
      opened={viewModalOpened}
      onClose={() => setViewModalOpened(false)}
      title="Group Details"
      size="lg"
    >
      {selectedGroup && (
        <div>
          <div style={styles.detailHeader}>
            <Title order={3}>{selectedGroup.name}</Title>
            <Badge
              color={selectedGroup.isActive !== false ? "green" : "gray"}
              variant="light"
            >
              {selectedGroup.isActive !== false ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Tabs defaultValue="students">
            <Tabs.List>
              <Tabs.Tab value="students" leftSection={<IconUsers size={16} />}>
                Students ({selectedGroup.students?.length || 0})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="students" pt="md">
              {selectedGroup.students?.length > 0 ? (
                <Table style={styles.studentsTable}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getStudentDetails(
                      getStudentIds(selectedGroup.students)
                    ).map((student) => (
                      <Table.Tr key={student._id || student.id}>
                        <Table.Td>
                          {student.name || student.firstName || "Unnamed"}
                        </Table.Td>
                        <Table.Td>{student.email || "No email"}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No students assigned to this group
                </Text>
              )}
            </Tabs.Panel>
          </Tabs>
        </div>
      )}
    </Modal>
  );
};

export default ViewGroup;
