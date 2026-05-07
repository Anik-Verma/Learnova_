import { useEffect, useRef, useState } from 'react';

export default function F1Scene() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      document.fonts.load('700 20px Orbitron'),
      document.fonts.load('400 10px Inter'),
      document.fonts.load('400 9px Space Grotesk'),
      document.fonts.load('700 13px Space Grotesk')
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let raf;
    let time = 0;
    
    let carX = -220;
    let phase = 'idle';
    let speed = 2;
    let particles = [];
    let speedLines = [];
    let bgOffset = 0;
    let wheelRot = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawGrid = () => {
       ctx.strokeStyle = 'rgba(168,232,255,0.04)';
       ctx.lineWidth = 1;
       ctx.beginPath();
       for(let x=0; x<canvas.width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
       for(let y=0; y<canvas.height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
       ctx.stroke();
    };

    const drawTrack = (yTop, yBot) => {
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, yTop, canvas.width, yBot - yTop);
      
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, yTop); ctx.lineTo(canvas.width, yTop);
      ctx.moveTo(0, yBot); ctx.lineTo(canvas.width, yBot);
      ctx.stroke();

      // Center Dash
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -bgOffset;
      ctx.beginPath();
      const mid = (yTop + yBot)/2;
      ctx.moveTo(0, mid); ctx.lineTo(canvas.width, mid);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // LEARNOVA GP Text
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.font = 'bold 120px Space Grotesk';
      ctx.letterSpacing = '10px';
      let textX = (canvas.width/2 - bgOffset) % (canvas.width * 2);
      if (textX < -800) textX += canvas.width * 2;
      ctx.fillText('LEARNOVA GP', textX, mid + 30);
      ctx.restore();

      // Checkered (right 15%)
      const cw = canvas.width;
      const rx = cw * 0.85;
      for(let r=0; r<2; r++) {
         for(let c=0; c<8; c++) {
            ctx.fillStyle = (r+c)%2===0 ? 'rgba(255,255,255,0.2)' : 'rgba(100,100,100,0.2)';
            ctx.fillRect(rx + c*12 - (bgOffset%(cw*2)), yBot + r*12 + 4, 12, 12);
         }
      }
    };

    const drawArrow = (x1, y1, x2, y2, color, label, sublabel) => {
       ctx.save();
       ctx.strokeStyle = color;
       ctx.fillStyle = color;
       ctx.lineWidth = ctx.lineWidth || 1.5;
       const headlen = 8;
       const angle = Math.atan2(y2 - y1, x2 - x1);

       ctx.beginPath();
       ctx.moveTo(x1, y1);
       ctx.lineTo(x2, y2);
       ctx.stroke();

       ctx.beginPath();
       ctx.moveTo(x2, y2);
       ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
       ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
       ctx.fill();

       // Label
       const midX = (x1 + x2)/2;
       const midY = (y1 + y2)/2 - 10;
       ctx.font = '500 10px Inter';
       ctx.textAlign = 'center';
       ctx.fillText(label, midX, midY);
       
       if (sublabel) {
          ctx.font = '400 9px Inter';
          ctx.globalAlpha = 0.65;
          ctx.fillText(sublabel, midX, midY + 10);
       }
       ctx.restore();
    };

    const drawCar = (x, y, op = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = Math.max(0, op);

      // Body bezier
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-60, 5);
      // nose
      ctx.quadraticCurveTo(80, 5, 100, 20); 
      // rise to cockpit
      ctx.quadraticCurveTo(50, 0, 10, -10);
      // fall to rear
      ctx.quadraticCurveTo(-40, -10, -70, 5);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-5, -12, 25, 10, 3) : ctx.fillRect(-5,-12,25,10); ctx.fill();
      
      // Halo
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-10, -2); ctx.quadraticCurveTo(5, -18, 20, -2); ctx.stroke();

      // Front Wing
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 14, 60, 6);
      ctx.fillRect(98, 9, 2, 12);

      // Rear Wing
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-75, -20, 30, 6); // upper
      ctx.fillRect(-70, -10, 25, 4); // lower
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(-77, -22, 2, 20); // endplate
      
      // DRS
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.ellipse(-60, -13, 6, 3, 0, 0, Math.PI*2); ctx.fill();

      // Sidepods
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-20, 5, 40, 12, 4) : ctx.fillRect(-20,5,40,12); ctx.fill();

      // Wheels
      const drawWheel = (wx, wy, isFront) => {
         const cr = isFront ? 16 : 18;
         const innerR = isFront ? 9 : 10;
         ctx.save();
         ctx.translate(wx, wy);
         ctx.fillStyle = '#222';
         ctx.beginPath(); ctx.arc(0,0,cr,0,Math.PI*2); ctx.fill();
         ctx.fillStyle = '#e2e2e2';
         ctx.beginPath(); ctx.arc(0,0,innerR,0,Math.PI*2); ctx.fill();
         
         ctx.rotate(wheelRot);
         ctx.strokeStyle = '#333';
         ctx.lineWidth = 2;
         ctx.beginPath(); ctx.moveTo(-innerR,0); ctx.lineTo(innerR,0); ctx.stroke();
         ctx.beginPath(); ctx.moveTo(0,-innerR); ctx.lineTo(0,innerR); ctx.stroke();
         
         // Motion lines during burnout/launch
         if (phase !== 'idle' && op === 1) {
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            for(let i=0; i<3; i++) {
               let a = (Math.PI*2/3)*i;
               ctx.beginPath(); ctx.arc(0,0, cr+3, a, a+0.8); ctx.stroke();
            }
         }
         ctx.restore();
      };

      drawWheel(-45, 14, false); // Rear
      drawWheel(65, 14, true);   // Front
      
      ctx.restore();
    };

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      const yTop = canvas.height * 0.58;
      const yBot = canvas.height * 0.75;
      const carY = yTop - 38;
      
      time += 0.016;
      let shakeX = 0;

      // Physics logic
      if (time < 2.0) {
         phase = 'idle';
         carX = canvas.width * 0.15;
         
         if(Math.random() < 0.05) { // 2 per sec approx
            particles.push({x: carX - 70, y: carY + 15, vx: -0.5, vy: -0.5, r: 3+Math.random()*5, life: 1, c: '#555'});
         }
      } else if (time < 3.5) {
         phase = 'burnout';
         wheelRot += 0.6;
         shakeX = (Math.random()*3 - 1.5);
         
         for(let i=0; i<8; i++) {
            particles.push({
               x: carX - 45 + (Math.random()-0.5)*10, y: carY + 25, 
               vx: -3 - Math.random()*2, vy: -1 - Math.random()*2, 
               r: 6+Math.random()*9, life: 1, c: Math.random()>0.5?'#fff':'#aaa'
            });
         }
         // Tyre marks
         ctx.fillStyle = '#0a0a0a';
         ctx.fillRect(carX - 120, carY + 28, 80, 4);
      } else if (carX < canvas.width + 250) {
         phase = 'launch';
         wheelRot += speed * 0.1;
         speed = Math.min(55, speed + 0.8);
         carX += speed;
         bgOffset += speed;
         
         // Speedlines
         for(let i=0; i<3; i++) {
           speedLines.push({
              x: carX - 80, y: carY - 20 + Math.random()*60, 
              l: 40 + Math.random()*80, o: 0.15
           });
         }
      } else {
         phase = 'reset';
         if (time > 6.0) { time = 0; speed = 2; }
      }

      drawTrack(yTop, yBot);

      // Draw exhaust flame during launch
      if (phase === 'launch') {
         ctx.save();
         ctx.translate(carX - 75, carY + 14);
         ctx.globalCompositeOperation = 'screen';
         // Outer
         ctx.fillStyle = 'rgba(0,150,255,0.25)';
         ctx.beginPath(); ctx.ellipse(-25, 0, 25 + Math.random()*8, 10, 0, 0, Math.PI*2); ctx.fill();
         // Mid
         ctx.fillStyle = '#00d4ff';
         ctx.beginPath(); ctx.ellipse(-17, 0, 17 + Math.random()*5, 7, 0, 0, Math.PI*2); ctx.fill();
         // Inner
         ctx.fillStyle = '#ffffff';
         ctx.beginPath(); ctx.ellipse(-10, 0, 10, 4, 0, 0, Math.PI*2); ctx.fill();
         ctx.restore();
      }

      // Speedlines render
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = speedLines.length-1; i>=0; i--) {
         let sl = speedLines[i];
         sl.x -= (speed * 0.5); 
         sl.o -= 0.05;
         if (sl.o <= 0) { speedLines.splice(i, 1); continue; }
         ctx.moveTo(sl.x, sl.y); ctx.lineTo(sl.x - sl.l, sl.y);
      }
      ctx.stroke();

      // Car Motion Blur
      if (phase === 'launch') {
         for(let i=1; i<=5; i++) {
            drawCar(carX - i*28, carY, 0.4 - i*0.08);
         }
      }
      
      drawCar(carX + shakeX, carY);

      // Particles
      for(let i=particles.length-1; i>=0; i--) {
        let p = particles[i];
        p.x += p.vx - (phase === 'launch' ? speed*0.8 : 0);
        p.y += p.vy;
        p.r += 0.3;
        p.life -= 0.016; // Approx 60fps, so life 1 = 60 frames = 1s
        if(p.life <= 0) { particles.splice(i,1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.c === '#555' ? `rgba(85,85,85,${p.life})` : `rgba(255,255,255,${p.life*0.5})`;
        ctx.fill();
      }

      // FBD Arrows Overlay
      if (carX > -150) {
         // W = mg
         drawArrow(carX + 10, carY + 16, carX + 10, carY + 66, '#ff4444', 'W = mg', 'Gravity');
         // Normal
         drawArrow(carX - 10, yTop, carX - 10, yTop - 55, '#39ff14', 'N', 'Normal Force');

         if (phase === 'idle') {
            // Static Friction
            drawArrow(carX + 80, yTop - 8, carX + 40, yTop - 8, '#ff8800', 'Static Friction', 'Prevents sliding');
         } else if (phase === 'burnout') {
            // Engine Thrust
            ctx.lineWidth = 3;
            drawArrow(carX + 105, carY + 20, carX + 180 + Math.sin(time*8)*10, carY + 20, '#00d4ff', 'F = ma', 'Engine Thrust');
            ctx.lineWidth = 1.5;
            // Kinetic Friction
            drawArrow(carX + 80, yTop - 8, carX + 20, yTop - 8, '#ff4444', 'Kinetic Friction', '');
         } else if (phase === 'launch') {
            ctx.lineWidth = 4;
            drawArrow(carX + 105, carY + 16, carX + 230, carY + 16, '#00d4ff', 'F_net →', 'Net Force');
            ctx.lineWidth = 1.5;
            drawArrow(carX - 85, carY + 16, carX - 130, carY + 16, '#ff4444', 'Air Drag', '');
            
            // Downforce front/rear
            drawArrow(carX + 75, carY - 8, carX + 75, carY + 7, '#ddb8ff', 'Downforce', '');
            drawArrow(carX - 88, carY - 28, carX - 88, carY - 13, '#ddb8ff', 'Downforce', '');
         }
      }

      // HUD UI Overlays (drawn manually since glassmorphism in canvas is hard without performance hit)
      // Velocity
      ctx.fillStyle = 'rgba(19,19,19,0.85)';
      ctx.fillRect(canvas.width - 180, 40, 160, 70);
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(canvas.width - 180, 40, 2, 70);
      
      ctx.fillStyle = '#bbc9cf'; ctx.font = '8px Space Grotesk';
      ctx.textAlign = 'left'; ctx.fillText('VELOCITY', canvas.width - 165, 55);
      ctx.fillStyle = '#ffffff'; ctx.font = '20px Orbitron';
      
      let displaySpd = 0;
      if(phase==='burnout') displaySpd = Math.floor(Math.random()*80);
      if(phase==='launch') displaySpd = Math.floor((speed/55) * 342);
      ctx.fillText(`${displaySpd} km/h`, canvas.width - 165, 76);

      // Acceleration
      ctx.fillStyle = 'rgba(19,19,19,0.85)';
      ctx.fillRect(canvas.width - 180, 120, 160, 45);
      ctx.fillStyle = phase === 'launch' ? '#39ff14' : '#00d4ff';
      ctx.fillRect(canvas.width - 180, 120, 2, 45);
      
      ctx.fillStyle = '#bbc9cf'; ctx.font = '8px Space Grotesk';
      ctx.fillText('ACCELERATION', canvas.width - 165, 135);
      ctx.fillStyle = phase === 'launch' ? '#39ff14' : '#ffffff'; ctx.font = '16px Orbitron';
      let acc = phase === 'idle' ? 0 : (phase === 'burnout' ? 15 : 35);
      ctx.fillText(`${acc} m/s²`, canvas.width - 165, 155);

      // Educational
      let pColor = phase === 'idle' ? '#ffdd4c' : (phase==='burnout' ? '#00d4ff' : '#39ff14');
      ctx.fillStyle = 'rgba(19,19,19,0.85)';
      ctx.fillRect(40, 40, 250, 80);
      ctx.fillStyle = pColor; ctx.fillRect(40, 40, 2, 80);
      
      ctx.font = '11px Orbitron';
      let t1 = "NEWTON'S FIRST LAW";
      let t2 = "An object at rest remains at rest until acted upon by a net force.";
      if(phase === 'burnout') {
         t1 = "NEWTON'S SECOND LAW"; t2 = "F = ma — Greater force produces greater acceleration.";
      } else if(phase === 'launch' || phase === 'reset') {
         t1 = "NEWTON'S THIRD LAW"; t2 = "For every action there is an equal and opposite reaction.";
      }

      ctx.fillText(t1, 55, 60);
      ctx.fillStyle = '#bbc9cf'; ctx.font = '10px Inter';
      // simple word wrap for 2 lines
      if (t2.length > 40) {
         let sub1 = t2.substring(0, 40);
         let sub2 = t2.substring(40);
         ctx.fillText(sub1, 55, 80);
         ctx.fillText(sub2, 55, 95);
      } else {
         ctx.fillText(t2, 55, 80);
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [ready]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}
