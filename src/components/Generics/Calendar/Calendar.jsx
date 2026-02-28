import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Modal,
  Text,
  Button,
  Stack,
  Group,
  Divider,
  Card,
  Badge,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Title,
  ActionIcon,
  Tooltip,
  Box,
  Flex,
  ThemeIcon,
  Container,
  Drawer,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconFilter,
  IconFilterOff,
  IconCalendarEvent,
  IconTrendingUp,
  IconSparkles,
} from "@tabler/icons-react";
import apiClient, { eventAPI } from "../../../utils/api";
import "./Calendar.scss";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function CalendarPage({ path = "student" }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [filterDrawerOpened, setFilterDrawerOpened] = useState(false);

  const [opened, setOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // meeting creation state
  const [meetingModalOpened, setMeetingModalOpened] = useState(false);

  const meetingForm = useForm({
    initialValues: {
      title: "",
      date: "",
      description: "",
      link: "",
      image: "",
    },

    validate: {
      title: (val) => (val.trim() ? null : "Required"),
      date: (val) => (val ? null : "Required"),
      link: (val) =>
        /^https?:\/\//.test(val) ? null : "Must be a valid URL (http:// or https://)",
    },
  });

  useEffect(() => {
    if (selectedDate) {
      meetingForm.setFieldValue("date", selectedDate);
    }
  }, [selectedDate]);

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventAPI.calendar();
      const eventsData = response.data.events;
      setEvents(eventsData);
      const subjects = response.data.subjects.map((subject) => ({
        value: subject,
        label: subject,
      }));

      setSubjects(subjects);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on selected subjects
  useEffect(() => {
    if (selectedSubjects.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.subjects?.some((subject) => selectedSubjects.includes(subject))
      );
      setFilteredEvents(filtered);
    }
  }, [events, selectedSubjects]);

  const handleSubjectFilter = (subjects) => {
    setSelectedSubjects(subjects);
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
  };

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    setSelectedDate(dateStr);

    // filter events on that date from filtered events
    const dayEvents = filteredEvents.filter(
      (event) => event.date === dateStr || event.start?.startsWith(dateStr)
    );

    setSelectedEvents(dayEvents);
    setOpened(true);
  };

  const handleCreateExam = () => {
    return navigate({
      pathname: `/${path}/exams`,
      search: `?${createSearchParams({
        create: "true",
        date: selectedDate,
      })}`,
    });
  };

  // open meeting creation modal
  const handleCreateMeeting = () => {
    if (selectedDate) {
      meetingForm.setFieldValue("date", selectedDate);
    }
    setMeetingModalOpened(true);
  };

  // join event (record attendance then open link)
  const handleJoin = async (event) => {
    if (!event.link) return;
    try {
      await eventAPI.attend(event.id);
      // optimistic update of count locally
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, attendeeCount: (e.attendeeCount || 0) + 1 }
            : e
        )
      );
    } catch (err) {
      console.error("attendance error", err);
    }
    window.open(event.link, "_blank");
  };

  const handleEventClick = (eventId, type) => {
    if (type === "exam event") navigate(`/${path}/exams/details/${eventId}`);
    // pure events don't navigate; join button handles link
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  return (
    <Container fluid className="calendar-page">
      {/* Header */}
      <Box className="calendar-hero">
        <Container size="xl" mx={"auto"} className="hero-content">
          <Group justify="space-between" align="center">
            <Group align="center" gap="md">
              <ThemeIcon size={60} radius="md" color="gray">
                <IconCalendarEvent size={30} />
              </ThemeIcon>

              <Stack gap="xs">
                <Title order={1} className="hero-title">
                  Academic Calendar
                </Title>
                <Text size="md" c="dimmed" className="hero-subtitle">
                  Track your exams, events, and important dates in one place
                </Text>
              </Stack>
            </Group>

            {/* Header Actions */}
            <Group gap="sm">
              <Tooltip label="Open Filters">
                <ActionIcon
                  variant="light"
                  size="lg"
                  onClick={() => setFilterDrawerOpened(true)}
                  color="gray"
                >
                  <IconFilter size={20} />
                </ActionIcon>
              </Tooltip>

              {selectedSubjects.length > 0 && (
                <Badge variant="filled" color="blue" size="lg">
                  {selectedSubjects.length} filter
                  {selectedSubjects.length > 1 ? "s" : ""} active
                </Badge>
              )}
            </Group>
          </Group>

          {/* Stats Cards
          <Group gap="lg" className="stats-container" mt="xl">
            <Paper className="stat-card" p="md">
              <Group gap="sm">
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconBookmark size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>
                    {events.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total Events
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper className="stat-card" p="md">
              <Group gap="sm">
                <ThemeIcon size="lg" variant="light" color="red">
                  <IconClock size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>
                    {events.filter((e) => e.type === "exam event").length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Exams
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper className="stat-card" p="md">
              <Group gap="sm">
                <ThemeIcon size="lg" variant="light" color="green">
                  <IconUsers size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>
                    {subjects.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Subjects
                  </Text>
                </div>
              </Group>
            </Paper>
          </Group> */}
        </Container>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        opened={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        title="Smart Filters"
        position="right"
        size="md"
        styles={{
          title: {
            fontSize: "1.25rem",
            fontWeight: 600,
          },
        }}
      >
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Group align="center" gap="sm">
              <ThemeIcon size="sm" variant="light" color="violet">
                <IconSparkles size={16} />
              </ThemeIcon>
              <Text size="sm" fw={500} c="dimmed">
                Filter by Subject
              </Text>
            </Group>

            {selectedSubjects.length > 0 && (
              <Tooltip label="Clear All Filters">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={clearFilters}
                  color="red"
                >
                  <IconFilterOff size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>

          <MultiSelect
            placeholder="🔍 Search and select subjects..."
            data={subjects}
            value={selectedSubjects}
            onChange={handleSubjectFilter}
            searchable
            clearable
            maxDropdownHeight={200}
            leftSection={<IconTrendingUp size={16} />}
          />

          {selectedSubjects.length > 0 && (
            <Box className="filter-summary">
              <Group gap="xs" mb="sm">
                <Text size="sm" fw={500}>
                  Active Filters:
                </Text>
                <Badge variant="light" color="blue" size="sm">
                  {filteredEvents.length} of {events.length} events
                </Badge>
              </Group>
              <Group gap="xs">
                {selectedSubjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="dot"
                    size="md"
                    className="subject-badge"
                  >
                    {subject}
                  </Badge>
                ))}
              </Group>
            </Box>
          )}

          <Divider />

          <Stack gap="sm">
            <Text size="sm" fw={500} c="dimmed">
              Quick Actions
            </Text>
            <Button
              variant="light"
              leftSection={<IconFilterOff size={16} />}
              onClick={clearFilters}
              disabled={selectedSubjects.length === 0}
              fullWidth
            >
              Clear All Filters
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Events on ${selectedDate ? formatDate(selectedDate) : ""}`}
        centered
        className="invisible-scrollbar"
        size="md"
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
      >
        <Stack spacing="md" className="invisible-scrollbar">
          {/* Display existing events */}
          {selectedEvents.length > 0 && (
            <>
              <Text size="sm" weight={600} color="gray.7">
                Scheduled Events:
              </Text>
              {selectedEvents.map((event) => (
                <Card
                  key={event.id}
                  padding="md"
                  withBorder
                  onClick={() =>
                    event.type === "exam event" &&
                    handleEventClick(event.id, event.type)
                  }
                  className="event-card invisible-scrollbar"
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text fw={600} size="sm" className="event-title">
                        {event.title}
                      </Text>
                      <Text size="xs" c="dimmed" className="event-id">
                        ID: {event.id}
                      </Text>
                      {event.attendeeCount != null && (
                        <Text size="xs" c="dimmed">
                          Attendees: {event.attendeeCount}
                        </Text>
                      )}
                      {event.subjects && event.subjects.length > 0 && (
                        <Group gap="xs">
                          {event.subjects.map((subject, idx) => (
                            <Badge
                              key={idx}
                              variant="dot"
                              size="xs"
                              className="subject-tag"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </Group>
                      )}
                      {event.start && (
                        <Text size="xs" c="dimmed">
                          {new Date(event.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                    </Stack>
                    <Badge
                      color={event.type === "exam event" ? "red" : "blue"}
                      variant="filled"
                      size="sm"
                      className="event-type-badge"
                    >
                      {event.type === "exam event" ? "EXAM" : "EVENT"}
                    </Badge>
                  </Group>
                  {event.type === "pure event" && (
                    <Button
                      size="xs"
                      mt="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(event);
                      }}
                    >
                      Join
                    </Button>
                  )}
                </Card>
              ))}
              <Divider />
            </>
          )}

          {selectedEvents.length === 0 && (
            <Text color="dimmed" size="sm" align="center">
              No events scheduled for this date
            </Text>
          )}

          {path !== "student" && (
            <Group position="center" justify="flex-end" spacing="sm" mt="md">
              <Button onClick={handleCreateMeeting} variant="light">
                Create Meeting
              </Button>
              <Button onClick={handleCreateExam} color="red" variant="filled">
                Create Exam
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>

      {/* Meeting creation modal (organizer only) */}
      <Modal
        opened={meetingModalOpened}
        onClose={() => setMeetingModalOpened(false)}
        title="Create Meeting"
        centered
        size="md"
      >
        <form
          onSubmit={meetingForm.onSubmit(async (values) => {
            try {
              const payload = {
                name: values.title,
                date: values.date,
                description: values.description,
                link: values.link,
                image: values.image,
                visibleTo: ["student"],
              };
              await apiClient.post("/event", payload);
              await fetchEvents();
              setMeetingModalOpened(false);
              meetingForm.reset();
            } catch (err) {
              console.error("failed to create meeting", err);
            }
          })}
        >
          <TextInput
            label="Title"
            {...meetingForm.getInputProps("title")}
            required
          />
          <TextInput
            label="Date & time"
            type="datetime-local"
            {...meetingForm.getInputProps("date")}
            required
          />
          <TextInput
            label="Link (zoom / meet / etc)"
            {...meetingForm.getInputProps("link")}
            required
          />
          <TextInput
            label="Image URL (optional)"
            {...meetingForm.getInputProps("image")}
          />
          <Textarea
            label="Description"
            {...meetingForm.getInputProps("description")}
            required
          />
          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>

      {/* Calendar Section */}
      <Container size="xl">
        <Paper className="calendar-container">
          <div className="calendar-wrapper">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={filteredEvents}
              dateClick={handleDateClick}
              selectable={true}
              height="auto"
              dayMaxEvents={2} // Limit events per day
              moreLinkClick="popover" // Show popover when clicking "more"
              eventClassNames={(arg) => {
                const type = arg.event.extendedProps.type;
                const subjects = arg.event.extendedProps.subjects || [];
                const primarySubject = subjects[0];
                return [
                  type === "exam event" ? "fc-event-exam" : "fc-event-regular",
                  primarySubject
                    ? `fc-event-${primarySubject
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");
              }}
              eventContent={(arg) => {
                const subjects = arg.event.extendedProps.subjects || [];
                return {
                  html: `
                    <div class="fc-event-content-compact">
                      <div class="fc-event-main">
                        <span class="fc-event-type-dot ${
                          arg.event.extendedProps.type === "exam event"
                            ? "exam"
                            : "event"
                        }"></span>
                        <span class="fc-event-title">${arg.event.title}</span>
                      </div>
                      ${
                        subjects.length > 0
                          ? `<div class="fc-event-subject">${subjects[0]}</div>`
                          : ""
                      }
                    </div>
                  `,
                };
              }}
            />
          </div>
        </Paper>
      </Container>
    </Container>
  );
}
