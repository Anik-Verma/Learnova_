import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser, getStudent } from '../utils/storage';
import SceneRenderer from '../components/auth/SceneRenderer';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

export default function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const student = getStudent();
    if (student && student.name) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  
  // Track focused inputs for styling
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(email.trim(), password);
      
      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const getInputStyle = (fieldName) => ({
     borderBottom: `1px solid ${focusedField === fieldName ? t.inputFocus : t.inputBorder}`,
     boxShadow: focusedField === fieldName ? `0 2px 0 0 ${t.inputFocusGlow}` : 'none',
     color: t.inputText
  });

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-inter">
      {/* Layer 0: Scene */}
      <SceneRenderer />

      {/* Layer 1: Dark Overlay */}
      <div 
        className="absolute inset-0 z-[5]" 
        style={{
          background: isDark ? 'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.75) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 40%, rgba(255,255,255,0.1) 100%)',
          transition: 'background 0.5s ease'
        }}
      />

      {/* Layer 2: Auth Card */}
      <div className="absolute inset-0 flex items-center justify-center z-[10] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25,0.1,0.25,1], delay: 0.15 }}
          className="relative w-[420px] rounded-[2px] p-[52px_48px]"
          style={{
             background: t.surfaceModal,
             backdropFilter: 'blur(24px)',
             border: `1px solid ${t.borderSubtle}`,
             boxShadow: t.shadowModal
          }}
        >
          {/* Header */}
          <h1 className="font-orbitron font-normal text-[26px] tracking-[0.08em]" style={{ color: t.logoColor }}>Learnova</h1>
          <div className="w-full h-px mt-[12px] mb-[8px]" style={{ background: t.borderSubtle }} />
          <p className="font-space text-[11px] uppercase tracking-[0.2em]" style={{ color: t.textLabel }}>
            SIGN IN TO CONTINUE
          </p>

          {/* Error Message */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: error ? 1 : 0, height: error ? 'auto' : 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {error && <p className="text-[11px] font-inter mt-6 mb-[-12px]" style={{ color: t.accentRed }}>{error}</p>}
          </motion.div>

          {/* Form */}
          <div className="mt-[28px] space-y-[24px]">
            <div>
              <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                EMAIL
              </label>
              <input 
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                style={getInputStyle('email')}
              />
            </div>

            <div>
              <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                PASSWORD
              </label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                style={getInputStyle('password')}
              />
            </div>

            <div className="text-right mb-2">
              <span 
                onClick={() => navigate('/forgot-password')} 
                className="text-[11px] font-inter cursor-pointer transition-colors opacity-60 hover:opacity-100"
                style={{ color: t.navActive }}
              >
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="mt-[36px] w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>

          {/* Bottom Link */}
          <div className="mt-[28px] text-center font-inter text-[12px]" style={{ color: t.textMuted }}>
            Don't have an account?{' '}
            <span 
              onClick={() => navigate('/register')} 
              className="cursor-pointer transition-colors"
              style={{ color: t.navActive }}
            >
              Create account
            </span>
          </div>


          {import.meta.env.DEV && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  window.debugLearnova && window.debugLearnova()
                  alert('Check browser console (F12) for user data')
                }}
                style={{
                  marginTop: 16,
                  padding: '4px 8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: 9,
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                debug
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
