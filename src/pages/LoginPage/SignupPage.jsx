import SignupForm from '../../components/SignupForm/SignupForm'
import LoginImageSection from '../../components/LoginImageSection/LoginImageSection'
import './login-page.scss'

export default function SignupPage() {
  return (
    <div>
    <div className="login-page">
      <div className="login-container">
        <div className="form-section">
          <SignupForm />
        </div>
        <div className="image-section">
          <LoginImageSection />
        </div>
      </div>
    </div>
    </div>
  )
}
