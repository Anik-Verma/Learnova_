import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser, saveStudent, getStudent } from '../utils/storage';
import SceneRenderer from '../components/auth/SceneRenderer';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const student = getStudent();
    if (student && student.name) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', std: '' });
  const [errors, setErrors] = useState({});
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { isDark } = useTheme();
  const t = getTheme(isDark);

  const validate = () => {
    let err = {};
    if (!formData.name.trim()) err.name = "Required";
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) err.email = "Invalid email format";
    if (formData.password.length < 6) err.password = "Minimum 6 characters";
    if (formData.confirm !== formData.password) err.confirm = "Passwords must match";
    if (!formData.std) err.std = "Class selection required";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    
    const standardNum = parseInt(formData.std.replace(/\D/g, '')) || 9;
    
    const result = await registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      standard: standardNum
    });
    
    if (!result.success) {
      setErrors({ ...errors, email: result.reason });
      return;
    }
    
    saveStudent(result.user);
    navigate('/dashboard', { replace: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRegister();
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
           className="relative w-[460px] rounded-[2px] p-[52px_48px]"
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
            CREATE YOUR ACCOUNT
          </p>

          <div className="mt-[28px] space-y-[24px]">
            {/* Row 1: Name & Class */}
            <div className="flex gap-[16px]">
               <div className="flex-1">
                 <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                   FULL NAME
                 </label>
                 <input 
                    type="text" value={formData.name} 
                    onChange={e => {setFormData({...formData, name: e.target.value}); setErrors({...errors, name:null});}}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                    style={getInputStyle('name')}
                 />
                 {errors.name && <p className="text-[11px] mt-[4px] absolute" style={{ color: t.accentRed }}>{errors.name}</p>}
               </div>

               <div className="flex-1 relative">
                 <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                   CLASS
                 </label>
                 <div 
                    onClick={() => { setShowClassDropdown(!showClassDropdown); setFocusedField('std'); }}
                    className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300 cursor-pointer min-h-[41px]"
                    style={getInputStyle('std')}
                 >
                    {formData.std || <span style={{ color: t.textPlaceholder }}>Select Class</span>}
                 </div>
                 {errors.std && <p className="text-[11px] mt-[4px] absolute" style={{ color: t.accentRed }}>{errors.std}</p>}

                 <AnimatePresence>
                     {showClassDropdown && (
                       <motion.div 
                         initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5, transition: {duration: 0.1} }}
                         className="absolute top-[100%] left-0 w-full z-20 mt-[4px] py-[4px] rounded-[2px]"
                         style={{ background: t.surfaceHigh, backdropFilter: 'blur(20px)', border: `1px solid ${t.borderSubtle}` }}
                       >
                          {['Class 9', 'Class 10'].map(cls => (
                             <div 
                                key={cls}
                                onClick={() => { setFormData({...formData, std: cls}); setErrors({...errors, std:null}); setShowClassDropdown(false); setFocusedField(null); }}
                                className="px-[16px] py-[12px] cursor-pointer text-[13px] transition"
                                style={{ 
                                  color: formData.std === cls ? t.textPrimary : t.textSecondary,
                                  background: formData.std === cls ? t.navActiveBg : 'transparent'
                                }}
                                onMouseEnter={e => { if(formData.std !== cls) e.currentTarget.style.background = t.topicRowHover; }}
                                onMouseLeave={e => { if(formData.std !== cls) e.currentTarget.style.background = 'transparent'; }}
                             >
                                {cls}
                             </div>
                          ))}
                       </motion.div>
                    )}
                 </AnimatePresence>
               </div>
            </div>

            {/* Row 2: Email */}
            <div>
              <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                EMAIL
              </label>
              <input 
                 type="email" value={formData.email} 
                 onChange={e => {setFormData({...formData, email: e.target.value}); setErrors({...errors, email:null});}}
                 onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                 onKeyDown={handleKeyDown}
                 className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                 style={getInputStyle('email')}
              />
              {errors.email && <p className="text-[11px] mt-[4px] absolute" style={{ color: t.accentRed }}>{errors.email}</p>}
            </div>

            {/* Row 3: Passwords */}
            <div className="flex gap-[16px]">
               <div className="flex-1">
                 <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                   PASSWORD
                 </label>
                 <input 
                    type="password" value={formData.password} 
                    onChange={e => {setFormData({...formData, password: e.target.value}); setErrors({...errors, password:null});}}
                    onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                    style={getInputStyle('password')}
                 />
                 {errors.password && <p className="text-[11px] mt-[4px] absolute" style={{ color: t.accentRed }}>{errors.password}</p>}
               </div>
               <div className="flex-1">
                 <label className="block text-[9px] font-medium font-space tracking-[0.2em] uppercase mb-[8px]" style={{ color: t.textLabel }}>
                   CONFIRM PASSWORD
                 </label>
                 <input 
                    type="password" value={formData.confirm} 
                    onChange={e => {setFormData({...formData, confirm: e.target.value}); setErrors({...errors, confirm:null});}}
                    onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-0 py-[10px] text-[14px] font-inter outline-none transition-all duration-300"
                    style={getInputStyle('confirm')}
                 />
                 {errors.confirm && <p className="text-[11px] mt-[4px] absolute" style={{ color: t.accentRed }}>{errors.confirm}</p>}
               </div>
            </div>

            <button 
              onClick={handleRegister}
              className="mt-[36px] w-full h-[48px] font-space text-[12px] font-semibold tracking-[0.18em] uppercase border-none rounded-[2px] cursor-pointer transition-all duration-200"
              style={{ background: t.btnPrimaryBg, color: t.btnPrimaryText }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <div className="mt-[28px] text-center font-inter text-[12px]" style={{ color: t.textMuted }}>
            Already have an account?{' '}
            <span 
              onClick={() => navigate('/login')} 
              className="cursor-pointer transition-colors"
              style={{ color: t.navActive }}
            >
              Sign in
            </span>
          </div>



        </motion.div>
      </div>
    </div>
  );
}
