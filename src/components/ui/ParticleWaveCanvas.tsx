import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ParticleWaveCanvas: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, High-Precision WebGL Renderer ---
    const scene = new THREE.Scene();
    // Deep obsidian navy void matching reference image
    scene.background = new THREE.Color('#01040a');

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    // Camera positioned at low angle looking across the mountain ridge
    camera.position.set(0, 11.5, 46.0);
    camera.lookAt(0, -3.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // --- 2. Construct Clean Topographic Contour Strands ---
    // In the reference image, the particle wave consists of clean, silky contour ribbons
    // forming sharp mountain peaks, with extreme shallow depth-of-field (macro bokeh)
    // in the foreground and a razor-sharp focal plane along the ridge.
    const STRANDS = 64;          // Parallel contour ribbons
    const PTS_PER_STRAND = 260;  // High point density along each strand for silky lines
    const GRID_COUNT = STRANDS * PTS_PER_STRAND; // ~16,640 ribbon points
    const AMBIENT_COUNT = 450;   // Isolated starry embers in upper space
    const TOTAL_POINTS = GRID_COUNT + AMBIENT_COUNT;

    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const sizes = new Float32Array(TOTAL_POINTS);
    const phases = new Float32Array(TOTAL_POINTS);
    const isBeacon = new Float32Array(TOTAL_POINTS); // 0 = clean contour dot, 1 = glowing beacon star

    // Precise color palette sampled directly from the reference image:
    const colWhite = new THREE.Color('#ffffff');
    const colCyanGlow = new THREE.Color('#38bdf8');
    const colElectricBlue = new THREE.Color('#2563eb');
    const colCobalt = new THREE.Color('#1d4ed8');
    const colDeepNavy = new THREE.Color('#071733');
    const colAbyss = new THREE.Color('#020617');

    const X_SPAN = 126.0;

    // Initialize Grid Points
    for (let s = 0; s < STRANDS; s++) {
      for (let p = 0; p < PTS_PER_STRAND; p++) {
        const i = s * PTS_PER_STRAND + p;
        const x = (p / (PTS_PER_STRAND - 1) - 0.5) * X_SPAN;
        
        // Strands distributed across depth Z:
        // Strand norm: -1.0 (distant background) to +1.0 (extreme close foreground)
        const strandNorm = (s / (STRANDS - 1)) * 2.0 - 1.0;
        
        // Base diagonal orientation in space: left-front to right-back
        const diagZ = -x * 0.35;
        const baseZ = diagZ + strandNorm * 16.0;
        const y = -6.0;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = baseZ;

        colors[i * 3] = colElectricBlue.r;
        colors[i * 3 + 1] = colElectricBlue.g;
        colors[i * 3 + 2] = colElectricBlue.b;

        sizes[i] = 1.8; // Clean, delicate pin-point dot
        phases[i] = Math.random() * Math.PI * 2;
        isBeacon[i] = 0.0;
      }
    }

    // Hand-picked prominent beacon positions along the mountain ridge & valley
    // (Matching the 6-8 distinct glowing stars in the reference image)
    const beaconIndices = [
      Math.floor(STRANDS * 0.45) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.43), // Peak 1 tip
      Math.floor(STRANDS * 0.50) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.54), // Peak 2 slope
      Math.floor(STRANDS * 0.65) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.49), // Central valley flare
      Math.floor(STRANDS * 0.75) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.36), // Foreground-left beacon
      Math.floor(STRANDS * 0.35) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.28), // Left ridge beacon
      Math.floor(STRANDS * 0.40) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.72), // Right ridge beacon
      Math.floor(STRANDS * 0.55) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.80), // Far-right beacon
      Math.floor(STRANDS * 0.60) * PTS_PER_STRAND + Math.floor(PTS_PER_STRAND * 0.52), // Mid-valley beacon
    ];

    for (const bIdx of beaconIndices) {
      if (bIdx < GRID_COUNT) {
        isBeacon[bIdx] = 1.0;
        sizes[bIdx] = 26.0;
      }
    }

    // Initialize Ambient Star Dust in upper space
    for (let a = 0; a < AMBIENT_COUNT; a++) {
      const idx = GRID_COUNT + a;
      const ax = (Math.random() - 0.5) * 140;
      const ay = Math.random() * 40 - 2;
      const az = (Math.random() - 0.5) * 65;

      positions[idx * 3] = ax;
      positions[idx * 3 + 1] = ay;
      positions[idx * 3 + 2] = az;

      const isStarBeacon = Math.random() > 0.94;
      const starCol = isStarBeacon ? colWhite : (Math.random() > 0.4 ? colCyanGlow : colCobalt);
      colors[idx * 3] = starCol.r;
      colors[idx * 3 + 1] = starCol.g;
      colors[idx * 3 + 2] = starCol.b;

      sizes[idx] = isStarBeacon ? 20.0 : 1.4;
      phases[idx] = Math.random() * Math.PI * 2;
      isBeacon[idx] = isStarBeacon ? 1.0 : 0.0;
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const colAttr = new THREE.BufferAttribute(colors, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const phaseAttr = new THREE.BufferAttribute(phases, 1);
    const beaconAttr = new THREE.BufferAttribute(isBeacon, 1);

    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('aColor', colAttr);
    geometry.setAttribute('aSize', sizeAttr);
    geometry.setAttribute('aPhase', phaseAttr);
    geometry.setAttribute('aIsBeacon', beaconAttr);

    // --- 3. Custom Optical Depth-of-Field & True Macro Bokeh Shader ---
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.5) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;

        attribute float aSize;
        attribute vec3 aColor;
        attribute float aPhase;
        attribute float aIsBeacon;

        varying vec3 vColor;
        varying float vCoC;       // Optical Circle of Confusion [0.0 = sharp, 1.0 = heavy bokeh]
        varying float vPulse;
        varying float vIsBeacon;

        void main() {
          vColor = aColor;
          vIsBeacon = aIsBeacon;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;

          // Camera Focal Distance:
          // Center mountain peaks sit right at view space z ~= -46.0
          // Foreground points sit at z ~= -26.0 (17+ units closer to lens -> large macro bokeh discs!)
          // Distant background points sit at z ~= -62.0 (softer distance blur)
          float focalPlane = -46.0;
          float viewDist = -viewPosition.z;
          float distToFocal = abs(viewPosition.z - focalPlane);

          // Photographic Circle of Confusion (CoC):
          // Scaled inversely by view distance (foreground blur is optically larger than background blur!)
          float coc = clamp((distToFocal / max(20.0, viewDist)) * 2.2, 0.0, 1.0);
          vCoC = coc;

          // Subtle luminous breathing pulse
          float pulse = 0.70 + 0.30 * sin(uTime * 3.6 + aPhase);
          vPulse = pulse;

          // Point sizing with true optical Circle of Confusion:
          // In-focus particles: Razor-sharp, delicate pinpoints (1.6 - 2.2 px).
          // Out-of-focus foreground particles: Expand into beautiful, large bokeh orbs (up to 36 px)!
          // Glowing beacon stars: Expanded quad for bloom halo and anamorphic streak.
          float pSize = aSize;
          if (aIsBeacon > 0.5) {
            pSize = (26.0 + coc * 26.0) * (0.85 + pulse * 0.25);
          } else {
            // Smooth bokeh expansion based on Circle of Confusion
            pSize = 1.8 + coc * 28.0;
          }

          // Perspective projection scaling
          float perspectiveScale = 46.0 / viewDist;
          gl_PointSize = max(1.2, pSize * perspectiveScale * uPixelRatio);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vCoC;
        varying float vPulse;
        varying float vIsBeacon;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);

          if (dist > 0.5) discard;

          float alpha = 0.0;
          vec3 finalColor = vColor;

          if (vIsBeacon > 0.5) {
            // --- GLOWING HERO BEACON STAR (BIOLUMINESCENT LIGHT EMBER) ---
            // 1. Intense blinding white pinpoint center
            float core = exp(-dist * 24.0) * 2.6;

            // 2. Soft luminous cyan bloom halo
            float halo = exp(-dist * 5.2) * 1.1;

            // 3. Horizontal anamorphic lens flare streak (characteristic of cinematic anamorphic glass)
            float streak = exp(-abs(coord.y) * 40.0) * exp(-abs(coord.x) * 3.2) * 0.85;

            float light = (core + halo + streak) * vPulse;

            // When beacon is out of focus in foreground, halo softens into a translucent bokeh orb
            if (vCoC > 0.15) {
              float bokehDisc = smoothstep(0.48, 0.12, dist) * (1.0 / (1.0 + vCoC * 2.8));
              light = mix(light, bokehDisc * 1.8, vCoC * 0.65);
            }

            alpha = clamp(light, 0.0, 1.0);
            // Core turns pure blinding white, outer aura holds electric cyan
            finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), clamp(core * 0.85, 0.0, 1.0));
          } else {
            // --- CLEAN CONTOUR FILAMENT PARTICLES WITH ENERGY-CONSERVING BOKEH ---
            if (vCoC < 0.12) {
              // IN-FOCUS (Center Mountain Ridge):
              // Razor-sharp, clean, anti-aliased pin-point dot with high-intensity center
              float sharpEdge = smoothstep(0.48, 0.20, dist);
              float pinPoint = exp(-dist * 16.0) * 1.0;
              alpha = clamp(sharpEdge + pinPoint, 0.0, 1.0);
            } else {
              // OUT-OF-FOCUS (Foreground Bokeh Orbs & Background Blur):
              // True camera lens aperture bokeh disc with subtle outer rim highlight
              float disc = smoothstep(0.48, 0.38, dist);
              float rim = smoothstep(0.35, 0.46, dist) * smoothstep(0.50, 0.46, dist) * 1.4;
              float bokehShape = disc * 0.65 + rim * 0.75;

              // ENERGY CONSERVATION:
              // As a point spreads into a large circle, its light energy spreads over a larger area.
              // This keeps foreground bokeh beautifully translucent and soft without blowing out into muddy blobs!
              float energyScale = 1.0 / (1.0 + vCoC * vCoC * 45.0);
              alpha = bokehShape * energyScale * 1.4;
            }
          }

          if (alpha < 0.012) discard;

          // Pure additive blending on dark obsidian background
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const waveGroup = new THREE.Group();
    const pointsMesh = new THREE.Points(geometry, customMaterial);
    waveGroup.add(pointsMesh);
    scene.add(waveGroup);

    // Initial slight diagonal tilt
    waveGroup.rotation.x = 0.025;

    // --- 4. Interactive Mouse Tracking ---
    let mouseNdcX = 0;
    let mouseNdcY = 0;
    let targetCameraX = 0;
    let targetCameraY = 11.5;

    const onMouseMove = (e: MouseEvent) => {
      mouseNdcX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNdcY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCameraX = mouseNdcX * 3.5;
      targetCameraY = 11.5 - mouseNdcY * 2.0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- 5. Resize Handler ---
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      customMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2.5);
    };

    window.addEventListener('resize', onResize);

    // --- 6. Animation Loop (Topological Mountain Ridge Harmonics) ---
    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.012;
      customMaterial.uniforms.uTime.value = time;

      // Smooth camera banking
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, -3.5, 0);

      waveGroup.rotation.y = Math.sin(time * 0.16) * 0.012;

      const pPos = posAttr.array as Float32Array;
      const pCol = colAttr.array as Float32Array;
      const pBeacon = beaconAttr.array as Float32Array;

      const mouseWorldX = mouseNdcX * 40;
      const mouseWorldZ = -mouseNdcY * 18;

      // Update positions & colors of wave grid
      for (let s = 0; s < STRANDS; s++) {
        // Strand normalized coordinate: -1.0 (distant back) to +1.0 (close foreground)
        const strandNorm = (s / (STRANDS - 1)) * 2.0 - 1.0;

        for (let p = 0; p < PTS_PER_STRAND; p++) {
          const i = s * PTS_PER_STRAND + p;
          const idx = i * 3;

          const x = (p / (PTS_PER_STRAND - 1) - 0.5) * X_SPAN;

          // 1. Diagonal Trajectory Flow in 3D Space:
          // Left side (x < 0) sweeps forward towards camera (positive Z), right side recedes (negative Z)
          const diagZ = -x * 0.35;

          // 2. Base rolling swell
          const baseSwell = Math.sin(x * 0.044 + time * 0.65) * 2.8;

          // 3. Sharp Mountain Peaks (Matching the two distinct triangular spires in the reference):
          // Peak 1: Sharp triangular spire around x = -8.5
          const dx1 = x - (-8.5 + Math.sin(time * 0.25) * 2.0);
          const dz1 = strandNorm * 7.0;
          const r1 = Math.sqrt(dx1 * dx1 + dz1 * dz1);
          const peak1 = Math.pow(Math.max(0.0, 1.0 - r1 / 11.5), 1.7) * 12.8;

          // Peak 2: Secondary sharp conical spire around x = +3.5
          const dx2 = x - (3.5 + Math.cos(time * 0.22) * 2.0);
          const dz2 = (strandNorm - 0.1) * 7.0;
          const r2 = Math.sqrt(dx2 * dx2 + dz2 * dz2);
          const peak2 = Math.pow(Math.max(0.0, 1.0 - r2 / 9.5), 1.6) * 10.4;

          // Peak 3: Undulating right ridge around x = +22
          const dx3 = x - (22.0 + Math.sin(time * 0.18) * 2.5);
          const peak3 = Math.exp(-dx3 * dx3 * 0.035) * 6.2 * (1.0 - Math.abs(strandNorm) * 0.45);

          // 4. Subtle contour ripples along strands (gives layered topological contour texture)
          const contourRipple = Math.sin(x * 0.09 - time * 0.8 + strandNorm * 2.5) * 1.8;

          // 5. Center Dip directly underneath centered headline
          const centerTextDip = -2.2 * Math.exp(-(x * x) / 950.0);

          // 6. Strand Bunching at Peaks:
          // Strands pull together along the crest, creating the bright, dense, glowing contour lines!
          const peakIntensity = Math.min(1.0, (peak1 + peak2) / 12.0);
          const strandSpacing = 16.0 * (1.0 - peakIntensity * 0.48);

          // 7. S-curve lateral wave
          const lateralS = Math.sin(x * 0.032 + time * 0.4) * 4.8;
          const z = diagZ + strandNorm * strandSpacing + lateralS;

          // Total height Y
          let y = baseSwell + peak1 + peak2 + peak3 + contourRipple + centerTextDip - 5.8;

          // Foreground Swoop:
          // As strands come close to camera (strandNorm > 0.4), they swoop forward and dip into lower foreground
          if (strandNorm > 0.3) {
            y -= (strandNorm - 0.3) * 3.5;
          }

          // Cursor proximity gentle lift
          const dx = x - mouseWorldX;
          const dz = z - mouseWorldZ;
          const distToMouse = Math.sqrt(dx * dx + dz * dz);
          if (distToMouse < 24) {
            const lift = Math.cos((distToMouse / 24) * Math.PI * 0.5) * 3.6;
            y += lift;
          }

          pPos[idx] = x;
          pPos[idx + 1] = y;
          pPos[idx + 2] = z;

          // 8. Clean Color Grading sampled from reference image:
          // High Crest Peaks: Pure White (#ffffff) & Electric Ice Cyan (#38bdf8)
          // Mid-slopes & Filaments: Brilliant Cobalt Blue (#2563eb) & Deep Marine (#1d4ed8)
          // Low valleys & Depth: Dark Obsidian Navy (#071733) to Abyss (#020617)
          const hNorm = Math.max(0, Math.min(1, (y + 13.5) / 22.0));

          const c = new THREE.Color();
          if (hNorm > 0.78) {
            // Crest peak: brilliant pure white to electric ice cyan
            const t = (hNorm - 0.78) / 0.22;
            c.lerpColors(colCyanGlow, colWhite, t);
          } else if (hNorm > 0.48) {
            // Upper ridge slope: electric blue to cyan
            const t = (hNorm - 0.48) / 0.30;
            c.lerpColors(colElectricBlue, colCyanGlow, t);
          } else if (hNorm > 0.22) {
            // Mid slope: cobalt to bright electric blue
            const t = (hNorm - 0.22) / 0.26;
            c.lerpColors(colCobalt, colElectricBlue, t);
          } else {
            // Deep valleys: dark abyss to deep navy
            const t = hNorm / 0.22;
            c.lerpColors(colAbyss, colDeepNavy, t);
          }

          // Prominent beacon nodes get pure luminous white/cyan
          if (pBeacon[i] > 0.5) {
            c.set(colWhite);
          }

          pCol[idx] = c.r;
          pCol[idx + 1] = c.g;
          pCol[idx + 2] = c.b;
        }
      }

      // Upper stars subtle floating
      for (let a = 0; a < AMBIENT_COUNT; a++) {
        const idx = (GRID_COUNT + a) * 3;
        pPos[idx + 1] += Math.sin(time * 1.2 + a) * 0.008;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

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
      customMaterial.dispose();
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
        background: '#01040a'
      }}
    />
  );
};
