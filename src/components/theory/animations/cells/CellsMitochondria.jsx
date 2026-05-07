import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CellsMitochondria = ({ accentColor, isDark }) => {
  const [atpCount, setAtpCount] = useState(0);
  const [producing, setProducing] = useState(false);

  const startProduction = () => {
    if (producing) return;
    setProducing(true);
    // Add 36 ATP over 4 seconds
    let count = 0;
    const interval = setInterval(() => {
      count += 3;
      setAtpCount(prev => prev + 3);
      if (count >= 36) {
        clearInterval(interval);
        setProducing(false);
      }
    }, 300);
  };

  const reset = () => setAtpCount(0);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Mitochondria — Energy Factory
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="px-2 py-1 text-[10px] uppercase rounded border border-black/20 dark:border-white/20 hover:bg-black/10">Reset</button>
          <button 
            onClick={startProduction}
            disabled={producing}
            className="px-3 py-1 text-[10px] font-bold uppercase rounded bg-red-500 text-white disabled:opacity-50 flex items-center gap-1"
          >
            <span>⚡</span> {producing ? 'Generating ATP...' : 'Add Glucose & O₂'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full items-center">
        
        {/* Main Visual */}
        <div className="relative w-full max-w-[350px] h-64 flex items-center justify-center">
          
          <svg viewBox="0 0 300 200" className="w-full h-full drop-shadow-xl">
            
            {/* Outer Membrane */}
            <path d="M 50 100 Q 50 30 150 30 T 250 100 Q 250 170 150 170 T 50 100" fill="rgba(255,80,30,0.08)" stroke="rgba(255,100,50,0.8)" strokeWidth="4" />
            
            {/* Inner Membrane & Cristae */}
            <path d="
              M 60 100 
              Q 60 40 150 40 
              T 240 100 
              Q 240 160 150 160 
              T 60 100" 
              fill="rgba(255,140,70,0.12)" stroke="none" 
            />
            
            {/* Drawing individual folded cristae */}
            <path d="
              M 60 100 Q 70 80 100 90 Q 80 100 65 110
              M 80 45 Q 100 65 120 50 Q 110 70 95 45
              M 150 40 Q 140 70 160 80 Q 170 60 165 42
              M 220 60 Q 190 70 180 90 Q 210 100 235 80
              M 240 110 Q 200 115 190 130 Q 220 140 230 150
              M 160 160 Q 150 130 130 140 Q 140 160 145 158
              M 90 150 Q 110 120 120 130 Q 100 155 95 152
            " fill="none" stroke="rgba(255,120,60,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            <path d="
              M 60 100 
              Q 60 40 150 40 
              T 240 100 
              Q 240 160 150 160 
              T 60 100" 
              fill="none" stroke="rgba(255,120,60,0.7)" strokeWidth="3" 
            />

            {/* Mitochondrial DNA (Circular) */}
            <circle cx="150" cy="110" r="10" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="120" cy="120" r="8" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 1" />
            <text x="110" y="140" fill="#fff" fontSize="6" opacity="0.6">mtDNA</text>

            {/* Ribosomes */}
            <circle cx="100" cy="70" r="1.5" fill="#fff" opacity="0.8"/>
            <circle cx="110" cy="65" r="1.5" fill="#fff" opacity="0.8"/>
            <circle cx="180" cy="110" r="1.5" fill="#fff" opacity="0.8"/>
            <circle cx="190" cy="130" r="1.5" fill="#fff" opacity="0.8"/>
            <text x="175" y="145" fill="#fff" fontSize="6" opacity="0.6">Ribosomes</text>

            {/* Labels */}
            <line x1="20" y1="20" x2="60" y2="50" stroke="#FF5722" strokeWidth="1" />
            <text x="0" y="15" fill="#FF5722" fontSize="8" fontWeight="bold">Outer Membrane</text>

            <line x1="280" y1="20" x2="220" y2="60" stroke="#FF8A65" strokeWidth="1" />
            <text x="260" y="15" fill="#FF8A65" fontSize="8" fontWeight="bold">Cristae (Folds)</text>

            <text x="135" y="100" fill="#fff" fontSize="8" fontWeight="bold" opacity="0.8">Matrix</text>

            {/* Animation Sequences */}
            <AnimatePresence>
              {producing && (
                <g>
                  {/* Glucose entering */}
                  <motion.polygon 
                    points="0,-5 5,-2 5,4 0,7 -5,4 -5,-2" fill="#facc15"
                    initial={{ x: 0, y: 100, opacity: 1 }}
                    animate={{ x: 150, y: 100, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeIn" }}
                  />
                  <motion.text x="5" y="90" fill="#facc15" fontSize="6" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }}>Glucose</motion.text>

                  {/* O2 entering */}
                  <motion.circle cx="0" cy="0" r="3" fill="#22d3ee" initial={{ x: 0, y: 120 }} animate={{ x: 150, y: 120, opacity: 0 }} transition={{ duration: 1.5 }} />
                  <motion.circle cx="0" cy="0" r="3" fill="#22d3ee" initial={{ x: 0, y: 125 }} animate={{ x: 150, y: 125, opacity: 0 }} transition={{ duration: 1.5, delay: 0.2 }} />

                  {/* ATP Bursting out from Cristae */}
                  {Array.from({length: 12}).map((_, i) => (
                    <motion.text 
                      key={`atp-${i}`}
                      x="150" y="100" fill="#fbbf24" fontSize="12" fontWeight="bold"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1.5, 0.5],
                        x: 150 + Math.cos(i*30) * 100,
                        y: 100 + Math.sin(i*30) * 80
                      }}
                      transition={{ duration: 2, delay: 1.5 + (i * 0.2) }}
                    >
                      ⚡
                    </motion.text>
                  ))}

                  {/* CO2 and H2O leaving */}
                  <motion.circle cx="0" cy="0" r="3" fill="#9ca3af" initial={{ x: 150, y: 100, opacity: 0 }} animate={{ x: 300, y: 60, opacity: 1 }} transition={{ duration: 2, delay: 2 }} />
                  <motion.text x="260" y="55" fill="#9ca3af" fontSize="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>CO₂ + H₂O</motion.text>
                </g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* Info & Equation Panel */}
        <div className="flex-1 w-full flex flex-col gap-4">
          
          {/* Energy Counter */}
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-2">Energy Produced</div>
            <div className="text-4xl font-black text-red-500 drop-shadow-md">
              {atpCount} <span className="text-xl">ATP</span>
            </div>
            <div className="text-[9px] mt-2 opacity-60">1 Glucose ≈ 36 ATP molecules</div>
          </div>

          {/* Equation */}
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10">
            <div className="text-xs font-bold mb-2">Cellular Respiration Equation:</div>
            <div className="flex flex-wrap gap-1 text-[10px] font-mono font-bold items-center justify-center bg-black/10 dark:bg-white/10 p-2 rounded">
              <span className="text-yellow-500">C₆H₁₂O₆</span> + <span className="text-cyan-500">6O₂</span>
              <span className="mx-2">→</span>
              <span className="text-gray-500">6CO₂</span> + <span className="text-blue-500">6H₂O</span> + <span className="text-red-500">ATP Energy</span>
            </div>
          </div>

          {/* Unique Features */}
          <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20 text-orange-700 dark:text-orange-300">
            <div className="text-xs font-bold mb-2 flex items-center gap-2"><span>🧬</span> Semi-Autonomous Organelle</div>
            <div className="text-[10px] space-y-1 opacity-90">
              <p>Mitochondria are unique because they have their <span className="font-bold text-orange-500">own DNA (mtDNA)</span> and ribosomes.</p>
              <p>They can make some of their own proteins and replicate independently of the cell!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
