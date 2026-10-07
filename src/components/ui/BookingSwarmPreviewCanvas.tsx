import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface BookingSwarmPreviewCanvasProps {
  droneCount: number; // 200 to 5000
  spectacleType: string; // 'stadium' | 'pyro' | 'qr' | 'water' | 'civic' | 'indoor'
  hasPyro: boolean;
  hasLasers: boolean;
  className?: string;
}

export const BookingSwarmPreviewCanvas: React.FC<BookingSwarmPreviewCanvasProps> = ({
  droneCount,
  spectacleType,
  hasPyro,
  hasLasers,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ droneCount, spectacleType, hasPyro, hasLasers });

  useEffect(() => {
    stateRef.current = { droneCount, spectacleType, hasPyro, hasLasers };
  }, [droneCount, spectacleType, hasPyro, hasLasers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Deep obsidian midnight

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- 2. Swarm Particles Buffers (Up to 3,000 visualized RTK Drones) ---
    const MAX_DRONES = 3000;
    const positions = new Float32Array(MAX_DRONES * 3);
    const targetPositions = new Float32Array(MAX_DRONES * 3);
    const colors = new Float32Array(MAX_DRONES * 3);
    const sizes = new Float32Array(MAX_DRONES);
    const sparkles = new Float32Array(MAX_DRONES);

    const colWhite = new THREE.Color('#ffffff');
    const colCyan = new THREE.Color('#38bdf8');
    const colGold = new THREE.Color('#f59e0b');

    // Initialize initial positions into random space
    for (let i = 0; i < MAX_DRONES; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      targetPositions[i3] = positions[i3];
      targetPositions[i3 + 1] = positions[i3 + 1];
      targetPositions[i3 + 2] = positions[i3 + 2];

      const isBeacon = i % 14 === 0;
      const c = isBeacon ? colCyan : colWhite;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = isBeacon ? 1.6 : 1.15;
      sparkles[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkles, 1));

    // Starlight Drone Shaders matching Matrix theme
    const droneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uActiveCount: { value: 1200 }
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aSparkle;

        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uActiveCount;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;
          float idx = float(gl_VertexID);

          // Discard or hide points beyond active configured drone count
          if (idx >= uActiveCount) {
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // Outside clip space
            return;
          }

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depth = -mvPosition.z;
          float flicker = 0.85 + 0.25 * sin(uTime * 3.8 + aSparkle * 6.28);
          vAlpha = flicker;

          float ptSize = aSize * (36.0 / max(6.0, depth)) * uPixelRatio;
          gl_PointSize = clamp(ptSize, 1.6, 4.2);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Razor-sharp crystalline starlight node
          float core = exp(-dist * dist * 14.0);
          float rim = smoothstep(0.48, 0.16, dist) * 0.42;
          float shape = clamp(core + rim, 0.0, 1.0);

          gl_FragColor = vec4(vColor, shape * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dronePoints = new THREE.Points(geometry, droneMaterial);
    scene.add(dronePoints);

    // --- 3. Cascading Pyro Sparks Particle Field (When Pyro is ON) ---
    const PYRO_COUNT = 450;
    const pyroPositions = new Float32Array(PYRO_COUNT * 3);
    const pyroVelocities = new Float32Array(PYRO_COUNT * 3);
    const pyroColors = new Float32Array(PYRO_COUNT * 3);
    const pyroSizes = new Float32Array(PYRO_COUNT);

    for (let p = 0; p < PYRO_COUNT; p++) {
      const p3 = p * 3;
      pyroPositions[p3] = (Math.random() - 0.5) * 16;
      pyroPositions[p3 + 1] = Math.random() * 8 + 1;
      pyroPositions[p3 + 2] = (Math.random() - 0.5) * 16;

      pyroVelocities[p3] = (Math.random() - 0.5) * 0.04;
      pyroVelocities[p3 + 1] = -(Math.random() * 0.08 + 0.04); // Fall down
      pyroVelocities[p3 + 2] = (Math.random() - 0.5) * 0.04;

      pyroColors[p3] = 1.0;
      pyroColors[p3 + 1] = 0.72 + Math.random() * 0.25;
      pyroColors[p3 + 2] = 0.2;

      pyroSizes[p] = Math.random() * 1.8 + 1.2;
    }

    const pyroGeo = new THREE.BufferGeometry();
    pyroGeo.setAttribute('position', new THREE.BufferAttribute(pyroPositions, 3));
    pyroGeo.setAttribute('color', new THREE.BufferAttribute(pyroColors, 3));

    const pyroMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pyroPoints = new THREE.Points(pyroGeo, pyroMat);
    scene.add(pyroPoints);

    // --- 4. Architectural Laser Coordinate Beams (When Lasers is ON) ---
    const laserGroup = new THREE.Group();
    scene.add(laserGroup);

    const laserLines: THREE.Line[] = [];
    const LASER_BEAMS = 4;
    const laserOriginX = [-7.0, -2.5, 2.5, 7.0];

    for (let l = 0; l < LASER_BEAMS; l++) {
      const lGeo = new THREE.BufferGeometry();
      const lPts = new Float32Array([
        laserOriginX[l], -8, (Math.random() - 0.5) * 3,
        laserOriginX[l] * 0.4, 14, (Math.random() - 0.5) * 3
      ]);
      lGeo.setAttribute('position', new THREE.BufferAttribute(lPts, 3));
      const lMat = new THREE.LineBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lGeo, lMat);
      laserGroup.add(line);
      laserLines.push(line);
    }

    // --- 5. Formation Morph Calculation Helper ---
    const recomputeFormationTargets = (type: string, activeNum: number) => {
      const count = Math.min(MAX_DRONES, Math.max(200, activeNum));

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        if (type === 'stadium') {
          // 3D Volumetric Rotating Sphere with Equatorial Rings
          if (i % 6 === 0) {
            // Equatorial orbital ring
            const angle = (i / (count * 0.16)) * Math.PI * 2;
            const ringR = 11.5 + Math.sin(i * 0.2) * 0.3;
            targetPositions[i3] = Math.cos(angle) * ringR;
            targetPositions[i3 + 1] = Math.sin(angle * 3) * 0.8;
            targetPositions[i3 + 2] = Math.sin(angle) * ringR;
          } else {
            // Fibonacci Sphere
            const phi = Math.acos(1.0 - (2.0 * (i + 0.5)) / count);
            const theta = (2.0 * Math.PI * i) / 1.6180339887;
            const r = 8.5;
            targetPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
            targetPositions[i3 + 1] = r * Math.cos(phi);
            targetPositions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
          }
        } else if (type === 'pyro') {
          // Upward Apex Fountain / Cascade
          const ang = (i / count) * Math.PI * 4.0;
          const heightNorm = (i / count);
          const r = Math.sin(heightNorm * Math.PI) * 7.5;
          targetPositions[i3] = Math.cos(ang) * r;
          targetPositions[i3 + 1] = heightNorm * 14.0 - 6.5;
          targetPositions[i3 + 2] = Math.sin(ang) * r;
        } else if (type === 'qr') {
          // Architectural Planar QR Matrix Grid (Floating 3D Hologram)
          const cols = 45;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const gridX = (col - cols / 2) * 0.38;
          const gridY = (row - count / (cols * 2)) * 0.38;
          // Random QR pixel block depth
          const depthZ = (Math.sin(row * 0.8) * Math.cos(col * 0.8) > 0.2 ? 1.0 : -1.0) * 0.4;
          targetPositions[i3] = gridX;
          targetPositions[i3 + 1] = gridY;
          targetPositions[i3 + 2] = depthZ;
        } else if (type === 'water') {
          // Double Undulating Sine Ocean Waves
          const u = ((i % 55) / 55 - 0.5) * 22;
          const v = (Math.floor(i / 55) / (count / 55) - 0.5) * 16;
          const w = Math.sin(u * 0.45) * Math.cos(v * 0.45) * 3.5;
          targetPositions[i3] = u;
          targetPositions[i3 + 1] = w;
          targetPositions[i3 + 2] = v;
        } else if (type === 'civic') {
          // Grand Eagle / Heritage Chevron Wingspan
          const t = (i / count - 0.5) * 2.0; // -1 to 1
          const wingSpread = t * 13.5;
          const wingRise = -Math.abs(t) * 4.5 + Math.sin(t * 8) * 0.8 + 2.0;
          const wingDepth = Math.cos(t * Math.PI) * 4.5 - 2.0;
          targetPositions[i3] = wingSpread;
          targetPositions[i3 + 1] = wingRise;
          targetPositions[i3 + 2] = wingDepth;
        } else {
          // 'indoor' - Intimate Double-Helix Kinetic Ribbon
          const angle = (i / count) * Math.PI * 8.0;
          const radius = 5.2 + Math.sin(angle * 2.0) * 1.2;
          const ribbonY = ((i / count) - 0.5) * 14.0;
          targetPositions[i3] = Math.cos(angle) * radius;
          targetPositions[i3 + 1] = ribbonY;
          targetPositions[i3 + 2] = Math.sin(angle) * radius;
        }
      }
    };

    // Calculate initial targets
    recomputeFormationTargets(stateRef.current.spectacleType, stateRef.current.droneCount);

    // --- 6. Mouse Parallax & Resize ---
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    container.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      droneMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
    };

    window.addEventListener('resize', onResize);

    // --- 7. Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();
    let lastType = stateRef.current.spectacleType;
    let lastDroneCount = stateRef.current.droneCount;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Check if user changed configuration props
      if (
        stateRef.current.spectacleType !== lastType ||
        stateRef.current.droneCount !== lastDroneCount
      ) {
        lastType = stateRef.current.spectacleType;
        lastDroneCount = stateRef.current.droneCount;
        recomputeFormationTargets(lastType, lastDroneCount);
      }

      const activeVisualized = Math.min(MAX_DRONES, Math.max(200, stateRef.current.droneCount));
      droneMaterial.uniforms.uActiveCount.value = activeVisualized;
      droneMaterial.uniforms.uTime.value = elapsed;

      // Smooth Morph Interpolation towards target positions
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const lerpSpeed = 0.085;

      for (let i = 0; i < activeVisualized; i++) {
        const i3 = i * 3;
        posArr[i3] += (targetPositions[i3] - posArr[i3]) * lerpSpeed;
        posArr[i3 + 1] += (targetPositions[i3 + 1] - posArr[i3 + 1]) * lerpSpeed;
        posArr[i3 + 2] += (targetPositions[i3 + 2] - posArr[i3 + 2]) * lerpSpeed;
      }
      posAttr.needsUpdate = true;

      // Swarm Formation Rotation
      dronePoints.rotation.y = elapsed * 0.18;
      dronePoints.rotation.x = Math.sin(elapsed * 0.25) * 0.08;

      // Pyro Sparks Animation
      const targetPyroOpacity = stateRef.current.hasPyro ? 0.95 : 0.0;
      pyroMat.opacity += (targetPyroOpacity - pyroMat.opacity) * 0.1;

      if (pyroMat.opacity > 0.01) {
        const pyroPosAttr = pyroGeo.getAttribute('position') as THREE.BufferAttribute;
        const pyroPosArr = pyroPosAttr.array as Float32Array;

        for (let p = 0; p < PYRO_COUNT; p++) {
          const p3 = p * 3;
          pyroPosArr[p3] += pyroVelocities[p3];
          pyroPosArr[p3 + 1] += pyroVelocities[p3 + 1];
          pyroPosArr[p3 + 2] += pyroVelocities[p3 + 2];

          // Respawn spark if reached bottom
          if (pyroPosArr[p3 + 1] < -9.0) {
            pyroPosArr[p3] = (Math.random() - 0.5) * 14;
            pyroPosArr[p3 + 1] = Math.random() * 6 + 2;
            pyroPosArr[p3 + 2] = (Math.random() - 0.5) * 14;
          }
        }
        pyroPosAttr.needsUpdate = true;
      }

      // Laser Beams Animation
      const targetLaserOpacity = stateRef.current.hasLasers ? 0.75 : 0.0;
      laserLines.forEach((line, idx) => {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity += (targetLaserOpacity - mat.opacity) * 0.1;
        // Subtle rhythmic laser wobble
        line.rotation.z = Math.sin(elapsed * 2.0 + idx) * 0.08;
      });

      // Smooth Camera Parallax
      camera.position.x += (mouseX * 4.5 - camera.position.x) * 0.05;
      camera.position.y += ((4.5 + mouseY * 2.5) - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      droneMaterial.dispose();
      pyroGeo.dispose();
      pyroMat.dispose();
      laserLines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`booking-swarm-canvas-wrap ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '360px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(14, 22, 38, 0.6) 0%, #000000 90%)',
        borderRadius: '12px'
      }}
    />
  );
};
