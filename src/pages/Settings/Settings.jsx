import { useEffect, useState } from "react"
import { Container, TextInput, Title, Text, Divider, Card, Grid, NumberInput, Button, Group, Stack, Loader } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone";
import AdvancedEditor from "../../components/Generics/RichTextEditor"
import styles from "./settings.module.scss"
import apiClient from "../../utils/api"
import useAuthStore from "../../context/auth-store"
import { IconPhoto } from "@tabler/icons-react";

// ✅ Sonner
import { Toaster, toast } from "sonner";

export function SettingsPage() {
  const { user } = useAuthStore();
  const orgId = user?.organization?._id || user?.organizationId;

  const [detentionTabs, setDetentionTabs] = useState(5)
  const [detentionDuration, setDetentionDuration] = useState(30)
  const [examInstructions, setExamInstructions] = useState("")
  const [watermark, setWatermark] = useState("")
  const [backgroundImage, setBackgroundImage] = useState("")
  const [loading, setLoading] = useState(false)

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
      })
      .catch(err => {
        toast.dismiss();
        toast.error(err.response?.data?.message || "Failed to fetch settings", { duration: 3000 });
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  // Handle image upload
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

    // ✅ Required field validation
    if (!watermark.trim()) {
      toast.dismiss();
      toast.error("Watermark is required!", { duration: 3000 });
      return;
    }

    setLoading(true);
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
      await apiClient.put(`/settings/${orgId}`, payload);
      toast.dismiss();
      toast.success("Settings saved successfully.", { duration: 3000 });
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to save settings", { duration: 3000 });
    }
    setLoading(false);
  }

  const handleReset = () => {
    setDetentionTabs(5)
    setDetentionDuration(30)
    setExamInstructions("")
    setWatermark("")
    setBackgroundImage("")
    toast.dismiss();
    toast.info("Settings have been reset.", { duration: 3000 });
  }

  return (
    <Container size="lg" className={styles.page}>
      {/* ✅ Sonner Toaster */}
      <Toaster position="top-center" richColors duration={3000} />

      <div className={styles.header}>
        <Title order={1} className="text-balance">
          Settings
        </Title>
        <Text c="dimmed">Configure your application settings and preferences.</Text>
      </div>

      <Divider my="md" />

      {loading && <Loader my="md" />}

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
              min={1} // ✅ minimum 1
              max={20}
              clampBehavior="strict"
              value={detentionTabs}
              onChange={(val) => setDetentionTabs(Math.max(1, Number(val ?? 1)))}
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
              min={5} // ✅ minimum 5
              max={180}
              clampBehavior="strict"
              value={detentionDuration}
              onChange={(val) => setDetentionDuration(Math.max(5, Number(val ?? 5)))}
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
      <Card withBorder radius="md" padding="lg" className={styles.sectionCard}>
        <Stack gap="xs">
          <Title order={3}>Exam Settings</Title>

          <TextInput
            label="Watermark" // ✅ Removed *
            placeholder="Watermark for your Exams..."
            mt="md"
            value={watermark}
            onChange={e => setWatermark(e.currentTarget.value)}
            disabled={loading}
            required
          />
             <Text size="xs" c="dimmed" mt={6}>
            The watermark will appear on all exam pages to prevent copying or misuse.
          </Text>

          {/* Upload Section */}
          <div style={{ marginTop: 16 }}>
            
           <Title order={5} fw={600} mb={4}>Background Images</Title>

            <Card withBorder padding="md" radius="md" mt="sm">

              <Dropzone
              
                onDrop={handleImageDrop}
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

          <Text size="xs" c="dimmed" mt={6}>
           Upload or manage background images that will be shown on exam pages.  
          </Text>
        </Stack>

        <div style={{ marginTop: 16 }}>
          <Title order={5} fw={600} mb={4}> Intructions for Exams</Title>

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
