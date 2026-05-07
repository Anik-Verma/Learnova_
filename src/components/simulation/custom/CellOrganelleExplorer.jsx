import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const ORGANELLES = {
  nucleus: {
    id: 'nucleus',
    name: 'Nucleus',
    aka: 'Control Center of the Cell',
    inAnimal: true, inPlant: true,
    color: '#D48C3C',
    function: 'Controls all cellular activities by containing the genetic information (DNA). Directs protein synthesis and cell reproduction.',
    structure: [
      'Double membrane (nuclear envelope)',
      'Nuclear pores for transport',
      'Nucleoplasm (liquid interior)',
      'Chromatin (DNA + proteins)',
      'Nucleolus (ribosome production)'
    ],
    funFact: 'If stretched out, the DNA in a single human nucleus would be about 2 meters long!',
    size: '5-10 micrometers'
  },
  mitochondria: {
    id: 'mitochondria',
    name: 'Mitochondria',
    aka: 'Powerhouse of the Cell',
    inAnimal: true, inPlant: true,
    color: '#FF6432',
    function: 'Produces ATP (energy) through cellular respiration. Converts glucose and oxygen into usable energy for the cell.',
    structure: [
      'Double membrane structure',
      'Outer membrane (smooth)',
      'Inner membrane folded into cristae',
      'Matrix (liquid interior)',
      'Own DNA and ribosomes'
    ],
    funFact: 'Mitochondria have their own DNA — evidence they were once independent bacteria!',
    size: '1-10 micrometers'
  },
  rough_er: {
    id: 'rough_er',
    name: 'Rough ER',
    aka: 'Endoplasmic Reticulum',
    inAnimal: true, inPlant: true,
    color: '#6496FF',
    function: 'Synthesizes and processes proteins destined for secretion or for use in membranes. Ribosomes give it a "rough" texture.',
    structure: [
      'Network of membrane tunnels',
      'Ribosomes studded on outer surface',
      'Connected to nuclear envelope',
      'Lumen (internal space) for processing'
    ],
    funFact: 'Cells that secrete lots of proteins (like pancreatic cells) have enormous amounts of rough ER!',
    size: 'Extends throughout cell'
  },
  golgi: {
    id: 'golgi',
    name: 'Golgi Apparatus',
    aka: 'Postal Service of the Cell',
    inAnimal: true, inPlant: true,
    color: '#FFC832',
    function: 'Receives proteins from ER, modifies them, packages them and ships them to their destination.',
    structure: [
      '4-8 flattened membrane sacs (cisternae)',
      'Cis face (receiving side)',
      'Trans face (shipping side)',
      'Transport vesicles budding off edges'
    ],
    funFact: 'Named after Camillo Golgi who discovered it in 1898 using a silver staining technique!',
    size: '1-3 micrometers'
  },
  ribosome: {
    id: 'ribosome',
    name: 'Ribosome',
    aka: 'Protein Factory',
    inAnimal: true, inPlant: true,
    color: '#96C8FF',
    function: 'Assembles proteins by reading mRNA instructions from the nucleus. Smallest organelles in the cell.',
    structure: [
      'Two subunits: large and small',
      'Made of rRNA and proteins',
      'No membrane (not membrane-bound)',
      'Found free or attached to Rough ER'
    ],
    funFact: 'A single cell can have millions of ribosomes adding 200 amino acids per minute!',
    size: '25 nanometers'
  },
  lysosome: {
    id: 'lysosome',
    name: 'Lysosome',
    aka: 'Waste Disposal Unit',
    inAnimal: true, inPlant: false,
    color: '#C83232',
    function: 'Digests worn out organelles, food particles, and foreign invaders using powerful digestive enzymes.',
    structure: [
      'Single membrane vesicle',
      'Contains 50+ digestive enzymes',
      'Acidic interior (pH 4.5-5)',
      'Formed by Golgi apparatus'
    ],
    funFact: 'If a lysosome bursts, it can digest the entire cell! This is actually part of programmed cell death.',
    size: '0.1-1.2 micrometers'
  },
  vacuole: {
    id: 'vacuole',
    name: 'Central Vacuole',
    aka: 'Storage Hub',
    inAnimal: false, inPlant: true,
    color: '#B4DCFF',
    function: 'Stores water, nutrients, and waste products. Maintains turgor pressure to keep the plant cell rigid.',
    structure: [
      'Single large membrane (tonoplast)',
      'Filled with cell sap (water + solutes)',
      'Can store pigments (colors)',
      'Provides structural support'
    ],
    funFact: 'When a plant wilts, it is because the vacuole has lost water and can no longer support the cell wall!',
    size: 'Fills up to 90% of cell'
  },
  chloroplast: {
    id: 'chloroplast',
    name: 'Chloroplast',
    aka: 'Solar Panel of the Cell',
    inAnimal: false, inPlant: true,
    color: '#28A028',
    function: 'Captures sunlight energy and converts it into glucose through photosynthesis. Contains green chlorophyll.',
    structure: [
      'Double outer membrane',
      'Stroma (liquid interior)',
      'Thylakoid membranes (site of light rxn)',
      'Grana (stacks of thylakoids)'
    ],
    funFact: 'Like mitochondria, chloroplasts have their own DNA and were once free-living bacteria!',
    size: '3-10 micrometers'
  },
  cell_wall: {
    id: 'cell_wall',
    name: 'Cell Wall',
    aka: 'Structural Support',
    inAnimal: false, inPlant: true,
    color: '#508228',
    function: 'A rigid outer layer providing structural support and protection. Prevents cell from bursting.',
    structure: [
      'Primary cell wall (cellulose)',
      'Secondary wall (in some cells)',
      'Middle lamella (between cells)',
      'Plasmodesmata (channels)'
    ],
    funFact: 'Wood is actually made of dead cell walls! The cellulose gives wood its strength.',
    size: '0.1-10 micrometers'
  },
  cell_membrane: {
    id: 'cell_membrane',
    name: 'Cell Membrane',
    aka: 'Plasma Membrane',
    inAnimal: true, inPlant: true,
    color: '#FFB43C',
    function: 'Controls what enters and exits the cell. Maintains homeostasis and cell shape.',
    structure: [
      'Phospholipid bilayer',
      'Embedded proteins',
      'Cholesterol (for fluidity)',
      'Selectively permeable'
    ],
    funFact: 'The membrane is so thin that if a cell were a football field, the membrane would be a sheet of paper!',
    size: '7-10 nanometers'
  },
  centriole: {
    id: 'centriole',
    name: 'Centriole',
    aka: 'Division Organizer',
    inAnimal: true, inPlant: false,
    color: '#DCDC64',
    function: 'Organizes spindle fibers during cell division. Helps pull chromosomes apart.',
    structure: [
      'Cylinder of 9 triplet microtubules',
      'Always in pairs at right angles',
      'Part of centrosome',
      'No membrane boundary'
    ],
    funFact: 'Centrioles are absent in most higher plants — they use different structures to divide!',
    size: '0.5 micrometers'
  }
};

