import { useEffect, useRef, useState } from 'react';

export default function RocketScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);

  const FACTS = [
    "Thrust > Weight → Rocket accelerates upward",
    "F_thrust = exhaust velocity × mass flow rate",
    "Escape velocity from Earth = 11.2 km/s",
    "Newton's 3rd Law: exhaust pushed down → rocket goes up"
  ];

  useEffect(() => {
    Promise.all([
      document.fonts.load('700 18px Orbitron'),
      document.fonts.load('400 10px Inter'),
      document.fonts.load('400 8px Space Grotesk')
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let raf;
    let time = 0;

    let rocketY = canvas.height + 160;
    let speed = 0;
    let particles = [];
    
    const stars = Array.from({length: 160}).map(() => ({
       x: Math.random() * window.innerWidth,
       y: Math.random() * window.innerHeight,
       r: 0.4 + Math.random() * 1.4,
       o: 0.1 + Math.random() * 0.35,
       offset: Math.random() * Math.PI * 2
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

      const centerX = canvas.width / 2;

      // Draw Grid
      ctx.strokeStyle = 'rgba(168,232,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      // Stars
      stars.forEach(s => {
         let currentO = s.o + Math.sin(time * 3 + s.offset) * 0.08;
         ctx.fillStyle = `rgba(255,255,255,${Math.max(0, currentO)})`;
         ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      });

      // Rocket Physics
      if (rocketY > -200) {
         speed = Math.min(9, speed + 0.12);
         rocketY -= speed;
         
         // Smoke Engine
         for(let i=0; i<3; i++) {
            particles.push({
               x: centerX + (Math.random()-0.5)*10, y: rocketY + 55,
               vx: (Math.random()-0.5)*1.6, vy: 0.5 + Math.random()*1.3,
               r: 4 + Math.random()*10,
               life: 180, maxLife: 180
            });
         }
      } else {
         if (speed > 0) { speed = 0; }
         // Secret reset timer handled implicitly by speed 0 & not moving. We just warp it back.
         rocketY = canvas.height + 160;
      }

      if (particles.length > 250) particles.splice(0, particles.length - 250);

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.r += 0.05;
        p.life -= 1;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        
        ctx.fillStyle = `rgba(150,150,150,${p.life / p.maxLife * 0.5})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }

      // Draw Flame
      if (rocketY < canvas.height + 50) {
         ctx.save();
         ctx.translate(centerX, rocketY + 55);
         ctx.globalCompositeOperation = 'screen';
         // Outer
         ctx.fillStyle = 'rgba(0,120,255,0.2)';
         ctx.beginPath(); ctx.ellipse(0, 30, 22, 60, 0, 0, Math.PI*2); ctx.fill();
         
         // Glow
         ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 30;
         // Mid
         ctx.fillStyle = 'rgba(0,212,255,0.7)';
         let flicker = Math.sin(time*20)*8;
         ctx.beginPath(); ctx.ellipse(0, 20, 14, 42 + flicker, 0, 0, Math.PI*2); ctx.fill();
         ctx.shadowBlur = 0; // reset
         // Inner
         ctx.fillStyle = 'rgba(255,255,255,0.95)';
         ctx.beginPath(); ctx.ellipse(0, 12, 8, 25, 0, 0, Math.PI*2); ctx.fill();
         ctx.restore();
      }

      // Draw Rocket
      ctx.fillStyle = '#ffffff';
      // Body
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(centerX - 22, rocketY - 55, 44, 110, 4) : ctx.fillRect(centerX-22, rocketY-55, 44, 110); ctx.fill();
      // Nose
      ctx.beginPath(); ctx.moveTo(centerX - 22, rocketY - 55); ctx.lineTo(centerX + 22, rocketY - 55); ctx.lineTo(centerX, rocketY - 85); ctx.closePath(); ctx.fill();
      // Fins
      ctx.beginPath(); ctx.moveTo(centerX - 22, rocketY + 20); ctx.lineTo(centerX - 40, rocketY + 55); ctx.lineTo(centerX - 22, rocketY + 55); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(centerX + 22, rocketY + 20); ctx.lineTo(centerX + 40, rocketY + 55); ctx.lineTo(centerX + 22, rocketY + 55); ctx.closePath(); ctx.fill();
      
      // Porthole
      ctx.strokeStyle = '#131313'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(centerX, rocketY - 20, 8, 0, Math.PI*2); ctx.stroke();
      
      // SV Text
      ctx.fillStyle = '#131313'; ctx.font = 'bold 10px Orbitron'; ctx.textAlign = 'center';
      ctx.fillText('SV', centerX, rocketY + 20);

      // Lens Flare
      if (rocketY < canvas.height - 100) {
         ctx.strokeStyle = 'white'; ctx.lineWidth = 0.5;
         const draws = [[2,0.9], [4,0.5], [8,0.2], [16,0.08]];
         draws.forEach(([r, o]) => {
            ctx.globalAlpha = o;
            ctx.beginPath(); ctx.arc(centerX, rocketY - 85, r, 0, Math.PI*2); ctx.stroke();
         });
         ctx.globalAlpha = 1.0;
      }

      // Altitude Panel (Glassmorphism manually drawn)
      ctx.fillStyle = 'rgba(19,19,19,0.85)';
      ctx.fillRect(canvas.width - 200, 40, 160, 110);
      ctx.fillStyle = '#00d4ff'; ctx.fillRect(canvas.width - 200, 40, 2, 110);
      
      ctx.fillStyle = '#bbc9cf'; ctx.font = '8px Space Grotesk'; ctx.textAlign = 'left';
      ctx.fillText('ALTITUDE', canvas.width - 180, 60);
      
      ctx.fillStyle = '#ffffff'; ctx.font = '18px Orbitron';
      // Calculate fake altitude
      let h = Math.floor(Math.max(0, canvas.height - rocketY) * 23.4);
      ctx.fillText(`${h.toLocaleString()} m`, canvas.width - 180, 85);
      
      // Bars
      ctx.fillStyle = '#bbc9cf'; ctx.font = '8px Space Grotesk';
      ctx.fillText('THRUST', canvas.width - 180, 110);
      ctx.fillText('GRAVITY', canvas.width - 180, 130);
      
      // Thrust Bar
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(canvas.width - 130, 104, 70, 6);
      ctx.fillStyle = '#00d4ff'; ctx.fillRect(canvas.width - 130, 104, Math.min(70, speed * 8), 6);
      // Gravity Bar
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(canvas.width - 130, 124, 70, 6);
      ctx.fillStyle = '#ff4444'; ctx.fillRect(canvas.width - 130, 124, 30, 6); // Constant

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => {
       setFactIdx(prev => (prev + 1) % FACTS.length);
    }, 5000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(factInt);
    };
  }, [ready]);

  return (
    <>
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
       {/* React HTML layer for Educational Panel since word-wrapping in canvas natively is annoying */}
       <div className="absolute top-[40px] left-[40px] p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10] shadow-[0_20px_40px_rgba(0,212,255,0.04)]">
         <div className="font-orbitron text-[11px] text-[var(--primary)] mb-[12px] uppercase">
            LAUNCH PHYSICS
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>
    </>
  );
}
