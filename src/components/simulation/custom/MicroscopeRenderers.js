// Realistic Canvas Rendering Engine for Virtual Microscope
// Mimics actual microscopy techniques: staining, light refraction, and depth of field.

// --- CORE HELPERS ---

export function organicPath(ctx, cx, cy, rx, ry, points = 16) {
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const n1 = Math.sin(i * 3.7 + cx * 0.005) * 0.07;
    const n2 = Math.cos(i * 7.1 + cy * 0.005) * 0.04;
    const n3 = Math.sin(i * 13.3) * 0.02;
    const noise = 1 + n1 + n2 + n3;
    const px = cx + Math.cos(a) * rx * noise;
    const py = cy + Math.sin(a) * ry * noise;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function drawChromatin(ctx, nx, ny, nr, alpha = 0.5) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const d = nr * (0.25 + Math.sin(i * 2.7) * 0.38);
    const cr = 1.2 + Math.sin(i * 1.3) * 0.8;
    ctx.beginPath();
    ctx.arc(nx + Math.cos(a) * d, ny + Math.sin(a) * d, cr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(42,18,5,${alpha * 0.6})`;
    ctx.fill();
  }
}

export function applyVignette(ctx, W, H) {
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.52;
  const g = ctx.createRadialGradient(cx, cy, r * 0.52, cx, cy, r);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.65, 'rgba(0,0,0,0.10)');
  g.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function applyGrain(ctx, W, H, amount) {
  const d = ctx.getImageData(0, 0, W, H);
  const data = d.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(d, 0, 0);
}

export const drawThumbnail = (specimenId, ctx, width, height) => {
  const pseudoMag = 40;
  ctx.clearRect(0, 0, width, height);
  switch (specimenId) {
    case 'onion_peel': drawOnionPeel(ctx, width, height, pseudoMag, 0, 0); break;
    case 'cheek_cells': drawCheekCells(ctx, width, height, pseudoMag, 0, 0); break;
    case 'elodea': drawElodeaCells(ctx, width, height, pseudoMag, 0, 0); break;
    case 'cork_cells': drawCorkCells(ctx, width, height, pseudoMag, 0, 0); break;
    case 'epithelial': drawEpithelial(ctx, width, height, pseudoMag, 0, 0); break;
    case 'muscular': drawMuscular(ctx, width, height, pseudoMag, 0, 0); break;
    case 'connective': drawConnective(ctx, width, height, pseudoMag, 0, 0); break;
    case 'nervous': drawNervous(ctx, width, height, pseudoMag, 0, 0); break;
    case 'xylem': drawXylem(ctx, width, height, pseudoMag, 0, 0); break;
    case 'phloem': drawPhloem(ctx, width, height, pseudoMag, 0, 0); break;
  }
};

// --- SPECIMEN RENDERERS ---

export function drawOnionPeel(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  const bgColor = 'rgb(195,158,72)';
  const wallColor = 'rgb(88,52,8)';
  const vacuoleColor = 'rgba(210,185,110,0.25)';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  const cW = 52 * scale, cH = 38 * scale;
  const cols = Math.ceil(W / cW) + 4;
  const rows = Math.ceil(H / cH) + 4;
  const ox = ((panX * scale) % cW) - cW * 2;
  const oy = ((panY * scale) % cH) - cH * 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cW;
      const y = oy + r * cH;
      const varX = Math.sin(r * 7 + c * 3) * 2 * scale;
      const varY = Math.cos(r * 3 + c * 7) * 1.5 * scale;
      const cx = x + cW / 2 + varX;
      const cy = y + cH / 2 + varY;
      const rX = cW * 0.48;
      const rY = cH * 0.48;

      const cytoGrad = ctx.createRadialGradient(cx - rX * 0.2, cy - rY * 0.2, 0, cx, cy, Math.max(rX, rY));
      cytoGrad.addColorStop(0, 'rgba(225,192,108,0.6)');
      cytoGrad.addColorStop(1, 'rgba(185,148,62,0.4)');

      organicPath(ctx, cx, cy, rX - 2, rY - 2, 16);
      ctx.fillStyle = cytoGrad;
      ctx.fill();

      organicPath(ctx, cx, cy, rX * 0.55, rY * 0.52, 12);
      ctx.fillStyle = vacuoleColor;
      ctx.fill();

      for (let g = 0; g < 30; g++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = rX * (0.5 + Math.random() * 0.45);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 0.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(88,52,8,0.15)';
        ctx.fill();
      }

      organicPath(ctx, cx, cy, rX, rY, 16);
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      organicPath(ctx, cx, cy, rX - 3, rY - 3, 16);
      ctx.strokeStyle = 'rgba(88,52,8,0.35)';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      const nox = -rX * 0.28, noy = -rY * 0.25;
      const nr = 5.5 * scale, nr2 = 4 * scale;
      const nAlpha = Math.min(1, (mag - 20) / 80);

      if (nAlpha > 0.05) {
        organicPath(ctx, cx + nox, cy + noy, nr, nr2, 10);
        ctx.fillStyle = `rgba(65,30,5,${0.3 * nAlpha})`;
        ctx.fill();
        drawChromatin(ctx, cx + nox, cy + noy, nr * 0.8, nAlpha);
        organicPath(ctx, cx + nox, cy + noy, nr, nr2, 10);
        ctx.strokeStyle = `rgba(65,30,5,${0.7 * nAlpha})`;
        ctx.lineWidth = 1.2 * scale;
        ctx.stroke();
        if (mag >= 100) {
          organicPath(ctx, cx + nox - 0.5, cy + noy - 0.5, nr * 0.38, nr2 * 0.38, 8);
          ctx.fillStyle = `rgba(40,15,2,${0.8 * nAlpha})`;
          ctx.fill();
        }
      }
    }
  }
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 22);
}

export function drawCheekCells(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(195,210,242)';
  ctx.fillRect(0, 0, W, H);

  for (let s = 0; s < 80; s++) {
    ctx.beginPath();
    ctx.arc(Math.sin(s * 137.5) * W / 2 + W / 2, Math.cos(s * 97.3) * H / 2 + H / 2, 0.5 + Math.random() * 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(60,80,160,0.12)';
    ctx.fill();
  }

  const cells = [
    { cx: 0.18, cy: 0.28, rx: 0.135, ry: 0.098, rot: 0.35, fold: true },
    { cx: 0.51, cy: 0.20, rx: 0.118, ry: 0.092, rot: -0.62, fold: false },
    { cx: 0.74, cy: 0.38, rx: 0.148, ry: 0.102, rot: 0.82, fold: true },
    { cx: 0.29, cy: 0.60, rx: 0.128, ry: 0.095, rot: -0.28, fold: false },
    { cx: 0.61, cy: 0.68, rx: 0.138, ry: 0.105, rot: 0.55, fold: true },
    { cx: 0.13, cy: 0.72, rx: 0.108, ry: 0.082, rot: -0.72, fold: false },
    { cx: 0.83, cy: 0.62, rx: 0.122, ry: 0.092, rot: 0.22, fold: true },
    { cx: 0.44, cy: 0.82, rx: 0.132, ry: 0.090, rot: -0.45, fold: false },
    { cx: 0.87, cy: 0.25, rx: 0.102, ry: 0.080, rot: 0.68, fold: true },
    { cx: 0.36, cy: 0.44, rx: 0.118, ry: 0.088, rot: -0.18, fold: false },
  ];

  const bx = W / 2 + panX * scale;
  const by = H / 2 + panY * scale;

  cells.forEach((cell, idx) => {
    const cx = (cell.cx - 0.5) * W * scale + bx;
    const cy = (cell.cy - 0.5) * H * scale + by;
    const rx = cell.rx * W * scale;
    const ry = cell.ry * H * scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(cell.rot);

    const pts = 14;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const noise = 1 + Math.sin(i * 2.3 + idx) * 0.10 + Math.cos(i * 4.7 + idx * 0.5) * 0.06 + Math.sin(i * 8.1) * 0.03;
      const px = Math.cos(a) * rx * noise;
      const py = Math.sin(a) * ry * noise;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();

    const cellGrad = ctx.createRadialGradient(-rx * 0.15, -ry * 0.15, 0, 0, 0, Math.max(rx, ry));
    cellGrad.addColorStop(0, 'rgba(185,205,245,0.50)');
    cellGrad.addColorStop(0.6, 'rgba(155,180,235,0.40)');
    cellGrad.addColorStop(1, 'rgba(120,155,220,0.30)');
    ctx.fillStyle = cellGrad;
    ctx.fill();

    for (let g = 0; g < 50; g++) {
      const ga = Math.random() * Math.PI * 2;
      const gd = Math.random() * Math.min(rx, ry) * 0.85;
      ctx.beginPath();
      ctx.arc(Math.cos(ga) * gd, Math.sin(ga) * gd, 0.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60,80,170,0.08)';
      ctx.fill();
    }

    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const noise = 1 + Math.sin(i * 2.3 + idx) * 0.10 + Math.cos(i * 4.7 + idx * 0.5) * 0.06 + Math.sin(i * 8.1) * 0.03;
      ctx.lineTo(Math.cos(a) * rx * noise, Math.sin(a) * ry * noise);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(65,90,185,0.55)';
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();

    if (mag >= 40 && cell.fold) {
      for (let f = 0; f < 3; f++) {
        const fa = cell.rot + f * 1.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(fa) * rx * 0.75, Math.sin(fa) * ry * 0.75);
        ctx.lineTo(Math.cos(fa) * rx * 0.97, Math.sin(fa) * ry * 0.97);
        ctx.strokeStyle = 'rgba(65,90,185,0.25)';
        ctx.lineWidth = 0.7 * scale;
        ctx.stroke();
      }
    }

    const nr = Math.min(rx, ry) * 0.38;
    const nGrad = ctx.createRadialGradient(-nr * 0.2, -nr * 0.2, 0, 0, 0, nr);
    nGrad.addColorStop(0, `rgba(45,68,195,${mag >= 40 ? 0.80 : 0.45})`);
    nGrad.addColorStop(0.7, `rgba(28,52,168,${mag >= 40 ? 0.75 : 0.40})`);
    nGrad.addColorStop(1, `rgba(15,35,140,${mag >= 40 ? 0.85 : 0.50})`);

    organicPath(ctx, 0, 0, nr, nr * 0.88, 12);
    ctx.fillStyle = nGrad;
    ctx.fill();

    if (mag >= 40) drawChromatin(ctx, 0, 0, nr * 0.75, 0.5);

    organicPath(ctx, 0, 0, nr, nr * 0.88, 12);
    ctx.strokeStyle = `rgba(15,35,140,${mag >= 40 ? 0.6 : 0.3})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    if (mag >= 100) {
      organicPath(ctx, nr * 0.1, nr * 0.05, nr * 0.32, nr * 0.28, 8);
      ctx.fillStyle = 'rgba(8,20,100,0.8)';
      ctx.fill();
    }
    ctx.restore();
  });
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 20);
}

