import { PasswordInput, Button, Text, Stack } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../utils/api";
import "../LoginForm/login-form.scss";

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

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    const isValid = form.validate();
    if (!isValid.hasErrors) {
      try {
        setLoading(true);
        await apiClient.post("/auth/reset-password", {
          token,
          password: form.values.password,
        });
        toast.success("Password reset successful!");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Reset failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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
