import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPIC_PDF_MAP, SUBJECT_COLORS } from '../data/topicPDFMap';
import { getStudent, saveStudent as saveStudentData, clearStudent, getProgress } from '../utils/storage';
import { isSupabaseEnabled } from '../utils/supabase';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import ThemeToggle from '../components/shared/ThemeToggle';


// ─── Topic data with subject classification ──────────────────────────────────
const CLASS9_TOPICS = [
  { id: 'Motion_9', name: 'Motion', subject: 'physics', color: '#00d4ff', icon: '🚀' },
  { id: 'Laws_of_Motion_9', name: 'Laws of Motion', subject: 'physics', color: '#00d4ff', icon: '⚡' },
  { id: 'Gravitation_9', name: 'Gravitation', subject: 'physics', color: '#00d4ff', icon: '🌍' },
  { id: 'Matter_9', name: 'Matter in Our Surroundings', subject: 'chemistry', color: '#ffdd4c', icon: '⚗️' },
  { id: 'Atoms_Molecules_9', name: 'Atoms and Molecules', subject: 'chemistry', color: '#ffdd4c', icon: '⚛️' },
  { id: 'Structure_Atoms_9', name: 'Structure of Atoms', subject: 'chemistry', color: '#ffdd4c', icon: '🔬' },
  { id: 'Cells_9', name: 'Fundamental Unit of Life', subject: 'biology', color: '#39ff14', icon: '🧬' },
  { id: 'Tissues_9', name: 'Tissues', subject: 'biology', color: '#39ff14', icon: '🌿' },
];

const CLASS10_TOPICS = [
  { id: 'Light_10', name: 'Light — Reflection & Refraction', subject: 'physics', color: '#00d4ff', icon: '💡' },
  { id: 'Human_Eye_10', name: 'Human Eye & Colourful World', subject: 'physics', color: '#00d4ff', icon: '👁️' },
  { id: 'Acids_10', name: 'Acids, Bases and Salts', subject: 'chemistry', color: '#ffdd4c', icon: '🧪' },
  { id: 'Carbon_10', name: 'Carbon and Its Compounds', subject: 'chemistry', color: '#ffdd4c', icon: '⚗️' },
  { id: 'Life_Processes_10', name: 'Life Processes', subject: 'biology', color: '#39ff14', icon: '🫀' },
  { id: 'Control_10', name: 'Control and Coordination', subject: 'biology', color: '#39ff14', icon: '🧠' },
];

