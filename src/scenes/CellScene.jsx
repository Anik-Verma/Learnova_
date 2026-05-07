import { useEffect, useRef, useState } from 'react';

export default function CellScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [orgIdx, setOrgIdx] = useState(0);

  const FACTS = [
    "Human body contains ~37 trillion cells",
    "Cell membrane controls what enters and exits",
    "Mitochondria generate ATP through cellular respiration",
    "Nucleus contains the cell's DNA blueprint"
  ];

  const ORGANELLES = [
    {id:'nucleus', name:'NUCLEUS', desc:'Contains the genetic instructions (DNA) for cell growth and reproduction.'},
    {id:'mitochondria', name:'MITOCHONDRIA', desc:'Powerhouse of the cell — produces ATP energy.'},
    {id:'er', name:'ROUGH ER', desc:'Studded with ribosomes. Synthesizes and folds proteins.'},
    {id:'golgi', name:'GOLGI APPARATUS', desc:'Packages and modifies proteins for delivery.'},
    {id:'vacuole', name:'VACUOLE', desc:'Storage compartment for water, nutrients, and waste.'}
  ];

  useEffect(() => {
    Promise.all([
      document.fonts.load('700 14px Orbitron')
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let raf; let time = 0;
    
    const particles = Array.from({length: 20}).map(() => ({
       x: window.innerWidth/2 + (Math.random()-0.5)*window.innerWidth*0.4,
       y: window.innerHeight/2 + (Math.random()-0.5)*window.innerHeight*0.5,
       vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
       c: Math.random()>0.5 ? 'rgba(168,232,255,0.3)' : 'rgba(255,255,255,0.2)'
    }));

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
      const rx = canvas.width * 0.28;
      const ry = canvas.height * 0.35;
      
      const activeOrg = ORGANELLES[orgIdx].id;

      // Glow
      let grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      grd.addColorStop(0, 'rgba(0,212,255,0.03)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx+50, ry+50, 0, 0, Math.PI*2); ctx.fill();

      // Membrane
      ctx.fillStyle = 'rgba(0,20,35,0.5)';
      ctx.strokeStyle = 'rgba(168,232,255,0.4)'; ctx.lineWidth = 2;
      // organic wavy edge
      ctx.beginPath();
      for(let a=0; a<=Math.PI*2.1; a+=0.1) {
         let wave = Math.sin(a*8 + time)*4;
         let dx = cx + Math.cos(a)*(rx+wave);
         let dy = cy + Math.sin(a)*(ry+wave);
         if(a===0) ctx.moveTo(dx, dy); else ctx.lineTo(dx, dy);
      }
      ctx.fill(); ctx.stroke();
      
      // Cytoplasm particles
      particles.forEach(p => {
         p.x += p.vx + (Math.random()-0.5)*0.2;
         p.y += p.vy + (Math.random()-0.5)*0.2;
         const dist = Math.pow((p.x-cx)/rx, 2) + Math.pow((p.y-cy)/ry, 2);
         if (dist > 0.9) {
            p.x = cx + (Math.random()-0.5)*rx; p.y = cy + (Math.random()-0.5)*ry;
         }
         ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
      });

      // Nucleus
      ctx.save();
      ctx.translate(cx - 30, cy - 20);
      let isN = activeOrg === 'nucleus';
      ctx.fillStyle = 'rgba(40,30,10,0.8)';
      ctx.strokeStyle = isN ? 'rgba(255,255,100,0.9)' : 'rgba(255,200,50,0.6)'; ctx.lineWidth = isN ? 4 : 2;
      ctx.beginPath(); ctx.arc(0, 0, 65, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,200,50,0.4)'; ctx.beginPath(); ctx.arc(10, 10, 14, 0, Math.PI*2); ctx.fill();
      // pores
      ctx.fillStyle = '#111';
      for(let i=0; i<6; i++) { let a=(Math.PI*2/6)*i; ctx.beginPath(); ctx.arc(Math.cos(a)*65, Math.sin(a)*65, 3, 0, Math.PI*2); ctx.fill(); }
      if(isN) { ctx.fillStyle='white'; ctx.font='10px Orbitron'; ctx.fillText('NUCLEUS', -25, 80); }
      ctx.restore();

      // Mitochondria
      const drawMito = (mx, my, rot, isActive) => {
         ctx.save(); ctx.translate(mx, my); ctx.rotate(rot + time*0.1);
         ctx.fillStyle = isActive ? 'rgba(255,150,100,0.4)' : 'rgba(255,100,50,0.25)';
         ctx.strokeStyle = isActive ? 'rgba(255,150,80,0.9)' : 'rgba(255,120,60,0.6)'; ctx.lineWidth = isActive ? 3:2;
         ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-20, -10, 40, 20, 10) : ctx.fillRect(-20,-10,40,20); ctx.fill(); ctx.stroke();
         ctx.beginPath(); ctx.moveTo(-15, -5); ctx.lineTo(-5, 5); ctx.lineTo(5, -5); ctx.lineTo(15, 5); ctx.stroke();
         if(isActive) { ctx.fillStyle='white'; ctx.font='10px Orbitron'; ctx.fillText('MITOCHONDRIA', -35, 30); }
         ctx.restore();
      };
      drawMito(cx + 80, cy + 60, Math.PI/4, activeOrg === 'mitochondria');
      drawMito(cx - 90, cy + 90, -Math.PI/6, activeOrg === 'mitochondria');

      // Rough ER
      ctx.save(); ctx.translate(cx + 40, cy - 80);
      let isE = activeOrg === 'er';
      ctx.strokeStyle = isE ? 'rgba(150,220,255,0.8)' : 'rgba(100,200,255,0.4)'; ctx.lineWidth = isE?4:2;
      for(let i=0; i<4; i++) {
         ctx.beginPath(); ctx.moveTo(0, i*12); ctx.quadraticCurveTo(50, i*12 - 20, 80, i*12 + 10); ctx.stroke();
      }
      ctx.fillStyle = 'white';
      for(let i=0; i<15; i++) { ctx.beginPath(); ctx.arc(Math.random()*80, Math.random()*50 - 10, 2, 0, Math.PI*2); ctx.fill(); }
      if(isE) { ctx.font='10px Orbitron'; ctx.fillText('ROUGH ER', 20, 60); }
      ctx.restore();

      // Golgi
      ctx.save(); ctx.translate(cx + 120, cy);
      let isG = activeOrg === 'golgi';
      ctx.strokeStyle = isG ? 'rgba(255,220,100,0.8)' : 'rgba(255,180,50,0.5)'; ctx.lineWidth = isG?5:3;
      for(let i=0; i<5; i++) {
         ctx.beginPath(); ctx.moveTo(0, i*8); ctx.quadraticCurveTo(30, i*8 + 30, 60, i*8); ctx.stroke();
      }
      if(isG) { ctx.fillStyle='white'; ctx.font='10px Orbitron'; ctx.fillText('GOLGI APPARATUS', 0, 60); }
      ctx.restore();

      // Vacuole
      ctx.save(); ctx.translate(cx - 120, cy - 40);
      let isV = activeOrg === 'vacuole';
      ctx.fillStyle = isV ? 'rgba(0,180,255,0.2)' : 'rgba(0,150,255,0.08)';
      ctx.strokeStyle = isV ? 'rgba(150,240,255,0.8)' : 'rgba(150,220,255,0.4)'; ctx.lineWidth = isV?3:1;
      let vr = 35 + Math.sin(time*2)*2;
      ctx.beginPath(); ctx.arc(0, 0, vr, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      if(isV) { ctx.fillStyle='white'; ctx.font='10px Orbitron'; ctx.fillText('VACUOLE', -20, vr+15); }
      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => { setFactIdx(prev => (prev + 1) % FACTS.length); }, 4000);
    const orgInt = setInterval(() => { setOrgIdx(prev => (prev + 1) % ORGANELLES.length); }, 5000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(factInt); clearInterval(orgInt);
    };
  }, [ready]);

  const oData = ORGANELLES[orgIdx];

  return (
    <>
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
       
       <div className="absolute top-[40px] left-[40px] p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10] shadow-[0_20px_40px_rgba(0,212,255,0.04)]">
         <div className="font-orbitron text-[11px] text-[var(--primary)] mb-[12px] uppercase">
            CELL STRUCTURE
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>

       <div className="absolute top-1/2 right-[40px] -translate-y-1/2 p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10]">
         <div className="font-orbitron text-[14px] text-[var(--primary)] mb-[8px] uppercase tracking-wide">
            {oData.name}
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {oData.desc}
         </div>
       </div>
    </>
  );
}
