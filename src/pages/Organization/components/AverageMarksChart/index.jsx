import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Paper, Title, Text, Center, Loader } from "@mantine/core";
import "./average-marks-chart.scss";
import apiClient from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";

const AverageMarksChart = () => {
  const fetchExamMarks = async () => {
    try {
      const response = await apiClient.get("/api/intellihub/averages");
      return response.data.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch leaderboard. Please try again.");
      throw error; // Re-throw to let React Query handle the error
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_AVERAGE_EXAM_SCORE"],
    queryFn: fetchExamMarks,
  });
  if (isLoading) {
    return (
      <Center h={250}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (data.length === 0) {
    return (
      <Center h={250}>
        <Text c="dimmed">No progress data available yet 📊</Text>
      </Center>
    );
  }
  return (
    <Paper className="chart-container" shadow="sm" p="md">
      <div className="chart-header">
        <Title order={3}>Average Marks in Each Test</Title>
        <Text size="sm" color="dimmed">
          Class performance overview
        </Text>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="examName"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v?.toFixed(2)}`} />

            <Bar
              dataKey="averagePercentage"
              fill="#339af0"
              radius={[4, 4, 0, 0]}
            >
              <LabelList dataKey="averagePercentage" position="top" formatter={(v) => `${v?.toFixed(2)} % `} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default AverageMarksChart;
