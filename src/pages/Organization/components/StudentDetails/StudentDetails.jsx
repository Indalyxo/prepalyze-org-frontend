import { useParams } from "react-router-dom";
import { Text, Stack, Card, Center, Loader } from "@mantine/core";
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
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./StudentDetails.scss";
import apiClient from "../../../../utils/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StudentDetails() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/intellihub/progress/${id}`);
        setData(response.data?.data || []);
        setName(response.data?.user || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <Center h={250}>
        <Loader size="lg" />
      </Center>
    );
  }


  return (
    <div style={{ padding: 20 }}>
      <Text size="xl" fw={700}>
        Student ID: {name}
      </Text>
      <Text c="dimmed" mb="lg">
        Performance overview
      </Text>

      <Stack gap="xl">
        {/* Average Marks Chart */}
        <Card withBorder radius="lg" p="md">
          <Text fw={600} mb={5}>
            Average Marks in Each Test
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Class performance overview
          </Text>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#4A90E2">
                <LabelList
                  dataKey="score"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Average Time Taken Chart */}
        {/* <Card withBorder radius="lg" p="md">
          <Text fw={600} mb={5}>
            Average Time Taken for Each Test
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Time in minutes
          </Text>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 80]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#00C49F"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card> */}
      </Stack>
    </div>
  );
}
