import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CellsCytoplasm = ({ accentColor, isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const numParticles = 150;

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        color: isDark ? `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})` : `rgba(0, 0, 0, ${Math.random() * 0.2 + 0.05})`
      });
    }

    // Organelles drifting slowly
    const organelles = [
      { type: 'mitochondria', x: 50, y: 50, vx: 0.1, vy: -0.05, w: 20, h: 10, color: '#ef4444' },
      { type: 'mitochondria', x: 200, y: 120, vx: -0.1, vy: 0.1, w: 18, h: 9, color: '#ef4444' },
      { type: 'lysosome', x: 150, y: 40, vx: 0.05, vy: 0.1, r: 8, color: '#eab308' },
      { type: 'vesicle', x: 80, y: 150, vx: 0.15, vy: -0.1, r: 6, color: '#3b82f6' },
      { type: 'vesicle', x: 220, y: 60, vx: -0.05, vy: -0.15, r: 5, color: '#3b82f6' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw streaming arrow
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)/2 - 30, 0, Math.PI * 1.5);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 20;
      ctx.stroke();

      // Draw particles (Brownian motion)
      particles.forEach(p => {
        // Add random jitter for Brownian motion
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        
        // Limit speed
        p.vx = Math.max(-1, Math.min(1, p.vx));
        p.vy = Math.max(-1, Math.min(1, p.vy));
        
        // Streaming flow (circular)
        const dx = p.x - canvas.width/2;
        const dy = p.y - canvas.height/2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist > 0) {
          p.x += -dy/dist * 0.2; // circular flow
          p.y += dx/dist * 0.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw drifting organelles
      organelles.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        
        if (o.x < 0) o.x = canvas.width;
        if (o.x > canvas.width) o.x = 0;
        if (o.y < 0) o.y = canvas.height;
        if (o.y > canvas.height) o.y = 0;

        ctx.fillStyle = o.color;
        if (o.type === 'mitochondria') {
          ctx.beginPath();
          ctx.ellipse(o.x, o.y, o.w, o.h, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = isDark ? '#fff' : '#000';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          // Inner cristae lines
          ctx.beginPath();
          ctx.moveTo(o.x - o.w + 5, o.y); ctx.lineTo(o.x - o.w + 10, o.y);
          ctx.moveTo(o.x + o.w - 5, o.y); ctx.lineTo(o.x + o.w - 10, o.y);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Cytoplasm — The Cell's Liquid Interior
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Visual: Canvas */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[250px] rounded-full overflow-hidden border-4 border-blue-400/30 bg-[#e0f2fe] dark:bg-[#082f49] shadow-inner">
            <canvas 
              ref={canvasRef} 
              width={250} 
              height={250} 
              className="absolute inset-0 w-full h-full"
            />
            {/* Cytoskeleton overlay */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="10" y1="20" x2="90" y2="80" stroke="white" strokeWidth="0.5" />
              <line x1="20" y1="90" x2="80" y2="10" stroke="white" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="60" stroke="white" strokeWidth="0.5" />
              <line x1="40" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
            </svg>
            
            {/* Labels overlay */}
            <div className="absolute top-[20%] left-[60%] text-[8px] font-bold bg-white/80 dark:bg-black/80 px-1 rounded shadow pointer-events-none">Mitochondria</div>
            <div className="absolute top-[60%] left-[20%] text-[8px] font-bold bg-white/80 dark:bg-black/80 px-1 rounded shadow pointer-events-none">Vesicles</div>
            
            <div className="absolute bottom-4 w-full text-center text-[10px] font-bold uppercase tracking-widest text-blue-900 dark:text-blue-200 pointer-events-none">
              Cytoplasmic Streaming
            </div>
          </div>
        </div>

        {/* Info Panels */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Composition Pie Chart */}
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10 flex items-center gap-4">
            <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10"
                 style={{ 
                   background: 'conic-gradient(#3b82f6 0% 70%, #ef4444 70% 85%, #eab308 85% 95%, #9ca3af 95% 100%)' 
                 }}
            >
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white dark:bg-[#111] rounded-full"></div>
            </div>
            <div className="flex-1 text-[10px]">
              <div className="font-bold mb-1 uppercase tracking-widest opacity-70">Composition</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#3b82f6]" /> 70-80% Water</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ef4444]" /> 15% Proteins</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#eab308]" /> 10% Lipids & Carbs</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#9ca3af]" /> 5% Ions & Waste</div>
            </div>
          </div>

          {/* Functions List */}
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10 flex-1">
            <div className="font-bold text-sm mb-3">Key Functions:</div>
            <div className="space-y-3 text-xs opacity-80">
              <div className="flex gap-2">
                <span className="text-xl">🌊</span>
                <div><span className="font-bold">Suspends Organelles:</span> Keeps cellular structures in place.</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">🧪</span>
                <div><span className="font-bold">Reaction Site:</span> Location for many metabolic reactions (e.g., glycolysis).</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">📦</span>
                <div><span className="font-bold">Storage:</span> Stores essential nutrients, salts, and proteins.</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">🔄</span>
                <div><span className="font-bold">Transport:</span> Helps move materials around via cytoplasmic streaming.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
