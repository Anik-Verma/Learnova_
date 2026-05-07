export const SCENES = [
  { id:'rocket',   label:'ROCKET LAUNCH',    subject:'Physics',   concept:'Thrust & Gravity'        },
  { id:'f1',       label:'F1 RACING',        subject:'Physics',   concept:"Newton's Laws"           },
  { id:'newton',   label:'NEWTONS APPLE',    subject:'Physics',   concept:'Universal Gravitation'   },
  { id:'periodic', label:'PERIODIC TABLE',   subject:'Chemistry', concept:'Element Classification'  },
  { id:'dna',      label:'DNA HELIX',        subject:'Biology',   concept:'Genetic Structure'       },
  { id:'neuron',   label:'BRAIN SIGNALS',    subject:'Biology',   concept:'Neural Transmission'     },
  { id:'solar',    label:'SOLAR SYSTEM',     subject:'Physics',   concept:'Orbital Mechanics'       },
  { id:'cell',     label:'CELL ANATOMY',     subject:'Biology',   concept:'Cell Structure'          },
];

export function getRandomScene(excludeId = null) {
  const last = localStorage.getItem('sv_last_scene');
  const pool = SCENES.filter(s => s.id !== excludeId && s.id !== last);
  
  // If pool is empty (e.g. only 1 scene configured), fallback safely.
  if (pool.length === 0) return SCENES[0];
  
  const pick = pool[Math.floor(Math.random() * pool.length)];
  localStorage.setItem('sv_last_scene', pick.id);
  return pick;
}
