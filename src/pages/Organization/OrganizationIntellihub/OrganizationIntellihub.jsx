import React from "react";
import { Container, Grid, Title, Text } from "@mantine/core";
import AverageMarksChart from "../components/AverageMarksChart";
import AverageTimeChart from "../components/AverageTimeChart";
import Leaderboard from "../components/Leaderboard";

import "./organization-intellihub.scss";
import IntellihubHeader from "../components/IntellihubHeader";

const OrganizationIntellihub = () => {
  return (
    <div className="dashboard invisible-scrollbar" style={{ backgroundColor: "#f7f9fc", overflow: "scroll" }}>
      <Container size="xl" py="xl" style={{ backgroundColor: "#f7f9fc" }}>
        <IntellihubHeader />

        <Grid gutter="lg">
          {/* First row: Leaderboard on left, Average Marks Chart on right */}
          <Grid.Col md={6}>
            <Leaderboard />
          </Grid.Col>
          <Grid.Col md={6}>
            <AverageMarksChart />
          </Grid.Col>

          {/* Second row: Average Time Chart in a new full-width block */}
          <Grid.Col span={12}>
            <AverageTimeChart />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default OrganizationIntellihub;
