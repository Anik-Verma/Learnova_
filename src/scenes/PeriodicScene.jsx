import { useEffect, useRef, useState } from 'react';

const EL = [
  {s:'H', n:1,  name:'Hydrogen',  cat:'nonmetal'},
  {s:'He',n:2,  name:'Helium',    cat:'noble'},
  {s:'Li',n:3,  name:'Lithium',   cat:'metal'},
  {s:'Be',n:4,  name:'Beryllium', cat:'metal'},
  {s:'B', n:5,  name:'Boron',     cat:'metalloid'},
  {s:'C', n:6,  name:'Carbon',    cat:'nonmetal'},
  {s:'N', n:7,  name:'Nitrogen',  cat:'nonmetal'},
  {s:'O', n:8,  name:'Oxygen',    cat:'nonmetal'},
  {s:'F', n:9,  name:'Fluorine',  cat:'nonmetal'},
  {s:'Ne',n:10, name:'Neon',      cat:'noble'},
  {s:'Na',n:11, name:'Sodium',    cat:'metal'},
  {s:'Mg',n:12, name:'Magnesium', cat:'metal'},
  {s:'Al',n:13, name:'Aluminum',  cat:'metal'},
  {s:'Si',n:14, name:'Silicon',   cat:'metalloid'},
  {s:'P', n:15, name:'Phosphorus',cat:'nonmetal'},
  {s:'S', n:16, name:'Sulfur',    cat:'nonmetal'},
  {s:'Cl',n:17, name:'Chlorine',  cat:'nonmetal'},
  {s:'Ar',n:18, name:'Argon',     cat:'noble'},
  {s:'K', n:19, name:'Potassium', cat:'metal'},
  {s:'Ca',n:20, name:'Calcium',   cat:'metal'},
  {s:'Fe',n:26, name:'Iron',      cat:'metal'},
  {s:'Cu',n:29, name:'Copper',    cat:'metal'},
  {s:'Zn',n:30, name:'Zinc',      cat:'metal'},
  {s:'Br',n:35, name:'Bromine',   cat:'nonmetal'},
  {s:'Ag',n:47, name:'Silver',    cat:'metal'},
  {s:'Au',n:79, name:'Gold',      cat:'metal'},
  {s:'Hg',n:80, name:'Mercury',   cat:'metal'},
  {s:'Pb',n:82, name:'Lead',      cat:'metal'},
  {s:'Kr',n:36, name:'Krypton',   cat:'noble'},
  {s:'I', n:53, name:'Iodine',    cat:'nonmetal'}
];

const CAT_COLORS = {
  nonmetal:  '#00d4ff',
  noble:     '#ddb8ff',
  metal:     '#ffdd4c',
  metalloid: '#39ff14'
};

const FACTS = [
  "118 elements organized by atomic number",
  "Noble gases rarely bond with other elements",
  "Metals make up 75% of all known elements",
  "Carbon forms the basis of all known life",
  "Hydrogen is the most abundant element in the universe"
];

export default function PeriodicScene() {
  const [ready, setReady] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [factIdx, setFactIdx] = useState(0);
  
  const timeRef = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    Promise.all([
      document.fonts.load('700 20px Orbitron'),
      document.fonts.load('400 10px Inter'),
      document.fonts.load('400 9px Space Grotesk')
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    
    let raf;
    const loop = () => {
      timeRef.current += 0.016;
      setTick(t => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    
    // Highlight logic
    const hlInterval = setInterval(() => {
      const ranIdx = Math.floor(Math.random() * EL.length);
      setHighlightIdx(ranIdx);
      setTimeout(() => setHighlightIdx(null), 1800);
    }, 2500);

    // Fact logic
    const factInterval = setInterval(() => {
      setFactIdx(prev => (prev + 1) % FACTS.length);
    }, 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(hlInterval);
      clearInterval(factInterval);
    };
  }, [ready]);

  if (!ready) return null;

  const time = timeRef.current;
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 80px)',
    gridTemplateRows: 'repeat(3, 96px)',
    gap: '6px',
    transform: `
      perspective(1800px) 
      rotateX(${25 + Math.sin(time*0.4)*3}deg) 
      rotateY(${-15 + Math.sin(time*0.3)*8}deg) 
      rotateZ(${3 + Math.sin(time*0.2)*1}deg)
      translateY(${Math.sin(time*0.6)*15}px)
    `,
    transformStyle: 'preserve-3d',
    transition: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: '-430px', 
    marginTop: '-153px'   
  };

  const highlightedEl = highlightIdx !== null ? EL[highlightIdx] : null;

  return (
    <>
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
        <div style={containerStyle}>
          {EL.map((el, i) => {
            const isHl = highlightIdx === i;
            const cColor = CAT_COLORS[el.cat];
            
            return (
              <div 
                key={el.n}
                style={{
                  width: '80px',
                  height: '96px',
                  background: '#1f1f1f',
                  borderTop: `2px solid ${cColor}`,
                  boxShadow: isHl 
                    ? `0 0 40px rgba(0,212,255,0.5), 8px 8px 16px rgba(0,0,0,0.6)`
                    : '8px 8px 16px rgba(0,0,0,0.6)',
                  outline: isHl ? '1.5px solid rgba(168,232,255,0.6)' : 'none',
                  transform: isHl ? 'scale(1.12) translateZ(20px)' : 'scale(1) translateZ(0)',
                  zIndex: isHl ? 50 : 1,
                  position: 'relative',
                  cursor: 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <span style={{
                  position: 'absolute', top: '4px', left: '6px',
                  fontFamily: 'Orbitron', fontSize: '9px', fontWeight: 500,
                  color: cColor
                }}>
                  {el.n}
                </span>
                
                <span style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Orbitron', fontSize: '26px', fontWeight: 700,
                  color: 'white'
                }}>
                  {el.s}
                </span>
                
                <span style={{
                  position: 'absolute', bottom: '6px', left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'Inter', fontSize: '7px', color: '#555555',
                  textTransform: 'uppercase', width: '100%', textAlign: 'center'
                }}>
                  {el.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Info Panel - Stitch Style */}
      {highlightedEl && (
        <div style={{
          position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
          width: '220px', padding: '20px',
          background: 'rgba(31,31,31,0.85)', backdropFilter: 'blur(20px)',
          borderLeft: `2px solid ${CAT_COLORS[highlightedEl.cat]}`,
          zIndex: 100, borderRadius: '2px'
        }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: '14px', color: '#a8e8ff', marginBottom: '12px' }}>
            [{highlightedEl.s}] — {highlightedEl.name.toUpperCase()}
          </div>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />
          
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '8px', color: '#bbc9cf', letterSpacing: '0.1em' }}>
            ATOMIC NUMBER
          </div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '24px', color: 'white', marginBottom: '12px' }}>
            {highlightedEl.n}
          </div>
          
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '8px', color: '#bbc9cf', letterSpacing: '0.1em' }}>
            CATEGORY
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', color: CAT_COLORS[highlightedEl.cat], textTransform: 'capitalize', marginBottom: '12px' }}>
            {highlightedEl.cat}
          </div>
          
          <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#bbc9cf', lineHeight: 1.4 }}>
            Fundamental chemical building block.
          </div>
        </div>
      )}

      {/* Rotating Fact below scene */}
      <div style={{
        position: 'absolute', bottom: '60px', left: '28px',
        fontFamily: 'Inter', fontSize: '11px', color: '#555555',
        transition: 'opacity 0.4s ease'
      }}>
        {FACTS[factIdx]}
      </div>
    </>
  );
}