export function drawMuscular(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(255,228,228)';
  ctx.fillRect(0, 0, W, H);

  const fibreH = 26 * scale;
  const numFibres = Math.ceil(H / fibreH) + 3;
  const oy = ((panY * scale) % fibreH) - fibreH * 2;

  for (let f = 0; f < numFibres; f++) {
    const fy = oy + f * fibreH;
    const fibreGrad = ctx.createLinearGradient(0, fy, 0, fy + fibreH);
    fibreGrad.addColorStop(0, 'rgba(235,155,155,0.7)');
    fibreGrad.addColorStop(0.3, 'rgba(245,175,175,0.8)');
    fibreGrad.addColorStop(0.7, 'rgba(235,155,155,0.7)');
    fibreGrad.addColorStop(1, 'rgba(215,125,125,0.6)');
    ctx.fillStyle = fibreGrad;
    ctx.fillRect(0, fy, W, fibreH);

    const bandW = 7 * scale;
    const numBands = Math.ceil(W / bandW) + 4;
    const ox = ((panX * scale) % (bandW * 2)) - bandW * 2;

    for (let b = 0; b < numBands; b++) {
      const bx = ox + b * bandW;
      const isABand = b % 2 === 0;
      if (isABand) {
        ctx.fillStyle = 'rgba(145,55,55,0.55)';
        ctx.fillRect(bx, fy + 1, bandW, fibreH - 2);
        ctx.fillStyle = 'rgba(175,95,95,0.3)';
        ctx.fillRect(bx + bandW * 0.3, fy + 1, bandW * 0.4, fibreH - 2);
        if (mag >= 400) {
          ctx.fillStyle = 'rgba(120,40,40,0.6)';
          ctx.fillRect(bx + bandW * 0.48, fy + 1, bandW * 0.04, fibreH - 2);
        }
      } else {
        ctx.fillStyle = 'rgba(235,185,185,0.4)';
        ctx.fillRect(bx, fy + 1, bandW, fibreH - 2);
        ctx.fillStyle = 'rgba(160,70,70,0.5)';
        ctx.fillRect(bx + bandW * 0.47, fy + 1, bandW * 0.06, fibreH - 2);
      }
    }

    ctx.strokeStyle = 'rgb(155,65,65)';
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeRect(0, fy + 0.5, W, fibreH - 1);

    if (mag >= 40) {
      const numNuclei = Math.ceil(W / (75 * scale));
      for (let n = 0; n < numNuclei; n++) {
        const nx = (n + 0.5) * (W / numNuclei) - (panX * scale) % (W / numNuclei);
        const isTop = (n + f) % 2 === 0;
        const ny = isTop ? fy + fibreH * 0.12 : fy + fibreH * 0.78;
        const nuclGrad = ctx.createRadialGradient(nx - 3 * scale, ny - 2 * scale, 0, nx, ny, 8 * scale);
        nuclGrad.addColorStop(0, 'rgba(100,48,140,0.9)');
        nuclGrad.addColorStop(1, 'rgba(65,25,95,0.8)');
        ctx.beginPath();
        ctx.ellipse(nx, ny, 8 * scale, 4.5 * scale, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = nuclGrad;
        ctx.fill();
        if (mag >= 100) drawChromatin(ctx, nx, ny, 6 * scale, 0.4);
      }
    }

    for (let g = 0; g < 40; g++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, fy + Math.random() * fibreH, 0.4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,40,40,0.06)';
      ctx.fill();
    }
  }
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 20);
}

export function drawElodeaCells(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(180, 210, 150)';
  ctx.fillRect(0, 0, W, H);

  const cW = 45 * scale, cH = 32 * scale;
  const cols = Math.ceil(W / cW) + 4;
  const rows = Math.ceil(H / cH) + 4;
  const ox = ((panX * scale) % cW) - cW * 2;
  const oy = ((panY * scale) % cH) - cH * 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cW;
      const y = oy + r * cH;
      const varX = Math.sin(r * 5 + c * 2) * 1.5 * scale;
      const varY = Math.cos(r * 2 + c * 5) * 1.2 * scale;
      const cx = x + cW / 2 + varX;
      const cy = y + cH / 2 + varY;
      const rX = cW * 0.47;
      const rY = cH * 0.46;

      organicPath(ctx, cx, cy, rX, rY, 12);
      ctx.strokeStyle = 'rgba(40, 80, 20, 0.7)';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      organicPath(ctx, cx, cy, rX - 1.5, rY - 1.5, 12);
      ctx.fillStyle = 'rgba(120, 180, 100, 0.3)';
      ctx.fill();

      const numChloro = 8 + Math.floor(Math.sin(r * 3 + c) * 4);
      for (let i = 0; i < numChloro; i++) {
        const a = (i / numChloro) * Math.PI * 2 + (Date.now() * 0.0002);
        const d = rX * (0.4 + Math.random() * 0.35);
        const cpX = cx + Math.cos(a) * d;
        const cpY = cy + Math.sin(a) * d;
        ctx.beginPath();
        ctx.ellipse(cpX, cpY, 3 * scale, 2 * scale, a, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 120, 20, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(20, 60, 10, 0.4)';
        ctx.lineWidth = 0.5 * scale;
        ctx.stroke();
      }
    }
  }
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 18);
}

