import React from "react";
import ExamInterface from "../../components/Exam/ExamInterface";
import { examData } from "../../constants";

const ExamPage = () => {
  return (
    <div className="invisible-scrollbar" style={{ maxHeight: "100%", overflowY: "scroll" }}>
      <ExamInterface examData={examData} />
    </div>
  );
};

export default ExamPage;
