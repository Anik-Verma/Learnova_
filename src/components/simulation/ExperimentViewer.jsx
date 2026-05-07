import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme } from '../../utils/theme';

// Import custom components
import CellOrganelleExplorer from './custom/CellOrganelleExplorer';
import EyeDefectsSimulator from './custom/EyeDefectsSimulator';
import NeuronSignalSim from './custom/NeuronSignalSim';
import CirculationSimulator from './custom/CirculationSimulator';
import HormoneExplorer from './custom/HormoneExplorer';
import MicroscopeLab from './custom/MicroscopeLab';
import PhotosynthesisSim from './custom/PhotosynthesisSim';

const CUSTOM_COMPONENTS = {
  CellOrganelleExplorer,
  EyeDefectsSimulator,
  NeuronSignalSim,
  CirculationSimulator,
  HormoneExplorer,
  VirtualMicroscope: MicroscopeLab,
  PhotosynthesisSim
};

export default function ExperimentViewer({ experiment, topicId, accentColor, onClose, isDark }) {
  const t = getTheme(isDark);
  
  // Simulation State
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Guide & Notes State
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' or 'notes'
  const [showPanel, setShowPanel] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [notes, setNotes] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  const loadTimer = useRef(null);

  // Load persistence
  useEffect(() => {
    // Load notes
    const savedNotes = localStorage.getItem(`sv_sim_notes_${topicId}_${experiment.id}`);
    if (savedNotes) setNotes(savedNotes);

    // Load progress
    const savedProgress = localStorage.getItem(`sv_sim_complete_${topicId}_${experiment.id}`);
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        setCompletedSteps(Array.from({ length: experiment.guidedSteps.length }, (_, i) => i));
        setCurrentStep(experiment.guidedSteps.length - 1);
      } catch(e) {}
    }

    // Set timeout for iframe load
    if (experiment.type === 'iframe') {
      loadTimer.current = setTimeout(() => {
        if (!iframeLoaded) {
          setIframeError(true);
        }
      }, 15000); // 15s timeout
    }

    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, [experiment.id, topicId]);

  const handleSaveNotes = () => {
    localStorage.setItem(`sv_sim_notes_${topicId}_${experiment.id}`, notes);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleCompleteStep = (stepIdx) => {
    if (!completedSteps.includes(stepIdx)) {
      const newCompleted = [...completedSteps, stepIdx];
      setCompletedSteps(newCompleted);
      
      if (stepIdx < experiment.guidedSteps.length - 1) {
        setCurrentStep(stepIdx + 1);
      } else {
        // All steps done
        localStorage.setItem(`sv_sim_complete_${topicId}_${experiment.id}`, JSON.stringify({
          completedAt: new Date().toISOString(),
          notes: notes
        }));
      }
    }
  };

  const allStepsDone = completedSteps.length === experiment.guidedSteps.length;

  // Custom Component Loader
  const CustomSim = experiment.type === 'custom' ? CUSTOM_COMPONENTS[experiment.component] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position:'fixed', inset:0, zIndex:1000, background:t.bgBase,
        display:'flex', flexDirection:'column', overflow:'hidden'
      }}
    >
      {/* Top Bar */}
      <div style={{ 
        height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 20px', background:t.navbarBg, borderBottom:`1px solid ${t.borderNavbar}`,
        backdropFilter:'blur(20px)', flexShrink:0
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button 
            onClick={onClose}
            style={{ background:'none', border:'none', color:t.textSecondary, cursor:'pointer', fontSize:20 }}
          >
            ←
          </button>
          <div style={{ fontFamily:'Orbitron', fontSize:14, color:t.textPrimary, letterSpacing:'0.05em' }}>
            {experiment.title}
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button 
            onClick={() => setShowPanel(!showPanel)}
            style={{ 
              padding:'6px 14px', borderRadius:2, fontSize:10, fontFamily:'Space Grotesk', textTransform:'uppercase', cursor:'pointer',
              background: showPanel ? accentColor : 'transparent',
              color: showPanel ? '#000' : t.textSecondary,
              border: `1px solid ${showPanel ? accentColor : t.borderCard}`
            }}
          >
            {showPanel ? 'Hide Controls' : 'Show Controls'}
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{ 
              padding:'6px 14px', borderRadius:2, fontSize:10, fontFamily:'Space Grotesk', textTransform:'uppercase', cursor:'pointer',
              background: 'transparent', color: t.textSecondary, border: `1px solid ${t.borderCard}`
            }}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* Left Panel: Simulation */}
        <div style={{ 
          flex:1, position:'relative', background:'#000', 
          display:'flex', alignItems:'center', justifyContent:'center' 
        }}>
          {experiment.type === 'iframe' && (
            <div style={{ width:'100%', height:'100%' }}>
              {!iframeLoaded && !iframeError && (
                <div style={{ 
                  position:'absolute', inset:0, zIndex:10, background:t.bgBase, 
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' 
                }}>
                  <div style={{ 
                    width:40, height:40, border:`3px solid ${accentColor}20`, borderTopColor:accentColor, 
                    borderRadius:'50%', animation:'spin 1s linear infinite' 
                  }} />
                  <p style={{ marginTop:20, fontFamily:'Orbitron', fontSize:12, color:accentColor }}>Loading Science Lab...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}
              
              {iframeError ? (
                <div style={{ 
                  padding:40, textAlign:'center', maxWidth:500, margin:'0 auto',
                  background:t.bgBase, borderRadius:2, border:`1px solid ${t.borderCard}`
                }}>
                  <div style={{ fontSize:48, marginBottom:20 }}>⚠️</div>
                  <h3 style={{ fontFamily:'Orbitron', color:accentColor, marginBottom:16 }}>SIMULATION BLOCKED</h3>
                  <p style={{ fontFamily:'Inter', color:t.textSecondary, fontSize:14, lineHeight:1.6, marginBottom:24 }}>
                    Your browser security settings or a network restriction prevented this simulation from embedding directly.
                  </p>
                  <button 
                    onClick={() => window.open(experiment.url, '_blank')}
                    style={{ 
                      padding:'12px 24px', background:accentColor, color:'#000', border:'none', 
                      borderRadius:2, cursor:'pointer', fontFamily:'Space Grotesk', fontSize:11, 
                      textTransform:'uppercase', fontWeight:600
                    }}
                  >
                    Open in New Tab →
                  </button>
                </div>
              ) : (
                <iframe 
                  src={experiment.url}
                  style={{ width:'100%', height:'100%', border:'none' }}
                  allow="fullscreen"
                  onLoad={() => { setIframeLoaded(true); if(loadTimer.current) clearTimeout(loadTimer.current); }}
                />
              )}
            </div>
          )}

          {experiment.type === 'custom' && CustomSim && (
            <CustomSim 
              isDark={isDark} 
              accentColor={accentColor} 
              mode={experiment.props?.mode || 'cells'} 
            />
          )}

          {/* Floating HUD when panel hidden */}
          {!showPanel && (
            <div style={{ 
              position:'absolute', top:20, right:20, display:'flex', gap:8,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              padding:8, borderRadius:4, border:'1px solid rgba(255,255,255,0.1)'
            }}>
               <button onClick={() => {setShowPanel(true); setActiveTab('guide');}} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:10, fontFamily:'Space Grotesk' }}>GUIDE</button>
               <span style={{ color:'rgba(255,255,255,0.2)' }}>|</span>
               <button onClick={() => {setShowPanel(true); setActiveTab('notes');}} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:10, fontFamily:'Space Grotesk' }}>NOTES</button>
            </div>
          )}

          {/* PhET Attribution Tag */}
          {experiment.url?.includes('sims/') && (
            <div style={{
              position: 'absolute',
              bottom: 4,
              right: 8,
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              fontFamily: 'Inter',
              zIndex: 5,
              pointerEvents: 'none'
            }}>
              Powered by PhET Interactive Simulations — University of Colorado Boulder
            </div>
          )}
        </div>

        {/* Right Panel: Guide & Notes */}
        <AnimatePresence>
          {showPanel && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 340 }}
              exit={{ width: 0 }}
              style={{ 
                background:t.sidebarBg, borderLeft:`1px solid ${t.borderNavbar}`,
                display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0
              }}
            >
              {/* Tabs */}
              <div style={{ display:'flex', borderBottom:`1px solid ${t.borderNavbar}`, flexShrink:0 }}>
                {['guide', 'notes'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1, padding:'16px 0', border:'none', background:'none', cursor:'pointer',
                      fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em',
                      color: activeTab === tab ? accentColor : t.textMuted,
                      position: 'relative'
                    }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab" 
                        style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:accentColor }} 
                      />
                    )}
                  </button>
                ))}
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                {activeTab === 'guide' ? (
                  <div>
                    {/* Goals Header */}
                    <div 
                      onClick={() => setShowGoals(!showGoals)}
                      style={{ 
                        padding:'12px 14px', background:t.surfaceCard, border:`1px solid ${t.borderCard}`,
                        borderRadius:2, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer',
                        marginBottom:24
                      }}
                    >
                      <span style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textSecondary, textTransform:'uppercase', letterSpacing:'0.1em' }}>Learning Goals</span>
                      <span style={{ transform: showGoals ? 'rotate(180deg)' : 'none', color:t.textMuted, fontSize:10 }}>▼</span>
                    </div>
                    
                    <AnimatePresence>
                      {showGoals && (
                        <motion.div 
                          initial={{ height:0, opacity:0 }}
                          animate={{ height:'auto', opacity:1 }}
                          exit={{ height:0, opacity:0 }}
                          style={{ overflow:'hidden', marginBottom:24, padding:'0 14px' }}
                        >
                          {experiment.learningGoals.map((goal, i) => (
                            <div key={i} style={{ display:'flex', gap:10, fontSize:12, color:t.textSecondary, marginBottom:10, lineHeight:1.5 }}>
                              <span style={{ color:accentColor }}>{i+1}.</span>
                              <span>{goal}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Steps Wrapper */}
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {experiment.guidedSteps.map((step, idx) => {
                        const isCompleted = completedSteps.includes(idx);
                        const isActive = currentStep === idx && !allStepsDone;
                        
                        return (
                          <div
                            key={idx}
                            style={{
                              padding:'16px', borderRadius:2, borderLeft:`3px solid transparent`,
                              background: isActive ? `${accentColor}10` : isCompleted ? '#39ff1408' : t.surfaceCard,
                              borderLeftColor: isActive ? accentColor : isCompleted ? '#39ff1440' : 'transparent',
                              opacity: (isActive || isCompleted || idx === currentStep) ? 1 : 0.4,
                              transition:'all 0.3s'
                            }}
                          >
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ 
                                  width:18, height:18, borderRadius:'50%', background: isCompleted ? '#39ff14' : isActive ? accentColor : t.borderCard,
                                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#000', fontWeight:700
                                }}>
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span style={{ fontFamily:'Orbitron', fontSize:11, color: isCompleted ? '#39ff14' : t.textPrimary, letterSpacing:'0.03em' }}>{step.title}</span>
                              </div>
                            </div>

                            {(isActive || idx === currentStep) && (
                              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                                <p style={{ fontSize:13, color:t.textSecondary, lineHeight:1.6, margin:0 }}>{step.instruction}</p>
                                <div style={{ marginTop:12, padding:'8px 10px', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', borderRadius:2, fontSize:11, color:t.textMuted, fontStyle:'italic' }}>
                                  ✋ {step.checkPoint}
                                </div>
                                {!isCompleted && (
                                  <button
                                    onClick={() => handleCompleteStep(idx)}
                                    style={{ 
                                      marginTop:16, width:'100%', padding:'10px', background:'none', border:`1px solid ${accentColor}40`,
                                      color:accentColor, cursor:'pointer', fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase',
                                      borderRadius:2, transition:'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = `${accentColor}15`}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                  >
                                    Mark Step Complete
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {allStepsDone && (
                      <motion.div 
                        initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
                        style={{ marginTop:24, padding:20, background:`#39ff1410`, border:`1px solid #39ff1430`, borderRadius:2, textAlign:'center' }}
                      >
                        <div style={{ fontSize:32, marginBottom:10 }}>🎉</div>
                        <h4 style={{ fontFamily:'Orbitron', color:'#39ff14', margin:0, fontSize:14 }}>Lab Complete!</h4>
                        <p style={{ fontSize:12, color:t.textSecondary, margin:'8px 0 16px' }}>Don't forget to record your finale observations in the notes tab.</p>
                        <button 
                          onClick={() => setActiveTab('notes')}
                          style={{ padding:'8px 16px', background:'#39ff14', color:'#000', border:'none', borderRadius:2, fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase', fontWeight:700, cursor:'pointer' }}
                        >
                          Go to Notes →
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                    <div>
                      <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:12 }}>Observation Template</div>
                      <div style={{ 
                        padding:'14px', background:t.surfaceCard, border:`1px dashed ${t.borderCard}`, color:t.textMuted, 
                        fontSize:12, fontFamily:'Inter', fontStyle:'italic', whiteSpace:'pre-wrap' 
                      }}>
                        {experiment.observationTemplate}
                      </div>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
                       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                        <div style={{ fontFamily:'Space Grotesk', fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.2em' }}>Your Notes</div>
                        <div style={{ fontSize:9, color:t.textMuted, fontFamily:'Space Grotesk' }}>{notes.trim().split(/\s+/).filter(x => x).length} words</div>
                       </div>
                       <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your findings here..."
                        style={{ 
                          width:'100%', minHeight:300, background:t.surfaceCard, border:`1px solid ${t.borderCard}`,
                          borderRadius:2, padding:14, color:t.textPrimary, fontFamily:'Inter', fontSize:14, lineHeight:1.6,
                          outline:'none', resize:'vertical', transition:'border-color 0.2s'
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = accentColor}
                        onBlur={e => e.currentTarget.style.borderColor = t.borderCard}
                       />
                    </div>

                    <button
                      onClick={handleSaveNotes}
                      disabled={savedStatus}
                      style={{ 
                        width:'100%', padding:'14px', background: savedStatus ? '#39ff14' : accentColor, 
                        color: '#000', border:'none', borderRadius:2, cursor:'pointer', 
                        fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', fontWeight:700,
                        transition:'all 0.3s'
                      }}
                    >
                      {savedStatus ? '✓ Saved Successfully' : 'Save Observations'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
