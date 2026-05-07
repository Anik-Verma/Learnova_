---
name: simulation-builder
description: |
  Use when the user asks to build any simulation, experiment, interactive
  canvas, or lab activity. Triggers on: "simulation", "experiment", "3D model",
  "canvas", "animate", "slider", "pH scale", "Bohr model", "ray diagram",
  "cell model", "ball drop", "photosynthesis", or any topic name paired
  with "simulate" or "lab".
---

# Skill: Simulation Builder

## What This Skill Does
Builds interactive HTML5 Canvas or SVG simulation components for each
NCERT science topic. Each simulation is a self-contained React component.

## Standard Simulation Layout (Always Follow This)
1. Display area MUST be pure HTML5 `<canvas>` or `<svg>`. If using Canvas, use `requestAnimationFrame`.
2. Must have a control panel below or alongside the canvas containing `onChange` sliders (`<input type="range">`), drop-downs, or numeric inputs.
3. Include standard `Run/Pause` and `Reset` action buttons.
4. UI styling must consistently use frosted glass tailwind rules (see `edulab-rules.md`).
5. Maintain state using React `useState` and `useEffect` appropriately bounded to canvas updates.
6. Provide an informative loading state.

## Simulation Specs Per Topic

### Physics — Motion
- Animate a ball rolling on a track, speed controlled by slider
- Show live distance-time graph updating as ball moves (Recharts LineChart)
- Sliders: Speed (1–20 m/s), Time (1–10 s)
- Show: distance = speed × time calculated live

### Physics — Gravitation
- Ball drops from a height set by slider
- Animate ball falling with increasing speed (acceleration = 9.8 m/s²)
- Show: time to fall = √(2h/g), velocity on impact = √(2gh)
- Sliders: Height (1–100 m), Mass (1–50 kg) — show mass doesn't affect fall time

### Physics — Light
- SVG ray diagram with a moveable object on principal axis
- Dropdown: Concave Mirror | Convex Mirror | Convex Lens | Concave Lens
- Show image position, size, and nature (real/virtual, inverted/erect) updating live
- Use mirror/lens formula: 1/v + 1/u = 1/f

### Chemistry — Atoms & Molecules (Bohr Model)
- Dropdown of 10 common elements (H, He, Li, C, N, O, Na, Mg, Al, Cl)
- Animate electrons orbiting in shells on canvas (requestAnimationFrame)
- Show: element name, symbol, atomic number, electron configuration, valency

### Chemistry — Matter in Our Surroundings
- Three-state animation: particles packed (solid) → loosely arranged (liquid) → scattered (gas)
- Temperature slider (0°C to 200°C) triggers state change at correct thresholds
- Particles are colored dots animating on canvas

### Chemistry — Acids, Bases & Salts
- pH scale slider (0–14)
- Background color of solution changes across red → orange → yellow → green → blue → purple
- Universal indicator color shown
- Example substances appear at key pH values (lemon=2, pure water=7, bleach=13)

### Biology — Cells
- Layered SVG of animal cell and plant cell (toggle button)
- Clickable organelles: nucleus, mitochondria, cell wall, chloroplast, vacuole, etc.
- On click: show organelle name, function, and a "Fun Fact" in a side panel

### Biology — Life Processes (Photosynthesis)
- Animated plant with sun, CO₂ bubbles entering leaves, O₂ bubbles exiting
- Light intensity slider — more light = faster bubble animation
- CO₂ concentration slider — more CO₂ = more glucose shown
- Reference: OLabs photosynthesis experiment (olabs.edu.in)

### Biology — Tissues
- SVG microscope viewer with zoom slider
- Four slide options: Epithelial | Muscular | Connective | Nervous tissue
- Zoom reveals more cellular detail (SVG scale transform)
- Labels appear at max zoom: cell nucleus, cell membrane, fibres etc.

## Always Include
- `useRef` for canvas, `useEffect` for animation loop with cleanup
- `cancelAnimationFrame` on component unmount to prevent memory leaks
- Loading spinner while canvas initializes
- "Fun Fact" callout below each simulation in gold (#ffd700) color
