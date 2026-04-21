import { useState, useMemo } from 'react';
import { User, Lock, Mail, Phone, Hash, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Captcha from './Captcha';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    regNum: '',
    password: '',
    confirmPassword: '',
    dob: '',
    department: '',
    gender: 'Male'
  });
  
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (pwd.length === 0) return '';
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return 'weak';
    if (score === 2 || score === 3) return 'medium';
    return 'strong';
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      showToast('Please enter a valid email to verify.', 'error');
      return;
    }
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(fakeOtp);
    setOtpSent(true);
    showToast(`OTP sent to email! (Mock OTP is: ${fakeOtp})`, 'success');
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setEmailVerified(true);
      setOtpSent(false);
      showToast('Email verified successfully.', 'success');
    } else {
      showToast('Invalid OTP. Try again.', 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.email || !formData.mobile || !formData.regNum || !formData.password || !formData.dob || !formData.department) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    if (!emailVerified) {
      showToast('Please verify your email using OTP first.', 'error');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      showToast('Invalid email format.', 'error');
      return;
    }
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      showToast('Mobile number must be 10 digits.', 'error');
      return;
    }
    if (passwordStrength === 'weak') {
      showToast('Password is too weak. Must be 8+ chars, and include uppercase, number, and special character.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!captchaValid) {
      showToast('Invalid CAPTCHA.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      if (response.success) {
        showToast('Registration successful! Please login.', 'success');
        navigate('/login');
      } else {
        showToast(response.message || 'Registration failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not connect to the backend server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
        <h1>Student Registration</h1>
        <p>Create your new portal account.</p>
      </div>

      <form onSubmit={handleSignup}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Registration Number</label>
            <div className="input-wrapper">
              <Hash size={18} className="input-icon" />
              <input type="text" name="regNum" placeholder="21BCE0001" value={formData.regNum} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Email Address</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div className="input-wrapper" style={{ flex: 1 }}>
              <Mail size={18} className="input-icon" />
              <input type="email" name="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} disabled={emailVerified} />
            </div>
            {!emailVerified && !otpSent && (
              <button type="button" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1rem' }} onClick={handleSendOtp}>
                Verify
              </button>
            )}
            {emailVerified && (
              <div style={{ padding: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>
          {otpSent && !emailVerified && (
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} style={{ padding: '0.5rem 1rem', flex: 1 }} />
              <button type="button" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleVerifyOtp}>
                Submit OTP
              </button>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Mobile Number</label>
          <div className="input-wrapper">
            <Phone size={18} className="input-icon" />
            <input type="text" name="mobile" placeholder="10-digit number" value={formData.mobile} onChange={handleChange} maxLength={10} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPwd ? "text" : "password"} 
                name="password" 
                placeholder="Secure Password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              <button type="button" className="toggle-pwd" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? `strength-${passwordStrength}` : ''}`}></div>
                <div className={`strength-bar ${passwordStrength === 'medium' || passwordStrength === 'strong' ? `strength-${passwordStrength}` : ''}`}></div>
                <div className={`strength-bar ${passwordStrength === 'strong' ? `strength-${passwordStrength}` : ''}`}></div>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showConfirmPwd ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Match Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              <button type="button" className="toggle-pwd" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Date of Birth</label>
            <div className="input-wrapper">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ paddingLeft: '1rem' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Department</label>
            <div className="input-wrapper">
              <select name="department" value={formData.department} onChange={handleChange} style={{ paddingLeft: '1rem' }}>
                <option value="">Select Department</option>
                <option value="SCOPE">SCOPE</option>
                <option value="SITE">SITE</option>
                <option value="SENSE">SENSE</option>
                <option value="SELECT">SELECT</option>
                <option value="SMEC">SMEC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Gender</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
            <label><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> Other</label>
          </div>
        </div>

        <Captcha onValidate={setCaptchaValid} />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
    </div>
  );
}
