import React, { useEffect } from "react";
import ExamInterface from "../../components/Exam/ExamInterface";
import "katex/dist/katex.min.css";
import { toast } from "sonner";
import apiClient from "../../utils/api";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@mantine/core";

const fetchExamData = async (examId) => {
  const res = await apiClient.get(`/api/exam/${examId}`);
  return res.data.examData; // return only examData
};

const fetchAttendance = async (examId) => {
  const res = await apiClient.get(`/api/exam/${examId}/attendance`);
  return res.data.result; // shape depends on backend response
};

const ExamPage = () => {
  const { examId } = useParams();

  const {
    data: examData,
    isLoading: isExamLoading,
    isError: isExamError,
  } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => fetchExamData(examId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to fetch exam data";
      toast.error(msg);
    },
  });

  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useQuery({
    queryKey: ["attendance", examId],
    queryFn: () => fetchAttendance(examId),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to fetch attendance";
      toast.error(msg);
    },
  });

  // Use useEffect to handle side effects like navigation and toasts
  useEffect(() => {
    if (attendance && attendance.submittedAt !== null) {
      toast.info("You have already submitted this exam.");
    }

    if (examData && examData.examMode === "Offline") {
      toast.info("This exam is in offline mode.");
    }
  }, [attendance]);

  if (isExamLoading || isAttendanceLoading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  if (isExamError || isAttendanceError) {
    return (
      <div className="text-red-500">Failed to load exam or attendance</div>
    );
  }

  // Guard: data must be ready before rendering
  if (!examData || !attendance) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  // Guard: exam must have at least one section with at least one question
  if (!examData.sections || examData.sections.length === 0 || examData.sections[0]?.questions?.length === 0) {
    return (
      <div style={{ padding: "2rem", color: "red", fontWeight: 600 }}>
        This exam has no questions configured yet. Please contact the organizer.
      </div>
    );
  }

  // Correctly handle navigation before rendering the ExamInterface
  if (attendance.submittedAt !== null) {
    return <Navigate to={`/student/exams/details/${examId}`} />;
  }

  if (examData.examMode === "Offline") {
    return <Navigate to={`/student/exams/details/${examId}`} />;
  }

  return (
    <div
      className="invisible-scrollbar"
      style={{ maxHeight: "100%", overflowY: "scroll" }}
    >
      {/* Pass both examData and attendance */}
      <ExamInterface examData={examData} attendance={attendance} />
    </div>
  );
};

export default ExamPage;
