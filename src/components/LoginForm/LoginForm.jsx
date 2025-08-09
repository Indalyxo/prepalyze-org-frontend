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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        // Login successful, handle user session (e.g., save token, redirect)
        console.log('Login success:', data)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
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
            {error && (
              <Text color="red" size="sm" className="error-message">{error}</Text>
            )}
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="email-input"
                required
                disabled={loading}
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                className="password-input"
                required
                disabled={loading}
              />

              <Button type="submit" className="login-button" fullWidth loading={loading}>
                Log in
              </Button>
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  )
}
