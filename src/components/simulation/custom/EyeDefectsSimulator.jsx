import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EyeDefectsSimulator({ isDark, accentColor }) {
  const [mode, setMode] = useState('normal'); // 'normal', 'myopia', 'hypermetropia'
  const [isCorrected, setIsCorrected] = useState(false);

  const eyeColor = isDark ? '#333' : '#ddd';
  const rayColor = '#fcd34d';
  const retinaColor = '#ef4444';

  // Ray paths based on mode
  const getFocalPoint = () => {
    if (mode === 'normal') return 300; // Exact on retina
    if (mode === 'myopia') return isCorrected ? 300 : 250; // In front of retina
    if (mode === 'hypermetropia') return isCorrected ? 300 : 350; // Behind retina
    return 300;
  };

  const focusX = getFocalPoint();

  return (
    <div style={{ padding:40, width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background: isDark ? '#080808' : '#fff' }}>
      
      {/* Controls Overlay */}
      <div style={{ marginBottom:40, display:'flex', gap:10 }}>
        {['Normal', 'Myopia', 'Hypermetropia'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m.toLowerCase()); setIsCorrected(false); }}
            style={{
              padding:'8px 16px', borderRadius:2, border:`1px solid ${mode === m.toLowerCase() ? accentColor : 'rgba(128,128,128,0.2)'}`,
              background: mode === m.toLowerCase() ? `${accentColor}20` : 'transparent',
              color: mode === m.toLowerCase() ? accentColor : (isDark ? '#666' : '#888'),
              cursor:'pointer', fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{ position:'relative', width:600, height:400 }}>
        <svg width="600" height="400" viewBox="0 0 600 400">
          {/* Sclera (Eye Body) */}
          <circle cx="300" cy="200" r="100" fill="none" stroke={eyeColor} strokeWidth="4" />
          
          {/* Cornea */}
          <path d="M220 140 Q180 200 220 260" fill="none" stroke={eyeColor} strokeWidth="4" />
          
          {/* Retina Highlight */}
          <path d="M380 140 Q400 200 380 260" fill="none" stroke={retinaColor} strokeWidth={mode !== 'normal' && !isCorrected ? 2 : 1} opacity={0.6} />

          {/* Light Rays */}
          <g>
            {/* Top Ray */}
            <motion.path 
              animate={{ d: `M 50 160 L 205 160 L ${focusX} 200 L 400 ${200 + (focusX === 300 ? 0 : focusX < 300 ? 40 : -40)}` }}
              fill="none" stroke={rayColor} strokeWidth="2" strokeDasharray="5,3"
            />
            {/* Bottom Ray */}
            <motion.path 
              animate={{ d: `M 50 240 L 205 240 L ${focusX} 200 L 400 ${200 + (focusX === 300 ? 0 : focusX < 300 ? -40 : 40)}` }}
              fill="none" stroke={rayColor} strokeWidth="2" strokeDasharray="5,3"
            />
          </g>

          {/* Crystalline Lens */}
          <ellipse cx="210" cy="200" rx="10" ry="30" fill={isDark ? '#1a1a1a' : '#f0f0f0'} stroke={eyeColor} strokeWidth="2" />

          {/* Corrective Lens */}
          {isCorrected && (
            <motion.g initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
              {mode === 'myopia' ? (
                /* Concave */
                <path d="M150 160 Q165 200 150 240 L160 240 Q145 200 160 160 Z" fill={accentColor + '40'} stroke={accentColor} strokeWidth="1" />
              ) : (
                /* Convex */
                <path d="M155 160 Q175 200 155 240 Q135 200 155 160" fill={accentColor + '40'} stroke={accentColor} strokeWidth="1" />
              )}
            </motion.g>
          )}

          {/* Labels */}
          <text x="300" y="330" textAnchor="middle" fill={isDark ? '#444' : '#ccc'} fontSize="10" fontFamily="Space Grotesk">RETINA</text>
          <text x={focusX} y="190" textAnchor="middle" fill={accentColor} fontSize="10" fontFamily="Space Grotesk">FOCAL POINT</text>
        </svg>

        {/* Info Panel */}
        <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', textAlign:'center', width:'100%' }}>
            <h4 style={{ fontFamily:'Orbitron', fontSize:14, color:accentColor, margin:'0 0 8px' }}>
                {mode.toUpperCase()} {isCorrected ? '(CORRECTED)' : ''}
            </h4>
            <p style={{ fontFamily:'Inter', fontSize:12, color:isDark ? '#666' : '#888', maxWidth:400, margin:'0 auto' }}>
                {mode === 'normal' && "In a normal eye, light rays focus exactly on the retina, creating a sharp image."}
                {mode === 'myopia' && !isCorrected && "Short-sightedness: The eyeball is too long or cornea too curved, so light focuses in front of the retina."}
                {mode === 'hypermetropia' && !isCorrected && "Long-sightedness: The eyeball is too short, so light focuses behind the retina."}
                {isCorrected && `Using a ${mode === 'myopia' ? 'CONCAVE' : 'CONVEX'} lens to redirect light rays onto the retina.`}
            </p>
            
            {mode !== 'normal' && (
              <button
                onClick={() => setIsCorrected(!isCorrected)}
                style={{
                  marginTop:20, padding:'10px 24px', background:accentColor, color:'#000', border:'none', borderRadius:2,
                  fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', fontWeight:600, cursor:'pointer'
                }}
              >
                {isCorrected ? 'Remove Lens' : 'Apply Corrective Lens'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
