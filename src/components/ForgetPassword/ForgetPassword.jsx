import { TextInput, Button, Text, Stack, Title } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "../../utils/api";
import "../LoginForm/login-form.scss";
import "../../pages/LoginPage/login-page.scss";

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
        await apiClient.post("/auth/forget-password", { email: form.values.email });
        toast.success("Reset link sent to your email!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page auth-page">
      <div className="auth-card">
        <div className="login-form-container">
          {/* Decorative background elements */}
          <div className="background-decoration">
            <div className="decoration-circle decoration-circle-1"></div>
            <div className="decoration-circle decoration-circle-2"></div>
            <div className="decoration-circle decoration-circle-3"></div>
            <div className="decoration-circle decoration-circle-4"></div>
            <div className="decoration-circle decoration-circle-5"></div>
            <div className="decoration-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>

          <div className="form-wrapper">
            <div className="logo-section">
              <div className="logo">
                <img className="logo-icon" src="/Prepalyze-logo.svg" alt="" />
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="form-content">
              <Stack gap="lg">
                <div className="welcome-section">
                  <Title className="welcome-title">Forgot Password?</Title>
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
                  className="email-input"
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

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Text size="sm" c="rgba(255, 255, 255, 0.7)">
                    Remembered your password?{' '}
                    <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Login
                    </a>
                  </Text>
                </div>
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
