import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Title,
  Text,
  Divider,
  Card,
  Grid,
  NumberInput,
  Button,
  Group,
  Stack,
  Loader,
  Switch,
  LoadingOverlay,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import AdvancedEditor from "../../components/Generics/RichTextEditor";
import styles from "./settings.module.scss";
import apiClient from "../../utils/api";
import useAuthStore from "../../context/auth-store";
import { IconPhoto } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";

// ✅ Defaults
const DEFAULTS = {
  detention: { maxTabs: 5, durationInMinutes: 30, concludeOnDetention: false },
  exam: { instructions: "", watermark: "", backgroundImage: "" },
};

export function SettingsPage() {
  const { user, loadSettings } = useAuthStore();
  const orgId = user?.organization?._id || user?.organizationId;

  const [detention, setDetention] = useState(DEFAULTS.detention);
  const [exam, setExam] = useState(DEFAULTS.exam);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch settings
  useEffect(() => {
    if (!orgId) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/settings`);
        setDetention({
          maxTabs: data.data.detention?.maxTabs ?? DEFAULTS.detention.maxTabs,
          durationInMinutes:
            data.data.detention?.durationInMinutes ??
            DEFAULTS.detention.durationInMinutes,
          concludeOnDetention:
            data.data.detention?.concludeOnDetention ??
            DEFAULTS.detention.concludeOnDetention,
        });
        setExam({
          instructions:
            data.data.exam?.instructions ?? DEFAULTS.exam.instructions,
          watermark: data.data.exam?.watermark ?? DEFAULTS.exam.watermark,
          backgroundImage:
            data.data.exam?.backgroundImage ?? DEFAULTS.exam.backgroundImage,
        });
        await loadSettings();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [orgId]);

  // ✅ Image upload
  const handleImageDrop = (files) => {
    if (!files?.length) return;
    const reader = new FileReader();
    reader.onload = () =>
      setExam((prev) => ({ ...prev, backgroundImage: reader.result }));
    reader.readAsDataURL(files[0]);
  };

  // ✅ Save
  const handleSave = async () => {
    if (!orgId) return;
    if (!exam.watermark.trim()) {
      toast.error("Watermark is required!");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/settings/`, { detention, exam });
      await loadSettings();
      toast.success("Settings saved successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset
  const handleReset = () => {
    setDetention(DEFAULTS.detention);
    setExam(DEFAULTS.exam);
    toast.info("Settings have been reset.");
  };

  if (loading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "blue", type: "dots" }}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  return (
    <Container size="lg" className={styles.page}>
      <Toaster position="top-center" richColors duration={3000} />

      {/* Header */}
      <header className={styles.header}>
        <Title order={1}>Settings</Title>
        <Text c="dimmed">
          Configure your application settings and preferences.
        </Text>
      </header>

      <Divider my="lg" />
      {/* Exam Section */}
      <Card
        withBorder
        radius="lg"
        p="xl"
        mt="lg"
        className={styles.sectionCard}
      >
        <Stack gap="xs">
          <Title order={3}>Exam Settings</Title>

          <TextInput
            label="Watermark"
            placeholder="Watermark for your Exams..."
            mt="md"
            value={exam.watermark}
            onChange={(e) =>
              setExam((prev) => ({ ...prev, watermark: e.currentTarget.value }))
            }
            disabled={loading}
            required
          />
          <Text size="xs" c="dimmed" mt={6}>
            The watermark will appear on all exam pages to prevent copying or
            misuse.
          </Text>

          {/* Upload Section */}
          <Title order={5} fw={600} mt="lg" mb="sm">
            Background Image
          </Title>

          <Card withBorder p="lg" radius="md" className={styles.uploadCard}>
            <Dropzone
              onDrop={handleImageDrop}
              maxSize={5 * 1024 ** 2}
              accept={{ "image/*": [] }}
              disabled={loading}
            >
              <Group
                justify="center"
                gap="md"
                mih={180}
                className={styles.dropArea}
              >
                <IconPhoto size={40} stroke={1.5} />
                <div>
                  <Text size="md" fw={500}>
                    Drag images here or click to select files
                  </Text>
                  <Text size="xs" c="dimmed">
                    Each file should not exceed 5MB
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {exam.backgroundImage && (
              <img
                src={exam.backgroundImage}
                alt="Exam Background"
                className={styles.previewImage}
              />
            )}
          </Card>

          <Text size="xs" c="dimmed" mt={6}>
            Upload or manage background images that will be shown on exam pages.
          </Text>
        </Stack>

        <Title order={5} fw={600} mt="lg" mb="sm">
          Instructions for Exams
        </Title>
        <AdvancedEditor
          value={exam.instructions}
          onChange={(val) =>
            setExam((prev) => ({ ...prev, instructions: val }))
          }
          placeholder="Enter default exam instructions..."
          disabled={loading}
        />
        <Text size="xs" c="dimmed" mt={6}>
          These instructions will be displayed to students at the beginning of
          each exam.
        </Text>
      </Card>
      {/* Detention Section */}
      <Card withBorder radius="lg" p="xl" className={styles.sectionCard}>
        <Stack gap="xs">
          <Title order={3}>Detention Settings</Title>
          <Text size="sm" c="dimmed">
            Configure detention parameters and duration settings.
          </Text>
        </Stack>

        <Grid align="center" mt="lg" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Switch
              label="Conclude on Detention"
              checked={detention.concludeOnDetention}
              onChange={(e) =>
                setDetention((prev) => ({
                  ...prev,
                  concludeOnDetention: e?.currentTarget?.checked || false,
                }))
              }
              disabled={loading}
            />
            <Text size="xs" c="dimmed" mt={6}>
              Automatically conclude the exam when detention is triggered
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Number of Tabs"
              min={1}
              max={20}
              value={detention.maxTabs}
              onChange={(val) =>
                setDetention((prev) => ({
                  ...prev,
                  maxTabs: Math.max(1, Number(val ?? 1)),
                }))
              }
              disabled={loading}
            />
            <Text size="xs" c="dimmed" mt={6}>
              Maximum number of tabs allowed during detention
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Duration (minutes)"
              min={5}
              max={180}
              value={detention.durationInMinutes}
              onChange={(val) =>
                setDetention((prev) => ({
                  ...prev,
                  durationInMinutes: Math.max(5, Number(val ?? 5)),
                }))
              }
              disabled={loading}
            />
            <Text size="xs" c="dimmed" mt={6}>
              Default detention duration in minutes
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Actions */}
      <div className={styles.actions}>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Save Settings
          </Button>
        </Group>
      </div>
    </Container>
  );
}

export default SettingsPage;
