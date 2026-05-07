import React, { useRef, useEffect, useState } from 'react';
import ANIMATION_MAP from '../../data/animationMap';

import { 
  MotionDistanceTime, 
  MotionVelocityTime, 
  MotionEquations,
  LawsInertia,
  LawsNewton2,
  LawsNewton3,
  GravitationFreeFall,
  GravitationUniversal,
  LightReflection,
  LightRefraction
} from './animations/PhysicsAnimations';

import { 
  MatterStates, 
  MatterDiffusion,
  AtomsBohr,
  AtomsDiscovery,
  AcidsPH,
  AcidsNeutralisation
} from './animations/ChemistryAnimations';

import {
  CellsOrganelles,
  CellsOsmosis,
  TissuesMicroscope,
  LifeHeartbeat,
  LifePhotosynthesis,
  ControlNeuron,
  ControlReflex,
  ControlTropic,
  CellsDiscovery,
  CellsShapeSize,
  CellsTheory,
  CellsMembrane,
  CellsWall,
  CellsNucleus,
  CellsCytoplasm,
  CellsER,
  CellsGolgi,
  CellsLysosome,
  CellsMitochondria,
  CellsPlastids,
  CellsVacuoles,
  CellsDifferences
} from './animations/BiologyAnimations';

class SimulationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 border border-red-500/20 rounded bg-red-500/5">
           <span className="text-2xl mb-2">⚠️</span>
           <span className="text-xs uppercase font-bold tracking-widest text-red-500">Simulation Unavailable</span>
        </div>
      );
    }
    return this.props.children; 
  }
}

const getInstruction = (id) => {
  if (!id) return '';
  if (id.includes('distance_time') || id.includes('graphs')) return 'Try this: Change the speed and observe how the slope of the line changes.';
  if (id.includes('velocity_time')) return 'Try this: Switch between uniform and accelerating modes to see the difference.';
  if (id.includes('newton2')) return 'Try this: Double the force and observe the acceleration. Then double the mass and see what happens.';
  if (id.includes('newton3')) return 'Try this: Select different scenarios and observe how the action and reaction forces are always opposite.';
  if (id.includes('freefall')) return 'Try this: Toggle air resistance and observe the difference in falling speed.';
  return 'Try this: Adjust the controls to see how the system responds.';
};

const formatTitle = (id) => {
  if (!id) return '';
  return id.replace(/_/g, ' ').toUpperCase();
};

const SubtopicAnimation = ({ subtopicId, accentColor, isDark }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const animationId = ANIMATION_MAP[subtopicId];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    
    // Simulate slight loading delay to ensure canvas context is ready
    const timer = setTimeout(() => setIsLoaded(true), 400);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  if (!animationId) return null;

  const renderAnimation = () => {
    const props = { accentColor, isDark, isVisible };
    
    switch (animationId) {
      // Physics
      case 'motion_distance_time': return <MotionDistanceTime {...props} />;
      case 'motion_velocity_time': return <MotionVelocityTime {...props} />;
      case 'motion_equations': return <MotionEquations {...props} />;
      case 'laws_inertia': return <LawsInertia {...props} />;
      case 'laws_newton2': return <LawsNewton2 {...props} />;
      case 'laws_newton3': return <LawsNewton3 {...props} />;
      case 'gravitation_freefall': return <GravitationFreeFall {...props} />;
      case 'gravitation_universal': return <GravitationUniversal {...props} />;
      case 'light_reflection': return <LightReflection {...props} />;
      case 'light_refraction': return <LightRefraction {...props} />;
      
      // Chemistry
      case 'matter_states': return <MatterStates {...props} />;
      case 'matter_diffusion': return <MatterDiffusion {...props} />;
      case 'atoms_bohr': return <AtomsBohr {...props} />;
      case 'atoms_discovery': return <AtomsDiscovery {...props} />;
      case 'acids_pH': return <AcidsPH {...props} />;
      case 'acids_neutralisation': return <AcidsNeutralisation {...props} />;

      // Biology
      case 'cells_discovery': return <CellsDiscovery {...props} />;
      case 'cells_shape_size': return <CellsShapeSize {...props} />;
      case 'cells_theory': return <CellsTheory {...props} />;
      case 'cells_membrane': return <CellsMembrane {...props} />;
      case 'cells_wall': return <CellsWall {...props} />;
      case 'cells_nucleus': return <CellsNucleus {...props} />;
      case 'cells_cytoplasm': return <CellsCytoplasm {...props} />;
      case 'cells_er': return <CellsER {...props} />;
      case 'cells_golgi': return <CellsGolgi {...props} />;
      case 'cells_lysosome': return <CellsLysosome {...props} />;
      case 'cells_mitochondria': return <CellsMitochondria {...props} />;
      case 'cells_plastids': return <CellsPlastids {...props} />;
      case 'cells_vacuoles': return <CellsVacuoles {...props} />;
      case 'cells_differences': return <CellsDifferences {...props} />;
      case 'cells_organelles': return <CellsOrganelles {...props} />;
      case 'cells_osmosis': return <CellsOsmosis {...props} />;
      case 'tissues_microscope': return <TissuesMicroscope {...props} />;
      case 'life_heartbeat': return <LifeHeartbeat {...props} />;
      case 'life_photosynthesis': return <LifePhotosynthesis {...props} />;
      case 'control_neuron': return <ControlNeuron {...props} />;
      case 'control_reflex': return <ControlReflex {...props} />;
      case 'control_tropic': return <ControlTropic {...props} />;

      default: return null;
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{
        margin: '20px 0',
        borderRadius: '4px',
        overflow: 'hidden',
        border: isDark 
          ? `1px solid ${accentColor}30`
          : `1px solid ${accentColor}20`,
        background: isDark ? '#0a0a0a' : '#ffffff'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '8px 14px',
        borderBottom: isDark
          ? `1px solid ${accentColor}20`
          : `1px solid ${accentColor}10`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: isDark ? `${accentColor}10` : `${accentColor}05`
      }}>
        <div style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: accentColor
        }} />
        <span style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 10,
          color: accentColor,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }}>
          Interactive: {formatTitle(animationId)}
        </span>
      </div>
      
      {/* Canvas Area */}
      <div style={{ width: '100%', position: 'relative' }}>
        {!isLoaded ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-3" style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }}></div>
             <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accentColor }}>Initializing simulation...</div>
           </div>
        ) : (
          <SimulationErrorBoundary accentColor={accentColor}>
            {!isVisible && (
              <div 
                className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
                style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>Paused - Scroll to view</span>
              </div>
            )}
            {renderAnimation()}
          </SimulationErrorBoundary>
        )}
      </div>

      <div style={{
        padding: '8px 14px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        fontSize: '12px',
        fontStyle: 'italic',
        color: isDark ? '#aaa' : '#666',
        background: isDark ? '#111' : '#f9f9f9'
      }}>
        <span style={{ marginRight: '8px' }}>🎮</span> 
        {getInstruction(animationId)}
      </div>
    </div>
  );
};

export default SubtopicAnimation;
