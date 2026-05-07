import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomScene } from '../../scenes/index';

import RocketScene from '../../scenes/RocketScene';
import F1Scene from '../../scenes/F1Scene';
import NewtonScene from '../../scenes/NewtonScene';
import ElementsScene from '../../scenes/ElementsScene';
import PeriodicScene from '../../scenes/PeriodicScene';
import DNAScene from '../../scenes/DNAScene';
import NeuronScene from '../../scenes/NeuronScene';
import SolarScene from '../../scenes/SolarScene';
import CellScene from '../../scenes/CellScene';

export default function SceneRenderer() {
  const [scene, setScene] = useState(null);

  useEffect(() => {
    // Pick scene on mount - never change during component lifetime.
    setScene(getRandomScene());
  }, []);

  if (!scene) return null;

  // Determine accent color
  let accentColor = '#00d4ff'; // Physics default
  if (scene.subject === 'Chemistry') accentColor = '#ffdd4c';
  if (scene.subject === 'Biology') accentColor = '#39ff14';

  return (
    <>
      {/* Background layer */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
        style={{ 
           zIndex: 0,
           backgroundColor: '#000000',
           backgroundImage: `
             linear-gradient(to right, rgba(168,232,255,0.05) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(168,232,255,0.05) 1px, transparent 1px)
           `,
           backgroundSize: '40px 40px'
        }}
      >
        {scene.id === 'rocket'   && <RocketScene />}
        {scene.id === 'f1'       && <F1Scene />}
        {scene.id === 'newton'   && <NewtonScene />}
        {scene.id === 'elements' && <ElementsScene />}
        {scene.id === 'periodic' && <PeriodicScene />}
        {scene.id === 'dna'      && <DNAScene />}
        {scene.id === 'neuron'   && <NeuronScene />}
        {scene.id === 'solar'    && <SolarScene />}
        {scene.id === 'cell'     && <CellScene />}
      </div>

      {/* Bottom fade for readability */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
      />

      {/* Bottom-left label */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="fixed bottom-[28px] left-[28px] z-[20] pointer-events-none"
      >
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: accentColor,
          textTransform: 'uppercase'
        }}>
          {scene.subject} — {scene.concept}
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.25)',
          marginTop: '4px'
        }}>
          [ {scene.label} ]
        </div>
      </motion.div>
    </>
  );
}
