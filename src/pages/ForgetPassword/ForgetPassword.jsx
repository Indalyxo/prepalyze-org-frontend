import ForgetPasswordComponent from '../../components/ForgetPassword/ForgetPassword'
import './forget-page.scss'
export default function ForgetPassword() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-section">
          <ForgetPasswordComponent />
        </div>
      </div>
    </div>
  )
}
