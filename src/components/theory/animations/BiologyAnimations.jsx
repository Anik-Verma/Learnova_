import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CELLS: ORGANELLES ---
export * from './cells/CellsDiscovery';
export * from './cells/CellsShapeSize';
export * from './cells/CellsTheory';
export * from './cells/CellsMembrane';
export * from './cells/CellsWall';
export * from './cells/CellsNucleus';
export * from './cells/CellsCytoplasm';
export * from './cells/CellsER';
export * from './cells/CellsGolgi';
export * from './cells/CellsLysosome';
export * from './cells/CellsMitochondria';
export * from './cells/CellsPlastids';
export * from './cells/CellsVacuoles';
export * from './cells/CellsDifferences';

export const CellsOrganelles = ({ accentColor }) => {
  const [type, setType] = useState('animal');
  const [sel, setSel] = useState(null);
  const data = {
    nucleus: { n: 'Nucleus', f: 'Control center. Contains genetic material.' },
    mitochondria: { n: 'Mitochondria', f: 'Powerhouse of the cell. Produces ATP.' },
    chloroplast: { n: 'Chloroplast', f: 'Site of photosynthesis (Plant only).' },
    vacuole: { n: 'Vacuole', f: 'Storage for nutrients and waste.' }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-black/10 rounded">
       <div className="flex-1 flex flex-col items-center">
          <div className="flex gap-2 mb-4">
             <button onClick={()=>setType('animal')} className={`px-3 py-1 rounded text-[9px] uppercase font-bold transition-all ${type==='animal'?'bg-accent text-white':'bg-white/5 opacity-60 hover:opacity-100'}`}>Animal</button>
             <button onClick={()=>setType('plant')} className={`px-3 py-1 rounded text-[9px] uppercase font-bold transition-all ${type==='plant'?'bg-accent text-white':'bg-white/5 opacity-60 hover:opacity-100'}`}>Plant</button>
          </div>
          <svg width="200" height="200" viewBox="0 0 100 100">
             <motion.rect x="10" y="10" width="80" height="80" rx={type==='animal'?40:10} fill="none" stroke={accentColor} strokeWidth="2" strokeOpacity="0.2" animate={{ rx: type==='animal'?40:10 }} />
             <circle cx="50" cy="50" r="10" fill="#ef4444" fillOpacity="0.4" className="cursor-pointer hover:fill-opacity-80" onClick={()=>setSel('nucleus')} />
             <rect x="70" y="30" width="8" height="4" rx="2" fill="#f59e0b" fillOpacity="0.6" className="cursor-pointer" onClick={()=>setSel('mitochondria')} />
             {type==='plant' && <motion.circle initial={{scale:0}} animate={{scale:1}} cx="70" cy="70" r="6" fill="#10b981" fillOpacity="0.6" className="cursor-pointer" onClick={()=>setSel('chloroplast')} />}
             <circle cx="30" cy="65" r={type==='plant'?15:5} fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" className="cursor-pointer" onClick={()=>setSel('vacuole')} />
          </svg>
       </div>
       <div className="w-full md:w-40 flex flex-col justify-center">
          {sel ? (
             <div className="p-3 bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5">
                <div className="text-accent font-bold text-[10px] uppercase mb-1">{data[sel].n}</div>
                <div className="text-[9px] opacity-70 leading-relaxed">{data[sel].f}</div>
             </div>
          ) : <div className="text-[9px] opacity-30 italic text-center">Tap any organelle</div>}
       </div>
    </div>
  );
};

// --- CELLS: OSMOSIS ---
export const CellsOsmosis = ({ accentColor }) => {
  const [mode, setMode] = useState('iso');
  return (
    <div className="p-4 bg-black/10 rounded">
       <div className="flex gap-1 mb-4">
          {['hypo','iso','hyper'].map(x => (
             <button key={x} onClick={()=>setMode(x)} className={`flex-1 py-1 rounded text-[8px] uppercase font-bold ${mode===x?'bg-accent text-white':'bg-white/5'}`}>{x}</button>
          ))}
       </div>
       <div className="h-32 flex items-center justify-center relative bg-black/20 rounded overflow-hidden">
          <motion.div animate={{ scale: mode==='hypo'?1.3:mode==='hyper'?0.7:1 }} transition={{ type:'spring', damping:12 }} className="w-16 h-16 border-2 border-accent bg-accent/10 rounded-full" />
          {Array.from({length:10}).map((_,i) => (
             <motion.div key={i} className="absolute w-1 h-1 bg-blue-400 rounded-full" animate={{ x: mode==='hypo'?[80,-80]:mode==='hyper'?[-20,80]:[80,-80,80], opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:2, delay:i*0.2 }} style={{ top: 20+i*10 }} />
          ))}
       </div>
    </div>
  );
};

