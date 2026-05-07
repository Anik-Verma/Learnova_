import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SHARED HOOKS ---
const useAnimation = (draw, isVisible) => {
  const rafRef = useRef();
  useEffect(() => {
    const animate = () => {
      if (isVisible) draw();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, isVisible]);
};

// --- MATTER: STATES ---
export const MatterStates = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [temp, setTemp] = useState(25);
  const particles = useRef(Array.from({ length: 50 }, () => ({
    x: Math.random() * 400 + 50, y: Math.random() * 150 + 50,
    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2
  })));

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const speed = temp / 150 + 0.5;
    const isSolid = temp < 100;
    const isGas = temp > 200;

    particles.current.forEach((p, i) => {
      if (isSolid) {
        const row = i % 10; const col = Math.floor(i / 10);
        const tx = 150 + row * 20 + Math.sin(Date.now()/200 + i)*2;
        const ty = 80 + col * 20 + Math.cos(Date.now()/200 + i)*2;
        p.x += (tx - p.x) * 0.1; p.y += (ty - p.y) * 0.1;
      } else {
        p.x += p.vx * speed; p.y += p.vy * speed;
        const limit = isGas ? 0 : 50;
        if (p.x < limit || p.x > w-limit) p.vx *= -1;
        if (p.y < limit || p.y > h-limit) p.vy *= -1;
      }
      ctx.fillStyle = isSolid ? '#60a5fa' : isGas ? (isDark ? '#fff' : '#000') : '#22d3ee';
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
    });
    ctx.fillStyle = accentColor; ctx.font = 'bold 10px Space Grotesk';
    ctx.fillText(isSolid ? 'SOLID' : isGas ? 'GAS' : 'LIQUID', 20, 30);
  };
  useAnimation(draw, isVisible);
  return (
    <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)' }} className="rounded">
      <canvas ref={canvasRef} width={500} height={220} className="w-full h-auto rounded" />
      <div className="animation-controls"><input type="range" min="0" max="300" value={temp} onChange={e=>setTemp(Number(e.target.value))} className="w-full" /><label className="control-label">Temp: {temp}°C</label></div>
    </div>
  );
};

// --- ACIDS: PH SCALE ---
export const AcidsPH = ({ accentColor, isDark }) => {
  const [ph, setPh] = useState(7);
  const colors = ['#f00','#f40','#f80', '#fb0', '#ad0', '#0f0', '#0c0', '#0bc', '#09f', '#00f', '#40f', '#80f', '#a0f', '#c0f', '#d0f'];
  const getPHColor = (v) => colors[Math.min(14, Math.max(0, Math.round(v)))];

  return (
    <div className="p-4 rounded bg-black/10">
      <div className="flex justify-between items-center mb-6">
         <div className="text-center"><div className="text-[42px] font-bold" style={{ color: getPHColor(ph) }}>{ph.toFixed(1)}</div></div>
         <div className="w-24 h-32 border-2 border-white/10 rounded-b-lg relative overflow-hidden bg-white/5">
            <motion.div className="absolute bottom-0 w-full" animate={{ height: (ph+1)*6 + '%', backgroundColor: getPHColor(ph) }} />
         </div>
      </div>
      <input type="range" min="0" max="14" step="0.1" value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full cursor-pointer" />
      <div className="grid grid-cols-3 gap-1 mt-2">
         {[[2,'Lemon'],[7,'Water'],[12,'Bleach']].map(([v,l]) => <button key={l} onClick={()=>setPh(v)} className="text-[9px] py-1 bg-white/5 rounded uppercase">{l}</button>)}
      </div>
    </div>
  );
};

// --- ATOMS: BOHR ---
export const AtomsBohr = ({ isVisible }) => {
  const [el, setEl] = useState('C');
  const data = { 'H':[1], 'He':[2], 'Li':[2,1], 'C':[2,4], 'O':[2,6], 'Ne':[2,8], 'Na':[2,8,1] };
  
  return (
    <div className="h-64 flex items-center justify-center bg-black/20 rounded relative overflow-hidden">
       <select value={el} onChange={e=>setEl(e.target.value)} className="absolute top-2 left-2 bg-black/40 text-[10px] text-white p-1 rounded">
          {Object.keys(data).map(x=><option key={x} value={x}>{x}</option>)}
       </select>
       <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-lg z-10">{el}</div>
       {data[el].map((count, sIdx) => {
         const r = 50 + sIdx*30;
         return (
           <div key={sIdx} className="absolute border border-white/5 rounded-full" style={{ width: r*2, height: r*2 }}>
              {Array.from({length: count}).map((_, eIdx) => (
                <motion.div key={eIdx} className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-cyan shadow-sm" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 + sIdx, ease: "linear" }}
                  style={{ top: '50%', left: '50%', transformOrigin: `${Math.cos(eIdx * (2*Math.PI/count)) * r}px ${Math.sin(eIdx * (2*Math.PI/count)) * r}px`, marginTop: -4, marginLeft: -4 }}
                />
              ))}
           </div>
         )
       })}
    </div>
  );
};

// --- ATOMS: DISCOVERY ---
export const AtomsDiscovery = () => {
    const [m, setM] = useState('thomson');
    return (
        <div className="p-4 bg-black/10 rounded">
            <div className="flex gap-2 mb-4">
                {['dalton','thomson','rutherford'].map(x => (
                    <button key={x} onClick={()=>setM(x)} className={`flex-1 py-1 rounded text-[9px] uppercase font-bold ${m===x?'bg-accent text-white':'bg-white/5'}`}>{x}</button>
                ))}
            </div>
            <div className="h-32 flex items-center justify-center bg-black/20 rounded">
                {m==='dalton' && <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20" />}
                {m==='thomson' && <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/30 flex flex-wrap p-2 gap-1 items-center justify-center">
                    {Array.from({length:5}).map((_,i)=><div key={i} className="w-2 h-2 bg-blue-400 rounded-full" />)}
                </div>}
                {m==='rutherford' && <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <div className="absolute w-24 h-8 rounded-full border border-white/10 rotate-45" />
                    <div className="absolute w-24 h-8 rounded-full border border-white/10 -rotate-45" />
                </div>}
            </div>
        </div>
    )
}

export const MatterDiffusion = () => <div className="p-12 text-center text-white/10 text-[9px] uppercase tracking-widest border border-dashed border-white/10">Diffusion Animation</div>;
export const AcidsNeutralisation = () => <div className="p-12 text-center text-white/10 text-[9px] uppercase tracking-widest border border-dashed border-white/10">Neutralisation Animation</div>;
