import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Cell
} from "recharts";
import { Paper, Title, Text, Center, Loader, Group, ThemeIcon, Badge } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import "./average-marks-chart.scss";
import apiClient from "../../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Custom Tooltip for better UI
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper shadow="md" p="sm" radius="md" withBorder style={{ backgroundColor: 'white', zIndex: 1000 }}>
        <Text fw={600} size="sm" mb={4}>{label}</Text>
        <Group gap="xs">
          <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
            <IconChartBar size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            Average: <Text component="span" fw={700} c="blue">{payload[0].value.toFixed(2)}%</Text>
          </Text>
        </Group>
      </Paper>
    );
  }
  return null;
};

const AverageMarksChart = () => {
  const fetchExamMarks = async () => {
    try {
      const response = await apiClient.get("/api/intellihub/averages");
      return response.data.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exam marks. Please try again.");
      throw error; // Re-throw to let React Query handle the error
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["GET_AVERAGE_EXAM_SCORE"],
    queryFn: fetchExamMarks,
  });

  if (isLoading) {
    return (
      <Center h={350}>
        <Loader size="lg" variant="dots" color="blue" />
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center h={350}>
        <Text c="dimmed">No progress data available yet 📊</Text>
      </Center>
    );
  }

  // Calculate start index for Brush to show latest ~10-15 exams
  const startIndex = Math.max(0, data.length - 15);

  return (
    <Paper className="chart-container" shadow="sm" p="lg" radius="md" withBorder>
      <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', textAlign: 'left' }}>
        <div>
          <Title order={3}>Average Marks Overview</Title>
          <Text size="sm" c="dimmed" mt={2}>
            Class performance across assessments
          </Text>
        </div>
        <Badge variant="light" color="blue" size="lg" radius="sm">
          {data.length} Exams
        </Badge>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#339af0" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#339af0" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
            <XAxis
              dataKey="examName"
              tickLine={false}
              axisLine={{ stroke: '#dee2e6' }}
              tick={{ fill: '#868e96', fontSize: 12 }}
              dy={10}
              interval="preserveEnd"
              tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + "..." : val}
            />
            <YAxis 
              domain={[0, 100]} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#868e96', fontSize: 12 }}
              tickFormatter={(val) => `${val}%`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 154, 240, 0.05)' }} />

            <Bar
              dataKey="averagePercentage"
              fill="url(#colorScore)"
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationDuration={1500}
            >
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.averagePercentage === 0 ? '#e9ecef' : 'url(#colorScore)'} />
               ))}
            </Bar>
            
            {data.length > 5 && (
              <Brush 
                dataKey="examName" 
                height={30} 
                stroke="#339af0"
                fill="#f8f9fa"
                tickFormatter={() => ''}
                startIndex={startIndex}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default AverageMarksChart;
