import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CellsGolgi = ({ accentColor, isDark }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full relative">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Golgi — The Cell's Post Office
        </div>
        <button 
          onClick={() => setIsPlaying(true)}
          disabled={isPlaying}
          className="px-3 py-1 text-[10px] font-bold uppercase rounded bg-orange-500 text-white disabled:opacity-50"
        >
          {isPlaying ? 'Processing...' : 'Run Golgi Sequence'}
        </button>
      </div>

      <div className="relative w-full h-64 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
        
        {/* Post Office Analogy Graphic */}
        <div className="absolute top-2 right-2 flex flex-col items-end opacity-60 pointer-events-none">
          <div className="text-xl">📦 ➔ 🏷️ ➔ 🚚</div>
          <div className="text-[8px] uppercase tracking-widest font-bold">Receive • Sort/Modify • Ship</div>
        </div>

        <svg viewBox="0 0 300 200" className="w-full h-full max-w-[400px]">
          
          {/* Golgi Cisternae Stack */}
          {/* Cis Face (Bottom/Left) to Trans Face (Top/Right) */}
          <g>
            <path d="M 120 150 Q 150 160 180 150 Q 160 145 150 145 Q 140 145 120 150 Z" fill="rgba(255,200,50,0.3)" stroke="rgba(220,160,20,0.8)" strokeWidth="2" />
            <path d="M 125 135 Q 150 145 175 135 Q 160 130 150 130 Q 140 130 125 135 Z" fill="rgba(255,190,45,0.4)" stroke="rgba(220,160,20,0.8)" strokeWidth="2" />
            <path d="M 130 120 Q 150 130 170 120 Q 160 115 150 115 Q 140 115 130 120 Z" fill="rgba(255,180,40,0.5)" stroke="rgba(220,160,20,0.8)" strokeWidth="2" />
            <path d="M 135 105 Q 150 115 165 105 Q 160 100 150 100 Q 140 100 135 105 Z" fill="rgba(255,170,35,0.6)" stroke="rgba(220,160,20,0.8)" strokeWidth="2" />
            <path d="M 140 90 Q 150 100 160 90 Q 155 85 150 85 Q 145 85 140 90 Z" fill="rgba(255,160,30,0.7)" stroke="rgba(220,160,20,0.8)" strokeWidth="2" />
            
            {/* Text inside */}
            <text x="150" y="125" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">Processing...</text>
          </g>

          {/* Labels */}
          <text x="60" y="155" fill="#B77B1E" fontSize="8" fontWeight="bold">Cis face</text>
          <text x="60" y="165" fill="#B77B1E" fontSize="6">(receiving from ER)</text>

          <text x="180" y="80" fill="#B77B1E" fontSize="8" fontWeight="bold">Trans face</text>
          <text x="180" y="90" fill="#B77B1E" fontSize="6">(shipping side)</text>

          {/* Animation Sequence */}
          <AnimatePresence onExitComplete={() => setIsPlaying(false)}>
            {isPlaying && (
              <g>
                {/* 1. Arriving Vesicle from ER */}
                <motion.g
                  initial={{ x: 20, y: 155, opacity: 0 }}
                  animate={{ x: 100, y: 155, opacity: [0, 1, 0] }}
                  transition={{ duration: 2, ease: "easeIn" }}
                >
                  <circle cx="0" cy="0" r="8" fill="rgba(63,81,181,0.5)" stroke="#3F51B5" strokeWidth="1" />
                  <circle cx="0" cy="0" r="3" fill="#ef4444" />
                  <text x="-15" y="-12" fill="#3F51B5" fontSize="6">From ER</text>
                </motion.g>

                {/* 2. Processing flash */}
                <motion.circle 
                  cx="150" cy="120" r="20" fill="none" stroke="#fff" strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 2 }}
                />

                {/* 3. Outgoing Vesicles */}
                {/* To Secretion */}
                <motion.g
                  initial={{ x: 150, y: 85, opacity: 0, scale: 0 }}
                  animate={{ x: 100, y: 20, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 1] }}
                  transition={{ duration: 3, delay: 3, ease: "easeOut" }}
                >
                  <circle cx="0" cy="0" r="6" fill="rgba(255,160,30,0.7)" stroke="#E65100" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="#ef4444" />
                  <text x="10" y="0" fill="#E65100" fontSize="6">→ Secretion (outside cell)</text>
                </motion.g>

                {/* To Lysosome */}
                <motion.g
                  initial={{ x: 150, y: 85, opacity: 0, scale: 0 }}
                  animate={{ x: 220, y: 40, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 1] }}
                  transition={{ duration: 3, delay: 3.2, ease: "easeOut" }}
                >
                  <circle cx="0" cy="0" r="6" fill="rgba(255,80,80,0.7)" stroke="#d32f2f" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="#ef4444" />
                  <text x="10" y="0" fill="#d32f2f" fontSize="6">→ Lysosome</text>
                </motion.g>

                {/* Intracellular */}
                <motion.g
                  initial={{ x: 150, y: 85, opacity: 0, scale: 0 }}
                  animate={{ x: 250, y: 120, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 1] }}
                  transition={{ duration: 3, delay: 3.4, ease: "easeOut" }}
                >
                  <circle cx="0" cy="0" r="6" fill="rgba(100,200,100,0.7)" stroke="#388e3c" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="#ef4444" />
                  <text x="10" y="0" fill="#388e3c" fontSize="6">→ Internal use</text>
                </motion.g>

              </g>
            )}
          </AnimatePresence>
        </svg>

      </div>
    </div>
  );
};
