import { Card, Stack, Text, Loader, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import apiClient from "../../../../utils/api";
import useAuthStore from "../../../../context/auth-store";
import { toast } from "sonner";

const StudentProgressChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/intellihub/progress/${user.id}`);
        setData(response.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

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
    <div style={{ padding: 20 }}>
      <Stack gap="xl">
        <Card withBorder radius="lg" p="md" shadow="sm">
          <Text fw={600} mb={10} size="lg">
            Your Progress Over the Previous Exams
          </Text>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="score" fill="#4dabf7" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="score" position="top" formatter={(v) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Stack>
    </div>
  );
};

export default StudentProgressChart;
