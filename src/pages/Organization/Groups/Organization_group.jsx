import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Title,
  Text,
  Group,
  Stack,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Alert,
  Box,
  Paper,
  Flex,
} from "@mantine/core";
import {
  IconPlus,
  IconUsers,
  IconDots,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { groupAPI, userAPI } from "../../../utils/api.jsx";
import useAuthStore from "../../../context/auth-store.js";
import { useMediaQuery } from "@mantine/hooks";
import ViewGroup from "./ViewGroup.jsx";
import CreateGroupModal from "./CreateGroupModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import classes from "./OrganizationGroup.module.scss";

export default function OrganizationGroup() {
  const { user } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // State management
  const [groups, setGroups] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [groupModalOpened, setGroupModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Form states
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editGroupId, setEditGroupId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const organizationId =
    typeof user?.organization === "object"
      ? user.organization.id || user.organization._id
      : user?.organization;

  // Data fetching
  useEffect(() => {
    if (organizationId) {
      fetchData();
    } else {
      setError(
        "Organization not found. Please ensure you're properly logged in."
      );
    }
  }, [organizationId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchGroups(), fetchStudents()]);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getGroups(organizationId);
      const groupsData = extractData(response, "groups") || [];
      setGroups(groupsData);
    } catch (err) {
      throw new Error("Failed to fetch groups");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await userAPI.getStudents(organizationId);
      const studentsData = extractData(response, "students") || [];
      setAvailableStudents(studentsData);
    } catch (err) {
      console.warn("Failed to fetch students:", err);
    }
  };

  // Utility function to extract data from various response structures
  const extractData = (response, key) => {
    if (response?.data?.data?.[key]) return response.data.data[key];
    if (response?.data?.[key]) return response.data[key];
    if (response?.[key]) return response[key];
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  // Group operations
  const handleCreateGroup = () => {
    resetForm();
    setGroupModalOpened(true);
  };

  const handleEditGroup = (group) => {
    setNewGroupName(group.name);
    setSelectedStudents(getStudentIds(group.students));
    setEditGroupId(group._id || group.id);
    setGroupModalOpened(true);
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setViewModalOpened(true);
  };

  const handleDeleteClass = (group) => {
    setGroupToDelete(group);
    setDeleteError(null);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await groupAPI.deleteGroup(
        organizationId,
        groupToDelete._id || groupToDelete.id
      );
      await fetchGroups();
      setDeleteModalOpened(false);
      setGroupToDelete(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError("Failed to delete class. Please try again.");
      throw err;
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setGroupToDelete(null);
    setDeleteError(null);
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setSubmitting(true);
    try {
      const groupData = {
        name: newGroupName.trim(),
        students: selectedStudents,
      };

      if (editGroupId) {
        await groupAPI.updateGroup(organizationId, editGroupId, groupData);
      } else {
        await groupAPI.createGroup(organizationId, groupData);
      }

      await fetchGroups();
      handleCloseModal();
    } catch (err) {
      setError(
        `Failed to ${
          editGroupId ? "update" : "create"
        } group. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Helper functions
  const getStudentIds = (students) => {
    if (!Array.isArray(students)) return [];
    return students.map((student) =>
      typeof student === "object" ? student._id || student.id : student
    );
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const resetForm = () => {
    setNewGroupName("");
    setSelectedStudents([]);
    setEditGroupId(null);
  };

  const handleCloseModal = () => {
    setGroupModalOpened(false);
    resetForm();
  };

  const getStudentDetails = (studentIds) => {
    return availableStudents.filter((student) =>
      studentIds.includes(student._id || student.id)
    );
  };

  if (!organizationId && !error) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay
          visible
          zIndex={1000}
          loaderProps={{ color: "blue", type: "dots" }}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </Container>
    );
  }

  return (
    <div className={classes.container}>
      <Container size="xl" py="xl">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          loaderProps={{ color: "blue", type: "dots" }}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        {/* Header */}
        <Group justify="space-between" mb="xl" className={classes.header}>
          <Title order={1} className={classes.title}>
            Groups
          </Title>
          <Button
            onClick={handleCreateGroup}
            disabled={!organizationId || loading}
            variant="light"
            className={classes.createButton}
          >
            Create Group
          </Button>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            onClose={() => setError(null)}
            withCloseButton
            mb="lg"
          >
            {error}
          </Alert>
        )}

        {/* Groups Section */}
        {!loading && groups.length > 0 && (
          <Box>
            <Title order={3} mb="md" className={classes.sectionTitle}>
              Your Groups
            </Title>
            <Flex gap="xs">
              {groups.map((group) => (
                <Paper
                  key={group._id || group.id}
                  className={classes.groupItem}
                  onClick={() => handleViewGroup(group)}
                >
                  <Group justify="space-between" align="center">
                    <Group gap="md" align="center">
                      <IconUsers size={20} className={classes.groupIcon} />
                      <Box>
                        <Text className={classes.groupName}>{group.name}</Text>
                        <Text className={classes.memberCount}>
                          {group.studentCount || group.students?.length || 0}{" "}
                          members
                        </Text>
                      </Box>
                    </Group>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(group);
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Paper>
              ))}
            </Flex>
          </Box>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && !error && (
          <Box className={classes.emptyState}>
            <IconUsers size={48} className={classes.emptyIcon} />
            <Title order={3} className={classes.emptyTitle}>
              No Groups Found
            </Title>
            <Text className={classes.emptyDescription}>
              Create your first group to start organizing students
            </Text>
            <Button
              onClick={handleCreateGroup}
              leftSection={<IconPlus size={16} />}
              mt="md"
            >
              Create Your First Group
            </Button>
          </Box>
        )}
      </Container>

      {/* Create/Edit Group Modal */}
      <CreateGroupModal
        groupModalOpened={groupModalOpened}
        handleCloseModal={handleCloseModal}
        editGroupId={editGroupId}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        availableStudents={availableStudents}
        selectedStudents={selectedStudents}
        handleStudentToggle={handleStudentToggle}
        submitting={submitting}
        handleSubmitGroup={handleSubmitGroup}
      />

      {/* View Group Modal */}
      <ViewGroup
        viewModalOpened={viewModalOpened}
        setViewModalOpened={setViewModalOpened}
        selectedGroup={selectedGroup}
        getStudentDetails={getStudentDetails}
        getStudentIds={getStudentIds}
      />

      {/* Delete Modal */}
      <DeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={groupToDelete?.name || ""}
        itemType="class"
        error={deleteError}
      />
    </div>
  );
}
