import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CirculationSimulator({ isDark, accentColor }) {
  const [pulse, setPulse] = useState(1); // Heart rate speed
  const [showLabels, setShowLabels] = useState(true);

  const bgColor = isDark ? '#080808' : '#fff';
  const deoxygenated = '#00d4ff'; // Blue
  const oxygenated = '#ef4444'; // Red

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:bgColor }}>
      
      {/* Control Panel */}
      <div style={{ padding:20, borderBottom:`1px solid ${isDark ? '#222' : '#eee'}`, display:'flex', gap:32, alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:9, fontFamily:'Space Grotesk', color:'#555' }}>HEART RATE</span>
          <input 
            type="range" min="0.5" max="3" step="0.1" value={pulse} 
            onChange={e => setPulse(parseFloat(e.target.value))}
            style={{ width:120, accentColor:oxygenated }}
          />
        </div>
        
        <button
          onClick={() => setShowLabels(!showLabels)}
          style={{
            padding:'6px 16px', borderRadius:2, border:`1px solid ${showLabels ? accentColor : 'rgba(128,128,128,0.2)'}`,
            background: showLabels ? `${accentColor}10` : 'transparent',
            color: showLabels ? accentColor : (isDark ? '#666' : '#888'),
            cursor:'pointer', fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase'
          }}
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>

        <div style={{ display:'flex', gap:16, marginLeft:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:oxygenated }} />
            <span style={{ fontSize:10, color:isDark ? '#aaa' : '#666', fontFamily:'Space Grotesk' }}>OXYGENATED</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:deoxygenated }} />
            <span style={{ fontSize:10, color:isDark ? '#aaa' : '#666', fontFamily:'Space Grotesk' }}>DEOXYGENATED</span>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        <svg width="600" height="400" viewBox="0 0 600 400">
          {/* Heart Body Outline */}
          <ellipse cx="300" cy="220" rx="100" ry="120" fill={isDark ? '#111' : '#f9f9f9'} stroke={isDark ? '#333' : '#ddd'} strokeWidth="2" />
          
          {/* Septum */}
          <line x1="300" y1="100" x2="300" y2="340" stroke={isDark ? '#222' : '#eee'} strokeWidth="4" />

          {/* Chambers */}
          <g style={{ opacity: showLabels ? 1 : 0.4 }}>
            {/* Right Atrium & Ventricle */}
            <text x="250" y="160" textAnchor="middle" fill={deoxygenated} fontSize="10" fontFamily="Orbitron">RA</text>
            <text x="250" y="280" textAnchor="middle" fill={deoxygenated} fontSize="10" fontFamily="Orbitron">RV</text>
            
            {/* Left Atrium & Ventricle */}
            <text x="350" y="160" textAnchor="middle" fill={oxygenated} fontSize="10" fontFamily="Orbitron">LA</text>
            <text x="350" y="280" textAnchor="middle" fill={oxygenated} fontSize="10" fontFamily="Orbitron">LV</text>
          </g>

          {/* Blood Flow Animation Paths */}
          {/* Deoxygenated: Body -> RV -> Lungs */}
          <path id="deox_path" d="M100 350 Q150 350 250 280 Q300 150 300 50" fill="none" strokeWidth="0" />
          <motion.circle r="4" fill={deoxygenated}>
            <animateMotion dur={`${4/pulse}s`} repeatCount="indefinite">
              <mpath xlinkHref="#deox_path" />
            </animateMotion>
          </motion.circle>
          <motion.circle r="4" fill={deoxygenated} opacity={0.6}>
            <animateMotion dur={`${4/pulse}s`} begin="2s" repeatCount="indefinite">
              <mpath xlinkHref="#deox_path" />
            </animateMotion>
          </motion.circle>

          {/* Oxygenated: Lungs -> LV -> Body */}
          <path id="ox_path" d="M300 50 Q300 150 350 280 Q450 350 500 350" fill="none" strokeWidth="0" />
          <motion.circle r="4" fill={oxygenated}>
            <animateMotion dur={`${4/pulse}s`} repeatCount="indefinite">
              <mpath xlinkHref="#ox_path" />
            </animateMotion>
          </motion.circle>
          <motion.circle r="4" fill={oxygenated} opacity={0.6}>
            <animateMotion dur={`${4/pulse}s`} begin="2s" repeatCount="indefinite">
              <mpath xlinkHref="#ox_path" />
            </animateMotion>
          </motion.circle>

          {/* Nodes for visualization */}
          <rect x="250" y="40" width="100" height="30" rx="4" fill={isDark ? '#222' : '#f0f0f0'} stroke={accentColor} strokeWidth="1" strokeDasharray="2,2" />
          <text x="300" y="60" textAnchor="middle" fill={isDark ? '#666' : '#888'} fontSize="9" fontFamily="Space Grotesk">LUNGS (Gas Exchange)</text>

          <rect x="200" y="340" width="200" height="30" rx="4" fill={isDark ? '#222' : '#f0f0f0'} stroke={accentColor} strokeWidth="1" strokeDasharray="2,2" />
          <text x="300" y="360" textAnchor="middle" fill={isDark ? '#666' : '#888'} fontSize="9" fontFamily="Space Grotesk">BODY TISSUES</text>
        </svg>

        {/* Legend Overlay */}
        <div style={{ position:'absolute', bottom:20, width:'100%', textAlign:'center' }}>
          <h4 style={{ fontFamily:'Orbitron', fontSize:12, color:oxygenated, margin:'0 0 6px' }}>DOUBLE CIRCULATION</h4>
          <p style={{ fontFamily:'Inter', fontSize:11, color:isDark ? '#666' : '#888', maxWidth:450, margin:'0 auto' }}>
             Blood passes through the heart twice in one complete circuit. Once for the pulmonary loop (lungs) and once for the systemic loop (body).
          </p>
        </div>
      </div>
    </div>
  );
}
