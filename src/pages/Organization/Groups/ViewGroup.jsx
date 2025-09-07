import {
  Modal,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Table,
  Box,
} from "@mantine/core"
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
      size="lg"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
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
        <Group gap="sm" align="center">
          <IconUsers size={20} />
          <Title order={3} style={{ margin: 0 }}>
            {selectedGroup.name}
          </Title>
        </Group>
      }
    >
      <Stack gap="md" style={{ marginTop: "8px" }}>
        <Group>
          <Badge
            variant="light"
            size="lg"
            style={{ fontSize: "14px", padding: "8px 14px" }}
          >
            {studentDetails.length} Members
          </Badge>
        </Group>

        {studentDetails.length > 0 ? (
          <Box>
            <Title
              order={4}
              style={{ marginBottom: "12px", fontSize: "16px" }}
            >
              Group Members
            </Title>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ fontWeight: 600 }}>Name</Table.Th>
                  <Table.Th style={{ fontWeight: 600 }}>Email</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {studentDetails.map((student) => (
                  <Table.Tr key={student._id || student.id}>
                    <Table.Td>{student.name}</Table.Td>
                    <Table.Td>{student.email}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        ) : (
          <Text
            c="dimmed"
            style={{ textAlign: "center", padding: "32px 0" }}
          >
            No members in this group yet
          </Text>
        )}
      </Stack>
    </Modal>
  )
}
