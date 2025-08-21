import { Modal, Title, Text, Stack, Group, Badge, Table, Box } from "@mantine/core"
import { IconUsers } from "@tabler/icons-react"

export default function ViewGroup({
  viewModalOpened,
  setViewModalOpened,
  selectedGroup,
  getStudentDetails,
  getStudentIds,
}) {
  if (!selectedGroup) return null

  const studentIds = getStudentIds(selectedGroup.students || [])
  const studentDetails = getStudentDetails(studentIds)

  return (
    <Modal
      opened={viewModalOpened}
      onClose={() => setViewModalOpened(false)}
      title={
        <Group gap="sm">
          <IconUsers size={20} />
          <Title order={3}>{selectedGroup.name}</Title>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        <Group gap="md">
          <Badge variant="light" size="lg">
            {studentDetails.length} Members
          </Badge>
        </Group>

        {studentDetails.length > 0 ? (
          <Box>
            <Title order={4} mb="sm">
              Group Members
            </Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {studentDetails.map((student) => (
                  <Table.Tr key={student._id || student.id}>
                    <Table.Td>
                      {student.name}
                    </Table.Td>
                    <Table.Td>{student.email}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No members in this group yet
          </Text>
        )}
      </Stack>
    </Modal>
  )
}
