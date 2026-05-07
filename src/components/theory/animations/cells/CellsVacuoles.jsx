import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const CellsVacuoles = ({ accentColor, isDark }) => {
  const [turgor, setTurgor] = useState(100);
  const [pigment, setPigment] = useState('none'); // 'none', 'red', 'blue', 'purple'

  const pigmentColor = {
    'none': 'rgba(160,210,255,0.25)',
    'red': 'rgba(239,68,68,0.5)',
    'blue': 'rgba(59,130,246,0.5)',
    'purple': 'rgba(168,85,247,0.5)'
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Vacuole — Storage and Support
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full items-center">
        
        {/* Left: Plant Cell */}
        <div className="flex-1 w-full bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col items-center">
          <div className="text-sm font-bold text-green-500 mb-2">PLANT CELL</div>
          
          <div className="relative w-40 h-48 border-2 border-green-500 rounded-sm mb-4 bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
            {/* Nucleus pushed to edge */}
            <circle cx="15%" cy="85%" r="15" fill="#C8A04A" opacity="0.6" className="absolute bottom-2 left-2" />
            <circle cx="80%" cy="15%" r="8" fill="#16a34a" opacity="0.6" className="absolute top-2 right-2" />
            <circle cx="85%" cy="80%" r="8" fill="#16a34a" opacity="0.6" className="absolute bottom-4 right-2" />
            <circle cx="15%" cy="20%" r="8" fill="#16a34a" opacity="0.6" className="absolute top-4 left-2" />
            
            {/* Central Vacuole */}
            <motion.div 
              className="border-2 border-blue-400 rounded-[20%] flex items-center justify-center backdrop-blur-sm"
              animate={{ 
                width: `${30 + turgor * 0.6}%`, 
                height: `${30 + turgor * 0.6}%`,
                backgroundColor: pigmentColor[pigment]
              }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              <div className="text-[10px] font-bold text-blue-800 dark:text-blue-200">Central Vacuole</div>
            </motion.div>
          </div>
          
          <div className="text-[9px] opacity-80 text-center px-4">
            Occupies <span className="font-bold text-blue-500">50-90%</span> of the cell volume. Pushes all other organelles to the edges.
          </div>
        </div>

        {/* Right: Animal Cell */}
        <div className="flex-1 w-full bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col items-center">
          <div className="text-sm font-bold text-blue-500 mb-2">ANIMAL CELL</div>
          
          <div className="relative w-48 h-48 border-2 border-blue-500 rounded-[40%_60%_70%_30%] mb-4 bg-black/5 dark:bg-white/5 flex items-center justify-center">
            {/* Nucleus in center */}
            <circle cx="50" cy="50" r="20" fill="#C8A04A" opacity="0.6" />
            
            {/* Small Vacuoles */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border border-blue-400 bg-blue-400/20 flex items-center justify-center text-[6px]">Vacuole</div>
            <div className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full border border-blue-400 bg-blue-400/20 flex items-center justify-center text-[6px]">Vacuole</div>
            <div className="absolute top-2/3 left-1/3 w-10 h-10 rounded-full border border-blue-400 bg-blue-400/20 flex items-center justify-center text-[6px]">Food</div>
            <div className="absolute top-1/3 right-1/4 w-5 h-5 rounded-full border border-blue-400 bg-blue-400/20 flex items-center justify-center text-[6px]"></div>
          </div>

          <div className="text-[9px] opacity-80 text-center px-4">
            <span className="font-bold text-blue-500">Many small, temporary</span> vacuoles. Mostly used for storage and digestion (food vacuoles).
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-black/10 dark:bg-white/10 my-2" />

      {/* Interactive Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Turgor Pressure */}
        <div className="flex-1 flex flex-col items-center p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
          <div className="font-bold text-xs mb-4 text-center">Turgor Pressure (Plant Support)</div>
          <input 
            type="range" 
            min="0" max="100" 
            value={turgor} 
            onChange={(e) => setTurgor(Number(e.target.value))}
            className="w-full max-w-[200px]"
            style={{ accentColor: accentColor }}
          />
          <div className="mt-4 flex flex-col items-center text-center">
            <div className="text-4xl mb-2 transition-all">
              {turgor > 70 ? '🌱' : turgor > 30 ? '🌿' : '🥀'}
            </div>
            <div className="text-[10px] max-w-[200px]">
              {turgor > 70 
                ? "High Turgor Pressure: Vacuole is full of water. Plant stands upright and firm." 
                : turgor > 30 
                ? "Medium Pressure: Plant begins to droop." 
                : "Low Pressure (Plasmolysis): Vacuole shrinks. Plant wilts."}
            </div>
          </div>
        </div>

        {/* Pigment Storage */}
        <div className="flex-1 flex flex-col items-center p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
          <div className="font-bold text-xs mb-4 text-center">Pigment Storage</div>
          <div className="text-[10px] text-center mb-4 opacity-80">
            Vacuoles in flowers and fruits store anthocyanin pigments to attract pollinators!
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setPigment('none')} className={`px-2 py-1 rounded border text-[10px] ${pigment === 'none' ? 'bg-gray-500 text-white border-gray-500' : 'border-gray-500 text-gray-500'}`}>Clear</button>
            <button onClick={() => setPigment('red')} className={`px-2 py-1 rounded border text-[10px] ${pigment === 'red' ? 'bg-red-500 text-white border-red-500' : 'border-red-500 text-red-500'}`}>Red Rose</button>
            <button onClick={() => setPigment('blue')} className={`px-2 py-1 rounded border text-[10px] ${pigment === 'blue' ? 'bg-blue-500 text-white border-blue-500' : 'border-blue-500 text-blue-500'}`}>Blueberry</button>
            <button onClick={() => setPigment('purple')} className={`px-2 py-1 rounded border text-[10px] ${pigment === 'purple' ? 'bg-purple-500 text-white border-purple-500' : 'border-purple-500 text-purple-500'}`}>Lavender</button>
          </div>
        </div>

      </div>
    </div>
  );
};
