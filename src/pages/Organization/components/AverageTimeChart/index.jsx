import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Title, Text } from '@mantine/core';
import "./average-time-chart.scss";

const timeData = [
  { test: "Math Test 1", time: 45 },
  { test: "Science Quiz", time: 32 },
  { test: "History Exam", time: 58 },
  { test: "English Test", time: 41 },
  { test: "Physics Lab", time: 67 },
  { test: "Chemistry Test", time: 39 },
];

const AverageTimeChart = () => {
  return (
    <Paper className="time-chart-container" shadow="sm" p="md">
      <div className="chart-header">
        <Title order={3}>Average Time Taken for Each Test</Title>
        <Text size="sm" color="dimmed">Time in minutes</Text>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="test" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#51cf66"
              strokeWidth={3}
              dot={{ fill: "#51cf66", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default AverageTimeChart;