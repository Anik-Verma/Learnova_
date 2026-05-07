import { useEffect, useRef, useState } from 'react';

export default function NeuronSignalSim({ isDark, accentColor }) {
  const canvasRef = useRef(null);
  const [signalActive, setSignalActive] = useState(false);
  const [mode, setMode] = useState('single'); // 'single' or 'reflex'
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef(null);
  const signalPos = useRef(0);

  const drawNeuron = (ctx, x, y, size, active) => {
    ctx.strokeStyle = active ? accentColor : (isDark ? '#333' : '#ddd');
    ctx.lineWidth = 2;

    // Soma (Cell Body)
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();

    // Dendrites
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.lineTo(x + Math.cos(angle) * size * 2, y + Math.sin(angle) * size * 2);
      ctx.stroke();
    }

    // Axon
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size + 200, y);
    ctx.stroke();

    // Axon Terminals
    ctx.beginPath();
    ctx.moveTo(x + size + 200, y);
    ctx.lineTo(x + size + 210, y - 10);
    ctx.moveTo(x + size + 200, y);
    ctx.lineTo(x + size + 210, y + 10);
    ctx.stroke();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = 150;
    const centerY = 200;

    if (mode === 'single') {
      drawNeuron(ctx, centerX, centerY, 30, signalActive && signalPos.current < 30);
      
      // Draw Signal
      if (signalActive) {
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = accentColor;
        
        ctx.beginPath();
        // Travel from soma along axon
        const pulseX = centerX + signalPos.current;
        ctx.arc(pulseX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        signalPos.current += 3 * speed;
        
        if (signalPos.current > 250) {
          setSignalActive(false);
          signalPos.current = 0;
        }
      }
    } else {
      // Reflex Arc Mode
      // Sensory -> Spinal Cord -> Motor
      drawNeuron(ctx, 100, 150, 20, false); // Sensory
      drawNeuron(ctx, 300, 200, 20, false); // Relay (Spinal Cord)
      drawNeuron(ctx, 100, 250, 20, false); // Motor

      if (signalActive) {
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          let px, py;
          if (signalPos.current < 200) {
            // sensory to spinal
             px = 100 + signalPos.current;
             py = 150 + (signalPos.current * 0.25);
          } else if (signalPos.current < 400) {
             // spinal to motor
             const localPos = signalPos.current - 200;
             px = 300 - localPos;
             py = 200 + (localPos * 0.25);
          } else {
             setSignalActive(false);
             signalPos.current = 0;
             return;
          }
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
          signalPos.current += 4 * speed;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [signalActive, mode, speed, isDark]);

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background: isDark ? '#080808' : '#fff' }}>
      
      {/* Control Bar */}
      <div style={{ padding:20, borderBottom:`1px solid ${isDark ? '#222' : '#eee'}`, display:'flex', gap:20, alignItems:'center' }}>
        <button
          onClick={() => { setSignalActive(true); signalPos.current = 0; }}
          disabled={signalActive}
          style={{
            padding:'10px 24px', background:accentColor, color:'#000', border:'none', borderRadius:2,
            fontFamily:'Space Grotesk', fontSize:11, textTransform:'uppercase', fontWeight:700, cursor:'pointer',
            opacity: signalActive ? 0.5 : 1
          }}
        >
          {mode === 'single' ? '🚀 Fire Impulse' : '🔥 Stimulate Reflex'}
        </button>

        <div style={{ display:'flex', gap:8 }}>
          {['single', 'reflex'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setSignalActive(false); }}
              style={{
                padding:'6px 12px', borderRadius:2, border:`1px solid ${mode === m ? accentColor : 'rgba(128,128,128,0.2)'}`,
                background: mode === m ? `${accentColor}10` : 'transparent',
                color: mode === m ? accentColor : (isDark ? '#666' : '#888'),
                cursor:'pointer', fontFamily:'Space Grotesk', fontSize:9, textTransform:'uppercase'
              }}
            >
              {m} mode
            </button>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:9, fontFamily:'Space Grotesk', color:'#555' }}>SPEED</span>
          <input 
            type="range" min="0.2" max="2" step="0.1" value={speed} 
            onChange={e => setSpeed(parseFloat(e.target.value))}
            style={{ width:100, accentColor:accentColor }}
          />
        </div>
      </div>

      <div style={{ flex:1, position:'relative' }}>
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            style={{ width:'100%', height:'100%', objectFit:'contain' }}
          />
          
          <div style={{ position:'absolute', bottom:20, left:20, maxWidth:300 }}>
            <h4 style={{ fontFamily:'Orbitron', fontSize:12, color:accentColor, margin:'0 0 4px' }}>
              {mode === 'single' ? 'NEURON STRUCTURE' : 'REFLEX ARC'}
            </h4>
            <p style={{ fontFamily:'Inter', fontSize:11, color:isDark ? '#666' : '#888', margin:0 }}>
              {mode === 'single' ? 'Impulse travels from the Dendrites through the Axon to the Nerve Terminals.' : 'Reflex action bypasses the conscious brain, traveling through the Spinal Cord for instant response.'}
            </p>
          </div>
      </div>
    </div>
  );
}
