import React, { useRef, useEffect, useState } from 'react';

// --- SHARED HOOKS ---

const useAnimation = (draw, isVisible) => {
  const rafRef = useRef();
  
  useEffect(() => {
    const animate = () => {
      if (isVisible) {
        draw();
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, isVisible]);
};

// --- MOTION: DISTANCE TIME ---

export const MotionDistanceTime = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const posRef = useRef(0);
  const pointsRef = useRef([]);

  const canvasHeight = 380;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 600;
    canvas.height = canvasHeight;
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvasHeight;

    ctx.clearRect(0, 0, W, H);
    
    // BIGGER graph margins for better visibility
    const marginLeft = 75;    // increased for Y labels
    const marginRight = 30;
    const marginTop = 40;     // increased for title
    const marginBottom = 55;  // increased for X labels
    
    const graphW = W - marginLeft - marginRight;
    const graphH = H - marginTop - marginBottom;
    const graphLeft = marginLeft;
    const graphTop = marginTop;
    const graphBottom = marginTop + graphH;
    
    const maxTime = 10;      // 10 seconds
    const maxDistance = 100; // 100 metres max
    
    // speedValue: how many metres per second
    // speed slider value maps to actual speed
    const speedValue = speed * 8; 
    // speed=1 → 8 m/s, speed=10 → 80 m/s
    
    // Background
    ctx.fillStyle = isDark ? '#080d12' : '#f0f4f8';
    ctx.fillRect(0, 0, W, H);
    
    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(0,212,255,0.06)' : 'rgba(0,100,150,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      // Horizontal grid
      const y = graphBottom - (i/5) * graphH;
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphLeft + graphW, y);
      ctx.stroke();
      
      // Vertical grid
      const x = graphLeft + (i/5) * graphW;
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
    }
    
    // AXES
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1.5;
    // Y axis
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.stroke();
    // X axis
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphBottom);
    ctx.lineTo(graphLeft + graphW, graphBottom);
    ctx.stroke();
    
    // X AXIS LABELS (time)
    ctx.fillStyle = isDark ? '#00d4ff' : '#0077aa';
    ctx.font = '600 11px Inter';
    ctx.textAlign = 'center';
    for (let t = 0; t <= maxTime; t += 2) {
      const x = graphLeft + (t / maxTime) * graphW;
      ctx.fillText(t + 's', x, graphBottom + 18);
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, graphBottom);
      ctx.lineTo(x, graphBottom + 5);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // X AXIS TITLE
    ctx.fillStyle = isDark ? '#00d4ff' : '#0077aa';
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Time (seconds)', 
      graphLeft + graphW/2, graphBottom + 40);
    
    // Y AXIS LABELS (distance)
    ctx.textAlign = 'right';
    for (let d = 0; d <= maxDistance; d += 20) {
      const y = graphBottom - (d / maxDistance) * graphH;
      ctx.fillStyle = isDark ? '#00d4ff' : '#0077aa';
      ctx.font = '11px Inter';
      ctx.fillText(d + 'm', graphLeft - 10, y + 4);
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(graphLeft - 4, y);
      ctx.lineTo(graphLeft, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Y AXIS TITLE (rotated)
    ctx.save();
    ctx.translate(16, graphTop + graphH/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = isDark ? '#00d4ff' : '#0077aa';
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Distance (metres)', 0, 0);
    ctx.restore();
    
    // GRAPH TITLE
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.75)';
    ctx.font = '600 13px Orbitron';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.05em';
    ctx.fillText('DISTANCE-TIME GRAPH',
      graphLeft + graphW/2, graphTop - 12);
    
    // DRAW THE LINE (CORRECT SLOPE)
    // distance = speedValue * time
    
    // Keep axes fixed ALWAYS:
    // But don't cap the line — let it go off screen
    // Clip to graph area using ctx.clip()
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(graphLeft, graphTop, graphW, graphH);
    ctx.clip();
    
    // Draw line - it will be clipped at boundaries
    // but won't go flat
    ctx.beginPath();
    const t0 = 0;
    const t1 = maxTime;
    const d0 = speedValue * t0; // = 0
    const d1 = speedValue * t1; // = speedValue * 10
    
    const x0 = graphLeft;
    const y0 = graphBottom - (d0/maxDistance) * graphH;
    const x1 = graphLeft + graphW;
    const y1 = graphBottom - (d1/maxDistance) * graphH;
    
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00bcd4';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // Calculate where line exits the graph
    const timeToReach100m = 100 / speedValue;
    
    if (timeToReach100m <= maxTime) {
      // Line exits top of graph
      const exitX = graphLeft + (timeToReach100m/maxTime)*graphW;
      
      // Draw dotted vertical line at exit point
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = isDark ? 'rgba(0,212,255,0.3)' : 'rgba(0,119,170,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(exitX, graphTop);
      ctx.lineTo(exitX, graphBottom);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label: "100m reached at Xs"
      ctx.fillStyle = isDark ? 'rgba(0,212,255,0.6)' : 'rgba(0,100,150,0.7)';
      ctx.font = '9px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(
        `100m at ${timeToReach100m.toFixed(1)}s`,
        exitX, graphBottom + 35
      );
    }
    
    // Speed info box (top left of graph)
    const infoText = [
      `Speed = ${speedValue} m/s`,
      `Slope = ${speedValue} (rise/run)`,
      timeToReach100m <= maxTime 
        ? `Reaches 100m in ${timeToReach100m.toFixed(1)}s`
        : `Reaches ${(speedValue*10).toFixed(0)}m in 10s`
    ];
    
    // Draw info box background
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)';
    ctx.fillRect(graphLeft+8, graphTop+8, 200, 58);
    ctx.strokeStyle = isDark ? 'rgba(0,212,255,0.2)' : 'rgba(0,119,170,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(graphLeft+8, graphTop+8, 200, 58);
    
    infoText.forEach((text, i) => {
      ctx.fillStyle = i === 0 
        ? (isDark ? '#00d4ff' : '#0077aa')
        : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.65)');
      ctx.font = i === 0 
        ? 'bold 11px Orbitron' 
        : '10px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(text, graphLeft+16, graphTop+24+i*16);
    });

    // MOVING DOT on the line
    // Position based on animation progress
    const dotT = (Date.now() % 10000) / 1000; // 0-10 cycle
    let activeDotDist = speedValue * dotT;
    if (!isPlaying) {
        activeDotDist = 0;
    }
    const dotDist = activeDotDist;
    const dotX = graphLeft + (dotT/maxTime) * graphW;
    const dotY = graphBottom - (dotDist/maxDistance) * graphH;
    
    if (isPlaying) {
      if (dotY >= graphTop && dotX <= graphLeft + graphW) {
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI*2);
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (dotY < graphTop) {
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText('Object beyond range!', graphLeft + graphW - 10, graphTop + 20);
      }
    }
    
    // EDUCATION NOTE when speed changes:
    let eduLabel = '';
    let eduColor = '';
    if (speedValue <= 20) {
      eduLabel = '↗ Gentle slope = Slow speed';
      eduColor = '#ffdd4c';
    } else if (speedValue <= 50) {
      eduLabel = '↗ Medium slope = Medium speed';
      eduColor = '#00d4ff';
    } else {
      eduLabel = '↑ Steep slope = High speed';
      eduColor = '#39ff14';
    }

    ctx.fillStyle = eduColor;
    ctx.globalAlpha = 0.8;
    ctx.font = '10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(
      eduLabel,
      graphLeft + 8, graphBottom - 10
    );
    ctx.globalAlpha = 1.0;
  };

  useAnimation(draw, isVisible);

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }} />
      <div style={{
        padding: '12px 16px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Speed: {speed * 8} m/s</label>
          <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%', accentColor }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '6px 16px', borderRadius: '4px', background: `${accentColor}20`, color: accentColor, fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={() => { posRef.current = 0; pointsRef.current = []; }} style={{ padding: '6px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Reset</button>
        </div>
      </div>
    </div>
  );
};

