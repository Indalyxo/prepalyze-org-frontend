import { Card, Badge, Text, Radio, Stack } from "@mantine/core";

const QuestionContent = ({ questionData, currentAnswer, onAnswerChange, questionNumber }) => (
  <Card className="question-panel" withBorder radius="lg" p="xl">
    <div className="question-header">
      <Badge size="lg" variant="light" color="blue" className="question-number">
        Question {questionNumber}
      </Badge>
      <Text size="sm" c="dimmed">
        Multiple Choice
      </Text>
    </div>

    <Text size="lg" fw={500} className="question-text" my="xl">
      {questionData.question}
    </Text>

    <Radio.Group value={currentAnswer?.toString() || ""} onChange={onAnswerChange} className="options-container">
      <Stack gap="md">
        {questionData.options.map((option, index) => (
          <Card
            key={index}
            className={`option-card ${currentAnswer === index ? "selected" : ""}`}
            withBorder
            radius="md"
            p="md"
          >
            <Radio
              value={index.toString()}
              label={
                <div className="option-content">
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </div>
              }
              size="md"
            />
          </Card>
        ))}
      </Stack>
    </Radio.Group>
  </Card>
)


export default QuestionContent;