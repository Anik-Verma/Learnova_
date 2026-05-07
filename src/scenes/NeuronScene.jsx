import { useEffect, useRef, useState } from 'react';

export default function NeuronScene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [labelIdx, setLabelIdx] = useState(0);

  const FACTS = [
    "Brain contains ~86 billion neurons",
    "Signals travel at up to 120 m/s along axons",
    "Each neuron connects to ~7,000 others on average",
    "Synapses transmit signals using neurotransmitters"
  ];
  
  const LABELS = ["DENDRITE", "CELL BODY", "AXON", "SYNAPSE", "MYELIN SHEATH"];

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

    let W = canvas.width; let H = canvas.height;
    
    // Abstracting positions manually to handle resize dynamically
    const getPos = () => [
       {x: W*0.15, y: H*0.25, fired: 0}, {x: W*0.35, y: H*0.15, fired: 0}, {x: W*0.60, y: H*0.20, fired: 0},
       {x: W*0.82, y: H*0.30, fired: 0}, {x: W*0.20, y: H*0.55, fired: 0}, {x: W*0.48, y: H*0.50, fired: 0},
       {x: W*0.75, y: H*0.58, fired: 0}, {x: W*0.30, y: H*0.78, fired: 0}, {x: W*0.65, y: H*0.80, fired: 0}
    ];
    let neurons = getPos();

    const CONNECTIONS = [
       [0,1],[1,2],[2,3],[0,4],[1,5],[2,5],
       [3,6],[4,5],[5,6],[4,7],[5,7],[6,8],[7,8]
    ];

    let signals = [
       {f:0, t:1, pos:0, cIdx:0}, {f:2, t:5, pos:0.33, cIdx:5}, {f:4, t:7, pos:0.66, cIdx:9}
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      W = canvas.width; H = canvas.height;
      let np = getPos();
      for(let i=0; i<9; i++) { neurons[i].x = np[i].x; neurons[i].y = np[i].y; }
    };
    window.addEventListener('resize', resize);
    resize();

    // Bezier math
    const getBezier = (p1, p2) => {
       const midX = (p1.x + p2.x)/2; const midY = (p1.y + p2.y)/2;
       const dx = p2.x - p1.x; const dy = p2.y - p1.y;
       const len = Math.sqrt(dx*dx + dy*dy);
       const nx = -dy/len; const ny = dx/len;
       return { cx: midX + nx*40, cy: midY + ny*40 };
    };

    const getBezierPoint = (t, p0, p1, p2) => {
       const u = 1-t; const tt = t*t; const uu = u*u;
       const p = {x: uu*p0.x + 2*u*t*p1.x + tt*p2.x, y: uu*p0.y + 2*u*t*p1.y + tt*p2.y};
       return p;
    };

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

      // Connections Base
      CONNECTIONS.forEach(c => {
         const p1 = neurons[c[0]]; const p2 = neurons[c[1]];
         const {cx, cy} = getBezier(p1, p2);
         ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
         ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(cx, cy, p2.x, p2.y); ctx.stroke();
      });

      // Update Signals
      for(let i=signals.length-1; i>=0; i--) {
         let s = signals[i];
         s.pos += 0.012;
         if (s.pos >= 1) {
            neurons[s.t].fired = 1.0;
            const destCons = CONNECTIONS.map((c, idx) => ({c, idx})).filter(x => x.c[0] === s.t || x.c[1] === s.t);
            if (signals.length < 7 && destCons.length > 0) {
               setTimeout(() => {
                  if(!canvasRef.current) return;
                  let newC = destCons[Math.floor(Math.random()*destCons.length)];
                  let toIdx = newC.c[0] === s.t ? newC.c[1] : newC.c[0];
                  if (toIdx !== s.f) signals.push({f: s.t, t: toIdx, pos: 0, cIdx: newC.idx});
               }, 400);
            }
            signals.splice(i, 1);
         }
      }

      // Draw Neurons
      neurons.forEach((n, idx) => {
         if (n.fired > 0) n.fired -= 0.05;
         let nf = Math.max(0, n.fired);
         let r = 18 + nf*8;

         // Fired flash
         if (nf > 0) {
            ctx.fillStyle = `rgba(255,255,255,${nf*0.5})`;
            ctx.beginPath(); ctx.arc(n.x, n.y, r+10, 0, Math.PI*2); ctx.fill();
         }

         // Dendrites
         ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1;
         for(let i=0; i<5; i++) {
            let a = (Math.PI*2/5)*i + idx;
            let len = 35 + (idx%3)*10;
            let dx = n.x + Math.cos(a)*len; let dy = n.y + Math.sin(a)*len;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(dx, dy); ctx.stroke();
            ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI*2); ctx.fill();
         }

         // Body
         ctx.shadowColor = 'white'; ctx.shadowBlur = 20 + nf*20;
         ctx.fillStyle = 'white';
         ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI*2); ctx.fill();
         ctx.shadowBlur = 0;
         
         ctx.fillStyle = '#222';
         ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI*2); ctx.fill();
      });

      // Draw Signals
      signals.forEach(s => {
         if (s.pos < 0) return;
         const p1 = neurons[s.f]; const p2 = neurons[s.t];
         const {cx, cy} = getBezier(p1, p2);
         const pt = getBezierPoint(s.pos, p1, {x:cx,y:cy}, p2);
         
         ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 15;
         ctx.fillStyle = '#00d4ff';
         ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI*2); ctx.fill();
         ctx.shadowBlur = 0;
      });

      // Anatomy Label Logic
      // For simplicity, we randomly stick it onto Neuron 5 (the hub)
      const hub = neurons[5];
      let tText = LABELS[labelIdx];
      let tDx = hub.x + 80; let tDy = hub.y - 60;
      
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(tDx, tDy); ctx.lineTo(tDx + 30, tDy); ctx.stroke();
      
      ctx.fillStyle = '#888'; ctx.font = '9px Space Grotesk'; ctx.textAlign = 'left';
      ctx.fillText(tText, tDx + 35, tDy + 3);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    
    const factInt = setInterval(() => { setFactIdx(prev => (prev + 1) % FACTS.length); }, 4000);
    const labInt = setInterval(() => { setLabelIdx(prev => (prev + 1) % LABELS.length); }, 3500);

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
            NEURAL TRANSMISSION
         </div>
         <div className="font-inter text-[12px] text-[var(--on-surface-variant)] leading-[1.6]">
            {FACTS[factIdx]}
         </div>
       </div>
    </>
  );
}
