import { useEffect, useRef, useState } from 'react';

const PLANETS = [
  {name:'Mercury', r:4,  orbit:80,  speed:4.7,  color:'#b5b5b5'},
  {name:'Venus',   r:7,  orbit:120, speed:3.5,  color:'#e8cda0'},
  {name:'Earth',   r:8,  orbit:170, speed:2.98, color:'#4b9cd3'},
  {name:'Mars',    r:6,  orbit:220, speed:2.41, color:'#c1440e'},
  {name:'Jupiter', r:18, orbit:300, speed:1.31, color:'#c88b3a'},
  {name:'Saturn',  r:14, orbit:380, speed:0.97, color:'#e4d191', hasRing:true},
  {name:'Uranus',  r:11, orbit:445, speed:0.68, color:'#7de8e8'},
];

const PLANET_FACTS = [
  "Closest to Sun — surface temp: -180°C to 430°C",
  "Hottest planet — 465°C average surface temp",
  "Only known planet with life — 71% covered in water",
  "Has the tallest volcano in solar system — Olympus Mons",
  "Largest planet — Great Red Spot is a 400yr storm",
  "Least dense planet — could float on water",
  "Rotates on its side at 98° axial tilt"
];

const FACTS = [
  "Planets orbit Sun due to gravitational attraction",
  "Closer planets orbit faster (Kepler's 3rd Law)",
  "T² ∝ r³ — orbital period vs distance relationship"
];

export default function SolarScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [planetIdx, setPlanetIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      document.fonts.load('700 16px Orbitron')
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let raf; let time = 0;
    
    let angles = PLANETS.map(() => Math.random() * Math.PI * 2);
    let solarWinds = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      ctx.strokeStyle = 'rgba(168,232,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Orbit Paths
      PLANETS.forEach(p => {
         ctx.strokeStyle = 'rgba(255,255,255,0.06)';
         ctx.lineWidth = 1;
         ctx.beginPath(); ctx.ellipse(cx, cy, p.orbit, p.orbit * 0.38, 0, 0, Math.PI*2); ctx.stroke();
      });

      // Solar Winds
      if (Math.random() < 0.25) { // ~15 per sec
         let a = Math.random() * Math.PI * 2;
         solarWinds.push({x: cx + Math.cos(a)*40, y: cy + Math.sin(a)*40, vx: Math.cos(a)*2, vy: Math.sin(a)*2, life: 120, max: 120});
      }
      solarWinds.forEach((sw, i) => {
         sw.x += sw.vx; sw.y += sw.vy; sw.life--;
         if (sw.life <= 0) solarWinds.splice(i, 1);
         else {
            ctx.fillStyle = `rgba(255,221,76,${(sw.life/sw.max)*0.3})`;
            ctx.beginPath(); ctx.arc(sw.x, sw.y, 2, 0, Math.PI*2); ctx.fill();
         }
      });

      // Sun
      ctx.shadowColor = '#ffdd4c'; ctx.shadowBlur = 60;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      
      // Solar Flares
      ctx.strokeStyle = 'rgba(255,150,0,0.6)'; ctx.lineWidth = 4;
      for(let i=0; i<3; i++) {
         let a = (Math.PI*2/3)*i + time;
         let r = 38 + Math.sin(time*5 + i)*5;
         ctx.beginPath(); ctx.arc(cx, cy, r, a, a+0.8); ctx.stroke();
      }

      // Planets
      PLANETS.forEach((p, i) => {
         angles[i] += p.speed * 0.008;
         let px = cx + Math.cos(angles[i]) * p.orbit;
         let py = cy + Math.sin(angles[i]) * p.orbit * 0.38;
         
         ctx.shadowColor = p.color; ctx.shadowBlur = p.r * 1.5;
         ctx.fillStyle = p.color;
         ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI*2); ctx.fill();
         ctx.shadowBlur = 0;

         // Saturn Ring
         if (p.hasRing) {
            ctx.strokeStyle = 'rgba(228,209,145,0.5)';
            ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(px, py, p.r*2.2, p.r*0.6, Math.PI/6, 0, Math.PI*2); ctx.stroke();
            ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(px, py, p.r*2.6, p.r*0.8, Math.PI/6, 0, Math.PI*2); ctx.stroke();
         }

         // Earth Moon
         if (p.name === 'Earth') {
            let ma = angles[i] * 4;
            let mx = px + Math.cos(ma) * 16;
            let my = py + Math.sin(ma) * 16;
            ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.arc(mx, my, 2.5, 0, Math.PI*2); ctx.fill();
         }
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => { setFactIdx(prev => (prev + 1) % FACTS.length); }, 4000);
    const pInt = setInterval(() => { setPlanetIdx(prev => (prev + 1) % PLANETS.length); }, 4000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(factInt); clearInterval(pInt);
    };
  }, [ready]);

  const pData = PLANETS[planetIdx];

  return (
    <>
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
       
       <div className="absolute top-[40px] left-[40px] p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10] shadow-[0_20px_40px_rgba(0,212,255,0.04)]">
         <div className="font-orbitron text-[11px] text-[var(--primary)] mb-[12px] uppercase">
            ORBITAL MECHANICS
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>

       <div className="absolute top-1/2 right-[40px] -translate-y-1/2 p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10]">
         <div className="font-orbitron text-[16px] text-white mb-[8px] uppercase">
            {pData.name}
         </div>
         <div className="font-inter text-[11px] text-[var(--on-surface-variant)] leading-[1.6]">
            {PLANET_FACTS[planetIdx]}
         </div>
       </div>
    </>
  );
}
