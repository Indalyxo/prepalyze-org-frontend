import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Text,
  Stack,
  Group,
  Anchor,
  Divider
} from '@mantine/core'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useState } from 'react'
import './login-form.scss'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password, rememberMe })
  }

  return (
    <div className="login-form-container">
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">✦</div>
          <Text className="logo-text">Untitled UI</Text>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-content">
        <Stack gap="lg">
          <div className="welcome-section">
            <Text className="welcome-title">Welcome back, Olivia</Text>
            <Text className="welcome-subtitle">Welcome back! Please enter your details.</Text>
          </div>

          <Button
            variant="outline"
            leftSection={<IconBrandGoogle size={18} />}
            className="google-button"
            fullWidth
          >
            Log in with Google
          </Button>

          <Divider label="or" labelPosition="center" className="divider" />

          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="email-input"
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="password-input"
              required
            />

            <Group justify="space-between" className="form-options">
              <Checkbox
                label="Remember for 30 days"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                className="remember-checkbox"
              />
              <Anchor href="#" className="forgot-link">
                Forgot password
              </Anchor>
            </Group>

            <Button type="submit" className="login-button" fullWidth>
              Log in
            </Button>

            <Text className="signup-text">
              {"Don't have an account? "}
              <Anchor href="#" className="signup-link">
                Sign up for free
              </Anchor>
            </Text>
          </Stack>
        </Stack>
      </form>
    </div>
  )
}
