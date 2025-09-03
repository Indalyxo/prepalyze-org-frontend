import { useParams } from "react-router-dom";
import apiClient from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { Alert, LoadingOverlay } from "@mantine/core";
import { Button, Divider, Title, Text, Group, Stack } from "@mantine/core";
import { Drawer, Radio } from "@mantine/core";
import { Table, ActionIcon } from "@mantine/core";
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./print-questions.module.scss";
import { renderWithLatexAndImages } from "../../../utils/render/render";
import useAuthStore from "../../../context/auth-store";

function findCorrectLetter(q) {
  if (!q.correctOption) return undefined;
  const correct = normalizeForCompare(q.correctOption);
  const idx = q.options.findIndex(
    (o) => normalizeForCompare(o.text) === correct
  );
  return idx >= 0 ? getOptionLetter(idx) : undefined;
}

function normalizeForCompare(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/\\$$|\\$$|\$\$/g, "")
    .trim();
}

function getOptionLetter(index) {
  return String.fromCharCode("A".charCodeAt(0) + index);
}

const PrintQuestions = () => {
  const { examId } = useParams();
  const [template, setTemplate] = useState("worksheet");
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const { user } = useAuthStore();

  const fetchExamsQuestions = async (page) => {
    try {
      const response = await apiClient.get(`/api/exam/${examId}/questions`, {
        params: {
          gradeSchema: true,
        },
      });

      console.log(response);
      return response.data.examData;
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch exams. Please try again.");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_EXAMS_QUESTIONS"],
    queryFn: fetchExamsQuestions,
  });

  const getGlobalQuestionNumber = (dataRef, sIdx, qIdx) => {
    if (!dataRef?.sections) return qIdx + 1;
    const prior = dataRef.sections
      .slice(0, sIdx)
      .reduce((acc, s) => acc + (s.questions?.length || 0), 0);
    return prior + qIdx + 1;
  };

  const getMarks = (q) => {
    // Try common fields; fallback to "-"
    return q?.marks ?? q?.points ?? q?.score ?? "-";
  };

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error.message || "An error occurred"}
      </Alert>
    );
  }

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

  const hasMultiple = (data?.sections?.length || 0) > 1;

  return (
    <div className={styles.container}>
      <div className={`${styles.printControls} no-print`}>
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ActionIcon
              variant="light"
              color="blue"
              aria-label="Open template sidebar"
              onClick={() => setSidebarOpened(true)}
              title="Template Selector"
            >
              <IconLayoutSidebarLeftExpand size={18} />
            </ActionIcon>
            <Title order={2}>Exam Question Paper</Title>
          </Group>
          <Button variant="filled" color="blue" onClick={() => window.print()}>
            🖨️ Print Worksheet
          </Button>
        </Group>
      </div>

      {/* Sidebar with only template selection */}
      <Drawer
        opened={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
        position="left"
        size={280}
        withOverlay
        className="no-print"
        title="Template"
      >
        <Radio.Group
          value={template}
          onChange={setTemplate}
          className={styles.sidebarRadioGroup}
        >
          <Stack gap="xs">
            <Radio value="worksheet" label="Worksheet Template" />
            <Radio value="questions" label="Questions Template" />
            <Radio value="answer-key" label="Answer Key Template" />
          </Stack>
        </Radio.Group>
      </Drawer>

      {/* Worksheet Header */}
      <div className={styles.worksheetHeader}>
        <div className={styles.headerTop}>
          <div className={styles.logoSection}>
            <div className={styles.logoPlaceholder}>
              <img
                src={user.organization?.logoUrl}
                alt="logo"
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          </div>
          <div className={styles.institutionInfo}>
            <Title order={1} className={styles.institutionName}>
              {user.organization?.name}
            </Title>
            <Text className={styles.examTitle}>
              {data?.examTitle || "Practice Worksheet"}
            </Text>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text c={"dark"} className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}> Exam: </span>
                {data?.examCategory}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text c={"dark"} className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}>Time Allowed: </span>{" "}
                {data?.duration}
              </Text>
              <Text c={"dark"} className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}> Maximum Marks: </span>{" "}
                {data?.totalMarks}
              </Text>
            </div>
          </div>
        </div>

        {false && (
          <div className={styles.examDetails}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Name:</Text>
                <div className={styles.fillLine}></div>
              </div>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Roll No.:</Text>
                <div className={styles.fillLine}></div>
              </div>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Date:</Text>
                <div className={styles.fillLine}></div>
              </div>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Time:</Text>
                <div className={styles.fillLine}></div>
              </div>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Subject:</Text>
                <div className={styles.fillLine}></div>
              </div>
              <div className={styles.detailItem}>
                <Text className={styles.detailLabel}>Max. Marks:</Text>
                <div className={styles.fillLine}></div>
              </div>
            </div>
          </div>
        )}

        {/* <div className={styles.instructions}>
          <Title order={4} className={styles.instructionsTitle}>
            Instructions:
          </Title>
          <ul className={styles.instructionsList}>
            <li>Read all questions carefully before starting.</li>
            <li>Choose the most appropriate answer for each question.</li>
            <li>Mark your answers clearly in the answer sheet.</li>
            <li>Use blue or black pen only.</li>
            <li>No correction fluid/tape allowed.</li>
          </ul>
        </div> */}
      </div>

      {/* Questions Content */}
      <div className={styles.questionsContent}>
        {template === "worksheet" && (
          <div className={styles.worksheetTemplate}>
            {data?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.section}>
                {hasMultiple && (
                  <>
                    <Title order={3} className={styles.sectionTitle}>
                      {"Section "}
                      {String.fromCharCode(65 + sIdx)}
                      {": "}
                      {section.name}
                    </Title>
                    <Divider className={styles.sectionDivider} />
                  </>
                )}

                <Table
                  withTableBorder
                  withColumnBorders
                  striped
                  highlightOnHover
                  className={styles.worksheetTable}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: 64 }}>#</Table.Th>
                      <Table.Th>Question & Options</Table.Th>
                      <Table.Th style={{ width: 140 }}>Total Marks</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {section.questions.map((q, qIdx) => {
                      const number = getGlobalQuestionNumber(data, sIdx, qIdx);
                      return (
                        <Table.Tr key={q.id}>
                          <Table.Td>{number}</Table.Td>
                          <Table.Td>
                            <div className={styles.questionCell}>
                              <div className={styles.questionContent}>
                                {renderWithLatexAndImages(q.text)}
                              </div>
                              <ol className={styles.optionList} type="A">
                                {q.options.map((opt, oIdx) => (
                                  <li
                                    style={{ listStyleType: "none" }}
                                    key={opt._id}
                                    className={styles.optionItem}
                                  >
                                    <div className={styles.optionContent}>
                                      <span className={styles.optionLetter}>
                                        {getOptionLetter(oIdx)}.
                                      </span>
                                      <span className={styles.optionText}>
                                        {renderWithLatexAndImages(opt.text)}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </Table.Td>
                          <Table.Td className={styles.marksCell}>
                            [{data.gradeSchema.correctAnswer}]
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>

                {hasMultiple && sIdx < data.sections.length - 1 && (
                  <div className={styles.pageBreak} />
                )}
              </div>
            ))}
          </div>
        )}
        {template === "questions" && (
          <div className={styles.questionsTemplate}>
            {data?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.section}>
                {hasMultiple && (
                  <>
                    <Title order={3} className={styles.sectionTitle}>
                      {"Section "}
                      {String.fromCharCode(65 + sIdx)}
                      {": "}
                      {section.name}
                    </Title>
                    <Divider className={styles.sectionDivider} />
                  </>
                )}

                {/* Two-column layout with vertical separator */}
                <div className={styles.twoColumnLayout}>
                  <div className={styles.leftColumn}>
                    {section.questions
                      .map((q, qIdx) => ({ question: q, originalIdx: qIdx }))
                      .filter((_, index) => index % 2 === 0) // Take 1st, 3rd, 5th... questions
                      .map(({ question: q, originalIdx }) => {
                        const number = getGlobalQuestionNumber(
                          data,
                          sIdx,
                          originalIdx
                        );
                        return (
                          <div key={q.id} className={styles.questionBlock}>
                            <div className={styles.questionHeader}>
                              <Text fw={600} className={styles.questionNumber}>
                                {number}.
                              </Text>
                              <div className={styles.questionContent}>
                                {renderWithLatexAndImages(q.text)}
                              </div>
                            </div>
                            <div className={styles.optionsContainer}>
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={opt._id}
                                  className={styles.optionItem}
                                >
                                  <span className={styles.optionLetter}>
                                    {getOptionLetter(oIdx)})
                                  </span>
                                  <span className={styles.optionText}>
                                    {renderWithLatexAndImages(opt.text)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className={styles.columnSeparator}></div>

                  <div className={styles.rightColumn}>
                    {section.questions
                      .map((q, qIdx) => ({ question: q, originalIdx: qIdx }))
                      .filter((_, index) => index % 2 === 1) // Take 2nd, 4th, 6th... questions
                      .map(({ question: q, originalIdx }) => {
                        const number = getGlobalQuestionNumber(
                          data,
                          sIdx,
                          originalIdx
                        );
                        return (
                          <div key={q.id} className={styles.questionBlock}>
                            <div className={styles.questionHeader}>
                              <Text fw={600} className={styles.questionNumber}>
                                {number}.
                              </Text>
                              <div className={styles.questionContent}>
                                {renderWithLatexAndImages(q.text)}
                              </div>
                            </div>
                            <div className={styles.optionsContainer}>
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={opt._id}
                                  className={styles.optionItem}
                                >
                                  <span className={styles.optionLetter}>
                                    {getOptionLetter(oIdx)})
                                  </span>
                                  <span className={styles.optionText}>
                                    {renderWithLatexAndImages(opt.text)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {hasMultiple && sIdx < data.sections.length - 1 && (
                  <div className={styles.pageBreak} />
                )}
              </div>
            ))}
          </div>
        )}
        {template === "answer-key" && (
          <div className={styles.answerKeyTemplate}>
            <Title order={3} className={styles.answerKeyTitle}>
              Answer Key
            </Title>
            {data?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.answerKeySection}>
                {hasMultiple && (
                  <Title order={4} className={styles.answerKeySectionTitle}>
                    {"Section "}
                    {String.fromCharCode(65 + sIdx)}
                    {": "}
                    {section.name}
                  </Title>
                )}
                <div className={styles.answerKeyList}>
                  {section.questions.map((q, qIdx) => {
                    const number = getGlobalQuestionNumber(data, sIdx, qIdx);
                    const letter = findCorrectLetter(q);
                    const explanation =
                      q?.explanation ?? q?.solution ?? q?.reason ?? null;
                    return (
                      <div key={q.id} className={styles.answerKeyRow}>
                        <div className={styles.answerKeyNumber}>{number}.</div>
                        <div className={styles.answerKeyAnswer}>
                          {letter || "-"}
                        </div>
                        <div className={styles.answerKeyExplanation}>
                          {explanation ? (
                            renderWithLatexAndImages(explanation)
                          ) : (
                            <Text c="dimmed">No explanation</Text>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* {hasMultiple && sIdx < data.sections.length - 1 && (
                  <div className={styles.pageBreak} />
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintQuestions;
