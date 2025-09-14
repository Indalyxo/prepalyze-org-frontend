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
  SimpleGrid,
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

  // State
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

  // Fetch data
  useEffect(() => {
    if (organizationId) {
      fetchData();
    } else {
      setError("Organization not found. Please log in again.");
    }
  }, [organizationId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchGroups(), fetchStudents()]);
    } catch {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    const response = await groupAPI.getGroups(organizationId);
    setGroups(extractData(response, "groups") || []);
  };

  const fetchStudents = async () => {
    const response = await userAPI.getStudents(organizationId);
    setAvailableStudents(extractData(response, "students") || []);
  };

  const extractData = (response, key) => {
    return (
      response?.data?.data?.[key] ||
      response?.data?.[key] ||
      response?.[key] ||
      (Array.isArray(response?.data) ? response.data : []) ||
      (Array.isArray(response) ? response : [])
    );
  };

  // Group actions
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

  const handleDeleteGroup = (group) => {
    setGroupToDelete(group);
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
    } catch {
      setDeleteError("Failed to delete group. Please try again.");
    }
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
    } catch {
      setError(
        `Failed to ${
          editGroupId ? "update" : "create"
        } group. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Helpers
  const resetForm = () => {
    setNewGroupName("");
    setSelectedStudents([]);
    setEditGroupId(null);
  };

  const handleCloseModal = () => {
    setGroupModalOpened(false);
    resetForm();
  };

  const getStudentIds = (students) =>
    Array.isArray(students)
      ? students.map((s) => (typeof s === "object" ? s._id || s.id : s))
      : [];

  const getStudentDetails = (ids) =>
    availableStudents.filter((s) => ids.includes(s._id || s.id));

  if (loading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  // UI
  return (
    <div className={classes.container}>
      <Container size="xl">
        {/* Header */}
        <Group justify="space-between" mb="xl" className={classes.header}>
          <Title order={1} className={classes.title}>
            Your Groups
          </Title>
          <Button
            onClick={handleCreateGroup}
            disabled={!organizationId || loading}
            variant="light"
            className={classes.createButton}
            leftSection={<IconPlus size={16} />}
          >
            Create Group
          </Button>
        </Group>

        {/* Error */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            withCloseButton
            mb="lg"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Groups */}
        {!loading && groups.length > 0 && (
          <Box>
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing="md"
              className={classes.groupsGrid}
            >
              {groups.map((group) => (
                <Paper
                  key={group._id || group.id}
                  className={classes.groupItem}
                  onClick={() => handleViewGroup(group)}
                >
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="md" align="center" wrap="nowrap">
                      <IconUsers size={20} className={classes.groupIcon} />
                      <Box>
                        <Text className={classes.groupName}>{group.name}</Text>
                        <Text className={classes.memberCount}>
                          {group.studentCount || group.students?.length || 0}{" "}
                          members
                        </Text>
                      </Box>
                    </Group>
                    <Menu position="bottom-end" withinPortal>
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
                            handleDeleteGroup(group);
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
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
            >
              Create Your First Group
            </Button>
          </Box>
        )}
      </Container>

      {/* Modals */}
      <CreateGroupModal
        groupModalOpened={groupModalOpened}
        handleCloseModal={handleCloseModal}
        editGroupId={editGroupId}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        availableStudents={availableStudents}
        selectedStudents={selectedStudents}
        handleStudentToggle={(id) =>
          setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          )
        }
        submitting={submitting}
        handleSubmitGroup={handleSubmitGroup}
      />

      <ViewGroup
        viewModalOpened={viewModalOpened}
        setViewModalOpened={setViewModalOpened}
        selectedGroup={selectedGroup}
        getStudentDetails={getStudentDetails}
        getStudentIds={getStudentIds}
      />

      <DeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleConfirmDelete}
        itemName={groupToDelete?.name || ""}
        itemType="group"
        error={deleteError}
      />
    </div>
  );
}
