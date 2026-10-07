import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroSunriseTerrainCanvasProps {
  className?: string;
  loadProgress: number; // 0.0 to 1.0 (sunrise load phase)
  isTransformed: boolean; // true when sun has fully risen and transformed into hero
  scrollProgress?: number; // 0.0 (hero wave) -> 0.5 (disperse) -> 1.0 (reformed sphere in next section)
  onTransformationComplete?: () => void;
}

export const HeroSunriseTerrainCanvas: React.FC<HeroSunriseTerrainCanvasProps> = ({
  className = '',
  loadProgress,
  isTransformed,
  scrollProgress = 0,
  onTransformationComplete
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    loadProgress,
    isTransformed,
    scrollProgress,
    onTransformationComplete
  });

  useEffect(() => {
    stateRef.current = { loadProgress, isTransformed, scrollProgress, onTransformationComplete };
  }, [loadProgress, isTransformed, scrollProgress, onTransformationComplete]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); // Deep obsidian black

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Initial dawn framing
    camera.position.set(0, 3.2, 42.0);
    camera.lookAt(0, -1.0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- 2. ASCII Star Glyphs Texture Sheet (Twinkling '.', '*', '+') ---
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 192;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#000000';
      sCtx.fillRect(0, 0, 192, 64);
      sCtx.font = 'bold 36px "JetBrains Mono", monospace';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillStyle = '#ffffff';

      sCtx.fillText('.', 32, 32);
      sCtx.fillText('*', 96, 32);
      sCtx.fillText('+', 160, 32);
    }
    const starGlyphTex = new THREE.CanvasTexture(starCanvas);
    starGlyphTex.minFilter = THREE.LinearFilter;
    starGlyphTex.magFilter = THREE.LinearFilter;

    // --- 3. Construct Unified Particle Grid ---
    const COLS = 160;
    const ROWS = 88;
    const TOTAL_TERRAIN = COLS * ROWS; // 14,080 particles
    const STARS_COUNT = 560;
    const TOTAL_POINTS = TOTAL_TERRAIN + STARS_COUNT;

    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const sizes = new Float32Array(TOTAL_POINTS);
    const opacities = new Float32Array(TOTAL_POINTS);
    const sparkles = new Float32Array(TOTAL_POINTS);
    const types = new Float32Array(TOTAL_POINTS); // 0 = terrain/sphere, 1 = star glyph

    // Precalculate Services Sculpture (Hand + Interlocking Rotating Gears + Stars) coordinates
    const sculptureTarget = new Float32Array(TOTAL_TERRAIN * 6);
    
    // Initial geometric fallback while binary file loads
    for (let i = 0; i < TOTAL_TERRAIN; i++) {
      const phi = Math.acos(1.0 - 2.0 * (i + 0.5) / TOTAL_TERRAIN);
      const theta = 2.0 * Math.PI * i / 1.6180339887;
      sculptureTarget[i * 6] = 13.5 * Math.sin(phi) * Math.cos(theta);
      sculptureTarget[i * 6 + 1] = 13.5 * Math.cos(phi) + 1.2;
      sculptureTarget[i * 6 + 2] = 13.5 * Math.sin(phi) * Math.sin(theta);
      sculptureTarget[i * 6 + 3] = 0;
      sculptureTarget[i * 6 + 4] = 0;
      sculptureTarget[i * 6 + 5] = 0;
    }

    // Load exact 14,080 sampled coordinates for the Hand + Gears + Stars icon
    fetch('/services_target_coords.bin?v=3')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_TERRAIN * 6 * 4) {
          sculptureTarget.set(new Float32Array(buf));
        }
      })
      .catch(e => console.error('Failed to load sculpture coords:', e));

    // Precalculate Process Steps (01, 02, 03, 04) morph coordinates
    // Precalculate Process Steps (01, 02, 03, 04) morph coordinates
    const processTarget = new Float32Array(TOTAL_TERRAIN * 16);
    fetch('/process_morph_coords.bin?v=2')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_TERRAIN * 16 * 4) {
          processTarget.set(new Float32Array(buf));
        }
      })
      .catch(e => console.error('Failed to load process morph coords:', e));

    // Precalculate Matrix Labs (Laboratory Beaker & Bubbling Ascent) morph coordinates
    const labsTarget = new Float32Array(TOTAL_TERRAIN * 6);
    fetch('/labs_target_coords.bin?v=3')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_TERRAIN * 6 * 4) {
          labsTarget.set(new Float32Array(buf));
        }
      })
      .catch(e => console.error('Failed to load labs coords:', e));

    // Precalculate Footer Handshake (Two People Shaking Hands on Dunes) morph coordinates
    const handshakeTarget = new Float32Array(TOTAL_TERRAIN * 4);
    fetch('/handshake_target_coords.bin?v=1')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_TERRAIN * 4 * 4) {
          handshakeTarget.set(new Float32Array(buf));
        }
      })
      .catch(e => console.error('Failed to load handshake coords:', e));

    // Precalculate 3D dispersion vectors for each particle
    const disperseVectors = new Float32Array(TOTAL_TERRAIN * 3);
    for (let i = 0; i < TOTAL_TERRAIN; i++) {
      const ang = (i / TOTAL_TERRAIN) * Math.PI * 8.0 + (i % 17) * 0.4;
      const rad = 28.0 + (i % 23) * 1.8;
      disperseVectors[i * 3] = Math.cos(ang) * rad;
      disperseVectors[i * 3 + 1] = ((i % 31) / 31 - 0.45) * 32.0;
      disperseVectors[i * 3 + 2] = Math.sin(ang) * rad - 8.0;
    }

    // Precalculate 3D dispersion vectors 4 (Matrix Labs -> Handshake)
    const disperseVectors4 = new Float32Array(TOTAL_TERRAIN * 3);
    for (let i = 0; i < TOTAL_TERRAIN; i++) {
      const ang = (i / TOTAL_TERRAIN) * Math.PI * 10.0 + (i % 29) * 0.35;
      const rad = 25.0 + (i % 19) * 1.5;
      disperseVectors4[i * 3] = Math.cos(ang) * rad;
      disperseVectors4[i * 3 + 1] = ((i % 23) / 23 - 0.45) * 28.0;
      disperseVectors4[i * 3 + 2] = Math.sin(ang) * rad;
    }

    const X_SPAN = 156.0;
    const Z_START = -62.0;
    const Z_END = 28.0;

    const colWhite = new THREE.Color('#ffffff');
    const colSilver = new THREE.Color('#e2e8f0');
    const colCyan = new THREE.Color('#a5f3fc');
    const colSlate = new THREE.Color('#94a3b8');
    const colDim = new THREE.Color('#334155');

    // Initialize terrain grid
    for (let r = 0; r < ROWS; r++) {
      const zNorm = r / (ROWS - 1);
      const z = Z_START + zNorm * (Z_END - Z_START);

      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        const xNorm = c / (COLS - 1);
        const x = (xNorm - 0.5) * X_SPAN;
        const y = -8.0;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const distFade = Math.pow(zNorm, 0.72);
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;

        const isNear = zNorm > 0.72;
        sizes[i] = isNear ? (2.8 + (zNorm - 0.72) * 8.5) : (1.6 + zNorm * 0.8);
        opacities[i] = 0.22 + distFade * 0.78;
        sparkles[i] = Math.random();
        types[i] = 0.0;
      }
    }

    // Initialize upper starry sky with ASCII twinkles ('.', '*', '+')
    for (let s = 0; s < STARS_COUNT; s++) {
      const idx = TOTAL_TERRAIN + s;
      const sx = (Math.random() - 0.5) * 160;
      const sy = Math.random() * 52 + 1.5;
      const sz = (Math.random() - 0.5) * 80 - 15;

      positions[idx * 3] = sx;
      positions[idx * 3 + 1] = sy;
      positions[idx * 3 + 2] = sz;

      colors[idx * 3] = 1.0;
      colors[idx * 3 + 1] = 1.0;
      colors[idx * 3 + 2] = 1.0;

      sizes[idx] = Math.random() * 2.8 + 2.0;
      opacities[idx] = Math.random() * 0.6 + 0.35;
      sparkles[idx] = Math.random();
      types[idx] = 1.0;
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const colAttr = new THREE.BufferAttribute(colors, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const opacAttr = new THREE.BufferAttribute(opacities, 1);
    const sparkAttr = new THREE.BufferAttribute(sparkles, 1);
    const typeAttr = new THREE.BufferAttribute(types, 1);

    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('aColor', colAttr);
    geometry.setAttribute('aSize', sizeAttr);
    geometry.setAttribute('aOpacity', opacAttr);
    geometry.setAttribute('aSparkle', sparkAttr);
    geometry.setAttribute('aType', typeAttr);

    // --- 4. Custom Shader: ASCII Star Twinkles + Particle Terrain Bokeh ---
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uTime: { value: 0 },
        uDawnFade: { value: 0 },
        uSphereFade: { value: 0 },
        uIsMobile: { value: 0 },
        uStarTex: { value: starGlyphTex }
      },
      vertexShader: `
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uDawnFade;
        uniform float uSphereFade;
        uniform float uIsMobile;

        attribute float aSize;
        attribute vec3 aColor;
        attribute float aOpacity;
        attribute float aSparkle;
        attribute float aType;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vBokeh;
        varying float vSparkle;
        varying float vType;
        varying float vTwinkle;

        void main() {
          vColor = aColor;
          vType = aType;
          vSparkle = aSparkle;

          vec4 modelPos = modelMatrix * vec4(position, 1.0);
          vec4 viewPos = viewMatrix * modelPos;
          gl_Position = projectionMatrix * viewPos;

          float depth = -viewPos.z;

          // Twinkle oscillation for stars: 0.0 to 1.0
          float tw = 0.5 + 0.5 * sin(uTime * 2.6 + aSparkle * 6.28);
          vTwinkle = tw;

          float alpha = aOpacity;
          if (aType > 0.5) {
            alpha *= (0.35 + 0.65 * tw);
            alpha *= (1.0 - uDawnFade * 0.3);
          } else {
            // When reforming into the sphere/sculpture, particles glow with vibrant crystalline intensity
            alpha = mix(alpha * 0.65, alpha * 1.15, uDawnFade);
            alpha = mix(alpha, 0.95, uSphereFade);
          }
          vAlpha = alpha;

          // Bokeh factor: foreground points expand into soft optical bokeh discs
          float bokeh = smoothstep(42.0, 22.0, depth) * (1.0 - uSphereFade * 0.7);
          vBokeh = bokeh;

          float pSize = aSize;
          if (aType > 0.5) {
            pSize *= (0.8 + 0.5 * tw);
            float minStar = uIsMobile > 0.5 ? 1.4 : 1.0;
            float maxStar = uIsMobile > 0.5 ? 3.6 : 4.5;
            gl_PointSize = clamp(pSize * (26.0 / max(10.0, depth)) * uPixelRatio, minStar, maxStar);
          } else {
            // Sizing on sculpture / numerals / beaker: bright, crisp, visible starlight nodes
            float targetSize = uIsMobile > 0.5 ? (1.15 + aSparkle * 0.45) : (1.35 + aSparkle * 0.75);
            float sphereSize = mix(pSize, targetSize, uSphereFade);
            pSize = mix(sphereSize, sphereSize * (1.10 + aSparkle * 0.4), bokeh);
            
            // On mobile retina screens, ensure minimum pixel size is generous and clearly visible
            float minPt = uIsMobile > 0.5 ? 2.5 : 1.2;
            float maxPt = uIsMobile > 0.5 ? 5.0 : 5.0;
            gl_PointSize = clamp(pSize * (28.0 / max(10.0, depth)) * uPixelRatio, minPt, maxPt);
          }
        }
      `,
      fragmentShader: `
        uniform sampler2D uStarTex;
        uniform float uTime;
        uniform float uSphereFade;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vBokeh;
        varying float vSparkle;
        varying float vType;
        varying float vTwinkle;

        void main() {
          if (vType > 0.5) {
            // ASCII STAR GLYPH RENDERING ('.', '*', '+')
            float cell = 0.0;
            if (vTwinkle > 0.72) {
              cell = 2.0; // '+'
            } else if (vTwinkle > 0.38) {
              cell = 1.0; // '*'
            } else {
              cell = 0.0; // '.'
            }

            vec2 uv = gl_PointCoord;
            uv.x = (uv.x + cell) / 3.0;
            vec4 texCol = texture2D(uStarTex, uv);
            if (texCol.r < 0.1) discard;

            // Pure white star glyph
            gl_FragColor = vec4(1.0, 1.0, 1.0, texCol.r * vAlpha);
          } else {
            // TERRAIN, SERVICES, PROCESS & LABS PARTICLES RENDERING
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            float shape = 0.0;
            if (vBokeh > 0.2) {
              float disc = smoothstep(0.49, 0.12, dist);
              float core = exp(-dist * 8.0) * 0.6;
              float sparkleFlicker = 0.85 + 0.3 * sin(uTime * 3.2 + vSparkle * 6.28);
              shape = clamp(disc * 0.75 + core, 0.0, 1.0) * sparkleFlicker;
            } else {
              // Glistening starlight node with radiant solid white core and glowing perimeter
              float core = exp(-dist * dist * 14.0);
              float rim = smoothstep(0.48, 0.16, dist) * 0.42;
              float sphereSparkle = mix(1.0, 0.90 + 0.25 * sin(uTime * 3.5 + vSparkle * 6.28), uSphereFade);
              shape = clamp((core + rim) * sphereSparkle, 0.0, 1.0);
            }

            // Pure crisp white particles with full luminous opacity when morphed
            float finalAlpha = mix(vAlpha, max(0.85, vAlpha), uSphereFade);
            gl_FragColor = vec4(1.0, 1.0, 1.0, shape * finalAlpha);
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const terrainMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(terrainMesh);

    // --- 5. The Rising Sun, Vertical Particle Needle & Concentric Rings ---
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Sun Core Sprite
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 256;
    sunCanvas.height = 256;
    const sunCtx = sunCanvas.getContext('2d');
    if (sunCtx) {
      const grad = sunCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.35, 'rgba(240, 249, 255, 0.45)');
      grad.addColorStop(0.65, 'rgba(186, 230, 253, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sunCtx.fillStyle = grad;
      sunCtx.fillRect(0, 0, 256, 256);
    }
    const sunTex = new THREE.CanvasTexture(sunCanvas);
    const sunMat = new THREE.SpriteMaterial({
      map: sunTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunSprite = new THREE.Sprite(sunMat);
    sunSprite.scale.set(15.0, 15.0, 1.0);
    sunGroup.add(sunSprite);

    // Vertical Light Needle Beam
    const beamGeo = new THREE.BufferGeometry();
    const BEAM_PTS = 200;
    const beamPts = new Float32Array(BEAM_PTS * 3);
    const beamCols = new Float32Array(BEAM_PTS * 3);
    for (let b = 0; b < BEAM_PTS; b++) {
      const by = b * 0.45;
      beamPts[b * 3] = 0;
      beamPts[b * 3 + 1] = by;
      beamPts[b * 3 + 2] = 0;

      const fade = Math.exp(-b * 0.018);
      beamCols[b * 3] = fade;
      beamCols[b * 3 + 1] = fade;
      beamCols[b * 3 + 2] = fade * 0.98;
    }
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPts, 3));
    beamGeo.setAttribute('color', new THREE.BufferAttribute(beamCols, 3));
    const beamMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const beamLine = new THREE.Line(beamGeo, beamMat);
    sunGroup.add(beamLine);

    // Concentric Celestial Shockwave / Orbital Rings
    const ringsGroup = new THREE.Group();
    sunGroup.add(ringsGroup);

    const ringRadii = [6.0, 12.0, 20.0, 30.0, 42.0, 56.0, 74.0, 96.0, 122.0];
    const ringMeshes: THREE.LineLoop[] = [];

    ringRadii.forEach((rad, idx) => {
      const SEGMENTS = 96;
      const ringPts = new Float32Array((SEGMENTS + 1) * 3);
      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        ringPts[s * 3] = Math.cos(theta) * rad;
        ringPts[s * 3 + 1] = Math.sin(theta) * rad;
        ringPts[s * 3 + 2] = 0;
      }
      const ringG = new THREE.BufferGeometry();
      ringG.setAttribute('position', new THREE.BufferAttribute(ringPts, 3));
      const ringM = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.max(0.04, 0.22 - idx * 0.02),
        blending: THREE.AdditiveBlending
      });
      const ringLine = new THREE.LineLoop(ringG, ringM);
      ringsGroup.add(ringLine);
      ringMeshes.push(ringLine);
    });

    // --- 5b. Handshake Subtle Background Cosmic Stardust & Micro-Twinkles ---
    const createSparkleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const cx = 24;
      const cy = 24;

      ctx.clearRect(0, 0, 48, 48);

      // Delicate radial starlight pinprick
      const radialGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      radialGlow.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
      radialGlow.addColorStop(0.22, 'rgba(255, 255, 255, 0.55)');
      radialGlow.addColorStop(0.55, 'rgba(224, 242, 254, 0.12)');
      radialGlow.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ultra-faint, 1px thin micro-diffraction glint
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy); ctx.lineTo(cx + 16, cy);
      ctx.moveTo(cx, cy - 16); ctx.lineTo(cx, cy + 16);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const sparkleTex = createSparkleTexture();

    const HS_STARS_COUNT = 135;
    const hsPositions = new Float32Array(HS_STARS_COUNT * 3);
    const hsColors = new Float32Array(HS_STARS_COUNT * 3);
    const hsSizes = new Float32Array(HS_STARS_COUNT);
    const hsAlphas = new Float32Array(HS_STARS_COUNT);
    const hsSparkles = new Float32Array(HS_STARS_COUNT);
    const hsDrift = new Float32Array(HS_STARS_COUNT * 3);

    for (let k = 0; k < HS_STARS_COUNT; k++) {
      let x = 0, y = 0, z = 0;

      if (k < 45) {
        // High sky above both figures
        x = (Math.random() - 0.5) * 56.0;
        y = Math.random() * 16.0 + 14.5;
        z = (Math.random() - 0.5) * 16.0 - 10.0;
      } else if (k < 90) {
        // Far left cosmic sky
        x = -(Math.random() * 26.0 + 12.5);
        y = Math.random() * 18.0 + 4.0;
        z = (Math.random() - 0.5) * 18.0 - 10.0;
      } else {
        // Far right cosmic sky
        x = Math.random() * 26.0 + 12.5;
        y = Math.random() * 18.0 + 4.0;
        z = (Math.random() - 0.5) * 18.0 - 10.0;
      }

      hsPositions[k * 3] = x;
      hsPositions[k * 3 + 1] = y;
      hsPositions[k * 3 + 2] = z;

      // Soft natural celestial palette (pure white with faint sky-blue)
      if (Math.random() > 0.65) {
        hsColors[k * 3] = 0.90;
        hsColors[k * 3 + 1] = 0.96;
        hsColors[k * 3 + 2] = 1.0;
      } else {
        hsColors[k * 3] = 1.0;
        hsColors[k * 3 + 1] = 1.0;
        hsColors[k * 3 + 2] = 1.0;
      }

      // Small subtle sizes and gentle transparent opacities
      hsSizes[k] = Math.random() * 1.6 + 1.2;
      hsAlphas[k] = Math.random() * 0.32 + 0.16;
      hsSparkles[k] = Math.random();
      hsDrift[k * 3] = (Math.random() - 0.5) * 0.25;
      hsDrift[k * 3 + 1] = Math.random() * 0.20 + 0.08;
      hsDrift[k * 3 + 2] = (Math.random() - 0.5) * 0.20;
    }

    const handshakeStarsGeo = new THREE.BufferGeometry();
    handshakeStarsGeo.setAttribute('position', new THREE.BufferAttribute(hsPositions, 3));
    handshakeStarsGeo.setAttribute('aColor', new THREE.BufferAttribute(hsColors, 3));
    handshakeStarsGeo.setAttribute('aSize', new THREE.BufferAttribute(hsSizes, 1));
    handshakeStarsGeo.setAttribute('aAlpha', new THREE.BufferAttribute(hsAlphas, 1));
    handshakeStarsGeo.setAttribute('aSparkle', new THREE.BufferAttribute(hsSparkles, 1));
    handshakeStarsGeo.setAttribute('aDrift', new THREE.BufferAttribute(hsDrift, 3));

    const handshakeStarsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uTexture: { value: sparkleTex }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform float uPixelRatio;

        attribute float aSize;
        attribute vec3 aColor;
        attribute float aAlpha;
        attribute float aSparkle;
        attribute vec3 aDrift;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;

          // Slow, organic, subtle celestial breathing
          float tw = 0.45 + 0.55 * sin(uTime * (1.1 + aSparkle * 1.5) + aSparkle * 6.28);
          float microGlint = pow(max(0.0, sin(uTime * 0.8 + aSparkle * 7.0)), 8.0) * 0.28;
          vAlpha = uOpacity * aAlpha * clamp(tw + microGlint, 0.0, 1.0);

          // Subtle floating drift
          vec3 pos = position + vec3(
            sin(uTime * 0.3 + aSparkle * 4.0) * aDrift.x,
            cos(uTime * 0.4 + aSparkle * 5.0) * aDrift.y,
            sin(uTime * 0.3 + aSparkle * 3.0) * aDrift.z
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depth = -mvPosition.z;
          float pSize = aSize * (1.0 + microGlint * 0.2);
          // Strictly clamped to tiny, delicate starlight pinpricks (1.0px to 3.2px)
          gl_PointSize = clamp(pSize * (20.0 / max(10.0, depth)) * uPixelRatio, 1.0, 3.2);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          if (tex.a < 0.02) discard;
          gl_FragColor = vec4(vColor, tex.a * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const handshakeStarsMesh = new THREE.Points(handshakeStarsGeo, handshakeStarsMat);
    scene.add(handshakeStarsMesh);

    // --- 6. Mouse Parallax Interaction ---
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- 7. Resize Handler ---
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
      handshakeStarsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
    };

    window.addEventListener('resize', onResize);

    // --- 8. Animation Loop ---
    let animId: number;
    let time = 0;
    let transformProgress = 0; // 0 = sunrise dawn, 1 = fully transformed hero
    let currentScroll = 0;     // Smoothed scroll progress (0.0 to 1.0)
    let hasNotifiedComplete = false;

    const animate = () => {
      time += 0.016;
      particleMaterial.uniforms.uTime.value = time;
      handshakeStarsMat.uniforms.uTime.value = time;

      const { loadProgress: lp, isTransformed: it, scrollProgress: sp, onTransformationComplete: otc } = stateRef.current;

      // Smooth scroll progress interpolation
      currentScroll += (sp - currentScroll) * 0.085;
      const s = currentScroll; // 0.0 (hero wave) -> 0.45 (disperse) -> 0.95 (sphere)

      // Dawn transformation progress
      if (it) {
        transformProgress += (1.0 - transformProgress) * 0.038;
        if (transformProgress > 0.985 && !hasNotifiedComplete) {
          hasNotifiedComplete = true;
          if (otc) otc();
        }
      } else {
        transformProgress = Math.min(0.28, lp * 0.28);
      }

      const tp = transformProgress;
      particleMaterial.uniforms.uDawnFade.value = tp;

      // Continuous Five-Stage Metamorphosis Factors based on total scroll progress s (0.0 to 1.0):
      // Stage 1 (Hero Sunrise & Waves): 0.00 to 0.08
      // Stage 2 (Services Hand + Gears): 0.08 to 0.24
      // Stage 3 (Process 01, 02, 03, 04 Numerals): 0.26 to 0.58
      // Stage 4 (Matrix Labs Beaker & Floating Bubbles): 0.60 to 0.77
      // Stage 5 (Footer Handshake & Dunes): 0.78 to 1.00

      // Morph into Services (Hand + Gears): begins at 0.05, fully formed by 0.10
      const servicesIn = THREE.MathUtils.smoothstep(s, 0.05, 0.10);
      // Morph out of Services: begins at 0.22, fully gone by 0.26
      const servicesOut = THREE.MathUtils.smoothstep(s, 0.22, 0.26);
      const servicesFactor = servicesIn * (1.0 - servicesOut);

      // Dispersion 1 (Hero -> Services): peaks around s = 0.075
      const dFactor1 = Math.sin(Math.min(1.0, Math.max(0.0, (s - 0.04) / 0.06)) * Math.PI) * (1.0 - servicesIn);

      // Morph into Process (Numerals 01..04): begins forming at 0.24, 100% fully formed by 0.28
      const processIn = THREE.MathUtils.smoothstep(s, 0.24, 0.28);
      // Morph out of Process: begins at 0.56, fully gone by 0.61
      const processOut = THREE.MathUtils.smoothstep(s, 0.56, 0.61);
      const processFactor = processIn * (1.0 - processOut);

      // Dispersion 2 (Services -> Process): peaks at s = 0.25
      const dFactor2 = Math.sin(Math.min(1.0, Math.max(0.0, (s - 0.21) / 0.06)) * Math.PI) * 0.95;

      // Morph into Matrix Labs (Beaker & Bubbles): begins forming at 0.58, 100% fully formed by 0.63
      const labsIn = THREE.MathUtils.smoothstep(s, 0.58, 0.63);
      // Morph out of Matrix Labs: begins at 0.75, fully gone by 0.80
      const labsOut = THREE.MathUtils.smoothstep(s, 0.75, 0.80);
      const labsFactor = labsIn * (1.0 - labsOut);

      // Dispersion 3 (Process -> Matrix Labs): peaks at s = 0.59
      const dFactor3 = Math.sin(Math.min(1.0, Math.max(0.0, (s - 0.55) / 0.08)) * Math.PI) * 0.95;

      // Morph into Footer Handshake (Two People Shaking Hands on Dunes): begins at 0.77, 100% fully formed by 0.83
      const handshakeIn = THREE.MathUtils.smoothstep(s, 0.77, 0.83);

      // Dispersion 4 (Matrix Labs -> Handshake): peaks at s = 0.78
      const dFactor4 = Math.sin(Math.min(1.0, Math.max(0.0, (s - 0.74) / 0.08)) * Math.PI) * 1.05;

      particleMaterial.uniforms.uSphereFade.value = Math.max(servicesFactor, processFactor, labsFactor, handshakeIn);
      handshakeStarsMat.uniforms.uOpacity.value = handshakeIn;

      // Camera Glide across all five stages:
      // Hero: (0, 10.8, 48.0) looking at (0, -2.8, 0)
      // Services: (0, 1.5, 38.0) looking at (0, 1.2, 0)
      // Process: (0, 1.8, 36.0) looking at (0, 1.8, 0)
      // Matrix Labs: (0, 1.2, 36.0) looking at (0, 1.2, 0)
      // Footer Handshake: (0, 3.2, 43.0) looking at (0, 2.4, 0)
      const baseCamY = THREE.MathUtils.lerp(3.2, 10.8, tp);
      const baseCamZ = THREE.MathUtils.lerp(42.0, 48.0, tp);
      const baseLookY = THREE.MathUtils.lerp(-1.0, -2.8, tp);

      let targetCamY = THREE.MathUtils.lerp(baseCamY, 1.5, servicesIn);
      let targetCamZ = THREE.MathUtils.lerp(baseCamZ, 38.0, servicesIn);
      let targetLookY = THREE.MathUtils.lerp(baseLookY, 1.2, servicesIn);

      targetCamY = THREE.MathUtils.lerp(targetCamY, 1.8, processIn);
      targetCamZ = THREE.MathUtils.lerp(targetCamZ, 36.0, processIn);
      targetLookY = THREE.MathUtils.lerp(targetLookY, 1.8, processIn);

      targetCamY = THREE.MathUtils.lerp(targetCamY, 1.2, labsIn);
      targetCamZ = THREE.MathUtils.lerp(targetCamZ, 36.0, labsIn);
      targetLookY = THREE.MathUtils.lerp(targetLookY, 1.2, labsIn);

      targetCamY = THREE.MathUtils.lerp(targetCamY, 3.2, handshakeIn);
      targetCamZ = THREE.MathUtils.lerp(targetCamZ, 43.0, handshakeIn);
      targetLookY = THREE.MathUtils.lerp(targetLookY, 2.4, handshakeIn);

      camera.position.x += (mouseX * 2.8 - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, targetLookY, 0);

      // Sun Ascent: exits quickly during early scroll so it is gone before Services
      const dawnSunY = THREE.MathUtils.lerp(-3.5, 15.5, tp);
      const sunElevation = THREE.MathUtils.lerp(dawnSunY, 70.0, s * 6.0);
      sunGroup.position.set(0, sunElevation, -34.0);

      // Sun bloom and fade as it exits the screen
      const sunScale = THREE.MathUtils.lerp(15.0, 32.0, tp);
      sunSprite.scale.set(sunScale, sunScale, 1.0);
      const sunFadeOut = Math.max(0.0, 1.0 - s * 12.0);
      sunMat.opacity = THREE.MathUtils.lerp(0.9, 0.25, tp) * sunFadeOut;
      beamMat.opacity = THREE.MathUtils.lerp(0.95, 0.08, tp) * sunFadeOut;

      // Concentric rings expand and fade
      const ringsScale = THREE.MathUtils.lerp(1.0, 1.6 + s * 2.0, tp);
      ringsGroup.scale.set(ringsScale, ringsScale, 1.0);
      ringMeshes.forEach((mesh, idx) => {
        const baseOp = Math.max(0.04, 0.22 - idx * 0.02);
        (mesh.material as THREE.LineBasicMaterial).opacity = baseOp * (1.0 - tp * 0.75) * sunFadeOut;
      });

      // --- Morphing: Mountain Valley -> Services Hand/Gears -> Process 01, 02, 03, 04 Numerals ---
      const pPos = posAttr.array as Float32Array;
      const pCol = colAttr.array as Float32Array;

      // Responsive sizing & positioning for the Hand + Gears sculpture
      // Desktop: smaller (~0.54 scale) and shifted to the left (-10.5 on X)
      // Mobile: centered (0.0 on X), scaled down (~0.23), and elevated into the upper half (offsetY = 5.2)
      // so it leaves ample breathing room for the services deck in the lower half
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      particleMaterial.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0;

      const sculptScale = isMobile 
        ? 0.34
        : (isTablet ? 0.36 : 0.42);
      const sculptOffsetX = isMobile ? 0.0 : (isTablet ? -9.5 : -14.2);
      const sculptOffsetY = isMobile ? 3.4 : 0.5;

      const labsScale = isMobile 
        ? 0.30 
        : (isTablet ? 0.36 : 0.44);
      const labsOffsetX = isMobile ? 0.0 : (isTablet ? -9.5 : -14.2);
      const labsOffsetY = isMobile ? 3.6 : 0.4;

      // Volumetric Hand + Rotating Interlocking Gears + Floating Stars Animation
      for (let r = 0; r < ROWS; r++) {
        const zNorm = r / (ROWS - 1);
        const z = Z_START + zNorm * (Z_END - Z_START);

        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          const idx = i * 3;
          const x = (c / (COLS - 1) - 0.5) * X_SPAN;

          // 1. Initial Sunrise Ridge Topology
          const valleyNorm = Math.abs(x) / (X_SPAN * 0.5);
          const ridgeHeight = Math.pow(valleyNorm, 1.5) * 15.0;
          const ridgeNoise = Math.sin(x * 0.14) * 2.2;
          const ySunrise = -8.2 + ridgeHeight + ridgeNoise - (1.0 - zNorm) * 3.2;

          // 2. Transformed Hero Wave Terrain
          const wave1 = Math.sin(x * 0.052 + z * 0.042 + time * 0.55) * 3.6;
          const wave2 = Math.cos(x * 0.034 - z * 0.062 + time * 0.45) * 2.4;
          const wave3 = Math.sin(x * 0.088 + time * 0.75) * 1.2;
          const yHero = -7.4 + (wave1 + wave2 + wave3) * (0.35 + zNorm * 0.65);

          // Morphed terrain point
          const yTerrain = THREE.MathUtils.lerp(ySunrise, yHero, tp);

          // 3. Volumetric Hand + Rotating Gears + Floating Stars Target
          const bIdx = i * 6;
          const rawSx = sculptureTarget[bIdx];
          const rawSy = sculptureTarget[bIdx + 1];
          const rawSz = sculptureTarget[bIdx + 2];
          const comp = sculptureTarget[bIdx + 3];
          const gcx = sculptureTarget[bIdx + 4];
          const gcy = sculptureTarget[bIdx + 5];

          let targetX = rawSx;
          let targetY = rawSy;
          let targetZ = rawSz;

          if (comp === 1) {
            // Main gear: rotates clockwise around its center
            const angle = time * 0.72;
            const cA = Math.cos(angle);
            const sA = Math.sin(angle);
            const dx = rawSx - gcx;
            const dy = rawSy - gcy;
            targetX = gcx + (dx * cA - dy * sA);
            targetY = gcy + (dx * sA + dy * cA);
          } else if (comp === 2) {
            // Secondary gear: rotates counter-clockwise to interlock
            const angle = -time * 0.72 * 1.3506;
            const cA = Math.cos(angle);
            const sA = Math.sin(angle);
            const dx = rawSx - gcx;
            const dy = rawSy - gcy;
            targetX = gcx + (dx * cA - dy * sA);
            targetY = gcy + (dx * sA + dy * cA);
          } else if (comp === 3) {
            // Floating stars: twinkle, pulse and subtle bob
            const pulse = 1.0 + Math.sin(time * 3.2 + i * 0.3) * 0.06;
            targetX *= pulse;
            targetY *= pulse;
            targetZ += Math.sin(time * 2.2 + i * 0.5) * 0.35;
          } else {
            // Hand: organic gentle levitation / breathing
            targetY += Math.sin(time * 1.4 + rawSx * 0.12) * 0.22;
          }

          // Gentle 3D perspective wobble to showcase volumetric depth
          const yaw = Math.sin(time * 0.35) * 0.12;
          const cosYaw = Math.cos(yaw);
          const sinYaw = Math.sin(yaw);
          const rawSculptX = targetX * cosYaw - targetZ * sinYaw;
          const rawSculptZ = targetX * sinYaw + targetZ * cosYaw;
          const rawSculptY = targetY;

          // Scaled down & positioned to left on desktop, centered on mobile
          const sculptX = rawSculptX * sculptScale + sculptOffsetX;
          const sculptY = rawSculptY * sculptScale + sculptOffsetY;
          const sculptZ = rawSculptZ * sculptScale;

          // 4. Process Target Coordinates (01, 02, 03, 04)
          let procX = 0, procY = 0, procZ = 0;
          let stepId = 1;

          if (processTarget && processTarget.length > 0) {
            const pIdx = i * 16;
            if (!isMobile) {
              procX = processTarget[pIdx];
              procY = processTarget[pIdx + 1];
              procZ = processTarget[pIdx + 2];
              stepId = Math.round(processTarget[pIdx + 3]);
            } else {
              // Mobile morph between 01, 02, 03, 04 across s = [0.28, 0.56]
              let mFrom = 4, mTo = 4, morphT = 0;
              if (s < 0.35) {
                mFrom = 4; mTo = 4; morphT = 0; stepId = 1;
              } else if (s < 0.42) {
                mFrom = 4; mTo = 7; morphT = (s - 0.35) / 0.07; stepId = morphT > 0.5 ? 2 : 1;
              } else if (s < 0.49) {
                mFrom = 7; mTo = 10; morphT = (s - 0.42) / 0.07; stepId = morphT > 0.5 ? 3 : 2;
              } else {
                mFrom = 10; mTo = 13; morphT = Math.min(1.0, (s - 0.49) / 0.07); stepId = morphT > 0.5 ? 4 : 3;
              }
              const smoothT = Math.min(1.0, Math.max(0.0, morphT * morphT * (3 - 2 * morphT)));
              procX = processTarget[pIdx + mFrom] + (processTarget[pIdx + mTo] - processTarget[pIdx + mFrom]) * smoothT;
              procY = processTarget[pIdx + mFrom + 1] + (processTarget[pIdx + mTo + 1] - processTarget[pIdx + mFrom + 1]) * smoothT;
              procZ = processTarget[pIdx + mFrom + 2] + (processTarget[pIdx + mTo + 2] - processTarget[pIdx + mFrom + 2]) * smoothT;

              // Mobile adjustments for Process numerals: sharp, legible, and elevated
              procX = procX * 0.74;
              procY = procY * 0.74 + 3.4;
              procZ = procZ * 0.74;
            }
          }

          // 5. Matrix Labs Target Coordinates (Laboratory Beaker & Bubbling Ascent)
          let labX = 0, labY = 0, labZ = 0;
          if (labsTarget && labsTarget.length > 0) {
            const lIdx = i * 6;
            const rawLx = labsTarget[lIdx];
            const rawLy = labsTarget[lIdx + 1];
            const rawLz = labsTarget[lIdx + 2];
            const lComp = labsTarget[lIdx + 3];
            const lParam1 = labsTarget[lIdx + 4]; // col 4 = bubble center X
            const lParam2 = labsTarget[lIdx + 5]; // col 5 = bubble center Y

            if (lComp === 0) {
              // Outer flask glass contour, rim & neck: subtle luminous breathing
              const shimmer = Math.sin(time * 1.8 + rawLy * 0.25) * 0.12;
              labX = rawLx;
              labY = rawLy + shimmer;
              labZ = rawLz;
            } else if (lComp === 1) {
              // Inner liquid volume & wavy meniscus: effervescent fluid undulation
              const wave = Math.sin(rawLx * 0.45 + time * 2.2) * 0.35 + Math.cos(rawLz * 0.5 + time * 1.8) * 0.22;
              labX = rawLx;
              labY = rawLy + wave;
              labZ = rawLz;
            } else {
              // Floating Bubbles: continuous upward ascent, popping at apex, and repeating
              const bId = Math.max(0, Math.min(3, Math.round(lComp) - 2));
              const phases = [0.0, 0.32, 0.64, 0.88];
              const bPhase = phases[bId];
              const bubbleSpeed = 0.38;
              const cycle = (time * bubbleSpeed + bPhase) % 1.0;

              // Relative coordinate within the bubble sphere
              const relX = rawLx - lParam1;
              const relY = rawLy - lParam2;
              const relZ = rawLz;

              // Bubbles originate within liquid (-4.0) and float up past the rim into open air (28.0)
              const spawnY = -4.0;
              const popY = 28.0;
              const riseY = spawnY + cycle * (popY - spawnY);

              // Fluid buoyant sinusoidal wobble as bubble ascends
              const sway = Math.sin(cycle * Math.PI * 4.0 + bId * 1.5) * 0.75;
              const curCenterX = lParam1 + sway;

              // Bubble scaling & bursting animation
              let bScale = 0.80 + cycle * 0.50;
              let bDisp = 0.0;
              if (cycle > 0.82) {
                const popT = (cycle - 0.82) / 0.18;
                bScale += popT * 2.8;
                bDisp = popT * 4.0;
              }

              labX = curCenterX + relX * bScale + (relX >= 0 ? bDisp : -bDisp);
              labY = riseY + relY * bScale + (relY >= 0 ? bDisp : -bDisp);
              labZ = relZ * bScale;
            }

            // 3D perspective rotation around Y axis to give volumetric depth
            const labYaw = Math.sin(time * 0.32) * 0.14;
            const cLab = Math.cos(labYaw);
            const sLab = Math.sin(labYaw);
            const rotatedLabX = labX * cLab - labZ * sLab;
            const rotatedLabZ = labX * sLab + labZ * cLab;

            labX = rotatedLabX * labsScale + labsOffsetX;
            labY = labY * labsScale + labsOffsetY;
            labZ = rotatedLabZ * labsScale;
          }

          // 6. Footer Handshake Target Coordinates (Two People Shaking Hands on Dunes)
          let handX = 0, handY = 0, handZ = 0;
          if (handshakeTarget && handshakeTarget.length > 0) {
            const hIdx = i * 4;
            const rawHx = handshakeTarget[hIdx];
            const rawHy = handshakeTarget[hIdx + 1];
            const rawHz = handshakeTarget[hIdx + 2];
            const hComp = handshakeTarget[hIdx + 3];

            if (hComp === 0) {
              // People: gentle starlight breathing & organic micro-shimmer
              const breathe = Math.sin(time * 1.8 + i * 0.15) * 0.08;
              handX = rawHx;
              handY = rawHy + breathe;
              handZ = rawHz;
            } else {
              // Dunes: subtle flowing wave across the horizon
              const duneWave = Math.sin(rawHx * 0.35 + time * 1.4) * 0.12 + Math.cos(rawHz * 0.4 + time * 1.1) * 0.08;
              handX = rawHx;
              handY = rawHy + duneWave;
              handZ = rawHz;
            }

            // Mobile vs desktop scaling and positioning
            const handScale = isMobile ? 0.72 : (isTablet ? 0.88 : 1.0);
            const handOffsetY = isMobile ? 5.2 : (isTablet ? 4.2 : 3.4);

            handX = handX * handScale;
            handY = handY * handScale + handOffsetY;
            handZ = handZ * handScale;
          }

          // Dispersion Offsets
          const dispX1 = disperseVectors[idx] * dFactor1 * 1.1;
          const dispY1 = disperseVectors[idx + 1] * dFactor1 * 1.1;
          const dispZ1 = disperseVectors[idx + 2] * dFactor1 * 1.1;

          const dispX2 = disperseVectors[idx] * dFactor2 * 0.9;
          const dispY2 = disperseVectors[idx + 1] * dFactor2 * 0.9 + Math.sin(time * 2.5 + i) * dFactor2 * 0.8;
          const dispZ2 = disperseVectors[idx + 2] * dFactor2 * 0.9;

          const dispX3 = disperseVectors[idx] * dFactor3 * 0.9;
          const dispY3 = disperseVectors[idx + 1] * dFactor3 * 0.9 + Math.sin(time * 2.5 + i) * dFactor3 * 0.8;
          const dispZ3 = disperseVectors[idx + 2] * dFactor3 * 0.9;

          const dispX4 = disperseVectors4[idx] * dFactor4 * 1.05;
          const dispY4 = disperseVectors4[idx + 1] * dFactor4 * 1.05 + Math.sin(time * 2.2 + i * 0.2) * dFactor4 * 0.8;
          const dispZ4 = disperseVectors4[idx + 2] * dFactor4 * 1.05;

          // 7. Final Composite Interpolation: Terrain -> Services -> Process -> Matrix Labs -> Footer Handshake
          const midX = THREE.MathUtils.lerp(x, sculptX, servicesIn) + dispX1;
          const midY = THREE.MathUtils.lerp(yTerrain, sculptY, servicesIn) + dispY1;
          const midZ = THREE.MathUtils.lerp(z, sculptZ, servicesIn) + dispZ1;

          const pWave = Math.sin(time * 2.2 + procX * 0.4 + i * 0.1) * 0.08;
          const procInterpX = THREE.MathUtils.lerp(midX, procX, processIn) + dispX2;
          const procInterpY = THREE.MathUtils.lerp(midY, procY + pWave, processIn) + dispY2;
          const procInterpZ = THREE.MathUtils.lerp(midZ, procZ, processIn) + dispZ2;

          const labsInterpX = THREE.MathUtils.lerp(procInterpX, labX, labsIn) + dispX3;
          const labsInterpY = THREE.MathUtils.lerp(procInterpY, labY, labsIn) + dispY3;
          const labsInterpZ = THREE.MathUtils.lerp(procInterpZ, labZ, labsIn) + dispZ3;

          const finalX = THREE.MathUtils.lerp(labsInterpX, handX, handshakeIn) + dispX4;
          const finalY = THREE.MathUtils.lerp(labsInterpY, handY, handshakeIn) + dispY4;
          const finalZ = THREE.MathUtils.lerp(labsInterpZ, handZ, handshakeIn) + dispZ4;

          pPos[idx] = finalX;
          pPos[idx + 1] = finalY;
          pPos[idx + 2] = finalZ;

        }
      }

      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      starGlyphTex.dispose();
      sunTex.dispose();
      sunMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      ringMeshes.forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      handshakeStarsGeo.dispose();
      handshakeStarsMat.dispose();
      sparkleTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
        background: '#000000'
      }}
    />
  );
};
