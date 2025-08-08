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
        <div className="decoration-circle decoration-circle-4"></div>
        <div className="decoration-circle decoration-circle-5"></div>
        <div className="decoration-circle decoration-circle-6"></div>
        <div className="decoration-circle decoration-circle-7"></div>
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
