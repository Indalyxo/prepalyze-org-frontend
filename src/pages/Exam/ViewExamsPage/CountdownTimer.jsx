import { useEffect, useState } from "react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { Paper, Text, Group, Stack, Box } from "@mantine/core"
import "./CountdownTimer.scss"

dayjs.extend(duration)

function CountdownTimer({
  startTime,
  endTime,
  title = "Time Remaining",
  size = "md",
  variant = "default",
  showTitle = true,
  showDescription = true,
}) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [status, setStatus] = useState("waiting")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs()
      const start = dayjs(startTime)
      const end = dayjs(endTime)

      if (now.isBefore(start)) {
        setStatus("waiting")
        setTimeLeft(dayjs.duration(start.diff(now)))
      } else if (now.isAfter(start) && now.isBefore(end)) {
        setStatus("running")
        setTimeLeft(dayjs.duration(end.diff(now)))
      } else {
        setStatus("finished")
        setTimeLeft(dayjs.duration(0))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  const getTimeUnits = (dur) => {
    if (!dur) return { hours: 0, minutes: 0, seconds: 0 }

    return {
      hours: Math.floor(dur.asHours()),
      minutes: dur.minutes(),
      seconds: dur.seconds(),
    }
  }

  const formatNumber = (num) => {
    return String(num).padStart(2, "0")
  }

  const timeUnits = getTimeUnits(timeLeft)

  const getSizeConfig = () => {
    switch (size) {
      case "sm":
        return {
          cardSize: 50,
          fontSize: "24px",
          padding: "sm",
          gap: "xs",
          titleSize: "sm",
        }
      case "lg":
        return {
          cardSize: 90,
          fontSize: "42px",
          padding: "lg",
          gap: "md",
          titleSize: "xl",
        }
      default: // md
        return {
          cardSize: 70,
          fontSize: "32px",
          padding: "md",
          gap: "sm",
          titleSize: "lg",
        }
    }
  }

  const config = getSizeConfig()

  return (
    <Box className={`countdown-timer countdown-${variant} countdown-${size} countdown-${status}`}>
      <Stack align="center" gap={config.gap}>
        {showTitle && (
          <Text className="countdown-title" size={config.titleSize} fw={500} c="dimmed" ta="center">
            {title}
          </Text>
        )}

        <Group gap={config.gap} className="time-units" justify="center">
          <div className="time-unit">
            <Paper
              className="time-card"
              radius="lg"
              style={{
                width: config.cardSize,
                height: config.cardSize,
                minWidth: config.cardSize,
                minHeight: config.cardSize,
              }}
            >
              <Text className="time-number" size={config.fontSize} fw={700} ta="center" lh={1}>
                {formatNumber(timeUnits.hours)}
              </Text>
            </Paper>
            <Text className="time-label" size="xs" fw={600} c="dimmed" ta="center" mt="xs">
              HRS
            </Text>
          </div>

          <div className="time-separator">
            <Text size={config.fontSize} fw={300} c="dimmed" lh={1}>
              :
            </Text>
          </div>

          <div className="time-unit">
            <Paper
              className="time-card"
              radius="lg"
              style={{
                width: config.cardSize,
                height: config.cardSize,
                minWidth: config.cardSize,
                minHeight: config.cardSize,
              }}
            >
              <Text className="time-number" size={config.fontSize} fw={700} ta="center" lh={1}>
                {formatNumber(timeUnits.minutes)}
              </Text>
            </Paper>
            <Text className="time-label" size="xs" fw={600} c="dimmed" ta="center" mt="xs">
              MIN
            </Text>
          </div>

          <div className="time-separator">
            <Text size={config.fontSize} fw={300} c="dimmed" lh={1}>
              :
            </Text>
          </div>

          <div className="time-unit">
            <Paper
              className="time-card"
              radius="lg"
              style={{
                width: config.cardSize,
                height: config.cardSize,
                minWidth: config.cardSize,
                minHeight: config.cardSize,
              }}
            >
              <Text className="time-number" size={config.fontSize} fw={700} ta="center" lh={1}>
                {formatNumber(timeUnits.seconds)}
              </Text>
            </Paper>
            <Text className="time-label" size="xs" fw={600} c="dimmed" ta="center" mt="xs">
              SEC
            </Text>
          </div>
        </Group>

        {status === "finished" && showDescription && (
          <Text size="sm" fw={600} c="red" ta="center" className="finished-message">
            Time's Up!
          </Text>
        )}
      </Stack>
    </Box>
  )
}

export default CountdownTimer
