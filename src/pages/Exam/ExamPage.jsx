import React, { useEffect, useState } from "react";
import ExamInterface from "../../components/Exam/ExamInterface";
import { examData } from "../../constants";
import "katex/dist/katex.min.css";
import { toast } from "sonner";
import apiClient from "../../utils/api";
import LoadingPage from "../../components/Loading/LoadingPage";

const ExamPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/questions");
      console.log(res)
      setQuestions(res.data.data); // axios: use res.data
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch questions. Please try again.");
    } finally {
      setIsLoading(false); // always flip loading off
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  console.log(questions);

  return (
    <div
      className="invisible-scrollbar"
      style={{ maxHeight: "100%", overflowY: "scroll" }}
    >
      <ExamInterface examData={questions} questions={questions} />
    </div>
  );
};

export default ExamPage;
