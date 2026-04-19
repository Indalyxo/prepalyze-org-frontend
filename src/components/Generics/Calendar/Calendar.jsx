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
  ThemeIcon,
  Container,
  Drawer,
  TextInput,
  Textarea,
  Avatar
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconFilter,
  IconFilterOff,
  IconCalendarEvent,
  IconTrendingUp,
  IconSparkles,
  IconVideo,
  IconCheck
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
        loaderProps={{ color: "violet", type: "bars" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  return (
    <Box className="calendar-page">
      {/* Premium Header Container */}
      <Box className="calendar-hero-wrapper" mb={30}>
        <Container size="xl">
          <Paper shadow="sm" radius="xl" p="xl" className="calendar-hero-content">
            <Group justify="space-between" align="center">
              <Group align="center" gap="lg">
                <ThemeIcon size={64} radius="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                  <IconCalendarEvent size={32} />
                </ThemeIcon>

                <Stack gap={2}>
                  <Title order={1} className="hero-title" fw={800}>
                    Academic Calendar
                  </Title>
                  <Text size="md" c="dimmed" className="hero-subtitle">
                    Schedule, manage, and track all major events effortlessly
                  </Text>
                </Stack>
              </Group>

              {/* Header Actions */}
              <Group gap="sm">
                <Tooltip label="Advanced Filtering" withArrow position="bottom">
                  <ActionIcon
                    variant="light"
                    size="xl"
                    radius="md"
                    onClick={() => setFilterDrawerOpened(true)}
                    color={selectedSubjects.length > 0 ? "indigo" : "gray"}
                    className="filter-btn"
                  >
                    <IconFilter size={22} />
                    {selectedSubjects.length > 0 && <div className="filter-dot" />}
                  </ActionIcon>
                </Tooltip>

                {selectedSubjects.length > 0 && (
                  <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} size="lg" radius="sm">
                    {selectedSubjects.length} Active
                  </Badge>
                )}
              </Group>
            </Group>
          </Paper>
        </Container>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        opened={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        title={
          <Group gap="sm">
            <IconFilter size={20} color="#5c7cfa" />
            <Text fw={600} size="lg">Event Filters</Text>
          </Group>
        }
        position="right"
        size="md"
        overlayProps={{ blur: 3, opacity: 0.2 }}
        styles={{
          header: { padding: '1.5rem', borderBottom: '1px solid #f1f3f5' },
          body: { padding: '1.5rem' }
        }}
      >
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Group align="center" gap="xs">
              <ThemeIcon size="sm" variant="light" color="indigo" radius="md">
                <IconSparkles size={16} />
              </ThemeIcon>
              <Text size="sm" fw={600} color="dimmed" tt="uppercase" letterSpacing={1}>
                By Subject Focus
              </Text>
            </Group>

            {selectedSubjects.length > 0 && (
              <Tooltip label="Clear All Filters" withArrow>
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
            placeholder="🔍 Select subjects..."
            data={subjects}
            value={selectedSubjects}
            onChange={handleSubjectFilter}
            searchable
            clearable
            size="md"
            radius="md"
            maxDropdownHeight={250}
            leftSection={<IconTrendingUp size={18} />}
          />

          {selectedSubjects.length > 0 && (
            <Paper withBorder radius="md" p="md" className="filter-summary-box">
              <Group gap="xs" mb="sm" justify="space-between">
                <Text size="sm" fw={600} color="dimmed">
                  Filtering Results
                </Text>
                <Badge variant="light" color="indigo" size="md">
                  {filteredEvents.length} of {events.length} events
                </Badge>
              </Group>
              <Group gap="xs">
                {selectedSubjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="dot"
                    size="md"
                    className="subject-badge-drawer"
                    color="indigo"
                  >
                    {subject}
                  </Badge>
                ))}
              </Group>
            </Paper>
          )}

          <Divider />

          <Stack gap="sm">
            <Button
              variant="light"
              color="red"
              leftSection={<IconFilterOff size={18} />}
              onClick={clearFilters}
              disabled={selectedSubjects.length === 0}
              fullWidth
              size="md"
              radius="md"
            >
              Reset All Filters
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group gap="sm" align="center">
            <IconCalendarEvent size={22} color="#3b5bdb" />
            <Text fw={700} size="xl">{selectedDate ? formatDate(selectedDate) : ""}</Text>
          </Group>
        }
        centered
        className="invisible-scrollbar"
        size="lg"
        radius="lg"
        overlayProps={{ blur: 4, opacity: 0.3 }}
        styles={{
          header: {
            padding: "24px 24px 16px",
            borderBottom: "1px solid var(--mantine-glass-border)",
            background: "var(--mantine-color-body)",
          },
          body: {
            padding: "24px",
            backgroundColor: "var(--mantine-color-body)"
          }
        }}
      >
        <Stack spacing="xl" className="invisible-scrollbar">
          {/* Display existing events */}
          {selectedEvents.length > 0 ? (
            <Stack gap="md">
              <Text size="sm" fw={700} tt="uppercase" c="dimmed" letterSpacing={1}>
                Scheduled Events ({selectedEvents.length})
              </Text>
              {selectedEvents.map((event) => (
                <Paper
                  key={event.id}
                  shadow="sm"
                  radius="md"
                  p="lg"
                  withBorder
                  onClick={() =>
                    event.type === "exam event" &&
                    handleEventClick(event.id, event.type)
                  }
                  className={`modal-event-card ${event.type === "exam event" ? 'exam-type' : 'regular-type'}`}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group align="flex-start" gap="md" wrap="nowrap" style={{ flex: 1 }}>
                       <ThemeIcon 
                        size="xl" 
                        radius="md" 
                        variant="light" 
                        color={event.type === "exam event" ? "red" : "indigo"}
                      >
                         {event.type === "exam event" ? <IconCheck size={24} /> : <IconVideo size={24} />}
                      </ThemeIcon>

                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group justify="space-between" align="center" mb={4}>
                            <Text fw={700} size="lg" className="event-title">
                                {event.title}
                            </Text>
                            <Badge
                                color={event.type === "exam event" ? "red" : "indigo"}
                                variant="light"
                                size="sm"
                                radius="sm"
                            >
                                {event.type === "exam event" ? "ASSESSMENT" : "MEETING"}
                            </Badge>
                        </Group>

                        <Group gap="md">
                             <Text size="sm" c="dimmed" ff="monospace" bg="gray.1" px={6} py={2} style={{ borderRadius: '4px' }}>
                                #{event.id?.substring(0,8)}...
                            </Text>

                            {event.start && (
                                <Text size="sm" fw={600} c="dark.3">
                                    {new Date(event.start).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            )}

                             {event.attendeeCount != null && (
                                <Group gap={4}>
                                    <Avatar size="sm" radius="xl" color="blue" />
                                    <Text size="sm" fw={500} c="dimmed">{event.attendeeCount} joining</Text>
                                </Group>
                            )}
                        </Group>
                       
                        {event.subjects && event.subjects.length > 0 && (
                          <Group gap="xs" mt="xs">
                            {event.subjects.map((subject, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                color="gray"
                                size="sm"
                                radius="xl"
                              >
                                {subject}
                              </Badge>
                            ))}
                          </Group>
                        )}
                      </Stack>
                    </Group>
                  </Group>

                  {event.type === "pure event" && (
                    <Box mt="md" pt="md" style={{ borderTop: '1px dashed #dee2e6' }}>
                        <Button
                            fullWidth
                            variant="gradient"
                            gradient={{ from: 'indigo.6', to: 'violet.6', deg: 45 }}
                            size="md"
                            radius="md"
                            leftSection={<IconVideo size={20} />}
                            className="join-meeting-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJoin(event);
                            }}
                        >
                            Join Video Session
                        </Button>
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper p="xl" radius="xl" withBorder className="no-data-paper">
                <ThemeIcon size={72} radius="xl" variant="light" color="gray" mx="auto" mb="md" className="pulse-icon">
                    <IconCalendarEvent size={36} />
                </ThemeIcon>
                <Text fw={800} size="xl" color="var(--mantine-color-text)">Free Day!</Text>
                <Text color="dimmed" size="md" mt="xs" fw={500}>
                   There are no exams or sessions scheduled for this date.
                </Text>
            </Paper>
          )}

          {path !== "student" && (
            <Group justify="center" gap="md" mt="xl" grow>
              <Button 
                onClick={handleCreateMeeting} 
                variant="light" 
                size="lg" 
                radius="xl" 
                color="blue" 
                leftSection={<IconVideo size={20} />}
                className="action-button-calendar"
              >
                Schedule Meet
              </Button>
              <Button 
                onClick={handleCreateExam} 
                color="blue" 
                variant="filled" 
                size="lg" 
                radius="xl" 
                leftSection={<IconCheck size={20}/>}
                className="action-button-calendar"
              >
                Assign Exam
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>

      {/* Meeting creation modal (organizer only) */}
      <Modal
        opened={meetingModalOpened}
        onClose={() => setMeetingModalOpened(false)}
        title={<Text fw={700} size="xl">Schedule a Session</Text>}
        centered
        size="lg"
        radius="md"
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
          <Stack gap="md">
            <TextInput
                label="Session Title"
                placeholder="E.g., Special Integration Class"
                size="md"
                {...meetingForm.getInputProps("title")}
                required
            />
            <TextInput
                label="Date & Time"
                type="datetime-local"
                size="md"
                {...meetingForm.getInputProps("date")}
                required
            />
            <TextInput
                label="Meeting Link"
                placeholder="https://zoom.us/j/..."
                size="md"
                {...meetingForm.getInputProps("link")}
                required
            />
            <TextInput
                label="Thumbnail URL (Optional)"
                placeholder="https://example.com/image.png"
                size="md"
                {...meetingForm.getInputProps("image")}
            />
            <Textarea
                label="Agenda & Description"
                placeholder="What will be discussed?"
                autosize
                minRows={3}
                size="md"
                {...meetingForm.getInputProps("description")}
                required
            />
            <Group justify="flex-end" mt="xl">
                <Button variant="subtle" color="gray" onClick={() => setMeetingModalOpened(false)}>Cancel</Button>
                <Button type="submit" size="md" radius="md" color="indigo">Create Session</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Calendar Section */}
      <Container size="xl">
        <Paper className="calendar-main-container" shadow="sm" radius="xl" withBorder={false}>
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
                right: "dayGridMonth,timeGridWeek,listWeek",
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
                  type === "exam event" ? "fc-event-exam-type" : "fc-event-regular-type",
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
                // format time
                const timeStr = arg.event.start ? new Date(arg.event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit'}) : '';
                return {
                  html: `
                    <div class="fc-event-content-modern">
                      <div class="fc-event-main">
                        <div class="fc-event-dot ${
                          arg.event.extendedProps.type === "exam event" ? "exam" : "event"
                        }"></div>
                        <span class="fc-event-time">${timeStr}</span>
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
    </Box>
  );
}
