import { Card, Tabs, Text, Stack } from "@mantine/core"
import "./exam-questions.scss"

export default function QuestionTabs({ question, index = 1 }) {
  const { stem, options = [], explanation, tags = [] } = question || {}

  return (
    <Card className="question-card" withBorder={false} padding={0} radius="md">
      <div className="card-head">
        <div className="tags">
          {tags.slice(0, 3).map((t) => (
            <span className="pill" key={t}>
              {t}
            </span>
          ))}
        </div>
        <span className="qid">{`Q${index}`}</span>
      </div>

      <div className="question-tabs">
        <Tabs defaultValue="question" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="question">Question</Tabs.Tab>
            <Tabs.Tab value="options">Options</Tabs.Tab>
            <Tabs.Tab value="explanation">Explanation</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="question" className="tab-panel">
            <Stack gap={6}>
              <Text className="stem">{stem}</Text>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="options" className="tab-panel">
            <div className="options-list">
              {options.map((opt) => (
                <div key={opt.label} className={`option ${opt.isCorrect ? "correct" : ""}`}>
                  <span className="o-label">{opt.label}.</span>
                  <Text className="o-text">{opt.text}</Text>
                  {opt.isCorrect ? <span className="o-badge">Correct</span> : null}
                </div>
              ))}
              {options.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No options available.
                </Text>
              ) : null}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="explanation" className="tab-panel">
            <div className="explanation">
              <div className="label">Explanation</div>
              <Text>{explanation || "No explanation provided."}</Text>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Card>
  )
}
