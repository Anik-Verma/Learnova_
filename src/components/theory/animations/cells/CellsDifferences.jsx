import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFERENCES = [
  { id: 'wall', name: 'Cell Wall', plant: true, animal: false, plantMsg: 'Thick outer cell wall (Cellulose)', animalMsg: 'No cell wall, only flexible membrane' },
  { id: 'chloro', name: 'Chloroplasts', plant: true, animal: false, plantMsg: 'Has chloroplasts for photosynthesis', animalMsg: 'No chloroplasts (Cannot make own food)' },
  { id: 'vacuole', name: 'Central Vacuole', plant: true, animal: 'small', plantMsg: 'One large central vacuole', animalMsg: 'Many small, temporary vacuoles' },
  { id: 'centrioles', name: 'Centrioles', plant: false, animal: true, plantMsg: 'Centrioles absent', animalMsg: 'Has centrioles (helps in cell division)' },
  { id: 'shape', name: 'Shape', plant: 'rect', animal: 'irreg', plantMsg: 'Fixed, rectangular shape', animalMsg: 'Irregular, flexible shape' },
];

export const CellsDifferences = ({ accentColor, isDark }) => {
  const [activeDiff, setActiveDiff] = useState(null);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Spot the Difference!
        </div>
        <button 
          onClick={() => setShowTable(!showTable)}
          className={`px-3 py-1 text-[10px] font-bold uppercase rounded border transition-all ${showTable ? 'bg-indigo-500 text-white border-indigo-500' : 'border-indigo-500 text-indigo-500 hover:bg-indigo-500/10'}`}
        >
          {showTable ? 'Hide Table' : 'Show Comparison Table'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showTable ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 overflow-hidden"
          >
            <table className="w-full text-xs text-left">
              <thead className="bg-black/10 dark:bg-white/10 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3 text-green-600 dark:text-green-400 border-l border-black/10 dark:border-white/10">Plant Cell</th>
                  <th className="p-3 text-blue-600 dark:text-blue-400 border-l border-black/10 dark:border-white/10">Animal Cell</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Cell Wall</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-green-500 font-bold">✓ Present</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-red-500">✗ Absent</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Chloroplasts</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-green-500 font-bold">✓ Present</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-red-500">✗ Absent</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Vacuole</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-green-500 font-bold">✓ Large, central</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-blue-500">Small, scattered</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Centrosome/Centrioles</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-red-500">✗ Absent</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-blue-500 font-bold">✓ Present</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Shape</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10">Fixed, rectangular</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10">Irregular, flexible</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 font-bold">Plastids</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-green-500 font-bold">✓ Present</td>
                  <td className="p-3 border-l border-black/10 dark:border-white/10 text-red-500">✗ Absent</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 w-full">
            
            {/* Clickable List */}
            <div className="flex flex-wrap justify-center gap-2">
              {DIFFERENCES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setActiveDiff(activeDiff === diff.id ? null : diff.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${activeDiff === diff.id ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-indigo-500/50'}`}
                >
                  {diff.name}
                </button>
              ))}
            </div>

            {/* Visuals */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              
              {/* Plant Cell SVG */}
              <div className="flex-1 w-full max-w-[250px] relative">
                <div className="text-center font-bold text-sm text-green-500 mb-2">PLANT CELL</div>
                <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md">
                  {/* Shape & Wall */}
                  <rect x="20" y="20" width="160" height="160" fill="none" stroke={activeDiff === 'wall' || activeDiff === 'shape' ? '#22c55e' : '#15803d'} strokeWidth={activeDiff === 'wall' ? "8" : "4"} filter={activeDiff === 'wall' ? 'drop-shadow(0 0 8px #22c55e)' : 'none'} />
                  {/* Membrane */}
                  <rect x="24" y="24" width="152" height="152" fill="rgba(34,197,94,0.1)" stroke="#3b82f6" strokeWidth="2" />
                  
                  {/* Large Central Vacuole */}
                  <rect x="40" y="40" width="120" height="80" rx="20" fill="rgba(96,165,250,0.3)" stroke={activeDiff === 'vacuole' ? '#60a5fa' : '#3b82f6'} strokeWidth={activeDiff === 'vacuole' ? '4' : '1'} filter={activeDiff === 'vacuole' ? 'drop-shadow(0 0 8px #60a5fa)' : 'none'} />
                  
                  {/* Nucleus */}
                  <circle cx="100" cy="150" r="25" fill="#C8A04A" />
                  <circle cx="100" cy="150" r="8" fill="#A07828" />

                  {/* Chloroplasts */}
                  <g fill="#16a34a" stroke={activeDiff === 'chloro' ? '#4ade80' : 'none'} strokeWidth="2" filter={activeDiff === 'chloro' ? 'drop-shadow(0 0 5px #4ade80)' : 'none'}>
                    <ellipse cx="40" cy="150" rx="12" ry="6" />
                    <ellipse cx="160" cy="150" rx="12" ry="6" />
                    <ellipse cx="160" cy="60" rx="12" ry="6" />
                    <ellipse cx="40" cy="60" rx="12" ry="6" />
                  </g>

                  {/* Mitochondria */}
                  <g fill="#ef4444">
                    <ellipse cx="140" cy="130" rx="8" ry="4" transform="rotate(45 140 130)" />
                    <ellipse cx="60" cy="130" rx="8" ry="4" transform="rotate(-45 60 130)" />
                  </g>

                  {/* Centriole X (if active) */}
                  {activeDiff === 'centrioles' && (
                    <text x="100" y="100" fill="#ef4444" fontSize="40" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" filter="drop-shadow(0 0 5px #ef4444)">✗</text>
                  )}
                </svg>
                {activeDiff && (
                  <div className={`mt-4 p-2 text-center text-[10px] font-bold rounded bg-black/5 dark:bg-white/5 ${DIFFERENCES.find(d => d.id === activeDiff).plant ? 'text-green-500' : 'text-red-500'}`}>
                    {DIFFERENCES.find(d => d.id === activeDiff).plant ? '✓ ' : '✗ '}
                    {DIFFERENCES.find(d => d.id === activeDiff).plantMsg}
                  </div>
                )}
              </div>

              {/* Animal Cell SVG */}
              <div className="flex-1 w-full max-w-[250px] relative">
                <div className="text-center font-bold text-sm text-blue-500 mb-2">ANIMAL CELL</div>
                <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md">
                  {/* Shape & Membrane */}
                  <path d="M 100 20 C 150 10, 180 50, 180 100 C 190 150, 140 180, 100 180 C 50 190, 20 150, 20 100 C 10 50, 60 20, 100 20 Z" fill="rgba(59,130,246,0.1)" stroke={activeDiff === 'shape' ? '#3b82f6' : '#3b82f6'} strokeWidth={activeDiff === 'shape' ? "6" : "3"} filter={activeDiff === 'shape' ? 'drop-shadow(0 0 8px #3b82f6)' : 'none'} />
                  
                  {/* Wall X (if active) */}
                  {activeDiff === 'wall' && (
                    <text x="100" y="100" fill="#ef4444" fontSize="40" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" filter="drop-shadow(0 0 5px #ef4444)">✗</text>
                  )}

                  {/* Nucleus */}
                  <circle cx="100" cy="100" r="30" fill="#C8A04A" />
                  <circle cx="100" cy="100" r="10" fill="#A07828" />

                  {/* Centrioles */}
                  <g stroke={activeDiff === 'centrioles' ? '#eab308' : 'none'} strokeWidth="2" filter={activeDiff === 'centrioles' ? 'drop-shadow(0 0 5px #eab308)' : 'none'}>
                    <rect x="140" y="80" width="6" height="15" fill="#ca8a04" transform="rotate(30 143 87)" />
                    <rect x="145" y="82" width="6" height="15" fill="#ca8a04" transform="rotate(-60 148 89)" />
                  </g>

                  {/* Mitochondria */}
                  <g fill="#ef4444">
                    <ellipse cx="60" cy="70" rx="10" ry="5" transform="rotate(20 60 70)" />
                    <ellipse cx="140" cy="140" rx="10" ry="5" transform="rotate(-30 140 140)" />
                    <ellipse cx="60" cy="140" rx="10" ry="5" transform="rotate(60 60 140)" />
                  </g>

                  {/* Small Vacuoles */}
                  <g fill="rgba(96,165,250,0.3)" stroke={activeDiff === 'vacuole' ? '#60a5fa' : '#3b82f6'} strokeWidth={activeDiff === 'vacuole' ? '2' : '1'} filter={activeDiff === 'vacuole' ? 'drop-shadow(0 0 5px #60a5fa)' : 'none'}>
                    <circle cx="70" cy="40" r="12" />
                    <circle cx="150" cy="50" r="8" />
                    <circle cx="40" cy="110" r="10" />
                    <circle cx="160" cy="110" r="15" />
                  </g>

                  {/* Chloroplast X (if active) */}
                  {activeDiff === 'chloro' && (
                    <text x="100" y="100" fill="#ef4444" fontSize="40" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" filter="drop-shadow(0 0 5px #ef4444)">✗</text>
                  )}
                </svg>
                {activeDiff && (
                  <div className={`mt-4 p-2 text-center text-[10px] font-bold rounded bg-black/5 dark:bg-white/5 ${DIFFERENCES.find(d => d.id === activeDiff).animal ? 'text-blue-500' : 'text-red-500'}`}>
                    {DIFFERENCES.find(d => d.id === activeDiff).animal ? '✓ ' : '✗ '}
                    {DIFFERENCES.find(d => d.id === activeDiff).animalMsg}
                  </div>
                )}
              </div>

            </div>

            {!activeDiff && (
              <div className="text-center text-[10px] italic opacity-60 mt-4 animate-pulse">
                Click a button above to highlight the difference!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
