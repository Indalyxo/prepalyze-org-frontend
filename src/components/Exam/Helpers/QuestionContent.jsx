import { Card, Text, Radio, Stack, TextInput } from "@mantine/core";
import { useRef } from "react";
import WatermarkWrapper from "../../../utils/AntiCheat/WatermarkWrapper";
import { renderWithLatexAndImages } from "../../../utils/render/render";

const QuestionContent = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  questionNumber,
}) => {
  return (
    <WatermarkWrapper text={"Confidential - Do Not Distribute"}>
      <Card className="question-panel" withBorder radius="lg" p="xl">
        <div className="question-header">
          <Text className="question-number" size="lg" fw={700}>
            Question {questionNumber}
          </Text>
        </div>

        <Text className="question-text" size="lg" mb="xl">
          {renderWithLatexAndImages(questionData.text)}
        </Text>

        {questionData.type === "Numerical type" ? (
          <div className="numerical-input-container">
            <TextInput
              size="lg"
              placeholder={
                questionData.placeholder || "Enter your numerical answer"
              }
              value={currentAnswer || ""}
              onChange={(event) => onAnswerChange(event.currentTarget.value)}
              className="numerical-input"
              styles={{
                input: {
                  fontSize: "1.125rem",
                  padding: "1rem",
                  border: "2px solid var(--gray-200)",
                  borderRadius: "0.75rem",
                  transition: "all 0.2s ease",
                  "&:focus": {
                    borderColor: "var(--primary-500)",
                    boxShadow: "0 0 0 3px var(--primary-100)",
                  },
                },
              }}
            />
            <Text size="sm" c="dimmed" mt="sm">
              Enter a numerical value for your answer
            </Text>
          </div>
        ) : (
          <div className="options-container">
            <Radio.Group
              value={currentAnswer?.toString()}
              onChange={onAnswerChange}
              size="lg"
            >
              <Stack gap="md">
                {questionData.options?.map((option, index) => {
                  const radioRef = useRef(null);
                  
                  const handleCardClick = (e) => {
                    // Don't trigger if clicking the radio button itself
                    if (e.target.closest('[type="radio"]')) {
                      return;
                    }
                    // Trigger the radio button
                    if (radioRef.current) {
                      radioRef.current.click();
                    }
                  };

                  return (
                    <div
                      key={option._id}
                      className={`option-card ${
                        currentAnswer === option._id ? "selected" : ""
                      }`}
                      onClick={handleCardClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (radioRef.current) {
                            radioRef.current.click();
                          }
                        }
                      }}
                    >
                      <Radio
                        ref={radioRef}
                        value={option._id.toString()}
                        label={
                          <div className="option-content">
                            <div className="option-letter">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <Text className="option-text">
                              {renderWithLatexAndImages(
                                option.text,
                                questionData.type === "Assertion & Reason"
                              )}
                            </Text>
                          </div>
                        }
                        styles={{
                          label: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            cursor: "pointer",
                          },
                          radio: {
                            display: "block",
                            flexShrink: 0,
                            cursor: "pointer",
                          },
                        }}
                      />
                    </div>
                  );
                })}
              </Stack>
            </Radio.Group>
          </div>
        )}
      </Card>
    </WatermarkWrapper>
  );
};

export default QuestionContent;