// --- MOTION: VELOCITY TIME ---

export const MotionVelocityTime = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('uniform');
  const [isPlaying, setIsPlaying] = useState(true);
  const posRef = useRef(0);
  const velRef = useRef(mode === 'uniform' ? 4 : 1);
  const pointsRef = useRef([]);

  const canvasHeight = 350;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 600;
    canvas.height = canvasHeight;
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  useEffect(() => {
     posRef.current = 0; velRef.current = mode === 'uniform' ? 4 : 1; pointsRef.current = [];
  }, [mode]);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); 
    const w = canvas.width; 
    const h = canvasHeight;
    ctx.clearRect(0, 0, w, h);

    if (isPlaying) {
      if (mode === 'accel') velRef.current += 0.04;
      posRef.current += velRef.current;
      if (posRef.current > w - 40) { posRef.current = 0; velRef.current = mode === 'uniform' ? 4 : 1; pointsRef.current = []; }
      pointsRef.current.push(velRef.current);
    }

    ctx.fillStyle = accentColor;
    ctx.beginPath(); ctx.arc(posRef.current + 20, 50, 10, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = isDark ? '#fff' : '#000';
    ctx.font = '12px Courier';
    ctx.fillText(`v = ${velRef.current.toFixed(1)} m/s`, w - 100, 20);

    ctx.save();
    const graphLeft = 60;
    const graphTop = 100;
    const graphWidth = w - 100;
    const graphHeight = 80;
    const graphBottom = graphTop + graphHeight;
    
    // Axes labels
    ctx.fillStyle = accentColor;
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (seconds)', graphLeft + graphWidth/2, graphBottom + 35);
    
    ctx.save();
    ctx.translate(graphLeft - 35, graphTop + graphHeight/2);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = 'center';
    ctx.fillText('Velocity (m/s)', 0, 0);
    ctx.restore();
    
    // Graph Title
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    ctx.font = '11px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('VELOCITY-TIME GRAPH', graphLeft + graphWidth/2, graphTop - 10);

    ctx.strokeStyle = isDark ? '#555' : '#ccc';
    ctx.strokeRect(graphLeft, graphTop, graphWidth, graphHeight);
    
    // Ticks
    for(let t=0; t<=10; t++) {
      const x = graphLeft + (t/10)*graphWidth;
      ctx.beginPath(); ctx.moveTo(x, graphBottom); ctx.lineTo(x, graphBottom+5);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
      ctx.font = '10px Inter'; ctx.textAlign = 'center';
      if(t%2 === 0) ctx.fillText(t+'s', x, graphBottom+15);
    }
    for(let v=0; v<=20; v+=5) {
      const y = graphBottom - (v/20)*graphHeight;
      ctx.beginPath(); ctx.moveTo(graphLeft, y); ctx.lineTo(graphLeft-5, y); ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
      ctx.font = '10px Inter'; ctx.textAlign = 'right';
      ctx.fillText(v+'', graphLeft-8, y+3);
    }

    if (pointsRef.current.length > 1) {
      ctx.strokeStyle = mode === 'uniform' ? '#00d4ff' : '#ffdd4c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphLeft, graphBottom - pointsRef.current[0] * (graphHeight/20));
      pointsRef.current.forEach((v, i) => { 
        const lx = graphLeft + (i / 200) * graphWidth;
        const ly = graphBottom - v * (graphHeight/20);
        ctx.lineTo(lx, Math.max(graphTop, ly)); 
      });
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    ctx.restore();
  };

  useAnimation(draw, isVisible);

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }} />
      <div style={{
        padding: '12px 16px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setMode('uniform')} style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', background: mode === 'uniform' ? accentColor : 'transparent', color: mode === 'uniform' ? '#000' : 'inherit', border: mode === 'uniform' ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)' }}>Uniform</button>
           <button onClick={() => setMode('accel')} style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', background: mode === 'accel' ? accentColor : 'transparent', color: mode === 'accel' ? '#000' : 'inherit', border: mode === 'accel' ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)' }}>Accelerating</button>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '6px 16px', borderRadius: '4px', background: `${accentColor}20`, color: accentColor, fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 'auto' }}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </div>
  );
};

