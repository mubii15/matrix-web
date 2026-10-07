import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HandshakeParticleCanvasProps {
  className?: string;
}

export const HandshakeParticleCanvas: React.FC<HandshakeParticleCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 43.0);
    camera.lookAt(0, 2.4, 0);

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

    // --- 2. Particle System Definition (14,080 particles) ---
    const COLS = 160;
    const ROWS = 88;
    const TOTAL_PARTICLES = COLS * ROWS; // 14,080

    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    const colors = new Float32Array(TOTAL_PARTICLES * 3);
    const sizes = new Float32Array(TOTAL_PARTICLES);
    const opacities = new Float32Array(TOTAL_PARTICLES);
    const sparkles = new Float32Array(TOTAL_PARTICLES);

    // Dispersion vectors for the assembly / formation effect
    const disperseVectors = new Float32Array(TOTAL_PARTICLES * 3);
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const ang = (i / TOTAL_PARTICLES) * Math.PI * 10.0 + (i % 19) * 0.5;
      const rad = 24.0 + (i % 29) * 1.6;
      disperseVectors[i * 3] = Math.cos(ang) * rad;
      disperseVectors[i * 3 + 1] = ((i % 37) / 37 - 0.45) * 30.0;
      disperseVectors[i * 3 + 2] = Math.sin(ang) * rad - 6.0;

      // Initial positions start in dispersed cosmic cloud
      positions[i * 3] = disperseVectors[i * 3];
      positions[i * 3 + 1] = disperseVectors[i * 3 + 1];
      positions[i * 3 + 2] = disperseVectors[i * 3 + 2];

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;

      sizes[i] = 1.8 + Math.random() * 1.4;
      opacities[i] = 0.85 + Math.random() * 0.15;
      sparkles[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkles, 1));

    // Custom Starlight Node Particle Shader
    const isMobile = width < 768;
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uTime: { value: 0 },
        uIsMobile: { value: isMobile ? 1.0 : 0.0 }
      },
      vertexShader: `
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uIsMobile;

        attribute float aSize;
        attribute vec3 aColor;
        attribute float aOpacity;
        attribute float aSparkle;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vSparkle;

        void main() {
          vColor = aColor;
          vSparkle = aSparkle;

          vec4 modelPos = modelMatrix * vec4(position, 1.0);
          vec4 viewPos = viewMatrix * modelPos;
          gl_Position = projectionMatrix * viewPos;

          float depth = -viewPos.z;

          float tw = 0.5 + 0.5 * sin(uTime * 2.8 + aSparkle * 6.28);
          vAlpha = aOpacity * (0.8 + 0.2 * tw);

          float targetSize = uIsMobile > 0.5 ? (1.2 + aSparkle * 0.5) : (1.45 + aSparkle * 0.8);
          float minPt = uIsMobile > 0.5 ? 2.2 : 1.3;
          float maxPt = uIsMobile > 0.5 ? 4.8 : 5.0;
          gl_PointSize = clamp(targetSize * (28.0 / max(10.0, depth)) * uPixelRatio, minPt, maxPt);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vSparkle;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Glistening starlight node with radiant pure white core and soft perimeter glow
          float core = exp(-dist * dist * 14.0);
          float rim = smoothstep(0.48, 0.16, dist) * 0.42;
          float flicker = 0.90 + 0.22 * sin(uTime * 3.5 + vSparkle * 6.28);
          float shape = clamp((core + rim) * flicker, 0.0, 1.0);

          gl_FragColor = vec4(1.0, 1.0, 1.0, shape * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(particlesMesh);

    // --- 3. Subtle Background Cosmic Stardust Stars ---
    const createSparkleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 48;
      c.height = 48;
      const cCtx = c.getContext('2d');
      if (!cCtx) return new THREE.Texture();
      cCtx.clearRect(0, 0, 48, 48);

      const rad = cCtx.createRadialGradient(24, 24, 0, 24, 24, 20);
      rad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
      rad.addColorStop(0.22, 'rgba(255, 255, 255, 0.55)');
      rad.addColorStop(0.55, 'rgba(224, 242, 254, 0.12)');
      rad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      cCtx.fillStyle = rad;
      cCtx.beginPath();
      cCtx.arc(24, 24, 20, 0, Math.PI * 2);
      cCtx.fill();

      const tex = new THREE.CanvasTexture(c);
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
      let sx = 0, sy = 0, sz = 0;
      if (k < 45) {
        sx = (Math.random() - 0.5) * 56.0;
        sy = Math.random() * 16.0 + 14.5;
        sz = (Math.random() - 0.5) * 16.0 - 10.0;
      } else if (k < 90) {
        sx = -(Math.random() * 26.0 + 12.5);
        sy = Math.random() * 18.0 + 4.0;
        sz = (Math.random() - 0.5) * 18.0 - 10.0;
      } else {
        sx = Math.random() * 26.0 + 12.5;
        sy = Math.random() * 18.0 + 4.0;
        sz = (Math.random() - 0.5) * 18.0 - 10.0;
      }

      hsPositions[k * 3] = sx;
      hsPositions[k * 3 + 1] = sy;
      hsPositions[k * 3 + 2] = sz;

      hsColors[k * 3] = 1.0;
      hsColors[k * 3 + 1] = 1.0;
      hsColors[k * 3 + 2] = 1.0;

      hsSizes[k] = Math.random() * 1.6 + 1.2;
      hsAlphas[k] = Math.random() * 0.35 + 0.2;
      hsSparkles[k] = Math.random();
      hsDrift[k * 3] = (Math.random() - 0.5) * 0.25;
      hsDrift[k * 3 + 1] = Math.random() * 0.20 + 0.08;
      hsDrift[k * 3 + 2] = (Math.random() - 0.5) * 0.20;
    }

    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(hsPositions, 3));
    starsGeo.setAttribute('aColor', new THREE.BufferAttribute(hsColors, 3));
    starsGeo.setAttribute('aSize', new THREE.BufferAttribute(hsSizes, 1));
    starsGeo.setAttribute('aAlpha', new THREE.BufferAttribute(hsAlphas, 1));
    starsGeo.setAttribute('aSparkle', new THREE.BufferAttribute(hsSparkles, 1));
    starsGeo.setAttribute('aDrift', new THREE.BufferAttribute(hsDrift, 3));

    const starsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uTexture: { value: sparkleTex }
      },
      vertexShader: `
        uniform float uTime;
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

          float tw = 0.45 + 0.55 * sin(uTime * (1.1 + aSparkle * 1.5) + aSparkle * 6.28);
          float microGlint = pow(max(0.0, sin(uTime * 0.8 + aSparkle * 7.0)), 8.0) * 0.28;
          vAlpha = aAlpha * clamp(tw + microGlint, 0.0, 1.0);

          vec3 pos = position + vec3(
            sin(uTime * 0.3 + aSparkle * 4.0) * aDrift.x,
            cos(uTime * 0.4 + aSparkle * 5.0) * aDrift.y,
            sin(uTime * 0.3 + aSparkle * 3.0) * aDrift.z
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depth = -mvPosition.z;
          float pSize = aSize * (1.0 + microGlint * 0.2);
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

    const starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    // --- 4. Load Handshake Binary Coordinates ---
    const handshakeTarget = new Float32Array(TOTAL_PARTICLES * 4);
    let coordsLoaded = false;

    fetch('/handshake_target_coords.bin?v=1')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_PARTICLES * 4 * 4) {
          handshakeTarget.set(new Float32Array(buf));
          coordsLoaded = true;
        }
      })
      .catch(e => console.error('Failed to load handshake coords:', e));

    // --- 5. Formation & Animation State ---
    let time = 0;
    let formationProgress = 0; // 0 (dispersed) -> 1 (fully formed into handshake)
    let animId: number;

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
      particleMaterial.uniforms.uIsMobile.value = width < 768 ? 1.0 : 0.0;
      starsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
    };

    window.addEventListener('resize', handleResize);

    // Mouse parallax tilt
    const mousePos = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePos.targetX = nx * 1.2;
      mousePos.targetY = ny * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      time += 0.016;

      // Smoothly advance formation progress over ~1.6 seconds once coordinates are loaded
      if (coordsLoaded && formationProgress < 1.0) {
        formationProgress = Math.min(1.0, formationProgress + 0.014);
      }

      // Smooth cubic easing for the convergence
      const easeFormation = 1.0 - Math.pow(1.0 - formationProgress, 3);

      // Smooth mouse parallax
      mousePos.x += (mousePos.targetX - mousePos.x) * 0.05;
      mousePos.y += (mousePos.targetY - mousePos.y) * 0.05;

      camera.position.x = mousePos.x;
      camera.position.y = 3.2 - mousePos.y * 0.5;
      camera.lookAt(0, 2.4, 0);

      // Update uniforms
      particleMaterial.uniforms.uTime.value = time;
      starsMat.uniforms.uTime.value = time;

      const pPos = posAttr.array as Float32Array;
      const screenWidth = width;
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;

      const handScale = isMobileScreen ? 0.72 : (isTabletScreen ? 0.88 : 1.0);
      const handOffsetY = isMobileScreen ? 5.2 : (isTabletScreen ? 4.2 : 3.4);

      if (coordsLoaded) {
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
          const hIdx = i * 4;
          const rawHx = handshakeTarget[hIdx];
          const rawHy = handshakeTarget[hIdx + 1];
          const rawHz = handshakeTarget[hIdx + 2];
          const hComp = handshakeTarget[hIdx + 3];

          let targetX = 0, targetY = 0, targetZ = 0;

          if (hComp === 0) {
            // Figures: gentle organic starlight breathing
            const breathe = Math.sin(time * 1.8 + i * 0.15) * 0.08;
            targetX = rawHx;
            targetY = rawHy + breathe;
            targetZ = rawHz;
          } else {
            // Dunes: subtle flowing wave across the horizon
            const duneWave = Math.sin(rawHx * 0.35 + time * 1.4) * 0.12 + Math.cos(rawHz * 0.4 + time * 1.1) * 0.08;
            targetX = rawHx;
            targetY = rawHy + duneWave;
            targetZ = rawHz;
          }

          // Apply scale and offset
          targetX = targetX * handScale;
          targetY = targetY * handScale + handOffsetY;
          targetZ = targetZ * handScale;

          // Dispersed swirl position before full assembly
          const dispX = disperseVectors[i * 3] + Math.sin(time * 1.5 + i * 0.1) * 1.2;
          const dispY = disperseVectors[i * 3 + 1] + Math.cos(time * 1.3 + i * 0.1) * 1.2;
          const dispZ = disperseVectors[i * 3 + 2];

          // Interpolate between dispersed cloud and assembled handshake
          pPos[i * 3] = THREE.MathUtils.lerp(dispX, targetX, easeFormation);
          pPos[i * 3 + 1] = THREE.MathUtils.lerp(dispY, targetY, easeFormation);
          pPos[i * 3 + 2] = THREE.MathUtils.lerp(dispZ, targetZ, easeFormation);
        }

        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      sparkleTex.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`handshake-particle-canvas-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    />
  );
};
