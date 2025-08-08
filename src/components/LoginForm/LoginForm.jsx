import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack,
} from '@mantine/core'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useState } from 'react'
import './login-form.scss'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
  }

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

        <form onSubmit={handleSubmit} className="form-content">
          <Stack gap="lg">
            <div className="welcome-section">
              <Text className="welcome-title">Welcome back!</Text>
              <Text className="welcome-subtitle">Please enter your details.</Text>
            </div>

            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="email-input"
                required
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                className="password-input"
                required
              />

              <Button type="submit" className="login-button" fullWidth>
                Log in
              </Button>
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  )
}
