import { TextInput, PasswordInput, Button, Text, Stack } from "@mantine/core";
import { IconBrandGoogle, IconLock, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import useAuthStore from "../../context/auth-store";
import "./login-form.scss";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginForm() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Please enter a valid email address",
      password: (value) =>
        value.trim().length < 8
          ? "Password must be at least 8 characters"
          : null,
    },
  });

  const handleSubmit = async (e) => {
    const isValid = form.validate();

    if (!isValid.hasErrors) {
      const { email, password } = form.values;

      try {
        const response = await login(email, password);
        console.log(response);

        if (response.user.role === "organizer") {
          navigate("/organization");
        } else {
          navigate("/student");
        }
        toast.success(response?.data?.data || "Login Successful");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
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
            <div className="logo-icon">✦</div>
            <Text className="logo-text">Untitled UI</Text>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="form-content">
          <Stack gap="lg">
            <div className="welcome-section">
              <Text className="welcome-title">Welcome back!</Text>
              <Text className="welcome-subtitle">
                Please enter your details.
              </Text>
            </div>

            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                leftSection={<IconMail size={18} />}
                size="md"
                radius="md"
                {...form.getInputProps("email")}
                className="email-input"
                required
              />

              <PasswordInput
                label="Password"
                placeholder="•••••••"
                leftSection={<IconLock size={18} />}
                size="md"
                radius="md"
                {...form.getInputProps("password")}
                className="password-input"
                required
              />

              <Button
                type="submit"
                onClick={handleSubmit}
                className="login-button"
                fullWidth
              >
                Log in
              </Button>
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  );
}
