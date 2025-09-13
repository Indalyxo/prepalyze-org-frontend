import { useEffect, useState } from "react";
import { Container, Button, Text, Badge, Modal, Image } from "@mantine/core";
import { IconClock, IconBook, IconInfoCircle } from "@tabler/icons-react";
import useAuthStore from "../../../context/auth-store";

const ExamHeader = ({
  examData,
  currentSection,
  onSectionChange,
  onShowInstructions,
  onToggleFullScreen,
  isFullScreen
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [examNotStarted, setExamNotStarted] = useState(false);
  const { user } = useAuthStore();
  // Convert ISO strings to Date objects
  const examStart = new Date(examData?.timing?.start);
  const examEnd = new Date(examData?.timing?.end);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      if (now < examStart) {
        setExamNotStarted(true);
        setTimeLeft(Math.floor((examEnd - examStart) / 1000)); // full duration
      } else {
        setExamNotStarted(false);
        let remaining = Math.floor((examEnd - now) / 1000);
        if (remaining < 0) remaining = 0;
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [examStart, examEnd]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerStatus = () => {
    if (timeLeft > 1800) return "safe";
    if (timeLeft > 300) return "warning";
    return "danger";
  };

  return (
    <>
      {/* Modal for exam not started */}
      <Modal opened={false} onClose={() => {}} centered withCloseButton={false}>
        <div className="p-4 text-center">
          <Text size="lg" fw={600}>
            ⏳ Exam Not Started
          </Text>
          <Text mt="sm">
            The exam has not started yet. Please wait until{" "}
            <strong>{examStart.toLocaleString()}</strong>.
          </Text>
          <Button mt="md" disabled fullWidth>
            You cannot start yet
          </Button>
        </div>
      </Modal>

      <div className="exam-header">
        <Container fluid>
          <div className="header-main">
            <div className="exam-branding">
              <div className="exam-icon">
                <Image
                  src={user.organization.logoUrl || user.organization.logo}
                  alt="exam icon"
                  width={40}
                  height={40}
                />
              </div>
              <div className="exam-details">
                <Text className="exam-title">{examData.examTitle}</Text>
                <Text className="exam-subtitle">{examData.subTitle}</Text>
              </div>
            </div>

            <div className="header-status">
              <div className="candidate-info">
                <Text>Candidate: {user.name}</Text>
              </div>

              <Button
                variant="outline"
                leftSection={<IconBook size={16} />}
                onClick={onToggleFullScreen}
                className="download-btn"
              >
                {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>

              <div className={`timer-container ${getTimerStatus()}`}>
                <IconClock size={20} />
                <div className="timer-content">
                  <Text className="timer-text">{formatTime(timeLeft)}</Text>
                </div>
              </div>

              <Button
                variant="outline"
                leftSection={<IconInfoCircle size={16} />}
                onClick={onShowInstructions}
                className="download-btn"
              >
                Instructions
              </Button>
            </div>
          </div>

          <div className="section-navigation">
            <div className="section-tabs">
              {examData.sections.map((section, index) => (
                <div
                  key={index}
                  className={`section-card ${
                    index === currentSection ? "active" : ""
                  }`}
                  onClick={() => onSectionChange(index)}
                >
                  <div className="section-content">
                    <Text className="section-name">{section.name}</Text>
                    <Badge className="question-count" size="sm">
                      {section.questions.length}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ExamHeader;
