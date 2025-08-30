import React, { useEffect, useState } from "react";
import ExamInterface from "../../components/Exam/ExamInterface";
import { examData } from "../../constants";
import "katex/dist/katex.min.css";
import { toast } from "sonner";
import apiClient from "../../utils/api";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useParams } from "react-router-dom";

const ExamPage = () => {
  const [examData, setExamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { examId } = useParams();

  const fetchExamData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/api/exam/${examId}`);
      console.log(res);
      setExamData(res.data.examData); // axios: use res.data
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exam data. Please try again.");
    } finally {
      setIsLoading(false); // always flip loading off
    }
  };

  useEffect(() => {
    fetchExamData();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  console.log(examData);

  return (
    <div
      className="invisible-scrollbar"
      style={{ maxHeight: "100%", overflowY: "scroll" }}
    >
      <ExamInterface examData={examData} />
    </div>
  );
};

export default ExamPage;
