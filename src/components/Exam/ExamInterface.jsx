import { useState, useEffect } from "react"
import { Container, Group, Button, Text, Box, Radio, Stack, Grid, Badge, Select, ActionIcon } from "@mantine/core"
import { IconDownload, IconHelp } from "@tabler/icons-react"
import "./exam-interface.scss"

const ExamInterface = ({ examData }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState(new Set())
  const [visitedQuestions, setVisitedQuestions] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(examData.timer)
  const [showInstructions, setShowInstructions] = useState(true)
  const [instructionTimer, setInstructionTimer] = useState(null)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (showInstructions && currentQuestion === 0) {
      const timer = setTimeout(() => {
        setShowInstructions(false)
      }, 3000)
      setInstructionTimer(timer)
      return () => clearTimeout(timer)
    }
  }, [showInstructions, currentQuestion])

  useEffect(() => {
    const currentKey = getCurrentQuestionKey()
    if (answers[currentKey] !== undefined && showInstructions) {
      setShowInstructions(false)
      if (instructionTimer) {
        clearTimeout(instructionTimer)
      }
    }
  }, [answers, showInstructions, instructionTimer])

  // Mark current question as visited
  useEffect(() => {
    const questionKey = `${currentSection}-${currentQuestion}`
    setVisitedQuestions((prev) => new Set([...prev, questionKey]))
  }, [currentSection, currentQuestion])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentQuestionKey = () => `${currentSection}-${currentQuestion}`

  const getQuestionStatus = (sectionIndex, questionIndex) => {
    const key = `${sectionIndex}-${questionIndex}`
    const isAnswered = answers[key] !== undefined
    const isMarked = markedForReview.has(key)
    const isVisited = visitedQuestions.has(key)

    if (isAnswered && isMarked) return "answered-marked"
    if (isAnswered) return "answered"
    if (isMarked) return "marked"
    if (!isVisited) return "not-visited"
    return "not-answered"
  }

  const getStatusCounts = () => {
    let answered = 0,
      notAnswered = 0,
      notVisited = 0,
      marked = 0,
      answeredMarked = 0

    examData.sections.forEach((section, sIndex) => {
      section.questions.forEach((_, qIndex) => {
        const status = getQuestionStatus(sIndex, qIndex)
        switch (status) {
          case "answered":
            answered++
            break
          case "not-answered":
            notAnswered++
            break
          case "not-visited":
            notVisited++
            break
          case "marked":
            marked++
            break
          case "answered-marked":
            answeredMarked++
            break
        }
      })
    })

    return { answered, notAnswered, notVisited, marked, answeredMarked }
  }

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [getCurrentQuestionKey()]: Number.parseInt(value),
    }))
  }

  const handleMarkForReview = () => {
    const key = getCurrentQuestionKey()
    setMarkedForReview((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const handleClearResponse = () => {
    const key = getCurrentQuestionKey()
    setAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[key]
      return newAnswers
    })
  }

  const handleNext = () => {
    const currentSectionData = examData.sections[currentSection]
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowInstructions(false)
    } else if (currentSection < examData.sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      setCurrentQuestion(0)
      setShowInstructions(true)
    }
  }

  const handleSaveAndNext = () => {
    handleNext()
  }

  const handleMarkAndNext = () => {
    handleMarkForReview()
    handleNext()
  }

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex)
    setShowInstructions(false)
  }

  const handleSectionChange = (sectionIndex) => {
    setCurrentSection(sectionIndex)
    setCurrentQuestion(0)
    setShowInstructions(true)
  }

  const handleSubmit = () => {
    // Handle exam submission
    console.log("Exam submitted", { answers, markedForReview })
    alert("Exam submitted successfully!")
  }

  const currentSectionData = examData.sections[currentSection]
  const currentQuestionData = currentSectionData.questions[currentQuestion]
  const statusCounts = getStatusCounts()

  return (
    <div className="exam-interface">
      {/* Header */}
      <div className="exam-header">
        <Group justify="space-between" className="header-content">
          <Group gap="xs">
            {examData.sections.map((section, index) => (
              <Button
                key={section.id}
                variant={index === currentSection ? "filled" : "light"}
                size="md"
                onClick={() => handleSectionChange(index)}
                className="section-tab"
              >
                {section.name}
                <Badge size="sm" className="question-count">
                  {section.questions.length}
                </Badge>
              </Button>
            ))}
          </Group>

          <Group gap="lg">
            <Text size="sm" fw={500}>
              View In:
            </Text>
            <Select data={["English", "Hindi"]} value={examData.language} size="sm" className="language-select" />
            <Text size="lg" fw={700} className="timer">
              {formatTime(timeLeft)}
            </Text>
            <ActionIcon variant="light" size="lg">
              <IconDownload size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </div>

      <Container fluid className="exam-content">
        <Grid gutter="xl">
          <Grid.Col span={8}>
            <div className="question-area">
              <Text size="xl" fw={700} mb="xl" className="question-header">
                Question No. {currentQuestion + 1}
              </Text>

              {showInstructions && currentQuestion === 0 ? (
                <Box className="instructions-box">
                  <Text size="lg" fw={700} ta="center" mb="lg" className="section-title">
                    SECTION {currentSectionData.name.toUpperCase()} (Maximum Marks: {currentSectionData.maxMarks})
                  </Text>
                  <Stack gap="md">
                    {currentSectionData.instructions.map((instruction, index) => (
                      <Text key={index} size="md" className="instruction-text">
                        • {instruction}
                      </Text>
                    ))}
                  </Stack>
                  <Text size="sm" ta="center" mt="lg" className="auto-hide-text">
                    Instructions will auto-hide in 3 seconds or when you select an answer
                  </Text>
                </Box>
              ) : (
                <Box className="question-content">
                  <Text size="lg" mb="xl" className="question-text">
                    {currentQuestionData.question}
                  </Text>

                  <Radio.Group value={answers[getCurrentQuestionKey()]?.toString() || ""} onChange={handleAnswerChange}>
                    <Stack gap="lg">
                      {currentQuestionData.options.map((option, index) => (
                        <Radio key={index} value={index.toString()} label={option} size="lg" className="option-radio" />
                      ))}
                    </Stack>
                  </Radio.Group>
                </Box>
              )}

              <Group justify="space-between" mt="lg" className="question-controls">
                <Group gap="md">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleMarkAndNext}
                    className="control-btn bg-transparent"
                  >
                    Mark for Review & Next
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleClearResponse}
                    className="control-btn bg-transparent"
                  >
                    Clear Response
                  </Button>
                </Group>

                <Button size="md" onClick={handleSaveAndNext} className="save-btn">
                  Save & Next
                </Button>
              </Group>
            </div>
          </Grid.Col>

          <Grid.Col span={4}>
            <div className="sidebar">
              {/* Status Legend */}
              <Box className="status-legend">
                <div className="status-item">
                  <div className="status-indicator answered"></div>
                  <Text size="sm">Answered</Text>
                  <Text size="sm" fw={700}>
                    {statusCounts.answered}
                  </Text>
                </div>
                <div className="status-item">
                  <div className="status-indicator not-answered"></div>
                  <Text size="sm">Not Answered</Text>
                  <Text size="sm" fw={700}>
                    {statusCounts.notAnswered}
                  </Text>
                </div>
                <div className="status-item">
                  <div className="status-indicator not-visited"></div>
                  <Text size="sm">Not Visited</Text>
                  <Text size="sm" fw={700}>
                    {statusCounts.notVisited}
                  </Text>
                </div>
                <div className="status-item">
                  <div className="status-indicator marked"></div>
                  <Text size="sm">Marked for Review</Text>
                  <Text size="sm" fw={700}>
                    {statusCounts.marked}
                  </Text>
                </div>
                <div className="status-item">
                  <div className="status-indicator answered-marked"></div>
                  <Text size="sm">Answered & Marked for Review (will be considered for evaluation)</Text>
                  <Text size="sm" fw={700}>
                    {statusCounts.answeredMarked}
                  </Text>
                </div>
              </Box>

              {/* Question Navigation */}
              <Box className="question-navigation">
                <div className="question-grid">
                  {currentSectionData.questions.map((_, index) => (
                    <Button
                      key={index}
                      size="lg"
                      variant={index === currentQuestion ? "filled" : "outline"}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`question-btn ${getQuestionStatus(currentSection, index)}`}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </Box>

              {/* Submit Button */}
              <Button fullWidth size="md" className="submit-btn" onClick={handleSubmit} mt="md">
                Submit
              </Button>
            </div>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Help Button */}
      <ActionIcon className="help-btn" variant="light" size="xl">
        <IconHelp size={24} />
      </ActionIcon>
    </div>
  )
}

export default ExamInterface
