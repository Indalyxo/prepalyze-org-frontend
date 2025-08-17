import { useState, useEffect } from "react"
import { Progress, Text } from "@mantine/core"
import styles from "./loading-page.module.scss"

const LoadingPage = () => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading...")

  const loadingSteps = ["Loading...", "Preparing content...", "Almost ready..."]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        setLoadingText(loadingSteps[Math.min(stepIndex, loadingSteps.length - 1)])

        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.owlContainer}>
        <img src="/logo.svg" alt="Educational Owl Mascot" className={styles.owlImage} />
      </div>

      <div className={styles.loadingContent}>
        <Text className={styles.loadingSubtitle}>{loadingText}</Text>

        <div className={styles.progressContainer}>
          <Progress
            value={progress}
            size="sm"
            radius="sm"
            className={styles.progressBar}
            styles={{
              root: { backgroundColor: "#f1f5f9" },
              bar: { backgroundColor: "#64748b" },
            }}
          />
          <Text size="xs" className={styles.progressText}>
            {Math.round(progress)}%
          </Text>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage
