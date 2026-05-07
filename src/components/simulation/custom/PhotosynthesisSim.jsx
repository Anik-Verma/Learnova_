import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotosynthesisSim({ isDark, accentColor }) {
  // --- Simulation State ---
  const [isRunning, setIsRunning] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(5);
  const [co2Level, setCo2Level] = useState(5);
  const [waterLevel, setWaterLevel] = useState(5);
  const [temperature, setTemperature] = useState(5);
  
  // Counters
  const [oxygenProduced, setOxygenProduced] = useState(0);
  const [glucoseProduced, setGlucoseProduced] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Experiment Flow
  const [experimentPhase, setExperimentPhase] = useState('setup');
  const [showIodineTest, setShowIodineTest] = useState(false);
  const [iodineTested, setIodineTested] = useState(false);
  const [iodineAnimation, setIodineAnimation] = useState(0); // 0 to 1

  // Canvas Refs
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const particlesRef = useRef([]); // CO2, O2, H2O, Glucose

  // Colors (FIX 7 - Depth Improvements)
  const t = {
    bg: isDark ? '#0D1F0D' : '#E3F2FD',
    sky: isDark ? ['#0D1F0D', '#1A3A1A', '#0A0A0A'] : ['#E3F2FD', '#C8E6C9', '#8BC34A'],
    soil: isDark ? '#3E2723' : '#795548',
    soilTexture: isDark ? '#4E342E' : '#8D6E63',
    text: '#FFFFFF',
    card: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  // --- Animation Logic ---
  const createParticle = (type, canvas) => {
    const rx = Math.random();
    if (type === 'CO2') {
      return {
        type: 'CO2',
        x: -20,
        y: 100 + Math.random() * (canvas.height - 300),
        vx: 1.5 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.5,
        r: 12,
        life: 1
      };
    }
    if (type === 'O2') {
      return {
        type: 'O2',
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height / 2 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.5 - Math.random() * 2,
        r: 10,
        life: 1
      };
    }
    if (type === 'H2O') {
        return {
          type: 'H2O',
          x: canvas.width / 2 + (Math.random() - 0.5) * 40,
          y: canvas.height * 0.75 + 20,
          vy: -1.2 - Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          r: 5,
          life: 1
        };
    }
    if (type === 'Glucose') {
        return {
          type: 'Glucose',
          x: canvas.width / 2 + (Math.random() - 0.5) * 60,
          y: canvas.height / 2,
          vy: 1 + Math.random() * 1,
          vx: (Math.random() - 0.5) * 0.8,
          r: 8,
          life: 1
        };
    }
    return null;
  };

  const getTemperatureFactor = (temp) => {
    if (temp <= 3) return 0.3;
    if (temp >= 8) return 0.5;
    return 1.0;
  };

  const animate = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // --- FIX 7: SKY GRADIENT & SOIL ---
    ctx.clearRect(0,0,width,height);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
    skyGrad.addColorStop(0, t.sky[0]);
    skyGrad.addColorStop(0.5, t.sky[1]);
    skyGrad.addColorStop(1, t.sky[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.75);

    // Soil
    ctx.fillStyle = t.soil;
    ctx.fillRect(0, height * 0.75, width, height * 0.25);
    // Soil texture
    ctx.strokeStyle = t.soilTexture;
    ctx.lineWidth = 1;
    for(let i=0; i<height*0.25; i+=4) {
        ctx.beginPath();
        ctx.moveTo(0, height*0.75 + i);
        ctx.lineTo(width, height*0.75 + i);
        ctx.stroke();
    }
    // Horizon line
    ctx.strokeStyle = isDark ? '#4CAF50' : '#388E3C';
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, height*0.75); ctx.lineTo(width, height*0.75); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // --- FIX 1: SUN (BRIGHT GOLD) ---
    const sunX = width - 100;
    const sunY = 100;
    ctx.save();
    ctx.translate(sunX, sunY);
    
    // Core Glow
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Outline
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bright White Core
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    // 12 RAYS
    ctx.rotate(time * 0.0003);
    for(let i=0; i<12; i++) {
        // Glow Rays behind
        ctx.strokeStyle = 'rgba(255,215,0,0.2)';
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(85, 0); ctx.stroke();
        
        // Main Rays
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(85, 0); ctx.stroke();
        ctx.rotate(Math.PI / 6);
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // --- FIX 3: LIGHT RAYS (DIAGONAL) ---
    if (isRunning && lightIntensity > 2) {
        const pulse = 0.5 + Math.sin(time * 0.002) * 0.3;
        const rayCount = Math.min(6, lightIntensity);
        ctx.save();
        for(let i=0; i<rayCount; i++) {
            const startX = sunX - 40 - i*15;
            const startY = sunY + 40;
            const endX = width/2 - 80 + i*40;
            const endY = height/2;

            ctx.globalAlpha = pulse;
            // Outer glow
            ctx.strokeStyle = 'rgba(255,220,50,0.15)';
            ctx.lineWidth = 12;
            ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
            // Middle
            ctx.strokeStyle = 'rgba(255,220,50,0.4)';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
            // Inner
            ctx.strokeStyle = 'rgba(255,255,180,0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
        }
        ctx.restore();
    }

    // --- FIX 2: PLANT AND LEAVES ---
    const plantX = width / 2;
    const plantY = height * 0.75;

    // ROOTS (FIX 2)
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 3;
    for(let i=0; i<3; i++) {
        const rx = plantX + (i-1)*35;
        ctx.beginPath();
        ctx.moveTo(plantX, plantY);
        ctx.quadraticCurveTo(plantX + (i-1)*25, plantY + 40, rx, plantY + 70);
        ctx.stroke();
        // highlight
        ctx.strokeStyle = '#A1887F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(plantX+1, plantY);
        ctx.quadraticCurveTo(plantX + (i-1)*25 + 1, plantY + 40, rx + 1, plantY + 70);
        ctx.stroke();
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 3;
    }

    // STEM (FIX 2)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(plantX - 7, plantY - 140, 14, 140);
    // highlight stripe
    ctx.fillStyle = '#81C784';
    ctx.fillRect(plantX - 6, plantY - 140, 3, 140);

    // LEAVES RENDERER (FIX 2)
    const drawLeaf = (lx, ly, rot, scale=1, isControl=false) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        ctx.scale(scale, scale);

        // Active Glow
        if (isRunning && !isControl && co2Level > 3 && lightIntensity > 3) {
            ctx.shadowColor = '#00FF44';
            ctx.shadowBlur = 20;
        }

        // Shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(45, -45, 90, -25, 110, 0);
        ctx.bezierCurveTo(90, 25, 45, 45, 0, 0);
        
        const leafGrad = ctx.createLinearGradient(0, -40, 0, 40);
        leafGrad.addColorStop(0, '#66BB6A');
        leafGrad.addColorStop(1, '#2E7D32');
        ctx.fillStyle = leafGrad;
        ctx.fill();

        // Iodine Color Shift
        if (iodineTested && !isControl) {
            ctx.globalAlpha = iodineAnimation;
            ctx.fillStyle = '#1A0A00'; // Very dark brown
            ctx.fill();
            ctx.fillStyle = '#2D0030'; // Purple tint
            ctx.globalAlpha = iodineAnimation * 0.4;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // Outline (FIX 2)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Veins
        ctx.strokeStyle = '#A5D6A7';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(105, 0); ctx.stroke();
        for(let i=0; i<4; i++) {
            const vx = 25 + i*20;
            ctx.beginPath(); ctx.moveTo(vx, 0); ctx.lineTo(vx+15, -15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(vx, 0); ctx.lineTo(vx+15, 15); ctx.stroke();
        }

        ctx.restore();
    };

    drawLeaf(plantX, plantY - 70, -Math.PI / 4.5);
    drawLeaf(plantX, plantY - 100, Math.PI + Math.PI / 4.5);
    drawLeaf(plantX, plantY - 140, -Math.PI / 2);

    // --- PARTICLES RENDERERS ---
    if (isRunning) {
        if (Math.random() < co2Level * 0.05) particlesRef.current.push(createParticle('CO2', canvas));
        if (waterLevel > 3 && Math.random() < waterLevel * 0.06) particlesRef.current.push(createParticle('H2O', canvas));
        
        const o2Rate = Math.min(lightIntensity, co2Level, waterLevel) * 0.01 * getTemperatureFactor(temperature);
        if (Math.random() < o2Rate) {
            particlesRef.current.push(createParticle('O2', canvas));
            setOxygenProduced(prev => prev + 0.1);
        }
        if (Math.random() < o2Rate * 0.4) {
            particlesRef.current.push(createParticle('Glucose', canvas));
            setGlucoseProduced(prev => prev + 0.05);
        }
    }

    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
        if (p.type === 'CO2') { // FIX 4: Blue-grey circles
            p.x += p.vx; p.y += p.vy;
            if (p.x > plantX - 100 && p.x < plantX + 100 && p.y > plantY - 180 && p.y < plantY) p.life -= 0.1;
            if (p.x > width) p.life = 0;

            ctx.save();
            ctx.shadowColor = '#78909C'; ctx.shadowBlur = 5;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(96, 125, 139, 0.4)'; ctx.fill();
            ctx.strokeStyle = '#78909C'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = '#CFD8DC'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center';
            ctx.fillText('CO₂', p.x, p.y + 3);
            ctx.restore();
        }
        else if (p.type === 'O2') { // FIX 5: Bright Cyan
            p.x += p.vx; p.y += p.vy;
            if (p.y < -20) p.life = 0;

            ctx.save();
            ctx.shadowColor = '#29B6F6'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(41, 182, 246, 0.25)'; ctx.fill();
            ctx.strokeStyle = '#29B6F6'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = '#B3E5FC'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center';
            ctx.fillText('O₂', p.x, p.y + 3);
            ctx.restore();
        }
        else if (p.type === 'H2O') { // FIX 6: Bright Blue
            p.y += p.vy; p.x += p.vx;
            if (p.y < plantY - 140) p.life = 0;

            ctx.save();
            ctx.shadowColor = '#1E88E5'; ctx.shadowBlur = 6;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = '#1E88E5'; ctx.fill();
            ctx.strokeStyle = '#90CAF9'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.restore();
        }
        else if (p.type === 'Glucose') { // FIX 10: Gold Hexagons
            p.y += p.vy; p.x += p.vx;
            if (p.y > height) p.life = 0;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10;
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                const angle = i * Math.PI / 3;
                ctx.lineTo(p.r * Math.cos(angle), p.r * Math.sin(angle));
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 193, 7, 0.5)'; ctx.fill();
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = '#FFF9C4'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center';
            ctx.fillText('G', 0, 3);
            ctx.restore();
        }
    });

    // --- FIX 9: BALANCED EQUATION (CARDS) ---
    const eqW = width * 0.8;
    const eqH = 46;
    const eqX = (width - eqW) / 2;
    const eqY = height - 60;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.beginPath(); ctx.roundRect(eqX, eqY, eqW, eqH, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(76,175,80,0.4)'; ctx.lineWidth = 1; ctx.stroke();

    const parts = [
        { text: '☁️ 6CO₂', active: co2Level > 3, color: '#78909C' },
        { text: ' + ', active: false, color: '#555555' },
        { text: '💧 6H₂O', active: waterLevel > 3, color: '#1E88E5' },
        { text: ' + ', active: false, color: '#555555' },
        { text: '☀️ Light → ', active: lightIntensity > 3, color: '#FFD700' },
        { text: 'C₆H₁₂O₆', active: isRunning && oxygenProduced > 0, color: '#FFD700' },
        { text: ' + ', active: false, color: '#555555' },
        { text: '6O₂', active: isRunning && oxygenProduced > 0, color: '#29B6F6' }
    ];

    ctx.font = 'bold 12px Orbitron';
    let curX = eqX + 30;
    parts.forEach(p => {
        ctx.fillStyle = p.active ? p.color : '#333333';
        ctx.fillText(p.text, curX, eqY + 28);
        curX += ctx.measureText(p.text).width + 5;
    });

    // --- FIX 11: IODINE TEST OVERLAY ---
    if (showIodineTest) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0,0,width,height);
        
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(width/2 - 120, 35, 240, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('STARCH TEST (IODINE)', width/2, 57);
        ctx.restore();

        const healthyX = width * 0.28;
        const starvedX = width * 0.72;
        const testLeafY = height / 2;

        const drawTestLeaf = (x, label, iodinated, hasStarch) => {
            ctx.save();
            ctx.translate(x, testLeafY);
            
            // Proper pointed leaf shape
            ctx.beginPath();
            ctx.moveTo(-60, 0);
            ctx.bezierCurveTo(-20, -50, 40, -40, 60, 0);
            ctx.bezierCurveTo(40, 40, -20, 50, -60, 0);
            
            // Base color
            ctx.fillStyle = label.includes('WITHOUT') ? '#81C784' : '#4CAF50';
            ctx.fill();

            // Iodine spreading animation
            if (iodinated) {
                ctx.save();
                ctx.clip();
                const radius = iodineAnimation * 150;
                ctx.beginPath();
                ctx.arc(0, -60, radius, 0, Math.PI*2);
                ctx.fillStyle = hasStarch ? '#1A0A00' : '#FF8F00';
                ctx.globalAlpha = 0.9;
                ctx.fill();
                if (hasStarch) {
                    ctx.fillStyle = '#2D0030';
                    ctx.globalAlpha = 0.4;
                    ctx.fill();
                }
                ctx.restore();
            }

            // Outline
            ctx.strokeStyle = '#1B5E20';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Space Grotesk';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
            ctx.fillText(label, 0, 75);
            ctx.restore();
        };

        drawTestLeaf(healthyX, 'LEAF WITH CO₂', iodineTested, true);
        drawTestLeaf(starvedX, 'LEAF WITHOUT CO₂', iodineTested, false);

        if (iodineTested) {
            const resultOpacity = 0.7 + Math.sin(time*0.003) * 0.3;
            ctx.fillStyle = `rgba(0, 255, 136, ${resultOpacity})`;
            ctx.font = 'bold 18px Orbitron';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#00FF88'; ctx.shadowBlur = 15;
            ctx.fillText(iodineAnimation < 1 ? 'TESTING...' : 'RESULT READY', width/2, height - 120);
        }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, lightIntensity, co2Level, waterLevel, temperature, showIodineTest, iodineTested, iodineAnimation, isDark]);

  useEffect(() => {
    if (isRunning) {
        const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }
  }, [isRunning]);

  useEffect(() => {
      if (iodineTested && iodineAnimation < 1) {
          const timeout = setTimeout(() => setIodineAnimation(prev => Math.min(1, prev + 0.015)), 20);
          return () => clearTimeout(timeout);
      }
  }, [iodineTested, iodineAnimation]);


  // Logic
  const getLimitingFactor = () => {
    const factors = [
        { name: 'Light Intensity', val: lightIntensity / 10 },
        { name: 'CO₂ Level', val: Math.max(0.1, co2Level / 10) },
        { name: 'Water (H₂O)', val: waterLevel / 10 },
        { name: 'Temperature', val: getTemperatureFactor(temperature) }
    ];
    return factors.sort((a,b) => a.val - b.val)[0];
  };

  const limiting = getLimitingFactor();

  const handleStart = () => {
    setIsRunning(!isRunning);
    if (!isRunning) setExperimentPhase('running');
  };

  const handleReset = () => {
      setIsRunning(false);
      setLightIntensity(5); setCo2Level(5); setWaterLevel(5); setTemperature(5);
      setOxygenProduced(0); setGlucoseProduced(0); setElapsedTime(0);
      setExperimentPhase('setup'); setShowIodineTest(false); setIodineTested(false); setIodineAnimation(0);
      particlesRef.current = [];
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', 
      background: t.bg, color: '#FFF', overflow: 'hidden',
      fontFamily: 'Inter'
    }}>
      {/* LEFT: CANVAS */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        
        {/* Phase Overlays */}
        {experimentPhase === 'setup' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                <div style={{ padding: '24px 48px', background: 'rgba(0,0,0,0.85)', border: `1px solid ${accentColor}`, borderRadius: 4, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron', color: accentColor, marginBottom: 8, fontSize: 18, fontWeight: 700 }}>LAB READY</div>
                    <div style={{ fontSize: 13, color: '#FFF', opacity: 0.9 }}>Configure variables and click START EXPERIMENT</div>
                </div>
            </div>
        )}
      </div>

      {/* RIGHT: CONTROLS */}
      <div style={{ 
        width: 380, background: t.card, borderLeft: `1px solid ${t.border}`,
        padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto'
      }}>
        <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 16 }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: accentColor, letterSpacing: '0.2em', marginBottom: 6, fontWeight: 800 }}>PHOTOSYNTHESIS LAB</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: isRunning ? '#39ff14' : '#555', boxShadow: isRunning ? '0 0 15px #39ff14' : 'none' }} />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{experimentPhase} PHASE</span>
            </div>
        </div>

        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ControlSlider 
                icon="☀️" label="LIGHT INTENSITY" value={lightIntensity} onChange={setLightIntensity} accentColor={accentColor}
                hint={lightIntensity < 4 ? "⚠️ Insufficient light" : "✓ Good light environment"}
            />
            <ControlSlider 
                icon="💨" label="CO₂ CONCENTRATION" value={co2Level} onChange={setCo2Level} accentColor={accentColor}
                hint={co2Level < 3 ? "⚠️ CO₂ too low - Photosynthesis will stop!" : "✓ Ample CO₂ present"}
            />
            <ControlSlider 
                icon="💧" label="WATER SUPPLY (H₂O)" value={waterLevel} onChange={setWaterLevel} accentColor={accentColor}
            />
            <ControlSlider 
                icon="🌡️" label="ENVIRONMENT TEMPERATURE" value={temperature} onChange={setTemperature} accentColor={accentColor}
                displayValue={`${10 + temperature * 3}°C`}
                hint={temperature > 7 ? "⚠️ Too hot - Enzymes denaturing" : temperature < 4 ? "⚠️ Too cold - Low activity" : "✓ Optimal Temperature"}
            />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleStart} style={{
                flex: 1, height: 48, background: isRunning ? '#ff4444' : accentColor, color: '#000',
                border: 'none', borderRadius: 4, fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 800,
                cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s'
            }}>
                {isRunning ? '⏸ Pause Experiment' : '▶ Start Experiment'}
            </button>
            <button onClick={handleReset} style={{
                width: 48, height: 48, background: 'rgba(255,255,255,0.05)', color: '#FFF',
                border: `1px solid ${t.border}`, borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s'
            }}>↺</button>
        </div>

        {/* Data Panel */}
        <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, opacity: 0.6, textTransform: 'uppercase', marginBottom: 14, letterSpacing: '0.1em' }}>LIVE MEASUREMENTS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <DataCard label="O₂ Produced" value={oxygenProduced.toFixed(1)} unit="units" accent="#29B6F6" />
                <DataCard label="Glucose Formed" value={glucoseProduced.toFixed(1)} unit="units" accent="#FFD700" />
                <DataCard label="Elapsed Time" value={elapsedTime} unit="sec" accent="#FFF" />
                <DataCard label="Efficiency" value={isRunning ? Math.round(limiting.val * 100) : 0} unit="%" accent="#39ff14" />
            </div>
        </div>

        <AnimatePresence>
            {isRunning && (
                <motion.div initial={{ opacity:0, height: 0 }} animate={{ opacity:1, height: 'auto' }} exit={{ opacity:0, height:0 }} style={{
                    padding: '16px', borderRadius: 4, background: 'rgba(255,100,0,0.15)', border: '1px solid rgba(255,100,0,0.4)', color: '#ff8800', overflow: 'hidden'
                }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 800 }}>⚠️ LIMITING FACTOR: {limiting.name.toUpperCase()}</div>
                    <div style={{ fontSize: 11, opacity: 0.9, marginTop: 6, lineHeight: 1.4 }}>Increasing {limiting.name} will significantly increase the rate of photosynthesis.</div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Iodine / Starch Test Section */}
        {elapsedTime > 20 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity:1, y: 0 }} style={{
                marginTop: 10, padding: 20, border: `1px solid ${accentColor}40`, borderRadius: 6, background: 'rgba(0,0,0,0.25)'
            }}>
                <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: accentColor, marginBottom: 10, fontWeight: 700 }}>STARCH TEST (IODINE)</div>
                <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8, marginBottom: 16 }}>
                    Iodine turns dark brown/black when starch is present. Starch is the stored form of glucose produced during photosynthesis.
                </p>
                
                {!showIodineTest ? (
                    <button onClick={() => setShowIodineTest(true)} style={{
                        width: '100%', padding: '12px', background: 'transparent',
                        border: `2px solid ${accentColor}`, color: accentColor, borderRadius: 4, cursor: 'pointer',
                        fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk', textTransform: 'uppercase'
                    }}>
                        PREPARE IODINE TEST
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {!iodineTested ? (
                            <button onClick={() => setIodineTested(true)} style={{
                                width: '100%', padding: '12px', background: '#39ff14', color: '#000',
                                border: 'none', borderRadius: 4, cursor: 'pointer',
                                fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk', textTransform: 'uppercase'
                            }}>
                                APPLY IODINE →
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ fontSize: 11, padding: 12, background: '#39ff1420', border: '1px solid #39ff1440', borderRadius: 4, color: '#39ff14' }}>
                                    ✅ <b>WITH CO₂:</b> BLACK STAIN (Starch Present)
                                </div>
                                <div style={{ fontSize: 11, padding: 12, background: '#ff444420', border: '1px solid #ff444440', borderRadius: 4, color: '#ff6666' }}>
                                    ❌ <b>WITHOUT CO₂:</b> NO STAIN (No Photosynthesis)
                                </div>
                                <div style={{ marginTop: 10, padding: 16, background: 'rgba(57,255,20,0.1)', border: `1px solid ${accentColor}40`, borderRadius: 4 }}>
                                    <div style={{ fontFamily: 'Orbitron', fontSize: 10, marginBottom: 6, color: accentColor }}>🎯 CONCLUSION</div>
                                    <div style={{ fontSize: 11, lineHeight: 1.6, color: '#FFF' }}>
                                        Carbon dioxide (CO₂) is Essential. Without it, no starch is produced even in bright light.
                                    </div>
                                </div>
                                <button onClick={() => setShowIodineTest(false)} style={{ background: 'none', border: 'none', color: accentColor, fontSize: 11, cursor: 'pointer', marginTop: 8, fontWeight: 600 }}>CLOSE TEST VIEW</button>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        )}
      </div>
    </div>
  );
}

function ControlSlider({ icon, label, value, onChange, accentColor, displayValue, hint }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.9, letterSpacing: '0.05em' }}>{icon} {label}</span>
                <span style={{ fontSize: 12, fontFamily: 'Orbitron', color: accentColor, fontWeight: 800 }}>{displayValue || value}</span>
            </div>
            <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
                <input 
                    type="range" min={1} max={10} value={value} 
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    style={{
                        width: '100%', accentColor: accentColor, cursor: 'pointer', height: 4
                    }}
                />
            </div>
            {hint && <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7, fontStyle: 'italic', fontWeight: 500 }}>{hint}</div>}
        </div>
    );
}

function DataCard({ label, value, unit, accent }) {
    return (
        <div style={{
            padding: '14px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4
        }}>
            <div style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 600 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ fontFamily: 'Orbitron', fontSize: 20, color: accent, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600 }}>{unit}</div>
            </div>
        </div>
    );
}
