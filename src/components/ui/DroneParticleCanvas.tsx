import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DroneParticleCanvasProps {
  className?: string;
  scrollProgress?: number; // 0.0 (Drone) -> 0.33 (Nebula Cluster) -> 0.66 (Starfield) -> 1.0 (Satellite)
}

export const DroneParticleCanvas: React.FC<DroneParticleCanvasProps> = ({
  className = '',
  scrollProgress = 0
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(scrollProgress);

  // Keep scroll progress ref updated synchronously
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 82);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 2. High-Quality Neutral Radial Glow Particle Texture ---
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(0.48, 'rgba(255, 255, 255, 0.35)');
      gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // --- 3. Compute 4 Pre-Defined 3D Formations (4,800 points each) ---
    const TOTAL = 4800;

    // Buffers for 4 states:
    // State 0: Quadcopter Drone (Hero)
    // State 1: Turbulent Nebula Swirl (Breakup)
    // State 2: Deep Cosmic Starfield (Expansive Scatter)
    // State 3: Satellite / Orbital Spacecraft (Re-Assembly)
    const state0Pos = new Float32Array(TOTAL * 3);
    const state0Col = new Float32Array(TOTAL * 3);

    const state1Pos = new Float32Array(TOTAL * 3);
    const state1Col = new Float32Array(TOTAL * 3);

    const state2Pos = new Float32Array(TOTAL * 3);
    const state2Col = new Float32Array(TOTAL * 3);

    const state3Pos = new Float32Array(TOTAL * 3);
    const state3Col = new Float32Array(TOTAL * 3);

    const colCyan = new THREE.Color('#41e9f2');
    const colCyanBright = new THREE.Color('#a5f3fc');
    const colWhite = new THREE.Color('#ffffff');
    const colGold = new THREE.Color('#f59e0b');
    const colAmber = new THREE.Color('#fbbf24');
    const colOrange = new THREE.Color('#ea580c');
    const colDeepCyan = new THREE.Color('#0284c7');

    // ----------------------------------------------------
    // STATE 0: 3D QUADCOPTER DRONE (Hero State)
    // ----------------------------------------------------
    let p0 = 0;
    // Central fuselage
    const FUSELAGE_COUNT = 1100;
    for (let i = 0; i < FUSELAGE_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random());

      const x = r * 8.2 * Math.sin(phi) * Math.cos(theta);
      const y = r * 4.8 * Math.sin(phi) * Math.sin(theta);
      const z = r * 2.4 * Math.cos(phi);

      state0Pos[p0 * 3] = x;
      state0Pos[p0 * 3 + 1] = y;
      state0Pos[p0 * 3 + 2] = z;

      const c = new THREE.Color();
      if (x > 1.2) {
        c.lerpColors(colCyan, colWhite, Math.random() * 0.7);
      } else if (x < -1.2) {
        c.lerpColors(colGold, colOrange, Math.random() * 0.8);
      } else {
        c.lerpColors(colWhite, colAmber, Math.random());
      }
      state0Col[p0 * 3] = c.r;
      state0Col[p0 * 3 + 1] = c.g;
      state0Col[p0 * 3 + 2] = c.b;
      p0++;
    }

    // Avionics RTK dome + gimbal
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 3.4;
      state0Pos[p0 * 3] = Math.cos(angle) * rad;
      state0Pos[p0 * 3 + 1] = Math.sin(angle) * rad * 0.8;
      state0Pos[p0 * 3 + 2] = 2.2 + Math.sqrt(Math.max(0, 11 - rad * rad)) * 0.4;
      state0Col[p0 * 3] = colWhite.r;
      state0Col[p0 * 3 + 1] = colWhite.g;
      state0Col[p0 * 3 + 2] = colWhite.b;
      p0++;
    }

    // 4 Truss arms and motor pods
    const ARM_SPAN = 22.0;
    const motors = [
      { x: ARM_SPAN * 0.72, y: ARM_SPAN * 0.7, z: 1.4, isFront: true },
      { x: ARM_SPAN * 0.72, y: -ARM_SPAN * 0.7, z: 1.4, isFront: true },
      { x: -ARM_SPAN * 0.72, y: ARM_SPAN * 0.7, z: 1.4, isFront: false },
      { x: -ARM_SPAN * 0.72, y: -ARM_SPAN * 0.7, z: 1.4, isFront: false }
    ];

    motors.forEach((m) => {
      // Carbon arm tube
      const ARM_PTS = 220;
      for (let s = 0; s < ARM_PTS; s++) {
        const t = s / ARM_PTS;
        const tubeAngle = Math.random() * Math.PI * 2;
        const tubeRadius = (1.0 - t * 0.25) * 0.85;

        state0Pos[p0 * 3] = m.x * t + Math.cos(tubeAngle) * tubeRadius;
        state0Pos[p0 * 3 + 1] = m.y * t + Math.sin(tubeAngle) * tubeRadius;
        state0Pos[p0 * 3 + 2] = m.z * t + Math.sin(tubeAngle) * tubeRadius * 0.6;

        const c = new THREE.Color();
        c.lerpColors(m.isFront ? colDeepCyan : colAmber, m.isFront ? colCyan : colGold, t);
        state0Col[p0 * 3] = c.r;
        state0Col[p0 * 3 + 1] = c.g;
        state0Col[p0 * 3 + 2] = c.b;
        p0++;
      }

      // Spinning rotor disc
      const ROTOR_PTS = 480;
      const ROTOR_RAD = 10.5;
      for (let r = 0; r < ROTOR_PTS; r++) {
        const rAng = Math.random() * Math.PI * 2;
        const rDist = Math.pow(Math.random(), 0.65) * ROTOR_RAD;
        state0Pos[p0 * 3] = m.x + Math.cos(rAng) * rDist;
        state0Pos[p0 * 3 + 1] = m.y + Math.sin(rAng) * rDist;
        state0Pos[p0 * 3 + 2] = m.z + 1.8 + Math.sin(rAng * 2) * 0.45;

        const c = new THREE.Color();
        c.lerpColors(colWhite, m.isFront ? colCyan : colGold, rDist / ROTOR_RAD);
        state0Col[p0 * 3] = c.r;
        state0Col[p0 * 3 + 1] = c.g;
        state0Col[p0 * 3 + 2] = c.b;
        p0++;
      }
    });

    // Fill remaining points with ambient sparkles
    while (p0 < TOTAL) {
      state0Pos[p0 * 3] = (Math.random() - 0.5) * 160;
      state0Pos[p0 * 3 + 1] = (Math.random() - 0.5) * 120;
      state0Pos[p0 * 3 + 2] = (Math.random() - 0.5) * 80;
      const c = Math.random() > 0.5 ? colCyanBright : colAmber;
      state0Col[p0 * 3] = c.r;
      state0Col[p0 * 3 + 1] = c.g;
      state0Col[p0 * 3 + 2] = c.b;
      p0++;
    }

    // ----------------------------------------------------
    // STATE 1: TURBULENT NEBULA CLUSTER (Images 3 & 4)
    // ----------------------------------------------------
    for (let i = 0; i < TOTAL; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.pow(Math.random(), 0.5) * 22.0;

      // Swirling spiral distortion
      const spiralAngle = theta + r * 0.15;
      const x = r * Math.sin(phi) * Math.cos(spiralAngle);
      const y = r * Math.sin(phi) * Math.sin(spiralAngle) * 0.85;
      const z = (r * Math.cos(phi) * 0.8) + (Math.random() - 0.5) * 6;

      state1Pos[i * 3] = x;
      state1Pos[i * 3 + 1] = y;
      state1Pos[i * 3 + 2] = z;

      // Dual cluster blending: gold and cyan patches
      const c = new THREE.Color();
      if (Math.sin(theta * 2 + r * 0.2) > 0) {
        c.lerpColors(colGold, colAmber, Math.random() * 0.7);
      } else {
        c.lerpColors(colCyan, colCyanBright, Math.random() * 0.7);
      }
      if (r < 7) c.lerp(colWhite, 0.6); // Hot white core

      state1Col[i * 3] = c.r;
      state1Col[i * 3 + 1] = c.g;
      state1Col[i * 3 + 2] = c.b;
    }

    // ----------------------------------------------------
    // STATE 2: DEEP COSMIC STARFIELD SCATTER (Image 5 & Set 2 Image 1)
    // ----------------------------------------------------
    for (let i = 0; i < TOTAL; i++) {
      // Dispersed broadly across the entire viewport
      const sx = (Math.random() - 0.5) * 190;
      const sy = (Math.random() - 0.5) * 140;
      const sz = (Math.random() - 0.5) * 100;

      state2Pos[i * 3] = sx;
      state2Pos[i * 3 + 1] = sy;
      state2Pos[i * 3 + 2] = sz;

      const c = new THREE.Color();
      const rand = Math.random();
      if (rand > 0.7) {
        c.copy(colCyanBright);
      } else if (rand > 0.4) {
        c.copy(colGold);
      } else {
        c.copy(colWhite);
      }

      state2Col[i * 3] = c.r;
      state2Col[i * 3 + 1] = c.g;
      state2Col[i * 3 + 2] = c.b;
    }

    // ----------------------------------------------------
    // STATE 3: SATELLITE / ORBITAL SPACECRAFT (Set 2 Images 2 & 3)
    // ----------------------------------------------------
    let p3 = 0;

    // Central cylindrical satellite bus (X axis)
    const BUS_COUNT = 1400;
    for (let i = 0; i < BUS_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const x = (Math.random() - 0.5) * 22; // body length
      const radius = 4.2 * Math.sqrt(Math.random());
      const y = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      state3Pos[p3 * 3] = x;
      state3Pos[p3 * 3 + 1] = y;
      state3Pos[p3 * 3 + 2] = z;

      const c = new THREE.Color();
      // Gold thermal foil on one side, cyan/white on optical side
      if (x > 0) {
        c.lerpColors(colGold, colAmber, Math.random() * 0.8);
      } else {
        c.lerpColors(colCyan, colWhite, Math.random() * 0.7);
      }
      state3Col[p3 * 3] = c.r;
      state3Col[p3 * 3 + 1] = c.g;
      state3Col[p3 * 3 + 2] = c.b;
      p3++;
    }

    // Dual Extended Solar Panel Array Wings (Extending along Y axis)
    const WING_COUNT = 1800; // 900 per wing
    for (let w = 0; w < WING_COUNT; w++) {
      const isRightWing = w % 2 === 0;
      const side = isRightWing ? 1 : -1;
      // Grid dimensions: span from 7 to 28 along Y, -6 to 6 along X
      const wx = (Math.random() - 0.5) * 11;
      const wy = side * (6.5 + Math.random() * 20.5);
      const wz = (Math.random() - 0.5) * 0.8; // flat panel

      state3Pos[p3 * 3] = wx;
      state3Pos[p3 * 3 + 1] = wy;
      state3Pos[p3 * 3 + 2] = wz;

      // Photovoltaic cell cyan/blue glow with white grid lines
      const c = new THREE.Color();
      if (Math.abs(wx) > 5.0 || Math.abs(wy % 4) < 0.3) {
        c.copy(colWhite); // panel frame
      } else {
        c.lerpColors(colDeepCyan, colCyan, Math.random() * 0.9);
      }
      state3Col[p3 * 3] = c.r;
      state3Col[p3 * 3 + 1] = c.g;
      state3Col[p3 * 3 + 2] = c.b;
      p3++;
    }

    // High-Gain Parabolic Dish Antenna (+X face)
    const DISH_COUNT = 450;
    for (let d = 0; d < DISH_COUNT; d++) {
      const u = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(u) * 6.5;
      const dx = 12.0 + (r * r) * 0.12; // parabolic curve
      const dy = Math.cos(angle) * r;
      const dz = Math.sin(angle) * r;

      state3Pos[p3 * 3] = dx;
      state3Pos[p3 * 3 + 1] = dy;
      state3Pos[p3 * 3 + 2] = dz;

      state3Col[p3 * 3] = colWhite.r;
      state3Col[p3 * 3 + 1] = colWhite.g;
      state3Col[p3 * 3 + 2] = colWhite.b;
      p3++;
    }

    // Fill remaining points with ambient stardust
    while (p3 < TOTAL) {
      state3Pos[p3 * 3] = (Math.random() - 0.5) * 170;
      state3Pos[p3 * 3 + 1] = (Math.random() - 0.5) * 130;
      state3Pos[p3 * 3 + 2] = (Math.random() - 0.5) * 90;
      const c = Math.random() > 0.5 ? colCyan : colGold;
      state3Col[p3 * 3] = c.r;
      state3Col[p3 * 3 + 1] = c.g;
      state3Col[p3 * 3 + 2] = c.b;
      p3++;
    }

    // --- 4. Buffer Geometry Setup ---
    const currentPositions = new Float32Array(TOTAL * 3);
    const currentColors = new Float32Array(TOTAL * 3);
    const velocities = new Float32Array(TOTAL * 3);

    for (let i = 0; i < TOTAL * 3; i++) {
      currentPositions[i] = state0Pos[i];
      currentColors[i] = state0Col[i];
      velocities[i] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(currentPositions, 3);
    const colAttr = new THREE.BufferAttribute(currentColors, 3);
    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('color', colAttr);

    const material = new THREE.PointsMaterial({
      size: 2.3,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const droneGroup = new THREE.Group();
    const pointCloud = new THREE.Points(geometry, material);
    droneGroup.add(pointCloud);
    scene.add(droneGroup);

    // Initial group placement
    droneGroup.rotation.x = 0.58;
    droneGroup.rotation.y = -0.42;
    droneGroup.rotation.z = 0.30;
    droneGroup.position.x = width > 900 ? 15 : 0;

    // --- 5. Mouse Interaction Tracking ---
    let mouseNdcX = 0;
    let mouseNdcY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseNdcX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNdcY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // --- 6. Resize Handler ---
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // --- 7. Animation Loop with Continuous Scroll Interpolation ---
    let animId: number;
    let time = 0;
    let smoothProgress = 0;

    const animate = () => {
      time += 0.016;

      // Smooth lag dampening for scroll progress (eliminates any wheel hitching)
      const targetProgress = Math.max(0, Math.min(1, scrollProgressRef.current));
      smoothProgress += (targetProgress - smoothProgress) * 0.08;

      // Determine segment interpolation:
      // 0.00 -> 0.33: State 0 (Drone) to State 1 (Nebula Cluster)
      // 0.33 -> 0.66: State 1 (Nebula) to State 2 (Starfield)
      // 0.66 -> 1.00: State 2 (Starfield) to State 3 (Satellite)
      let fromPos: Float32Array;
      let toPos: Float32Array;
      let fromCol: Float32Array;
      let toCol: Float32Array;
      let tSegment = 0;

      if (smoothProgress < 0.333) {
        fromPos = state0Pos;
        toPos = state1Pos;
        fromCol = state0Col;
        toCol = state1Col;
        tSegment = smoothProgress / 0.333;
      } else if (smoothProgress < 0.666) {
        fromPos = state1Pos;
        toPos = state2Pos;
        fromCol = state1Col;
        toCol = state2Col;
        tSegment = (smoothProgress - 0.333) / 0.333;
      } else {
        fromPos = state2Pos;
        toPos = state3Pos;
        fromCol = state2Col;
        toCol = state3Col;
        tSegment = (smoothProgress - 0.666) / 0.334;
      }

      // Smooth ease in/out for segment
      const easeT = tSegment * tSegment * (3 - 2 * tSegment);

      // Camera & Group Transform driven by Scroll
      // Stage 0: Offset right (x: 15), heroic diagonal tilt
      // Stage 1: Centers (x: 0), tilts back and banks
      // Stage 2: Dolly forward into starfield
      // Stage 3: Shifts diagonally (x: -12 or 14) for Satellite
      const isDesktop = width > 900;
      let targetGroupX = 0;
      let targetRotX = 0.58;
      let targetRotY = -0.42;
      let targetRotZ = 0.30;
      let targetCameraZ = 82;

      if (smoothProgress < 0.333) {
        const p = smoothProgress / 0.333;
        targetGroupX = isDesktop ? 15 * (1 - p * 0.8) : 0;
        targetRotX = 0.58 + p * 0.35;
        targetRotY = -0.42 - p * 0.6;
        targetRotZ = 0.30 + p * 0.2;
      } else if (smoothProgress < 0.666) {
        const p = (smoothProgress - 0.333) / 0.333;
        targetGroupX = 0;
        targetRotX = 0.93 - p * 0.4;
        targetRotY = -1.02 + p * 0.8;
        targetRotZ = 0.50 - p * 0.3;
        targetCameraZ = 82 - p * 16; // Dolly into stardust
      } else {
        const p = (smoothProgress - 0.666) / 0.334;
        targetGroupX = isDesktop ? -12 * p : 0;
        targetRotX = 0.53 - p * 0.15;
        targetRotY = -0.22 + p * 0.85;
        targetRotZ = 0.20 - p * 0.45;
        targetCameraZ = 66 + p * 14;
      }

      // Add gentle harmonic hover + mouse parallax
      const hoverY = Math.sin(time * 1.6) * 1.0;
      droneGroup.position.x += (targetGroupX + mouseNdcX * 4 - droneGroup.position.x) * 0.06;
      droneGroup.position.y += (hoverY + mouseNdcY * 3 - droneGroup.position.y) * 0.06;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

      droneGroup.rotation.x += (targetRotX - mouseNdcY * 0.2 - droneGroup.rotation.x) * 0.06;
      droneGroup.rotation.y += (targetRotY + mouseNdcX * 0.3 + time * 0.04 - droneGroup.rotation.y) * 0.06;
      droneGroup.rotation.z += (targetRotZ - droneGroup.rotation.z) * 0.06;

      // Update particle vertex positions
      const positions = posAttr.array as Float32Array;
      const colors = colAttr.array as Float32Array;

      // Subtle turbulent swirl when in transition
      const turbulence = Math.sin(smoothProgress * Math.PI) * 1.8;

      for (let i = 0; i < TOTAL; i++) {
        const idx = i * 3;

        // Target interpolated position
        const targetX = fromPos[idx] + (toPos[idx] - fromPos[idx]) * easeT;
        const targetY = fromPos[idx + 1] + (toPos[idx + 1] - fromPos[idx + 1]) * easeT;
        const targetZ = fromPos[idx + 2] + (toPos[idx + 2] - fromPos[idx + 2]) * easeT;

        // Apply spring velocity toward interpolated target
        const dx = targetX - positions[idx];
        const dy = targetY - positions[idx + 1];
        const dz = targetZ - positions[idx + 2];

        velocities[idx] = velocities[idx] * 0.82 + dx * 0.09;
        velocities[idx + 1] = velocities[idx + 1] * 0.82 + dy * 0.09;
        velocities[idx + 2] = velocities[idx + 2] * 0.82 + dz * 0.09;

        // Add turbulence curl when morphing between shapes
        if (turbulence > 0.1) {
          const curlX = Math.sin(time * 2 + positions[idx + 1] * 0.1) * turbulence * 0.08;
          const curlY = Math.cos(time * 2 + positions[idx] * 0.1) * turbulence * 0.08;
          positions[idx] += curlX;
          positions[idx + 1] += curlY;
        }

        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];

        // Color interpolation
        colors[idx] += ((fromCol[idx] + (toCol[idx] - fromCol[idx]) * easeT) - colors[idx]) * 0.08;
        colors[idx + 1] += ((fromCol[idx + 1] + (toCol[idx + 1] - fromCol[idx + 1]) * easeT) - colors[idx + 1]) * 0.08;
        colors[idx + 2] += ((fromCol[idx + 2] + (toCol[idx + 2] - fromCol[idx + 2]) * easeT) - colors[idx + 2]) * 0.08;
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
      material.dispose();
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
        zIndex: 1
      }}
    />
  );
};
