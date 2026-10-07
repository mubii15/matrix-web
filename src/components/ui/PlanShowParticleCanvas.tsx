import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PlanShowParticleCanvasProps {
  currentStep: number;
  isCompleted?: boolean;
}

export const PlanShowParticleCanvas: React.FC<PlanShowParticleCanvasProps> = ({
  currentStep,
  isCompleted = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef(currentStep);
  const completedRef = useRef(isCompleted);

  useEffect(() => {
    stepRef.current = currentStep;
    completedRef.current = isCompleted;
  }, [currentStep, isCompleted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); // Pure obsidian

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 38);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- 2. ASCII Star Glyph Texture (twinkling '.', '*', '+') as on Homepage ---
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 192;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#000000';
      sCtx.fillRect(0, 0, 192, 64);
      sCtx.font = 'bold 36px "JetBrains Mono", ui-monospace, monospace';
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

    // --- 3. Crisp Unified Particle Mesh ---
    // 3,800 total precision particles:
    //  - 3,200 shape particles (morph dynamically according to step)
    //  - 600 twinkling upper celestial star glyphs
    const SHAPE_COUNT = 3200;
    const STARS_COUNT = 600;
    const TOTAL_POINTS = SHAPE_COUNT + STARS_COUNT;

    const positions = new Float32Array(TOTAL_POINTS * 3);
    const targetPositions = new Float32Array(SHAPE_COUNT * 3);
    const sizes = new Float32Array(TOTAL_POINTS);
    const opacities = new Float32Array(TOTAL_POINTS);
    const sparkles = new Float32Array(TOTAL_POINTS);
    const types = new Float32Array(TOTAL_POINTS); // 0 = shape, 1 = star glyph

    // Initialize Starfield (upper sky and deep perimeter)
    for (let s = 0; s < STARS_COUNT; s++) {
      const idx = SHAPE_COUNT + s;
      positions[idx * 3 + 0] = (Math.random() - 0.5) * 140;
      positions[idx * 3 + 1] = Math.random() * 45 - 5;
      positions[idx * 3 + 2] = -15 - Math.random() * 50;
      sizes[idx] = Math.random() * 2.2 + 1.4;
      opacities[idx] = Math.random() * 0.55 + 0.25;
      sparkles[idx] = Math.random();
      types[idx] = 1.0;
    }

    // Helper: generate step-specific 3D target geometries
    // CRITICAL: We position the primary mass of particles to frame the viewport
    // (undulating horizon below, background depth behind, lateral flanks),
    // NEVER a blinding dense clump right across the center where form inputs sit!
    const computeShapePositions = (step: number, out: Float32Array) => {
      for (let i = 0; i < SHAPE_COUNT; i++) {
        const u = i / SHAPE_COUNT;
        const i3 = i * 3;

        switch (step) {
          // STEP 1: HOMEPAGE UNDULATING TERRAIN HORIZON & VALLEY
          // Exactly matches the Matrix homepage hero terrain wave!
          case 1: {
            const cols = 80;
            const rows = 40;
            const r = Math.floor(i / cols);
            const c = i % cols;
            const xNorm = c / (cols - 1);
            const zNorm = r / (rows - 1);
            const x = (xNorm - 0.5) * 88.0;
            const z = -45.0 + zNorm * 40.0;
            // Valley in center: dip y lower in the middle so form text has complete clear breathing space!
            const valley = Math.sin(xNorm * Math.PI);
            const y = -11.0 + Math.sin(x * 0.15 + z * 0.18) * 2.2 - valley * 1.8;
            out[i3 + 0] = x;
            out[i3 + 1] = y;
            out[i3 + 2] = z;
            break;
          }

          // STEP 2: ROTATING 3D WIREFRAME GLOBE & LATITUDE-LONGITUDE RINGS (Location)
          case 2: {
            const ringCount = 14;
            const ringIdx = i % ringCount;
            const ptInRing = Math.floor(i / ringCount);
            const totalInRing = Math.floor(SHAPE_COUNT / ringCount);
            const theta = (ptInRing / totalInRing) * Math.PI * 2;
            const radius = 17.5;
            
            // Half rings are horizontal latitudes, half are vertical meridians
            if (ringIdx < 7) {
              const latPhi = ((ringIdx + 1) / 8 - 0.5) * Math.PI * 0.85;
              const rRing = radius * Math.cos(latPhi);
              const yRing = radius * Math.sin(latPhi);
              out[i3 + 0] = rRing * Math.cos(theta);
              out[i3 + 1] = yRing - 2.0;
              out[i3 + 2] = -12.0 + rRing * Math.sin(theta);
            } else {
              const longAngle = ((ringIdx - 7) / 7) * Math.PI;
              const xLocal = radius * Math.cos(theta);
              const yLocal = radius * Math.sin(theta);
              out[i3 + 0] = xLocal * Math.cos(longAngle);
              out[i3 + 1] = yLocal - 2.0;
              out[i3 + 2] = -12.0 + xLocal * Math.sin(longAngle);
            }
            break;
          }

          // STEP 3: SYNCHRONIZED AUTONOMOUS DRONE SWARM (Formation flight & Chevron wave)
          case 3: {
            // Twin high-altitude chevron formations flying in tandem
            const isLeft = i % 2 === 0;
            const tier = Math.floor(i / 2) / (SHAPE_COUNT / 2);
            const spread = tier * 42.0;
            const backSweep = tier * 28.0;
            const waveY = Math.sin(tier * Math.PI * 3.0) * 3.5;
            const side = isLeft ? -1 : 1;

            out[i3 + 0] = side * (spread * 0.85 + 4.0);
            out[i3 + 1] = -5.0 + waveY + (tier - 0.5) * 12.0;
            out[i3 + 2] = -22.0 + backSweep * 0.6;
            break;
          }

          // STEP 4: FLUID INFINITY MOBIUS RIBBON / CHOREOGRAPHY FLOW (Vision)
          case 4: {
            const t = u * Math.PI * 4;
            const R = 18.0;
            const widthOffset = ((i % 16) / 15 - 0.5) * 3.2;
            const x = (R + widthOffset * Math.cos(t / 2)) * Math.cos(t);
            const y = (R + widthOffset * Math.cos(t / 2)) * Math.sin(t) * 0.42 - 1.5;
            const z = -14.0 + widthOffset * Math.sin(t / 2) * 5.0;
            out[i3 + 0] = x * 0.95;
            out[i3 + 1] = y;
            out[i3 + 2] = z;
            break;
          }

          // STEP 5: TIERED ARENA / STADIUM AMPHITHEATER BOWL (Audience & Scale)
          case 5: {
            const tiers = 18;
            const tier = Math.floor(i / (SHAPE_COUNT / tiers));
            const inTier = i % Math.floor(SHAPE_COUNT / tiers);
            const totalInTier = Math.floor(SHAPE_COUNT / tiers);
            const arc = (inTier / totalInTier - 0.5) * Math.PI * 1.35;
            const rTier = 16.0 + tier * 1.6;
            const yTier = -10.0 + tier * 0.85;
            out[i3 + 0] = Math.sin(arc) * rTier;
            out[i3 + 1] = yTier;
            out[i3 + 2] = -18.0 + (1.0 - Math.cos(arc)) * rTier * 0.85;
            break;
          }

          // STEP 6: LOGARITHMIC GOLDEN SPIRAL / PRECISION DIAL (Budget)
          case 6: {
            const spiralTurns = 5.5;
            const theta = u * Math.PI * 2 * spiralTurns;
            const rSpiral = 3.5 + Math.pow(u, 0.75) * 22.0;
            const zSpiral = -12.0 + (u - 0.5) * 18.0;
            out[i3 + 0] = Math.cos(theta) * rSpiral * 1.15;
            out[i3 + 1] = Math.sin(theta) * rSpiral * 0.38 - 2.0;
            out[i3 + 2] = zSpiral;
            break;
          }

          // STEP 7: TRANSMISSION BEAM ARRAY & DUAL VECTOR ARCS (Contact / Coordinates)
          case 7: {
            const isPillar = i % 5 === 0;
            if (isPillar) {
              // Vertical transmission beam column
              const by = (i / SHAPE_COUNT) * 38.0 - 18.0;
              const br = 1.2 + Math.sin(by * 0.3) * 0.4;
              const ba = i * 0.5;
              out[i3 + 0] = Math.cos(ba) * br;
              out[i3 + 1] = by;
              out[i3 + 2] = -15.0;
            } else {
              // Parabolic radar dish arcs flanking sides
              const side = i % 2 === 0 ? -1 : 1;
              const angle = (u * Math.PI * 3.0);
              const rDish = 12.0 + (i % 24) * 0.4;
              out[i3 + 0] = side * (16.0 + Math.cos(angle) * 7.0);
              out[i3 + 1] = Math.sin(angle) * rDish * 0.35;
              out[i3 + 2] = -14.0 + Math.sin(angle * 2) * 4.0;
            }
            break;
          }

          // STEP 8: ASCENSION DATA VAULT / CUBIC FLOATING ARCHITECTURE (Files & Brief)
          case 8: {
            // Bounding cage cube coordinates
            const cubeSize = 22.0;
            const edge = i % 12;
            const tEdge = (i / SHAPE_COUNT);
            const h = cubeSize / 2;
            let cx = 0, cy = 0, cz = 0;
            if (edge < 4) {
              cx = (tEdge - 0.5) * cubeSize;
              cy = edge % 2 === 0 ? -h : h;
              cz = edge < 2 ? -h : h;
            } else if (edge < 8) {
              cx = edge % 2 === 0 ? -h : h;
              cy = (tEdge - 0.5) * cubeSize;
              cz = edge < 6 ? -h : h;
            } else {
              cx = edge % 2 === 0 ? -h : h;
              cy = edge < 10 ? -h : h;
              cz = (tEdge - 0.5) * cubeSize;
            }
            out[i3 + 0] = cx;
            out[i3 + 1] = cy - 1.0;
            out[i3 + 2] = -16.0 + cz;
            break;
          }

          // STEP 9: ROTATING 3D VOLUMETRIC MATRIX EMBLEM SPHERE (Final Review)
          case 9: {
            const phi = Math.acos(1.0 - 2.0 * (i + 0.5) / SHAPE_COUNT);
            const theta = 2.0 * Math.PI * i / 1.6180339887;
            const rSph = 15.0;
            out[i3 + 0] = rSph * Math.sin(phi) * Math.cos(theta);
            out[i3 + 1] = rSph * Math.cos(phi) - 1.0;
            out[i3 + 2] = -14.0 + rSph * Math.sin(phi) * Math.sin(theta);
            break;
          }

          // STEP 10: CELEBRATORY SUPERNOVA STAR BURST (Submission confirmed!)
          default: {
            const phi = Math.acos(Math.random() * 2.0 - 1.0);
            const theta = Math.random() * Math.PI * 2.0;
            const rBurst = 12.0 + Math.random() * 24.0;
            out[i3 + 0] = rBurst * Math.sin(phi) * Math.cos(theta);
            out[i3 + 1] = rBurst * Math.sin(phi) * Math.sin(theta) * 0.7;
            out[i3 + 2] = -12.0 + rBurst * Math.cos(phi);
            break;
          }
        }
      }
    };

    // Initialize initial shape target
    computeShapePositions(stepRef.current, targetPositions);
    for (let i = 0; i < SHAPE_COUNT; i++) {
      positions[i * 3 + 0] = targetPositions[i * 3 + 0] + (Math.random() - 0.5) * 2.0;
      positions[i * 3 + 1] = targetPositions[i * 3 + 1] + (Math.random() - 0.5) * 2.0;
      positions[i * 3 + 2] = targetPositions[i * 3 + 2] + (Math.random() - 0.5) * 2.0;
      sizes[i] = 1.35 + (i % 7) * 0.22;
      opacities[i] = 0.55 + (i % 5) * 0.08;
      sparkles[i] = Math.random();
      types[i] = 0.0;
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const opacAttr = new THREE.BufferAttribute(opacities, 1);
    const sparkAttr = new THREE.BufferAttribute(sparkles, 1);
    const typeAttr = new THREE.BufferAttribute(types, 1);

    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('aSize', sizeAttr);
    geometry.setAttribute('aOpacity', opacAttr);
    geometry.setAttribute('aSparkle', sparkAttr);
    geometry.setAttribute('aType', typeAttr);

    // --- 4. Custom Shader: Ultra-Crisp Starlight Nodes & ASCII Twinkles ---
    // Matches the exact mathematical shader formula of the Homepage
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uTime: { value: 0 },
        uStarTex: { value: starGlyphTex }
      },
      vertexShader: `
        uniform float uPixelRatio;
        uniform float uTime;

        attribute float aSize;
        attribute float aOpacity;
        attribute float aSparkle;
        attribute float aType;

        varying float vAlpha;
        varying float vType;
        varying float vSparkle;
        varying float vTwinkle;

        void main() {
          vType = aType;
          vSparkle = aSparkle;

          vec4 modelPos = modelMatrix * vec4(position, 1.0);
          vec4 viewPos = viewMatrix * modelPos;
          gl_Position = projectionMatrix * viewPos;

          float depth = max(6.0, -viewPos.z);

          // Harmonic twinkle calculation
          float tw = 0.5 + 0.5 * sin(uTime * 2.8 + aSparkle * 6.28);
          vTwinkle = tw;

          float alpha = aOpacity;
          if (aType > 0.5) {
            alpha *= (0.35 + 0.65 * tw);
            float pSize = aSize * (0.8 + 0.5 * tw);
            gl_PointSize = clamp(pSize * (26.0 / depth) * uPixelRatio, 1.2, 4.0);
          } else {
            // Shape particles: crisp, luminous, never blurry
            float pSize = aSize;
            gl_PointSize = clamp(pSize * (28.0 / depth) * uPixelRatio, 1.4, 4.2);
          }
          vAlpha = alpha;
        }
      `,
      fragmentShader: `
        uniform sampler2D uStarTex;
        uniform float uTime;

        varying float vAlpha;
        varying float vType;
        varying float vSparkle;
        varying float vTwinkle;

        void main() {
          if (vType > 0.5) {
            // ASCII STAR GLYPH ('.', '*', '+')
            float cell = 0.0;
            if (vTwinkle > 0.72) cell = 2.0;
            else if (vTwinkle > 0.38) cell = 1.0;
            else cell = 0.0;

            vec2 uv = gl_PointCoord;
            uv.x = (uv.x + cell) / 3.0;
            vec4 texCol = texture2D(uStarTex, uv);
            if (texCol.r < 0.1) discard;

            gl_FragColor = vec4(1.0, 1.0, 1.0, texCol.r * vAlpha * 0.85);
          } else {
            // PRECISION STARLIGHT NODE (Crisp solid white core + micro glow rim)
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            // Sharp gaussian starlight core (exp -dist^2 * 16.0)
            float core = exp(-dist * dist * 16.0);
            float rim = smoothstep(0.48, 0.16, dist) * 0.45;
            float shimmer = 0.90 + 0.20 * sin(uTime * 3.5 + vSparkle * 6.28);
            float shape = clamp((core + rim) * shimmer, 0.0, 1.0);

            gl_FragColor = vec4(1.0, 1.0, 1.0, shape * vAlpha);
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointsMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(pointsMesh);

    // --- 5. Faint Celestial Concentric Telemetry Rings (As seen in Homepage photo!) ---
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    const ringRadii = [12.0, 22.0, 34.0, 48.0, 64.0, 82.0];
    const ringMeshes: THREE.LineLoop[] = [];

    ringRadii.forEach((rad, idx) => {
      const SEGMENTS = 96;
      const pts = new Float32Array((SEGMENTS + 1) * 3);
      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        pts[s * 3 + 0] = Math.cos(theta) * rad;
        pts[s * 3 + 1] = Math.sin(theta) * rad * 0.42 - 4.0;
        pts[s * 3 + 2] = -22.0 + Math.sin(theta) * 4.0;
      }
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.max(0.04, 0.14 - idx * 0.018),
        blending: THREE.AdditiveBlending
      });
      const loop = new THREE.LineLoop(ringGeo, ringMat);
      ringsGroup.add(loop);
      ringMeshes.push(loop);
    });

    // --- 6. Telemetry Radar Markers & Crosshairs ---
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);

    // Faint vertical celestial needle at origin (homepage style)
    const needleGeo = new THREE.BufferGeometry();
    const needlePts = new Float32Array([0, -22, -18, 0, 28, -18]);
    needleGeo.setAttribute('position', new THREE.BufferAttribute(needlePts, 3));
    const needleMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    markerGroup.add(new THREE.Line(needleGeo, needleMat));

    // --- 7. Mouse Physics & Interactive Tilt ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 8. Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
    };
    window.addEventListener('resize', handleResize);

    // --- 9. Animation Loop ---
    let rafId: number;
    const clock = new THREE.Clock();
    let currentStepVal = -1;
    let morphStartTime = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      particleMaterial.uniforms.uTime.value = elapsed;

      const activeStep = completedRef.current ? 10 : stepRef.current;

      // When the form step changes, compute new distinct 3D target coordinates
      if (activeStep !== currentStepVal) {
        currentStepVal = activeStep;
        morphStartTime = elapsed;
        computeShapePositions(activeStep, targetPositions);
      }

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Gentle interactive tilt
      pointsMesh.rotation.y = elapsed * 0.04 + mouseX * 0.15;
      pointsMesh.rotation.x = Math.sin(elapsed * 0.03) * 0.05 + mouseY * 0.08;
      ringsGroup.rotation.y = elapsed * 0.015;

      // Morph shape particles smoothly towards new geometry
      const posArr = posAttr.array as Float32Array;
      const morphProgress = Math.min(1.0, (elapsed - morphStartTime) / 1.1);
      // Ease out cubic
      const speed = 0.05 + (1.0 - morphProgress) * 0.04;

      for (let i = 0; i < SHAPE_COUNT; i++) {
        const i3 = i * 3;
        const tx = targetPositions[i3 + 0];
        const ty = targetPositions[i3 + 1];
        const tz = targetPositions[i3 + 2];

        // Micro organic breathing drift
        const breath = Math.sin(elapsed * 1.8 + i * 0.12) * 0.08;

        posArr[i3 + 0] += (tx - posArr[i3 + 0]) * speed;
        posArr[i3 + 1] += (ty + breath - posArr[i3 + 1]) * speed;
        posArr[i3 + 2] += (tz - posArr[i3 + 2]) * speed;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      starGlyphTex.dispose();
      ringsGroup.clear();
      markerGroup.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#000000'
      }}
    />
  );
};
