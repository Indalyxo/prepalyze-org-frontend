import React from "react";
import StudentProgressChart from "./StudentProgressChart/StudentProgressChart";
import IntellihubHeader from "../../Organization/components/IntellihubHeader";

import "./student-intellihub.scss";
import { Container } from "@mantine/core";

const StudentIntellihub = () => {
  return (
    <div
      className="dashboard invisible-scrollbar"
      style={{ backgroundColor: "#f7f9fc", overflow: "scroll" }}
    >
      <Container size="xl" py="xl" style={{ backgroundColor: "#f7f9fc" }}>
        <IntellihubHeader />
        <StudentProgressChart />
      </Container>
    </div>
  );
};

export default StudentIntellihub;
