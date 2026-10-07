import React, { useEffect, useRef, useState } from 'react';

/**
 * SunriseLoader
 * Full-screen ASCII-art loading scene inspired by the sunrise reference:
 *  - dense twinkling starfield in ASCII glyphs
 *  - faint concentric rings radiating from the sun
 *  - layered wireframe mountain ridges forming a valley
 *  - sun rising out of the valley, with a thin vertical beam shooting to the sky
 * 
 * UPON COMPLETION:
 *  - The sun ACTUALLY RISES up through the sky to the top-center emblem position
 *  - Camera scrolls up: mountain ridges glide downwards as the sun ascends
 *  - Concentric rings expand outward and ASCII glyphs dissolve into the 3D hero landscape
 *  - Zero card/section swiping — an authentic, continuous sunrise-to-hero metamorphosis!
 */

interface SunriseLoaderProps {
  onComplete: () => void;
  onTransformStart?: () => void;
  minDuration?: number; // ms
}

const RAMP = ' .:-=+*#%@';

// ---- deterministic 1D value noise ----
const hash = (i: number, seed: number) => {
  const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const noise1 = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
};
const ridgedFbm = (x: number, seed: number) => {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < 5; o++) {
    const n = noise1(x * freq, seed + o * 13.7);
    sum += (1 - Math.abs(n * 2 - 1)) * amp; // ridged -> sharp peaks
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum; // ~0..1
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Star { col: number; row: number; b: number; phase: number; }
interface Ridge { ys: Float32Array; depth: number; }

export const SunriseLoader: React.FC<SunriseLoaderProps> = ({ 
  onComplete, 
  onTransformStart,
  minDuration = 3200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [percent, setPercent] = useState(0);
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onTransformStartRef = useRef(onTransformStart);
  onTransformStartRef.current = onTransformStart;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 1200 : minDuration;

    document.body.style.overflow = 'hidden';

    // ---- layout state ----
    let W = 0, H = 0, cw = 8, ch = 14, cols = 0, rows = 0;
    let fontPx = 12;
    let sunX = 0, horizonY = 0, sunCol = 0;
    let stars: Star[] = [];
    let ridges: Ridge[] = [];
    let terrainTop = new Float32Array(0);

    // per-frame buffers
    let glyph: string[] = [];
    let alpha = new Float32Array(0);

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = W < 700;
      fontPx = small ? 9 : 11;
      cw = small ? 5.6 : 6.8;
      ch = small ? 10 : 12.5;
      cols = Math.ceil(W / cw);
      rows = Math.ceil(H / ch);

      sunCol = Math.floor(cols / 2);
      sunX = (sunCol + 0.5) * cw;
      horizonY = H * 0.78;

      glyph = new Array(cols * rows).fill(' ');
      alpha = new Float32Array(cols * rows);

      // stars (sky only)
      stars = [];
      const starCount = Math.floor(cols * rows * 0.045);
      for (let i = 0; i < starCount; i++) {
        const row = Math.floor(Math.pow(Math.random(), 1.15) * (horizonY / ch));
        stars.push({
          col: Math.floor(Math.random() * cols),
          row,
          b: Math.pow(Math.random(), 3),
          phase: Math.random() * Math.PI * 2
        });
      }

      // mountain ridges: back (k=0) -> front
      ridges = [];
      const N = 11;
      terrainTop = new Float32Array(cols).fill(H);
      for (let k = 0; k < N; k++) {
        const t = k / (N - 1);
        const ys = new Float32Array(cols + 1);
        const baseY = horizonY + Math.pow(t, 1.6) * (H - horizonY) * 1.05;
        const seed = 3.1 + k * 7.77;
        for (let c = 0; c <= cols; c++) {
          const x = c * cw;
          const nx = (x - sunX) / (W / 2); // -1..1
          const ax = Math.abs(nx);
          // valley: ridges rise toward the edges
          const rise = H * 0.08 * (1 - t * 0.55) * Math.pow(ax, 1.35);
          // jagged peaks, flattened in the valley so the sun can peek through
          const ampl = H * (0.05 - t * 0.022) * (0.12 + smooth(0.02, 0.35, ax));
          const n = ridgedFbm(x / (W * (0.11 + t * 0.05)), seed);
          ys[c] = baseY - rise - n * ampl;
        }
        ridges.push({ ys, depth: t });
        for (let c = 0; c < cols; c++) {
          terrainTop[c] = Math.min(terrainTop[c], ys[c]);
        }
      }
    };

    setup();

    // ---- progress tracking ----
    let loaded = document.readyState === 'complete';
    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad);

    const onResize = () => setup();
    window.addEventListener('resize', onResize);

    const start = performance.now();
    let p = 0;
    let lastPct = -1;
    let exitStartTime = 0;
    let raf = 0;
    let finished = false;

    // Optional user interactive skip/scroll triggers
    const triggerExit = () => {
      if (!exitStartTime) {
        p = 1;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) triggerExit();
    };
    const onTouch = () => triggerExit();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') triggerExit();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('keydown', onKey);

    const put = (c: number, r: number, g: string, a: number) => {
      if (c < 0 || c >= cols || r < 0 || r >= rows) return;
      const i = r * cols + c;
      if (a >= alpha[i]) {
        glyph[i] = g;
        alpha[i] = a;
      }
    };

    const frame = (now: number) => {
      const elapsed = now - start;
      const target = loaded ? 1 : 0.92;
      const timeP = clamp01(elapsed / duration);
      p += (Math.min(timeP, target) - p) * 0.14;
      if (timeP >= 1 && loaded && p > 0.99) p = 1;

      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        setPercent(pct);
      }

      const time = elapsed / 1000;
      const ep = easeInOut(p);

      // ---- EXIT PHASE: Continuous Sun Ascent & Hero Transition ----
      let exitProgress = 0;
      let exitEase = 0;
      if (p >= 1) {
        if (!exitStartTime) {
          exitStartTime = now;
          if (onTransformStartRef.current) {
            onTransformStartRef.current();
          }
        }
        exitProgress = clamp01((now - exitStartTime) / 1800);
        exitEase = easeInOut(exitProgress);
        // Smoothly dissolve ASCII canvas as the rising sun resolves into the hero scene
        const currentOp = Math.max(0, 1.0 - Math.pow(exitProgress, 1.35));
        setLoaderOpacity(currentOp);
      }

      // 1. Sun Ascent:
      // Starts low in the valley, then smoothly RISES all the way up to H * 0.22
      // (the exact vertical coordinate where the hero geometric emblem sits!)
      const baseSunY = horizonY + H * 0.05 * (1 - ep) - H * 0.02 * ep;
      const apexSunY = H * 0.22;
      const sunY = (1 - exitEase) * baseSunY + exitEase * apexSunY;

      // Sun core growth & bloom
      const sunGrow = (0.28 + ep * 0.72) * (1.0 + exitEase * 2.8);

      // 2. Camera Scroll-Up in the ASCII scene:
      // Mountains roll down and off the screen as the camera ascends with the rising sun
      const cameraScrollY = exitEase * H * 0.55;

      // reset buffers
      glyph.fill(' ');
      alpha.fill(0);

      // ---- Sky Glow + Dynamic Expanding Concentric Rings (Particle Style) ----
      const coreR = H * 0.024 * sunGrow;
      const bloomR = H * (0.12 * (0.25 + ep * 0.75) + exitEase * 0.4);
      const haloR = H * (0.45 + exitEase * 0.55);
      const ringSpacing = H * (0.016 + exitEase * 0.035);

      // Particle ramp: uses subtle dot particles instead of heavy block letters
      const PARTICLE_RAMP = '  .·:·*';

      for (let r = 0; r < rows; r++) {
        const py = (r + 0.5) * ch;
        for (let c = 0; c < cols; c++) {
          const px = (c + 0.5) * cw;
          const dx = px - sunX;
          const dy = (py - sunY) * 1.25;
          const d = Math.sqrt(dx * dx + dy * dy);

          let lum =
            Math.exp(-d / coreR) * (1.3 + exitEase * 1.4) +
            Math.exp(-d / bloomR) * (0.6 * ep + exitEase * 0.7) +
            Math.exp(-d / haloR) * 0.16 * ep;

          // Expanding concentric rings radiating outward as particle arcs
          const ringPhase = (d / ringSpacing) * Math.PI * 2 - exitEase * 14.0;
          const ring = Math.pow(0.5 + 0.5 * Math.cos(ringPhase), 36);
          lum += ring * (0.22 + exitEase * 0.35) * ep * Math.exp(-d / (H * 0.95));

          // Terrain occlusion (shifted by camera scroll)
          const currentTop = terrainTop[c] + cameraScrollY;
          if (py > currentTop) lum *= 0.08;

          if (lum > 0.04) {
            const idx = Math.min(PARTICLE_RAMP.length - 1, Math.max(1, Math.floor(lum * (PARTICLE_RAMP.length - 1))));
            put(c, r, PARTICLE_RAMP[idx], clamp01(0.18 + lum * 0.95));
          }
        }
      }

      // ---- Stars in the sky (KEPT EXACTLY AS-IS: Twinkling '+', '*', '.') ----
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 0.55 + 0.45 * Math.sin(time * 2.4 + s.phase);
        const py = (s.row + 0.5) * ch;
        if (py > terrainTop[s.col] + cameraScrollY) continue;
        const b = s.b * tw;
        const g = b > 0.6 ? '+' : b > 0.3 ? '*' : '.';
        put(s.col, s.row, g, 0.25 + b * 0.75);
      }

      // ---- Particle Ridges & Mountains (Converted from slashes to fine particle points) ----
      const reveal = ep * 1.5;
      for (let k = 0; k < ridges.length; k++) {
        const { ys, depth } = ridges[k];
        const base = 0.95 - depth * 0.6;
        for (let c = 0; c < cols; c++) {
          const nx = Math.abs(((c + 0.5) * cw - sunX) / (W / 2));
          const light = (0.22 + 0.78 * Math.exp(-nx * (2.6 + depth * 3))) * (1.0 + exitEase * 0.4);
          const rev = 0.25 + 0.75 * clamp01((reveal - nx) * 2.5);
          const a = clamp01(base * light * rev);
          if (a < 0.05) continue;

          const y0 = ys[c] + cameraScrollY;
          const y1 = ys[c + 1] + cameraScrollY;
          if (y0 > H && y1 > H) continue; // Out of bottom frame

          const rA = Math.floor(Math.min(y0, y1) / ch);
          const rB = Math.floor(Math.max(y0, y1) / ch);
          
          // Mountain contours rendered with fine particle dots instead of typographic slashes
          const g = (a > 0.75) ? '*' : (a > 0.38) ? '·' : '.';
          for (let r = rA; r <= rB; r++) put(c, r, g, a);
        }
      }

      // ---- Vertical Light Beam (Fine particle column) ----
      const beamP = easeInOut(clamp01((p - 0.35) / 0.45));
      if (beamP > 0) {
        const sunRow = Math.floor(sunY / ch);
        const topRow = Math.max(0, Math.floor(sunRow * (1 - beamP)));
        const beamIntensity = (1.0 - exitEase * 0.4);

        for (let r = topRow; r <= sunRow; r++) {
          const f = (sunRow - r) / Math.max(1, sunRow);
          const a = clamp01((1 - f * 0.45) * beamIntensity);
          put(sunCol, r, '·', a);
          if (f < 0.45 || exitEase > 0.2) {
            const side = (0.45 - f * 0.5) * 0.95;
            put(sunCol - 1, r, '.', side * beamIntensity);
            put(sunCol + 1, r, '.', side * beamIntensity);
            if (exitEase > 0.3) {
              put(sunCol - 2, r, '·', side * 0.5 * beamIntensity);
              put(sunCol + 2, r, '·', side * 0.5 * beamIntensity);
            }
          }
        }
      }

      // ---- Render glyphs batched by alpha bucket ----
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${fontPx}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      const BUCKETS = 14;
      for (let b = 1; b <= BUCKETS; b++) {
        const lo = (b - 1) / BUCKETS;
        const hi = b / BUCKETS;
        ctx.fillStyle = `rgba(255,255,255,${hi.toFixed(3)})`;
        for (let i = 0; i < glyph.length; i++) {
          const a = alpha[i];
          if (a <= lo || a > hi) continue;
          const g = glyph[i];
          if (g === ' ') continue;
          const c = i % cols;
          const r = (i / cols) | 0;
          ctx.fillText(g, c * cw, r * ch);
        }
      }

      // Soft optical radial bloom over the glowing sun core
      const currentBloomR = bloomR * 1.5;
      const grad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, currentBloomR);
      grad.addColorStop(0, `rgba(255,255,255,${Math.min(1.0, 0.7 * ep + exitEase * 0.3)})`);
      grad.addColorStop(0.2, `rgba(255,255,255,${0.28 * ep + exitEase * 0.2})`);
      grad.addColorStop(0.6, `rgba(255,255,255,${0.07 * ep + exitEase * 0.08})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sunX - currentBloomR, sunY - currentBloomR, currentBloomR * 2, currentBloomR * 2);

      // ---- Completion callback after transformation completes ----
      if (exitProgress >= 1 && !finished) {
        finished = true;
        document.body.style.overflow = '';
        onCompleteRef.current();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = '';
    };
  }, [minDuration]);

  return (
    <div
      role="progressbar"
      aria-label="Loading Matrix"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
        opacity: loaderOpacity,
        pointerEvents: percent >= 100 ? 'none' : 'auto',
        transition: 'opacity 0.2s ease-out'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Minimal Top Brand Bar */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.6em',
          color: 'rgba(255,255,255,0.75)',
          paddingLeft: '0.6em',
          opacity: percent >= 100 ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        MATRIX
      </div>

      {/* Bottom Status & Percentage Readout */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 32,
          right: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: '0.68rem',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.5)',
          opacity: percent >= 100 ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <span>
          {percent < 100 ? 'AWAITING FIRST LIGHT // [SCROLL TO ADVANCE]' : 'DAWN REACHED // TRANSFORMING TO HERO'}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          {String(percent).padStart(3, '0')}%
        </span>
      </div>
    </div>
  );
};
