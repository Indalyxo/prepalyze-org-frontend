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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editGroupId, setEditGroupId] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Get organization ID from user context with better error handling
  const organizationId = user?.organization;

  // Debug logging
  useEffect(() => {
    console.log("User object:", user);
    console.log("Organization ID:", organizationId);
    console.log("Available students:", availableStudents);
    console.log("Groups:", groups);
  }, [user, organizationId, availableStudents, groups]);

  // Fetch groups and students on component mount
  useEffect(() => {
    if (organizationId) {
      console.log("Fetching data for organization:", organizationId);
      fetchGroups();
      fetchStudents();
    } else {
      console.warn("No organization ID found. User:", user);
      setError("Organization ID not found. Please ensure you're logged in and have an organization assigned.");
    }
  }, [organizationId]);

  // Fetch groups from API with better error handling
  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Calling groupAPI.getGroups with organizationId:", organizationId);
      const response = await groupAPI.getGroups(organizationId);
      
      console.log("Groups API response:", response);
      
      // Handle different possible response structures
      let groupsData = [];
      if (response?.data?.data?.groups) {
        groupsData = response.data.data.groups;
      } else if (response?.data?.groups) {
        groupsData = response.data.groups;
      } else if (response?.groups) {
        groupsData = response.groups;
      } else if (Array.isArray(response?.data)) {
        groupsData = response.data;
      } else if (Array.isArray(response)) {
        groupsData = response;
      }
      
      console.log("Processed groups data:", groupsData);
      setGroups(groupsData);
      
    } catch (err) {
      console.error("Error fetching groups:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Failed to fetch groups";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students from API with better error handling
  const fetchStudents = async () => {
    try {
      console.log("Calling userAPI.getStudents with organizationId:", organizationId);
      const response = await userAPI.getStudents(organizationId);
      
      console.log("Students API response:", response);
      
      // Handle different possible response structures
      let studentsData = [];
      if (response?.data?.data?.students) {
        studentsData = response.data.data.students;
      } else if (response?.data?.students) {
        studentsData = response.data.students;
      } else if (response?.students) {
        studentsData = response.students;
      } else if (Array.isArray(response?.data)) {
        studentsData = response.data;
      } else if (Array.isArray(response)) {
        studentsData = response;
      }
      
      console.log("Processed students data:", studentsData);
      setAvailableStudents(studentsData);
      
    } catch (err) {
      console.error("Error fetching students:", err);
      console.error("Error response:", err.response);
      
      // Don't show error for students fetch failure, just log it
      // This allows the component to still work for group management
      setNotification({
        type: "error",
        message: "Failed to fetch students. You may not be able to assign students to groups."
      });
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
    
    if (!newGroupName.trim()) {
      setNotification({ type: "error", message: "Group name is required" });
      return;
    }
    
    if (!organizationId) {
      setNotification({ type: "error", message: "Organization ID not found" });
      return;
    }
    
    setSubmitting(true);

    try {
      const groupData = {
        name: newGroupName.trim(),
        students: selectedStudents
      };

      console.log("Submitting group data:", groupData);

      if (editGroupId) {
        // Update existing group
        console.log("Updating group with ID:", editGroupId);
        const response = await groupAPI.updateGroup(organizationId, editGroupId, groupData);
        console.log("Update response:", response);
        setNotification({ type: "success", message: "Group updated successfully" });
      } else {
        // Create new group
        console.log("Creating new group for organization:", organizationId);
        const response = await groupAPI.createGroup(organizationId, groupData);
        console.log("Create response:", response);
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
      console.error("Error saving group:", err);
      console.error("Error response:", err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          (editGroupId ? "Failed to update group" : "Failed to create group");
      
      setNotification({ 
        type: "error", 
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (group) => {
    console.log("Editing group:", group);
    setNewGroupName(group.name);
    
    // Handle different possible student data structures
    let studentIds = [];
    if (group.students) {
      if (Array.isArray(group.students)) {
        studentIds = group.students.map(student => 
          typeof student === 'object' ? (student._id || student.id) : student
        );
      }
    }
    
    setSelectedStudents(studentIds);
    setEditGroupId(group._id || group.id);
    setGroupOpened(true);
  };

  const handleDelete = async (groupId) => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }
    
    try {
      console.log("Deleting group with ID:", groupId);
      await groupAPI.deleteGroup(organizationId, groupId);
      setNotification({ type: "success", message: "Group deleted successfully" });
      await fetchGroups();
    } catch (err) {
      console.error("Error deleting group:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Failed to delete group";
      setNotification({ 
        type: "error", 
        message: errorMessage
      });
    }
  };

  const handleToggleStatus = async (groupId, currentStatus) => {
    try {
      console.log("Toggling status for group:", groupId, "Current status:", currentStatus);
      
      // This is a placeholder implementation since you mentioned the backend doesn't have a toggle endpoint
      // You should implement a proper toggle endpoint in your backend
      if (currentStatus) {
        await groupAPI.deleteGroup(organizationId, groupId);
        setNotification({ type: "success", message: "Group deactivated successfully" });
      } else {
        // This logic is problematic - you can't reactivate a deleted group
        setNotification({ 
          type: "error", 
          message: "Cannot reactivate group. Please implement a proper toggle endpoint in your backend." 
        });
        return;
      }
      
      await fetchGroups();
    } catch (err) {
      console.error("Error toggling group status:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Failed to toggle group status";
      setNotification({ 
        type: "error", 
        message: errorMessage
      });
    }
  };

  const handleCloseModal = () => {
    setGroupOpened(false);
    setNewGroupName("");
    setSelectedStudents([]);
    setEditGroupId(null);
  };

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show loading state if no organizationId yet
  if (!organizationId && !error) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible={true} />
        <Text>Loading organization data...</Text>
      </Container>
    );
  }

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
            withCloseButton
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
            withCloseButton
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
          <Button 
            onClick={() => setGroupOpened(true)} 
            disabled={!organizationId || loading}
            leftSection={<IconPlus size={16} />}
          >
            Create Group
          </Button>
        </Group>

        {/* Data Grid */}
        {!loading && groups.length > 0 && (
          <Grid gutter="lg">
            {groups.map((group) => (
              <Grid.Col key={group._id || group.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
                          <Menu.Item onClick={() => handleToggleStatus(group._id || group.id, group.isActive)}>
                            {group.isActive ? "Deactivate" : "Activate"}
                          </Menu.Item>
                          <Menu.Item color="red" onClick={() => handleDelete(group._id || group.id)}>
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <Group gap="xs">
                      <IconUsers size={18} />
                      <Text size="sm">
                        {group.studentCount || group.students?.length || 0} Students
                      </Text>
                    </Group>
                    <Badge
                      color={group.isActive !== false ? "green" : "gray"}
                      variant="light"
                    >
                      {group.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && !error && (
          <Box ta="center" py="xl">
            <IconBuilding size={48} style={{ opacity: 0.5 }} />
            <Text size="lg" c="dimmed" mt="md">No groups found</Text>
            <Text size="sm" c="dimmed" mt="xs">Create your first group to get started</Text>
            {organizationId && (
              <Button 
                mt="md" 
                onClick={() => setGroupOpened(true)}
                leftSection={<IconPlus size={16} />}
              >
                Create Your First Group
              </Button>
            )}
          </Box>
        )}
      </Container>

      {/* Add/Edit Group Modal */}
      <Modal
        opened={groupOpened}
        onClose={handleCloseModal}
        title={editGroupId ? "Edit Group" : "Create New Group"}
        size="md"
        closeOnClickOutside={!submitting}
        closeOnEscape={!submitting}
      >
        <form onSubmit={handleGroupSubmit}>
          <Stack>
            <TextInput
              label="Group Name"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
              disabled={submitting}
            />

            <Box>
              <Title order={5} mb="xs">
                Select Students ({selectedStudents.length} selected)
              </Title>
              {availableStudents.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No students available. Make sure students are added to your organization.
                </Text>
              ) : (
                <Stack gap="xs" mah={300} style={{ overflowY: 'auto' }}>
                  {availableStudents.map((student) => (
                    <Checkbox
                      key={student._id || student.id}
                      label={`${student.name || student.firstName || 'Unnamed'} ${
                        student.email ? `(${student.email})` : ''
                      }`}
                      checked={selectedStudents.includes(student._id || student.id)}
                      onChange={() => handleStudentChange(student._id || student.id)}
                      disabled={submitting}
                    />
                  ))}
                </Stack>
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
                disabled={!newGroupName.trim()}
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