const SUBJECT_LABELS = { physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology' };

// ─── Background decoration ────────────────────────────────────────────────────
function BgDecor({ t }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position:'absolute', top:0, right:0, width:500, height:500, background:t.orbTopRight, filter:'blur(120px)', borderRadius:'50%', transform:'translate(50%,-50%)' }} />
      <div style={{ position:'absolute', bottom:0, left:0, width:600, height:600, background:t.orbBottomLeft, filter:'blur(150px)', borderRadius:'50%', transform:'translate(-33%,33%)' }} />
      <div style={{ position:'absolute', top:'25%', left:40, width:96, height:96, border:`1px solid ${t.decorSquare1}`, transform:'rotate(45deg)' }} />
      <div style={{ position:'absolute', bottom:'25%', right:40, width:128, height:128, border:`1px solid ${t.decorSquare2}`, transform:'rotate(-12deg)' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(to right, ${t.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${t.gridLine} 1px, transparent 1px)`, backgroundSize:'40px 40px' }} />
    </div>
  );
}

// ─── Topic Selection Modal ─────────────────────────────────────────────────────
function TopicModal({ mode, student, progress, initialSubject, onClose, onSelect, t, isDark }) {
  const [activeSubj, setActiveSubj] = useState(initialSubject === 'all' ? 'physics' : initialSubject);
  const std = Number(student?.standard) || 9;
  const ALL_TOPICS = std === 10 ? CLASS10_TOPICS : CLASS9_TOPICS;
  
  const subjects = ['physics', 'chemistry', 'biology'];

  const modeLabels = { theory: '📖 SELECT A TOPIC FOR THEORY', simulation: '🧪 SELECT A TOPIC FOR SIMULATION', quiz: '🧠 SELECT A TOPIC FOR QUIZ' };
  const modeColors = { theory: t.accentPhysics, simulation: t.accentChemistry, quiz: t.accentBiology };
  const accent = modeColors[mode] || t.accentPhysics;

  const modalTopics = activeSubj === 'all'
    ? ALL_TOPICS
    : ALL_TOPICS.filter(t => t.subject === activeSubj);

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '80vh',
            background: isDark ? '#0d0d0d' : '#ffffff',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily:'Orbitron', fontSize:11, color: accent, letterSpacing:'0.15em' }}>{modeLabels[mode]}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                style={{ background:'none', border:'none', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', cursor:'pointer', fontSize:24, lineHeight:1 }}
              >×</button>
            </div>
            {/* Subject Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {['all', ...subjects].map(subj => (
                <button key={subj} onClick={() => setActiveSubj(subj)}
                  style={{
                    padding:'8px 16px', background: activeSubj === subj ? `${SUBJECT_COLORS[subj === 'all' ? 'physics' : subj].primary}22` : 'none', border:'none', cursor:'pointer', borderRadius: '4px',
                    fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em',
                    color: activeSubj === subj ? (subj === 'all' ? t.navActive : SUBJECT_COLORS[subj].primary) : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'),
                    transition:'all 0.2s'
                  }}
                >{subj}</button>
              ))}
            </div>
          </div>

          {/* Topic List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', paddingTop: '4px' }}>
              {modalTopics.map(topic => {
                const p = progress[topic.id];
                const sc = SUBJECT_COLORS[topic.subject];
                return (
                  <div key={topic.id} onClick={() => onSelect(topic.id, mode)}
                    style={{
                      padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border:`1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                      cursor:'pointer', borderRadius: '6px', transition:'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = sc.primary; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 18 }}>{topic.icon}</div>
                      <div>
                        <div style={{ fontFamily:'Inter', fontSize:13, color: isDark ? '#fff' : '#111', marginBottom:4 }}>{topic.name}</div>
                        <div style={{ fontFamily:'Space Grotesk', fontSize:9, color: sc?.primary || accent, letterSpacing:'0.1em', textTransform:'uppercase' }}>{topic.subject}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {p && <span style={{ fontFamily:'Orbitron', fontSize:11, color: p.lastScore >= 70 ? '#39ff14' : p.lastScore >= 40 ? '#ffdd4c' : '#ff6b6b' }}>{p.lastScore}%</span>}
                      <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize:14 }} onMouseEnter={e=>e.currentTarget.style.color=sc.primary} onMouseLeave={e=>e.currentTarget.style.color=isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isDark, toggleTheme } = useTheme();
  const t = getTheme(isDark);
  
  const [student, setStudent] = useState(null);
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('menu');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('theory');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showModules, setShowModules] = useState(false);

  // BUG FIX: Track if we've already animated in this session to prevent shift on refresh
  const hasAnimated = useRef(sessionStorage.getItem('sv_dash_animated') === 'true');

  useEffect(() => {
    const data = getStudent();
    setStudent(data);
    setReady(true);
    
    if (!hasAnimated.current) {
      sessionStorage.setItem('sv_dash_animated', 'true');
    }
  }, []);

  // Sync subject with URL search params
  useEffect(() => {
    const subj = searchParams.get('subject');
    if (subj && ['physics', 'chemistry', 'biology', 'all'].includes(subj)) {
      setSelectedSubject(subj);
    }
  }, [searchParams]);

  // BUG FIX: Topic modal and sidebar should close on navigation
  useEffect(() => {
    setShowModal(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  // Settings
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(90);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  // Edit profile
  const [editName, setEditName] = useState('');
  useEffect(() => {
    if (student?.name) setEditName(student.name);
  }, [student]);

  const [editClass, setEditClass] = useState(9);
  useEffect(() => {
    if (student?.standard) setEditClass(Number(student.standard));
  }, [student]);

  // Progress
  const progress = getProgress();
  const stdNum = Number(student?.standard) || 9;
  
  const ALL_TOPICS = stdNum === 10 ? CLASS10_TOPICS : CLASS9_TOPICS;
  const filteredTopics = selectedSubject === 'all'
    ? ALL_TOPICS
    : ALL_TOPICS.filter(t => t.subject === selectedSubject);

  const totalTopicsCount = ALL_TOPICS.length;
  const completedTopicsCount = ALL_TOPICS.filter(t => progress[t.id] !== undefined).length;
  
  const physicCount = ALL_TOPICS.filter(t => t.subject === 'physics').length;
  const chemCount = ALL_TOPICS.filter(t => t.subject === 'chemistry').length;
  const bioCount = ALL_TOPICS.filter(t => t.subject === 'biology').length;
  
  const subjectAccent = { all: '#00d4ff', physics: '#00d4ff', chemistry: '#ffdd4c', biology: '#39ff14' };
  const currentAccent = subjectAccent[selectedSubject];

  // Simulation Progress
  const completedSimsSet = new Set();
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sv_sim_complete_')) {
      ALL_TOPICS.forEach(topic => {
        if (key.startsWith(`sv_sim_complete_${topic.id}_`)) {
          completedSimsSet.add(topic.id);
        }
      });
    }
  });

  const topicsAttempted = Object.keys(progress).length;
  const avgScore = topicsAttempted > 0
    ? Math.round(Object.values(progress).reduce((a, b) => a + (b.lastScore || 0), 0) / topicsAttempted)
    : 0;
  const best = Object.entries(progress).sort((a, b) => (b[1].bestScore || 0) - (a[1].bestScore || 0))[0];
  const topicCount = ALL_TOPICS.length;
  const cachedCount = Object.keys(localStorage).filter(k => k.startsWith('sv_theory_')).length;

  // WEAKEST TOPICS LOGIC
  const attemptedTopics = ALL_TOPICS
    .filter(t => progress[t.id] !== undefined)
    .map(t => ({
      ...t,
      score: progress[t.id]?.lastScore || 0
    }));
  
  const weakestTopics = [...attemptedTopics]
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);
    
  const weakBySubject = {
    physics: weakestTopics.filter(t => t.subject === 'physics'),
    chemistry: weakestTopics.filter(t => t.subject === 'chemistry'),
    biology: weakestTopics.filter(t => t.subject === 'biology'),
  };

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : hour < 22 ? 'Good Evening' : 'Night Owl Mode';

  // Brightness effect
  useEffect(() => {
    document.body.style.filter = `brightness(${brightness / 100 * 0.4 + 0.7})`;
    return () => { document.body.style.filter = ''; };
  }, [brightness]);

  // Font size effect
  useEffect(() => {
    document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
  }, [fontSize]);

  // Keyboard shortcuts & Escape to close modal
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'Escape') { 
        setSidebarOpen(false); 
        setShowModal(false); 
      }
      if (e.key === '[') setSidebarOpen(true);
      if (e.key === 't' || e.key === 'T') { setModalMode('theory'); setShowModal(true); }
      if (e.key === 's' || e.key === 'S') { setModalMode('simulation'); setShowModal(true); }
      if (e.key === 'q' || e.key === 'Q') { setModalMode('quiz'); setShowModal(true); }
      if (e.key === 'p' || e.key === 'P') navigate('/progress');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const handleSaveProfile = () => {
    const updated = { ...student, name: editName, standard: parseInt(editClass) };
    saveStudentData(updated);
    setStudent(updated);
    setSaveMsg('Saved ✓');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handleLogout = () => { 
    clearStudent(); 
    // BUG FIX: use replace to prevent back-button returning to dashboard
    navigate('/login', { replace: true }); 
  };

  const handleTopicSelect = (topicId, mode) => {
    // BUG FIX: Navigate BEFORE closing modal to avoid state-sync issues
    navigate(`/topic/${topicId}/${mode}`);
    setShowModal(false);
  };

  const openModal = (mode) => { setModalMode(mode); setShowModal(true); };

  const subjColors = { all:'#00d4ff', physics:'#00d4ff', chemistry:'#ffdd4c', biology:'#39ff14' };

  // ─── Card Component ─────────────────────────────────────
  const ModuleCard = ({ mode, title, description, stats, cta, accentColor, ghostIcon, shortcut, delay }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <motion.div
        initial={hasAnimated.current ? { opacity:1, y:0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: hasAnimated.current ? 0 : delay, duration: 0.5, ease: 'easeOut' }}
        onClick={() => openModal(mode)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: t.surfaceCard,
          backdropFilter: 'blur(20px)',
          border: hovered ? `1px solid ${accentColor}` : `1px solid ${t.borderCard}`,
          borderRadius: 2,
          padding: '24px 28px',
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered ? `0 10px 30px -10px ${accentColor}44` : t.shadowCard,
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {/* Ghost Icon */}
        <div style={{ position:'absolute', top:16, right:16, fontSize:80, opacity: hovered ? 0.15 : 0.05, color: accentColor, transition:'opacity 0.4s', userSelect:'none' }}>{ghostIcon}</div>

        {/* Icon Box */}
        <div style={{
          width:56, height:56, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}33`,
          fontSize:24, transition:'all 0.3s',
          transform: hovered ? 'scale(1.1)' : 'scale(1)'
        }}>{ghostIcon}</div>

        <div style={{ fontFamily:'Orbitron', fontWeight:700, fontSize:18, color: accentColor, letterSpacing:'0.08em', marginTop:16, marginBottom:8 }}>{title}</div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:t.textSecondary, lineHeight:1.8, marginBottom:16 }}>{description}</div>
        <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>{stats}</div>

        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'Space Grotesk', fontSize:10, color: hovered ? accentColor : t.textMuted, letterSpacing:'0.2em', transition:'color 0.3s', fontWeight: 600 }}>
            {cta} →
          </div>
          <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, border:`1px solid ${t.borderSubtle}`, borderRadius:2, padding:'2px 6px' }}>[{shortcut}]</div>
        </div>
      </motion.div>
    );
  };

  // ─── Stat Card ─────────────────────────────────────────
  const StatCard = ({ label, value, accent, bar, barValue }) => (
    <div
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)', 
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
        padding:'20px 24px', borderRadius:2
      }}
    >
      <div style={{ fontFamily:'Space Grotesk', fontSize:9, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:'Orbitron', fontSize:28, color: accent || t.textPrimary, lineHeight:1 }}>{value}</div>
      {bar && (
        <div className="w-full h-[2px] mt-[12px]" style={{ background:t.progressTrack }}>
          <div style={{ height:'100%', width:`${Math.min(100, barValue || 0)}%`, background: accent, transition:'width 0.8s ease' }} />
        </div>
      )}
    </div>
  );

  // ─── Toggle component ──────────────────────────────────
  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width:40, height:22, cursor:'pointer', borderRadius:2, background: value ? t.toggleOn : t.toggleOff, position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:18, height:18, background: value ? t.toggleThumbOn : t.toggleThumbOff, borderRadius:2, position:'absolute', top:2, left: value ? 19 : 2, transition:'left 0.2s' }} />
    </div>
  );

  // ─── Sidebar Nav Item ──────────────────────────────────
  const NavItem = ({ icon, label, to, onClick, active }) => (
    <div
      onClick={() => { 
        setSidebarOpen(false); 
        if (onClick) onClick();
        else if (to) navigate(to); 
      }}
      style={{
        padding:'14px 32px', display:'flex', alignItems:'center', gap:16, cursor:'pointer',
        fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.15em',
        color: active ? currentAccent : t.navInactive,
        background: active ? `${currentAccent}10` : 'transparent',
        borderLeft: active ? `2px solid ${currentAccent}` : '2px solid transparent',
        transition:'all 0.2s'
      }}
      onMouseEnter={e => { if(!active) { e.currentTarget.style.color=t.textPrimary; e.currentTarget.style.background='rgba(255,255,255,0.02)'; } }}
      onMouseLeave={e => { if(!active) { e.currentTarget.style.color=t.navInactive; e.currentTarget.style.background='transparent'; } }}
    >
      <span className="material-symbols-outlined" style={{ fontSize:18 }}>{icon}</span>
      {label}
    </div>
  );

  const studentId = `${(student?.name || 'USR').slice(0,3).toUpperCase()}-${String(student?.joinedDate || Date.now()).slice(-4)}`;
  const subjectCount = 3;

  return (
    <div style={{ minHeight:'100vh', background:t.pageBg, color:t.textPrimary, position:'relative' }}>
      <BgDecor t={t} />

      {!ready ? null : (
        <>
          {/* ── Sidebar Backdrop ────────────────────────── */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                onClick={() => setSidebarOpen(false)}
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ position:'fixed', inset:0, background:t.overlayBg, backdropFilter:'blur(4px)', zIndex:55 }}
              />
            )}
          </AnimatePresence>

          {/* ── Sidebar ─────────────────────────────────── */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: sidebarOpen ? 0 : -280 }}
            transition={{ type:'spring', damping:28, stiffness:250 }}
            style={{
              position:'fixed', left:0, top:0, height:'100vh', width:280,
              background:t.surfaceSidebar, backdropFilter:'blur(24px)',
              borderRight:`1px solid ${t.borderSidebar}`,
              boxShadow: t.shadowSidebar,
              zIndex:60, display:'flex', flexDirection:'column', overflowY:'auto'
            }}
          >
            {/* Sidebar Header */}
            <div style={{ padding:'32px 32px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <span style={{ fontFamily:'Orbitron', fontSize:16, color:t.logoColor }}>Learnova</span>
                <button onClick={() => setSidebarOpen(false)} style={{ background:'none', border:'none', color:t.textSecondary, cursor:'pointer', fontSize:20, lineHeight:1 }} onMouseEnter={e=>e.target.style.color=t.textPrimary} onMouseLeave={e=>e.target.style.color=t.textSecondary}>×</button>
              </div>

              {/* Profile Card */}
              <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                <div style={{ width:52, height:52, background:`${currentAccent}15`, border:`1px solid ${currentAccent}44`, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron', fontSize:20, color:currentAccent, flexShrink:0 }}>
                  {(student?.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily:'Orbitron', fontSize:12, color:t.textPrimary, textTransform:'uppercase', letterSpacing:'0.08em' }}>{student?.name || 'Student'}</div>
                  <div style={{ fontFamily:'Space Grotesk', fontSize:10, color:t.textSecondary, marginTop:2 }}>Class {student?.standard || 9} Student</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:t.accentBiology }} />
                    <span style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.accentBiology }}>Active</span>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div style={{ marginTop:20 }}>
                {/* Clickable Header */}
                <div 
                  onClick={() => setShowModules(!showModules)}
                  style={{ 
                    display:'flex', 
                    justifyContent:'space-between', 
                    alignItems:'center',
                    padding: '12px 32px',
                    marginLeft: '-32px',
                    marginRight: '-32px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.15em' }}>Modules Completed</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontFamily:'Orbitron', fontSize:10, color:currentAccent }}>{completedTopicsCount}/{totalTopicsCount}</span>
                    <span style={{ 
                      fontSize: 8, 
                      color:t.textMuted, 
                      transform: showModules ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
                      display: 'inline-block'
                    }}>▼</span>
                  </div>
                </div>

                {/* Progress Bar (Persistent) */}
                <div style={{ height:2, background:t.progressTrack, marginBottom: 0 }}>
                  <div style={{ height:'100%', width:`${totalTopicsCount > 0 ? (completedTopicsCount/totalTopicsCount)*100 : 0}%`, background:currentAccent, boxShadow:`0 0 8px ${currentAccent}66`, transition:'width 0.5s ease' }} />
                </div>

                {/* Expandable Panel */}
                <AnimatePresence>
                  {showModules && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ 
                        overflow:'hidden', 
                        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                        borderTop: `1px solid ${t.borderSubtle}`,
                        paddingBottom: 8
                      }}
                    >
                      {['physics', 'chemistry', 'biology'].map(subj => {
                        const subjTopics = ALL_TOPICS.filter(t => t.subject === subj);
                        if (subjTopics.length === 0) return null;
                        
                        const subjColor = subj === 'physics' ? t.accentPhysics : subj === 'chemistry' ? t.accentChemistry : t.accentBiology;
                        const subjCompleted = subjTopics.filter(t => progress[t.id] !== undefined).length;
                        
                        return (
                          <div key={subj} style={{ marginBottom: 4 }}>
                            {/* Subject Header */}
                            <div style={{ display:'flex', justifyContent:'space-between', padding: '12px 32px 6px' }}>
                              <span style={{ fontFamily:'Space Grotesk', fontSize:9, color: subjColor, textTransform:'uppercase', letterSpacing:'0.2em' }}>
                                {subj === 'physics' ? '⚡' : subj === 'chemistry' ? '⚗️' : '🌿'} {subj}
                              </span>
                              <span style={{ fontFamily:'Orbitron', fontSize:10, color: subjColor }}>{subjCompleted}/{subjTopics.length}</span>
                            </div>

                            {/* Topic Rows */}
                            {subjTopics.map(topic => {
                              const isComp = progress[topic.id] !== undefined;
                              const score = progress[topic.id]?.lastScore;
                              const scoreColor = score >= 80 ? t.accentBiology : score >= 55 ? t.accentChemistry : t.accentRed;

                              return (
                                <div 
                                  key={topic.id} 
                                  onClick={(e) => { e.stopPropagation(); navigate(`/topic/${topic.id}/theory`); setShowModules(false); setSidebarOpen(false); }}
                                  style={{ 
                                    padding: '6px 32px 6px 44px', 
                                    display:'flex', 
                                    alignItems:'center', 
                                    gap: 10,
                                    cursor:'pointer',
                                    transition:'background 0.2s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  <span style={{ color: isComp ? t.accentBiology : t.textMuted, fontSize: 12 }}>{isComp ? '✓' : '○'}</span>
                                  <span style={{ 
                                    fontFamily:'Inter', 
                                    fontSize: 11, 
                                    color: isComp ? t.textPrimary : t.textMuted,
                                    flex: 1
                                  }}>
                                    {topic.name}
                                  </span>
                                  {isComp && (
                                    <span style={{ fontFamily:'Orbitron', fontSize:9, color: scoreColor }}>· {score}%</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div style={{ height:1, background:t.borderSubtle }} />

            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:`1px solid ${t.borderSubtle}` }}>
              {['menu','settings'].map(tb => (
                <button key={tb} onClick={() => setSidebarTab(tb)}
                  style={{
                    flex:1, padding:14, background: sidebarTab===tb ? `${currentAccent}10` : 'transparent',
                    border:'none', borderBottom: sidebarTab===tb ? `2px solid ${currentAccent}`:'2px solid transparent',
                    cursor:'pointer', fontFamily:'Space Grotesk', fontSize:9, textTransform:'uppercase',
                    letterSpacing:'0.2em', color: sidebarTab===tb ? currentAccent : t.navInactive, transition:'all 0.2s'
                  }}
                >{tb}</button>
              ))}
            </div>

            {/* Menu Tab */}
            {sidebarTab === 'menu' && (
              <div style={{ flex:1, overflowY:'auto' }}>
                <div style={{ padding:'16px 32px 8px', fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.2em' }}>Navigate</div>
                <NavItem icon="dashboard" label="Dashboard" onClick={() => navigate('/dashboard?subject=all')} active={selectedSubject === 'all'} />
                <NavItem icon="science" label="Physics Lab" onClick={() => navigate('/dashboard?subject=physics')} active={selectedSubject === 'physics'} />
                <NavItem icon="biotech" label="Chemistry Lab" onClick={() => navigate('/dashboard?subject=chemistry')} active={selectedSubject === 'chemistry'} />
                <NavItem icon="nature" label="Biology Lab" onClick={() => navigate('/dashboard?subject=biology')} active={selectedSubject === 'biology'} />
                <NavItem icon="insights" label="My Progress" to="/progress" />

                <div style={{ padding:'16px 32px 8px', fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.2em' }}>Quick Actions</div>
                <NavItem icon="quiz" label="Take a Quiz" onClick={() => openModal('quiz')} />
                <NavItem icon="menu_book" label="Read Theory" onClick={() => openModal('theory')} />
                <NavItem icon="science" label="Run Simulation" onClick={() => openModal('simulation')} />
              </div>
            )}

            {/* Settings Tab */}
            {sidebarTab === 'settings' && (
              <div style={{ flex:1, overflowY:'auto' }}>
                {/* Appearance */}
                <div style={{ padding:'16px 32px 8px', fontFamily:'Space Grotesk', fontSize:9, color:t.metricLabel, textTransform:'uppercase', letterSpacing:'0.2em' }}>Appearance</div>
                <ThemeToggle />
                <div style={{ height:1, background:t.borderSubtle, marginBottom:16 }} />

                {/* Profile */}
                <div style={{ padding:'0 32px 8px', fontFamily:'Space Grotesk', fontSize:9, color:t.metricLabel, textTransform:'uppercase', letterSpacing:'0.2em' }}>Profile</div>
                <div style={{ padding:'8px 32px 16px', display:'flex', flexDirection:'column', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textSecondary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Display Name</div>
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      style={{ width:'100%', background:'transparent', border:'none', borderBottom:`1px solid ${t.inputBorder}`, color:t.inputText, padding:'8px 0', fontFamily:'Inter', fontSize:13, outline:'none' }}
                      onFocus={e => e.target.style.borderBottomColor=currentAccent}
                      onBlur={e => e.target.style.borderBottomColor=t.inputBorder}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textSecondary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Class</div>
                    <select value={editClass} onChange={e => setEditClass(e.target.value)}
                      style={{ width:'100%', background:t.surfaceModal, border:'none', borderBottom:`1px solid ${t.inputBorder}`, color:t.inputText, padding:'8px 0', fontFamily:'Inter', fontSize:13, outline:'none', cursor:'pointer' }}
                    >
                      <option value={9}>Class 9</option>
                      <option value={10}>Class 10</option>
                    </select>
                  </div>
                  <button onClick={handleSaveProfile}
                    style={{ padding:'10px 0', background:currentAccent, color:'#000', fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', fontWeight:600, border:'none', borderRadius:2, cursor:'pointer', transition:'opacity 0.2s' }}
                    onMouseEnter={e=>e.target.style.opacity='0.85'} onMouseLeave={e=>e.target.style.opacity='1'}
                  >{saveMsg || 'Save Profile'}</button>
                </div>

                {/* Reset Section */}
                <div style={{ padding:'16px 32px 8px', fontFamily:'Space Grotesk', fontSize:9, color:t.metricLabel, textTransform:'uppercase', letterSpacing:'0.2em' }}>Data Management</div>
                <div style={{ padding:'8px 32px 16px' }}>
                  <button 
                    onClick={() => {
                      if(window.confirm('WARNING: This will clear all your progress, scores, and cached content. Proceed?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    style={{ width:'100%', padding:'8px', background:'transparent', border:`1px solid ${t.accentRed}44`, color:t.accentRed, fontFamily:'Space Grotesk', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', borderRadius:2 }}
                  >Clear All Data</button>
                </div>
              </div>
            )}

            {/* Sidebar Bottom */}
            <div style={{ marginTop:'auto', padding:'20px 32px', borderTop:`1px solid ${t.borderSubtle}` }}>
              <div
                onClick={handleLogout}
                style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', color:t.accentRed, fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.2em', cursor:'pointer', transition:'opacity 0.2' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='0.7'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}
              >
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>logout</span>
                Logout
              </div>
              <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.3em', marginTop:12 }}>Learnova v1.0.0 — Build 2026</div>
            </div>
          </motion.div>

          {/* ── Top Navbar ───────────────────────────────── */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{
              position:'fixed', top:0, left:0, right:0, height:64, zIndex:50,
              background:t.surfaceNavbar, backdropFilter:'blur(20px)',
              borderBottom:`1px solid ${t.borderNavbar}`,
              boxShadow:t.shadowNavbar,
              display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px'
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <button onClick={() => setSidebarOpen(true)}
                style={{ background:'none', border:'none', color:currentAccent, cursor:'pointer', padding:8, borderRadius:2, fontSize:18, lineHeight:1, transition:'background 0.2s' }}
                onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.05)'}
                onMouseLeave={e=>e.target.style.background='transparent'}
              >☰</button>
              <span style={{ fontFamily:'Orbitron', fontWeight:700, fontSize:20, color:t.logoColor, letterSpacing:'0.08em' }}>Learnova</span>
            </div>

            <div style={{ display:'flex', gap:24, alignItems:'center' }} className="hidden md:flex">
              {[{l:'Dashboard',to:'/dashboard?subject=all'},{l:'My Progress',to:'/progress'}].map(n=>(
                <span key={n.l} onClick={() => navigate(n.to)} style={{ 
                  fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.15em', 
                  color: (n.l === 'Dashboard') ? currentAccent : t.navInactive, 
                  cursor:'pointer', fontWeight: 600, transition:'color 0.2s' 
                }}
                  onMouseEnter={e=>{e.currentTarget.style.color=currentAccent}}
                  onMouseLeave={e=>{if(n.l !== 'Dashboard') e.currentTarget.style.color=t.navInactive}}
                >{n.l}</span>
              ))}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 9,
                fontFamily: 'Space Grotesk',
                color: isSupabaseEnabled ? 'rgba(57,255,20,0.6)' : 'rgba(255,221,76,0.6)',
                letterSpacing: '0.1em',
                marginRight: 8
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSupabaseEnabled ? '#39ff14' : '#ffdd4c' }}/>
                {isSupabaseEnabled ? 'CLOUD SYNC' : 'LOCAL ONLY'}
              </div>

              <button onClick={() => setSidebarOpen(true)}
                style={{
                  width:36, height:36, borderRadius:'50%', border:`1px solid ${currentAccent}44`,
                  background:`${currentAccent}11`, display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', fontFamily:'Orbitron', fontSize:14, color:currentAccent
                }}
              >
                {(student?.name || 'U')[0].toUpperCase()}
              </button>
            </div>
          </motion.div>

          {/* ── Main Content ─────────────────────────────── */}
          <div style={{ position:'relative', zIndex:10, paddingTop:96, paddingBottom:64, paddingLeft:'max(24px, 5vw)', paddingRight:'max(24px, 5vw)', display:'flex', flexDirection:'column', alignItems:'center' }}>

            {/* Welcome Header */}
            <motion.div
              initial={hasAnimated.current ? { opacity:1, y:0 } : { opacity:0, y:30 }} 
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.2 }}
              style={{ textAlign:'center', marginBottom:28, maxWidth:600, width:'100%' }}
            >
              <div style={{ fontFamily:'Space Grotesk', fontWeight:300, fontSize:14, color:t.textMuted, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:12 }}>
                {greeting}, {student?.name || 'Student'}.
              </div>
              <h1 style={{ fontFamily:'Orbitron', fontWeight:700, fontSize:'clamp(28px,5vw,48px)', color:t.textPrimary, letterSpacing:'0.06em', lineHeight:1.1, margin:0 }}>
                RESEARCH PORTAL
              </h1>
              <p style={{ fontFamily:'Space Grotesk', fontSize:15, color:t.textSecondary, letterSpacing:'0.05em', marginTop:16 }}>
                Class {String(student?.standard || 9).replace(/[^0-9]/g,'')||9} — {subjectCount} subjects · {topicCount} topics ready to explore
              </p>
            </motion.div>

            {/* Subject Pills */}
            <motion.div
              initial={hasAnimated.current ? { opacity:1, y:0 } : { opacity:0, y:20 }} 
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35, duration:0.5 }}
              style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', justifyContent:'center' }}
            >
              {[{k:'all',l:'ALL'},{k:'physics',l:'PHYSICS'},{k:'chemistry',l:'CHEMISTRY'},{k:'biology',l:'BIOLOGY'}].map(({k,l}) => {
                const c = k === 'all' ? t.navActive : SUBJECT_COLORS[k].primary;
                const active = selectedSubject === k;
                return (
                  <button key={k} onClick={() => navigate(`/dashboard?subject=${k}`)}
                    style={{
                      padding:'6px 20px', borderRadius:2, cursor:'pointer', fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', transition:'all 0.2s', border:'none', outline:'none',
                      background: active ? `${c}15` : 'transparent',
                      borderWidth:1, borderStyle:'solid',
                      borderColor: active ? `${c}66` : t.borderSubtle,
                      color: active ? c : t.textMuted,
                      boxShadow: active ? `0 0 12px ${c}22` : 'none'
                    }}
                  >{l}</button>
                );
              })}
            </motion.div>

            {/* Three Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:24, width:'100%', maxWidth:1100 }}>
              <ModuleCard mode="theory" title="THEORY" accentColor={t.accentPhysics} ghostIcon="📖"
                description="Deep-dive into NCERT concepts. Every subtopic explained with examples, graphs, and key formulas."
                stats={`${totalTopicsCount} topics available · ${completedTopicsCount} completed`}
                cta="ACCESS LIBRARY" shortcut="T" delay={0.45}
              />
              <ModuleCard mode="simulation" title="SIMULATION" accentColor={t.accentChemistry} ghostIcon="🧪"
                description="Run virtual experiments. Adjust variables in real-time and watch physics and chemistry unfold."
                stats={`${totalTopicsCount} experiments available`}
                cta="LAUNCH ENGINE" shortcut="S" delay={0.55}
              />
              <ModuleCard mode="quiz" title="QUIZ" accentColor={t.accentBiology} ghostIcon="🧠"
                description="Test your knowledge with questions from your NCERT chapters. Get instant explanations."
                stats={avgScore > 0 ? `Avg score: ${avgScore}%` : 'No quizzes taken yet'}
                cta="START EVALUATION" shortcut="Q" delay={0.65}
              />
            </div>

            {/* Progress Stats */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
              style={{ marginTop:64, width:'100%', maxWidth:1100 }}
            >
              <div style={{ fontFamily:'Space Grotesk', fontSize:9, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.45)', textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:24 }}>YOUR PROGRESS</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
                <StatCard label="Topics Explored" value={completedTopicsCount} accent={t.accentPhysics} />
                <StatCard label="Avg Quiz Score" value={avgScore > 0 ? `${avgScore}%` : '—'}
                  accent={avgScore >= 80 ? t.accentBiology : avgScore >= 50 ? t.accentChemistry : t.accentRed}
                  bar barValue={avgScore}
                />
                <StatCard label="Best Performance"
                  value={best ? best[1].bestScore + '%' : '—'}
                  accent={t.accentChemistry}
                />
                <StatCard label="Study Streak" value={completedTopicsCount > 0 ? '1 day' : 'Start today!'} accent={t.accentRed} />
              </div>

              {/* WEAKEST TOPICS PANEL */}
              {attemptedTopics.length === 0 ? (
                <div style={{
                  marginTop: 24,
                  padding: '16px 20px',
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 4,
                  textAlign: 'center'
                }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    INSUFFICIENT DATA VECTORS FOR ANALYSIS
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: isDark ? '#ff6b6b' : '#cc2200', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#ff6b6b' : '#cc2200', display: 'inline-block' }}/>
                    NEEDS IMPROVEMENT
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <SubjectWeakPanel subject="physics" label="⚡ PHYSICS" color="#00d4ff" topics={weakBySubject.physics} allTopics={ALL_TOPICS.filter(t=>t.subject==='physics')} progress={progress} navigate={navigate} isDark={isDark} />
                    <SubjectWeakPanel subject="chemistry" label="⚗️ CHEMISTRY" color="#ffdd4c" topics={weakBySubject.chemistry} allTopics={ALL_TOPICS.filter(t=>t.subject==='chemistry')} progress={progress} navigate={navigate} isDark={isDark} />
                    <SubjectWeakPanel subject="biology" label="🌿 BIOLOGY" color="#39ff14" topics={weakBySubject.biology} allTopics={ALL_TOPICS.filter(t=>t.subject==='biology')} progress={progress} navigate={navigate} isDark={isDark} />
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'flex-end' }}>
                    {[
                      {color:'#39ff14', label:'Strong (≥70%)'},
                      {color:'#ffdd4c', label:'Average (50-69%)'},
                      {color:'#ff6b6b', label:'Weak (<50%)'},
                    ].map(item => (
                      <div key={item.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background: item.color, flexShrink:0 }}/>
                        <span style={{ fontFamily:'Space Grotesk', fontSize:8, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)', letterSpacing:'0.05em' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Metrics Row */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.95 }}
              style={{ marginTop:48, paddingTop:32, borderTop:`1px solid ${t.metricBorder}`, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', width:'100%', maxWidth:1100, gap:24 }}
            >
              {[
                { label:'System Status', value:'ACTIVE', accent: isDark ? '#00d4ff' : '#007799' },
                { label:'Topics Available', value: topicCount, accent: isDark ? '#ffffff' : '#111111' },
                { label:'Content Ready', value:'100%', accent: isDark ? '#39ff14' : '#227700' },
                { label:'Student ID', value: studentId, accent: isDark ? '#ffffff' : '#111111' }
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontFamily:'Space Grotesk', fontSize:10, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>{m.label}</div>
                  <div style={{ fontFamily:'Orbitron', fontSize:16, color:m.accent, letterSpacing:'0.05em' }}>{m.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Recent Activity */}
            {topicsAttempted > 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }}
                style={{ marginTop:48, width:'100%', maxWidth:1100 }}
              >
                <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.metricLabel, textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:16 }}>RECENT ACTIVITY</div>
                <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8 }}>
                  {Object.entries(progress).slice(0,5).map(([id, p]) => {
                    const topicData = TOPIC_PDF_MAP[id];
                    if (!topicData) return null;
                    const sc = SUBJECT_COLORS[topicData.subject];
                    return (
                      <div key={id} onClick={() => navigate(`/topic/${id}/quiz`)}
                        style={{ minWidth:200, flexShrink:0, background:t.surfaceCard, border:`1px solid ${t.borderCard}`, padding:16, borderRadius:2, cursor:'pointer', transition:'border-color 0.2s' }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=t.borderCardHover}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=t.borderCard}
                      >
                        <div style={{ fontFamily:'Orbitron', fontSize:11, color:t.textPrimary, marginBottom:6 }}>{topicData.name}</div>
                        <div style={{ fontFamily:'Space Grotesk', fontSize:9, color: sc.primary, marginBottom:8 }}>{topicData.subject.toUpperCase()}</div>
                        <div style={{ fontFamily:'Orbitron', fontSize:16, color: sc.primary }}>{p.lastScore}%</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {showModal && (
            <TopicModal
              mode={modalMode}
              student={student}
              progress={progress}
              initialSubject={selectedSubject}
              t={t}
              isDark={isDark}
              onClose={() => setShowModal(false)}
              onSelect={handleTopicSelect}
            />
          )}
        </>
      )}
    </div>
  );
}

function SubjectWeakPanel({ subject, label, color, topics, allTopics, progress, navigate, isDark }) {
  const attempted = allTopics.filter(t => progress[t.id] !== undefined);
  const notAttempted = allTopics.filter(t => progress[t.id] === undefined);
  
  const avgScore = attempted.length > 0
    ? Math.round(attempted.reduce((sum, t) => sum + (progress[t.id]?.lastScore || 0), 0) / attempted.length)
    : null;
  
  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
      border: `1px solid rgba(${subject==='physics' ? '0,212,255' : subject==='chemistry' ? '255,221,76' : '57,255,20'},0.12)`,
      borderRadius: 4, padding: '14px 16px', minHeight: 140
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {label}
        </span>
        {avgScore !== null && (
          <span style={{ fontFamily: 'Orbitron', fontSize: 11, color: avgScore >= 70 ? '#39ff14' : avgScore >= 50 ? '#ffdd4c' : '#ff6b6b', fontWeight: 700 }}>
            {avgScore}%
          </span>
        )}
      </div>
      
      {attempted.length === 0 ? (
        <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', paddingTop: 8 }}>
          No quizzes taken yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {attempted
            .sort((a,b) => (progress[a.id]?.lastScore || 0) - (progress[b.id]?.lastScore || 0))
            .map(topic => {
              const score = progress[topic.id]?.lastScore || 0;
              const scoreColor = score >= 70 ? '#39ff14' : score >= 50 ? '#ffdd4c' : '#ff6b6b';
              return (
                <div key={topic.id} onClick={() => navigate(`/topic/${topic.id}/quiz`)}
                  style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 2, background: score < 50 ? (isDark ? 'rgba(255,107,107,0.05)' : 'rgba(204,34,0,0.05)') : 'transparent', border: score < 50 ? (isDark ? '1px solid rgba(255,107,107,0.15)' : '1px solid rgba(204,34,0,0.15)') : '1px solid transparent', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? `rgba(${subject==='physics' ? '0,212,255' : subject==='chemistry' ? '255,221,76' : '57,255,20'},0.06)` : 'rgba(0,0,0,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = score < 50 ? (isDark ? 'rgba(255,107,107,0.05)' : 'rgba(204,34,0,0.05)') : 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, color: isDark ? 'rgba(255,255,255,0.7)' : '#222222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {topic.name}
                    </span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: 10, color: scoreColor, fontWeight: 700, flexShrink: 0 }}>
                      {score}%
                    </span>
                  </div>
                  <div style={{ height: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: 1, transition: 'width 0.5s ease' }}/>
                  </div>
                  {score < 50 && (
                    <div style={{ marginTop: 4, fontFamily: 'Space Grotesk', fontSize: 8, color: isDark ? '#ff6b6b' : '#cc2200', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      ↺ Retry quiz
                    </div>
                  )}
                </div>
              )
            })
          }
          {notAttempted.map(topic => (
            <div key={topic.id} onClick={() => navigate(`/topic/${topic.id}/quiz`)}
              style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 2, opacity: 0.4, transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity='0.7'; e.currentTarget.style.background = isDark ? `rgba(${subject==='physics' ? '0,212,255' : subject==='chemistry' ? '255,221,76' : '57,255,20'},0.06)` : 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity='0.4'; e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 10, color: isDark ? 'rgba(255,255,255,0.5)' : '#666666' }}>{topic.name}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 8, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>Not attempted</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
