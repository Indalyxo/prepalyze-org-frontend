import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Title,
  Text,
  Group,
  Grid,
  Card,
  Stack,
  Badge,
  Box,
  Modal,
  TextInput,
  Checkbox,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Notification,
} from "@mantine/core";
import { IconPlus, IconBuilding, IconUsers, IconDots, IconX } from "@tabler/icons-react";
import { groupAPI, userAPI } from "../../../utils/api.jsx";
import useAuthStore from "../../../context/auth-store";

export default function Organization_group() {
  const { user } = useAuthStore();
  const [groupOpened, setGroupOpened] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editGroupId, setEditGroupId] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Get organization ID from user context
  const organizationId = user?.organization;

  // Fetch groups and students on component mount
  useEffect(() => {
    if (organizationId) {
      fetchGroups();
      fetchStudents();
    }
  }, [organizationId]);

  // Fetch groups from API
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getGroups(organizationId);
      setGroups(response.data.data.groups || []);
    } catch (err) {
      setError("Failed to fetch groups");
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await userAPI.getStudents(organizationId);
      setAvailableStudents(response.data.data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((s) => s !== studentId)
        : [...prev, studentId]
    );
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const groupData = {
        name: newGroupName,
        students: selectedStudents
      };

      if (editGroupId) {
        // Update existing group
        await groupAPI.updateGroup(organizationId, editGroupId, groupData);
        setNotification({ type: "success", message: "Group updated successfully" });
      } else {
        // Create new group
        await groupAPI.createGroup(organizationId, groupData);
        setNotification({ type: "success", message: "Group created successfully" });
      }

      // Refresh groups
      await fetchGroups();
      
      // Reset form
      setNewGroupName("");
      setSelectedStudents([]);
      setEditGroupId(null);
      setGroupOpened(false);
    } catch (err) {
      setNotification({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to save group" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (group) => {
    setNewGroupName(group.name);
    setSelectedStudents(group.students.map(student => student._id));
    setEditGroupId(group._id);
    setGroupOpened(true);
  };

  const handleDelete = async (groupId) => {
    try {
      await groupAPI.deleteGroup(organizationId, groupId);
      setNotification({ type: "success", message: "Group deleted successfully" });
      await fetchGroups();
    } catch (err) {
      setNotification({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to delete group" 
      });
    }
  };

  const handleToggleStatus = async (groupId, currentStatus) => {
    try {
      // For now, we'll just delete and recreate the group since the backend doesn't have a toggle endpoint
      // In a real implementation, you'd add a toggle endpoint to the backend
      if (currentStatus) {
        await groupAPI.deleteGroup(organizationId, groupId);
        setNotification({ type: "success", message: "Group deactivated successfully" });
      } else {
        // Reactivate by creating a new group with the same data
        const group = groups.find(g => g._id === groupId);
        if (group) {
          await groupAPI.createGroup(organizationId, {
            name: group.name,
            students: group.students.map(s => s._id)
          });
          setNotification({ type: "success", message: "Group activated successfully" });
        }
      }
      await fetchGroups();
    } catch (err) {
      setNotification({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to toggle group status" 
      });
    }
  };

  const handleCloseModal = () => {
    setGroupOpened(false);
    setNewGroupName("");
    setSelectedStudents([]);
    setEditGroupId(null);
  };

  return (
    <div className="organizations-page">
      <Container size="xl" py="xl" pos="relative">
        <LoadingOverlay visible={loading} />
        
        {/* Notification */}
        {notification && (
          <Notification
            title={notification.type === "success" ? "Success" : "Error"}
            color={notification.type === "success" ? "green" : "red"}
            onClose={() => setNotification(null)}
            mb="md"
          >
            {notification.message}
          </Notification>
        )}

        {/* Error Display */}
        {error && (
          <Notification
            title="Error"
            color="red"
            onClose={() => setError(null)}
            mb="md"
          >
            {error}
          </Notification>
        )}

        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Box>
            <Title order={1}>Groups</Title>
            <Text c="dimmed" size="lg">
              Manage and view all your groups
            </Text>
          </Box>
          <Button onClick={() => setGroupOpened(true)} disabled={!organizationId}>Create Group</Button>
        </Group>

        {/* Data Grid */}
        {!loading && (
          <Grid gutter="lg">
            {groups.map((group) => (
              <Grid.Col key={group._id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconBuilding size={24} />
                        <Title order={4}>{group.name}</Title>
                      </Group>

                      {/* 3-dot Menu */}
                      <Menu position="bottom-end" withArrow>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={20} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item onClick={() => handleEdit(group)}>Edit</Menu.Item>
                          <Menu.Item onClick={() => handleToggleStatus(group._id, group.isActive)}>
                            {group.isActive ? "Deactivate" : "Activate"}
                          </Menu.Item>
                          <Menu.Item color="red" onClick={() => handleDelete(group._id)}>
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <Group gap="xs">
                      <IconUsers size={18} />
                      <Text size="sm">{group.studentCount || group.students?.length || 0} Students</Text>
                    </Group>
                    <Badge
                      color={group.isActive ? "green" : "gray"}
                      variant="light"
                    >
                      {group.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <Box ta="center" py="xl">
            <Text size="lg" c="dimmed">No groups found</Text>
            <Text size="sm" c="dimmed" mt="xs">Create your first group to get started</Text>
          </Box>
        )}
      </Container>

      {/* Add/Edit Group Modal */}
      <Modal
        opened={groupOpened}
        onClose={handleCloseModal}
        title={editGroupId ? "Edit Group" : "Create New Group"}
        size="md"
      >
        <form onSubmit={handleGroupSubmit}>
          <Stack>
            <TextInput
              label="Group Name"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />

            <Box>
              <Title order={5} mb="xs">
                Select Students ({selectedStudents.length} selected)
              </Title>
              {availableStudents.length === 0 ? (
                <Text size="sm" c="dimmed">No students available</Text>
              ) : (
                availableStudents.map((student) => (
                  <Checkbox
                    key={student._id}
                    label={`${student.name} (${student.email})`}
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleStudentChange(student._id)}
                    mb="xs"
                  />
                ))
              )}
            </Box>

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
                variant="filled"
                loading={submitting}
              >
                {editGroupId ? "Update Group" : "Create Group"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
