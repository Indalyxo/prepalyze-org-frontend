import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Badge,
  Stack,
  Button,
  Group,
  Modal,
  ScrollArea,
  Card,
  Avatar,
  Progress,
  Divider,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconQuestionMark,
  IconCalendar,
  IconEye,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconTrophy,
  IconMedal,
  IconAward,
  IconChevronRight,
} from "@tabler/icons-react";
import "./generic.scss";
import useAuthStore from "../../context/auth-store";

const ExamDetailsPage = () => {
  const navigate = useNavigate();
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const { user } = useAuthStore();

  const examData = {
    name: "Advanced JavaScript & React Assessment",
    description:
      "Comprehensive examination covering advanced JavaScript concepts, React framework, state management, and modern web development practices. This exam tests both theoretical knowledge and practical implementation skills.",
    date: "March 15, 2024",
    duration: "2 hours",
    totalQuestions: 25,
    attendees: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        score: 92,
        correctAnswers: 23,
        wrongAnswers: 2,
        attended: 25,
        notAttended: 0,
        timeSpent: "1h 45m",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob.smith@email.com",
        score: 76,
        correctAnswers: 19,
        wrongAnswers: 4,
        attended: 23,
        notAttended: 2,
        timeSpent: "1h 52m",
      },
      {
        id: 3,
        name: "Carol Davis",
        email: "carol.davis@email.com",
        score: 88,
        correctAnswers: 22,
        wrongAnswers: 3,
        attended: 25,
        notAttended: 0,
        timeSpent: "1h 38m",
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david.wilson@email.com",
        score: 64,
        correctAnswers: 16,
        wrongAnswers: 7,
        attended: 23,
        notAttended: 2,
        timeSpent: "1h 55m",
      },
      {
        id: 5,
        name: "Emma Brown",
        email: "emma.brown@email.com",
        score: 95,
        correctAnswers: 24,
        wrongAnswers: 1,
        attended: 25,
        notAttended: 0,
        timeSpent: "1h 42m",
      },
    ],
    questions: [
      {
        id: 1,
        question:
          "Explain the concept of closures in JavaScript and provide a practical example.",
        type: "Long Answer",
      },
      {
        id: 2,
        question:
          "What is the difference between useEffect and useLayoutEffect in React?",
        type: "Short Answer",
      },
      {
        id: 3,
        question:
          "Which of the following is the correct way to handle asynchronous operations in React?",
        type: "Multiple Choice",
      },
      {
        id: 4,
        question: "Implement a custom hook that manages local storage state.",
        type: "Code Implementation",
      },
      {
        id: 5,
        question: "What are the benefits of using React.memo()?",
        type: "Short Answer",
      },
      {
        id: 6,
        question: "Explain the event delegation pattern in JavaScript.",
        type: "Long Answer",
      },
      {
        id: 7,
        question: "Which statement about React Context is true?",
        type: "Multiple Choice",
      },
      {
        id: 8,
        question: "Create a function that debounces user input.",
        type: "Code Implementation",
      },
    ],
  };

  const section = user?.role === "student" ? "student" : "organization";

  const topPerformers = [...examData.attendees]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const handleAttendeeClick = (userId) => {
    navigate(`/${section}/exam/results/${userId}`);
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    // PDF download logic would go here
  };

  const handleDownloadWord = () => {
    console.log("Downloading Word document...");
    // Word download logic would go here
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <IconTrophy size={24} className="rank-icon gold" />;
      case 2:
        return <IconMedal size={24} className="rank-icon silver" />;
      case 3:
        return <IconAward size={24} className="rank-icon bronze" />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "green";
    if (score >= 80) return "blue";
    if (score >= 70) return "yellow";
    return "red";
  };

  return (
    <div className="exam-details-container">
      <div className="exam-header">
        <div className="header-content">
          <Title order={1} className="exam-title">
            {examData.name}
          </Title>
          <Text className="exam-description">{examData.description}</Text>

          <div className="exam-meta">
            <div className="meta-item">
              <IconCalendar size={20} className="meta-icon" />
              <span>{examData.date}</span>
            </div>
            <div className="meta-item">
              <IconClock size={20} className="meta-icon" />
              <span>{examData.duration}</span>
            </div>
            <div className="meta-item">
              <IconQuestionMark size={20} className="meta-icon" />
              <span>{examData.totalQuestions} Questions</span>
            </div>
            <div className="meta-item">
              <IconUsers size={20} className="meta-icon" />
              <span>{examData.attendees.length} Attendees</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="options-section" shadow="sm" padding="lg" radius="md">
        <Title order={3} className="options-title">
          Exam Options
        </Title>
        <Group gap="md" className="options-buttons">
          <Button
            leftSection={<IconEye size={18} />}
            variant="filled"
            color="blue"
            onClick={() => setQuestionsModalOpen(true)}
            size="md"
          >
            View Questions
          </Button>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            variant="outline"
            color="red"
            onClick={handleDownloadPDF}
            size="md"
          >
            Download PDF
          </Button>
          <Button
            leftSection={<IconFileTypeDoc size={18} />}
            variant="outline"
            color="blue"
            onClick={handleDownloadWord}
            size="md"
          >
            Download Word
          </Button>
        </Group>
      </Card>

      <Card
        className="leaderboard-section"
        shadow="sm"
        padding="lg"
        radius="md"
      >
        <Title order={2} className="section-title">
          <IconTrophy size={28} className="title-icon" />
          Top Performers
        </Title>
        <Text size="sm" c="dimmed" mb="lg">
          Celebrating our highest achievers in this examination
        </Text>

        <div className="leaderboard-list">
          {topPerformers.map((performer, index) => (
            <div
              key={performer.id}
              className={`leaderboard-item ${index < 3 ? "podium" : ""}`}
              onClick={() => handleAttendeeClick(performer.id)}
            >
              <div className="rank-section">{getRankIcon(index + 1)}</div>

              <Avatar
                size="lg"
                radius="xl"
                color={getScoreColor(performer.score)}
                className="performer-avatar"
              >
                {performer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>

              <div className="performer-info">
                <Text fw={600} size="lg" className="performer-name">
                  {performer.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {performer.email}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Completed in {performer.timeSpent}
                </Text>
              </div>

              <div className="performance-metrics">
                <div className="score-display">
                  <Text size="xl" fw={700} c={getScoreColor(performer.score)}>
                    {performer.score}%
                  </Text>
                  <Progress
                    value={performer.score}
                    color={getScoreColor(performer.score)}
                    size="sm"
                    radius="xl"
                    mt={4}
                  />
                </div>
                <Text size="xs" c="dimmed" ta="center" mt={4}>
                  {performer.correctAnswers}/{examData.totalQuestions} correct
                </Text>
              </div>

              <IconChevronRight size={20} className="chevron-icon" />
            </div>
          ))}
        </div>
      </Card>

      <Divider my="xl" />

      <Card className="attendance-section" shadow="sm" padding="lg" radius="md">
        <Title order={2} className="section-title">
          <IconUsers size={24} className="title-icon" />
          All Attendees ({examData.attendees.length})
        </Title>

        <div className="attendees-grid">
          {examData.attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="attendee-card-new"
              onClick={() => handleAttendeeClick(attendee.id)}
            >
              <Avatar
                size="lg"
                radius="xl"
                color={getScoreColor(attendee.score)}
                className="attendee-avatar"
              >
               <img src={user.organization.logoUrl || user.organization.logo} alt={attendee.name} />
              </Avatar>

              <div className="attendee-details">
                <div className="attendee-name">{attendee.name}</div>
                <div className="attendee-email">{attendee.email}</div>
                <div className="attendee-metrics">
                  <div className="metric">
                    <span className="metric-value">{attendee.score}%</span>
                    <span className="metric-label">Score</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {attendee.attended}/{examData.totalQuestions}
                    </span>
                    <span className="metric-label">Completed</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{attendee.timeSpent}</span>
                    <span className="metric-label">Time Spent</span>
                  </div>
                </div>
              </div>

              <Badge
                color={getScoreColor(attendee.score)}
                variant="filled"
                size="lg"
                className="attendee-score-badge"
              >
                {attendee.score}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        opened={questionsModalOpen}
        onClose={() => setQuestionsModalOpen(false)}
        title={
          <Group gap="sm">
            <IconQuestionMark size={24} />
            <Text size="lg" fw={600}>
              Exam Questions ({examData.questions.length})
            </Text>
          </Group>
        }
        size="xl"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="md">
          {examData.questions.map((question) => (
            <div key={question.id} className="question-item-modal">
              <div className="question-header">
                <span className="question-number">Question {question.id}</span>
                <Badge variant="light" color="blue" size="sm">
                  {question.type}
                </Badge>
              </div>
              <div className="question-text">{question.question}</div>
            </div>
          ))}
        </Stack>
      </Modal>
    </div>
  );
};

export default ExamDetailsPage;
