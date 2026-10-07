import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../../utils/audioSynth';

export type VehicleMode = 'drone' | 'rocket';

interface AsciiVehicleCanvasProps {
  className?: string;
  vehicleMode?: VehicleMode;
  onTelemetryUpdate?: (data: { altitude: number; velocity: number; thrust: number; status: string }) => void;
}

export const AsciiVehicleCanvas: React.FC<AsciiVehicleCanvasProps> = ({
  className = '',
  vehicleMode = 'drone',
  onTelemetryUpdate
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<VehicleMode>(vehicleMode);

  useEffect(() => {
    modeRef.current = vehicleMode;
  }, [vehicleMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene & Camera Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030305');

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.0, 42.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- 2. Generate ASCII Character Texture Atlas ---
    // Characters ordered by visual luminance / cybernetic density
    const ASCII_CHARS = [' ', '.', ':', '-', '+', '=', '*', '#', '%', '@', '0', '1', 'M', 'T', 'R', 'X'];
    const ATLAS_COLS = ASCII_CHARS.length; // 16 glyphs
    const GLYPH_SIZE = 64;

    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = GLYPH_SIZE * ATLAS_COLS;
    atlasCanvas.height = GLYPH_SIZE;
    const ctx = atlasCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, atlasCanvas.width, atlasCanvas.height);
      ctx.font = 'bold 44px "JetBrains Mono", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < ATLAS_COLS; i++) {
        const char = ASCII_CHARS[i];
        const x = i * GLYPH_SIZE + GLYPH_SIZE / 2;
        const y = GLYPH_SIZE / 2;
        ctx.fillText(char, x, y);
      }
    }

    const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
    atlasTexture.minFilter = THREE.LinearFilter;
    atlasTexture.magFilter = THREE.LinearFilter;
    atlasTexture.generateMipmaps = false;

    // --- 3. Build Procedural 3D ASCII Drone & Rocket Geometries ---
    // Vehicle group contains the main craft + spinning rotors
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    // Dynamic Plume Particles Group
    const PLUME_COUNT = 1400;
    const plumePositions = new Float32Array(PLUME_COUNT * 3);
    const plumeColors = new Float32Array(PLUME_COUNT * 3);
    const plumeSizes = new Float32Array(PLUME_COUNT);
    const plumeChars = new Float32Array(PLUME_COUNT);
    const plumeVels = new Float32Array(PLUME_COUNT * 3);
    const plumeAges = new Float32Array(PLUME_COUNT);
    const plumeLifetimes = new Float32Array(PLUME_COUNT);

    for (let p = 0; p < PLUME_COUNT; p++) {
      plumePositions[p * 3] = 0;
      plumePositions[p * 3 + 1] = -100;
      plumePositions[p * 3 + 2] = 0;

      plumeColors[p * 3] = 1.0;
      plumeColors[p * 3 + 1] = 0.85;
      plumeColors[p * 3 + 2] = 0.4;

      plumeSizes[p] = Math.random() * 2.8 + 1.2;
      plumeChars[p] = Math.floor(Math.random() * 12) + 2;
      plumeAges[p] = 1.0;
      plumeLifetimes[p] = 1.0;
    }

    const plumeGeometry = new THREE.BufferGeometry();
    const plumePosAttr = new THREE.BufferAttribute(plumePositions, 3);
    const plumeColAttr = new THREE.BufferAttribute(plumeColors, 3);
    const plumeSizeAttr = new THREE.BufferAttribute(plumeSizes, 1);
    const plumeCharAttr = new THREE.BufferAttribute(plumeChars, 1);

    plumeGeometry.setAttribute('position', plumePosAttr);
    plumeGeometry.setAttribute('aColor', plumeColAttr);
    plumeGeometry.setAttribute('aSize', plumeSizeAttr);
    plumeGeometry.setAttribute('aCharIndex', plumeCharAttr);

    // --- 4. Custom ASCII Particle Shader ---
    const asciiMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: atlasTexture },
        uAtlasCols: { value: 16.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) },
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform float uPixelRatio;
        uniform float uTime;

        attribute float aSize;
        attribute vec3 aColor;
        attribute float aCharIndex;

        varying vec3 vColor;
        varying float vCharIndex;
        varying float vDist;

        void main() {
          vColor = aColor;
          vCharIndex = aCharIndex;

          vec4 modelPos = modelMatrix * vec4(position, 1.0);
          vec4 viewPos = viewMatrix * modelPos;
          gl_Position = projectionMatrix * viewPos;

          vDist = -viewPos.z;

          // Sizing proportional to perspective distance & device pixel ratio
          float pSize = aSize * (38.0 / max(10.0, vDist)) * uPixelRatio;
          gl_PointSize = max(1.5, pSize);
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlas;
        uniform float uAtlasCols;

        varying vec3 vColor;
        varying float vCharIndex;
        varying float vDist;

        void main() {
          // Calculate UV offset for the character tile in the 16-character atlas
          float charIdx = floor(clamp(vCharIndex, 0.0, uAtlasCols - 1.0));
          vec2 uv = vec2((charIdx + gl_PointCoord.x) / uAtlasCols, 1.0 - gl_PointCoord.y);

          vec4 texSample = texture2D(uAtlas, uv);
          float alpha = texSample.r;

          if (alpha < 0.12) discard;

          // Additive glowing cybernetic glyph
          gl_FragColor = vec4(vColor, alpha * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const plumeMesh = new THREE.Points(plumeGeometry, asciiMaterial);
    scene.add(plumeMesh);

    // --- 5. Generate Point Cloud Geometries for Drone and Rocket ---
    // Helper to generate dense point surfaces
    const generateDronePoints = () => {
      const pts: number[] = [];
      const cols: number[] = [];
      const szs: number[] = [];
      const chs: number[] = [];

      // Color scheme: Pure White core (#fff), Electric Cyan (#38bdf8), Cobalt Accent (#2563eb), Danger Orange (#f97316)
      const cWhite = new THREE.Color('#ffffff');
      const cCyan = new THREE.Color('#38bdf8');
      const cBlue = new THREE.Color('#2563eb');
      const cOrange = new THREE.Color('#fb923c');
      const cDark = new THREE.Color('#94a3b8');

      // A. Center Body Pod (Hexagonal Carbon Fuselage)
      for (let layer = -1.2; layer <= 1.2; layer += 0.22) {
        const rad = (1.4 - Math.abs(layer) * 0.45) * 3.2;
        for (let a = 0; a < Math.PI * 2; a += 0.12) {
          const x = Math.cos(a) * rad;
          const z = Math.sin(a) * rad * 1.35; // Elongated nose-to-tail
          const y = layer;

          pts.push(x, y, z);
          const col = Math.abs(z) > rad * 0.9 ? cCyan : (Math.random() > 0.4 ? cWhite : cDark);
          cols.push(col.r, col.g, col.b);
          szs.push(Math.random() * 1.5 + 2.0);
          chs.push(Math.floor(Math.random() * 14) + 2); // ASCII chars 2..15
        }
      }

      // B. 4 Diagonal Motor Arms (Carbon Tubes)
      const ARM_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      const ARM_LENGTH = 13.5;

      for (const angle of ARM_ANGLES) {
        for (let r = 2.5; r <= ARM_LENGTH; r += 0.35) {
          const armX = Math.cos(angle) * r;
          const armZ = Math.sin(angle) * r;
          const armY = 0.2 + (r / ARM_LENGTH) * 0.6;

          // Tube cross-section points
          for (let th = 0; th < Math.PI * 2; th += 1.2) {
            const ox = Math.cos(th) * 0.55;
            const oy = Math.sin(th) * 0.55;
            pts.push(armX + ox, armY + oy, armZ);
            cols.push(cDark.r, cDark.g, cDark.b);
            szs.push(2.2);
            chs.push(4); // '+' or '-' symbols
          }
        }

        // Motor Nacelle at arm tip
        const motorX = Math.cos(angle) * ARM_LENGTH;
        const motorZ = Math.sin(angle) * ARM_LENGTH;
        const motorY = 0.8;

        for (let my = -1.2; my <= 1.4; my += 0.3) {
          for (let ma = 0; ma < Math.PI * 2; ma += 0.3) {
            const mx = motorX + Math.cos(ma) * 1.6;
            const mz = motorZ + Math.sin(ma) * 1.6;
            pts.push(mx, motorY + my, mz);
            const mCol = my > 0.8 ? cCyan : cBlue;
            cols.push(mCol.r, mCol.g, mCol.b);
            szs.push(2.4);
            chs.push(9); // '#' or '@'
          }
        }

        // Arm Tip Navigation LED (Red / Green / White)
        for (let led = 0; led < 6; led++) {
          pts.push(motorX, motorY + 1.6, motorZ);
          cols.push(cOrange.r, cOrange.g, cOrange.b);
          szs.push(4.5);
          chs.push(11); // '0' or '1'
        }
      }

      // C. Front Sensor Gimbal / LiDAR Turret
      for (let u = 0; u < Math.PI; u += 0.2) {
        for (let v = 0; v < Math.PI; v += 0.2) {
          const gx = Math.sin(u) * Math.cos(v) * 1.6;
          const gy = -0.8 + Math.cos(u) * 1.4;
          const gz = 4.2 + Math.sin(u) * Math.sin(v) * 1.6;
          pts.push(gx, gy, gz);
          cols.push(cCyan.r, cCyan.g, cCyan.b);
          szs.push(2.2);
          chs.push(12); // 'M'
        }
      }

      // D. Landing Skids (Twin tubular rails)
      for (const side of [-2.4, 2.4]) {
        for (let sx = -4.5; sx <= 4.5; sx += 0.35) {
          pts.push(side, -2.4, sx);
          cols.push(cDark.r, cDark.g, cDark.b);
          szs.push(1.8);
          chs.push(3); // '-'
        }
        // Vertical struts
        for (const sy of [-2.4, -0.6]) {
          pts.push(side, sy, -2.0);
          pts.push(side, sy, 2.0);
          cols.push(cDark.r, cDark.g, cDark.b);
          cols.push(cDark.r, cDark.g, cDark.b);
          szs.push(1.8);
          szs.push(1.8);
          chs.push(5);
          chs.push(5);
        }
      }

      return { pts, cols, szs, chs };
    };

    // Spinning Rotor Blades Geometry
    const generateRotors = () => {
      const pts: number[] = [];
      const cols: number[] = [];
      const szs: number[] = [];
      const chs: number[] = [];

      const ARM_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      const ARM_LENGTH = 13.5;
      const BLADE_SPAN = 6.2;

      for (let rIdx = 0; rIdx < ARM_ANGLES.length; rIdx++) {
        const angle = ARM_ANGLES[rIdx];
        const motorX = Math.cos(angle) * ARM_LENGTH;
        const motorZ = Math.sin(angle) * ARM_LENGTH;
        const motorY = 2.2;

        // Dual blade propeller
        for (let b = -BLADE_SPAN; b <= BLADE_SPAN; b += 0.3) {
          if (Math.abs(b) < 0.8) continue;
          pts.push(motorX + b, motorY, motorZ);
          cols.push(0.25, 0.9, 1.0); // Icy cyan
          szs.push(2.6);
          chs.push(6); // '=' or '*'
        }
      }

      return { pts, cols, szs, chs };
    };

    // Orbital Rocket Geometry
    const generateRocketPoints = () => {
      const pts: number[] = [];
      const cols: number[] = [];
      const szs: number[] = [];
      const chs: number[] = [];

      const cWhite = new THREE.Color('#ffffff');
      const cCyan = new THREE.Color('#38bdf8');
      const cOrange = new THREE.Color('#fb923c');
      const cDark = new THREE.Color('#475569');

      // Cylindrical Body & Conical Nose
      const HEIGHT = 26.0;
      const RADIUS = 3.2;

      for (let y = -HEIGHT * 0.5; y <= HEIGHT * 0.5; y += 0.4) {
        let r = RADIUS;
        if (y > HEIGHT * 0.25) {
          // Conical nose cone
          const t = (y - HEIGHT * 0.25) / (HEIGHT * 0.25);
          r = RADIUS * (1.0 - Math.pow(t, 1.4));
        }

        for (let a = 0; a < Math.PI * 2; a += 0.18) {
          const x = Math.cos(a) * r;
          const z = Math.sin(a) * r;
          pts.push(x, y + 2.0, z);

          // Grid line telemetry highlights
          const isGrid = Math.abs(Math.sin(a * 4.0)) > 0.95 || Math.abs(y % 3.0) < 0.25;
          const col = isGrid ? cCyan : (y > HEIGHT * 0.3 ? cWhite : cDark);
          cols.push(col.r, col.g, col.b);
          szs.push(isGrid ? 2.5 : 1.8);
          chs.push(isGrid ? 14 : 7);
        }
      }

      // 4 Base Stabilizing Fins
      for (let f = 0; f < 4; f++) {
        const fAngle = f * (Math.PI / 2);
        for (let h = -HEIGHT * 0.5; h <= -HEIGHT * 0.2; h += 0.35) {
          const finW = ((-HEIGHT * 0.2 - h) / (HEIGHT * 0.3)) * 4.5;
          for (let w = 0; w <= finW; w += 0.4) {
            const fx = Math.cos(fAngle) * (RADIUS + w);
            const fz = Math.sin(fAngle) * (RADIUS + w);
            pts.push(fx, h + 2.0, fz);
            cols.push(cCyan.r, cCyan.g, cCyan.b);
            szs.push(2.2);
            chs.push(5);
          }
        }
      }

      // Engine Nozzle Cluster
      for (let na = 0; na < Math.PI * 2; na += 0.2) {
        for (let ny = -HEIGHT * 0.5 - 1.8; ny <= -HEIGHT * 0.5; ny += 0.3) {
          const nr = RADIUS * 0.65 + (-HEIGHT * 0.5 - ny) * 0.4;
          pts.push(Math.cos(na) * nr, ny + 2.0, Math.sin(na) * nr);
          cols.push(cOrange.r, cOrange.g, cOrange.b);
          szs.push(2.8);
          chs.push(10);
        }
      }

      return { pts, cols, szs, chs };
    };

    // Create Buffer Geometry Mesh
    let craftMesh: THREE.Points | null = null;
    let rotorMesh: THREE.Points | null = null;
    let rotorBasePoints: Float32Array | null = null;

    const buildCraft = (mode: VehicleMode) => {
      // Clear previous
      while (vehicleGroup.children.length > 0) {
        const obj = vehicleGroup.children[0];
        vehicleGroup.remove(obj);
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
        }
      }

      if (mode === 'drone') {
        const { pts, cols, szs, chs } = generateDronePoints();
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
        geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(cols), 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(szs), 1));
        geo.setAttribute('aCharIndex', new THREE.BufferAttribute(new Float32Array(chs), 1));
        craftMesh = new THREE.Points(geo, asciiMaterial);
        vehicleGroup.add(craftMesh);

        // Separate Rotors Mesh for high-speed spinning
        const rData = generateRotors();
        const rGeo = new THREE.BufferGeometry();
        rotorBasePoints = new Float32Array(rData.pts);
        rGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rData.pts), 3));
        rGeo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(rData.cols), 3));
        rGeo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(rData.szs), 1));
        rGeo.setAttribute('aCharIndex', new THREE.BufferAttribute(new Float32Array(rData.chs), 1));
        rotorMesh = new THREE.Points(rGeo, asciiMaterial);
        vehicleGroup.add(rotorMesh);
      } else {
        const { pts, cols, szs, chs } = generateRocketPoints();
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
        geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(cols), 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(szs), 1));
        geo.setAttribute('aCharIndex', new THREE.BufferAttribute(new Float32Array(chs), 1));
        craftMesh = new THREE.Points(geo, asciiMaterial);
        vehicleGroup.add(craftMesh);
        rotorMesh = null;
        rotorBasePoints = null;
      }
    };

    buildCraft(modeRef.current);

    // --- 6. Environmental Cybernetic Grid / Ground Matrix ---
    const GRID_LINES = 32;
    const gridPts: number[] = [];
    const gridCols: number[] = [];
    const gridSzs: number[] = [];
    const gridChs: number[] = [];

    const cGrid = new THREE.Color('#1e293b');
    const cGridBright = new THREE.Color('#38bdf8');

    for (let gx = -60; gx <= 60; gx += 4.0) {
      for (let gz = -60; gz <= 60; gz += 4.0) {
        gridPts.push(gx, -16.0, gz);
        const isCross = (Math.abs(gx) % 16 === 0) && (Math.abs(gz) % 16 === 0);
        const col = isCross ? cGridBright : cGrid;
        gridCols.push(col.r, col.g, col.b);
        gridSzs.push(isCross ? 3.0 : 1.4);
        gridChs.push(isCross ? 5 : 1); // '+' or '.'
      }
    }

    const groundGeo = new THREE.BufferGeometry();
    groundGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPts), 3));
    groundGeo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(gridCols), 3));
    groundGeo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(gridSzs), 1));
    groundGeo.setAttribute('aCharIndex', new THREE.BufferAttribute(new Float32Array(gridChs), 1));
    const groundMesh = new THREE.Points(groundGeo, asciiMaterial);
    scene.add(groundMesh);

    // --- 7. Mouse & Scroll Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let scrollProgress = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = mouseX * 0.65;
      targetRotX = -mouseY * 0.45;
    };

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      scrollProgress = Math.min(1.0, Math.max(0.0, maxScroll > 0 ? current / (window.innerHeight * 1.5) : 0));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      asciiMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2.0);
    };

    window.addEventListener('resize', onResize);

    // --- 8. Real-Time Animation Loop (Takeoff, Smoke Plumes, Rotor Physics) ---
    let animId: number;
    let time = 0;
    let rotorAngle = 0;
    let currentMode = modeRef.current;

    const animate = () => {
      time += 0.016;
      asciiMaterial.uniforms.uTime.value = time;

      // Handle dynamic mode change
      if (modeRef.current !== currentMode) {
        currentMode = modeRef.current;
        buildCraft(currentMode);
      }

      // Flight Throttle Calculation based on Scroll
      // 0.0 -> Idle hover at ground
      // 0.2 -> Engine ignition & thruster fire
      // 0.5 -> Rapid liftoff & acceleration
      // 1.0 -> High-altitude hypersonic climb into the sky
      const throttle = Math.min(1.0, 0.15 + scrollProgress * 1.2);
      const isAscending = scrollProgress > 0.08;

      // Calculate Vehicle Altitude & Position
      const baseHover = Math.sin(time * 2.2) * 0.45;
      const climbAltitude = scrollProgress * 55.0; // Climbs dramatically upwards
      const targetY = baseHover + climbAltitude;

      // Pitch forward slightly during high-speed climb
      const pitchForward = isAscending ? Math.min(0.35, scrollProgress * 0.55) : 0;

      vehicleGroup.position.y += (targetY - vehicleGroup.position.y) * 0.06;
      vehicleGroup.position.x += (mouseX * 4.0 - vehicleGroup.position.x) * 0.04;
      vehicleGroup.rotation.y += (targetRotY + Math.sin(time * 0.5) * 0.08 - vehicleGroup.rotation.y) * 0.05;
      vehicleGroup.rotation.x += (targetRotX + pitchForward - vehicleGroup.rotation.x) * 0.05;
      vehicleGroup.rotation.z = -mouseX * 0.15; // Banking into turns

      // Camera vibration / thruster shake during high throttle
      if (throttle > 0.4) {
        const shake = (throttle - 0.4) * 0.18;
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = 4.0 + (Math.random() - 0.5) * shake;
      } else {
        camera.position.x = 0;
        camera.position.y = 4.0;
      }

      // High-Speed Rotor Blade Rotation
      if (rotorMesh && rotorBasePoints) {
        rotorAngle += 0.35 + throttle * 0.95; // Rotors spin up to 1200+ RPM
        const rPos = rotorMesh.geometry.attributes.position.array as Float32Array;
        const ARM_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
        const ARM_LENGTH = 13.5;

        let ptr = 0;
        for (let rIdx = 0; rIdx < ARM_ANGLES.length; rIdx++) {
          const angle = ARM_ANGLES[rIdx];
          const motorX = Math.cos(angle) * ARM_LENGTH;
          const motorZ = Math.sin(angle) * ARM_LENGTH;
          const dir = rIdx % 2 === 0 ? 1 : -1; // Counter-rotating blades
          const curRot = rotorAngle * dir;

          for (let b = -6.2; b <= 6.2; b += 0.3) {
            if (Math.abs(b) < 0.8) continue;
            // Rotate blade relative to motor hub
            const rx = Math.cos(curRot) * b;
            const rz = Math.sin(curRot) * b;
            rPos[ptr] = motorX + rx;
            rPos[ptr + 1] = 2.2;
            rPos[ptr + 2] = motorZ + rz;
            ptr += 3;
          }
        }
        rotorMesh.geometry.attributes.position.needsUpdate = true;
      }

      // Billowing Thruster Smoke & Spark Plume (Matching Reference Image 2)
      // Plume emits from motor downwash or rocket engine bells
      const pPos = plumePosAttr.array as Float32Array;
      const pCol = plumeColAttr.array as Float32Array;
      const pSz = plumeSizeAttr.array as Float32Array;
      const pCh = plumeCharAttr.array as Float32Array;

      const spawnCount = Math.floor(throttle * 18);
      const ARM_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      const ARM_LENGTH = 13.5;

      for (let s = 0; s < spawnCount; s++) {
        // Find dead particle
        const deadIdx = Math.floor(Math.random() * PLUME_COUNT);
        if (plumeAges[deadIdx] >= plumeLifetimes[deadIdx]) {
          plumeAges[deadIdx] = 0;
          plumeLifetimes[deadIdx] = 0.6 + Math.random() * 0.7;

          let emitterX = 0;
          let emitterZ = 0;
          let emitterY = vehicleGroup.position.y - (currentMode === 'drone' ? 1.2 : 11.0);

          if (currentMode === 'drone') {
            const rndArm = ARM_ANGLES[Math.floor(Math.random() * 4)];
            emitterX = vehicleGroup.position.x + Math.cos(rndArm) * ARM_LENGTH + (Math.random() - 0.5) * 1.5;
            emitterZ = vehicleGroup.position.z + Math.sin(rndArm) * ARM_LENGTH + (Math.random() - 0.5) * 1.5;
          } else {
            emitterX = vehicleGroup.position.x + (Math.random() - 0.5) * 2.2;
            emitterZ = vehicleGroup.position.z + (Math.random() - 0.5) * 2.2;
          }

          pPos[deadIdx * 3] = emitterX;
          pPos[deadIdx * 3 + 1] = emitterY;
          pPos[deadIdx * 3 + 2] = emitterZ;

          // Downward blast velocity with turbulent vortex curl
          const spread = 0.35 + throttle * 0.8;
          plumeVels[deadIdx * 3] = (Math.random() - 0.5) * spread * 8.0;
          plumeVels[deadIdx * 3 + 1] = -(6.0 + throttle * 28.0) * (0.8 + Math.random() * 0.4);
          plumeVels[deadIdx * 3 + 2] = (Math.random() - 0.5) * spread * 8.0;

          // Color: Blinding white/cyan core -> fiery incandescent orange/smoke
          if (Math.random() > 0.4) {
            pCol[deadIdx * 3] = 1.0;
            pCol[deadIdx * 3 + 1] = 1.0;
            pCol[deadIdx * 3 + 2] = 1.0; // Blinding thrust core
          } else {
            pCol[deadIdx * 3] = 0.22;
            pCol[deadIdx * 3 + 1] = 0.75;
            pCol[deadIdx * 3 + 2] = 1.0; // Electric cyan flame
          }

          pSz[deadIdx] = Math.random() * 2.6 + 1.8;
          pCh[deadIdx] = Math.floor(Math.random() * 12) + 2;
        }
      }

      // Update Active Plume Particles
      for (let p = 0; p < PLUME_COUNT; p++) {
        if (plumeAges[p] < plumeLifetimes[p]) {
          plumeAges[p] += 0.016;
          const lifeNorm = plumeAges[p] / plumeLifetimes[p];

          // Move with velocity & aerodynamic drag
          pPos[p * 3] += plumeVels[p * 3] * 0.016;
          pPos[p * 3 + 1] += plumeVels[p * 3 + 1] * 0.016;
          pPos[p * 3 + 2] += plumeVels[p * 3 + 2] * 0.016;

          // Expand plume as smoke billows outward
          pSz[p] += 0.25;

          // Fade to grey smoke
          const fade = 1.0 - lifeNorm;
          pCol[p * 3] *= fade;
          pCol[p * 3 + 1] *= fade;
          pCol[p * 3 + 2] *= fade;
        } else {
          pPos[p * 3 + 1] = -200; // Park offscreen
        }
      }

      plumePosAttr.needsUpdate = true;
      plumeColAttr.needsUpdate = true;
      plumeSizeAttr.needsUpdate = true;

      // Telemetry callback to parent UI
      if (onTelemetryUpdate) {
        const alt = Math.max(0, scrollProgress * 1240.0);
        const vel = Math.max(0, scrollProgress * 84.5);
        const thr = Math.floor(throttle * 100);
        const status = scrollProgress > 0.85 ? 'ORBITAL INSERTION' : (scrollProgress > 0.3 ? 'CLIMB PHASE' : (scrollProgress > 0.05 ? 'TAKEOFF' : 'ARMED / IDLE'));
        onTelemetryUpdate({ altitude: alt, velocity: vel, thrust: thr, status });
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      atlasTexture.dispose();
      asciiMaterial.dispose();
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
        background: '#030305'
      }}
    />
  );
};
