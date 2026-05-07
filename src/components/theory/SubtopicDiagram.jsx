import React from 'react';
import DIAGRAM_MAP from '../../data/diagramMap';

const SubtopicDiagram = ({ subtopicId, accentColor = '#00d4ff' }) => {
  const diagramId = DIAGRAM_MAP[subtopicId];
  
  if (!diagramId) return null;

  const renderDiagram = () => {
    switch (diagramId) {
      case 'concave_convex_mirrors':
        return (
          <svg width="100%" height="200" viewBox="0 0 500 200" className="mx-auto">
            {/* Left - Concave */}
            <path d="M120,40 Q80,100 120,160" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <circle cx="60" cy="100" r="3" fill={accentColor} />
            <text x="60" y="115" fill="white" fontSize="10" textAnchor="middle">C</text>
            <circle cx="90" cy="100" r="3" fill="#ff4d4d" />
            <text x="90" y="115" fill="white" fontSize="10" textAnchor="middle">F</text>
            <text x="100" y="180" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">CONCAVE MIRROR</text>
            <text x="100" y="195" fill={accentColor} fontSize="10" textAnchor="middle">Converging</text>

            {/* Right - Convex */}
            <path d="M380,40 Q420,100 380,160" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="320" y1="100" x2="480" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <circle cx="440" cy="100" r="3" fill={accentColor} opacity="0.6" />
            <text x="440" y="115" fill="white" fontSize="10" textAnchor="middle" opacity="0.6">C</text>
            <circle cx="410" cy="100" r="3" fill="#ff4d4d" opacity="0.6" />
            <text x="410" y="115" fill="white" fontSize="10" textAnchor="middle" opacity="0.6">F</text>
            <text x="400" y="180" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">CONVEX MIRROR</text>
            <text x="400" y="195" fill={accentColor} fontSize="10" textAnchor="middle">Diverging</text>
          </svg>
        );

      case 'image_formation_mirror':
        return (
          <svg width="100%" height="220" viewBox="0 0 500 220" className="mx-auto">
            {/* Mirror */}
            <path d="M400,30 Q360,110 400,190" fill="none" stroke="white" strokeWidth="4" />
            <line x1="50" y1="110" x2="450" y2="110" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
            
            {/* Points */}
            <circle cx="200" cy="110" r="3" fill={accentColor} />
            <text x="200" y="125" fill="white" fontSize="10" textAnchor="middle">C</text>
            <circle cx="300" cy="110" r="3" fill="#ff4d4d" />
            <text x="300" y="125" fill="white" fontSize="10" textAnchor="middle">F</text>

            {/* Object */}
            <line x1="100" y1="110" x2="100" y2="60" stroke="white" strokeWidth="4" />
            <path d="M95,70 L100,60 L105,70" fill="white" />
            <text x="100" y="50" fill="white" fontSize="10" textAnchor="middle">Object</text>

            {/* Rays */}
            <path d="M100,60 L380,60 L300,110 L150,203" fill="none" stroke="#ffff00" strokeWidth="1.5" />
            <path d="M100,60 L200,110 L380,200 L200,110 L100,60" fill="none" stroke="#00ffff" strokeWidth="1.5" />

            {/* Image */}
            <line x1="166" y1="110" x2="166" y2="150" stroke={accentColor} strokeWidth="3" strokeDasharray="4,2" />
            <path d="M161,140 L166,150 L171,140" fill={accentColor} />
            <text x="166" y="165" fill={accentColor} fontSize="10" textAnchor="middle">Image</text>

            <text x="250" y="210" fill="white" fontSize="11" textAnchor="middle" opacity="0.7">
              Real, Inverted, Diminished
            </text>
          </svg>
        );

      case 'refraction_diagram':
        return (
          <svg width="100%" height="200" viewBox="0 0 500 200" className="mx-auto">
            {/* Media */}
            <rect x="0" y="0" width="500" height="100" fill={`${accentColor}10`} />
            <rect x="0" y="100" width="500" height="100" fill={`${accentColor}25`} />
            <line x1="0" y1="100" x2="500" y2="100" stroke="white" strokeWidth="2" opacity="0.5" />
            <text x="450" y="30" fill="white" fontSize="10" textAnchor="end">AIR (n=1.0)</text>
            <text x="450" y="130" fill="white" fontSize="10" textAnchor="end">GLASS (n=1.5)</text>

            {/* Normal */}
            <line x1="250" y1="20" x2="250" y2="180" stroke="white" strokeWidth="1" strokeDasharray="8,4" opacity="0.4" />

            {/* Rays */}
            <line x1="100" y1="20" x2="250" y2="100" stroke="#ffff00" strokeWidth="3" />
            <line x1="250" y1="100" x2="330" y2="180" stroke="#00ffff" strokeWidth="3" />

            {/* Angles */}
            <path d="M250,70 A30,30 0 0 0 210,80" fill="none" stroke="white" opacity="0.5" />
            <text x="235" y="75" fill="white" fontSize="10">∠i</text>
            <path d="M250,130 A30,30 0 0 1 270,120" fill="none" stroke="white" opacity="0.5" />
            <text x="255" y="135" fill="white" fontSize="10">∠r</text>

            <text x="250" y="195" fill="white" fontSize="11" textAnchor="middle">
              Light bends toward normal when entering denser medium
            </text>
          </svg>
        );

      case 'lens_diagram':
        return (
          <svg width="100%" height="220" viewBox="0 0 500 220" className="mx-auto">
            {/* Convex Lens */}
            <path d="M120,40 Q150,110 120,180 Q90,110 120,40" fill={accentColor} fillOpacity="0.2" stroke="white" strokeWidth="2" />
            <line x1="20" y1="110" x2="220" y2="110" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
            <line x1="60" y1="110" x2="60" y2="70" stroke="white" strokeWidth="3" />
            <path d="M55,80 L60,70 L65,80" fill="white" />
            <path d="M60,70 L120,70 L180,110" fill="none" stroke="#ffff00" strokeWidth="1.5" />
            <path d="M60,70 L120,110 L180,150" fill="none" stroke="#00ffff" strokeWidth="1.5" />
            <text x="120" y="200" fill="white" fontSize="11" textAnchor="middle">CONVEX LENS — Converging</text>

            {/* Concave Lens */}
            <path d="M380,40 Q360,110 380,180 L420,180 Q440,110 420,40 Z" fill={accentColor} fillOpacity="0.2" stroke="white" strokeWidth="2" />
            <line x1="280" y1="110" x2="480" y2="110" stroke="white" strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
            <path d="M320,70 L400,70 L480,30" fill="none" stroke="#ffff00" strokeWidth="1.5" />
            <path d="M320,70 L400,85 L480,100" fill="none" stroke="#00ffff" strokeWidth="1.5" />
            <text x="400" y="200" fill="white" fontSize="11" textAnchor="middle">CONCAVE LENS — Diverging</text>
          </svg>
        );

      case 'human_eye_diagram':
        return (
          <svg width="100%" height="240" viewBox="0 0 500 240" className="mx-auto">
            {/* Eye ball */}
            <circle cx="250" cy="120" r="80" fill="none" stroke="white" strokeWidth="2" />
            <path d="M170,80 Q150,120 170,160" fill="none" stroke="white" strokeWidth="2" /> {/* Cornea */}
            
            {/* Iris & Pupil */}
            <rect x="180" y="90" width="5" height="60" fill={accentColor} />
            <rect x="180" y="115" width="5" height="10" fill="black" />
            
            {/* Lens */}
            <ellipse cx="205" cy="120" rx="12" ry="30" fill="#ffffea" stroke="white" strokeWidth="1" />
            
            {/* Retina */}
            <path d="M290,60 A80,80 0 0 1 290,180" fill="none" stroke="#ff8080" strokeWidth="4" />
            
            {/* Optic Nerve */}
            <path d="M330,120 L380,120" stroke="white" strokeWidth="8" strokeLinecap="round" />

            {/* Labels */}
            <line x1="160" y1="120" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
            <text x="95" y="45" fill="white" fontSize="10">Cornea</text>
            
            <line x1="182" y1="100" x2="120" y2="80" stroke="white" strokeWidth="0.5" />
            <text x="115" y="75" fill={accentColor} fontSize="10">Iris</text>

            <line x1="205" y1="100" x2="250" y2="30" stroke="white" strokeWidth="0.5" />
            <text x="250" y="25" fill="#ffffea" fontSize="10">Lens</text>
            
            <line x1="310" y1="120" x2="380" y2="50" stroke="white" strokeWidth="0.5" />
            <text x="385" y="45" fill="#ff8080" fontSize="10">Retina</text>
            
            <line x1="360" y1="120" x2="430" y2="120" stroke="white" strokeWidth="0.5" />
            <text x="435" y="125" fill="white" fontSize="10">Optic Nerve</text>
          </svg>
        );

      case 'atom_structure':
        return (
          <svg width="100%" height="240" viewBox="0 0 500 240" className="mx-auto">
            {/* Shells */}
            <circle cx="250" cy="120" r="60" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
            <circle cx="250" cy="120" r="110" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
            
            {/* Nucleus */}
            <circle cx="250" cy="120" r="25" fill="#ffcc00" />
            <text x="250" y="125" fill="black" fontSize="10" fontWeight="bold" textAnchor="middle">6p+ 6n</text>

            {/* Electrons - Shell 1 */}
            <circle cx="250" cy="60" r="5" fill="#00ffff" />
            <circle cx="250" cy="180" r="5" fill="#00ffff" />

            {/* Electrons - Shell 2 */}
            <circle cx="250" cy="10" r="5" fill="#00ffff" />
            <circle cx="250" cy="230" r="5" fill="#00ffff" />
            <circle cx="140" cy="120" r="5" fill="#00ffff" />
            <circle cx="360" cy="120" r="5" fill="#00ffff" />

            <text x="320" y="65" fill="white" fontSize="10">K shell (2e⁻)</text>
            <text x="370" y="145" fill="white" fontSize="10">L shell (4e⁻)</text>
            
            <text x="250" y="235" fill="white" fontSize="11" textAnchor="middle" transform="translate(0, -10)">
              Carbon — Atomic number 6, Electronic configuration: 2,4, Valency: 4
            </text>
          </svg>
        );

      case 'cell_diagram_static':
        return (
          <svg width="100%" height="260" viewBox="0 0 500 260" className="mx-auto">
            {/* Membrane */}
            <ellipse cx="250" cy="130" rx="180" ry="110" fill={`${accentColor}05`} stroke={accentColor} strokeWidth="3" />
            
            {/* Nucleus */}
            <circle cx="220" cy="110" r="45" fill="#332200" stroke="#ffcc00" strokeWidth="2" />
            <circle cx="220" cy="110" r="15" fill="#ffcc00" opacity="0.3" />
            
            {/* Organelles */}
            <ellipse cx="320" cy="160" rx="25" ry="12" fill="#ff6600" opacity="0.8" />
            <ellipse cx="340" cy="80" rx="25" ry="12" fill="#ff6600" opacity="0.8" />
            
            <path d="M150,150 Q170,140 190,150 Q170,160 150,150" fill="#ffff00" />
            <path d="M150,165 Q170,155 190,165 Q170,175 150,165" fill="#ffff00" />

            <circle cx="300" cy="100" r="20" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />

            {/* Labels */}
            <line x1="70" y1="130" x2="30" y2="130" stroke="white" strokeWidth="0.5" />
            <text x="25" y="135" fill="white" fontSize="10" textAnchor="end">Membrane</text>

            <line x1="220" y1="65" x2="220" y2="30" stroke="white" strokeWidth="0.5" />
            <text x="220" y="25" fill="#ffcc00" fontSize="10" textAnchor="middle">Nucleus</text>

            <line x1="330" y1="172" x2="330" y2="200" stroke="white" strokeWidth="0.5" />
            <text x="330" y="215" fill="#ff6600" fontSize="10" textAnchor="middle">Mitochondria</text>

            <line x1="170" y1="175" x2="170" y2="200" stroke="white" strokeWidth="0.5" />
            <text x="170" y="215" fill="#ffff00" fontSize="10" textAnchor="middle">Golgi</text>
          </svg>
        );

      case 'photosynthesis_equation':
        return (
          <svg width="100%" height="180" viewBox="0 0 500 180" className="mx-auto">
            {/* Left side */}
            <circle cx="60" cy="60" r="25" fill="#444" />
            <text x="60" y="65" fill="white" fontSize="12" textAnchor="middle">CO₂</text>
            <text x="60" y="105" fill="white" fontSize="10" textAnchor="middle">Carbon Dioxide</text>

            <text x="110" y="65" fill="white" fontSize="24" textAnchor="middle">+</text>

            <circle cx="160" cy="60" r="25" fill="#0066ff" />
            <text x="160" y="65" fill="white" fontSize="12" textAnchor="middle">H₂O</text>
            <text x="160" y="105" fill="white" fontSize="10" textAnchor="middle">Water</text>

            {/* Light */}
            <path d="M110,120 L110,90 M100,115 L110,105 M120,115 L110,105" stroke="#ffcc00" strokeWidth="2" />
            <text x="110" y="140" fill="#ffcc00" fontSize="10" textAnchor="middle">Light Energy</text>

            {/* Arrow */}
            <line x1="210" y1="60" x2="290" y2="60" stroke="white" strokeWidth="2" />
            <path d="M280,55 L290,60 L280,65" fill="white" />
            <text x="250" y="50" fill={accentColor} fontSize="10" textAnchor="middle">Chlorophyll</text>

            {/* Right side */}
            <path d="M350,40 L380,40 L395,60 L380,80 L350,80 L335,60 Z" fill="#00cc00" />
            <text x="365" y="65" fill="white" fontSize="10" textAnchor="middle">C₆H₁₂O₆</text>
            <text x="365" y="105" fill="white" fontSize="10" textAnchor="middle">Glucose</text>

            <text x="415" y="65" fill="white" fontSize="24" textAnchor="middle">+</text>

            <circle cx="460" cy="45" r="12" fill="#00ffff" opacity="0.6" stroke="white" strokeWidth="1" />
            <circle cx="475" cy="55" r="12" fill="#00ffff" opacity="0.6" stroke="white" strokeWidth="1" />
            <text x="465" y="105" fill="white" fontSize="10" textAnchor="middle">Oxygen (O₂)</text>

            <text x="250" y="165" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">
              6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
            </text>
          </svg>
        );

      case 'reflex_arc_diagram':
        return (
          <svg width="100%" height="200" viewBox="0 0 500 200" className="mx-auto">
            {/* Stimulus */}
            <path d="M40,60 Q50,30 60,60 Q50,80 40,60" fill="#ff6600" />
            <text x="50" y="90" fill="white" fontSize="9" textAnchor="middle">Stimulus</text>

            {/* Arrows & Nodes */}
            <circle cx="120" cy="60" r="15" fill="none" stroke="white" />
            <text x="120" y="90" fill="white" fontSize="9" textAnchor="middle">Receptor</text>
            
            <line x1="135" y1="60" x2="210" y2="60" stroke="#00d4ff" strokeWidth="2" />
            <path d="M200,55 L210,60 L200,65" fill="#00d4ff" />
            <text x="170" y="50" fill="#00d4ff" fontSize="9" textAnchor="middle">Sensory</text>

            <rect x="220" y="40" width="60" height="80" fill="#444" stroke="white" />
            <text x="250" y="135" fill="white" fontSize="9" textAnchor="middle">Spinal Cord</text>
            <text x="250" y="85" fill="#ff4d4d" fontSize="10" fontWeight="bold" textAnchor="middle">NOT BRAIN</text>

            <line x1="280" y1="100" x2="355" y2="100" stroke="#ff4d4d" strokeWidth="2" />
            <path d="M345,95 L355,100 L345,105" fill="#ff4d4d" />
            <text x="320" y="115" fill="#ff4d4d" fontSize="9" textAnchor="middle">Motor</text>

            <ellipse cx="380" cy="100" rx="20" ry="12" fill="#666" />
            <text x="380" y="130" fill="white" fontSize="9" textAnchor="middle">Effector</text>

            <text x="450" y="100" fill="white" fontSize="11" fontWeight="bold">Response!</text>

            {/* Brain X */}
            <circle cx="250" cy="10" r="10" fill="none" stroke="white" opacity="0.3" />
            <line x1="244" y1="4" x2="256" y2="16" stroke="red" strokeWidth="2" />
            <line x1="256" y1="4" x2="244" y2="16" stroke="red" strokeWidth="2" />
          </svg>
        );

      case 'ph_scale_static':
        return (
          <svg width="100%" height="120" viewBox="0 0 500 120" className="mx-auto">
             <defs>
              <linearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#ff0000'}} />
                <stop offset="25%" style={{stopColor:'#ff9900'}} />
                <stop offset="50%" style={{stopColor:'#00ff00'}} />
                <stop offset="75%" style={{stopColor:'#0066ff'}} />
                <stop offset="100%" style={{stopColor:'#9900cc'}} />
              </linearGradient>
            </defs>
            
            <rect x="25" y="45" width="450" height="30" fill="url(#phGradient)" rx="4" />
            
            <circle cx="25" cy="45" r="3" fill="white" />
            <text x="25" y="35" fill="white" fontSize="8" textAnchor="middle">0: Battery Acid</text>
            
            <circle cx="89" cy="45" r="3" fill="white" />
            <text x="89" y="35" fill="white" fontSize="8" textAnchor="middle">2: Lemon</text>
            
            <circle cx="250" cy="45" r="3" fill="white" />
            <text x="250" y="35" fill="white" fontSize="8" textAnchor="middle">7: Pure Water</text>
            
            <circle cx="314" cy="45" r="3" fill="white" />
            <text x="314" y="35" fill="white" fontSize="8" textAnchor="middle">9: Baking Soda</text>
            
            <circle cx="475" cy="45" r="3" fill="white" />
            <text x="475" y="35" fill="white" fontSize="8" textAnchor="middle">14: Bleach</text>

            <text x="50" y="90" fill="white" fontSize="10" textAnchor="middle">← ACIDS</text>
            <text x="250" y="90" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">NEUTRAL</text>
            <text x="450" y="90" fill="white" fontSize="10" textAnchor="middle">BASES →</text>

            {/* Scale numbers */}
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(num => (
              <text key={num} x={25 + (num * 450/14)} y="110" fill="white" fontSize="8" textAnchor="middle" opacity="0.7">
                {num}
              </text>
            ))}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="theory-animation-container bg-black/5 dark:bg-black/40 border border-white/5 dark:border-white/10 mt-8 p-6 overflow-hidden">
       <div className="theory-animation-badge bg-accent/10 border border-accent/20 text-accent mb-4">
         Illustrated Diagram
       </div>
       {renderDiagram()}
    </div>
  );
};

export default SubtopicDiagram;
