import { useEffect, useRef, useState } from 'react';

export default function ElementsScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

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
    
    // Simplistic floating physics elements so ElementsScene exists properly 
    // without crashing SceneRenderer while waiting for further prompts
    const els = Array.from({length: 15}).map(() => ({
       x: Math.random() * window.innerWidth,
       y: Math.random() * window.innerHeight,
       vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
       rot: Math.random()*Math.PI, rotS: (Math.random()-0.5)*0.02,
       txt: ['He', 'Li', 'C', 'O', 'Fe'][Math.floor(Math.random()*5)],
       r: 20 + Math.random()*15
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

      ctx.strokeStyle = 'rgba(168,232,255,0.04)'; ctx.lineWidth=1;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=40){ ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=40){ ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      els.forEach(e => {
         e.x+=e.vx; e.y+=e.vy; e.rot+=e.rotS;
         if(e.x < -50) e.x = canvas.width+50; else if(e.x > canvas.width+50) e.x = -50;
         if(e.y < -50) e.y = canvas.height+50; else if(e.y > canvas.height+50) e.y = -50;
         
         ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot);
         ctx.fillStyle = 'rgba(31,31,31,0.6)'; ctx.strokeStyle='rgba(0,212,255,0.5)';
         ctx.beginPath(); ctx.arc(0,0,e.r,0,Math.PI*2); ctx.fill(); ctx.stroke();
         ctx.fillStyle='white'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font='bold 16px Orbitron';
         ctx.fillText(e.txt, 0, 0);
         ctx.restore();
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [ready]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}
