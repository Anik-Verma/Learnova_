import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SIZES = [
  { val: 1000, label: '1 mm', name: 'Pin Tip', color: '#94a3b8', desc: 'Visible to naked eye' },
  { val: 100, label: '100 μm', name: 'Egg Cell', color: '#fde047', desc: 'Largest human cell' },
  { val: 50, label: '50 μm', name: 'Plant Cell', color: '#4ade80', desc: 'Typical plant cell' },
  { val: 20, label: '20 μm', name: 'Animal Cell', color: '#f472b6', desc: 'Typical animal cell' },
  { val: 10, label: '10 μm', name: 'Red Blood Cell', color: '#ef4444', desc: 'Carries oxygen' },
  { val: 1, label: '1 μm', name: 'Bacteria', color: '#a78bfa', desc: 'E. coli' },
  { val: 0.1, label: '0.1 μm', name: 'Virus', color: '#fb923c', desc: 'Tiny dot with spikes' },
];

const SHAPES = [
  { name: 'Spherical', type: 'Egg cell', desc: 'Maximizes volume for nutrient storage' },
  { name: 'Elongated', type: 'Muscle cell', desc: 'Can contract and stretch for movement' },
  { name: 'Branched', type: 'Neuron', desc: 'Connects to many other cells' },
  { name: 'Disc-shaped', type: 'RBC', desc: 'Increases surface area for oxygen transport' },
  { name: 'Polygonal', type: 'Epithelial', desc: 'Fits tightly together to form protective layers' },
  { name: 'Irregular', type: 'Amoeba', desc: 'Can change shape to engulf food' },
];

export const CellsShapeSize = ({ accentColor, isDark }) => {
  const [zoomLevel, setZoomLevel] = useState(0); // 0 to 6
  const activeSize = SIZES[zoomLevel];
  const [activeShape, setActiveShape] = useState(0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full overflow-hidden">
      
      {/* Top: Size Scale */}
      <div className="flex flex-col items-center">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">
          Cell Size Comparator
        </div>
        
        {/* Scale Visualization Area */}
        <div className="relative w-full h-32 flex items-center justify-center mb-6 overflow-hidden bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
          <motion.div 
            className="flex items-center gap-10"
            initial={{ x: 0 }}
            animate={{ x: `${(3 - zoomLevel) * 20}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {SIZES.map((item, idx) => {
              const isActive = idx === zoomLevel;
              return (
                <div key={idx} className="flex flex-col items-center min-w-[80px]">
                  <motion.div 
                    className="flex items-center justify-center"
                    animate={{ 
                      scale: isActive ? 2 : 0.8,
                      opacity: isActive ? 1 : 0.4
                    }}
                  >
                    {item.val === 1000 && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                    {item.val === 100 && <div className="w-8 h-8 bg-yellow-300 rounded-full" />}
                    {item.val === 50 && <div className="w-6 h-8 bg-green-400 rounded-sm" />}
                    {item.val === 20 && <div className="w-6 h-6 bg-pink-400 rounded-[40%_60%_70%_30%]" />}
                    {item.val === 10 && <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700/30" />}
                    {item.val === 1 && <div className="w-2 h-4 bg-purple-400 rounded-full" />}
                    {item.val === 0.1 && <div className="w-1 h-1 bg-orange-400 rounded-full relative">
                      <div className="absolute inset-[-2px] border-[0.5px] border-orange-400/50 rounded-full border-dashed animate-spin-slow"></div>
                    </div>}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Magnifying Glass overlay over center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 border-2 border-blue-400/50 rounded-full bg-blue-400/5 backdrop-blur-[1px] shadow-[0_0_15px_rgba(96,165,250,0.2)]" />
          </div>
        </div>

        {/* Info & Controls */}
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
          <input 
            type="range" 
            min="0" max="6" 
            value={zoomLevel} 
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-full md:w-1/2"
            style={{ accentColor: accentColor }}
          />
          <div className="text-center md:text-right">
            <div className="font-bold text-sm" style={{ color: accentColor }}>{activeSize.name}</div>
            <div className="text-xs font-mono opacity-80">{activeSize.label}</div>
            <div className="text-[10px] opacity-60 italic">{activeSize.desc}</div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-black/10 dark:bg-white/10" />

      {/* Bottom: Shape Gallery */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70 text-center">
          Function Determines Shape
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {SHAPES.map((shape, idx) => {
            const isActive = activeShape === idx;
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-center p-2 rounded cursor-pointer transition-all ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                onClick={() => setActiveShape(idx)}
                style={{ border: isActive ? `1px solid ${accentColor}50` : '1px solid transparent' }}
              >
                <div className="h-10 w-10 flex items-center justify-center mb-2">
                  {idx === 0 && <div className="w-8 h-8 bg-yellow-200/80 border border-yellow-400 rounded-full" />}
                  {idx === 1 && <div className="w-2 h-10 bg-red-300/80 border border-red-400 rounded-full" />}
                  {idx === 2 && (
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                      <path d="M50 30 L60 10 M50 30 L40 10 M50 30 L20 40 M50 30 L80 40 M50 30 L50 90 M50 90 L40 100 M50 90 L60 100" stroke="#a78bfa" strokeWidth="4" />
                      <circle cx="50" cy="30" r="12" fill="#8b5cf6" />
                    </svg>
                  )}
                  {idx === 3 && <div className="w-8 h-8 bg-red-400/80 border-4 border-red-500 rounded-full" />}
                  {idx === 4 && (
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="#6ee7b7" stroke="#059669" strokeWidth="4" />
                    </svg>
                  )}
                  {idx === 5 && (
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                      <path d="M30 20 Q50 10 70 30 T80 60 Q70 90 40 80 T10 50 Q20 30 30 20 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="4" />
                    </svg>
                  )}
                </div>
                <div className="text-[9px] font-bold uppercase">{shape.name}</div>
                <div className="text-[8px] opacity-60 text-center">{shape.type}</div>
              </div>
            );
          })}
        </div>

        {/* Shape Tooltip/Explanation */}
        <div className="mt-4 p-3 rounded bg-black/5 dark:bg-white/5 border-l-2" style={{ borderColor: accentColor }}>
          <div className="text-xs">
            <span className="font-bold">{SHAPES[activeShape].name} ({SHAPES[activeShape].type}): </span>
            <span className="opacity-80 italic">{SHAPES[activeShape].desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
