import { useParams, useNavigate } from "react-router-dom"
import { Title, Text, Button } from "@mantine/core"
import { PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Pie } from "recharts"
import { IconArrowLeft } from "@tabler/icons-react"
import "./generic.scss"

const UserDetailsPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()

  // Mock user data - in real app, this would come from API
  const userData = {
    1: {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      score: 92,
      correctAnswers: 23,
      wrongAnswers: 2,
      attended: 25,
      notAttended: 0,
      timeSpent: "1h 45m",
      averageTimePerQuestion: "4.2 min",
      examDate: "March 15, 2024",
    },
    2: {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      score: 76,
      correctAnswers: 19,
      wrongAnswers: 4,
      attended: 23,
      notAttended: 2,
      timeSpent: "1h 52m",
      averageTimePerQuestion: "4.9 min",
      examDate: "March 15, 2024",
    },
    3: {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@email.com",
      score: 88,
      correctAnswers: 22,
      wrongAnswers: 3,
      attended: 25,
      notAttended: 0,
      timeSpent: "1h 38m",
      averageTimePerQuestion: "3.9 min",
      examDate: "March 15, 2024",
    },
    4: {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      score: 64,
      correctAnswers: 16,
      wrongAnswers: 7,
      attended: 23,
      notAttended: 2,
      timeSpent: "1h 55m",
      averageTimePerQuestion: "5.0 min",
      examDate: "March 15, 2024",
    },
    5: {
      id: 5,
      name: "Emma Brown",
      email: "emma.brown@email.com",
      score: 95,
      correctAnswers: 24,
      wrongAnswers: 1,
      attended: 25,
      notAttended: 0,
      timeSpent: "1h 42m",
      averageTimePerQuestion: "4.1 min",
      examDate: "March 15, 2024",
    },
  }

  const user = userData[userId]

  if (!user) {
    return <div>User not found</div>
  }

  // Data for pie chart (correct vs wrong answers)
  const answerData = [
    { name: "Correct", value: user.correctAnswers, color: "#27ae60" },
    { name: "Wrong", value: user.wrongAnswers, color: "#e74c3c" },
  ]

  // Data for attendance chart
  const attendanceData = [
    { name: "Attended", value: user.attended, color: "#3498db" },
    { name: "Not Attended", value: user.notAttended, color: "#95a5a6" },
  ]

  // Data for performance comparison
  const performanceData = [
    { category: "Correct", count: user.correctAnswers },
    { category: "Wrong", count: user.wrongAnswers },
    { category: "Skipped", count: user.notAttended },
  ]

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="user-details-container">
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="light"
        className="back-button"
        onClick={() => navigate("/")}
      >
        Back to Exam Details
      </Button>

      <div className="user-header">
        <div className="user-avatar">{getInitials(user.name)}</div>
        <Title order={1} className="user-name">
          {user.name}
        </Title>
        <Text className="user-email">{user.email}</Text>
        <div className="overall-score">{user.score}% Overall Score</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Title order={3} className="stat-title">
            Answer Distribution
          </Title>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={answerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {answerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <Title order={3} className="stat-title">
            Question Attendance
          </Title>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <Title order={3} className="stat-title">
            Performance Overview
          </Title>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="detailed-stats">
        <Title order={3} className="stats-title">
          Detailed Statistics
        </Title>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{user.score}%</div>
            <div className="stat-label">Final Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.correctAnswers}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.wrongAnswers}</div>
            <div className="stat-label">Wrong Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.timeSpent}</div>
            <div className="stat-label">Time Spent</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.averageTimePerQuestion}</div>
            <div className="stat-label">Avg Time/Question</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{((user.correctAnswers / user.attended) * 100).toFixed(1)}%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsPage
