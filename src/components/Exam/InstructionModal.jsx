import { Modal, Text, Stack, List, Group } from "@mantine/core";
import { IconInfoCircle, IconCircleCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import styles from "./instruction-modal.module.scss";

const InstructionModal = ({
  opened,
  onClose,
  instruction,
  autocloseDelay = 0,
}) => {
  useEffect(() => {
    if (!opened || !autocloseDelay) return;
    const id = setTimeout(() => onClose(), autocloseDelay);
    return () => clearTimeout(id);
  }, [opened, autocloseDelay, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group className={styles.titleGroup}>
          <IconInfoCircle size={22} />
          <Text fw={600} size="lg">
            Instructions 
          </Text>
        </Group>
      }
      size="lg"
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
      transitionProps={{ transition: "pop", duration: 150 }}
      padding="lg"
      classNames={{
        header: styles.header,
        title: styles.title,
        content: styles.content,
        body: styles.body,
      }}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Please read the following instructions carefully before proceeding:
        </Text>

        <div dangerouslySetInnerHTML={{ __html: instruction }} />

        <Text size="xs" c="dimmed" fs="italic">
          These instructions can also auto-hide after a delay when you start
          answering questions.
        </Text>
      </Stack>
    </Modal>
  );
};

export default InstructionModal;
