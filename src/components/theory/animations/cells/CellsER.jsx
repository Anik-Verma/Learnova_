import React, { useRef, useEffect, useState } from 'react';

export const CellsER = ({ accentColor, isDark }) => {
  const canvasRef = useRef(null);
  const [showJourney, setShowJourney] = useState(false);
  const animationRef = useRef(null);
  const journeyTimeRef = useRef(0);
  const startTimeRef = useRef(null);

  const canvasHeight = 380;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvasHeight;
      drawER(showJourney ? journeyTimeRef.current : -1);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isDark, showJourney]);

  useEffect(() => {
    if (showJourney) {
      startTimeRef.current = performance.now();
      
      const animate = (time) => {
        const elapsed = (time - startTimeRef.current) / 1000;
        journeyTimeRef.current = elapsed;
        
        drawER(elapsed);
        
        if (elapsed < 7.5) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setShowJourney(false);
          journeyTimeRef.current = 0;
          drawER(-1);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      journeyTimeRef.current = 0;
      drawER(-1);
    }
  }, [showJourney, isDark]);

  const drawER = (journeyTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    
    ctx.save();
    const scale = Math.min(1, W / 650);
    const offsetX = Math.max(0, (W - 650*scale)/2);
    ctx.translate(offsetX, 0);
    ctx.scale(scale, scale);

    // =====================================================
    // SECTION 1 — NUCLEAR ENVELOPE (left edge)
    // =====================================================
    
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.bezierCurveTo(45, 130, 45, 250, 60, 320);
    ctx.strokeStyle = 'rgba(210,170,90,0.9)';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(72, 65);
    ctx.bezierCurveTo(58, 135, 58, 248, 72, 318);
    ctx.strokeStyle = 'rgba(210,170,90,0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.bezierCurveTo(45, 130, 45, 250, 60, 320);
    ctx.lineTo(72, 318);
    ctx.bezierCurveTo(58, 248, 58, 135, 72, 65);
    ctx.closePath();
    ctx.fillStyle = 'rgba(210,170,90,0.15)';
    ctx.fill();
    
    const porePositions = [90, 130, 170, 210, 250, 290];
    porePositions.forEach(y => {
      ctx.beginPath();
      ctx.arc(60, y, 5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(160,110,30,0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(210,170,90,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    ctx.save();
    ctx.translate(20, 190);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = 'rgba(210,170,90,0.8)';
    ctx.font = '10px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('Nuclear Envelope', 0, 0);
    ctx.restore();

    // =====================================================
    // SECTION 2 — ROUGH ER (stacked cisternae)
    // =====================================================
    const roughERLeft = 85;
    const roughERRight = 330;
    const startY = 90;
    const cistHeight = 22;  
    const cistGap = 8;      
    const numCisternae = 6;

    for(let i = 0; i < numCisternae; i++) {
      const y = startY + i * (cistHeight + cistGap);
      const left = roughERLeft + i * 3;
      const right = roughERRight - i * 2;
      const cY = y;
      
      // Lumen Fill
      ctx.fillStyle = 'rgba(100,130,200,0.18)';
      ctx.beginPath();
      ctx.roundRect(left + 3, cY + 3, right - left - 6, cistHeight - 6, 2);
      ctx.fill();
      
      // Top Membrane
      ctx.beginPath();
      ctx.moveTo(left, cY);
      ctx.bezierCurveTo(
        left + (right-left)*0.3, cY - 2,
        left + (right-left)*0.7, cY - 2,
        right, cY
      );
      ctx.strokeStyle = 'rgba(80,110,200,0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Bottom Membrane
      ctx.beginPath();
      ctx.moveTo(left, cY + cistHeight);
      ctx.bezierCurveTo(
        left + (right-left)*0.3, cY + cistHeight + 2,
        left + (right-left)*0.7, cY + cistHeight + 2,
        right, cY + cistHeight
      );
      ctx.stroke();
      
      // Left Cap
      ctx.beginPath();
      ctx.moveTo(left, cY);
      ctx.bezierCurveTo(
        left - 8, cY + cistHeight*0.3,
        left - 8, cY + cistHeight*0.7,
        left, cY + cistHeight
      );
      ctx.stroke();
      
      // Right Cap
      ctx.beginPath();
      ctx.moveTo(right, cY);
      ctx.bezierCurveTo(
        right + 8, cY + cistHeight*0.3,
        right + 8, cY + cistHeight*0.7,
        right, cY + cistHeight
      );
      ctx.stroke();
      
      // Ribosomes
      const numRibosomes = Math.floor((right - left) / 12);
      for(let r = 0; r < numRibosomes; r++) {
        const rx = left + 15 + r * 12;
        const ry = cY - 1; 
        
        ctx.beginPath();
        ctx.arc(rx, ry - 3.5, 3.5, 0, Math.PI*2);
        
        if (journeyTime >= 0 && journeyTime < 1.5 && i === 0 && r === 0) {
           ctx.shadowColor = 'rgba(255, 100, 200, 1)';
           ctx.shadowBlur = 10;
           ctx.fillStyle = '#ff66ff';
        } else {
           ctx.fillStyle = 'rgba(180,140,220,0.85)';
        }
        ctx.fill();
        ctx.shadowBlur = 0; 
        
        ctx.beginPath();
        ctx.arc(rx + 2, ry - 1, 2.5, 0, Math.PI*2);
        if (journeyTime >= 0 && journeyTime < 1.5 && i === 0 && r === 0) {
           ctx.fillStyle = '#ffccff';
        } else {
           ctx.fillStyle = 'rgba(200,160,240,0.75)';
        }
        ctx.fill();
      }
      
      // Cisternal Space Label
      if(i === 2) {
        const gapY = cY + cistHeight + cistGap/2;
        ctx.beginPath();
        ctx.moveTo(left - 15, gapY);
        ctx.lineTo(left + 5, gapY);
        ctx.strokeStyle = 'rgba(150,180,255,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(150,180,255,0.7)';
        ctx.font = '9px Inter';
        ctx.textAlign = 'right';
        ctx.fillText('Cisternal', left - 18, gapY - 3);
        ctx.fillText('Space', left - 18, gapY + 8);
      }
    }

    ctx.fillStyle = '#6080E0';
    ctx.font = 'bold 13px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText('ROUGH ER', roughERLeft, startY - 15);

    ctx.fillStyle = 'rgba(150,170,255,0.6)';
    ctx.font = '10px Inter';
    ctx.fillText('(ribosomes → makes proteins)', roughERLeft, startY - 3);

    ctx.fillStyle = 'rgba(100,130,200,0.6)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Lumen = space inside ER', 
      roughERLeft + (roughERRight - roughERLeft)/2, 
      startY + numCisternae * (cistHeight + cistGap) + 15);

    // =====================================================
    // SECTION 3 — SMOOTH ER (tubular network)
    // =====================================================
    const smoothLeft = 360;
    const smoothTop = 80;

    function drawTube(x1, y1, x2, y2, cp1x, cp1y, cp2x, cp2y, thickness, color) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      ctx.strokeStyle = 'rgba(255,200,150,0.25)';
      ctx.lineWidth = thickness * 0.4;
      ctx.stroke();
    }

    drawTube(370, 100, 480, 120, 390, 85, 450, 90, 14, 'rgba(220,130,60,0.85)');
    drawTube(480, 120, 540, 100, 500, 130, 525, 110, 14, 'rgba(220,130,60,0.85)');
    drawTube(480, 120, 470, 170, 490, 140, 480, 155, 14, 'rgba(220,130,60,0.85)');

    drawTube(370, 165, 500, 180, 400, 155, 470, 170, 14, 'rgba(210,120,50,0.85)');
    drawTube(500, 180, 550, 160, 520, 185, 540, 168, 14, 'rgba(210,120,50,0.85)');
    drawTube(470, 170, 480, 220, 465, 195, 475, 208, 14, 'rgba(210,120,50,0.85)');

    drawTube(380, 220, 510, 235, 420, 210, 480, 228, 14, 'rgba(200,110,40,0.85)');
    drawTube(510, 235, 555, 215, 530, 240, 545, 222, 14, 'rgba(200,110,40,0.85)');
    drawTube(510, 235, 500, 285, 515, 258, 505, 272, 14, 'rgba(200,110,40,0.85)');
    drawTube(380, 270, 495, 285, 415, 262, 468, 278, 14, 'rgba(190,105,35,0.85)');

    const openings = [
      {x: 370, y: 100}, {x: 540, y: 100}, {x: 555, y: 160},
      {x: 555, y: 215}, {x: 500, y: 285}, {x: 380, y: 270}, {x: 380, y: 220}
    ];

    openings.forEach(o => {
      ctx.beginPath();
      ctx.arc(o.x, o.y, 8, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(220,130,60,0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(220,130,60,0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(o.x, o.y, 4, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,200,150,0.3)';
      ctx.fill();
    });

    ctx.fillStyle = '#E07830';
    ctx.font = 'bold 13px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText('SMOOTH ER', smoothLeft, smoothTop - 15);

    ctx.fillStyle = 'rgba(255,180,120,0.6)';
    ctx.font = '10px Inter';
    ctx.fillText('(no ribosomes → makes lipids)', smoothLeft, smoothTop - 3);

    // =====================================================
    // SECTION 4 — CONNECTION
    // =====================================================
    ctx.beginPath();
    ctx.moveTo(320, 190);
    ctx.bezierCurveTo(330, 190, 350, 185, 360, 180);
    ctx.strokeStyle = 'rgba(150,150,200,0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(150,150,200,0.5)';
    ctx.font = '8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('connected', 340, 200);

    // =====================================================
    // SECTION 5 — RIBOSOME DETAIL (zoom inset)
    // =====================================================
    const insetX = W > 650 ? Math.min(650, W) - 100 : 530;
    const insetY = 320;
    const insetR = 40;

    ctx.beginPath();
    ctx.arc(insetX, insetY, insetR, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,140,220,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 130);
    ctx.lineTo(insetX - insetR, insetY);
    ctx.strokeStyle = 'rgba(180,140,220,0.3)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(insetX - 5, insetY - 8, 18, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(180,140,220,0.7)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(insetX + 8, insetY + 6, 12, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(200,160,240,0.6)';
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '7px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Ribosome', insetX, insetY + insetR - 8);

    ctx.fillStyle = 'rgba(180,140,220,0.6)';
    ctx.font = '8px Space Grotesk';
    ctx.fillText('ZOOMED', insetX, insetY - insetR + 12);

    // =====================================================
    // LABELS AND ANNOTATIONS
    // =====================================================
    ctx.fillStyle = 'rgba(150,180,255,0.7)';
    ctx.font = '9px Space Grotesk';
    
    ctx.fillText('Cisternae (stacked sheets)', roughERLeft + 80, startY + numCisternae * (cistHeight + cistGap) + 30);
    ctx.beginPath();
    ctx.moveTo(roughERLeft + 80, startY + numCisternae * (cistHeight + cistGap) + 20);
    ctx.lineTo(roughERLeft + 60, startY + (numCisternae-1) * (cistHeight + cistGap) + cistHeight);
    ctx.strokeStyle = 'rgba(150,180,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // =====================================================
    // SECTION 6 — PROTEIN JOURNEY ANIMATION
    // =====================================================
    if (journeyTime >= 0) {
      let pX = 0, pY = 0, pRadius = 0, pAlpha = 1;
      let label = "";

      const startRx = roughERLeft + 15;
      const startRy = startY - 2;

      if (journeyTime < 1.5) {
        const progress = journeyTime / 1.5;
        pX = startRx + 2;
        pY = startRy - 10;
        pRadius = 3 * progress;
        label = "1. Ribosome makes protein";
      } else if (journeyTime < 3.0) {
        const progress = (journeyTime - 1.5) / 1.5;
        pX = startRx + 2;
        pY = startRy - 10 + progress * 20;
        pRadius = 3;
        label = "2. Protein enters ER lumen";
      } else if (journeyTime < 4.5) {
        const progress = (journeyTime - 3.0) / 1.5;
        pX = startRx + 2 + progress * 200;
        pY = startRy + 10;
        pRadius = 3;
        label = "3. Protein processed in lumen";
      } else if (journeyTime < 6.0) {
        const progress = (journeyTime - 4.5) / 1.5;
        pX = startRx + 2 + 200 + progress * 20;
        pY = startRy + 10;
        pRadius = 3;
        
        ctx.beginPath();
        ctx.arc(pX, pY, 8 * progress, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(100,130,200,0.5)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(80,110,200,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        label = "4. Vesicle buds off ER";
      } else if (journeyTime <= 7.5) {
        const progress = (journeyTime - 6.0) / 1.5;
        pX = startRx + 2 + 220 + progress * 80;
        pY = startRy + 10;
        pRadius = 3;
        pAlpha = 1 - progress;

        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(pX, pY, 8, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(100,130,200,0.5)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(80,110,200,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        label = "5. Vesicle travels to Golgi →";
      }

      ctx.globalAlpha = pAlpha;
      ctx.beginPath();
      ctx.arc(pX, pY, pRadius, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.globalAlpha = 1.0;

      if (label) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.roundRect(150, 20, 200, 30, 4);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '12px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.fillText(label, 250, 40);
      }
    }
    
    ctx.restore();
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 rounded-xl w-full" style={{ backgroundColor: isDark ? '#080d08' : '#f0f4f0' }}>
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Endoplasmic Reticulum — Detailed Simulation
        </div>
        <button 
          onClick={() => {
            if (!showJourney) setShowJourney(true);
          }}
          disabled={showJourney}
          className="px-3 py-1.5 text-[10px] font-bold uppercase rounded bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-500 transition-colors"
        >
          {showJourney ? 'Journey in progress...' : 'Show Protein Journey'}
        </button>
      </div>

      <div className="w-full rounded-lg border border-black/10 dark:border-white/10 overflow-hidden shadow-inner" style={{ backgroundColor: isDark ? '#080d08' : '#f0f4f0' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: canvasHeight + 'px',
            display: 'block'
          }}
        />
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 12,
        fontFamily: 'Inter',
        fontSize: 12
      }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <th style={{padding:'8px 12px', textAlign:'left',
              color: isDark ? '#888' : '#666',
              fontFamily: 'Space Grotesk',
              fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Feature
            </th>
            <th style={{padding:'8px 12px', textAlign:'left',
              color: '#6080E0'
            }}>
              Rough ER
            </th>
            <th style={{padding:'8px 12px', textAlign:'left',
              color: '#E07830'
            }}>
              Smooth ER
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Ribosomes', '✓ Present', '✗ Absent'],
            ['Appearance', 'Stacked flat sheets (cisternae)', 'Rounded tubular network'],
            ['Main Function', 'Protein synthesis', 'Lipid synthesis'],
            ['Other Roles', 'Membrane biogenesis', 'Detoxifies drugs/poisons'],
            ['Location', 'Near nucleus', 'Throughout cytoplasm'],
          ].map(([feat, rough, smooth], i) => (
            <tr key={i} style={{
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: i%2===0 ? 'rgba(255,255,255,0.01)' : 'transparent'
            }}>
              <td style={{padding:'7px 12px',
                color: isDark ? '#bbc9cf' : '#555',
                fontWeight: 500
              }}>{feat}</td>
              <td style={{padding:'7px 12px',
                color: '#8098E8'
              }}>{rough}</td>
              <td style={{padding:'7px 12px',
                color: '#E09858'
              }}>{smooth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
