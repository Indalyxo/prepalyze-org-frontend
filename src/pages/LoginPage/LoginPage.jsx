import LoginForm from '../../components/LoginForm/LoginForm'
import LoginImageSection from '../../components/LoginImageSection/LoginImageSection'
import './login-page.scss'

export default function LoginPage() {
  return (
    <div>
    <div className="login-page">
      <div className="login-container">
        <div className="form-section">
          <LoginForm />
        </div>
        <div className="image-section">
          <LoginImageSection />
        </div>
      </div>

    </div>
  
    </div>
  )
}
