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
  Modal,
  TextInput,
  Checkbox,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Alert,
  Table,
  Tabs,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconBuilding,
  IconUsers,
  IconDots,
  IconEye,
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

// Inline styles object for professional appearance
const styles = {
  organizationGroups: {
    minHeight: "100vh",
    backgroundColor: "#f7f9fc",
  },
  groupsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
    gap: "1rem",
  },
  headerContent: {
    flex: 1,
  },
  pageTitle: {
    marginBottom: "0.5rem",
    fontWeight: 600,
    color: "#212529",
  },
  pageDescription: {
    fontSize: "0.95rem",
    color: "#6c757d",
  },
  groupCard: {
    height: "100%",
    transition: "all 0.2s ease",
    border: "1px solid #dee2e6",
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  groupInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
  },
  groupIcon: {
    color: "#0066cc",
    flexShrink: 0,
  },
  groupName: {
    margin: 0,
    fontWeight: 600,
    color: "#212529",
    wordBreak: "break-word",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  studentCount: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#6c757d",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    color: "#adb5bd",
    marginBottom: "1.5rem",
  },
  emptyTitle: {
    marginBottom: "0.5rem",
    color: "#495057",
  },
  emptyDescription: {
    marginBottom: "2rem",
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#6c757d",
  },
  studentsSection: {
    marginTop: "1rem",
  },
  studentsList: {
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #dee2e6",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    backgroundColor: "#f8f9fa",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #dee2e6",
  },
  studentsTable: {
    "& th": {
      fontWeight: 600,
      color: "#495057",
      backgroundColor: "#f8f9fa",
    },
    "& td": {
      padding: "0.75rem",
      borderBottom: "1px solid #e9ecef",
    },
    "& tr:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
};

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
      // Students fetch failure shouldn't break the component
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
      throw err; // Re-throw to let DeleteModal handle loading state
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
        <LoadingOverlay visible />
      </Container>
    );
  }

  return (
    <div style={styles.organizationGroups}>
      <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} />

        {/* Header */}
        <div
          style={
            isMobile
              ? { ...styles.groupsHeader, flexDirection: "column" }
              : styles.groupsHeader
          }
        >
          <div style={styles.headerContent}>
            <Title order={2} style={styles.pageTitle}>
              Groups Management
            </Title>
            <Text style={styles.pageDescription}>
              Manage and organize your student groups
            </Text>
          </div>
          <Button
            onClick={handleCreateGroup}
            leftSection={<IconPlus size={16} />}
            disabled={!organizationId || loading}
            style={isMobile ? { width: "100%" } : {}}
          >
            Create Group
          </Button>
        </div>

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

        {/* Groups Grid */}
        {!loading && groups.length > 0 && (
          <Grid gutter="md">
            {groups.map((group) => (
              <Grid.Col
                key={group._id || group.id}
                span={{ base: 12, sm: 6, lg: 4 }}
              >
                <Card
                  style={{
                    ...styles.groupCard,
                    ":hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                  withBorder
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.groupInfo}>
                      <IconBuilding size={20} style={styles.groupIcon} />
                      <Title order={4} style={styles.groupName}>
                        {group.name}
                      </Title>
                    </div>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => handleEditGroup(group)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={() => handleDeleteClass(group)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.studentCount}>
                      <IconUsers size={16} />
                      <Text size="sm">
                        {group.studentCount || group.students?.length || 0}{" "}
                        Students
                      </Text>
                    </div>
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => handleViewGroup(group)}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && !error && (
          <div style={styles.emptyState}>
            <IconBuilding size={48} style={styles.emptyIcon} />
            <Title order={3} style={styles.emptyTitle}>
              No Groups Found
            </Title>
            <Text style={styles.emptyDescription}>
              Create your first group to start organizing students
            </Text>
            <Button
              onClick={handleCreateGroup}
              leftSection={<IconPlus size={16} />}
            >
              Create Your First Group
            </Button>
          </div>
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
        styles={styles}
      />
      {/* View Group Modal */}
      <ViewGroup
        viewModalOpened={viewModalOpened}
        setViewModalOpened={setViewModalOpened}
        selectedGroup={selectedGroup}
        styles={styles}
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
