import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DroneWaveHeaderCanvas
 * Implements the exact Matrix Homepage Particle System:
 * - 14,080 terrain particles (160 cols x 88 rows)
 * - 560 ASCII star twinkles ('.', '*', '+')
 * - Concentric celestial shockwave / orbital rings
 * - Vertical light needle beam
 * - Custom Shader with ASCII Star Twinkles & Foreground Optical Bokeh
 * - Multi-frequency rolling terrain wave dynamics
 * - Deep obsidian black (#000000) backdrop
 */
export const DroneWaveHeaderCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 38.0);
    camera.lookAt(0, -1.8, 0);

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
    const types = new Float32Array(TOTAL_POINTS); // 0 = terrain wave, 1 = star glyph

    const X_SPAN = 156.0;
    const Z_START = -62.0;
    const Z_END = 28.0;

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
        uIsMobile: { value: width < 768 ? 1.0 : 0.0 },
        uStarTex: { value: starGlyphTex }
      },
      vertexShader: `
        uniform float uPixelRatio;
        uniform float uTime;
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
          } else {
            alpha *= 0.95;
          }
          vAlpha = alpha;

          // Bokeh factor: foreground points expand into soft optical bokeh discs
          float bokeh = smoothstep(42.0, 22.0, depth);
          vBokeh = bokeh;

          float pSize = aSize;
          if (aType > 0.5) {
            pSize *= (0.8 + 0.5 * tw);
            float minStar = uIsMobile > 0.5 ? 1.4 : 1.0;
            float maxStar = uIsMobile > 0.5 ? 3.6 : 4.5;
            gl_PointSize = clamp(pSize * (26.0 / max(10.0, depth)) * uPixelRatio, minStar, maxStar);
          } else {
            float baseSize = uIsMobile > 0.5 ? 2.4 : 2.0;
            pSize = mix(baseSize, baseSize * 1.8, bokeh);
            float minPt = uIsMobile > 0.5 ? 2.5 : 1.2;
            float maxPt = uIsMobile > 0.5 ? 5.5 : 5.0;
            gl_PointSize = clamp(pSize * (28.0 / max(10.0, depth)) * uPixelRatio, minPt, maxPt);
          }
        }
      `,
      fragmentShader: `
        uniform sampler2D uStarTex;
        uniform float uTime;

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
            // TERRAIN WAVE PARTICLES RENDERING
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
              float sphereSparkle = 0.90 + 0.25 * sin(uTime * 3.5 + vSparkle * 6.28);
              shape = clamp((core + rim) * sphereSparkle, 0.0, 1.0);
            }

            // Pure crisp white particles
            gl_FragColor = vec4(1.0, 1.0, 1.0, shape * vAlpha);
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const terrainMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(terrainMesh);

    // --- 5. Concentric Celestial Shockwave / Orbital Rings ---
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, 14.0, -34.0);
    scene.add(ringsGroup);

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
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const beamLine = new THREE.Line(beamGeo, beamMat);
    ringsGroup.add(beamLine);

    // --- 6. Mouse Interaction & Parallax ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- 7. Window Resize ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      particleMaterial.uniforms.uIsMobile.value = width < 768 ? 1.0 : 0.0;
    };

    window.addEventListener('resize', handleResize);

    // --- 8. Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      particleMaterial.uniforms.uTime.value = time;

      // Camera smooth parallax (exact homepage positioning)
      camera.position.x += (mouseX * 2.8 - camera.position.x) * 0.04;
      camera.position.y += ((1.8 + mouseY * 1.2) - camera.position.y) * 0.05;
      camera.lookAt(0, -1.8, 0);

      // Multi-frequency rolling terrain wave dynamics (exact homepage formulas)
      const pPos = posAttr.array as Float32Array;

      for (let r = 0; r < ROWS; r++) {
        const zNorm = r / (ROWS - 1);
        const z = Z_START + zNorm * (Z_END - Z_START);

        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          const idx = i * 3;
          const x = (c / (COLS - 1) - 0.5) * X_SPAN;

          // Exact homepage wave components
          const wave1 = Math.sin(x * 0.052 + z * 0.042 + time * 0.55) * 3.6;
          const wave2 = Math.cos(x * 0.034 - z * 0.062 + time * 0.45) * 2.4;
          const wave3 = Math.sin(x * 0.088 + time * 0.75) * 1.2;

          const yHero = -7.4 + (wave1 + wave2 + wave3) * (0.35 + zNorm * 0.65);

          pPos[idx + 1] = yHero;
        }
      }

      posAttr.needsUpdate = true;

      // Subtle breathing on concentric rings
      const ringScale = 1.0 + Math.sin(time * 0.8) * 0.04;
      ringsGroup.scale.set(ringScale, ringScale, 1.0);

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
      particleMaterial.dispose();
      starGlyphTex.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      ringMeshes.forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
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
