import {
  Tabs,
  Card,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  Loader,
  Alert,
  Container,
  Divider,
  ThemeIcon,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconListDetails,
} from "@tabler/icons-react";
import { renderWithLatexAndImages } from "../../../utils/render/render";
import "./exam-questions.scss";
import apiClient from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import "katex/dist/katex.min.css";
import BackButton from "../../../components/Generics/BackButton";

function OptionRow({ label, content, isCorrect }) {
  return (
    <Group
      align="flex-start"
      gap="sm"
      className={`qv-option ${isCorrect ? "qv-option--correct" : ""}`}
    >
      <p fw={800} className="qv-option-label">
        {label}
      </p>
      <span className="qv-option-content">
        {renderWithLatexAndImages(content)}
      </span>
      {isCorrect ? (
        <Badge
          color="green"
          variant="light"
          leftSection={<IconCircleCheck size={14} />}
          className="qv-option-badge"
        >
          Correct
        </Badge>
      ) : null}
    </Group>
  );
}

function QuestionCard({ q, index }) {
  const letters = ["A", "B", "C", "D"];
  const options = (q?.options || []).map((opt, i) => ({
    label: letters[i] || String.fromCharCode(65 + i),
    text: opt?.text ?? "",
  }));

  const correctText = q?.correctOption ?? "";
  const correctIndex = options.findIndex(
    (o) => o.text.trim() === correctText.trim()
  );

  const normalizeCorrect = (correct) => {
    // remove "a)", "b)", "c)" style prefixes
    return correct.replace(/^[a-d]\)\s*/, "").trim();
  };

  return (
    <Card withBorder radius="md" className="qv-card">
      <Stack gap="sm">
        <Group
          justify="space-between"
          wrap="nowrap"
          className="qv-question-meta"
        >
          <Group gap="xs" wrap="nowrap">
            <Badge color="blue" variant="light">
              {q?.type || "MCQ"}
            </Badge>
          </Group>
          {q?.id ? <Badge variant="outline">{q.id}</Badge> : null}
        </Group>

        <Group fap="sm" align="flex-start" className="qv-question-header">
          <Badge size="lg" className="qv-qnumber" variant="light">
            {index + 1}
          </Badge>
          <Title order={4} className="qv-question-title">
            {renderWithLatexAndImages(q?.text)}
          </Title>
        </Group>

        <Divider my="xs" />

        <div className="qv-options">
          {options.map((o, i) => (
            <OptionRow
              key={`${q?.id || index}-${i}`}
              label={o.label}
              content={o.text}
              isCorrect={
                i === correctIndex ||
                (correctIndex === -1 &&
                  normalizeCorrect(correctText) === o.text.trim())
              }
            />
          ))}
        </div>

        {correctText ? (
          <Alert
            color="green"
            variant="light"
            icon={<IconInfoCircle size={16} />}
            className="qv-answer"
            title="Answer"
          >
            <div className="qv-answer-content">
              {renderWithLatexAndImages(correctText)}
            </div>
          </Alert>
        ) : null}
      </Stack>
    </Card>
  );
}

export default function ExamQuestionsPage() {
  const { examId } = useParams();

  const fetchExamsQuestions = async (page) => {
    try {
      const response = await apiClient.get(`/api/exam/${examId}/questions`, {});

      return response.data.examData;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exams. Please try again.");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_EXAMS_QUESTIONS"],
    queryFn: fetchExamsQuestions,
  });
  if (error) {
    return (
      <Alert color="red" title="Error">
        {error}
      </Alert>
    );
  }

  const hasMultiple = (data?.sections?.length || 0) > 1;

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

  return (
    <Container size="xl" className="qv-root">
      <BackButton />
      <div className="qv-header">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} className="text-balance">
              {data?.examTitle}
            </Title>
            <Text c="dimmed" className="qv-subtitle">
              {data?.subTitle}
            </Text>
          </div>
          <Group gap="xs">
            <ThemeIcon variant="light" color="blue" radius="md">
              <IconListDetails size={18} />
            </ThemeIcon>
            <Badge variant="dot" color="blue">
              {data.sections.reduce(
                (sum, s) => sum + (s?.questions?.length || 0),
                0
              )}{" "}
              questions
            </Badge>
          </Group>
        </Group>
      </div>

      {hasMultiple ? (
        <Tabs
          defaultValue={data.sections?.[0]?.name}
          className="qv-tabs"
          keepMounted={false}
          variant="pills"
          color="blue"
        >
          <Tabs.List>
            {data.sections.map((s) => (
              <Tabs.Tab
                key={s.name}
                value={s.name}
                rightSection={
                  <Badge variant="light" size="sm" color="dark">
                    {s?.questions?.length || 0}
                  </Badge>
                }
              >
                {s.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {data.sections.map((s) => (
            <Tabs.Panel key={s.name} value={s.name} pt="md">
              <Stack gap="md">
                {(s?.questions || []).map((q, idx) => (
                  <QuestionCard key={q?.id || idx} q={q} index={idx} />
                ))}
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      ) : (
        <Stack gap="md">
          {(data.sections?.[0]?.questions || []).map((q, idx) => (
            <QuestionCard key={q?.id || idx} q={q} index={idx} />
          ))}
        </Stack>
      )}
    </Container>
  );
}
