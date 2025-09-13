import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  Image,
  Text,
  Title,
  Button,
  Card,
  Group,
  Stack,
  Badge,
  Container,
  Box,
  Divider,
  ThemeIcon,
  Flex,
} from "@mantine/core"
import { gsap } from "gsap"
import styles from "./exam-start-page.module.scss"
import { useLocation, useNavigate } from "react-router-dom"
import {
  IconBook,
  IconClock,
  IconClipboardList,
  IconUsers,
  IconAlertTriangle,
  IconTrophy,
  IconTarget,
  IconStar,
} from "@tabler/icons-react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

const motivationalContent = [
  {
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757575038/CM_PUNK_Poster_1_oxct5m.avif",
    quote: "If your dream doesn't scare you, then you need a bigger dream.",
    author: "Phil Brooks",
    category: "Courage",
  },
  {
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757573115/Transform_the_upload_njte5o.avif",
    quote: "Have a dream, hold onto it, and shoot for the sky.",
    author: `"The American Dream" Dusty Rhodes`,
    category: "Ambition",
  },
  {
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757576772/APJ_Abdul_Kalam_dtsiaf.avif",
    quote: "Man needs difficulties in life because they are necessary to enjoy success.",
    author: `A.P.J. Abdul Kalam`,
    category: "Perseverance",
  },
  {
    image: "https://res.cloudinary.com/diviaanea/image/upload/v1757586235/StanLee_jmregp.avif",
    quote: "Don't just read, experience. Don't just learn, create.",
    author: `Stan Lee`,
    category: "Innovation",
  },
]

