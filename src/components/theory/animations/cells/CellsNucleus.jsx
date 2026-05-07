import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CellsNucleus = ({ accentColor, isDark }) => {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-black/5 dark:bg-white/5 rounded-xl w-full">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Nucleus — Control Center Explorer
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Visual */}
        <div className="flex-1 flex items-center justify-center relative bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 p-4 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full max-w-[250px]">
            {/* Nucleoplasm */}
            <circle cx="100" cy="100" r="70" fill="rgba(190,150,60,0.1)" />
            
            {/* Chromatin */}
            <path d="M 80 80 Q 90 70 100 85 T 120 70 T 110 100 T 130 110 T 100 120 T 80 110 T 70 90 Z" fill="rgba(100,50,10,0.4)" />
            <path d="M 60 100 Q 70 120 90 130 T 70 140 Z" fill="rgba(100,50,10,0.4)" />
            <path d="M 120 130 Q 140 120 130 90 T 150 100 Z" fill="rgba(100,50,10,0.4)" />
            
            {/* Nucleolus */}
            <circle cx="110" cy="90" r="20" fill="rgba(120,60,15,0.7)" />

            {/* Nuclear Envelope (Double membrane with pores) */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="#C8A04A" strokeWidth="4" strokeDasharray="15 5" />
            <circle cx="100" cy="100" r="74" fill="none" stroke="#C8A04A" strokeWidth="2" strokeDasharray="16 4.5" />

            {/* DNA Visualization (Animated) */}
            {activeTab === 'dna' && (
              <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ transformOrigin: "100px 100px" }}>
                <path d="M 85 85 Q 95 95 105 85 T 125 85" fill="none" stroke="#fff" strokeWidth="1" />
                <path d="M 85 95 Q 95 85 105 95 T 125 95" fill="none" stroke="#fff" strokeWidth="1" />
                <line x1="90" y1="87" x2="90" y2="93" stroke="#fff" strokeWidth="0.5" />
                <line x1="100" y1="87" x2="100" y2="93" stroke="#fff" strokeWidth="0.5" />
                <line x1="110" y1="87" x2="110" y2="93" stroke="#fff" strokeWidth="0.5" />
                <line x1="120" y1="87" x2="120" y2="93" stroke="#fff" strokeWidth="0.5" />
              </motion.g>
            )}

            {/* mRNA exiting pore animation */}
            {activeTab === 'dna' && (
              <motion.circle
                cx="100" cy="100" r="2" fill="#fff"
                animate={{ x: [0, 40, 80], y: [0, -40, -50], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            )}
          </svg>

          {/* Labels for Structure Tab */}
          <AnimatePresence>
            {activeTab === 'structure' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-4 text-[8px] font-bold bg-black/40 text-white px-1 rounded flex items-center gap-1">
                  <div className="w-4 h-px bg-white"></div> Nuclear Envelope
                </div>
                <div className="absolute top-20 right-4 text-[8px] font-bold bg-black/40 text-white px-1 rounded flex items-center gap-1">
                  <div className="w-8 h-px bg-white rotate-12 origin-left"></div> Nuclear Pore
                </div>
                <div className="absolute top-32 right-12 text-[8px] font-bold bg-black/40 text-white px-1 rounded">
                  Nucleolus
                </div>
                <div className="absolute bottom-16 left-12 text-[8px] font-bold bg-black/40 text-white px-1 rounded">
                  Chromatin
                </div>
                <div className="absolute top-16 left-12 text-[8px] font-bold bg-black/40 text-white px-1 rounded">
                  Nucleoplasm
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Panel */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-2">
            {['structure', 'functions', 'dna'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${activeTab === tab ? 'text-white' : 'bg-black/5 dark:bg-white/5 opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: activeTab === tab ? accentColor : undefined }}
              >
                {tab === 'dna' ? 'DNA → Protein' : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-black/5 dark:bg-white/5 rounded p-4 text-xs h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'structure' && (
                <motion.div key="structure" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
                  <div className="font-bold text-sm mb-2">Structural Components:</div>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                    <li><span className="font-bold">Nuclear Envelope:</span> Double membrane that separates nucleus from cytoplasm.</li>
                    <li><span className="font-bold">Nuclear Pores:</span> Holes that allow material transfer (like mRNA) out of the nucleus.</li>
                    <li><span className="font-bold">Nucleoplasm:</span> The liquid interior of the nucleus.</li>
                    <li><span className="font-bold">Chromatin:</span> Entangled mass of DNA and proteins. Condenses into chromosomes during cell division.</li>
                    <li><span className="font-bold">Nucleolus:</span> Dense region that manufactures ribosomes.</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'functions' && (
                <motion.div key="functions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <div className="font-bold text-sm mb-2">Key Functions:</div>
                  {[
                    "① Controls all cell activities and chemical reactions.",
                    "② Stores genetic information (DNA) for inheritance.",
                    "③ Controls cellular reproduction (cell division).",
                    "④ Manufactures ribosomes (in nucleolus) for protein synthesis."
                  ].map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                      className="p-2 bg-black/5 dark:bg-white/5 rounded border-l-2"
                      style={{ borderColor: accentColor }}
                    >
                      {text}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'dna' && (
                <motion.div key="dna" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2 flex flex-col h-full justify-center">
                  <div className="font-bold text-sm mb-2 text-center">Why is it the Control Center?</div>
                  <div className="flex flex-col gap-2 items-center text-[10px] font-bold">
                    <div className="bg-purple-500/20 text-purple-600 dark:text-purple-400 p-2 rounded w-full text-center">DNA (Instructions in Nucleus)</div>
                    <div>↓</div>
                    <div className="bg-blue-500/20 text-blue-600 dark:text-blue-400 p-2 rounded w-full text-center">mRNA (Copy exits via Pore)</div>
                    <div>↓</div>
                    <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-2 rounded w-full text-center">Ribosome (Reads mRNA)</div>
                    <div>↓</div>
                    <div className="bg-orange-500/20 text-orange-600 dark:text-orange-400 p-2 rounded w-full text-center">Protein (Does the work in cell)</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-black/10 dark:bg-white/10 my-1" />

      {/* Comparison Strip */}
      <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-lg text-[10px]">
        <div className="flex-1 flex flex-col items-center border-r border-black/10 dark:border-white/10">
          <div className="font-bold text-green-500 mb-1 uppercase tracking-widest">Eukaryotes</div>
          <div className="opacity-80 text-center">Have a defined nucleus with membrane (Plants, Animals, Fungi).</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="font-bold text-red-500 mb-1 uppercase tracking-widest">Prokaryotes</div>
          <div className="opacity-80 text-center">Lack a nuclear membrane. Have a simple "nucleoid" region (Bacteria).</div>
        </div>
      </div>
    </div>
  );
};
