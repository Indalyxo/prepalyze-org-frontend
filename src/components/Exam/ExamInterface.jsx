import { useState, useEffect } from "react";
import { Container, Button, Text, Stack, Grid, Card } from "@mantine/core";
import InstructionModal from "./InstructionModal";
import "./exam-interface.scss";
import QuestionContent from "./Helpers/QuestionContent";
import ExamFooter from "./Helpers/ExamFooter";
import ExamHeader from "./Helpers/ExamHeader";
import StatusLegend from "./Helpers/StatusLegend";
import { useClipboardBlocker } from "../../utils/AntiCheat/ClipboardBlocker";
import TabSwitchTracker from "../../utils/AntiCheat/TabSwitchTracker";
import DetentionModal from "./ViolationModal/ViolationModal";

const QuestionNavigation = ({
  sectionData,
  currentSection,
  currentQuestion,
  onQuestionNavigation,
  getQuestionStatus,
}) => (
  <Card className="question-navigation" withBorder radius="lg" p="lg">
    <Text fw={600} size="md" mb="md" className="navigation-title">
      Question Navigator
    </Text>
    <Text size="sm" c="dimmed" mb="lg">
      Click on any question number to navigate
    </Text>
    <div className="question-grid">
      {sectionData.questions.map((_, index) => (
        <Button
          key={index}
          size="md"
          variant={index === currentQuestion ? "filled" : "outline"}
          onClick={() => onQuestionNavigation(index)}
          className={`question-btn ${getQuestionStatus(currentSection, index)}`}
          data-current={index === currentQuestion}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  </Card>
);

const ExamInterface = ({ examData }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(examData.timer);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionTimer, setInstructionTimer] = useState(null);
  const [instructionModalOpened, setInstructionModalOpened] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [reset, setReset] = useState(false);

  useClipboardBlocker();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showInstructions && currentQuestion === 0) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 5000);
      setInstructionTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [showInstructions, currentQuestion]);

  useEffect(() => {
    const currentKey = getCurrentQuestionKey();
    if (answers[currentKey] !== undefined && showInstructions) {
      setShowInstructions(false);
      if (instructionTimer) {
        clearTimeout(instructionTimer);
      }
    }
  }, [answers, showInstructions, instructionTimer]);

  useEffect(() => {
    const questionKey = `${currentSection}-${currentQuestion}`;
    setVisitedQuestions((prev) => new Set([...prev, questionKey]));
  }, [currentSection, currentQuestion]);

  const getCurrentQuestionKey = () => `${currentSection}-${currentQuestion}`;

  const getQuestionStatus = (sectionIndex, questionIndex) => {
    const key = `${sectionIndex}-${questionIndex}`;
    const isAnswered = answers[key] !== undefined;
    const isMarked = markedForReview.has(key);
    const isVisited = visitedQuestions.has(key);

    if (isAnswered && isMarked) return "answered-marked";
    if (isAnswered) return "answered";
    if (isMarked) return "marked";
    if (!isVisited) return "not-visited";
    return "not-answered";
  };

  const getStatusCounts = () => {
    let answered = 0,
      notAnswered = 0,
      notVisited = 0,
      marked = 0,
      answeredMarked = 0;

    examData.sections.forEach((section, sIndex) => {
      section.questions.forEach((_, qIndex) => {
        const status = getQuestionStatus(sIndex, qIndex);
        switch (status) {
          case "answered":
            answered++;
            break;
          case "not-answered":
            notAnswered++;
            break;
          case "not-visited":
            notVisited++;
            break;
          case "marked":
            marked++;
            break;
          case "answered-marked":
            answeredMarked++;
            break;
        }
      });
    });

    return { answered, notAnswered, notVisited, marked, answeredMarked };
  };

  const handleViolation = () => {
    setDisabled(true);
    setReset(true);
  };

  const handleAnswerChange = (value) => {
    const currentQuestionData =
      examData.sections[currentSection].questions[currentQuestion];

    setAnswers((prev) => ({
      ...prev,
      [getCurrentQuestionKey()]:
        currentQuestionData.type === "numerical"
          ? value
          : Number.parseInt(value),
    }));
  };

  const handleMarkForReview = () => {
    const key = getCurrentQuestionKey();
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleClearResponse = () => {
    const key = getCurrentQuestionKey();
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[key];
      return newAnswers;
    });
  };

  const handleNext = () => {
    const currentSectionData = examData.sections[currentSection];
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowInstructions(false);
    } else if (currentSection < examData.sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      setCurrentQuestion(0);
      setShowInstructions(false);
    }
  };

  const handleSaveAndNext = () => {
    handleNext();
  };

  const handleMarkAndNext = () => {
    handleMarkForReview();
    handleNext();
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowInstructions(false);
  };

  const handleSectionChange = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(0);
    setShowInstructions(true);
  };

  const handleShowInstructions = () => {
    setInstructionModalOpened(true);
  };

  const handleSubmit = () => {
    console.log("Exam submitted", { answers, markedForReview });
    alert("Exam submitted successfully!");
  };

  const currentSectionData = examData.sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];
  const statusCounts = getStatusCounts();
  const totalQuestions = examData.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );
  const answeredQuestions = statusCounts.answered + statusCounts.answeredMarked;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="exam-interface invisible-scrollbar">
      <InstructionModal
        opened={instructionModalOpened}
        onClose={() => setInstructionModalOpened(false)}
        section={currentSectionData}
        gradeSchema={{}}
      />
      <TabSwitchTracker
        disabled={disabled}
        onViolation={handleViolation}
        reset={reset}
        setReset={setReset}
      />
      <DetentionModal opened={disabled} onClose={() => setDisabled(false)} />

      <ExamHeader
        examData={examData}
        currentSection={currentSection}
        timeLeft={timeLeft}
        onSectionChange={handleSectionChange}
        onShowInstructions={handleShowInstructions}
      />

      <Container fluid className="exam-content invisible-scrollbar">
        <Grid gutter="xl">
          <Grid.Col span={8}>
            <div className="question-area invisible-scrollbar">
              <QuestionContent
                questionData={currentQuestionData}
                currentAnswer={answers[getCurrentQuestionKey()]}
                onAnswerChange={handleAnswerChange}
                questionNumber={currentQuestion + 1}
              />
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div className="exam-sidebar invisible-scrollbar">
              <Stack gap="lg">
                <StatusLegend statusCounts={statusCounts} />
                <QuestionNavigation
                  sectionData={currentSectionData}
                  currentSection={currentSection}
                  currentQuestion={currentQuestion}
                  onQuestionNavigation={handleQuestionNavigation}
                  getQuestionStatus={getQuestionStatus}
                />
              </Stack>
            </div>
          </Grid.Col>
        </Grid>
      </Container>

      <ExamFooter
        answers={answers}
        getCurrentQuestionKey={getCurrentQuestionKey}
        markedForReview={markedForReview}
        handleClearResponse={handleClearResponse}
        handleMarkForReview={handleMarkForReview}
        handleMarkAndNext={handleMarkAndNext}
        handleSaveAndNext={handleSaveAndNext}
        handleSubmit={handleSubmit}
      />

      <Text size="sm" c="gray" fw={500} fs="italic" className="help-btn">
        Powered by{" "}
        <span style={{ fontWeight: 700, color: "#228be6" }}>Prepalyze</span>
      </Text>
    </div>
  );
};

export default ExamInterface;
