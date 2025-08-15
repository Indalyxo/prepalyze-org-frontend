import { useParams } from "react-router-dom";
import { Text, Stack, Card } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import './StudentDetails.scss';

export default function StudentDetails() {
  const { id } = useParams();

  // Sample student data — this could come from API
  const studentData = {
    1: {
      marks: [
        { name: "Math Test 1", avg: 78 },
        { name: "Science Quiz", avg: 85 },
        { name: "History Exam", avg: 72 },
        { name: "English Test", avg: 90 },
        { name: "Physics Lab", avg: 88 },
        { name: "Chemistry Test", avg: 76 }
      ],
      time: [
        { name: "Math Test 1", time: 45 },
        { name: "Science Quiz", time: 32 },
        { name: "History Exam", time: 60 },
        { name: "English Test", time: 42 },
        { name: "Physics Lab", time: 68 },
        { name: "Chemistry Test", time: 40 }
      ]
    },
    2: {
      marks: [
        { name: "Math Test 1", avg: 65 },
        { name: "Science Quiz", avg: 70 },
        { name: "History Exam", avg: 60 },
        { name: "English Test", avg: 85 },
        { name: "Physics Lab", avg: 80 },
        { name: "Chemistry Test", avg: 72 }
      ],
      time: [
        { name: "Math Test 1", time: 50 },
        { name: "Science Quiz", time: 35 },
        { name: "History Exam", time: 55 },
        { name: "English Test", time: 45 },
        { name: "Physics Lab", time: 65 },
        { name: "Chemistry Test", time: 42 }
      ]
    }
  };

  const data = studentData[id] || { marks: [], time: [] };

  return (
    <div style={{ padding: 20 }}>
      <Text size="xl" fw={700}>
        Student ID: {id}
      </Text>
      <Text c="dimmed" mb="lg">
        Performance overview
      </Text>

      <Stack gap="xl">
        {/* Average Marks Chart */}
        <Card withBorder radius="lg" p="md">
          <Text fw={600} mb={5}>Average Marks in Each Test</Text>
          <Text size="sm" c="dimmed" mb="md">Class performance overview</Text>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.marks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Average Time Taken Chart */}
        <Card withBorder radius="lg" p="md">
          <Text fw={600} mb={5}>Average Time Taken for Each Test</Text>
          <Text size="sm" c="dimmed" mb="md">Time in minutes</Text>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 80]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Stack>
    </div>
  );
}
