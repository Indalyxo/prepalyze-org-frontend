import { TextInput, PasswordInput, Button, Text, Stack, Anchor, Group, Select } from "@mantine/core";
import { IconLock, IconMail, IconUser, IconPhone } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import "./signup-form.scss";

const countryCodes = [
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+971', label: '🇦🇪 +971' },
  { value: '+7', label: '🇷🇺 +7' },
];

export default function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");

  useState(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/organizations`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.organizations.map(org => ({ value: org.id, label: org.name }));
          setOrganizations(formatted);
          if (formatted.length > 0) setOrganizationId(formatted[0].value);
        }
      })
      .catch(err => console.error("Failed to fetch organizations", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return toast.error("Valid email is required");
    if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) return toast.error("Valid 10-digit phone number is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phoneNumber: fullPhoneNumber, organizationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <div className="background-decoration">
        <div className="decoration-circle decoration-circle-1" style={{ top: '10%', left: '10%', width: '100px', height: '100px' }}></div>
        <div className="decoration-circle decoration-circle-2" style={{ bottom: '10%', right: '10%', width: '150px', height: '150px', animationDelay: '2s' }}></div>
        <div className="decoration-circle decoration-circle-3" style={{ top: '40%', right: '15%', width: '80px', height: '80px', animationDelay: '4s' }}></div>
        <div className="decoration-dots">
          {[...Array(6)].map((_, i) => <div key={i} className="dot"></div>)}
        </div>
      </div>

      <div className="form-wrapper">
        <div className="logo-section">
          <div className="logo">
            <img className="logo-icon" src="/Prepalyze-logo.svg" alt="Prepalyze Logo" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <Stack gap="lg">
            <div className="welcome-section">
              <Text className="welcome-title">Create Account</Text>
              <Text className="welcome-subtitle">
                Join our student community today.
              </Text>
            </div>

            <Stack gap="sm">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                leftSection={<IconUser size={18} />}
                size="md"
                radius="md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input"
                required
              />

              <TextInput
                label="Email"
                placeholder="student@example.com"
                type="email"
                leftSection={<IconMail size={18} />}
                size="md"
                radius="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />

              <Group grow align="flex-end" gap="xs">
                <Select
                  label="Phone Number"
                  data={countryCodes}
                  value={countryCode}
                  onChange={setCountryCode}
                  size="md"
                  radius="md"
                  styles={{ root: { flex: '0 0 110px' } }}
                />
                <TextInput
                  placeholder="1234567890"
                  leftSection={<IconPhone size={18} />}
                  size="md"
                  radius="md"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="phone-input"
                  required
                />
              </Group>

              <Select
                label="Organization"
                placeholder="Select your organization"
                data={organizations}
                value={organizationId}
                onChange={setOrganizationId}
                size="md"
                radius="md"
                required
                className="org-input"
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                leftSection={<IconLock size={18} />}
                size="md"
                radius="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />

              <Button
                type="submit"
                loading={isLoading}
                className="signup-button"
                fullWidth
                size="md"
                radius="md"
                mt="md"
              >
                Create Account
              </Button>

              <div className="toggle-auth" style={{ textAlign: "center", marginTop: "1rem" }}>
                <Text size="sm" color="dimmed">
                  Already have an account?{" "}
                  <Anchor
                    component={Link}
                    to="/login"
                    size="sm"
                    fw={600}
                  >
                    Log in
                  </Anchor>
                </Text>
              </div>
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  );
}