export function drawCorkCells(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(220, 210, 180)';
  ctx.fillRect(0, 0, W, H);

  const size = 30 * scale;
  const h = size * Math.sqrt(3);
  const w = size * 2;
  const cols = Math.ceil(W / (size * 1.5)) + 4;
  const rows = Math.ceil(H / h) + 4;
  const ox = ((panX * scale) % (size * 1.5)) - size * 3;
  const oy = ((panY * scale) % h) - h * 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * size * 1.5;
      const y = oy + r * h + (c % 2 === 0 ? 0 : h / 2);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(80, 60, 40, 0.8)';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      ctx.fillStyle = 'rgba(150, 130, 100, 0.1)';
      ctx.fill();
    }
  }
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 25);
}

export function drawEpithelial(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(255, 230, 230)';
  ctx.fillRect(0, 0, W, H);

  const cW = 55 * scale, cH = 45 * scale;
  const cols = Math.ceil(W / cW) + 4;
  const rows = Math.ceil(H / cH) + 4;
  const ox = ((panX * scale) % cW) - cW * 2;
  const oy = ((panY * scale) % cH) - cH * 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cW;
      const y = oy + r * cH;
      const cx = x + cW / 2 + Math.sin(r * 2 + c) * 5 * scale;
      const cy = y + cH / 2 + Math.cos(c * 2 + r) * 5 * scale;
      
      organicPath(ctx, cx, cy, cW * 0.45, cH * 0.45, 12);
      ctx.fillStyle = 'rgba(235, 180, 180, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(180, 100, 100, 0.3)';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      const nr = 6 * scale;
      const nGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr);
      nGrad.addColorStop(0, 'rgba(100, 50, 140, 0.8)');
      nGrad.addColorStop(1, 'rgba(70, 30, 100, 0.9)');
      ctx.beginPath();
      ctx.ellipse(cx, cy, nr, nr * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = nGrad;
      ctx.fill();
      if (mag >= 100) drawChromatin(ctx, cx, cy, nr * 0.8, 0.4);
    }
  }
  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 20);
}

