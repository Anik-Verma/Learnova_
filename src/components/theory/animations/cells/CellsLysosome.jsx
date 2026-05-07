import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GARBAGE_ITEMS = [
  { id: 'mito', name: 'Old Mitochondria', type: 'Autophagy', icon: '⚡', color: '#ef4444', x: 40, y: 30 },
  { id: 'bact', name: 'Invading Bacteria', type: 'Phagocytosis', icon: '🦠', color: '#22c55e', x: 220, y: 150 },
  { id: 'food', name: 'Food Particle', type: 'Digestion', icon: '🍔', color: '#eab308', x: 240, y: 50 },
];

export const CellsLysosome = ({ accentColor, isDark }) => {
  const [items, setItems] = useState(GARBAGE_ITEMS);
  const [digesting, setDigesting] = useState(null);

  const handleDigest = (id) => {
    if (digesting) return;
    setDigesting(id);
    setTimeout(() => {
      setItems(items.filter(item => item.id !== id));
      setDigesting(null);
    }, 2500); // Animation duration
  };

  const reset = () => {
    setItems(GARBAGE_ITEMS);
    setDigesting(null);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Lysosomes — Cellular Cleanup Crew
        </div>
        <button 
          onClick={reset}
          className="px-3 py-1 text-[10px] font-bold uppercase rounded border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all"
        >
          Reset Cell
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Main Visual */}
        <div className="relative w-full max-w-[300px] h-48 bg-[#1a1a1a] rounded-lg border border-black/10 dark:border-white/10 overflow-hidden mx-auto">
          <div className="absolute top-2 left-2 text-[10px] font-bold text-white/50 uppercase">Cell Interior</div>

          <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Draw Lysosomes (idle) */}
            {!digesting && (
              <>
                <g transform="translate(150, 100)">
                  <circle cx="0" cy="0" r="25" fill="rgba(180,50,50,0.3)" stroke="#B71C1C" strokeWidth="2" />
                  {[...Array(6)].map((_, i) => (
                    <circle key={`e1-${i}`} cx={Math.cos(i)*10} cy={Math.sin(i)*10} r="2" fill="#EF9A9A" />
                  ))}
                  <text x="0" y="35" textAnchor="middle" fill="#EF9A9A" fontSize="8" fontWeight="bold">Lysosome</text>
                </g>
              </>
            )}

            {/* Garbage Items */}
            <AnimatePresence>
              {items.map(item => (
                <motion.g 
                  key={item.id}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: 2 }} // Wait for engulf animation before disappearing
                  transform={`translate(${item.x}, ${item.y})`}
                  className="cursor-pointer"
                  onClick={() => handleDigest(item.id)}
                >
                  {/* Hover highlight */}
                  <circle cx="15" cy="15" r="25" fill={item.color} fillOpacity="0.1" className="opacity-0 hover:opacity-100 transition-opacity" />
                  
                  {item.id === 'mito' && (
                    <g>
                      <path d="M 0 15 Q 15 0, 30 15 T 0 15" fill="none" stroke={item.color} strokeWidth="3" strokeDasharray="4 2" />
                      <text x="-5" y="40" fill={item.color} fontSize="8" fontWeight="bold">{item.name}</text>
                    </g>
                  )}
                  {item.id === 'bact' && (
                    <g>
                      <path d="M 10 10 L 20 15 L 25 5 L 30 20 L 15 25 Z" fill={item.color} />
                      <text x="5" y="40" fill={item.color} fontSize="8" fontWeight="bold">{item.name}</text>
                    </g>
                  )}
                  {item.id === 'food' && (
                    <g>
                      <polygon points="15,5 25,15 15,25 5,15" fill={item.color} />
                      <text x="5" y="40" fill={item.color} fontSize="8" fontWeight="bold">{item.name}</text>
                    </g>
                  )}
                </motion.g>
              ))}
            </AnimatePresence>

            {/* Digestion Animation */}
            {digesting && (
              <motion.g
                initial={{ x: 150, y: 100 }} // Start from center
                animate={{ 
                  x: items.find(i => i.id === digesting)?.x + 15 || 150, 
                  y: items.find(i => i.id === digesting)?.y + 15 || 100 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <motion.circle 
                  cx="0" cy="0" r="25" fill="rgba(180,50,50,0.5)" stroke="#B71C1C" strokeWidth="2" 
                  animate={{ r: [25, 40, 25], fill: ["rgba(180,50,50,0.5)", "rgba(255,0,0,0.8)", "rgba(180,50,50,0.5)"] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                {[...Array(8)].map((_, i) => (
                  <motion.circle 
                    key={`ea-${i}`} r="2" fill="#fff" 
                    animate={{ 
                      cx: [0, Math.cos(i)*15, Math.cos(i)*5], 
                      cy: [0, Math.sin(i)*15, Math.sin(i)*5] 
                    }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                ))}
                
                <motion.text 
                  x="0" y="0" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -20 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  DIGESTED!
                </motion.text>
              </motion.g>
            )}

            {!digesting && items.length > 0 && (
              <text x="150" y="180" textAnchor="middle" fill="#fff" fontSize="10" opacity="0.5" className="animate-pulse">
                Click an item to digest it!
              </text>
            )}
            {items.length === 0 && (
              <text x="150" y="100" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">
                Cell is Clean! ✨
              </text>
            )}
          </svg>
        </div>

        {/* Info Panels */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* pH indicator */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>Lysosome Interior pH</span>
              <span className="text-red-500">4.5 (Highly Acidic)</span>
            </div>
            <div className="h-4 w-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-full relative">
              <div className="absolute top-0 bottom-0 w-1 bg-white border border-black/50" style={{ left: '32%' }} />
              <div className="absolute top-5 text-[8px] font-bold" style={{ left: '30%' }}>4.5</div>
              <div className="absolute top-5 text-[8px]" style={{ left: '0%' }}>0 (Acid)</div>
              <div className="absolute top-5 text-[8px]" style={{ left: '48%' }}>7 (Neutral)</div>
              <div className="absolute top-5 text-[8px]" style={{ left: '90%' }}>14 (Base)</div>
            </div>
            <div className="mt-8 text-[10px] opacity-80 italic">The digestive enzymes only work at this low pH, protecting the rest of the cell (pH ~7.2) if a lysosome accidentally leaks.</div>
          </div>

          {/* Autolysis Warning */}
          <div className="bg-red-500/10 border-2 border-red-500/50 p-4 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="text-red-600 dark:text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>⚠️</span> The "Suicide Bags"
            </div>
            <div className="text-xs opacity-90 space-y-2">
              <p>If the cell is severely damaged or infected, lysosomes can burst open, releasing all enzymes into the cytoplasm.</p>
              <p className="font-bold text-red-500 dark:text-red-400">This results in AUTOLYSIS (self-digestion).</p>
              <p className="text-[10px] italic">This controlled cell death protects the surrounding healthy tissue!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
