import { Container, Button, Text, Badge } from "@mantine/core"
import { IconClock, IconBook, IconInfoCircle } from "@tabler/icons-react"

const ExamHeader = ({ examData, currentSection, timeLeft, onSectionChange, onShowInstructions }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerStatus = () => {
    if (timeLeft > 1800) return "safe" // > 30 minutes
    if (timeLeft > 300) return "warning" // > 5 minutes
    return "danger" // <= 5 minutes
  }

  return (
    <div className="exam-header">
      <Container fluid>
        <div className="header-main">
          <div className="exam-branding">
            <div className="exam-icon">
              <IconBook size={24} />
            </div>
            <div className="exam-details">
              <Text className="exam-title">{examData.title}</Text>
              <Text className="exam-subtitle">{examData.subtitle}</Text>
            </div>
          </div>

          <div className="header-status">
            <div className="candidate-info">
              <Text>Candidate: John Doe</Text>
            </div>

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
                className={`section-card ${index === currentSection ? "active" : ""}`}
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
  )
}

export default ExamHeader