export function drawConnective(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(250, 240, 230)';
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    const startX = (i / 15) * W * 1.5 - (panX * scale % W);
    ctx.moveTo(startX, -50);
    for (let y = 0; y < H + 50; y += 20) {
      ctx.lineTo(startX + Math.sin(y * 0.01 + i) * 30 * scale, y);
    }
    ctx.strokeStyle = 'rgba(230, 180, 180, 0.4)';
    ctx.lineWidth = 5 * scale;
    ctx.stroke();
  }

  for (let i = 0; i < 25; i++) {
    ctx.beginPath();
    const startX = ((i * 137.5) % W) + panX * scale * 0.5;
    const startY = ((i * 37.3) % H) + panY * scale * 0.5;
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + Math.sin(i) * 100 * scale, startY + Math.cos(i) * 100 * scale);
    ctx.strokeStyle = 'rgba(80, 40, 80, 0.2)';
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();
  }

  for (let i = 0; i < 8; i++) {
    const cx = (i * 123.4 + panX * scale) % W;
    const cy = (i * 56.7 + panY * scale) % H;
    organicPath(ctx, cx, cy, 10 * scale, 5 * scale, 8);
    ctx.fillStyle = 'rgba(150, 100, 150, 0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(80, 30, 80, 0.6)';
    ctx.fill();
  }

  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 22);
}

export function drawNervous(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(245, 240, 220)';
  ctx.fillRect(0, 0, W, H);

  const neurons = [
    { x: 0.2, y: 0.3, size: 45 },
    { x: 0.6, y: 0.5, size: 40 },
    { x: 0.4, y: 0.8, size: 35 },
    { x: 0.8, y: 0.2, size: 30 }
  ];

  neurons.forEach((n, idx) => {
    const cx = ((n.x * W + panX * scale) % (W * 1.5)) - W * 0.25;
    const cy = ((n.y * H + panY * scale) % (H * 1.5)) - H * 0.25;
    const sz = n.size * scale;

    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + idx;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      let px = cx, py = cy;
      for (let j = 0; j < 4; j++) {
        px += Math.cos(a + Math.sin(j + idx) * 0.5) * 12 * scale;
        py += Math.sin(a + Math.cos(j + idx) * 0.5) * 12 * scale;
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(100, 70, 40, 0.35)';
      ctx.lineWidth = 1.8 * scale;
      ctx.stroke();
    }

    const aa = 0.6 + idx;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let ax = cx, ay = cy;
    for (let j = 0; j < 12; j++) {
      ax += Math.cos(aa) * 15 * scale;
      ay += Math.sin(aa) * 8 * scale;
      ctx.lineTo(ax, ay);
    }
    ctx.strokeStyle = 'rgba(80, 50, 30, 0.5)';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    organicPath(ctx, cx, cy, sz * 0.5, sz * 0.4, 10);
    ctx.fillStyle = 'rgba(140, 100, 70, 0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(80, 50, 30, 0.6)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    const nr = 7 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, nr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(60, 30, 20, 0.75)';
    ctx.fill();
    if (mag >= 100) drawChromatin(ctx, cx, cy, nr * 0.75, 0.4);
  });

  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 18);
}

