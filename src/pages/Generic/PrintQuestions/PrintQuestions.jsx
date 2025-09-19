import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, LoadingOverlay } from "@mantine/core";
import { Button, Divider, Title, Text, Group, Stack } from "@mantine/core";
import { Drawer, Radio, Checkbox, ScrollArea, Accordion } from "@mantine/core";
import { Table, ActionIcon } from "@mantine/core";
import {
  IconLayoutSidebarLeftExpand,
  IconEye,
  IconEyeOff,
  IconHome,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import styles from "./print-questions.module.scss";
import { renderWithLatexAndImages } from "../../../utils/render/render";
import useAuthStore from "../../../context/auth-store";
import "katex/dist/katex.min.css";

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
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const { user } = useAuthStore();
  const [allowStudentInformation, setAllowStudentInformation] = useState(false);
  const navigate = useNavigate();
  const fetchExamsQuestions = async (page) => {
    try {
      const response = await apiClient.get(`/api/exam/${examId}/questions`, {
        params: {
          gradeSchema: true,
        },
      });

      return response.data.examData;
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch exams. Please try again.");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_EXAMS_QUESTIONS_FOR_PRINT", examId],
    queryFn: fetchExamsQuestions,
  });

  // Initialize selected questions when data loads
  const allQuestionIds = useMemo(() => {
    if (!data?.sections) return [];
    return data.sections.flatMap((section) =>
      section.questions.map((q) => q.id)
    );
  }, [data]);

  // Initialize all questions as selected when data first loads
  useState(() => {
    if (allQuestionIds.length > 0 && selectedQuestions.size === 0) {
      setSelectedQuestions(new Set(allQuestionIds));
    }
  }, [allQuestionIds]);

  // Filter data based on selected questions
  const filteredData = useMemo(() => {
    if (!data || selectedQuestions.size === 0) return data;

    return {
      ...data,
      sections: data.sections
        .map((section) => ({
          ...section,
          questions: section.questions.filter((q) =>
            selectedQuestions.has(q.id)
          ),
        }))
        .filter((section) => section.questions.length > 0),
    };
  }, [data, selectedQuestions]);

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

  const toggleQuestion = (questionId) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const toggleSection = (sectionQuestions) => {
    const sectionIds = sectionQuestions.map((q) => q.id);
    const allSelected = sectionIds.every((id) => selectedQuestions.has(id));
    const newSelected = new Set(selectedQuestions);

    if (allSelected) {
      // Deselect all in section
      sectionIds.forEach((id) => newSelected.delete(id));
    } else {
      // Select all in section
      sectionIds.forEach((id) => newSelected.add(id));
    }
    setSelectedQuestions(newSelected);
  };

  const selectAllQuestions = () => {
    setSelectedQuestions(new Set(allQuestionIds));
  };

  const deselectAllQuestions = () => {
    setSelectedQuestions(new Set());
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
            <ActionIcon
              variant="light"
              color="blue"
              aria-label="Open template sidebar"
              onClick={() => navigate(-1)}
              title="Template Selector"
            >
              <IconHome size={18} />
            </ActionIcon>
            <Title order={2}>Exam Question Paper</Title>
            <Text size="sm" c="dimmed">
              ({selectedQuestions.size}/{allQuestionIds.length} questions
              selected)
            </Text>
          </Group>
          <Button variant="filled" color="blue" onClick={() => window.print()}>
            🖨️ Print
          </Button>
        </Group>
      </div>

      {/* Enhanced Sidebar with template selection and question selection */}
      <Drawer
        opened={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
        position="left"
        size={400}
        withOverlay
        className="no-print"
        title="Print Configuration"
      >
        <ScrollArea style={{ height: "calc(100vh - 80px)" }}>
          <Stack gap="lg">
            {/* Template Selection */}
            <div>
              <Title order={4} mb="sm">
                Template
              </Title>
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
            </div>

            <Divider />

            <div>
              <Title order={4} mb="sm">
                Student Information
              </Title>
              <Checkbox
                label="Allow Student Information"
                checked={allowStudentInformation}
                onChange={(e) =>
                  setAllowStudentInformation(e.currentTarget.checked)
                }
              />
            </div>

            <Divider />
            {/* Question Selection */}
            <div>
              <Group justify="space-between" align="center" mb="sm">
                <Title order={4}>Question Selection</Title>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconEye size={14} />}
                    onClick={selectAllQuestions}
                  >
                    All
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconEyeOff size={14} />}
                    onClick={deselectAllQuestions}
                  >
                    None
                  </Button>
                </Group>
              </Group>

              {data?.sections?.map((section, sIdx) => {
                const sectionQuestions = section.questions;
                const selectedInSection = sectionQuestions.filter((q) =>
                  selectedQuestions.has(q.id)
                ).length;
                const allSelected =
                  selectedInSection === sectionQuestions.length;
                const partialSelected =
                  selectedInSection > 0 &&
                  selectedInSection < sectionQuestions.length;

                return (
                  <Accordion key={section.name} variant="contained" mb="sm">
                    <Accordion.Item value={section.name}>
                      <Accordion.Control>
                        <Group
                          justify="space-between"
                          style={{ width: "100%", marginRight: 20 }}
                        >
                          <Group gap="sm">
                            <Checkbox
                              checked={allSelected}
                              indeterminate={partialSelected}
                              onChange={() => toggleSection(sectionQuestions)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <Text fw={500}>
                                {hasMultiple
                                  ? `Section ${String.fromCharCode(
                                      65 + sIdx
                                    )}: `
                                  : ""}
                                {/* {section.name} */}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {selectedInSection}/{sectionQuestions.length}{" "}
                                selected
                              </Text>
                            </div>
                          </Group>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="xs">
                          {sectionQuestions.map((q, qIdx) => {
                            const globalNumber = getGlobalQuestionNumber(
                              data,
                              sIdx,
                              qIdx
                            );
                            const isSelected = selectedQuestions.has(q.id);

                            return (
                              <Group key={q.id} gap="sm" align="flex-start">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => toggleQuestion(q.id)}
                                  style={{ marginTop: 4 }}
                                />
                                <div style={{ flex: 1 }}>
                                  <Text size="sm" fw={500}>
                                    Q{globalNumber}
                                  </Text>
                                  <Text size="xs" lineClamp={2} c="dimmed">
                                    {q.text
                                      .replace(/<[^>]*>/g, "")
                                      .substring(0, 80)}
                                    ...
                                  </Text>
                                </div>
                              </Group>
                            );
                          })}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                );
              })}
            </div>
          </Stack>
        </ScrollArea>
      </Drawer>

      {/* Worksheet Header */}
      <Box className={styles.worksheetHeader}>
        <Group className={styles.headerTop} wrap="nowrap" justify="center">
          <div className={styles.logoSection}>
            <img
              src={user.organization?.logoUrl || user?.organization?.logo}
              alt="logo"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.institutionInfo}>
            <Title order={1} className={styles.institutionName}>
              {user.organization?.name}
            </Title>
            <Text className={styles.examTitle}>
              {data?.examTitle || "Practice Worksheet"}
            </Text>
            <Group justify="center" gap="sm" mt="xs">
              <Text c="dark" className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}>Exam:</span>{" "}
                {data?.examCategory}
              </Text>
            </Group>
            <Group justify="center" gap="md" mt="xs">
              <Text c="dark" className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}>Time Allowed:</span>{" "}
                {data?.duration}
              </Text>
              <Text c="dark" className={styles.examTitle}>
                <span style={{ fontWeight: 600 }}>Maximum Marks:</span>{" "}
                {data?.totalMarks}
              </Text>
            </Group>
          </div>
          {/* A placeholder for a potential right-side logo or additional info */}
          <div className={styles.logoSection} style={{ visibility: "hidden" }}>
            <img
              src={user.organization?.logoUrl || user?.organization?.logo}
              alt="logo"
              className={styles.logoImage}
            />
          </div>
        </Group>

        {allowStudentInformation && (
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
                <Text className={styles.detailLabel}>Overall Score:</Text>
                <div className={styles.fillLine}></div>
              </div>
            </div>
          </div>
        )}
      </Box>
      {/* Questions Content - Now uses filteredData */}
      <div className={styles.questionsContent}>
        {template === "worksheet" && (
          <div className={styles.worksheetTemplate}>
            {filteredData?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.section}>
                {hasMultiple && (
                  <>
                    <Title order={3} className={styles.sectionTitle}>
                      {"Section "}
                      {String.fromCharCode(65 + sIdx)}
                      {": "}
                      {/* {section.name} */}
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
                      const number = getGlobalQuestionNumber(
                        filteredData,
                        sIdx,
                        qIdx
                      );
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

                {hasMultiple && sIdx < filteredData.sections.length - 1 && (
                  <div className={styles.pageBreak} />
                )}
              </div>
            ))}
          </div>
        )}
        {template === "questions" && (
          <div className={styles.questionsTemplate}>
            {filteredData?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.section}>
                {hasMultiple && (
                  <>
                    <Title order={3} className={styles.sectionTitle}>
                      {"Section "}
                      {String.fromCharCode(65 + sIdx)}
                    </Title>
                    <Divider className={styles.sectionDivider} />
                  </>
                )}

                {/* Multi-column layout */}
                <div className={styles.multiColumnLayout}>
                  {section.questions.map((q, qIdx) => {
                    const number = getGlobalQuestionNumber(
                      filteredData,
                      sIdx,
                      qIdx
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
                            <div key={opt._id} className={styles.optionItem}>
                              <span className={styles.optionLetter}>
                                {getOptionLetter(oIdx)})
                              </span>
                              <span className={styles.optionText}>
                                {renderWithLatexAndImages(opt.text, {
                                  maxWidth: "120px",
                                  maxHeight: "120px",
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMultiple && sIdx < filteredData.sections.length - 1 && (
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
            {filteredData?.sections?.map((section, sIdx) => (
              <div key={section.name} className={styles.answerKeySection}>
                {hasMultiple && (
                  <Title order={4} className={styles.answerKeySectionTitle}>
                    {"Section "}
                    {String.fromCharCode(65 + sIdx)}
                    {/* {": "}
                    {section.name} */}
                  </Title>
                )}
                <div className={styles.answerKeyList}>
                  {section.questions.map((q, qIdx) => {
                    const number = getGlobalQuestionNumber(
                      filteredData,
                      sIdx,
                      qIdx
                    );
                    const letter = findCorrectLetter(q.correctOption);
                    const explanation =
                      q?.explanation ?? q?.solution ?? q?.reason ?? null;
                    return (
                      <div key={q.id} className={styles.answerKeyRow}>
                        <div className={styles.answerKeyNumber}>{number}.</div>
                        <div className={styles.answerKeyExplanation}>
                          <Text c={"blue"} fw={800}>
                            {renderWithLatexAndImages(q.correctOption)}
                          </Text>
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
                {/* {hasMultiple && sIdx < filteredData.sections.length - 1 && (
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