// --- TISSUES: MICROSCOPE ---
export const TissuesMicroscope = ({ accentColor }) => {
  const [zoom, setZoom] = useState(1);
  const [type, setType] = useState('epi');

  return (
    <div className="p-4 bg-black/10 rounded flex flex-col items-center">
       <div className="flex gap-2 mb-4 w-full">
          {['epi','mus','con','ner'].map(x => (
             <button key={x} onClick={()=>setType(x)} className={`flex-1 py-1 rounded text-[8px] uppercase font-bold ${type===x?'bg-accent text-white':'bg-white/5'}`}>{x}</button>
          ))}
       </div>
       <div className="w-40 h-40 rounded-full border-8 border-gray-900 bg-white shadow-inner overflow-hidden relative">
          <motion.div animate={{ scale: zoom }} className="w-full h-full flex flex-wrap">
             {type==='epi' && Array.from({length:32}).map((_,i)=><div key={i} className="w-1/4 h-1/8 bg-blue-50 border-[0.5px] border-blue-200" />)}
             {type==='mus' && Array.from({length:8}).map((_,i)=><div key={i} className="w-full h-1/8 border-y-[0.5px] border-red-200 bg-red-50" />)}
             {type==='ner' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 bg-purple-500 rounded-full" /><div className="w-20 h-0.5 bg-purple-300 rotate-45" /></div>}
          </motion.div>
       </div>
       <div className="mt-4 w-full">
          <div className="flex justify-between text-[10px] font-bold text-accent mb-1"><span>ZOOM</span><span>{zoom}x</span></div>
          <input type="range" min="1" max="3" step="1" value={zoom} onChange={e=>setZoom(Number(e.target.value))} className="w-full" />
       </div>
    </div>
  );
};

// --- LIFE: HEARTBEAT ---
export const LifeHeartbeat = ({ accentColor }) => {
  const [bpm, setBpm] = useState(72);
  return (
    <div className="p-6 bg-black/10 rounded flex flex-col items-center">
       <motion.div animate={{ scale: [1,1.1,1,1.1,1] }} transition={{ repeat:Infinity, duration: 60/bpm, times:[0,0.2,0.4,0.6,1] }} className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-full flex items-center justify-center">
          <div className="w-4 h-8 bg-accent/40 rounded-full mx-0.5 shadow-lg" />
          <div className="w-4 h-8 bg-accent/40 rounded-full mx-0.5 shadow-lg" />
       </motion.div>
       <div className="mt-4 w-full"><input type="range" min="60" max="160" value={bpm} onChange={e=>setBpm(Number(e.target.value))} className="w-full" /><div className="text-[10px] text-center font-bold mt-1 text-accent">{bpm} BPM</div></div>
    </div>
  );
};

// --- LIFE: PHOTOSYNTHESIS ---
export const LifePhotosynthesis = () => (
  <div className="h-32 bg-green-900/10 rounded border border-green-500/10 flex items-center justify-center relative overflow-hidden">
     <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:5, ease:'linear' }} className="w-12 h-12 bg-yellow-400 absolute -top-4 -right-4 blur-xl opacity-20" />
     <div className="text-center">
        <div className="text-green-500 font-bold text-[10px] mb-2 uppercase tracking-widest">Photosynthesis Cycle</div>
        <div className="text-white/40 text-[9px] flex gap-4">
           <span>H2O ↑</span> <span>CO2 →</span> <span className="text-accent underline">LEAF</span> <span>→ O2</span>
        </div>
     </div>
  </div>
);

// --- CONTROL: NEURON ---
export const ControlNeuron = ({ accentColor }) => {
  const [fire, setFire] = useState(false);
  return (
    <div className="p-4 bg-black/10 rounded">
       <button onClick={()=>setFire(true)} disabled={fire} className="mb-4 w-full py-1 bg-accent/20 border border-accent/20 text-accent font-bold text-[9px] uppercase rounded">Pulse Signal</button>
       <div className="h-12 relative flex items-center bg-black/20 rounded px-4 overflow-hidden">
          <div className="w-4 h-4 rounded-full border border-white/20" />
          <div className="flex-1 h-0.5 bg-white/10 mx-2 relative">
             <AnimatePresence onExitComplete={()=>setFire(false)}>
                {fire && <motion.div initial={{left:-20}} animate={{left:'100%'}} exit={{opacity:0}} transition={{duration:1, ease:'linear'}} className="absolute top-0 w-2 h-0.5 bg-cyan-400 shadow-[0_0_10px_cyan]" />}
             </AnimatePresence>
          </div>
          <div className="w-2 h-4 border-l border-white/20" />
       </div>
    </div>
  );
};

export const ControlReflex = () => <div className="p-10 text-center text-white/10 text-[9px] uppercase border border-dashed border-white/10">Reflex Arc Animation</div>;
export const ControlTropic = () => <div className="p-10 text-center text-white/10 text-[9px] uppercase border border-dashed border-white/10">Tropic Movements Animation</div>;
