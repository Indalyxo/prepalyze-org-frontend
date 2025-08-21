import { Card, Text, Badge } from "@mantine/core"

const StatusLegend = ({ statusCounts }) => {
  const statusItems = [
    { key: "answered", label: "Answered", color: "green", count: statusCounts.answered },
    { key: "not-answered", label: "Not Answered", color: "red", count: statusCounts.notAnswered },
    { key: "not-visited", label: "Not Visited", color: "gray", count: statusCounts.notVisited },
    { key: "marked", label: "Marked for Review", color: "yellow", count: statusCounts.marked },
    { key: "answered-marked", label: "Answered & Marked", color: "blue", count: statusCounts.answeredMarked },
  ]

  return (
    <Card className="status-legend" withBorder radius="lg" p="lg">
      <Text className="legend-title" fw={600} size="md" mb="md">
        Question Status
      </Text>

      {statusItems.map((item) => (
        <div key={item.key} className="status-item">
          <div className={`status-indicator ${item.key}`} />
          <Text className="status-label">{item.label}</Text>
          <Badge size="sm" variant="light" color={item.color}>
            {item.count}
          </Badge>
        </div>
      ))}
    </Card>
  )
}

export default StatusLegend
