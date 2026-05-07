import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GLANDS = {
  pituitary: {
    name: 'Pituitary Gland',
    location: 'Brain',
    hormone: 'Growth Hormone',
    function: 'Regulates growth and controls other endocrine glands. "The Master Gland".',
    target: 'Whole Body',
    pos: { x: 250, y: 80 }
  },
  thyroid: {
    name: 'Thyroid Gland',
    location: 'Neck',
    hormone: 'Thyroxine',
    function: 'Regulates metabolism and heart rate.',
    target: 'All Cells',
    pos: { x: 250, y: 130 }
  },
  pancreas: {
    name: 'Pancreas',
    location: 'Abdomen',
    hormone: 'Insulin/Glucagon',
    function: 'Maintains blood sugar levels.',
    target: 'Liver & Muscle',
    pos: { x: 240, y: 220 }
  },
  adrenal: {
    name: 'Adrenal Glands',
    location: 'Above Kidneys',
    hormone: 'Adrenaline',
    function: 'Prepares body for "Fight or Flight" response.',
    target: 'Heart & Lungs',
    pos: { x: 220, y: 200 }
  },
  ovaries: {
    name: 'Ovaries/Testes',
    location: 'Pelvic Region',
    hormone: 'Estrogen/Testosterone',
    function: 'Controls secondary sexual characteristics.',
    target: 'Reproductive Organs',
    pos: { x: 250, y: 300 }
  }
};

export default function HormoneExplorer({ isDark, accentColor }) {
  const [selected, setSelected] = useState(null);
  const [showStress, setShowStress] = useState(false);

  const bodyColor = isDark ? '#1a1a1a' : '#f0f0f0';
  const glowColor = accentColor;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: isDark ? '#080808' : '#fff' }}>
      
      {/* Left Side: Body Diagram */}
      <div style={{ flex:1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="400" height="400" viewBox="0 0 500 500">
          {/* Human Outline */}
          <path 
            d="M250 50 Q280 50 280 80 Q280 110 250 110 Q220 110 220 80 Q220 50 250 50 M250 110 L250 350 M250 150 L180 250 M250 150 L320 250 M250 350 L200 450 M250 350 L300 450" 
            fill="none" stroke={bodyColor} strokeWidth="20" strokeLinecap="round"
          />

          {/* Adrenaline Animation */}
          <AnimatePresence>
            {showStress && (
              <motion.circle 
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 200, opacity: 0.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                cx="250" cy="200" fill={accentColor}
              />
            )}
          </AnimatePresence>

          {/* Gland Hotspots */}
          {Object.entries(GLANDS).map(([key, gland]) => (
            <g key={key} style={{ cursor:'pointer' }} onClick={() => setSelected(gland)}>
              <motion.circle
                cx={gland.pos.x} cy={gland.pos.y} r="6"
                fill={glowColor}
                animate={{ r: selected?.name === gland.name ? 10 : 8, opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
              />
              <circle cx={gland.pos.x} cy={gland.pos.y} r="15" fill="transparent" />
            </g>
          ))}
        </svg>

        <div style={{ position:'absolute', bottom:20, right:20 }}>
            <button
               onClick={() => { setShowStress(!showStress); if(!showStress) setSelected(GLANDS.adrenal); }}
               style={{
                 padding:'12px 20px', background: showStress ? '#ff4444' : accentColor, color:'#000',
                 border:'none', borderRadius:2, fontFamily:'Space Grotesk', fontSize:10, textTransform:'uppercase',
                 fontWeight:700, cursor:'pointer', boxShadow: showStress ? '0 0 20px #ff444460' : 'none'
               }}
            >
              {showStress ? '🛑 Stop Stress' : '⚡ Trigger Stress Response'}
            </button>
        </div>
      </div>

      {/* Right Side: Information Panel */}
      <div style={{ width:340, padding:40, borderLeft:`1px solid ${isDark ? '#222' : '#eee'}`, display:'flex', flexDirection:'column' }}>
        <h2 style={{ fontFamily:'Orbitron', fontSize:14, color:accentColor, marginBottom:32, letterSpacing:'0.1em' }}>ENDOCRINE SYSTEM</h2>
        
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.name}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-10 }}
            >
              <div style={{ padding:'4px 12px', background:`${accentColor}15`, color:accentColor, fontSize:10, fontFamily:'Space Grotesk', textTransform:'uppercase', display:'inline-block', marginBottom:16 }}>
                Loc: {selected.location}
              </div>
              <h3 style={{ fontFamily:'Orbitron', fontSize:20, color:isDark ? '#fff' : '#000', margin:'0 0 8px' }}>{selected.name}</h3>
              <p style={{ fontFamily:'Space Grotesk', fontSize:11, color:accentColor, marginBottom:24, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                 Hormone: {selected.hormone}
              </p>

              <div style={{ marginBottom:32 }}>
                <span style={{ fontSize:9, color:isDark ? '#444' : '#999', textTransform:'uppercase', fontFamily:'Space Grotesk', display:'block', marginBottom:8 }}>Function</span>
                <p style={{ fontFamily:'Inter', fontSize:13, color:isDark ? '#aaa' : '#555', lineHeight:1.6, margin:0 }}>
                  {selected.function}
                </p>
              </div>

              <div style={{ padding:20, background:isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', borderRadius:2, border:`1px solid ${isDark ? '#222' : '#eee'}` }}>
                <span style={{ fontSize:9, color:accentColor, textTransform:'uppercase', fontFamily:'Space Grotesk', display:'block', marginBottom:8 }}>Primary Target</span>
                <span style={{ fontFamily:'Orbitron', fontSize:12, color:isDark ? '#fff' : '#000' }}>{selected.target}</span>
              </div>
            </motion.div>
          ) : (
            <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', color:isDark ? '#333' : '#ccc' }}>
              <p style={{ fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                 Select a gland to explore hormones
              </p>
            </div>
          )}
        </AnimatePresence>

        {showStress && (
          <motion.div 
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ marginTop:'auto', padding:16, background:'#39ff1410', border:`1px solid #39ff1430`, borderRadius:2 }}
          >
            <p style={{ fontSize:11, color:'#39ff14', fontFamily:'Inter', margin:0, fontStyle:'italic' }}>
              Adrenaline is being released. Heart rate increases, blood flow diverts to muscles, and pupils dilate. This is the ADRENALINE RUSH.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
