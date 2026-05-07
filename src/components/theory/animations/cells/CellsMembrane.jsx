import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOLECULES = [
  { id: 'o2', name: 'O₂', desc: 'Small, nonpolar. Passes freely.', color: '#22d3ee', pass: true, size: 4 },
  { id: 'co2', name: 'CO₂', desc: 'Small, nonpolar. Passes freely.', color: '#9ca3af', pass: true, size: 5 },
  { id: 'h2o', name: 'H₂O', desc: 'Small, polar. Passes (osmosis).', color: '#3b82f6', pass: true, size: 4 },
  { id: 'glucose', name: 'Glucose', desc: 'Large. Needs protein channel.', color: '#facc15', pass: 'channel', size: 10 },
  { id: 'na', name: 'Na⁺', desc: 'Charged ion. Blocked by lipids.', color: '#f97316', pass: false, size: 6 },
  { id: 'protein', name: 'Protein', desc: 'Very large. Completely blocked.', color: '#c084fc', pass: false, size: 16 },
];

export const CellsMembrane = ({ accentColor, isDark }) => {
  const [activeMol, setActiveMol] = useState('o2');
  const [showOsmosis, setShowOsmosis] = useState(false);
  const mol = MOLECULES.find(m => m.id === activeMol);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Membrane Permeability Lab
        </div>
        <button 
          onClick={() => setShowOsmosis(!showOsmosis)}
          className={`px-3 py-1 text-[10px] font-bold uppercase rounded border transition-all ${showOsmosis ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-blue-500/50 text-blue-500 hover:bg-blue-500/10'}`}
        >
          {showOsmosis ? 'Hide Osmosis' : 'Show Osmosis'}
        </button>
      </div>

      {/* Main Visual */}
      <div className="relative w-full h-48 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 overflow-hidden flex">
        
        {/* Left: Extracellular */}
        <div className="flex-1 relative">
          <div className="absolute top-2 left-2 text-[10px] font-bold opacity-50 uppercase">Outside Cell</div>
          
          {showOsmosis && (
            <div className="absolute inset-0 p-4">
              {/* High water concentration (low solute) */}
              {Array.from({length: 15}).map((_, i) => (
                <motion.div 
                  key={`h2o-l-${i}`} 
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ x: [Math.random()*100, Math.random()*100+50], y: [Math.random()*100, Math.random()*100] }}
                  transition={{ repeat: Infinity, duration: 2+Math.random()*2, repeatType: "mirror" }}
                  style={{ left: `${Math.random()*80}%`, top: `${Math.random()*80+10}%` }}
                />
              ))}
              <div className="absolute bottom-2 left-2 text-[9px] text-blue-500 font-bold bg-blue-500/10 px-1 rounded">Dilute Solution</div>
            </div>
          )}

          {!showOsmosis && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div 
                  className="rounded-full shadow-lg z-20 flex items-center justify-center text-[8px] font-bold text-black/60"
                  style={{ 
                    backgroundColor: mol.color, 
                    width: mol.size * 2, 
                    height: mol.size * 2,
                    borderRadius: mol.id === 'glucose' ? '20%' : '50%'
                  }}
                  animate={{
                    x: mol.pass === true ? [0, 150] : (mol.pass === 'channel' ? [0, 150] : [0, 60, 0])
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: mol.pass ? "linear" : "easeInOut" }}
                >
                  {mol.id === 'glucose' ? 'G' : ''}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Center: Membrane */}
        <div className="w-16 h-full flex flex-col justify-center relative z-10 border-x border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
          {/* Phospholipids */}
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="flex-1 flex w-full relative group">
              {/* Top layer */}
              <div className="absolute left-1 w-3 h-3 rounded-full bg-[#1565C0] shadow-sm" />
              <div className="absolute left-4 top-1 w-4 h-[1px] bg-[#90CAF9] rotate-12" />
              <div className="absolute left-4 top-2 w-4 h-[1px] bg-[#90CAF9] -rotate-12" />
              
              {/* Bottom layer */}
              <div className="absolute right-1 w-3 h-3 rounded-full bg-[#1565C0] shadow-sm" />
              <div className="absolute right-4 top-1 w-4 h-[1px] bg-[#90CAF9] rotate-12" />
              <div className="absolute right-4 top-2 w-4 h-[1px] bg-[#90CAF9] -rotate-12" />
            </div>
          ))}

          {/* Protein Channel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-16 bg-orange-400/60 rounded-lg flex items-center justify-center border border-orange-500 shadow-lg backdrop-blur-sm">
            <div className="w-4 h-full bg-black/20 dark:bg-white/20" />
            <div className="absolute -top-4 text-[8px] font-bold text-orange-600 dark:text-orange-400 uppercase w-20 text-center -left-3">Protein Channel</div>
          </div>
        </div>

        {/* Right: Intracellular */}
        <div className="flex-1 relative">
          <div className="absolute top-2 right-2 text-[10px] font-bold opacity-50 uppercase">Inside Cell</div>
          
          {showOsmosis && (
            <div className="absolute inset-0 p-4">
              {/* High solute, low water */}
              {Array.from({length: 5}).map((_, i) => (
                <motion.div 
                  key={`h2o-r-${i}`} 
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ x: [Math.random()*100, Math.random()*100-50], y: [Math.random()*100, Math.random()*100] }}
                  transition={{ repeat: Infinity, duration: 2+Math.random()*2, repeatType: "mirror" }}
                  style={{ left: `${Math.random()*80}%`, top: `${Math.random()*80+10}%` }}
                />
              ))}
              {/* Solutes */}
              {Array.from({length: 20}).map((_, i) => (
                <div key={`solute-${i}`} className="absolute w-3 h-3 bg-red-400 rounded-full opacity-60" style={{ left: `${10+Math.random()*80}%`, top: `${10+Math.random()*80}%` }} />
              ))}
              <div className="absolute bottom-2 right-2 text-[9px] text-red-500 font-bold bg-red-500/10 px-1 rounded">Concentrated</div>
              
              {/* Osmosis Arrow */}
              <motion.div 
                className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold text-2xl"
                animate={{ x: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.div>
            </div>
          )}

          {!showOsmosis && (
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence>
                {mol.pass && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-500 font-bold flex items-center gap-1"
                  >
                    ✓ <span className="text-[10px] uppercase">{mol.id === 'glucose' ? 'Through Channel' : 'Passes Freely'}</span>
                  </motion.div>
                )}
                {!mol.pass && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 font-bold flex items-center gap-1"
                  >
                    ✗ <span className="text-[10px] uppercase">Blocked</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {!showOsmosis && (
        <>
          <div className="flex flex-wrap gap-2 justify-center">
            {MOLECULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMol(m.id)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 border ${activeMol === m.id ? 'bg-black/10 dark:bg-white/10 shadow-inner' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
                style={{ borderColor: activeMol === m.id ? m.color : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                {m.name}
              </button>
            ))}
          </div>
          <div className="text-center p-2 rounded bg-black/5 dark:bg-white/5 border-l-2" style={{ borderColor: mol.color }}>
            <span className="font-bold text-sm" style={{ color: mol.color }}>{mol.name}: </span>
            <span className="text-xs opacity-80">{mol.desc}</span>
          </div>
        </>
      )}

      {showOsmosis && (
        <div className="text-center p-3 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
          <div className="font-bold text-sm mb-1">Osmosis</div>
          <div className="text-xs opacity-80">Water moves from the dilute solution (more water) to the concentrated solution (less water) across the membrane.</div>
        </div>
      )}
    </div>
  );
};
