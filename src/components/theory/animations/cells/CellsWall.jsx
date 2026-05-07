import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const CellsWall = ({ accentColor, isDark }) => {
  const [turgor, setTurgor] = useState(100); // 0 to 100

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Cell Wall vs Cell Membrane
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Left Panel: Membrane */}
        <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10">
          <div className="font-bold text-sm text-center mb-2 text-blue-500">CELL MEMBRANE</div>
          <div className="h-16 flex items-center justify-center mb-4">
            <svg viewBox="0 0 100 40" className="w-full h-full max-w-[150px]">
              <path d="M 0 20 Q 25 0, 50 20 T 100 20" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <path d="M 0 24 Q 25 4, 50 24 T 100 24" fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </div>
          <ul className="text-[10px] space-y-1 opacity-80">
            <li>📏 <span className="font-bold">Thickness:</span> 7-10 nm</li>
            <li>🌊 <span className="font-bold">Nature:</span> Flexible and fluid</li>
            <li>🔬 <span className="font-bold">Made of:</span> Phospholipids + Proteins</li>
            <li>✓ <span className="font-bold">Found in:</span> ALL cells</li>
            <li>🔒 <span className="font-bold">Permeability:</span> Selectively permeable</li>
          </ul>
        </div>

        {/* Right Panel: Wall */}
        <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10">
          <div className="font-bold text-sm text-center mb-2 text-green-500">CELL WALL</div>
          <div className="h-16 flex items-center justify-center mb-4">
            <svg viewBox="0 0 100 40" className="w-full h-full max-w-[150px]">
              <rect x="0" y="10" width="100" height="20" fill="#22c55e" opacity="0.2" />
              <rect x="0" y="10" width="100" height="4" fill="#16a34a" />
              <rect x="0" y="26" width="100" height="4" fill="#16a34a" />
              {/* Cellulose fibers */}
              <line x1="10" y1="14" x2="30" y2="26" stroke="#15803d" strokeWidth="1" />
              <line x1="30" y1="14" x2="50" y2="26" stroke="#15803d" strokeWidth="1" />
              <line x1="50" y1="14" x2="70" y2="26" stroke="#15803d" strokeWidth="1" />
              <line x1="70" y1="14" x2="90" y2="26" stroke="#15803d" strokeWidth="1" />
            </svg>
          </div>
          <ul className="text-[10px] space-y-1 opacity-80">
            <li>📏 <span className="font-bold">Thickness:</span> 0.1-10 μm (much thicker)</li>
            <li>🪵 <span className="font-bold">Nature:</span> Rigid and strong</li>
            <li>🔬 <span className="font-bold">Made of:</span> Cellulose fibers</li>
            <li>🌿 <span className="font-bold">Found in:</span> Plants, Fungi, Bacteria</li>
            <li>↔️ <span className="font-bold">Permeability:</span> Fully permeable</li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-black/10 dark:bg-white/10 my-2" />

      {/* Turgor Pressure Demo */}
      <div>
        <div className="text-center font-bold text-xs mb-4">Turgor Pressure & Plasmolysis Demo</div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-48 h-48 relative border-2 border-transparent">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Cell Wall (Fixed) */}
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#22c55e" strokeWidth="4" />
              
              {/* Cell Membrane (Dynamic) */}
              <motion.rect 
                x={12 + (100 - turgor) * 0.15} 
                y={12 + (100 - turgor) * 0.15} 
                width={76 - (100 - turgor) * 0.3} 
                height={76 - (100 - turgor) * 0.3} 
                rx={(100 - turgor) * 0.1}
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="1.5"
                animate={{
                  x: 12 + (100 - turgor) * 0.15,
                  y: 12 + (100 - turgor) * 0.15,
                  width: 76 - (100 - turgor) * 0.3,
                  height: 76 - (100 - turgor) * 0.3,
                  rx: (100 - turgor) * 0.1
                }}
                transition={{ type: "spring", stiffness: 50 }}
              />

              {/* Cytoplasm Background */}
              <motion.rect 
                x={12 + (100 - turgor) * 0.15} 
                y={12 + (100 - turgor) * 0.15} 
                width={76 - (100 - turgor) * 0.3} 
                height={76 - (100 - turgor) * 0.3} 
                rx={(100 - turgor) * 0.1}
                fill="#3b82f6" 
                fillOpacity="0.05"
                animate={{
                  x: 12 + (100 - turgor) * 0.15,
                  y: 12 + (100 - turgor) * 0.15,
                  width: 76 - (100 - turgor) * 0.3,
                  height: 76 - (100 - turgor) * 0.3,
                  rx: (100 - turgor) * 0.1
                }}
                transition={{ type: "spring", stiffness: 50 }}
              />

              {/* Vacuole (Dynamic) */}
              <motion.rect 
                x={20 + (100 - turgor) * 0.15} 
                y={20 + (100 - turgor) * 0.15} 
                width={60 - (100 - turgor) * 0.3} 
                height={60 - (100 - turgor) * 0.3} 
                rx={(100 - turgor) * 0.1}
                fill="#60a5fa"
                fillOpacity="0.3"
                animate={{
                  x: 20 + (100 - turgor) * 0.15,
                  y: 20 + (100 - turgor) * 0.15,
                  width: 60 - (100 - turgor) * 0.3,
                  height: 60 - (100 - turgor) * 0.3,
                  rx: (100 - turgor) * 0.1
                }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </svg>
            <div className="absolute top-1 left-1 text-[8px] text-green-500">Wall</div>
            <div className="absolute top-8 left-8 text-[8px] text-blue-500">Membrane</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-blue-700">Vacuole</div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full">
            <input 
              type="range" 
              min="0" max="100" 
              value={turgor} 
              onChange={(e) => setTurgor(Number(e.target.value))}
              className="w-full max-w-[200px]"
              style={{ accentColor: accentColor }}
            />
            <div className="text-xs font-bold mt-2">Water Content: {turgor}%</div>
            
            <div className="mt-4 p-3 rounded bg-black/5 dark:bg-white/5 border-l-2 text-[10px] w-full" style={{ borderColor: accentColor }}>
              {turgor > 80 && (
                <div>
                  <span className="font-bold text-green-500">Normal (Turgid):</span> Vacuole is full. Cell membrane pushes firmly against the rigid cell wall. This keeps the plant standing upright! 🌱
                </div>
              )}
              {turgor <= 80 && turgor > 30 && (
                <div>
                  <span className="font-bold text-yellow-500">Flaccid:</span> Cell is losing water. Pressure against the wall decreases. The plant begins to wilt. 🌿
                </div>
              )}
              {turgor <= 30 && (
                <div>
                  <span className="font-bold text-red-500">Plasmolysis:</span> Severe water loss! The cell membrane completely shrinks away from the cell wall. The plant is severely wilted. 🥀
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
