import { Badge, Card, Stack, Text } from "@mantine/core";

const StatusLegend = ({ statusCounts }) => (
  <Card className="status-legend" withBorder radius="lg" p="md">
    <Text fw={600} size="md" mb="md" className="legend-title">
      Question Status Overview
    </Text>

    <Stack gap="sm">
      <div className="status-item">
        <div className="status-indicator answered"></div>
        <Text size="sm" className="status-label">
          Answered
        </Text>
        <Badge size="sm" variant="filled" color="green">
          {statusCounts.answered}
        </Badge>
      </div>

      <div className="status-item">
        <div className="status-indicator not-answered"></div>
        <Text size="sm" className="status-label">
          Not Answered
        </Text>
        <Badge size="sm" variant="filled" color="red">
          {statusCounts.notAnswered}
        </Badge>
      </div>

      <div className="status-item">
        <div className="status-indicator not-visited"></div>
        <Text size="sm" className="status-label">
          Not Visited
        </Text>
        <Badge size="sm" variant="filled" color="gray">
          {statusCounts.notVisited}
        </Badge>
      </div>

      <div className="status-item">
        <div className="status-indicator marked"></div>
        <Text size="sm" className="status-label">
          Marked for Review
        </Text>
        <Badge size="sm" variant="filled" color="orange">
          {statusCounts.marked}
        </Badge>
      </div>

      <div className="status-item">
        <div className="status-indicator answered-marked"></div>
        <Text size="sm" className="status-label">
          Answered & Marked
        </Text>
        <Badge size="sm" variant="filled" color="blue">
          {statusCounts.answeredMarked}
        </Badge>
      </div>
    </Stack>
  </Card>
);

export default StatusLegend;