// --- MOTION: EQUATIONS ---

export const MotionEquations = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [u, setU] = useState(0); const [a, setA] = useState(2); const [t, setT] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(0);

  const v = u + (a * t);
  const s = (u * t) + (0.5 * a * t * t);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (isPlaying) { 
      timerRef.current += 0.016; 
      if (timerRef.current > t) timerRef.current = 0; 
    }
    const currentT = timerRef.current;
    const currentS = (u * currentT) + (0.5 * a * currentT * currentT);
    const pixelPos = (currentS / Math.max(1, s)) * (w - 100);

    ctx.strokeStyle = isDark ? '#333' : '#eee';
    ctx.lineWidth = 4; ctx.strokeRect(50, 160, w - 100, 2);
    ctx.fillStyle = accentColor; ctx.fillRect(50 + pixelPos - 15, 145, 30, 15);

    ctx.fillStyle = accentColor; ctx.font = 'bold 12px Orbitron';
    ctx.fillText(`v = u+at = ${v.toFixed(1)}m/s`, 20, 30);
    ctx.fillText(`s = ut+0.5at^2 = ${s.toFixed(1)}m`, 20, 50);
  };

  useAnimation(draw, isVisible);

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={200} className="w-full h-auto rounded" />
      <div className="animation-controls grid grid-cols-3 gap-2">
         <div className="control-group"><label className="control-label text-[10px]">u: {u}</label><input type="range" min="0" max="10" value={u} onChange={e => setU(Number(e.target.value))} /></div>
         <div className="control-group"><label className="control-label text-[10px]">a: {a}</label><input type="range" min="0" max="10" value={a} onChange={e => setA(Number(e.target.value))} /></div>
         <div className="control-group"><label className="control-label text-[10px]">t: {t}</label><input type="range" min="1" max="10" value={t} onChange={e => setT(Number(e.target.value))} /></div>
         <button onClick={() => { setIsPlaying(!isPlaying); timerRef.current = 0; }} className="col-span-3 py-2 bg-accent/20 text-accent font-bold uppercase text-[10px] rounded mt-2">{isPlaying ? 'Stop' : 'Run Animation'}</button>
      </div>
    </div>
  );
};

