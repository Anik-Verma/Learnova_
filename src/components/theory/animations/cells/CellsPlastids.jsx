import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CellsPlastids = ({ accentColor, isDark }) => {
  const [reactionMode, setReactionMode] = useState('both'); // 'light', 'dark', 'both'

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Chloroplast — Solar Panel Lab
        </div>
        <div className="flex bg-black/10 dark:bg-white/10 rounded overflow-hidden">
          {['both', 'light', 'dark'].map(mode => (
            <button 
              key={mode}
              onClick={() => setReactionMode(mode)}
              className={`px-3 py-1 text-[9px] font-bold uppercase transition-all ${reactionMode === mode ? 'bg-green-600 text-white' : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-70'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full items-center">
        
        {/* Main Visual */}
        <div className="relative w-full max-w-[350px] h-64 flex items-center justify-center">
          <svg viewBox="0 0 300 200" className="w-full h-full drop-shadow-lg">
            
            {/* Outer Envelope (Double Membrane) */}
            <path d="M 40 100 Q 40 30 150 30 T 260 100 Q 260 170 150 170 T 40 100" fill="rgba(40,160,40,0.08)" stroke="rgba(40,160,40,0.8)" strokeWidth="3" />
            <path d="M 46 100 Q 46 36 150 36 T 254 100 Q 254 164 150 164 T 46 100" fill="rgba(60,180,60,0.1)" stroke="rgba(40,160,40,0.8)" strokeWidth="1.5" />
            
            {/* Stroma (Background) */}
            <motion.path 
              d="M 50 100 Q 50 40 150 40 T 250 100 Q 250 160 150 160 T 50 100" 
              fill="none"
              animate={{ fill: (reactionMode === 'dark' || reactionMode === 'both') ? "rgba(60,200,60,0.15)" : "transparent" }}
            />

            {/* Stroma Lamellae (Connecting channels) */}
            <path d="M 100 80 L 150 70 L 200 80 M 100 120 L 150 130 L 200 120 M 100 100 L 150 100 M 150 100 L 200 100" stroke="rgba(30,130,30,0.3)" strokeWidth="4" />

            {/* Grana (Stacks of Thylakoids) */}
            <g transform="translate(100, 100)">
              <motion.g animate={{ scale: (reactionMode === 'light' || reactionMode === 'both') ? 1.05 : 1, filter: (reactionMode === 'light' || reactionMode === 'both') ? "drop-shadow(0 0 5px rgba(34,197,94,0.8))" : "none" }}>
                <rect x="-15" y="-25" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="-15" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="-5" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="5" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="15" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
              </motion.g>
            </g>

            <g transform="translate(150, 100)">
              <motion.g animate={{ scale: (reactionMode === 'light' || reactionMode === 'both') ? 1.05 : 1, filter: (reactionMode === 'light' || reactionMode === 'both') ? "drop-shadow(0 0 5px rgba(34,197,94,0.8))" : "none" }}>
                <rect x="-15" y="-30" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="-20" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="-10" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="0" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="10" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="20" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
              </motion.g>
            </g>

            <g transform="translate(200, 100)">
              <motion.g animate={{ scale: (reactionMode === 'light' || reactionMode === 'both') ? 1.05 : 1, filter: (reactionMode === 'light' || reactionMode === 'both') ? "drop-shadow(0 0 5px rgba(34,197,94,0.8))" : "none" }}>
                <rect x="-15" y="-20" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="-10" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="0" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
                <rect x="-15" y="10" width="30" height="8" rx="4" fill="rgba(20,120,20,0.9)" stroke="rgba(30,150,30,0.9)" />
              </motion.g>
            </g>

            {/* Labels */}
            <line x1="60" y1="50" x2="10" y2="40" stroke="#15803d" strokeWidth="1" />
            <text x="0" y="35" fill="#15803d" fontSize="6" fontWeight="bold">Double Membrane</text>

            <line x1="200" y1="80" x2="250" y2="40" stroke="#16a34a" strokeWidth="1" />
            <text x="240" y="35" fill="#16a34a" fontSize="6" fontWeight="bold">Granum (Thylakoid stack)</text>

            <text x="135" y="150" fill="#15803d" fontSize="8" fontWeight="bold">Stroma</text>


            {/* ANIMATIONS */}
            {(reactionMode === 'light' || reactionMode === 'both') && (
              <g>
                {/* Sunlight */}
                <motion.path 
                  d="M 10 10 L 80 80 M 30 0 L 90 60 M 0 30 L 60 90" 
                  stroke="#fde047" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], strokeDashoffset: [100, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {/* H2O Entering */}
                <motion.circle cx="100" cy="180" r="3" fill="#3b82f6" initial={{ y: 180 }} animate={{ y: 120, opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity }} />
                
                {/* O2 Leaving */}
                <motion.circle cx="100" cy="80" r="3" fill="#93c5fd" initial={{ y: 80, x: 100 }} animate={{ y: 20, x: 80, opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
              </g>
            )}

            {(reactionMode === 'dark' || reactionMode === 'both') && (
              <g>
                {/* CO2 Entering */}
                <motion.circle cx="280" cy="100" r="3" fill="#9ca3af" initial={{ x: 280 }} animate={{ x: 200, opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity }} />
                
                {/* Glucose Being Produced (Hexagons in Stroma) */}
                <motion.polygon 
                  points="230,125 235,130 235,138 230,143 225,138 225,130" 
                  fill="#facc15" stroke="#ca8a04" strokeWidth="1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.2], y: -20 }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
              </g>
            )}
            
            {/* Transfer ATP/NADPH between Grana and Stroma if both */}
            {reactionMode === 'both' && (
              <motion.path 
                d="M 120 100 Q 135 80 150 100 Q 135 120 120 100" 
                fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2"
                animate={{ strokeDashoffset: [0, 20] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </svg>
        </div>

        {/* Info Panel */}
        <div className="flex-1 w-full flex flex-col gap-4">
          
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10 text-xs">
            <div className="font-bold mb-2">Photosynthesis Equation</div>
            <div className="flex flex-wrap gap-1 text-[10px] font-mono font-bold items-center justify-center bg-black/10 dark:bg-white/10 p-2 rounded">
              <span className="text-gray-500">6CO₂</span> + <span className="text-blue-500">6H₂O</span> + <span className="text-yellow-500">Light</span>
              <span className="mx-2">→</span>
              <span className="text-yellow-600">C₆H₁₂O₆ (Glucose)</span> + <span className="text-cyan-500">6O₂</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div 
              className={`p-3 rounded border-l-4 transition-all ${reactionMode === 'light' || reactionMode === 'both' ? 'bg-yellow-500/10 border-yellow-500 opacity-100' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-40'}`}
            >
              <div className="font-bold text-xs text-yellow-600 dark:text-yellow-400">Light Reactions (In Thylakoids)</div>
              <ul className="text-[10px] mt-1 list-disc pl-4">
                <li>Requires sunlight.</li>
                <li>Chlorophyll absorbs light energy.</li>
                <li>Splits H₂O to release O₂.</li>
                <li>Produces ATP & NADPH.</li>
              </ul>
            </div>

            <div 
              className={`p-3 rounded border-l-4 transition-all ${reactionMode === 'dark' || reactionMode === 'both' ? 'bg-green-500/10 border-green-500 opacity-100' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-40'}`}
            >
              <div className="font-bold text-xs text-green-600 dark:text-green-400">Dark Reactions / Calvin Cycle (In Stroma)</div>
              <ul className="text-[10px] mt-1 list-disc pl-4">
                <li>Does not need light directly.</li>
                <li>Uses ATP & NADPH from light reactions.</li>
                <li>Fixes CO₂ gas into solid Glucose (sugar).</li>
              </ul>
            </div>
          </div>

          {/* Types of Plastids */}
          <div className="text-[9px] flex justify-between bg-black/5 dark:bg-white/5 p-2 rounded">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> <span className="font-bold">Chloroplasts</span> (Photosynthesis)</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> <span className="font-bold">Chromoplasts</span> (Color/Pigment)</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-white border border-gray-400 rounded-full" /> <span className="font-bold">Leucoplasts</span> (Storage)</div>
          </div>

        </div>
      </div>
    </div>
  );
};
