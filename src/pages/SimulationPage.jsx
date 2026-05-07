import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import { getSimulationsForTopic, SUBJECT_ACCENT } from '../data/simulationData';
import ExperimentViewer from '../components/simulation/ExperimentViewer';

export default function SimulationPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showExperiment, setShowExperiment] = useState(false);
  
  const simData = getSimulationsForTopic(topicId);
  const accentColor = simData ? SUBJECT_ACCENT[simData.subject] : '#00d4ff';

  // Handle back button from viewer
  const handleCloseExperiment = () => {
    setShowExperiment(false);
    setTimeout(() => setSelectedExperiment(null), 300);
  };

  if (!simData) {
    return (
      <div style={{ minHeight:'100vh', background:t.pageBg, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ padding:40, background:t.surfaceCard, border:`1px solid ${t.borderCard}`, borderRadius:2, textAlign:'center', maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:20 }}>🔬</div>
          <h2 style={{ fontFamily:'Orbitron', color:accentColor, marginBottom:12 }}>COMING SOON</h2>
          <p style={{ fontFamily:'Inter', color:t.textSecondary, fontSize:14, lineHeight:1.6 }}>
            We're currently preparing high-fidelity simulations for this topic. Check back soon for interactive labs!
          </p>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop:24, padding:'10px 24px', background:t.btnPrimaryBg, color:t.btnPrimaryText, border:'none', borderRadius:2, cursor:'pointer', fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:t.pageBg, color:t.textPrimary, position:'relative' }}>
      {/* Simulation Viewer Overlay */}
      <AnimatePresence>
        {showExperiment && selectedExperiment && (
          <ExperimentViewer 
            experiment={selectedExperiment}
            topicId={topicId}
            accentColor={accentColor}
            onClose={handleCloseExperiment}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      <div style={{ padding:'32px 24px 64px', maxWidth:1100, margin:'0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom:48 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:t.textSecondary, cursor:'pointer', display:'flex', alignItems:'center', gap:8, marginBottom:24, fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            <span>←</span> Back to Dashboard
          </button>
          
          <div style={{ display:'inline-block', padding:'4px 12px', background:`color-mix(in srgb, ${accentColor} 10%, transparent)`, border:`1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`, borderRadius:2, color:accentColor, fontSize:10, fontFamily:'Space Grotesk', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:16 }}>
            {simData.subject}
          </div>
          
          <h1 style={{ fontFamily:'Orbitron', fontSize:'clamp(24px, 5vw, 36px)', color:t.textPrimary, margin:0, letterSpacing:'0.05em' }}>
            {simData.topicName} Simulations
          </h1>
          <p style={{ fontFamily:'Space Grotesk', fontSize:14, color:t.textSecondary, marginTop:12 }}>
            {simData.experiments.length} Interactive experiment{simData.experiments.length !== 1 ? 's' : ''} available 
          </p>
        </header>

        {/* Experiment Cards Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:24 }}>
          {simData.experiments.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => { setSelectedExperiment(exp); setShowExperiment(true); }}
              style={{
                background: t.surfaceCard,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${t.borderCard}`,
                borderRadius: 2,
                padding: '24px 28px',
                display: 'flex', flexDirection: 'column',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
              }}
              whileHover={{ scale:1.02, borderColor:accentColor, boxShadow: `0 10px 30px rgba(0,0,0,0.2)` }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div style={{ width:48, height:48, borderRadius:2, background:`color-mix(in srgb, ${accentColor} 8%, transparent)`, border:`1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
                  {exp.type === 'iframe' ? '🔬' : '⚗️'}
                </div>
                <div style={{ 
                  padding:'4px 10px', borderRadius:2, fontSize:9, fontFamily:'Space Grotesk', textTransform:'uppercase', letterSpacing:'0.1em',
                  background: exp.difficulty === 'Easy' ? '#39ff1420' : exp.difficulty === 'Medium' ? '#ffdd4c20' : '#ff444420',
                  color: exp.difficulty === 'Easy' ? '#39ff14' : exp.difficulty === 'Medium' ? '#ffdd4c' : '#ff4444',
                  border: `1px solid ${exp.difficulty === 'Easy' ? '#39ff1440' : exp.difficulty === 'Medium' ? '#ffdd4c40' : '#ff444440'}`
                }}>
                  {exp.difficulty}
                </div>
              </div>

              <h3 style={{ fontFamily:'Orbitron', fontSize:18, color:accentColor, marginBottom:12, letterSpacing:'0.05em' }}>{exp.title}</h3>
              <p style={{ fontFamily:'Inter', fontSize:13, color:t.textSecondary, lineHeight:1.6, marginBottom:20 }}>{exp.description}</p>
              
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Learning Goals</div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {exp.learningGoals.slice(0, 3).map((goal, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:11, fontFamily:'Inter', color:t.textMuted }}>
                      <span style={{ color:accentColor, marginTop:2 }}>•</span>
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Space Grotesk', fontSize:10, color:t.textMuted }}>
                  <span>⏱</span> {exp.duration}
                </div>
                <div style={{ fontFamily:'Space Grotesk', fontSize:11, color:accentColor, textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:600 }}>
                  Start Experiment →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
