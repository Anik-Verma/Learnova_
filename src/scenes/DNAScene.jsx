import { useEffect, useRef, useState } from 'react';

export default function DNAScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [labelIdx, setLabelIdx] = useState(0);

  const FACTS = [
    "DNA contains ~3 billion base pairs in human genome",
    "A always pairs with T, G always pairs with C",
    "DNA stores genetic information in sequences of bases",
    "If uncoiled, human DNA would stretch ~2 meters"
  ];
  
  const LABELS = ["A — Adenine", "T — Thymine", "G — Guanine", "C — Cytosine"];

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
    
    const particles = Array.from({length: 25}).map((_, i) => ({
       aOff: Math.random() * Math.PI * 2,
       yOff: Math.random() * canvas.height,
       speed: 0.5 + Math.random(),
       c: ['#00d4ff', '#ffffff', '#39ff14'][Math.floor(Math.random()*3)]
    }));

    let scrollOffset = 0;
    let rotationOffset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawHelix = (cX, op, isBg) => {
       const amp = 85;
       const vSpace = 28;
       const numRungs = Math.ceil(canvas.height / vSpace) + 4;
       
       let lPoints = [];
       let rPoints = [];
       let rungs = [];

       for (let i = 0; i < numRungs; i++) {
          let angle = (i * vSpace + scrollOffset) * 0.065 + rotationOffset;
          if (isBg) angle += Math.PI * 0.3;
          let y = i * vSpace - (scrollOffset % vSpace);
          if (y < -50 || y > canvas.height + 50) continue;
          
          let lX = cX + amp * Math.sin(angle);
          let rX = cX + amp * Math.sin(angle + Math.PI);
          let depth = Math.sin(angle);
          
          lPoints.push({x: lX, y, d: depth});
          rPoints.push({x: rX, y, d: -depth});
          
          if (Math.abs(depth) < 0.92) {
             rungs.push({y, lx: lX, rx: rX, d: depth, i});
          }
       }

       // Draw Back Rungs
       rungs.filter(r => r.d < 0).forEach(r => {
          ctx.globalAlpha = (0.5 + r.d * 0.4) * op;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(r.lx, r.y); ctx.lineTo(r.rx, r.y); ctx.stroke();
       });

       // Draw Strands
       const drawStrand = (pts, isLeft) => {
          if (pts.length === 0) return;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          pts.forEach((p, i) => {
             if(i>0) ctx.lineTo(p.x, p.y);
          });
          ctx.strokeStyle = isLeft ? '#00d4ff' : 'rgba(255,255,255,0.85)';
          ctx.globalAlpha = op; // simplify
          ctx.lineWidth = 2.5;
          ctx.stroke();
          
          // Dots
          pts.forEach(p => {
             ctx.fillStyle = isLeft ? '#00d4ff' : '#ffffff';
             ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill();
          });
       };
       
       drawStrand(lPoints, true);
       drawStrand(rPoints, false);

       // Draw Front Rungs
       rungs.filter(r => r.d >= 0).forEach(r => {
          ctx.globalAlpha = (0.5 + r.d * 0.4) * op;
          
          let bIdx = Math.floor(r.i / 3) % 4;
          let g = ctx.createLinearGradient(r.lx, r.y, r.rx, r.y);
          if(bIdx===0) { g.addColorStop(0, '#00d4ff'); g.addColorStop(1, '#ffffff'); }
          else if(bIdx===1) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#00d4ff'); }
          else if(bIdx===2) { g.addColorStop(0, '#39ff14'); g.addColorStop(1, '#ffdd4c'); }
          else { g.addColorStop(0, '#ffdd4c'); g.addColorStop(1, '#39ff14'); }
          
          ctx.strokeStyle = g;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(r.lx, r.y); ctx.lineTo(r.rx, r.y); ctx.stroke();
       });
       ctx.globalAlpha = 1;
    };

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.016;
      scrollOffset += 0.4;
      rotationOffset += 0.025;

      // Draw Grid
      ctx.strokeStyle = 'rgba(168,232,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      const cX = canvas.width / 2;
      drawHelix(cX - 200, 0.2, true);  // bg
      drawHelix(cX, 1.0, false);       // fg

      // Particles
      particles.forEach(p => {
         p.yOff -= p.speed;
         if (p.yOff < 0) p.yOff = canvas.height;
         let angle = (p.yOff * 0.065) + p.aOff + rotationOffset;
         let px = cX + 100 * Math.sin(angle);
         
         ctx.shadowColor = p.c; ctx.shadowBlur = 8;
         ctx.fillStyle = p.c;
         ctx.beginPath(); ctx.arc(px, p.yOff, 3, 0, Math.PI*2); ctx.fill();
         ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => { setFactIdx(prev => (prev + 1) % FACTS.length); }, 4000);
    const labInt = setInterval(() => { setLabelIdx(prev => (prev + 1) % LABELS.length); }, 3000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(factInt); clearInterval(labInt);
    };
  }, [ready]);

  return (
    <>
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
       
       <div className="absolute top-[40px] left-[40px] p-[20px] w-[260px] glass-panel border-l-2 border-l-[var(--primary-container)] z-[10] shadow-[0_20px_40px_rgba(0,212,255,0.04)]">
         <div className="font-orbitron text-[11px] text-[var(--primary)] mb-[12px] uppercase">
            DNA DOUBLE HELIX
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>

       <div 
         className="absolute top-1/2 left-1/2 -translate-y-1/2 ml-[140px] px-[20px] py-[15px] glass-panel border-l-2 border-l-[var(--primary)] z-[10] transition-opacity duration-500 w-[160px]"
       >
          <div className="font-orbitron text-[14px] text-white tracking-widest">{LABELS[labelIdx]}</div>
       </div>
    </>
  );
}
