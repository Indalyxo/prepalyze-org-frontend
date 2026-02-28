import { TextInput, Button, Text, Stack } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Please enter a valid email",
    },
  });

  const handleSubmit = async () => {
    const isValid = form.validate();
    if (!isValid.hasErrors) {
      try {
        setLoading(true);
        // Call API here later
        toast.success("Reset link sent to your email!");
      } catch (err) {
        toast.error("Something went wrong!");
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
              <Text className="welcome-title">Forgot Password?</Text>
              <Text className="welcome-subtitle">
                Enter your email to receive a reset link.
              </Text>
            </div>

            <TextInput
              label="Email"
              placeholder="Enter your email"
              leftSection={<IconMail size={18} />}
              size="md"
              radius="md"
              {...form.getInputProps("email")}
              required
            />

            <Button
              fullWidth
              loading={loading}
              onClick={handleSubmit}
              className="login-button"
            >
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
}
