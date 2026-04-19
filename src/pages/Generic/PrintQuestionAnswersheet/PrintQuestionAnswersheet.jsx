import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Paper,
  Text,
  Group,
  Stack,
  Button,
  Divider,
  Box,
  Badge,
  Center,
  Loader,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import apiClient from "../../../utils/api";
import { toast } from "sonner";
import { renderWithLatexAndImages } from "../../../utils/render/render";
import "./PrintQuestionAnswersheet.scss";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";

function OptionRow({ label, content, isCorrect }) {
  return (
    <Group
      className={`qp-option ${isCorrect ? "qp-option--correct" : ""}`}
      align="flex-start"
      gap="sm"
    >
      <Box className="qp-option-circle">
        <Text className="qp-option-label" size="sm" fw={600}>
          {label}
        </Text>
      </Box>
      <Text className="qp-option-content" size="sm">
        {renderWithLatexAndImages(content)}
      </Text>
    </Group>
  );
}

function QuestionCard({ q, index, exportRef }) {
  const letters = ["A", "B", "C", "D"];
  const options = (q?.options || []).map((opt, i) => ({
    label: letters[i] || String.fromCharCode(65 + i),
    text: opt?.text ?? "",
  }));

  // normalize correctOption (remove a)/b)/c)/d) etc.)
  const normalizeCorrect = (correct) =>
    (correct ?? "").replace(/^[a-dA-D]\)\s*/, "").trim();

  const correctText = normalizeCorrect(q?.correctOption ?? "");
  const correctIndex = options.findIndex((o) => o.text.trim() === correctText);

  return (
    <Paper
      className="qp-question-card qp-question-card--compact"
      ref={(el) => (exportRef.current[index] = el)}
      shadow="none"
      withBorder
      p="md"
      mb="sm"
    >
      {/* Question Header */}
      <Group justify="space-between" mb="xs" className="qp-question-header">
        <Badge variant="outline" size="sm" className="qp-question-number">
          {index + 1}.
        </Badge>
        {q?.type && (
          <Badge variant="light" size="xs" className="qp-question-type">
            {q.type}
          </Badge>
        )}
      </Group>

      {/* Question Text */}
      <Box className="qp-question-text" mb="sm">
        <Text size="sm" fw={500} className="qp-question-content">
          {renderWithLatexAndImages(q?.text)}
        </Text>
      </Box>

      {q.type === "Numerical type" ? (
        <></>
      ) : (
        <Stack
          gap="xs"
          className="qp-options-container qp-options-container--compact"
        >
          {options.map((o, i) => (
            <OptionRow
              key={i}
              label={o.label}
              content={o.text}
              isCorrect={i === correctIndex}
            />
          ))}
        </Stack>
      )}

      {/* Answer Section */}
      {correctText && (
        <>
          <Text size="xs" fw={600} c="green.7">
            Answer:
          </Text>
          {
            q.type === "Numerical type" ? (
              <Text size="sm" fw={500} className="qp-question-content">
                {q.correctOption}
              </Text>
            ) : (
              <Text size="sm" fw={500} className="qp-question-content">
                {renderWithLatexAndImages(q.correctOption)}
              </Text>
            )
          }
        </>
      )}
    </Paper>
  );
}

export default function PrintQuestionAnswersheet() {
  const { examId } = useParams();
  const exportRef = useRef([]);
  const [isPDFLoading, setIsPDFLoading] = useState(false);

  const fetchExamsQuestions = async () => {
    try {
      const response = await apiClient.get(`/api/exam/${examId}/questions`);
      return response.data.examData;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exam questions.");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_EXAMS_QUESTIONS", examId],
    queryFn: fetchExamsQuestions,
  });

  const addWatermark = (pdf) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const watermarkText = "PREPALYZE COPYRIGHT PROTECTED";
    
    pdf.saveGraphicsState();
    
    // Use GState for transparency if available, fallback to light color
    const GState = pdf.GState || (jsPDF && jsPDF.GState);
    if (GState) {
      pdf.setGState(new GState({ opacity: 0.25 }));
    } else {
      pdf.setTextColor(220, 220, 220);
    }
    
    pdf.setFontSize(40);
    pdf.setFont("helvetica", "bold");
    
    const x = pageWidth / 2;
    const y = pageHeight / 2;
    const angle = 45;

    // Multi-position watermark for better protection
    pdf.text(watermarkText, x, y, { align: "center", angle: angle });
    pdf.text(watermarkText, x - 150, y - 250, { align: "center", angle: angle });
    pdf.text(watermarkText, x + 150, y + 250, { align: "center", angle: angle });
    
    pdf.restoreGraphicsState();
  };

  const generatePDF = async () => {
    setIsPDFLoading(true);
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const maxContentHeight = pageHeight - margin * 2;
    let yOffset = margin;

    // Add title page
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text(data?.examTitle || "Exam", pageWidth / 2, pageHeight / 2 - 40, {
      align: "center",
    });
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Date: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight / 2,
      { align: "center" }
    );
    
    pdf.setFontSize(10);
    pdf.text("© Prepalyze. All rights reserved.", pageWidth / 2, pageHeight - 50, {
      align: "center",
    });

    addWatermark(pdf);
    pdf.addPage();
    yOffset = margin;

    for (let i = 0; i < exportRef.current.length; i++) {
      const el = exportRef.current[i];
      if (!el) continue;

      // Small delay for rendering stability
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dataUrl = await htmlToImage.toPng(el, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      const imgProps = pdf.getImageProperties(dataUrl);

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Check if question fits on current page, if not add new page
      if (yOffset + imgHeight > maxContentHeight) {
        pdf.addPage();
        addWatermark(pdf);
        yOffset = margin;
      }

      pdf.addImage(dataUrl, "PNG", margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 20; // Improved spacing
    }

    pdf.save("exam-questions.pdf");
    setIsPDFLoading(false);
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text size="lg">Loading questions...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="50vh">
        <Text size="lg" c="red">
          Error loading questions.
        </Text>
      </Center>
    );
  }

  const questions = data?.sections?.[0]?.questions || [];

  return (
    <Box className="qp-root">
      {/* Header Section */}
      <Paper className="qp-header-paper" shadow="sm" withBorder p="xl" mb="xl">
        <Stack align="center" gap="sm">
          <Text size="xl" fw={700} className="qp-exam-title">
            {data?.examTitle || "Examination Paper"}
          </Text>
          {data?.subTitle && (
            <Text size="md" c="dimmed" className="qp-exam-subtitle">
              {data.subTitle}
            </Text>
          )}
          <Divider w="100%" my="sm" />
          <Group gap="xl">
            <Text size="sm" fw={500}>
              Date: {new Date().toLocaleDateString()}
            </Text>
            <Text size="sm" fw={500}>
              Total Questions: {questions.length}
            </Text>
          </Group>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={generatePDF}
            variant="outline"
            size="sm"
            className="qp-export-btn"
            loading={isPDFLoading}
          >
            Export as PDF
          </Button>
        </Stack>
      </Paper>

      {/* Questions */}
      <Stack gap="lg">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q?.id || idx}
            q={q}
            index={idx}
            exportRef={exportRef}
          />
        ))}
      </Stack>
    </Box>
  );
}