// --- CLICK SYSTEM DATA ---
// Percentages of the 700x500 viewBox
const ANIMAL_CLICK_ZONES = [
  { id: 'nucleus', label: 'Nucleus', shape: 'circle', x: (250-70)/700*100, y: (220-55)/500*100, w: 140/700*100, h: 110/500*100 },
  { id: 'mitochondria', label: 'Mitochondria', shape: 'oval', x: (370)/700*100, y: (120)/500*100, w: 110/700*100, h: 55/500*100, rotate: -15 },
  { id: 'rough_er', label: 'Rough Endoplasmic Reticulum', shape: 'rect', x: (330)/700*100, y: (160)/500*100, w: 90/700*100, h: 120/500*100 },
  { id: 'golgi', label: 'Golgi Apparatus', shape: 'oval', x: (370)/700*100, y: (270)/500*100, w: 110/700*100, h: 80/500*100 },
  { id: 'lysosome', label: 'Lysosome', shape: 'circle', x: (480)/700*100, y: (360)/500*100, w: 50/700*100, h: 50/500*100 },
  { id: 'ribosome', label: 'Ribosome', shape: 'rect', x: (150)/700*100, y: (320)/500*100, w: 70/700*100, h: 60/500*100 },
  { id: 'vacuole', label: 'Vacuole', shape: 'circle', x: (160)/700*100, y: (180)/500*100, w: 70/700*100, h: 60/500*100 },
  { id: 'centriole', label: 'Centriole', shape: 'rect', x: (260)/700*100, y: (340)/500*100, w: 60/700*100, h: 40/500*100 },
  { id: 'cell_membrane', label: 'Cell Membrane', shape: 'rect', x: (280)/700*100, y: (60)/500*100, w: 120/700*100, h: 30/500*100 },
];

