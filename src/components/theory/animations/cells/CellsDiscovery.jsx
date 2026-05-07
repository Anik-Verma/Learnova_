import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMELINE_DATA = [
  { year: 1665, name: 'Robert Hooke', desc: 'Discovered cells in cork', quote: '"I could exceedingly plainly perceive it to be all perforated and porous"' },
  { year: 1674, name: 'Leeuwenhoek', desc: 'Discovered free-living cells in pond water', quote: '"Little animals, very elegantly moving"' },
  { year: 1838, name: 'Schleiden', desc: 'All plants are made of cells', quote: 'Plant cell theory' },
  { year: 1839, name: 'Schwann', desc: 'All animals are made of cells', quote: 'Animal cell theory' },
  { year: 1855, name: 'Virchow', desc: 'Omnis cellula e cellula', quote: '"All cells arise from pre-existing cells"' },
];

export const CellsDiscovery = ({ accentColor, isDark }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeEvent = TIMELINE_DATA[activeIdx];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* Left Side: Microscope */}
        <div className="flex-1 flex flex-col items-center">
          <svg width="120" height="160" viewBox="0 0 100 150" className="drop-shadow-lg">
            {/* Base */}
            <path d="M 20 140 L 80 140 L 70 120 L 30 120 Z" fill="#8B4513" />
            <rect x="45" y="100" width="10" height="20" fill="#A0522D" />
            {/* Stage */}
            <rect x="30" y="95" width="40" height="5" fill="#CD853F" />
            {/* Arm */}
            <path d="M 45 100 Q 20 60 45 20" fill="none" stroke="#D2691E" strokeWidth="8" strokeLinecap="round" />
            {/* Tube */}
            <rect x="40" y="10" width="20" height="60" fill="#DEB887" rx="2" transform="rotate(15 50 40)" />
            {/* Eyepiece */}
            <rect x="42" y="5" width="16" height="5" fill="#8B4513" rx="1" transform="rotate(15 50 40)" />
            {/* Objective */}
            <rect x="46" y="70" width="8" height="10" fill="#8B4513" transform="rotate(15 50 40)" />
          </svg>
          <div className="text-[10px] font-bold mt-2 opacity-60 uppercase tracking-widest text-center">
            {activeIdx === 0 ? "Hooke's Primitive Microscope" : "Early Microscope"}
          </div>
        </div>

        {/* Right Side: What was seen */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-[#8B4513] overflow-hidden bg-[#FFF8DC] shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center flex-wrap p-2"
              >
                {activeIdx === 0 && (
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                    <defs>
                      <pattern id="cork" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="none" stroke="#8B4513" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#cork)" />
                    {/* Add some thicker walls for realism */}
                    <path d="M10,0 L20,5 M30,0 L40,5 M10,20 L20,25" stroke="#654321" strokeWidth="2" fill="none" />
                  </svg>
                )}
                {activeIdx === 1 && (
                  <div className="relative w-full h-full">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-4 bg-green-500/50 rounded-full"
                        animate={{
                          x: [Math.random() * 80, Math.random() * 80, Math.random() * 80],
                          y: [Math.random() * 80, Math.random() * 80, Math.random() * 80],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ repeat: Infinity, duration: 3 + Math.random() * 4, ease: "linear" }}
                      />
                    ))}
                  </div>
                )}
                {activeIdx > 1 && (
                  <div className="w-full h-full flex items-center justify-center opacity-30">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx="50" cy="50" r="10" fill="#666" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[10px] font-bold mt-2 opacity-60 uppercase tracking-widest text-center">
            {activeIdx === 0 ? "Cork Cells (1665)" : activeIdx === 1 ? "Living Cells (1674)" : "Microscopic View"}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="text-center bg-black/5 dark:bg-white/5 p-4 rounded-lg min-h-[80px] flex flex-col justify-center">
        <div className="text-sm font-bold" style={{ color: accentColor }}>{activeEvent.name} ({activeEvent.year})</div>
        <div className="text-xs opacity-80 mt-1">{activeEvent.desc}</div>
        <div className="text-[10px] italic opacity-60 mt-2 font-serif">{activeEvent.quote}</div>
      </div>

      {/* Timeline */}
      <div className="relative mt-4 mb-2 px-4">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-black/10 dark:bg-white/10 -translate-y-1/2" />
        <div className="relative flex justify-between">
          {TIMELINE_DATA.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center group cursor-pointer" onClick={() => setActiveIdx(idx)}>
              <div 
                className="w-4 h-4 rounded-full border-2 transition-all z-10"
                style={{ 
                  backgroundColor: activeIdx === idx ? accentColor : isDark ? '#222' : '#fff',
                  borderColor: activeIdx === idx ? accentColor : isDark ? '#555' : '#ccc',
                  transform: activeIdx === idx ? 'scale(1.2)' : 'scale(1)'
                }}
              />
              <div 
                className="absolute top-6 text-[9px] font-bold transition-all"
                style={{ 
                  color: activeIdx === idx ? accentColor : 'inherit',
                  opacity: activeIdx === idx ? 1 : 0.5
                }}
              >
                {item.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
