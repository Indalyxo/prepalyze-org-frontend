import { useState } from "react"
import { Container, Title, Text, Divider, Card, Grid, NumberInput, Button, Group, Stack } from "@mantine/core"
import  AdvancedEditor  from "../../components/Generics/RichTextEditor"
import styles from "./settings.module.scss"

export function SettingsPage() {
  const [detentionTabs, setDetentionTabs] = useState(5)
  const [detentionDuration, setDetentionDuration] = useState(30)
  const [examInstructions, setExamInstructions] = useState("")

  const handleSave = () => {
    const payload = { detentionTabs, detentionDuration, examInstructions }
    localStorage.setItem("app-settings", JSON.stringify(payload))
  }

  const handleReset = () => {
    setDetentionTabs(5)
    setDetentionDuration(30)
    setExamInstructions("")
    localStorage.removeItem("app-settings")
  }

  return (
    <Container size="lg" className={styles.page}>
      <div className={styles.header}>
        <Title order={1} className="text-balance">
          Settings
        </Title>
        <Text c="dimmed">Configure your application settings and preferences.</Text>
      </div>

      <Divider my="md" />

      {/* Detention Section */}
      <Card withBorder radius="md" padding="lg" className={styles.sectionCard}>
        <Stack gap="xs">
          <Title order={3}>Detention Settings</Title>
          <Text size="sm" c="dimmed">
            Configure detention parameters and duration settings.
          </Text>
        </Stack>

        <Grid mt="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Number of Tabs"
              min={1}
              max={20}
              clampBehavior="strict"
              value={detentionTabs}
              onChange={(val) => setDetentionTabs(Number(val ?? 0))}
              placeholder="Enter number of tabs"
            />
            <Text size="xs" c="dimmed" mt={6}>
              Maximum number of tabs allowed during detention
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Duration (minutes)"
              min={1}
              max={180}
              clampBehavior="strict"
              value={detentionDuration}
              onChange={(val) => setDetentionDuration(Number(val ?? 0))}
              placeholder="Enter duration in minutes"
            />
            <Text size="xs" c="dimmed" mt={6}>
              Default detention duration in minutes
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Exam Section */}
      <Card withBorder radius="md" padding="lg" className={styles.sectionCard}>
        <Stack gap="xs">
          <Title order={3}>Exam Settings</Title>
          <Text size="sm" c="dimmed">
            Configure default exam instructions and settings.
          </Text>
        </Stack>

        <div style={{ marginTop: 12 }}>
          <AdvancedEditor
            value={examInstructions}
            onChange={setExamInstructions}
            placeholder="Enter default exam instructions..."
          />
          <Text size="xs" c="dimmed" mt={6}>
            These instructions will be displayed to students at the beginning of each exam
          </Text>
        </div>
      </Card>

      {/* Actions */}
      <div className={styles.actions}>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </Group>
      </div>
    </Container>
  )
}

export default SettingsPage