const PLANT_CLICK_ZONES = [
  {
    id: 'cell_wall',
    label: 'Cell Wall',
    shape: 'rect',
    x: (60/700)*100,
    y: (40/500)*100,
    w: (580/700)*100,
    h: (22/500)*100,
  },
  {
    id: 'cell_membrane', 
    label: 'Cell Membrane',
    shape: 'rect',
    x: (72/700)*100,
    y: (53/500)*100,
    w: (556/700)*100,
    h: (18/500)*100,
  },
  {
    id: 'vacuole',
    label: 'Central Vacuole',
    shape: 'rect',
    x: (230/700)*100,
    y: (90/500)*100,
    w: (340/700)*100,
    h: (290/500)*100,
  },
  {
    id: 'nucleus',
    label: 'Nucleus',
    shape: 'circle',
    x: ((155-70)/700)*100,
    y: ((390-55)/500)*100,
    w: (140/700)*100,
    h: (110/500)*100,
  },
  {
    id: 'chloroplast_1',
    label: 'Chloroplast',
    shape: 'oval',
    x: ((145-45)/700)*100,
    y: ((130-25)/500)*100,
    w: (90/700)*100,
    h: (50/500)*100,
  },
  {
    id: 'chloroplast_2',
    label: 'Chloroplast',
    shape: 'oval',
    x: ((145-42)/700)*100,
    y: ((248-22)/500)*100,
    w: (84/700)*100,
    h: (44/500)*100,
  },
  {
    id: 'chloroplast_3',
    label: 'Chloroplast',
    shape: 'oval',
    x: ((445-43)/700)*100,
    y: ((418-23)/500)*100,
    w: (86/700)*100,
    h: (46/500)*100,
  },
  {
    id: 'rough_er',
    label: 'Rough ER',
    shape: 'rect',
    x: (100/700)*100,
    y: (285/500)*100,
    w: (110/700)*100,
    h: (75/500)*100,
  },
  {
    id: 'golgi',
    label: 'Golgi Apparatus',
    shape: 'oval',
    x: (108/700)*100,
    y: (178/500)*100,
    w: (100/700)*100,
    h: (60/500)*100,
  },
  {
    id: 'ribosome',
    label: 'Ribosome',
    shape: 'rect',
    x: (590/700)*100,
    y: (200/500)*100,
    w: (48/700)*100,
    h: (100/500)*100,
  },
  {
    id: 'cell_wall',
    label: 'Plasmodesmata (Cell Wall)',
    shape: 'rect',
    x: (280/700)*100,
    y: (40/500)*100,
    w: (140/700)*100,
    h: (25/500)*100,
  },
];

const ANIMAL_HIGHLIGHTS = {
  nucleus: { cx:250, cy:220, rx:70, ry:55 },
  mitochondria: { cx:425, cy:152, rx:55, ry:27 },
  rough_er: { cx:375, cy:220, rx:45, ry:60 },
  golgi: { cx:425, cy:310, rx:55, ry:40 },
  lysosome: { cx:505, cy:385, rx:25, ry:25 },
  ribosome: { cx:185, cy:350, rx:35, ry:30 },
  vacuole: { cx:195, cy:210, rx:35, ry:30 },
  centriole: { cx:290, cy:360, rx:30, ry:20 },
  cell_membrane: { cx:340, cy:75, rx:60, ry:15 },
};

const PLANT_HIGHLIGHTS = {
  cell_wall: { 
    cx: 350, cy: 250, rx: 295, ry: 215 
  },
  cell_membrane: { 
    cx: 350, cy: 250, rx: 282, ry: 202 
  },
  vacuole: { 
    cx: 400, cy: 235, rx: 185, ry: 160 
  },
  nucleus: { 
    cx: 155, cy: 390, rx: 75, ry: 60 
  },
  chloroplast: { 
    cx: 145, cy: 130, rx: 48, ry: 26 
  },
  rough_er: { 
    cx: 155, cy: 320, rx: 60, ry: 42 
  },
  golgi: { 
    cx: 158, cy: 208, rx: 55, ry: 35 
  },
  ribosome: { 
    cx: 614, cy: 250, rx: 28, ry: 55 
  },
};

