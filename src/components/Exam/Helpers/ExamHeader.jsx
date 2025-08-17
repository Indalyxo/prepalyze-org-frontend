import { ActionIcon, Badge, Card, Container, Text } from "@mantine/core";
import {
  IconClock,
  IconDownload,
  IconInfoCircle,
  IconShield,
} from "@tabler/icons-react";

const ExamHeader = ({
  examData,
  currentSection,
  timeLeft,
  onSectionChange,
  onShowInstructions,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeStatus = () => {
    if (timeLeft > 1800) return "safe"; // > 30 minutes
    if (timeLeft > 600) return "warning"; // > 10 minutes
    return "danger"; // <= 10 minutes
  };

  return (
    <div className="exam-header">
      <Container fluid>
        <div className="header-main">
          <div className="exam-branding">
            <div className="exam-icon">
              <img
                src="/logo.svg"
                alt="Exam Logo"
                style={{ width: 40, height: 40 }}
              />
            </div>
            <div className="exam-details">
              <Text size="xl" fw={700} className="exam-title">
                {examData.title || "Test Exam"}
              </Text>
              <Text size="sm" c="dimmed" className="exam-subtitle">
                Secure Online Assessment Platform
              </Text>
              <Text size="sm" c="white" className="exam-description">
                Powered by Prepalyze
              </Text>
            </div>
          </div>

          <div className="header-status">
            <div className="candidate-info">
              <IconShield size={16} />
              <Text size="sm">
                Candidate ID: {examData.candidateId || "EX001"}
              </Text>
            </div>

            <div className={`timer-container ${getTimeStatus()}`}>
              <IconClock size={20} />
              <div className="timer-content">
                <Text size="lg" fw={700} className="timer-text">
                  {formatTime(timeLeft)}
                </Text>
              </div>
            </div>

            <ActionIcon
              variant="light"
              size="lg"
              className="download-btn"
              onClick={onShowInstructions}
            >
              <IconInfoCircle size={18} />
            </ActionIcon>

            <ActionIcon variant="light" size="lg" className="download-btn">
              <IconDownload size={18} />
            </ActionIcon>
          </div>
        </div>

        <div className="section-navigation">
          <div className="section-tabs">
            {examData.sections.map((section, index) => (
              <Card
                key={section.id}
                className={`section-card ${
                  index === currentSection ? "active" : ""
                }`}
                onClick={() => onSectionChange(index)}
                withBorder
                radius="md"
                p="sm"
              >
                <div className="section-content">
                  <Text fw={600} size="md" className="section-name">
                    {section.name}
                  </Text>
                  <Badge size="sm" variant="light" className="question-count">
                    {section.questions.length} Q
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ExamHeader;
