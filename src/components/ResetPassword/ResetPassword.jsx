import { PasswordInput, Button, Text, Stack } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        value.length < 8 ? "Minimum 8 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async () => {
    const isValid = form.validate();
    if (!isValid.hasErrors) {
      try {
        setLoading(true);
        // Call API here later
        toast.success("Password reset successful!");
      } catch (err) {
        toast.error("Reset failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-form-container">
      <div className="form-wrapper">
        <form onSubmit={(e) => e.preventDefault()} className="form-content">
          <Stack gap="lg">
            <div className="welcome-section">
              <Text className="welcome-title">Reset Password</Text>
              <Text className="welcome-subtitle">
                Enter your new password.
              </Text>
            </div>

            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              leftSection={<IconLock size={18} />}
              size="md"
              radius="md"
              {...form.getInputProps("password")}
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              leftSection={<IconLock size={18} />}
              size="md"
              radius="md"
              {...form.getInputProps("confirmPassword")}
              required
            />

            <Button
              fullWidth
              loading={loading}
              onClick={handleSubmit}
              className="login-button"
            >
              Reset Password
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
}
