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

  // Query for exam data
  const {
    data: examData,
    isLoading: isExamLoading,
    isError: isExamError,
  } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => fetchExamData(examId),
    staleTime: 5 * 60 * 1000, // don’t refetch for 5 min
    cacheTime: 25 * 60 * 1000, // keep in cache 30 min after unused
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError: () => toast.error("Failed to fetch exam data"),
  });

  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useQuery({
    queryKey: ["attendance", examId],
    queryFn: () => fetchAttendance(examId),
    staleTime: 2 * 60 * 1000, // shorter cache for attendance
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError: () => toast.error("Failed to fetch attendance"),
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

  // Correctly handle navigation before rendering the ExamInterface
  if (attendance && attendance.submittedAt !== null) {
    return <Navigate to={`/student/exams/details/${examId}`} />;
  }

  if (examData && examData.examMode === "Offline") {
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