// --- ANIMATION COMPONENTS ---
const GolgiVesicle = ({ cx, cy, color, isDark }) => {
  const [pos, setPos] = useState({ x: cx, y: cy, opacity: 1 });

  useEffect(() => {
    let startTime = Date.now();
    const duration = 4000;
    
    // Random target near membrane
    const targetX = cx + (Math.random() * 200 - 100);
    const targetY = cy + (Math.random() * 150 + 100);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setPos({
        x: cx + (targetX - cx) * progress,
        y: cy + (targetY - cy) * progress,
        opacity: 1 - progress
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <circle cx={pos.x} cy={pos.y} r={4} fill={color} opacity={pos.opacity * 0.6} style={{ pointerEvents: 'none' }} />
  );
};

export default function CellOrganelleExplorer({ isDark, accentColor }) {
  const [cellType, setCellType] = useState('animal');
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);
  const [hoveredOrganelle, setHoveredOrganelle] = useState(null);
  const [clickedOrganelle, setClickedOrganelle] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [vesicles, setVesicles] = useState([]);
  const [ribosomeParticles, setRibosomeParticles] = useState([]);

  // --- Effects ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (cellType === 'animal') {
        setVesicles(v => [...v.slice(-5), { id: Date.now(), x: 450, y: 320 }]);
      } else {
        setVesicles(v => [...v.slice(-5), { id: Date.now(), x: 410, y: 380 }]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [cellType]);

  // Ribosome drift logic
  useEffect(() => {
    const count = 25;
    const initial = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 100 + Math.random() * 500,
      y: 100 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));
    setRibosomeParticles(initial);

    let frameId;
    const move = () => {
      setRibosomeParticles(prev => prev.map(p => {
        let nx = p.x + p.vx;
        let ny = p.y + p.vy;
        if (nx < 50 || nx > 650) p.vx *= -1;
        if (ny < 50 || ny > 450) p.vy *= -1;
        return { ...p, x: nx, y: ny };
      }));
      frameId = requestAnimationFrame(move);
    };
    frameId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const t = {
    bg: isDark ? '#0a0d0a' : '#f0f5f0',
    panel: isDark ? '#111' : '#fff',
    border: isDark ? '#222' : '#e0e0e0',
    text: isDark ? '#fff' : '#000',
    textDim: isDark ? '#888' : '#666',
    cytoplasm: isDark ? 'rgba(40,50,35,0.4)' : 'rgba(240,255,235,0.6)',
  };

  const handleOrganelleClick = (organelleId) => {
    // Strip the _1 _2 _3 suffix
    const baseId = organelleId.replace(/_\d+$/, '')
    setSelectedOrganelle(baseId);
    setClickedOrganelle(organelleId);
    setTimeout(() => setClickedOrganelle(null), 400);
  };

  function getHighlightForOrganelle(organelleId, type) {
    // Strip the _1 _2 _3 suffix
    const baseId = organelleId.replace(/_\d+$/, '')
    const highlights = type === 'animal' ? ANIMAL_HIGHLIGHTS : PLANT_HIGHLIGHTS;
    const hData = highlights[baseId];
    if (!hData) return null;
    
    const hArray = Array.isArray(hData) ? hData : [hData];
    
    return hArray.map((h, i) => (
      <ellipse
        key={i}
        cx={h.cx}
        cy={h.cy}
        rx={h.rx + 8}
        ry={h.ry + 8}
        fill="none"
        stroke={ORGANELLES[baseId]?.color || '#00d4ff'}
        strokeWidth="2.5"
        strokeDasharray="6 3"
        opacity="0.8"
        style={{
          animation: 'organelle-pulse 1.5s ease-in-out infinite'
        }}
      />
    ));
  }

  function getZoneCenter(organelleId) {
    const zones = cellType === 'animal' ? ANIMAL_CLICK_ZONES : PLANT_CLICK_ZONES;
    const zone = zones.find(z => z.id === organelleId);
    if (!zone) return { x: 50, y: 50 };
    return {
      x: zone.x + zone.w / 2,
      y: zone.y
    };
  }

  // Helper for consistent organelle groups
  const OrganelleGroup = ({ id, children, labelPos = { x: 0, y: 0 }, anchor = { x: 0, y: 0 }, hitArea = null }) => {
    const isHovered = hoveredOrganelle === id;
    const isSelected = selectedOrganelle === id;
    const isClicked = clickedOrganelle === id;
    const data = ORGANELLES[id];

    return (
      <g 
        id={`group-${id}`}
        style={{ transition: 'all 0.3s', pointerEvents: 'none' }}
      >
        {/* Visuals */}
        <g 
          filter={isHovered ? 'brightness(1.2) drop-shadow(0 0 8px ' + data.color + '88)' : 'none'}
          style={{ 
            opacity: isSelected ? 1 : (hoveredOrganelle && !isHovered ? 0.6 : 1),
            transform: isClicked ? 'scale(1.05)' : 'scale(1)',
            transformOrigin: `${anchor.x}px ${anchor.y}px`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {children}
        </g>

        {/* Labels & Leader lines */}
        <g opacity={isHovered || isSelected ? 1 : 0.6} style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}>
           <line 
            x1={anchor.x} y1={anchor.y} x2={labelPos.x} y2={labelPos.y} 
            stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} 
            strokeWidth="0.8" strokeDasharray="3,3"
           />
           <rect x={labelPos.x - 4} y={labelPos.y - 12} width={data.name.length * 6 + 10} height={16} rx="2" fill={isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'} />
           <text x={labelPos.x + 2} y={labelPos.y} fontFamily="Space Grotesk" fontSize="9" fontWeight={isHovered || isSelected ? 700 : 400} fill={isHovered || isSelected ? accentColor : t.textDim}>
              {data.name.toUpperCase()}
           </text>
        </g>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: t.bg, color: t.text, overflow: 'hidden' }}>
      <style>{`
        @keyframes cellOrganellePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes mitochondriaRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes chloroplastPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes nuclearPoreGrow {
          0%, 100% { r: 3.5; }
          50% { r: 5; }
        }
        @keyframes organelle-pulse {
          0%, 100% { 
            opacity: 0.8; 
            stroke-width: 2.5px;
          }
          50% { 
            opacity: 0.4; 
            stroke-width: 1.5px;
          }
        }
      `}</style>
      
      {/* LEFT PANEL - SVG */}
      <div style={{ flex: '0 0 65%', position: 'relative', borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column' }}>
        
        {/* Switcher */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', gap: 10 }}>
           {['animal', 'plant'].map(type => (
             <button
               key={type}
               onClick={() => { 
                 setCellType(type); 
                 setSelectedOrganelle(null); 
               }}
               style={{
                 padding: '8px 16px', borderRadius: 2, border: `1px solid ${cellType === type ? accentColor : t.border}`,
                 background: cellType === type ? `${accentColor}15` : t.panel,
                 color: cellType === type ? accentColor : t.textDim,
                 fontFamily: 'Orbitron', fontSize: 10, cursor: 'pointer', transition: 'all 0.2s'
               }}
             >
               {type.toUpperCase()} CELL
             </button>
           ))}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* LAYER 1: Pure visual SVG */}
          <svg 
            viewBox="0 0 700 500" width="100%" height="100%" style={{ maxHeight: '90%', pointerEvents: 'none' }}
          >
            {/* Very subtle background grid */}
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={t.text} opacity="0.05" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" pointerEvents="none" />

            <AnimatePresence mode="wait">
              {cellType === 'animal' ? (
                <motion.g key="animal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  
                  {/* CELL BOUNDARY (MEMBRANE) */}
                  <OrganelleGroup id="cell_membrane" anchor={{ x: 60, y: 250 }} labelPos={{ x: 30, y: 400 }}>
                    <path 
                      d="M100 250 C100 100 250 80 350 80 C500 80 600 150 600 250 C600 400 450 420 350 420 C200 420 100 400 100 250Z"
                      fill={t.cytoplasm} stroke={ORGANELLES.cell_membrane.color} strokeWidth="3"
                    />
                    <path 
                      d="M108 250 C108 108 248 88 348 88 C498 88 592 158 592 250 C592 392 448 412 348 412 C208 412 108 392 108 250Z"
                      fill="none" stroke={ORGANELLES.cell_membrane.color} strokeWidth="1" opacity="0.3"
                    />
                  </OrganelleGroup>

                  {/* FREE RIBOSOMES */}
                  <OrganelleGroup id="ribosome" anchor={{ x: 500, y: 150 }} labelPos={{ x: 550, y: 50 }}>
                    {ribosomeParticles.map(p => (
                      <circle key={p.id} cx={p.x} cy={p.y} r={2.5} fill={ORGANELLES.ribosome.color} opacity="0.6" />
                    ))}
                  </OrganelleGroup>

                  {/* NUCLEUS */}
                  <OrganelleGroup id="nucleus" anchor={{ x: 220, y: 250 }} labelPos={{ x: 50, y: 50 }} 
                    hitArea={<ellipse cx="220" cy="250" rx="85" ry="80" />}
                  >
                    <ellipse cx="220" cy="250" rx="70" ry="65" fill={ORGANELLES.nucleus.color + '22'} stroke={ORGANELLES.nucleus.color} strokeWidth="3" />
                    <ellipse cx="220" cy="250" rx="64" ry="59" fill="none" stroke={ORGANELLES.nucleus.color} strokeWidth="1" opacity="0.4" />
                    {[1,2,3,4,5,6].map(i => (
                      <circle key={i} cx={180 + Math.random()*80} cy={220 + Math.random()*60} r={4 + Math.random()*4} fill={ORGANELLES.nucleus.color} opacity="0.3" />
                    ))}
                    <ellipse cx="235" cy="240" rx="22" ry="20" fill={ORGANELLES.nucleus.color} stroke={ORGANELLES.nucleus.color} strokeWidth="1.5" opacity="0.8" />
                    <circle cx="230" cy="235" r="8" fill="#fff" opacity="0.1" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                      <circle 
                        key={angle} cx={220 + 70 * Math.cos(angle * Math.PI / 180)} cy={250 + 65 * Math.sin(angle * Math.PI / 180)} 
                        fill={ORGANELLES.nucleus.color} style={{ animation: `nuclearPoreGrow ${3 + angle/100}s infinite ease-in-out` }} />
                    ))}
                  </OrganelleGroup>

                  {/* ROUGH ER */}
                  <OrganelleGroup id="rough_er" anchor={{ x: 190, y: 320 }} labelPos={{ x: 50, y: 450 }}>
                    <path d="M280 200 C310 200 330 250 310 300 C300 330 250 340 200 340" fill="none" stroke={ORGANELLES.rough_er.color} strokeWidth="4" />
                    <path d="M295 190 C330 190 350 250 330 310 C310 350 250 360 180 360" fill="none" stroke={ORGANELLES.rough_er.color} strokeWidth="4" opacity="0.6" />
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <circle key={i} cx={280 + i * 5} cy={200 + Math.sin(i)*5} r={2} fill={ORGANELLES.ribosome.color} />
                    ))}
                  </OrganelleGroup>

                  {/* MITOCHONDRIA */}
                  <OrganelleGroup id="mitochondria" anchor={{ x: 450, y: 150 }} labelPos={{ x: 550, y: 120 }}>
                     <g transform="translate(450, 150) rotate(30)">
                        <rect x="-25" y="-12" width="50" height="24" rx="12" fill={ORGANELLES.mitochondria.color + '22'} stroke={ORGANELLES.mitochondria.color} strokeWidth="2" />
                        <path d="M-18 -6 Q-10 6 0 -6 Q10 6 18 -6" fill="none" stroke={ORGANELLES.mitochondria.color} strokeWidth="1.5" />
                     </g>
                     <g transform="translate(380, 360) rotate(-45)">
                        <rect x="-25" y="-12" width="50" height="24" rx="12" fill={ORGANELLES.mitochondria.color + '22'} stroke={ORGANELLES.mitochondria.color} strokeWidth="2" />
                        <path d="M-18 -6 Q-10 6 0 -6 Q10 6 18 -6" fill="none" stroke={ORGANELLES.mitochondria.color} strokeWidth="1.5" />
                     </g>
                  </OrganelleGroup>

                  {/* GOLGI */}
                  <OrganelleGroup id="golgi" anchor={{ x: 480, y: 280 }} labelPos={{ x: 550, y: 400 }}>
                    {[0,1,2,3,4].map(i => (
                      <path 
                        key={i} d={`M${440 + i*4} ${250 + i*10} Q${480 + i*4} ${260 + i*10} ${440 + i*4} ${290 + i*10}`} 
                        fill="none" stroke={ORGANELLES.golgi.color} strokeWidth="3" opacity={1 - i*0.1} />
                    ))}
                    {vesicles.map(v => <GolgiVesicle key={v.id} cx={v.x} cy={v.y} color={ORGANELLES.golgi.color} isDark={isDark} />)}
                  </OrganelleGroup>

                  {/* LYSOSOMES */}
                  <OrganelleGroup id="lysosome" anchor={{ x: 500, y: 350 }} labelPos={{ x: 550, y: 450 }}>
                     <circle cx="500" cy="350" r="12" fill={ORGANELLES.lysosome.color + '33'} stroke={ORGANELLES.lysosome.color} strokeWidth="1.5" />
                     <circle cx="503" cy="347" r="2" fill={ORGANELLES.lysosome.color} opacity="0.6" />
                     <circle cx="480" cy="390" r="8" fill={ORGANELLES.lysosome.color + '33'} stroke={ORGANELLES.lysosome.color} strokeWidth="1.5" />
                  </OrganelleGroup>

                  {/* CENTRIOLES */}
                  <OrganelleGroup id="centriole" anchor={{ x: 300, y: 150 }} labelPos={{ x: 350, y: 40 }}>
                     <rect x="290" y="145" width="15" height="6" fill={ORGANELLES.centriole.color + '66'} stroke={ORGANELLES.centriole.color} />
                     <rect x="297" y="140" width="6" height="15" fill={ORGANELLES.centriole.color + '66'} stroke={ORGANELLES.centriole.color} />
                  </OrganelleGroup>

                </motion.g>
              ) : (
                <motion.g key="plant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  
                  {/* CELL WALL */}
                  <OrganelleGroup id="cell_wall" anchor={{ x: 350, y: 250 }} labelPos={{ x: 72, y: 35 }}>
                    <rect x="60" y="40" width="580" height="420" rx="15" ry="15" fill="rgba(80,130,40,0.12)" stroke="rgba(80,130,40,0.9)" strokeWidth="7" />
                    {/* Plasmodesmata channels */}
                    {[280, 320, 360, 400].map(x => (
                      <line key={x} x1={x} y1="36" x2={x} y2="44" stroke={t.bg} strokeWidth="4" />
                    ))}
                    <text x="72" y="35" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="Space Grotesk" letterSpacing="0.15em">CELL WALL</text>
                  </OrganelleGroup>

                  {/* CELL MEMBRANE */}
                  <OrganelleGroup id="cell_membrane" anchor={{ x: 350, y: 250 }} labelPos={{ x: 72, y: 62 }}>
                    <rect x="72" y="52" width="556" height="396" rx="12" ry="12" fill="none" stroke="rgba(120,180,60,0.55)" strokeWidth="2" />
                    <text x="72" y="62" fontSize="9" fill="rgba(120,180,60,0.7)" fontFamily="Space Grotesk">CELL MEMBRANE</text>
                  </OrganelleGroup>

                  {/* CENTRAL VACUOLE */}
                  <OrganelleGroup id="vacuole" anchor={{ x: 400, y: 235 }} labelPos={{ x: 580, y: 240 }}>
                    <rect x="220" y="80" width="360" height="310" rx="20" ry="20" fill="rgba(160,210,255,0.18)" stroke="rgba(100,160,220,0.55)" strokeWidth="2" />
                    <text x="400" y="245" textAnchor="middle" fill="rgba(100,160,220,0.2)" fontSize="18" fontFamily="Orbitron">VACUOLE</text>
                    <text x="580" y="240" fontSize="9" fill="rgba(100,160,220,0.6)" fontFamily="Space Grotesk">CENTRAL VACUOLE</text>
                  </OrganelleGroup>

                  {/* NUCLEUS (bottom left) */}
                  <OrganelleGroup id="nucleus" anchor={{ x: 155, y: 390 }} labelPos={{ x: 75, y: 405 }}>
                    <ellipse cx="155" cy="390" rx="70" ry="55" fill="rgba(180,130,40,0.18)" stroke="rgba(200,150,60,0.85)" strokeWidth="3" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                      <circle key={angle} cx={155 + 70 * Math.cos(angle * Math.PI / 180)} cy={390 + 55 * Math.sin(angle * Math.PI / 180)} r="3" fill="rgba(200,150,60,0.9)" />
                    ))}
                    <ellipse cx="155" cy="390" rx="64" ry="49" fill="none" stroke="rgba(180,130,40,0.35)" strokeWidth="1" />
                    <ellipse cx="155" cy="390" rx="60" ry="46" fill="rgba(190,145,55,0.15)" />
                    <ellipse cx="152" cy="387" rx="22" ry="18" fill="rgba(130,75,15,0.65)" stroke="rgba(160,100,30,0.5)" strokeWidth="1.5" />
                    {/* Chromatin dots */}
                    {[1,2,3,4,5,6].map(i => (
                      <ellipse key={i} cx={140 + i*5} cy={380 + Math.sin(i)*10} rx="3" ry="2" fill="rgba(130,75,15,0.3)" />
                    ))}
                    <text x="75" y="405" fontSize="9" fill="rgba(200,150,60,0.7)" fontFamily="Space Grotesk">NUCLEUS</text>
                  </OrganelleGroup>

                  {/* CHLOROPLASTS */}
                  <OrganelleGroup id="chloroplast" anchor={{ x: 145, y: 130 }} labelPos={{ x: 90, y: 108 }}>
                    {/* Chloroplast 1 */}
                    <g transform="translate(145, 130) rotate(45)">
                      <ellipse rx="42" ry="22" fill="rgba(40,160,40,0.25)" stroke="rgba(50,175,50,0.8)" strokeWidth="2" />
                      <line x1="-20" y1="-5" x2="-5" y2="-5" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                      <line x1="-20" y1="0" x2="-5" y2="0" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                      <line x1="5" y1="-2" x2="20" y2="-2" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                      <ellipse cx="-13" cy="-8" rx="14" ry="8" fill="rgba(88,220,78,0.25)" />
                    </g>
                    {/* Chloroplast 2 */}
                    <g transform="translate(145, 248) rotate(-10)">
                      <ellipse rx="38" ry="20" fill="rgba(40,160,40,0.25)" stroke="rgba(50,175,50,0.8)" strokeWidth="2" />
                      <line x1="-15" y1="-3" x2="0" y2="-3" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                      <line x1="5" y1="2" x2="20" y2="2" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                    </g>
                    {/* Chloroplast 3 */}
                    <g transform="translate(445, 418) rotate(180)">
                      <ellipse rx="40" ry="21" fill="rgba(40,160,40,0.25)" stroke="rgba(50,175,50,0.8)" strokeWidth="2" />
                      <line x1="-15" y1="-2" x2="15" y2="-2" stroke="rgba(20,80,20,0.6)" strokeWidth="2" />
                    </g>
                    <text x="90" y="108" fontSize="9" fill="rgba(50,175,50,0.7)" fontFamily="Space Grotesk">CHLOROPLAST</text>
                  </OrganelleGroup>

                  {/* ROUGH ER (above nucleus) */}
                  <OrganelleGroup id="rough_er" anchor={{ x: 155, y: 310 }} labelPos={{ x: 72, y: 285 }}>
                    {[0, 1, 2, 3].map(i => (
                      <path key={i} d={`M100 ${340 - i*8} Q150 ${330 - i*8} 200 ${340 - i*8}`} fill="none" stroke="rgba(100,150,255,0.6)" strokeWidth="2" />
                    ))}
                    {[1,2,3,4,5].map(i => (
                      <circle key={i} cx={110 + i*20} cy={325} r="1.5" fill="rgba(150,200,255,0.8)" />
                    ))}
                    <text x="72" y="285" fontSize="9" fill="rgba(100,150,255,0.6)" fontFamily="Space Grotesk">ROUGH ER</text>
                  </OrganelleGroup>

                  {/* GOLGI (left side) */}
                  <OrganelleGroup id="golgi" anchor={{ x: 155, y: 200 }} labelPos={{ x: 72, y: 175 }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <path key={i} d={`M120 ${230 - i*10} Q155 ${235 - i*10} 190 ${230 - i*10}`} fill="none" stroke="rgba(255,200,50,0.6)" strokeWidth="4" />
                    ))}
                    {[0, 1, 2].map(i => (
                      <circle key={i} cx="195" cy={200 + i*15} r="3" fill="rgba(255,200,50,0.4)" />
                    ))}
                    <text x="72" y="175" fontSize="9" fill="rgba(255,200,50,0.6)" fontFamily="Space Grotesk">GOLGI</text>
                  </OrganelleGroup>

                  {/* RIBOSOMES */}
                  <OrganelleGroup id="ribosome" anchor={{ x: 610, y: 250 }} labelPos={{ x: 590, y: 200 }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <circle key={i} cx={590 + Math.random()*40} cy={200 + Math.random()*100} r="2.5" fill="rgba(150,200,255,0.7)" />
                    ))}
                  </OrganelleGroup>

                </motion.g>
              )}
            </AnimatePresence>

            {/* HIGHLIGHT OVERLAYS */}
            {(hoveredOrganelle || selectedOrganelle) && (
              <g pointerEvents="none">
                {getHighlightForOrganelle(
                  selectedOrganelle || hoveredOrganelle, 
                  cellType
                )}
              </g>
            )}
          </svg>

          {/* LAYER 2: Invisible click zones and tooltips */}
          <div 
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          >
            <div 
              style={{ position: 'relative', width: '100%', aspectRatio: '700/500', maxHeight: '90%', pointerEvents: 'all' }}
              onClick={() => setSelectedOrganelle(null)}
            >
              {(cellType === 'animal' ? ANIMAL_CLICK_ZONES : PLANT_CLICK_ZONES).map((zone, idx) => (
                <div
                  key={`${zone.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrganelleClick(zone.id);
                  }}
                  onMouseEnter={() => setHoveredOrganelle(zone.id)}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  title={zone.label}
                  style={{
                    position: 'absolute',
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                    cursor: 'pointer',
                    pointerEvents: 'all',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: zone.shape === 'circle' ? '50%' : '4px',
                    zIndex: 10,
                    transform: zone.rotate ? `rotate(${zone.rotate}deg)` : 'none',
                    transformOrigin: 'center'
                  }}
                />
              ))}

              {/* Tooltip Overlay */}
              {hoveredOrganelle && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${getZoneCenter(hoveredOrganelle).x}%`,
                    top: `${getZoneCenter(hoveredOrganelle).y - 6}%`,
                    transform: 'translateX(-50%) translateY(-100%)',
                    background: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
                    border: `1px solid ${ORGANELLES[hoveredOrganelle]?.color || accentColor}`,
                    borderRadius: 4,
                    padding: '6px 10px',
                    pointerEvents: 'none',
                    zIndex: 20,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: ORGANELLES[hoveredOrganelle]?.color || accentColor, letterSpacing: '0.05em' }}>
                    {ORGANELLES[hoveredOrganelle]?.name}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 9, color: isDark ? '#888' : '#666', marginTop: 2 }}>
                    Click to explore →
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - INFO */}
      <div style={{ flex: '0 0 35%', padding: 30, background: t.panel, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {selectedOrganelle ? (
            <motion.div
              key={selectedOrganelle} // Forces remount on selection change
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <OrganelleInfo id={selectedOrganelle} isDark={isDark} accentColor={accentColor} t={t} />
            </motion.div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <div style={{ fontSize: 40, opacity: 0.2, marginBottom: 20 }}>🔬</div>
               <h3 style={{ fontFamily: 'Orbitron', fontSize: 14, color: t.textDim }}>SELECT AN ORGANELLE</h3>
               <p style={{ fontSize: 11, fontFamily: 'Space Grotesk', color: t.textDim, opacity: 0.5, marginTop: 10 }}>CLICK ANY PART OF THE CELL TO REVEAL<br/>ITS INTERNAL SECRETS AND FUNCTIONS</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const OrganelleInfo = ({ id, isDark, accentColor, t }) => {
  const data = ORGANELLES[id];
  if (!data) return null;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: 20, color: accentColor, margin: 0 }}>{data.name}</h2>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: t.textDim, marginTop: 4 }}>{data.aka}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {data.inAnimal && <span style={{ padding: '2px 8px', background: '#FFCAD4', color: '#000', fontSize: 8, borderRadius: 2, fontFamily: 'Space Grotesk' }}>ANIMAL</span>}
          {data.inPlant && <span style={{ padding: '2px 8px', background: '#D4FFCA', color: '#000', fontSize: 8, borderRadius: 2, fontFamily: 'Space Grotesk' }}>PLANT</span>}
        </div>
      </div>

      <div style={{ width: '100%', height: 120, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: `1px solid ${t.border}` }}>
         <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill={data.color + '44'} stroke={data.color} strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill={data.color} opacity="0.6" />
         </svg>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: accentColor, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Function</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: t.text }}>{data.function}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, color: accentColor, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Structure</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.structure.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: t.textDim }}>
               <span style={{ color: accentColor }}>•</span>
               {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, background: `${accentColor}10`, border: `1px solid ${accentColor}30`, borderRadius: 4 }}>
         <div style={{ fontSize: 10, fontFamily: 'Orbitron', color: accentColor, marginBottom: 8 }}>⚡ QUICK FACT</div>
         <p style={{ fontSize: 12, margin: 0, color: t.text, fontStyle: 'italic', lineHeight: 1.5 }}>{data.funFact}</p>
      </div>

      <div style={{ marginTop: 24, fontSize: 10, color: t.textDim, fontFamily: 'Space Grotesk' }}>
         ESTIMATED SIZE: {data.size}
      </div>
    </div>
  );
};
