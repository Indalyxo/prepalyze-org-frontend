import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Title, Text } from '@mantine/core';
import './average-marks-chart.scss';

const marksData = [
  { test: "Math Test 1", average: 78 },
  { test: "Science Quiz", average: 85 },
  { test: "History Exam", average: 72 },
  { test: "English Test", average: 88 },
  { test: "Physics Lab", average: 91 },
  { test: "Chemistry Test", average: 76 },
];

const AverageMarksChart = () => {
  return (
    <Paper className="chart-container" shadow="sm" p="md">
      <div className="chart-header">
        <Title order={3}>Average Marks in Each Test</Title>
        <Text size="sm" color="dimmed">Class performance overview</Text>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marksData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="test" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="average" fill="#339af0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default AverageMarksChart;