// --- LAWS: INERTIA ---

export const LawsInertia = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [scene, setScene] = useState(1);
  const timeRef = useRef(0);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    timeRef.current += 0.016; const t = timeRef.current;

    if (scene === 1) {
      const clothOffset = (t % 4 < 2) ? 0 : Math.min((t % 4 - 2) * 800, 400);
      ctx.fillStyle = isDark ? '#333' : '#ddd'; ctx.fillRect(100, 150, 300, 20);
      ctx.fillStyle = accentColor; ctx.fillRect(100 - clothOffset, 145, 300, 5);
      ctx.fillStyle = isDark ? '#fff' : '#444'; ctx.fillRect(240, 125, 20, 20);
      ctx.fillStyle = accentColor; ctx.textAlign = 'center'; ctx.fillText('Inertia of Rest', w/2, 40);
      if (t % 4 > 3.9) setScene(2);
    } else {
      const stopping = t % 4 >= 2 && t % 4 < 2.3;
      const lurch = stopping ? Math.sin((t % 4 - 2) * 10) * 20 : 0;
      ctx.strokeStyle = accentColor; ctx.strokeRect(150, 100, 200, 80);
      ctx.strokeStyle = isDark ? '#fff' : '#000'; ctx.beginPath(); ctx.moveTo(200 + lurch, 130); ctx.lineTo(200, 170); ctx.stroke();
      ctx.fillStyle = accentColor; ctx.textAlign = 'center'; ctx.fillText('Inertia of Motion', w/2, 40);
      if (t % 4 > 3.9) setScene(1);
    }
  };

  useAnimation(draw, isVisible);
  return <canvas ref={canvasRef} width={500} height={200} className="w-full h-auto rounded" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }} />;
};

// --- LAWS: F = MA ---

