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
} from "@mantine/core";
import apiClient from "../../../utils/api";
import "./Calendar.scss";
import { createSearchParams, useNavigate } from "react-router-dom";

const mockData = [
  { id: "1", title: "Math Exam", date: "2025-09-15", type: "exam" },
  { id: "2", title: "Science Workshop", date: "2025-09-18", type: "event" },
  {
    id: "3",
    title: "Project Deadline",
    start: "2025-09-20T10:00:00",
    end: "2025-09-20T12:00:00",
    type: "event",
  },
];

export default function CalendarPage({ path = "student" }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [opened, setOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("event");
  const [eventTime, setEventTime] = useState("");

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/event/calendar");
      setEvents(response.data.events);
    } catch (error) {
      console.error(error);
      setEvents(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    setSelectedDate(dateStr);

    // filter events on that date
    const dayEvents = events.filter(
      (event) => event.date === dateStr || event.start?.startsWith(dateStr)
    );

    setSelectedEvents(dayEvents);
    setOpened(true);

    setEventTitle("");
    setEventType("event");
    setEventTime("");
  };

  const handleNavigation = (id) => {
    // Navigate to exam details - you can implement this based on your routing setup
    console.log(`Navigate to exam details: ${id}`);
  };

  const handleCreateEvent = () => {
    console.log(`Redirecting to create event page for date: ${selectedDate}`);
    // You can implement navigation here based on your routing setup
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

  const handleEventClick = (eventId, type) => {
    if (type === "exam event") navigate(`/${path}/exams/details/${eventId}`);
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
    <div className="calendar-page">
      <h2 className="calendar-title">Exam & Event Calendar</h2>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Events on ${selectedDate ? formatDate(selectedDate) : ""}`}
        centered
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
        <Stack spacing="md">
          {/* Display existing events */}
          {selectedEvents.length > 0 && (
            <>
              <Text size="sm" weight={600} color="gray.7">
                Scheduled Events:
              </Text>
              {selectedEvents.map((event) => (
                <Card
                  key={event.id}
                  padding="sm"
                  withBorder
                  onClick={() => handleEventClick(event.id, event.type)}
                  style={{ cursor: "pointer" }}
                >
                  <Group position="apart" align="center">
                    <div>
                      <Text weight={500}>{event.title}</Text>
                      {event.start && (
                        <Text size="xs" color="gray.6">
                          {new Date(event.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                    </div>
                    <Badge
                      color={event.type === "exam" ? "red" : "blue"}
                      variant="light"
                    >
                      {event.type}
                    </Badge>
                  </Group>
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
              {/* <Button onClick={handleCreateEvent} variant="filled">
              Create Event
            </Button> */}

              <Button onClick={handleCreateExam} color="red" variant="filled">
                Create Exam
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>

      {/* FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        dateClick={handleDateClick}
        selectable={true}
        height="auto"
        eventClassNames={(arg) => {
          return arg.event.extendedProps.type === "exam"
            ? "fc-event-exam"
            : "fc-event-regular";
        }}
      />
    </div>
  );
}
