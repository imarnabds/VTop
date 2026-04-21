import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Captcha from './Captcha';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/api';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please enter both username and password.', 'error');
      return;
    }
    if (!captchaValid) {
      showToast('Please enter the correct CAPTCHA.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ username, password });
      
      if (response.success && response.user) {
        localStorage.setItem('vtop_user', JSON.stringify({
          ...response.user,
          token: response.token // save session identifier
        }));
        setUser(response.user);
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => { navigate('/dashboard'); }, 1000);
      } else {
        showToast(response.message || 'Invalid credentials.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not connect to the backend server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
        <h1>VTOP Login</h1>
        <p>Login to your portal securely.</p>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username / Registration Number</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Enter Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input 
              type={showPwd ? "text" : "password"} 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="toggle-pwd" 
              onClick={() => setShowPwd(!showPwd)}
              title={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Captcha onValidate={setCaptchaValid} />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="secondary-links">
        <a href="#" onClick={(e) => { e.preventDefault(); showToast('Forgot Password process initiated.', 'success'); }}>Forgot Password?</a>
        <a href="#" onClick={(e) => { e.preventDefault(); showToast('Forgot Login ID process initiated.', 'success'); }}>Forgot Login ID?</a>
      </div>

      <div className="footer-link">
        <Link to="/">Go to Home Page</Link>
          <div style={{ marginTop: '1rem' }}>
            Don't have an account? <Link to="/signup">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
