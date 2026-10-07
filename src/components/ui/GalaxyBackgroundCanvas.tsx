import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * GalaxyBackgroundCanvas
 * Implements a clean, airy, razor-sharp 3D Spiral Galaxy particle system:
 * - Pinprick starlight nodes (1.0px - 2.2px) matching the Matrix homepage hero
 * - Zero milky haze or thick core clumping; pure obsidian black space between stars
 * - Evenly fanned logarithmic spiral arms and deep ambient crystalline pinpricks
 * - Twinkling ASCII star glyphs ('.', '*', '+')
 */
export const GalaxyBackgroundCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 15, 48);
    camera.lookAt(0, -1, -5);

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

    // --- 2. ASCII Star Glyphs Texture Sheet ('.', '*', '+') ---
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

    // --- 3. Construct Airy Galaxy with Denser, Brighter Core & Celestial Halo ---
    const SPIRAL_COUNT = 7500;
    const CORE_COUNT = 4200; // Condensed, bright central nucleus
    const AMBIENT_COUNT = 1800;
    const GLYPH_COUNT = 400;
    const TOTAL_POINTS = SPIRAL_COUNT + CORE_COUNT + AMBIENT_COUNT + GLYPH_COUNT;

    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const sizes = new Float32Array(TOTAL_POINTS);
    const sparkles = new Float32Array(TOTAL_POINTS);
    const types = new Float32Array(TOTAL_POINTS); // 0 = sharp pinpoint starlight, 1 = star glyph
    const twinkles = new Float32Array(TOTAL_POINTS);

    const ARMS = 3;
    const RADIUS = 54.0;
    const SPIN = 1.15;

    // Starlight palette: pure white starlight (#ffffff) and cool crystalline silver/cyan (#bae6fd)
    const colWhite = new THREE.Color('#ffffff');
    const colCyan = new THREE.Color('#bae6fd');
    const colSilver = new THREE.Color('#e2e8f0');

    // 3a. Logarithmic Spiral Arms (Smooth outward sweep)
    for (let i = 0; i < SPIRAL_COUNT; i++) {
      const i3 = i * 3;

      const rRatio = Math.pow(Math.random(), 1.35);
      const r = 1.0 + rRatio * (RADIUS - 1.0);

      const armAngle = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spinAngle = r * SPIN;

      // Crisp arm spread
      const spread = 0.24 * r + 0.5;
      const dx = (Math.random() - 0.5) * spread;
      const dy = (Math.random() - 0.5) * (spread * 0.35);
      const dz = (Math.random() - 0.5) * spread;

      positions[i3] = Math.cos(armAngle + spinAngle) * r + dx;
      positions[i3 + 1] = dy;
      positions[i3 + 2] = Math.sin(armAngle + spinAngle) * r + dz;

      // Pure crisp white with subtle cyan starlight hints
      const ptColor = new THREE.Color();
      if (rRatio < 0.35) {
        ptColor.copy(colWhite);
      } else if (rRatio < 0.75) {
        ptColor.lerpColors(colWhite, colCyan, (rRatio - 0.35) / 0.4);
      } else {
        ptColor.lerpColors(colCyan, colSilver, (rRatio - 0.75) / 0.25);
      }

      // Slightly brighter toward inner radius
      const br = (0.85 + Math.random() * 0.25) * (1.0 + (1.0 - rRatio) * 0.30);
      colors[i3] = ptColor.r * br;
      colors[i3 + 1] = ptColor.g * br;
      colors[i3 + 2] = ptColor.b * br;

      sizes[i] = 1.05 + Math.random() * 0.35;
      sparkles[i] = Math.random();
      types[i] = 0.0;
      twinkles[i] = Math.random();
    }

    // 3b. Condensed Central Core Nucleus (Tightly grouped & brilliantly luminous)
    for (let c = 0; c < CORE_COUNT; c++) {
      const idx = SPIRAL_COUNT + c;
      const idx3 = idx * 3;

      // Elliptical galactic nucleus: concentrated tightly inward
      const rCore = Math.pow(Math.random(), 2.2) * 8.8;
      const theta = Math.random() * Math.PI * 2;
      const coreSpread = 0.12 * rCore + 0.22;
      const dy = (Math.random() - 0.5) * (coreSpread * 0.5);

      positions[idx3] = Math.cos(theta) * rCore + (Math.random() - 0.5) * coreSpread;
      positions[idx3 + 1] = dy;
      positions[idx3 + 2] = Math.sin(theta) * (rCore * 0.8) + (Math.random() - 0.5) * coreSpread;

      // Radiant brightness boost in the center (1.35x - 2.2x pure starlight)
      const coreProximity = 1.0 - (rCore / 8.8);
      const coreBr = 1.35 + coreProximity * 0.85;

      colors[idx3] = 1.0 * coreBr;
      colors[idx3 + 1] = 1.0 * coreBr;
      colors[idx3 + 2] = (0.95 + coreProximity * 0.05) * coreBr;

      sizes[idx] = 1.25 + coreProximity * 0.50;
      sparkles[idx] = Math.random();
      types[idx] = 0.0;
      twinkles[idx] = Math.random();
    }

    // 3c. Deep Space Ambient Pinprick Stars
    for (let s = 0; s < AMBIENT_COUNT; s++) {
      const idx = SPIRAL_COUNT + CORE_COUNT + s;
      const idx3 = idx * 3;

      positions[idx3] = (Math.random() - 0.5) * 175;
      positions[idx3 + 1] = (Math.random() - 0.5) * 90 + 3;
      positions[idx3 + 2] = (Math.random() - 0.5) * 125 - 15;

      const starBr = 0.65 + Math.random() * 0.35;
      colors[idx3] = starBr;
      colors[idx3 + 1] = starBr;
      colors[idx3 + 2] = starBr;

      sizes[idx] = 0.95 + Math.random() * 0.25;
      sparkles[idx] = Math.random();
      types[idx] = 0.0;
      twinkles[idx] = Math.random();
    }

    // 3d. ASCII Star Glyphs ('.', '*', '+')
    for (let g = 0; g < GLYPH_COUNT; g++) {
      const idx = SPIRAL_COUNT + CORE_COUNT + AMBIENT_COUNT + g;
      const idx3 = idx * 3;

      positions[idx3] = (Math.random() - 0.5) * 155;
      positions[idx3 + 1] = (Math.random() - 0.5) * 80 + 2;
      positions[idx3 + 2] = (Math.random() - 0.5) * 105 - 10;

      colors[idx3] = 1.0;
      colors[idx3 + 1] = 1.0;
      colors[idx3 + 2] = 1.0;

      sizes[idx] = 2.4 + Math.random() * 0.8;
      sparkles[idx] = Math.random();
      types[idx] = 1.0;
      twinkles[idx] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkles, 1));
    geometry.setAttribute('aType', new THREE.BufferAttribute(types, 1));
    geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1));

    // --- 4. Custom Razor-Sharp Starlight Shader (Homepage Match) ---
    const galaxyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2.0) },
        uStarTex: { value: starGlyphTex }
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aSparkle;
        attribute float aType;
        attribute float aTwinkle;

        uniform float uTime;
        uniform float uPixelRatio;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vSparkle;
        varying float vType;
        varying float vTwinkle;

        void main() {
          vColor = aColor;
          vType = aType;
          vSparkle = aSparkle;
          vTwinkle = fract(aTwinkle + uTime * 0.12);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depth = -mvPosition.z;

          // Starlight twinkle flicker with subtle extra sparkle in the core
          float coreFactor = smoothstep(26.0, 3.0, length(position.xz));
          float flicker = (0.86 + coreFactor * 0.22) + 0.28 * sin(uTime * 3.2 + aSparkle * 6.28);
          vAlpha = flicker;

          if (aType > 0.5) {
            // ASCII glyphs ('.', '*', '+')
            float glyphSize = (2.6 + aSparkle * 0.8) * (28.0 / max(8.0, depth)) * uPixelRatio;
            gl_PointSize = clamp(glyphSize, 2.0, 5.0);
          } else {
            // RAZOR-SHARP PINPOINT STARLIGHT: Crisp needle dots clamped 1.5px - 3.8px
            float ptSize = aSize * (30.0 / max(8.0, depth)) * uPixelRatio;
            gl_PointSize = clamp(ptSize, 1.5, 3.8);
          }
        }
      `,
      fragmentShader: `
        uniform sampler2D uStarTex;
        uniform float uTime;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vSparkle;
        varying float vType;
        varying float vTwinkle;

        void main() {
          if (vType > 0.5) {
            // ASCII Star Glyphs ('.', '*', '+')
            float cell = 0.0;
            if (vTwinkle > 0.70) {
              cell = 2.0; // '+'
            } else if (vTwinkle > 0.35) {
              cell = 1.0; // '*'
            } else {
              cell = 0.0; // '.'
            }

            vec2 uv = gl_PointCoord;
            uv.x = (uv.x + cell) / 3.0;
            vec4 texCol = texture2D(uStarTex, uv);
            if (texCol.r < 0.15) discard;

            gl_FragColor = vec4(1.0, 1.0, 1.0, texCol.r * vAlpha * 0.95);
          } else {
            // RAZOR-SHARP PINPOINT STARLIGHT (Direct homepage starlight formula)
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            // Sharp needle core with radiant starlight falloff
            float core = exp(-dist * dist * 14.0);
            float rim = smoothstep(0.48, 0.16, dist) * 0.42;
            float shape = clamp(core + rim, 0.0, 1.0);

            // Crisp starlight node with vivid luminous presence
            gl_FragColor = vec4(vColor, shape * vAlpha);
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyPoints = new THREE.Points(geometry, galaxyMaterial);
    galaxyPoints.rotation.x = 0.52;
    galaxyPoints.rotation.z = -0.10;
    scene.add(galaxyPoints);

    // --- 5. Subtle Celestial Core Glow Halo (Delicate light emanating from middle) ---
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gCtx = glowCanvas.getContext('2d');
    if (gCtx) {
      const grad = gCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.55)');   // crisp white luminous nucleus
      grad.addColorStop(0.12, 'rgba(240, 248, 255, 0.32)');  // bright cool white
      grad.addColorStop(0.28, 'rgba(186, 230, 253, 0.14)');  // crystalline starlight cyan
      grad.addColorStop(0.52, 'rgba(125, 211, 252, 0.04)');  // faint celestial atmosphere
      grad.addColorStop(0.78, 'rgba(56, 189, 248, 0.01)');   // zero-fallout edge
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 256, 256);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.70
    });
    const coreGlowSprite = new THREE.Sprite(glowMat);
    coreGlowSprite.position.set(0, 0, 0);
    coreGlowSprite.scale.set(26.0, 16.0, 1.0);
    scene.add(coreGlowSprite);

    // --- 6. Mouse Parallax & Window Resize ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      galaxyMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2.0);
    };

    window.addEventListener('resize', handleResize);

    // --- 7. 60 FPS Render Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      galaxyMaterial.uniforms.uTime.value = elapsedTime;

      // Subtle, slow galactic rotation
      galaxyPoints.rotation.y = elapsedTime * 0.032;

      // Gentle celestial core light breathing pulse
      const pulse = 1.0 + Math.sin(elapsedTime * 1.5) * 0.06;
      coreGlowSprite.scale.set(26.0 * pulse, 16.0 * pulse, 1.0);

      // Smooth camera interpolation
      camera.position.x += (mouseX * 3.2 - camera.position.x) * 0.04;
      camera.position.y += ((15 + mouseY * 2.0) - camera.position.y) * 0.04;
      camera.lookAt(0, -1, -5);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      galaxyMaterial.dispose();
      starGlyphTex.dispose();
      glowTex.dispose();
      glowMat.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
