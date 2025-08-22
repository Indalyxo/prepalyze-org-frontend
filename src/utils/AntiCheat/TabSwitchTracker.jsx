import { useEffect, useState } from "react";
import { toast } from "sonner";

const TabSwitchTracker = ({
  maxViolations = 3,
  onViolation,
  disabled,
  reset,
  setReset,
}) => {
  const [violations, setViolations] = useState(0);

  if (reset) {
    setViolations(0);
    setReset(false);
  }

  useEffect(() => {
    if (disabled) return;

    const handleBlur = () => {
      setViolations((prev) => {
        const newCount = prev + 1;

        // Show toast notification
        toast.error(`⚠️ Tab switch detected! (${newCount}/${maxViolations})`);

        // If violations exceed max allowed, trigger callback
        if (newCount >= maxViolations && onViolation) {
          onViolation(newCount);
        }

        return newCount;
      });
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, [maxViolations, onViolation]);

  return null; // No UI, just tracking
};

export default TabSwitchTracker;
