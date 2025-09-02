import { useEffect, useState } from "react"
import { Container,TextInput , Title, Text, Divider, Card, Grid, NumberInput, Button, Group, Stack, Loader, Notification } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone";
import AdvancedEditor from "../../components/Generics/RichTextEditor"
import styles from "./settings.module.scss"
import apiClient from "../../utils/api"
import useAuthStore from "../../context/auth-store"
import { IconPhoto } from "@tabler/icons-react";

export function SettingsPage() {
  const { user } = useAuthStore();
  const orgId = user?.organization?._id || user?.organizationId;

  const [detentionTabs, setDetentionTabs] = useState(5)
  const [detentionDuration, setDetentionDuration] = useState(30)
  const [examInstructions, setExamInstructions] = useState("")
  const [watermark, setWatermark] = useState("")
  const [backgroundImage, setBackgroundImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    apiClient.get(`/settings/${orgId}`)
      .then(res => {
        const data = res.data.data;
        setDetentionTabs(data.detention?.maxTabs ?? 5);
        setDetentionDuration(data.detention?.durationInMinutes ?? 30);
        setExamInstructions(data.exam?.instructions ?? "");
        setWatermark(data.exam?.watermark ?? "");
        setBackgroundImage(data.exam?.backgroundImage ?? "");
        setError("");
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to fetch settings");
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  // Handle image upload and convert to base64
  const handleImageDrop = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        detention: {
          maxTabs: detentionTabs,
          durationInMinutes: detentionDuration
        },
        exam: {
          instructions: examInstructions,
          watermark,
          backgroundImage
        }
      };
      const res = await apiClient.put(`/settings/${orgId}`, payload);
      setSuccess("Settings saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  }

  const handleReset = () => {
    setDetentionTabs(5)
    setDetentionDuration(30)
    setExamInstructions("")
    setWatermark("")
    setBackgroundImage("")
    setError("");
    setSuccess("");
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

      {loading && <Loader my="md" />}
      {error && <Notification color="red" title="Error" my="md">{error}</Notification>}
      {success && <Notification color="green" title="Success" my="md">{success}</Notification>}

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
              disabled={loading}
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
              disabled={loading}
            />
            <Text size="xs" c="dimmed" mt={6}>
              Default detention duration in minutes
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

     {/* Exam Section */}
{/* Exam Section */}
<Card withBorder radius="md" padding="lg" className={styles.sectionCard}>
  <Stack gap="xs">
    <Title order={3}>Exam Settings</Title>

    <TextInput
      label="Water Mark"
      placeholder="Water Mark For your Exams..."
      mt="md"
      value={watermark}
      onChange={e => setWatermark(e.currentTarget.value)}
      disabled={loading}
    />

    {/* Upload Section with Border */}
    <div style={{ marginTop: 16 }}>
      <Title order={5} mb={4}>Upload Exam Background Images</Title>
      <Card withBorder padding="md" radius="md" mt="sm">
        <Dropzone
          onDrop={handleImageDrop}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          accept={{ "image/*": [] }}
          disabled={loading}
        >
          <Group justify="center" gap="md" mih={180} style={{ pointerEvents: "none" }}>
            <IconPhoto size={40} stroke={1.5} />
            <div>
              <Text size="md" fw={500}>
                Drag images here or click to select files
              </Text>
              <Text size="xs" c="dimmed">
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>
        </Dropzone>

        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Exam Background"
            style={{
              marginTop: 12,
              maxWidth: "100%",
              borderRadius: 8,
              border: "1px solid #e0e0e0"
            }}
          />
        )}
      </Card>
    </div>

    <Text size="sm" c="dimmed">
      Configure default exam instructions and settings.
    </Text>
  </Stack>

  <div style={{ marginTop: 12 }}>
    <AdvancedEditor
      value={examInstructions}
      onChange={setExamInstructions}
      placeholder="Enter default exam instructions..."
      disabled={loading}
    />
    <Text size="xs" c="dimmed" mt={6}>
      These instructions will be displayed to students at the beginning of each exam
    </Text>
  </div>
</Card>




      {/* Actions */}
      <div className={styles.actions}>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button onClick={handleSave} loading={loading}>Save Settings</Button>
        </Group>
      </div>
    </Container>
  )
}

export default SettingsPage
