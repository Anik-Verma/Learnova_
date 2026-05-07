import React, { useState, useEffect, useRef } from 'react';
// Trigger HMR re-index for ghost dependencies
import { motion, AnimatePresence } from 'framer-motion';
import { SPECIMEN_DATA } from './specimenData';
import * as Renderers from './MicroscopeRenderers';

const THUMBNAIL_WIDTH = 48;
const THUMBNAIL_HEIGHT = 36;
const VIEWPORT_SIZE = 320;

export default function VirtualMicroscope({ isDark, accentColor, mode = 'cells' }) {
  // --- State ---
  const [selectedSlide, setSelectedSlide] = useState(mode === 'cells' ? 'onion_peel' : 'epithelial');
  const [magnification, setMagnification] = useState(100); // 40, 100, 400 (Total Magnification)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [coarseFocus, setCoarseFocus] = useState(5); // Starts out of focus
  const [fineFocus, setFineFocus] = useState(2);
  const [lightValue, setLightValue] = useState(70);
  const [isChangingSlide, setIsChangingSlide] = useState(false);
  const [activeCategory, setActiveCategory] = useState(mode === 'cells' ? 'plant' : 'animal');
  
  const canvasRef = useRef(null);
  const panTimer = useRef(null);

  const t = {
    bg: isDark ? '#0a0a0a' : '#f0f2f5',
    panel: isDark ? '#111' : '#fff',
    controlPanel: isDark ? '#161616' : '#e8e8e8',
    border: isDark ? '#222' : '#e2e8f0',
    textPrimary: isDark ? '#fff' : '#000',
    textSecondary: isDark ? '#999' : '#64748b',
    microscopeBody: isDark ? '#1a1a1a' : '#cccccc',
    microscopeHighlight: isDark ? '#2a2a2a' : '#e0e0e0',
  };

  // --- Effects ---
  useEffect(() => {
    setSelectedSlide(mode === 'cells' ? 'onion_peel' : 'epithelial');
    setActiveCategory(mode === 'cells' ? 'plant' : 'animal');
    setMagnification(40);
    setPan({ x: 0, y: 0 });
    setCoarseFocus(5);
  }, [mode]);

  useEffect(() => {
    renderMainCanvas();
  }, [selectedSlide, magnification, pan, coarseFocus, fineFocus, lightValue, isDark]);

  // --- Rendering Logic ---
  const renderMainCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    // Select renderer
    switch (selectedSlide) {
      case 'onion_peel': Renderers.drawOnionPeel(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'cheek_cells': Renderers.drawCheekCells(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'elodea': Renderers.drawElodeaCells(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'cork_cells': Renderers.drawCorkCells(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'epithelial': Renderers.drawEpithelial(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'muscular': Renderers.drawMuscular(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'connective': Renderers.drawConnective(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'nervous': Renderers.drawNervous(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'xylem': Renderers.drawXylem(ctx, width, height, magnification, pan.x, pan.y); break;
      case 'phloem': Renderers.drawPhloem(ctx, width, height, magnification, pan.x, pan.y); break;
      default: break;
    }

    // Apply Light Intensity overlay
    if (lightValue < 70) {
      ctx.fillStyle = `rgba(0,0,0,${(70 - lightValue) / 100})`;
      ctx.fillRect(0, 0, width, height);
    } else if (lightValue > 70) {
      ctx.fillStyle = `rgba(255,255,255,${(lightValue - 70) / 200})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Renderers.applyVignette is now called internally by each specimen renderer
  };

  // --- Handlers ---
  const handleSlideChange = (id) => {
    setIsChangingSlide(true);
    setTimeout(() => {
      setSelectedSlide(id);
      setCoarseFocus(5);
      setPan({ x: 0, y: 0 });
      setIsChangingSlide(false);
    }, 400);
  };

  const handlePan = (dx, dy) => {
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const startPan = (dx, dy) => {
    if (panTimer.current) cancelAnimationFrame(panTimer.current);
    
    const animate = () => {
      handlePan(dx / 5, dy / 5); // Smooth per-frame movement
      panTimer.current = requestAnimationFrame(animate);
    };
    panTimer.current = requestAnimationFrame(animate);
  };

  const stopPan = () => {
    if (panTimer.current) {
      cancelAnimationFrame(panTimer.current);
      panTimer.current = null;
    }
  };

  const totalBlur = Math.abs(coarseFocus * 0.8 + fineFocus * 0.4);

  // --- Sub-components ---
  const SlideThumbnail = ({ id }) => {
    const thumbRef = useRef(null);
    useEffect(() => {
      const canvas = thumbRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        Renderers.drawThumbnail(id, ctx, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
      }
    }, [id]);

    return (
      <canvas 
        ref={thumbRef} 
        width={THUMBNAIL_WIDTH} 
        height={THUMBNAIL_HEIGHT} 
        style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}
      />
    );
  };

  const MicroscopeIllustration = () => (
    <svg width="220" height="240" viewBox="0 0 220 240" style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', opacity: 0.8, pointerEvents: 'none' }}>
      {/* Base */}
      <path d="M40,220 L180,220 L160,200 L60,200 Z" fill={t.microscopeBody} />
      {/* Arm */}
      <rect x="150" y="60" width="30" height="140" fill={t.microscopeBody} />
      {/* Stage */}
      <rect x="40" y="140" width="140" height="10" fill={t.microscopeHighlight} />
      {/* Nosepiece */}
      <circle cx="100" cy="100" r="25" fill={t.microscopeBody} />
      {/* Body Tube */}
      <rect x="90" y="30" width="20" height="70" fill={t.microscopeBody} />
      {/* Eyepiece */}
      <rect x="85" y="10" width="30" height="20" fill={t.microscopeHighlight} />
      {/* Knobs */}
      <circle cx="165" cy="160" r="15" fill={t.microscopeHighlight} stroke={t.border} strokeWidth="2" />
      <circle cx="165" cy="185" r="8" fill={t.microscopeHighlight} stroke={t.border} strokeWidth="1" />
    </svg>
  );

  const specimenList = Object.entries(SPECIMEN_DATA).filter(([_, data]) => {
     if (mode === 'cells') return ['onion_peel', 'cheek_cells', 'elodea', 'cork_cells'].includes(_);
     return data.category === activeCategory;
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* LEFT SECTION - MICROSCOPE & VIEWPORT */}
        <div style={{ flex: '0 0 45%', minWidth: 400, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: 20 }}>
          <div style={{ position: 'relative', height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MicroscopeIllustration />
            
            <div style={{
              width: VIEWPORT_SIZE,
              height: VIEWPORT_SIZE,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `18px solid ${isDark ? '#1a1a1a' : '#888'}`,
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.5)',
              position: 'relative',
              background: '#000',
              zIndex: 2
            }}>
              <canvas 
                ref={canvasRef} 
                width={VIEWPORT_SIZE} 
                height={VIEWPORT_SIZE} 
                style={{ 
                  width: '100%', height: '100%', 
                  filter: `blur(${totalBlur}px)`,
                  opacity: isChangingSlide ? 0 : 1,
                  transition: 'opacity 0.4s ease-in-out'
                }} 
              />
              <AnimatePresence>
                {isChangingSlide && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, fontFamily: 'Space Grotesk' }}
                  >
                    LOADING SLIDE...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Mag Display Floating */}
            <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: 'Orbitron', fontSize: 24, color: isDark ? '#fff' : '#000', opacity: 0.6 }}>
               {magnification}x
            </div>
          </div>

          {/* CONTROLS PANEL */}
          <div style={{ background: t.controlPanel, borderRadius: 2, padding: 20, marginTop: 10 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: accentColor, textTransform: 'uppercase', marginBottom: 15, letterSpacing: '0.1em' }}>Objective Lenses</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {[40, 100, 400].map(magValue => {
                   const label = magValue === 40 ? '4X' : magValue === 100 ? '10X' : '40X';
                   const isActive = magnification === magValue;
                   return (
                     <button
                        key={magValue}
                        onClick={() => {
                          setMagnification(magValue);
                          setIsChangingSlide(true);
                          setTimeout(() => setIsChangingSlide(false), 600);
                        }}
                        style={{
                          width: 52, height: 52, borderRadius: '50%', border: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
                          background: isActive ? accentColor : isDark ? '#2a2a2a' : '#ccc',
                          color: isActive ? '#003642' : isDark ? '#888' : '#555',
                          fontFamily: 'Orbitron', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          boxShadow: isActive ? `0 0 15px ${accentColor}50` : 'none',
                          transition: 'all 0.2s'
                        }}
                     >
                       {label}
                     </button>
                   );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Sliders */}
                {[
                  { label: 'Coarse Focus', val: coarseFocus, set: setCoarseFocus, min: -10, max: 10 },
                  { label: 'Fine Focus', val: fineFocus, set: setFineFocus, min: -5, max: 5 },
                  { label: 'Light Adjust', val: lightValue, set: setLightValue, min: 0, max: 100 }
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: isDark ? '#666' : '#94a3b8', textTransform: 'uppercase' }}>{s.label}</span>
                      <span style={{ fontSize: 9, color: accentColor, fontFamily: 'Orbitron' }}>{s.val}</span>
                    </div>
                    <input 
                      type="range" min={s.min} max={s.max} step={s.label === 'Fine Focus' ? '0.1' : '1'} value={s.val} 
                      onChange={(e) => s.set(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor, appearance: 'none', height: 4, background: isDark ? '#222' : '#ddd', borderRadius: 2 }} 
                    />
                  </div>
                ))}
              </div>

              {/* Stage PAN */}
              <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: isDark ? '#666' : '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>Stage Pan</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 34px)', gap: 4 }}>
                  <div />
                  <button onMouseDown={() => startPan(0, 10)} onMouseUp={stopPan} onMouseLeave={stopPan} style={{ width: 34, height: 34, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${t.border}`, borderRadius: 2, cursor: 'pointer', color: '#888' }}>↑</button>
                  <div />
                  <button onMouseDown={() => startPan(10, 0)} onMouseUp={stopPan} onMouseLeave={stopPan} style={{ width: 34, height: 34, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${t.border}`, borderRadius: 2, cursor: 'pointer', color: '#888' }}>←</button>
                  <button onClick={() => setPan({x:0,y:0})} style={{ width: 34, height: 34, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${t.border}`, borderRadius: 2, cursor: 'pointer', color: accentColor }}>•</button>
                  <button onMouseDown={() => startPan(-10, 0)} onMouseUp={stopPan} onMouseLeave={stopPan} style={{ width: 34, height: 34, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${t.border}`, borderRadius: 2, cursor: 'pointer', color: '#888' }}>→</button>
                  <div />
                  <button onMouseDown={() => startPan(0, -10)} onMouseUp={stopPan} onMouseLeave={stopPan} style={{ width: 34, height: 34, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${t.border}`, borderRadius: 2, cursor: 'pointer', color: '#888' }}>↓</button>
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER SECTION - SLIDE CATALOG */}
        <div style={{ flex: '0 0 55%', borderLeft: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: 25 }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: accentColor, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Slide Catalog</div>
            
            {mode === 'tissues' && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {['plant', 'animal'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', background: 'none',
                      borderBottom: `2px solid ${activeCategory === cat ? accentColor : 'transparent'}`,
                      color: activeCategory === cat ? accentColor : t.textSecondary,
                      fontFamily: 'Space Grotesk', fontSize: 10, textTransform: 'uppercase', cursor: 'pointer'
                    }}
                  >
                    {cat} Tissues
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {specimenList.map(([id, data]) => {
                const isActive = selectedSlide === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleSlideChange(id)}
                    style={{
                      padding: 12, borderRadius: 2, border: 'none', textAlign: 'left', cursor: 'pointer',
                      background: isActive ? `${accentColor}12` : isDark ? '#1a1a1a' : '#fff',
                      borderLeft: `3px solid ${isActive ? accentColor : 'transparent'}`,
                      display: 'flex', gap: 15, alignItems: 'center', transition: 'all 0.2s'
                    }}
                  >
                    <SlideThumbnail id={id} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: isActive ? accentColor : t.textPrimary, fontWeight: 600, fontFamily: 'Inter' }}>{data.name.split(' (')[0]}</div>
                      <div style={{ fontSize: 9, color: `${accentColor}b3`, fontFamily: 'Space Grotesk', textTransform: 'uppercase', marginTop: 2 }}>{data.stain}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 30, padding: 20, background: isDark ? '#111' : '#f8f8f8', borderRadius: 2, border: `1px solid ${t.border}` }}>
               <div style={{ fontFamily: 'Orbitron', fontSize: 13, color: accentColor, marginBottom: 10 }}>{SPECIMEN_DATA[selectedSlide].name}</div>
               <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>{SPECIMEN_DATA[selectedSlide].description}</p>
               
               <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: isDark ? '#555' : '#999', textTransform: 'uppercase', marginBottom: 10 }}>What to look for:</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                 {SPECIMEN_DATA[selectedSlide].lookFor.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 11, color: isDark ? '#ccc' : '#444' }}>
                       <div style={{ width: 4, height: 4, background: accentColor, borderRadius: '50%', marginTop: 6 }} />
                       {p}
                    </div>
                 ))}
               </div>

               <div style={{ fontSize: 10, color: accentColor, fontFamily: 'Space Grotesk', textTransform: 'uppercase', marginTop: 20 }}>
                  AT {magnification}X: {SPECIMEN_DATA[selectedSlide].magnificationNotes[magnification]}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