export function drawXylem(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(255, 220, 210)';
  ctx.fillRect(0, 0, W, H);

  const tubeW = 55 * scale;
  const numTubes = Math.ceil(W / tubeW) + 4;
  const ox = ((panX * scale) % tubeW) - tubeW * 2;

  for (let i = 0; i < numTubes; i++) {
    const tx = ox + i * tubeW;
    const currentW = tubeW + Math.sin(i) * 8 * scale;

    ctx.fillStyle = 'rgba(235, 160, 150, 0.35)';
    ctx.fillRect(tx, 0, currentW, H);

    ctx.strokeStyle = 'rgba(180, 40, 20, 0.75)';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(tx, -10, currentW, H + 20);

    ctx.beginPath();
    const step = 35 * scale;
    for (let y = -50; y < H + 50; y += step) {
      if (i % 2 === 0) {
        ctx.moveTo(tx, y);
        ctx.bezierCurveTo(tx + currentW / 2, y + step/2, tx + currentW / 2, y + step/2, tx + currentW, y + step);
      } else {
        ctx.moveTo(tx, y);
        ctx.lineTo(tx + currentW, y);
      }
    }
    ctx.strokeStyle = 'rgba(140, 20, 10, 0.55)';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
  }

  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 22);
}

export function drawPhloem(ctx, W, H, mag, panX, panY) {
  const scale = mag / 40;
  ctx.fillStyle = 'rgb(220, 245, 220)';
  ctx.fillRect(0, 0, W, H);

  const sieveW = 48 * scale;
  const numVessels = Math.ceil(W / sieveW) + 4;
  const ox = ((panX * scale) % (sieveW * 1.5)) - sieveW * 2;

  for (let i = 0; i < numVessels; i++) {
    const vx = ox + i * sieveW * 1.5;
    const isSieve = i % 2 === 0;

    if (isSieve) {
      ctx.fillStyle = 'rgba(160, 220, 160, 0.25)';
      ctx.fillRect(vx, 0, sieveW, H);
      ctx.strokeStyle = 'rgba(60, 140, 60, 0.55)';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(vx, -10, sieveW, H + 20);

      const plateH = 110 * scale;
      for (let y = (panY * scale % plateH) - plateH; y < H + plateH; y += plateH) {
        ctx.beginPath();
        ctx.moveTo(vx, y);
        ctx.lineTo(vx + sieveW, y);
        ctx.strokeStyle = 'rgba(40, 100, 40, 0.7)';
        ctx.lineWidth = 3.5 * scale;
        ctx.stroke();

        if (mag >= 100) {
          for (let p = 0; p < 4; p++) {
            ctx.beginPath();
            ctx.arc(vx + (p + 1) * (sieveW / 5), y, 1.2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(20, 60, 20, 0.4)';
            ctx.fill();
          }
        }
      }
    } else {
      const companionW = sieveW * 0.35;
      ctx.fillStyle = 'rgba(140, 200, 140, 0.45)';
      ctx.fillRect(vx, 0, companionW, H);
      ctx.strokeStyle = 'rgba(50, 120, 50, 0.65)';
      ctx.lineWidth = 1.5 * scale;
      ctx.strokeRect(vx, -10, companionW, H + 20);

      const nStep = 90 * scale;
      for (let y = (panY * scale % nStep) - nStep; y < H + nStep; y += nStep) {
        ctx.beginPath();
        ctx.arc(vx + companionW / 2, y + nStep / 2, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 80, 30, 0.7)';
        ctx.fill();
      }
    }
  }

  applyVignette(ctx, W, H);
  applyGrain(ctx, W, H, 15);
}