export const LawsNewton2 = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [f, setF] = useState(50);
  const [m, setM] = useState(10);
  const posRef = useRef(100);
  const velRef = useRef(0);
  const trailRef = useRef([]);

  const canvasHeight = 380;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 600;
    canvas.height = canvasHeight;
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvasHeight;
    ctx.clearRect(0, 0, w, h);

    const a = f / m;
    const maxAccel = 100 / 1; // max force / min mass = 100
    
    // Physics update
    velRef.current += a * 0.01;
    posRef.current += velRef.current;
    
    if (posRef.current > w - 80) { 
        posRef.current = 100; 
        velRef.current = 0; 
        trailRef.current = [];
    }

    if (velRef.current > 0.1 && Math.random() > 0.7) {
       trailRef.current.push({ x: posRef.current, opacity: 0.6 });
    }
    if (trailRef.current.length > 4) trailRef.current.shift();

    // ==========================================
    // TOP SECTION (60% height = 228px)
    // ==========================================
    const topH = h * 0.6;
    
    // Background
    ctx.fillStyle = isDark ? '#0d0d0d' : '#f5f5f5';
    ctx.fillRect(0, 0, w, topH);

    // Ground line
    const groundY = topH - 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();

    // Block
    const blockW = 50;
    const blockH = 50;
    const blockX = posRef.current;
    const blockY = groundY - blockH;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // Velocity Trail (clean dashes)
    trailRef.current.forEach((t, i) => {
        t.opacity -= 0.02;
        if (t.opacity > 0) {
            ctx.strokeStyle = `rgba(0,212,255,${t.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(t.x, blockY + blockH / 2);
            ctx.lineTo(t.x - 8, blockY + blockH / 2);
            ctx.stroke();
        }
    });

    // Force Arrow
    if (f > 0) {
        const arrowLen = f * 1.5;
        const arrowY = blockY + blockH / 2;
        const arrowStartX = blockX + blockW;
        
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowStartX + arrowLen, arrowY);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(arrowStartX + arrowLen, arrowY - 6);
        ctx.lineTo(arrowStartX + arrowLen + 12, arrowY);
        ctx.lineTo(arrowStartX + arrowLen, arrowY + 6);
        ctx.fill();
        
        // Label above arrow
        ctx.fillStyle = '#ff4444';
        ctx.font = '600 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`F = ${f}N`, arrowStartX + arrowLen / 2, arrowY - 12);
    }

    // Formula Display
    ctx.fillStyle = 'rgba(0,212,255,0.08)';
    ctx.strokeStyle = 'rgba(0,212,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(10, 10, 200, 65, 4);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 14px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText('F = m × a', 20, 32);
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px Inter';
    ctx.fillText(`[${f}N] = [${m}kg] × [${a.toFixed(2)} m/s²]`, 20, 55);

    // ==========================================
    // BOTTOM SECTION (40% height = 152px)
    // ==========================================
    const graphTop = topH + 25;
    const graphLeft = 55;
    const graphWidth = w - graphLeft - 20;
    const graphHeight = h - graphTop - 35;
    const graphBottom = graphTop + graphHeight;

    // Graph Background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(graphLeft, graphTop, graphWidth, graphHeight);

    // Grid Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        // Horizontal
        const gy = graphTop + (i / 5) * graphHeight;
        ctx.beginPath(); ctx.moveTo(graphLeft, gy); ctx.lineTo(graphLeft + graphWidth, gy); ctx.stroke();
        // Vertical
        const gx = graphLeft + (i / 5) * graphWidth;
        ctx.beginPath(); ctx.moveTo(gx, graphTop); ctx.lineTo(gx, graphBottom); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphLeft + graphWidth, graphBottom);
    ctx.stroke();

    // X-Axis Label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.fillText('Force (N)', graphLeft + graphWidth / 2, h - 5);

    // Y-Axis Label
    ctx.save();
    ctx.translate(15, graphTop + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.fillText('Acceleration (m/s²)', 0, 0);
    ctx.restore();

    // Graph Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '10px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`FORCE vs ACCELERATION (mass = ${m}kg)`, graphLeft + graphWidth / 2, graphTop - 8);

    // X Ticks
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 100; i += 20) {
        const tx = graphLeft + (i / 100) * graphWidth;
        ctx.fillText(i.toString(), tx, graphBottom + 12);
        ctx.beginPath(); ctx.moveTo(tx, graphBottom); ctx.lineTo(tx, graphBottom + 4); ctx.stroke();
    }

    // Y Ticks
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const val = (maxAccel * (i / 5)).toFixed(0);
        const ty = graphBottom - (i / 5) * graphHeight;
        ctx.fillText(val, graphLeft - 6, ty + 3);
        ctx.beginPath(); ctx.moveTo(graphLeft - 4, ty); ctx.lineTo(graphLeft, ty); ctx.stroke();
    }

    // Reference Line F ∝ a
    ctx.strokeStyle = 'rgba(0,212,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphBottom);
    // at F=100, a = 100/m
    const endA = 100 / m;
    ctx.lineTo(graphLeft + graphWidth, graphBottom - (endA / maxAccel) * graphHeight);
    ctx.stroke();

    // Annotation
    ctx.fillStyle = 'rgba(0,212,255,0.5)';
    ctx.font = 'italic 9px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Straight line = F ∝ a', graphLeft + graphWidth / 2 + 10, graphBottom - (endA / maxAccel / 2) * graphHeight + 10);

    // Current Point
    const currX = graphLeft + (f / 100) * graphWidth;
    const currY = graphBottom - (a / maxAccel) * graphHeight;
    
    ctx.save();
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(currX, currY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Point Label
    if (f > 10) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '9px Inter';
      ctx.textAlign = f > 80 ? 'right' : 'left';
      ctx.fillText(`(${f}N, ${a.toFixed(1)}m/s²)`, currX + (f > 80 ? -10 : 10), currY - 10);
    }
  };

  useAnimation(draw, isVisible);

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }} />
      <div style={{
        padding: '12px 16px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
         <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Force (N): {f}</label>
            <input type="range" min="0" max="100" value={f} onChange={e => setF(Number(e.target.value))} style={{ width: '100%', accentColor }} />
         </div>
         <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Mass (kg): {m}</label>
            <input type="range" min="1" max="20" value={m} onChange={e => setM(Number(e.target.value))} style={{ width: '100%', accentColor }} />
         </div>
      </div>
    </div>
  );
};

// --- LAWS: 3RD LAW ---

export const LawsNewton3 = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [forceMag, setForceMag] = useState(5);
  const [scenario, setScenario] = useState('swim');
  const timeRef = useRef(0);

  const canvasHeight = 320;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 600;
    canvas.height = canvasHeight;
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvasHeight;
    ctx.clearRect(0, 0, w, h);
    
    timeRef.current += 0.05;

    // ==========================================
    // TOP ZONE (15%) - Formula Display
    // ==========================================
    ctx.fillStyle = '#00d4ff';
    ctx.font = '12px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText("Newton's Third Law: F(action) = −F(reaction)", w / 2, 20);

    // ==========================================
    // MIDDLE ZONE (55%) - Main Illustration
    // ==========================================
    const midTop = h * 0.15;
    const midHeight = h * 0.55;
    const midCenterY = midTop + midHeight / 2;
    const cx = w / 2;

    const pulse1 = Math.sin(timeRef.current) * 0.2 + 0.8;
    const pulse2 = Math.sin(timeRef.current + Math.PI) * 0.2 + 0.8;
    const arrowLen = forceMag * 12; // Base length multiplier

    if (scenario === 'swim') {
      // Swimmer Box
      const boxW = 80;
      const boxH = 30;
      const boxX = cx - boxW / 2;
      const boxY = midCenterY - boxH / 2;
      
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      
      // Top Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('🏊 SWIMMER', cx, boxY - 10);

      // LEFT ARROW (Action)
      const leftStartX = boxX;
      const leftEndX = leftStartX - arrowLen;
      
      ctx.globalAlpha = pulse1;
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(leftStartX, midCenterY); ctx.lineTo(leftEndX, midCenterY); ctx.stroke();
      // Arrow head left
      ctx.fillStyle = '#ff4444';
      ctx.beginPath(); ctx.moveTo(leftEndX, midCenterY - 5); ctx.lineTo(leftEndX - 10, midCenterY); ctx.lineTo(leftEndX, midCenterY + 5); ctx.fill();
      
      ctx.font = '11px Inter';
      ctx.fillText('Action: Pushes water BACK', (leftStartX + leftEndX) / 2, midCenterY + 22);

      // RIGHT ARROW (Reaction)
      const rightStartX = boxX + boxW;
      const rightEndX = rightStartX + arrowLen;
      
      ctx.globalAlpha = pulse2;
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(rightStartX, midCenterY); ctx.lineTo(rightEndX, midCenterY); ctx.stroke();
      // Arrow head right
      ctx.fillStyle = '#39ff14';
      ctx.beginPath(); ctx.moveTo(rightEndX, midCenterY - 5); ctx.lineTo(rightEndX + 10, midCenterY); ctx.lineTo(rightEndX, midCenterY + 5); ctx.fill();
      
      ctx.fillText('Reaction: Body moves FORWARD', (rightStartX + rightEndX) / 2, midCenterY + 22);
      ctx.globalAlpha = 1.0;

    } else if (scenario === 'rocket') {
      // Rocket
      const rWidth = 30;
      const rHeight = 60;
      const rx = cx;
      const ry = midCenterY - 15;
      
      // Body
      ctx.fillStyle = '#607D8B';
      ctx.fillRect(rx - rWidth/2, ry - rHeight/2, rWidth, rHeight);
      // Nose
      ctx.beginPath(); ctx.moveTo(rx - rWidth/2, ry - rHeight/2); ctx.lineTo(rx, ry - rHeight/2 - 20); ctx.lineTo(rx + rWidth/2, ry - rHeight/2); ctx.fill();
      // Fins
      ctx.beginPath(); ctx.moveTo(rx - rWidth/2, ry + rHeight/2 - 15); ctx.lineTo(rx - rWidth/2 - 15, ry + rHeight/2 + 10); ctx.lineTo(rx - rWidth/2, ry + rHeight/2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + rWidth/2, ry + rHeight/2 - 15); ctx.lineTo(rx + rWidth/2 + 15, ry + rHeight/2 + 10); ctx.lineTo(rx + rWidth/2, ry + rHeight/2); ctx.fill();
      
      // DOWN ARROW (Action)
      const downStartY = ry + rHeight/2;
      const downEndY = downStartY + arrowLen;
      
      ctx.globalAlpha = pulse1;
      ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(rx, downStartY); ctx.lineTo(rx, downEndY); ctx.stroke();
      ctx.fillStyle = '#ff4444';
      ctx.beginPath(); ctx.moveTo(rx - 5, downEndY); ctx.lineTo(rx, downEndY + 10); ctx.lineTo(rx + 5, downEndY); ctx.fill();
      
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText('Action: Gas expelled DOWN ↓', rx - 15, (downStartY + downEndY)/2);

      // UP ARROW (Reaction)
      const upStartY = ry - rHeight/2 - 20;
      const upEndY = upStartY - arrowLen;
      
      ctx.globalAlpha = pulse2;
      ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(rx, upStartY); ctx.lineTo(rx, upEndY); ctx.stroke();
      ctx.fillStyle = '#39ff14';
      ctx.beginPath(); ctx.moveTo(rx - 5, upEndY); ctx.lineTo(rx, upEndY - 10); ctx.lineTo(rx + 5, upEndY); ctx.fill();
      
      ctx.textAlign = 'left';
      ctx.fillText('Reaction: Rocket goes UP ↑', rx + 15, (upStartY + upEndY)/2);
      ctx.globalAlpha = 1.0;

    } else if (scenario === 'wall') {
      // Wall
      const wallW = 40;
      const wallH = 100;
      const wallX = cx + 50;
      const wallY = midCenterY - wallH / 2;
      
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(wallX, wallY, wallW, wallH);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1;
      for(let i=10; i<wallH; i+=10) {
        ctx.beginPath(); ctx.moveTo(wallX, wallY + i); ctx.lineTo(wallX + wallW, wallY + i); ctx.stroke();
      }

      // Person
      const px = cx - 50;
      const py = midCenterY;
      ctx.strokeStyle = isDark ? '#fff' : '#000';
      ctx.lineWidth = 2;
      // Head
      ctx.beginPath(); ctx.arc(px, py - 30, 10, 0, Math.PI*2); ctx.stroke();
      // Body
      ctx.beginPath(); ctx.moveTo(px, py - 20); ctx.lineTo(px, py + 20); ctx.stroke();
      // Arms pushing
      ctx.beginPath(); ctx.moveTo(px, py - 10); ctx.lineTo(wallX, py - 5); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px - 15, py + 50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px + 10, py + 50); ctx.stroke();

      // Right ARROW (Action - Person to Wall)
      const actionY = py - 15;
      ctx.globalAlpha = pulse1;
      ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px + 10, actionY); ctx.lineTo(px + 10 + arrowLen, actionY); ctx.stroke();
      ctx.fillStyle = '#ff4444';
      ctx.beginPath(); ctx.moveTo(px + 10 + arrowLen, actionY - 5); ctx.lineTo(px + 10 + arrowLen + 10, actionY); ctx.lineTo(px + 10 + arrowLen, actionY + 5); ctx.fill();
      
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Action: Person pushes WALL →', px + 10 + arrowLen/2, actionY - 10);

      // Left ARROW (Reaction - Wall to Person)
      const reactionY = py + 15;
      ctx.globalAlpha = pulse2;
      ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(wallX - 10, reactionY); ctx.lineTo(wallX - 10 - arrowLen, reactionY); ctx.stroke();
      ctx.fillStyle = '#39ff14';
      ctx.beginPath(); ctx.moveTo(wallX - 10 - arrowLen, reactionY - 5); ctx.lineTo(wallX - 10 - arrowLen - 10, reactionY); ctx.lineTo(wallX - 10 - arrowLen, reactionY + 5); ctx.fill();
      
      ctx.fillText('← Reaction: Wall pushes PERSON back', wallX - 10 - arrowLen/2, reactionY + 20);
      ctx.globalAlpha = 1.0;
    }
  };

  useAnimation(draw, isVisible);

  const getBtnStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: isActive ? accentColor : 'transparent',
    color: isActive ? '#000' : (isDark ? '#ccc' : '#555'),
    border: isActive ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: `${canvasHeight}px`, display: 'block' }} />
      
      <div style={{
        padding: '16px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center'
      }}>
         <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
           <button onClick={() => setScenario('rocket')} style={getBtnStyle(scenario === 'rocket')}>🚀 Rocket</button>
           <button onClick={() => setScenario('swim')} style={getBtnStyle(scenario === 'swim')}>🏊 Swimming</button>
           <button onClick={() => setScenario('wall')} style={getBtnStyle(scenario === 'wall')}>🧱 Wall Push</button>
         </div>
         <div style={{ width: '100%', maxWidth: '300px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textAlign: 'center' }}>
              Force Magnitude: {forceMag}
            </label>
            <input type="range" min="1" max="10" value={forceMag} onChange={e => setForceMag(Number(e.target.value))} style={{ width: '100%', accentColor }} />
         </div>
      </div>
    </div>
  );
};

// --- GRAVITATION: FREE FALL ---

export const GravitationFreeFall = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [airRes, setAirRes] = useState(false);
  const [dropping, setDropping] = useState(false);
  const timeRef = useRef(0);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (dropping) timeRef.current += 0.016;
    const t = timeRef.current;
    const ground = h - 30;
    const by = Math.min(ground - 10, 40 + 0.5 * 150 * t * t);
    const fy = Math.min(ground - 10, 40 + 0.5 * (airRes ? 20 : 150) * t * t);
    ctx.fillStyle = isDark ? '#333' : '#eee'; ctx.fillRect(0, ground, w, 30);
    ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(150, by, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(350, fy, 8, 15, 0.5, 0, Math.PI*2); ctx.fill();
    if (by >= ground-11 && fy >= ground-11) setDropping(false);
  };
  useAnimation(draw, isVisible);
  return (
    <div>
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-auto rounded" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }} />
      <div className="animation-controls flex gap-2">
         <button onClick={() => setAirRes(!airRes)} className={`px-4 py-1 rounded text-[10px] font-bold ${airRes ? 'bg-accent text-white' : (isDark ? 'bg-white/5' : 'bg-black/5')}`}>Air Resistance: {airRes?'ON':'OFF'}</button>
         <button onClick={() => { setDropping(true); timeRef.current = 0; }} className="ml-auto px-4 py-1 bg-accent/20 text-accent text-[10px] font-bold rounded uppercase">Drop</button>
      </div>
    </div>
  );
};

// --- GRAVITATION: UNIVERSAL LAW ---

export const GravitationUniversal = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [m1, setM1] = useState(50);
  const [m2, setM2] = useState(50);
  const [r, setR] = useState(150);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w/2; const cy = h/2;
    const x1 = cx - r/2; const x2 = cx + r/2;
    const force = (m1 * m2) / (r * r / 100);
    ctx.fillStyle = accentColor;
    ctx.beginPath(); ctx.arc(x1, cy, m1/8+5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x2, cy, m2/8+5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = force/2+1;
    ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x1+force*3, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, cy); ctx.lineTo(x2-force*3, cy); ctx.stroke();
    ctx.fillStyle = isDark ? '#fff' : '#000'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(`Force F = ${force.toFixed(2)} units`, cx, 40);
  };
  useAnimation(draw, isVisible);
  return (
    <div>
      <canvas ref={canvasRef} width={500} height={180} className="w-full h-auto rounded" />
      <div className="animation-controls grid grid-cols-3 gap-2">
         <div className="control-group"><label className="control-label text-[9px]">M1</label><input type="range" min="10" max="100" value={m1} onChange={e=>setM1(Number(e.target.value))} /></div>
         <div className="control-group"><label className="control-label text-[9px]">M2</label><input type="range" min="10" max="100" value={m2} onChange={e=>setM2(Number(e.target.value))} /></div>
         <div className="control-group"><label className="control-label text-[9px]">Dist</label><input type="range" min="50" max="250" value={r} onChange={e=>setR(Number(e.target.value))} /></div>
      </div>
    </div>
  );
};

// --- LIGHT: REFLECTION ---

export const LightReflection = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const mx = w/2; const my = h - 40;
    ctx.strokeStyle = isDark ? '#fff' : '#333'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(50, my); ctx.lineTo(w-50, my); ctx.stroke();
    const rad = angle * (Math.PI/180);
    const lx = mx - Math.sin(rad)*150; const ly = my - Math.cos(rad)*150;
    const rx = mx + Math.sin(rad)*150; const ry = my - Math.cos(rad)*150;
    ctx.strokeStyle = '#ff0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(mx, my); ctx.lineTo(rx, ry); ctx.stroke();
    ctx.fillStyle = accentColor; ctx.font = '10px Orbitron'; ctx.fillText(`i=r=${angle}°`, mx-20, my-160);
  };
  useAnimation(draw, isVisible);
  return (
    <div>
      <canvas ref={canvasRef} width={500} height={220} className="w-full h-auto rounded" />
      <div className="animation-controls">
         <input type="range" min="10" max="80" value={angle} onChange={e=>setAngle(Number(e.target.value))} className="w-full" />
      </div>
    </div>
  );
};

// --- LIGHT: REFRACTION ---

export const LightRefraction = ({ accentColor, isDark, isVisible }) => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(30);
  const [n, setN] = useState(1.33);
  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const mx = w/2; const my = h/2;
    ctx.fillStyle = isDark ? '#1a1a2e' : '#e0e7ff'; ctx.fillRect(0, my, w, my);
    const iRad = angle * (Math.PI/180);
    const rRad = Math.asin(Math.sin(iRad)/n);
    ctx.strokeStyle = '#ff0'; ctx.beginPath(); ctx.moveTo(mx-Math.sin(iRad)*100, my-Math.cos(iRad)*100); ctx.lineTo(mx, my); ctx.stroke();
    ctx.strokeStyle = '#0ff'; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx+Math.sin(rRad)*100, my+Math.cos(rRad)*100); ctx.stroke();
    ctx.fillStyle = isDark ? '#fff' : '#000'; ctx.font = '10px Orbitron';
    ctx.fillText(`i: ${angle}°  r: ${(rRad*180/Math.PI).toFixed(0)}°`, 20, 30);
  };
  useAnimation(draw, isVisible);
  return (
    <div>
      <canvas ref={canvasRef} width={500} height={220} className="w-full h-auto rounded" />
      <div className="animation-controls grid grid-cols-2 gap-2">
         <input type="range" min="0" max="70" value={angle} onChange={e=>setAngle(Number(e.target.value))} />
         <select value={n} onChange={e=>setN(Number(e.target.value))} className="bg-black/20 text-white text-[10px] rounded p-1">
            <option value="1.33">Water (1.33)</option>
            <option value="1.5">Glass (1.5)</option>
            <option value="2.42">Diamond (2.42)</option>
         </select>
      </div>
    </div>
  );
};