export default function ExamPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const quoteRef = useRef(null)
  const animationRef = useRef(null)

  const { examTitle, examId, instruction, timing, duration, totalMarks, totalQuestions, sections } =
    location.state || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState({})

  const examStats = useMemo(
    () => [
      {
        label: "Total Questions",
        value: totalQuestions || "50",
        icon: IconClipboardList,
        color: "blue",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      },
      {
        label: "Duration",
        value: `${duration} mins` || "60 mins",
        icon: IconClock,
        color: "orange",
        gradient: "linear-gradient(135deg, #f97316, #ea580c)",
      },
      {
        label: "Total Marks",
        value: totalMarks || "100",
        icon: IconTrophy,
        color: "green",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
      },
      {
        label: "Attempts",
        value: "120",
        icon: IconUsers,
        color: "purple",
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      },
    ],
    [totalQuestions, duration, totalMarks],
  )

  // Calculate exam status
  const { isExamStarted, isExamEnded, canStartExam } = useMemo(() => {
    const now = dayjs()
    const startTime = dayjs(timing?.start)
    const endTime = dayjs(timing?.end)

    const started = startTime.isBefore(now)
    const ended = endTime.isBefore(now)
    const canStart = started && !ended

    return {
      isExamStarted: started,
      isExamEnded: ended,
      canStartExam: canStart,
    }
  }, [timing])

  // Update time remaining
  useEffect(() => {
    if (!timing) return

    const updateTimeRemaining = () => {
      const now = dayjs()
      const start = dayjs(timing.start)
      const end = dayjs(timing.end)

      if (now.isBefore(start)) {
        const diff = dayjs.duration(start.diff(now))
        setTimeRemaining({
          status: "startsIn",
          value: diff,
          text: `Starts in: ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`,
        })
      } else if (now.isBefore(end)) {
        const diff = dayjs.duration(end.diff(now))
        setTimeRemaining({
          status: "endsIn",
          value: diff,
          text: `Ends in: ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`,
        })
      } else {
        setTimeRemaining({
          status: "ended",
          value: dayjs.duration(0),
          text: "Exam has ended",
        })
      }
    }

    updateTimeRemaining()
    const intervalId = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(intervalId)
  }, [timing])

  useEffect(() => {
    if (!quoteRef.current) return

    if (animationRef.current) {
      animationRef.current.kill()
    }

    animationRef.current = gsap.to(quoteRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % motivationalContent.length)
        gsap.fromTo(quoteRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
      },
      paused: true,
    })

    const interval = setInterval(() => {
      animationRef.current.restart()
    }, 6000) // Increased interval for better readability

    return () => {
      clearInterval(interval)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [])

  const handleStartExam = useCallback(() => {
    navigate(`/exam/${examId}`)
  }, [navigate, examId])

  if (!location.state) {
    return (
      <Container size="md" className={styles.errorContainer}>
        <Card shadow="lg" radius="lg" p="xl" className={styles.errorCard}>
          <Stack align="center" spacing="lg">
            <ThemeIcon size={80} radius="xl" variant="light" color="red">
              <IconAlertTriangle size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Exam Information Not Found
            </Title>
            <Text ta="center" c="dimmed">
              Please navigate to this page from the exam list to view exam details.
            </Text>
            <Button onClick={() => navigate("/exams")} size="lg" leftSection={<IconBook size={20} />}>
              Back to Exams
            </Button>
          </Stack>
        </Card>
      </Container>
    )
  }

  return (
    <div className={styles.examContainer}>
      <div className={styles.leftSection}>
        <Image
          src={motivationalContent[currentIndex].image || "/placeholder.svg"}
          alt="Motivational"
          className={styles.motivationalImage}
          loading="lazy"
        />

        <div className={styles.carouselContent} ref={quoteRef}>
          <Badge size="lg" variant="light" color="white" className={styles.categoryBadge}>
            {motivationalContent[currentIndex].category}
          </Badge>

          <Text className={styles.motivationalQuote}>"{motivationalContent[currentIndex].quote}"</Text>

          <Text className={styles.motivationalAuthor}>— {motivationalContent[currentIndex].author}</Text>

          <div className={styles.progressDots}>
            {motivationalContent.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`View quote ${idx + 1}`}
                className={`${styles.dot} ${idx === currentIndex ? styles.active : ""}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <Container size="sm" className={styles.content}>
          <Box className={styles.titleSection}>
            <Title order={1} className={styles.examTitle}>
              {examTitle}
            </Title>
            <Text size="lg" c="dimmed" ta="center" className={styles.examSubtitle}>
              Prepare yourself for excellence
            </Text>
          </Box>

          {timeRemaining.text && (
            <Card shadow="md" radius="lg" className={styles.timeStatusCard}>
              <Flex align="center" justify="center" gap="sm">
                <ThemeIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color={
                    "white"
                  }
                >
                  <IconClock size={20} />
                </ThemeIcon>
                <Text
                  fw={600}
                  size="lg"
                  c={"white"}
                >
                  {timeRemaining.text}
                </Text>
              </Flex>
            </Card>
          )}

          <div className={styles.statsGrid}>
            {examStats.map((stat, i) => (
              <Card key={i} shadow="md" radius="lg" className={styles.statCard}>
                <Group spacing="md">
                  <div className={styles.iconBox} style={{ background: stat.gradient }}>
                    <stat.icon size={24} color="white" />
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" fw={500}>
                      {stat.label}
                    </Text>
                    <Text fw={700} size="xl">
                      {stat.value}
                    </Text>
                  </div>
                </Group>
              </Card>
            ))}
          </div>

          <Card shadow="md" radius="lg" className={styles.instructions}>
            <Group spacing="sm" mb="lg">
              <ThemeIcon size="lg" radius="xl" variant="light" color="orange">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <Title order={3}>Exam Instructions</Title>
            </Group>

            <Divider mb="md" />

            <Box className={styles.instructionContent}>
              <div dangerouslySetInnerHTML={{ __html: instruction }} />
            </Box>
          </Card>

          <Button
            size="xl"
            className={styles.startButton}
            onClick={handleStartExam}
            disabled={!canStartExam}
            leftSection={
              isExamEnded ? (
                <IconAlertTriangle size={24} />
              ) : !isExamStarted ? (
                <IconClock size={24} />
              ) : (
                <IconTarget size={24} />
              )
            }
          >
            {isExamEnded ? "Exam Ended" : !isExamStarted ? "Exam Not Started Yet" : "Start Exam"}
          </Button>

          <Card shadow="sm" radius="lg" className={styles.motivationalFooter}>
            <Group spacing="sm" justify="center">
              <ThemeIcon size="sm" radius="xl" variant="light" color="yellow">
                <IconStar size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" ta="center">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </Text>
            </Group>
          </Card>
        </Container>
      </div>
    </div>
  )
}
