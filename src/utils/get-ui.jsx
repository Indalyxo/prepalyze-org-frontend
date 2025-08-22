import { IconClipboardList } from "@tabler/icons-react";
import { SubjectIcons } from "../constants";

export const getIcons = (subject, styles) => {
  const Icon = SubjectIcons[subject] || IconClipboardList;
  return <Icon size={24} className={styles.cardIcon} />;
};
