import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PILLARS = [
  { id: 1, title: 'All living things are made of cells', scientist: 'Schleiden & Schwann (1838-39)' },
  { id: 2, title: 'Cell is the basic unit of life', scientist: 'Fundamental Principle' },
  { id: 3, title: 'All cells arise from pre-existing cells', scientist: 'Rudolf Virchow (1855)' }
];

export const CellsTheory = ({ accentColor, isDark }) => {
  const [activePillar, setActivePillar] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const renderAnimation = () => {
    switch(activePillar) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            <div className="flex items-center gap-4">
              <motion.svg width="60" height="80" viewBox="0 0 50 100"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                {/* Tree */}
                <path d="M 20 100 L 30 100 L 30 60 L 40 40 L 10 40 L 20 60 Z" fill="#8B4513" />
                <circle cx="25" cy="30" r="25" fill="#22c55e" />
              </motion.svg>
              
              <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-xl font-bold opacity-50">→</motion.div>
              
              <div className="w-16 h-16 border-2 border-green-500 rounded bg-green-900/20 grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5">
                {Array.from({length: 16}).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-green-500/50 rounded-sm border border-green-400/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex gap-3 text-[10px] font-bold uppercase">
              {['Bacteria ✓', 'Plants ✓', 'Animals ✓', 'Fungi ✓'].map((t, i) => (
                <motion.div 
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded"
                >
                  {t}
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex items-center justify-center gap-6">
              <div className="relative w-20 h-20">
                {/* Building composed of blocks */}
                <div className="absolute bottom-0 w-full h-full flex flex-col-reverse gap-0.5">
                  {[...Array(4)].map((_, row) => (
                    <div key={row} className="flex gap-0.5 justify-center">
                      {[...Array(4 - (row % 2))].map((_, col) => (
                        <motion.div 
                          key={col} 
                          className={`w-4 h-3 rounded-sm ${row === 2 && col === 1 ? 'bg-yellow-400 shadow-[0_0_10px_yellow] z-10' : 'bg-blue-500/60'}`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (row * 4 + col) * 0.05 }}
                        >
                          <div className="flex justify-evenly mt-[-2px]">
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-left max-w-[120px]">
                <div className="text-yellow-500 font-bold text-xs">One Block</div>
                <div className="text-xs opacity-70 italic">= One Cell</div>
                <div className="text-[9px] mt-1 opacity-50 uppercase tracking-widest">Like LEGO bricks building life</div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex items-center justify-center w-full mb-4">
              <motion.div 
                className="w-8 h-8 rounded-full border-2 border-purple-400 bg-purple-500/20 relative"
                animate={{
                  width: [32, 48, 64, 32],
                  borderRadius: ["50%", "40%", "30%", "50%"],
                  opacity: [1, 1, 0, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div 
                  className="absolute inset-0 m-auto w-2 h-2 bg-purple-500 rounded-full" 
                  animate={{ x: [-2, 2, -5, 5, 0] }} 
                  transition={{ duration: 1, repeat: Infinity }} 
                />
              </motion.div>
              
              <motion.div animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mx-2 font-bold opacity-50">→</motion.div>
              
              <div className="flex gap-2 relative">
                <motion.div 
                  className="w-8 h-8 rounded-full border-2 border-purple-400 bg-purple-500/20"
                  animate={{ opacity: [0, 0, 1, 1], scale: [0.5, 0.5, 1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="w-8 h-8 rounded-full border-2 border-purple-400 bg-purple-500/20"
                  animate={{ opacity: [0, 0, 1, 1], scale: [0.5, 0.5, 1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
            <div className="text-[10px] uppercase font-bold opacity-60 tracking-widest text-center mt-2">
              Cell Division
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Cell Theory Builder</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {PILLARS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePillar(p.id)}
            className={`flex-1 p-2 rounded text-xs font-bold transition-all flex flex-col items-center ${activePillar === p.id ? 'text-white shadow-md' : 'bg-black/5 dark:bg-white/5 opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: activePillar === p.id ? accentColor : undefined }}
          >
            <span className="text-lg opacity-80 mb-1">{p.id}</span>
            <span className="text-[8px] uppercase tracking-wider text-center hidden md:block">Pillar {p.id}</span>
          </button>
        ))}
      </div>

      {/* Active Content Area */}
      <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 h-48 border border-black/10 dark:border-white/10 flex flex-col relative overflow-hidden">
        <div className="text-sm font-bold text-center mb-1" style={{ color: accentColor }}>
          "{PILLARS[activePillar - 1].title}"
        </div>
        <div className="text-[10px] text-center opacity-60 italic mb-4">
          — {PILLARS[activePillar - 1].scientist}
        </div>
        
        <div className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {renderAnimation()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Quiz */}
      <div className="mt-2 p-3 rounded bg-black/5 dark:bg-white/5 flex flex-col items-center md:flex-row md:justify-between gap-3">
        <div className="text-xs font-bold">Quiz: Which pillar says all cells come from pre-existing cells?</div>
        <div className="flex gap-2">
          {[1, 2, 3].map(n => (
            <button 
              key={n}
              onClick={() => setQuizAnswer(n)}
              className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${quizAnswer === n ? (n === 3 ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
