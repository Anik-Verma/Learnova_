import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SceneRenderer from '../components/auth/SceneRenderer';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import { 
  generateOTP, 
  storeOTP, 
  sendOTPEmail, 
  verifyOTP 
} from '../utils/otpService';
import { updatePassword, findUserByEmail } from '../utils/storage';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);

  const [phase, setPhase] = useState('email'); // email | otp | newpassword | success
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devModeOTP, setDevModeOTP] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Resend Timer Logic
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
    setLoading(true);

    const user = findUserByEmail(email);
    if (!user) {
      setError('No account found with this email');
      setLoading(false);
      return;
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    
    const result = await sendOTPEmail(email, otp, user.name);
    
    setLoading(false);
    if (result.devMode) {
      setDevModeOTP(result.otp);
    }
    setPhase('otp');
    setResendTimer(60);
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otpInput.join('');
    if (enteredOTP.length < 6) return;

    setError('');
    setLoading(true);

    const result = verifyOTP(email, enteredOTP);
    setLoading(false);

    if (result.valid) {
      setPhase('newpassword');
    } else {
      setAttempts(prev => prev + 1);
      setError(result.reason);
      setOtpInput(['', '', '', '', '', '']);
      otpRefs[0].current.focus();
      
      if (attempts + 1 >= 3) {
        setError('Too many attempts. Request a new OTP.');
        setPhase('email');
        setAttempts(0);
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updatePassword(email, newPassword);
    setLoading(false);

    if (result.success) {
      setPhase('success');
    } else {
      setError(result.reason);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.substring(value.length - 1);
    setOtpInput(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;
    
    const newOtp = [...otpInput];
    data.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtpInput(newOtp);
    if (data.length === 6) otpRefs[5].current.focus();
  };

  // Password Strength Logic
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(newPassword);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-inter">
      <SceneRenderer />
      <div 
        className="absolute inset-0 z-[5]" 
        style={{
          background: isDark ? 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.4) 40%, rgba(255,255,255,0.1) 100%)',
          transition: 'background 0.5s ease'
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center z-[10] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-[420px] rounded-[2px] p-[52px_48px]"
          style={{
             background: t.surfaceModal,
             backdropFilter: 'blur(24px)',
             border: `1px solid ${t.borderSubtle}`,
             boxShadow: t.shadowModal
          }}
        >
          {/* Back Arrow */}
          {phase !== 'success' && (
            <button 
              onClick={() => phase === 'email' ? navigate('/login') : setPhase('email')}
              className="absolute top-8 left-8 text-[20px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent"
              style={{ color: t.inputText }}
            >
              ←
            </button>
          )}

          <AnimatePresence mode="wait">
            {phase === 'email' && (
              <motion.div 
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8 text-[40px]">🔑</div>
                <h2 className="font-orbitron text-[22px] tracking-[0.08em] text-center mb-2">FORGOT PASSWORD</h2>
                <p className="font-space text-[12px] uppercase tracking-[0.15em] text-center mb-8" style={{ color: t.textMuted }}>
                  Enter your registered email address
                </p>

                {error && <p className="text-[11px] mb-4 text-center" style={{ color: t.accentRed }}>{error}</p>}

                <div className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                      EMAIL ADDRESS
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                      style={{ borderBottom: `1px solid ${t.inputBorder}`, color: t.inputText }}
                    />
                  </div>

                  <button 
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200"
                    style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
                  >
                    {loading ? 'SENDING OTP...' : 'SEND OTP →'}
                  </button>

                  <div className="text-center mt-6">
                    <span onClick={() => navigate('/login')} className="text-[11px] font-inter cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                      BACK TO LOGIN
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'otp' && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8 text-[40px]">✉️</div>
                <h2 className="font-orbitron text-[22px] tracking-[0.08em] text-center mb-2">ENTER OTP</h2>
                <div className="text-center mb-8">
                  <p className="font-space text-[12px] uppercase tracking-[0.15em]" style={{ color: t.textMuted }}>
                    We sent a 6-digit code to
                  </p>
                  <p className="text-[13px] font-medium" style={{ color: t.navActive }}>{email}</p>
                </div>

                {devModeOTP && (
                  <div className="p-4 mb-6 rounded-[2px] text-center" style={{ background: 'rgba(255,221,76,0.08)', border: '1px solid rgba(255,221,76,0.3)' }}>
                    <p className="font-orbitron text-[12px]" style={{ color: '#FFDD4C' }}>⚠️ EMAILJS NOT CONFIGURED</p>
                    <p className="text-[14px] font-bold mt-1" style={{ color: '#FFDD4C' }}>OTP for testing: {devModeOTP}</p>
                  </div>
                )}

                {error && <p className="text-[11px] mb-4 text-center" style={{ color: t.accentRed }}>{error}</p>}
                
                <div className="flex gap-2 justify-center mb-8" onPaste={handleOtpPaste}>
                  {otpInput.map((digit, i) => (
                    <input 
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-[44px] h-[52px] text-center font-orbitron text-[22px] font-bold rounded-[2px] outline-none transition-all"
                      style={{ 
                        background: 'rgba(255,255,255,0.04)', 
                        border: `1px solid ${digit ? t.navActive : 'rgba(255,255,255,0.15)'}`,
                        color: t.inputText
                      }}
                    />
                  ))}
                </div>

                {attempts > 0 && (
                   <p className="text-center text-[11px] mb-4 font-space uppercase tracking-[0.1em]" style={{ color: '#ff8800' }}>
                     {attempts} of 3 attempts used
                   </p>
                )}

                <button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otpInput.join('').length < 6}
                  className="w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200 disabled:opacity-40"
                  style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
                >
                  VERIFY CODE →
                </button>

                <div className="text-center mt-8">
                  {resendTimer > 0 ? (
                    <p className="text-[11px] font-inter opacity-60">Resend in {resendTimer}s</p>
                  ) : (
                    <span onClick={handleSendOTP} className="text-[11px] font-inter cursor-pointer text-[#a8e8ff] hover:underline decoration-1">
                      Resend OTP
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {phase === 'newpassword' && (
              <motion.div 
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6 text-[40px]">🔒</div>
                <h2 className="font-orbitron text-[22px] tracking-[0.08em] text-center mb-1">SET NEW PASSWORD</h2>
                <p className="text-center text-[12px] mb-8 font-space tracking-[0.1em]" style={{ color: '#39ff14' }}>✓ OTP VERIFIED SUCCESSFULLY</p>

                {error && <p className="text-[11px] mb-4 text-center" style={{ color: t.accentRed }}>{error}</p>}

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                      NEW PASSWORD
                    </label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300 pr-10"
                      style={{ borderBottom: `1px solid ${t.inputBorder}`, color: t.inputText }}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 bottom-2.5 opacity-40 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                    
                    {/* Strength Meter */}
                    <div className="mt-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                        className="h-full"
                        style={{ background: strength <= 33 ? '#ff4444' : strength <= 66 ? '#ffbb33' : '#39ff14' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                        style={{ borderBottom: `1px solid ${t.inputBorder}`, color: t.inputText }}
                      />
                      {confirmPassword && (
                        <span className="absolute right-0 bottom-2.5 text-[14px]">
                          {newPassword === confirmPassword ? '✅' : '❌'}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200"
                    style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
                  >
                    UPDATE PASSWORD →
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-8 flex justify-center">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <motion.circle 
                      cx="40" cy="40" r="38" 
                      fill="none" 
                      stroke="#39ff14" 
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.path 
                      d="M25 40 L35 50 L55 30" 
                      fill="none" 
                      stroke="#39ff14" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    />
                  </svg>
                </div>
                <h2 className="font-orbitron text-[20px] tracking-[0.08em] mb-2" style={{ color: '#39ff14' }}>PASSWORD UPDATED!</h2>
                <p className="text-[13px] font-inter mb-10" style={{ color: t.textMuted }}>
                  Your password has been successfully updated.
                </p>

                <button 
                  onClick={() => navigate('/login', { replace: true })}
                  className="w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200"
                  style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
                >
                  SIGN IN NOW →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
