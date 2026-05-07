import { useEffect, useRef, useState } from 'react';

export default function NewtonScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);

  const FACTS = [
    "All objects fall at g = 9.8 m/s² (ignoring air resistance)",
    "Newton published Principia Mathematica in 1687",
    "F = GMm/r² — The Universal Law of Gravitation",
    "Moon's gravity = 1.62 m/s² (⅙ of Earth)"
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
    
    let raf;
    let time = 0;
    
    const stars = Array.from({length: 150}).map(() => ({
       x: Math.random() * window.innerWidth,
       y: Math.random() * window.innerHeight,
       r: 0.5 + Math.random() * 1.5,
       o: 0.1 + Math.random() * 0.4,
       tw: Math.random() * 10
    }));

    let apples = [];
    let lastAppleTime = 0;
    
    let leaves = Array.from({length: 8}).map(() => ({
       x: Math.random() * window.innerWidth,
       y: Math.random() * window.innerHeight,
       vx: -0.5 - Math.random(),
       vy: 0.2 + Math.random() * 0.5,
       rot: Math.random() * Math.PI * 2
    }));

    let armAngle = 0;
    let textAlpha = 0;

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

      // Draw Grid
      ctx.strokeStyle = 'rgba(168,232,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      // Moon
      ctx.shadowColor = 'white'; ctx.shadowBlur = 25;
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(120, 100, 55, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#cccccc';
      ctx.beginPath(); ctx.arc(105, 85, 8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(135, 115, 12, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(110, 130, 6, 0, Math.PI*2); ctx.fill();

      // Stars
      stars.forEach((s) => {
         let currentO = s.o + Math.sin(time * 3 + s.tw) * 0.08;
         ctx.fillStyle = `rgba(255,255,255,${Math.max(0, currentO)})`;
         ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      });

      const groundY = canvas.height * 0.76;
      const treeX = canvas.width * 0.72;

      // Tree Trunk
      ctx.fillStyle = '#5c3d1e';
      ctx.fillRect(treeX - 11, groundY - 160, 22, 160);
      
      // Canopy
      ctx.fillStyle = '#1a2e1a';
      ctx.beginPath(); ctx.arc(treeX, groundY - 180, 65, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(treeX - 45, groundY - 150, 55, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(treeX + 45, groundY - 150, 50, 0, Math.PI*2); ctx.fill();

      // Static Apples
      ctx.fillStyle = '#cc0000';
      const sa = [[-20, -190], [30, -170], [-50, -130], [50, -135], [0,-140]];
      sa.forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(treeX+dx, groundY+dy, 7, 0, Math.PI*2); ctx.fill(); });

      // Newton
      const nx = canvas.width * 0.68;
      const ny = groundY - 10;
      
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(nx-15, ny-35, 30, 35, 4) : ctx.fillRect(nx-15, ny-35, 30, 35); ctx.fill();
      ctx.fillRect(nx-25, ny-10, 40, 10);
      
      // Arm
      ctx.strokeStyle = '#333'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(nx - 5, ny - 25);
      ctx.lineTo(nx - 20 - armAngle, ny - 15 - armAngle);
      ctx.stroke();

      // Head / Wig
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(nx, ny-45, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#dddddd'; 
      ctx.beginPath(); ctx.arc(nx, ny-48, 16, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.ellipse(nx-14, ny-40, 5, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(nx+14, ny-40, 5, 10, 0, 0, Math.PI*2); ctx.fill();

      // Apple Spawner
      if (time - lastAppleTime > 3.5) {
         apples.push({
            x: treeX - 30 + Math.random()*60, y: groundY - 160,
            vy: 0, rot: 0, active: true, bounces: 0
         });
         lastAppleTime = time;
      }

      if (armAngle > 0) armAngle -= 0.5;
      if (textAlpha > 0) textAlpha -= 0.005;

      apples.forEach(a => {
         if (!a.active) return;
         
         ctx.fillStyle = 'rgba(204,0,0,0.2)';
         for(let i=1; i<=4; i++) {
           ctx.beginPath(); ctx.arc(a.x, a.y - i*12, 11, 0, Math.PI*2); ctx.fill();
         }

         a.vy += 0.28;
         a.y += a.vy;
         a.rot += 0.1;

         if (a.y > groundY - 11) {
            a.y = groundY - 11;
            if (a.bounces === 0) {
               armAngle = 25;
               textAlpha = 1.0;
               ctx.strokeStyle = 'rgba(255,255,255,0.8)';
               ctx.beginPath(); ctx.arc(a.x, a.y, 25, 0, Math.PI*2); ctx.stroke();
            }
            a.bounces++;
            a.vy = -(a.vy * 0.35);
            if (Math.abs(a.vy) < 1) a.active = false;
         }

         ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot);
         ctx.fillStyle = '#cc0000'; ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.fill();
         ctx.strokeStyle = '#5c3d1e'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,-11); ctx.lineTo(2,-16); ctx.stroke();
         ctx.fillStyle = '#00cc00'; ctx.beginPath(); ctx.ellipse(6,-14,4,2,Math.PI/4,0,Math.PI*2); ctx.fill();
         ctx.restore();
      });

      if (textAlpha > 0) {
         ctx.fillStyle = `rgba(255,255,255,${textAlpha})`;
         ctx.font = '14px Orbitron';
         ctx.fillText("g = 9.8 m/s²", nx - 60, ny - 80);
      }

      // Leaves
      ctx.fillStyle = 'rgba(26,46,26,0.6)';
      leaves.forEach(l => {
         l.x += l.vx; l.y += l.vy; l.rot += 0.02;
         if (l.y > canvas.height || l.x < 0) { l.x = canvas.width + 50; l.y = Math.random()*canvas.height*0.5; }
         ctx.beginPath(); ctx.ellipse(l.x, l.y, 8, 4, l.rot, 0, Math.PI*2); ctx.fill();
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => { setFactIdx(prev => (prev + 1) % FACTS.length); }, 4500);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(factInt);
    };
  }, [ready]);

  return (
    <>
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
       <div className="absolute top-[40px] left-[40px] p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10] shadow-[0_20px_40px_rgba(0,212,255,0.04)]">
         <div className="font-orbitron text-[11px] text-[var(--primary)] mb-[12px] uppercase">
            GRAVITATIONAL ACCELERATION
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>
    </>
  );
}
