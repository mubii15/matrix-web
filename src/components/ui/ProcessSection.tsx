import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

export interface ProcessStep {
  id: string;
  stepNum: string;
  title: string;
  line: string;
  specs: string[];
  accent: string;
  glow: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    stepNum: '01',
    title: 'DISCOVER',
    line: 'We learn your event.',
    specs: ['Creative Concept & Vision', 'Site Survey & Airspace Checks', 'Show Timeline & Scale'],
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)'
  },
  {
    id: 'design',
    stepNum: '02',
    title: 'DESIGN',
    line: 'We build it in Matrix Designer.',
    specs: ['3D Choreography & Formations', 'Text & Logo Conversion', 'Music & Timecode Lock'],
    accent: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.45)'
  },
  {
    id: 'simulate',
    stepNum: '03',
    title: 'SIMULATE',
    line: 'You approve it in 3D.',
    specs: ['360° Photorealistic Preview', 'Millimeter Safety Tolerances', 'Client Sign-off & Lock'],
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.45)'
  },
  {
    id: 'fly',
    stepNum: '04',
    title: 'FLY',
    line: 'Our crew flies it live.',
    specs: ['Licensed Commercial Pilots', 'Dual-Redundant Ground Ops', 'Flawless Live Execution'],
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)'
  }
];

export const ProcessSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sticky track scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const totalDist = track.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalDist, 0), 1);
      setScrollProgress(progress);

      // Determine active step based on scrollProgress
      let step = 0;
      if (progress < 0.28) {
        step = 0;
      } else if (progress < 0.54) {
        step = 1;
      } else if (progress < 0.80) {
        step = 2;
      } else {
        step = 3;
      }
      setActiveStepIndex(step);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific step by scrolling
  const scrollToStep = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const targetProgress = [0.08, 0.38, 0.65, 0.92][idx];
    const totalDist = track.offsetHeight - window.innerHeight;
    const targetScrollY = track.offsetTop + targetProgress * totalDist;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    soundEngine.playChime(480 + idx * 60, 'sine', 0.15);
  };

  // Mobile Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Next
        scrollToStep(Math.min(3, activeStepIndex + 1));
      } else {
        // Prev
        scrollToStep(Math.max(0, activeStepIndex - 1));
      }
    }
    setTouchStartX(null);
  };

  // -------------------------------------------------------------
  // THREE.JS Particle System for 01, 02, 03, 04 Numbers
  // -------------------------------------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent overlay over container dark background

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const TOTAL_POINTS = 9600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const sizes = new Float32Array(TOTAL_POINTS);

    // Initial random positions while binary coordinates load
    for (let i = 0; i < TOTAL_POINTS; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      colors[i * 3] = 0.22;
      colors[i * 3 + 1] = 0.74;
      colors[i * 3 + 2] = 0.97;
      sizes[i] = 1.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material with glowing point aesthetics
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        // Radial soft exponential falloff
        float intensity = exp(-dist * 4.2);
        gl_FragColor = vec4(vColor * 1.35, intensity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Load binary coordinates (9600 points * 16 floats = 614,400 bytes)
    let coordsData: Float32Array | null = null;
    fetch('/process_coords.bin')
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (buf.byteLength === TOTAL_POINTS * 16 * 4) {
          coordsData = new Float32Array(buf);
        }
      })
      .catch(err => console.error('Failed to load process coords:', err));

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const colorCyan = new THREE.Color('#38bdf8');
    const colorIndigo = new THREE.Color('#818cf8');
    const colorTeal = new THREE.Color('#06b6d4');
    const colorAmber = new THREE.Color('#f59e0b');
    const colorDim = new THREE.Color('#1e293b');

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Read current progress from ref/state
      const track = trackRef.current;
      let currentProgress = 0;
      if (track) {
        const rect = track.getBoundingClientRect();
        const totalDist = track.offsetHeight - window.innerHeight;
        if (totalDist > 0) {
          currentProgress = Math.min(Math.max(-rect.top / totalDist, 0), 1);
        }
      }

      const isMobileView = (container?.clientWidth || window.innerWidth) < 768;

      if (coordsData) {
        const posArray = geometry.attributes.position.array as Float32Array;
        const colArray = geometry.attributes.color.array as Float32Array;
        const sizeArray = geometry.attributes.size.array as Float32Array;

        // Subtle ambient camera drift
        camera.position.x = Math.sin(time * 0.4) * 0.4;
        camera.position.y = Math.cos(time * 0.3) * 0.3;
        camera.lookAt(0, 0, 0);

        for (let i = 0; i < TOTAL_POINTS; i++) {
          const idx = i * 3;
          const bIdx = i * 16;

          let targetX = 0;
          let targetY = 0;
          let targetZ = 0;
          let step = 1;

          if (!isMobileView) {
            // Desktop: all 4 numbers (01, 02, 03, 04) side by side
            targetX = coordsData[bIdx + 0];
            targetY = coordsData[bIdx + 1];
            targetZ = coordsData[bIdx + 2];
            step = Math.round(coordsData[bIdx + 3]);
          } else {
            // Mobile: smoothly morph between centered 01, 02, 03, 04
            // Step 1: 0.00 - 0.25 (m1 -> bIdx+4)
            // Step 2: 0.25 - 0.50 (m2 -> bIdx+7)
            // Step 3: 0.50 - 0.75 (m3 -> bIdx+10)
            // Step 4: 0.75 - 1.00 (m4 -> bIdx+13)
            let mFromOffset = 4;
            let mToOffset = 4;
            let morphT = 0;

            if (currentProgress < 0.28) {
              mFromOffset = 4;
              mToOffset = 4;
              morphT = 0;
              step = 1;
            } else if (currentProgress < 0.54) {
              mFromOffset = 4;
              mToOffset = 7;
              morphT = (currentProgress - 0.28) / (0.54 - 0.28);
              step = morphT > 0.5 ? 2 : 1;
            } else if (currentProgress < 0.80) {
              mFromOffset = 7;
              mToOffset = 10;
              morphT = (currentProgress - 0.54) / (0.80 - 0.54);
              step = morphT > 0.5 ? 3 : 2;
            } else {
              mFromOffset = 10;
              mToOffset = 13;
              morphT = (currentProgress - 0.80) / (1.0 - 0.80);
              step = morphT > 0.5 ? 4 : 3;
            }

            const fx = coordsData[bIdx + mFromOffset];
            const fy = coordsData[bIdx + mFromOffset + 1];
            const fz = coordsData[bIdx + mFromOffset + 2];

            const tx = coordsData[bIdx + mToOffset];
            const ty = coordsData[bIdx + mToOffset + 1];
            const tz = coordsData[bIdx + mToOffset + 2];

            // Smooth cubic ease for morph
            const smoothT = morphT * morphT * (3 - 2 * morphT);
            targetX = fx + (tx - fx) * smoothT;
            targetY = fy + (ty - fy) * smoothT + 0.8; // Lifted slightly on mobile for clearance
            targetZ = fz + (tz - fz) * smoothT;
          }

          // Active phase highlight
          let isActive = false;
          let stepColor = colorCyan;
          if (step === 1) {
            isActive = currentProgress < 0.28;
            stepColor = colorCyan;
          } else if (step === 2) {
            isActive = currentProgress >= 0.28 && currentProgress < 0.54;
            stepColor = colorIndigo;
          } else if (step === 3) {
            isActive = currentProgress >= 0.54 && currentProgress < 0.80;
            stepColor = colorTeal;
          } else {
            isActive = currentProgress >= 0.80;
            stepColor = colorAmber;
          }

          // Organic breathing oscillation
          const wave = Math.sin(time * 2.2 + targetX * 0.4 + i * 0.15) * 0.12;
          const px = targetX;
          const py = targetY + wave;
          const pz = targetZ + Math.cos(time * 1.8 + targetY * 0.3) * 0.15;

          // Smooth lerp into position
          posArray[idx] = THREE.MathUtils.lerp(posArray[idx], px, 0.12);
          posArray[idx + 1] = THREE.MathUtils.lerp(posArray[idx + 1], py, 0.12);
          posArray[idx + 2] = THREE.MathUtils.lerp(posArray[idx + 2], pz, 0.12);

          // Particle color & size: active numeral glows brightly, inactive is dim cybernetic
          const targetColor = isActive ? stepColor : colorDim;
          const sparkle = (Math.sin(time * 4.0 + i) * 0.5 + 0.5) * (isActive ? 0.4 : 0.1);

          colArray[idx] = THREE.MathUtils.lerp(colArray[idx], targetColor.r + sparkle, 0.1);
          colArray[idx + 1] = THREE.MathUtils.lerp(colArray[idx + 1], targetColor.g + sparkle, 0.1);
          colArray[idx + 2] = THREE.MathUtils.lerp(colArray[idx + 2], targetColor.b + sparkle, 0.1);

          sizeArray[i] = isActive 
            ? (isMobileView ? 2.4 : 2.1) + sparkle * 1.2 
            : (isMobileView ? 1.4 : 1.2);
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const activeStep = processSteps[activeStepIndex] || processSteps[0];

  return (
    <section 
      id="process"
      ref={trackRef}
      style={{
        position: 'relative',
        height: '280vh',
        background: '#030508',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Pinned Sticky 100vh Viewport */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '70px 16px 20px 16px' : '90px 48px 36px 48px',
          boxSizing: 'border-box'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Continuous 3D Numbers Particle Canvas in Background */}
        <div 
          ref={canvasContainerRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Top Header & Fast-Flow Bar */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1240px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Eyebrow: [02 // PROCESS] */}
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.70rem' : '0.78rem',
              color: '#38bdf8',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: isMobile ? '4px' : '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>[02 // PROCESS]</span>
          </div>

          {/* Headline: From idea to airborne. */}
          <h2 
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: isMobile ? 'clamp(1.6rem, 5vw, 2.1rem)' : 'clamp(2.4rem, 4vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: isMobile ? '8px' : '14px'
            }}
          >
            From idea to airborne.
          </h2>

          {/* User's Pipeline Bar: 01 DISCOVER → 02 DESIGN → 03 SIMULATE → 04 FLY */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '6px' : '14px',
              flexWrap: 'wrap',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '30px',
              padding: isMobile ? '6px 12px' : '8px 20px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          >
            {processSteps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => scrollToStep(idx)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isActive ? `${step.accent}20` : 'transparent',
                      border: isActive ? `1px solid ${step.accent}80` : '1px solid transparent',
                      padding: isMobile ? '4px 8px' : '4px 12px',
                      borderRadius: '20px',
                      color: isActive ? step.accent : 'rgba(255, 255, 255, 0.55)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: isMobile ? '0.64rem' : '0.74rem',
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <span>{step.stepNum}</span>
                    <span>{step.title}</span>
                  </button>
                  {idx < processSteps.length - 1 && (
                    <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: isMobile ? '0.62rem' : '0.74rem' }}>
                      →
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div 
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: isMobile ? '0.72rem' : '0.82rem',
              color: 'rgba(255, 255, 255, 0.45)',
              marginTop: '8px'
            }}
          >
            Four steps read faster than six.
          </div>
        </div>

        {/* =========================================================
            CARDS UNDER THE 3D PARTICLES
            Desktop: 4 columns side by side aligned with 01, 02, 03, 04
            Mobile: Focused active card with navigation pills
            ========================================================= */}
        {!isMobile ? (
          // DESKTOP: 4 Interactive Columns Under Each Particle Number
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '1240px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '10px'
            }}
          >
            {processSteps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const isHovered = hoveredStepIndex === idx;

              return (
                <div 
                  key={step.id}
                  onClick={() => scrollToStep(idx)}
                  onMouseEnter={() => {
                    setHoveredStepIndex(idx);
                    soundEngine.playTick();
                  }}
                  onMouseLeave={() => setHoveredStepIndex(null)}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(180deg, rgba(14, 20, 32, 0.95) 0%, rgba(8, 11, 18, 0.98) 100%)' 
                      : (isHovered ? 'rgba(14, 19, 28, 0.85)' : 'rgba(9, 12, 18, 0.75)'),
                    border: isActive 
                      ? `1.5px solid ${step.accent}` 
                      : (isHovered ? `1px solid ${step.accent}70` : '1px solid rgba(255, 255, 255, 0.1)'),
                    borderRadius: '14px',
                    padding: '24px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isActive ? 'translateY(-6px)' : (isHovered ? 'translateY(-3px)' : 'translateY(0)'),
                    boxShadow: isActive 
                      ? `0 16px 36px ${step.glow}, 0 4px 16px rgba(0, 0, 0, 0.7)` 
                      : '0 8px 24px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '210px'
                  }}
                >
                  <div>
                    {/* Top Step Number Badge */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '14px' 
                      }}
                    >
                      <span 
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: step.accent,
                          letterSpacing: '0.12em'
                        }}
                      >
                        [{step.stepNum}]
                      </span>

                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isActive ? `${step.accent}25` : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? step.accent : 'rgba(255, 255, 255, 0.5)',
                          border: `1px solid ${isActive ? step.accent + '60' : 'rgba(255, 255, 255, 0.1)'}`
                        }}
                      >
                        {isActive ? 'ACTIVE' : `PHASE 0${idx + 1}`}
                      </span>
                    </div>

                    {/* Step Title (DISCOVER, DESIGN, etc.) */}
                    <h3 
                      style={{
                        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: '#ffffff',
                        marginBottom: '8px'
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* User's Exact Line Under Each Step */}
                    <p 
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.90rem',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                        lineHeight: 1.45,
                        marginBottom: '14px',
                        fontWeight: 500
                      }}
                    >
                      {step.line}
                    </p>
                  </div>

                  {/* Bullet Specs / Highlights */}
                  <div 
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px'
                    }}
                  >
                    {step.specs.map((spec, sIdx) => (
                      <div 
                        key={sIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem',
                          color: isActive ? 'rgba(255, 255, 255, 0.82)' : 'rgba(255, 255, 255, 0.45)',
                          letterSpacing: '0.04em'
                        }}
                      >
                        <span style={{ color: step.accent }}>·</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // MOBILE: Single Spacious Focused Card + Navigation Controls
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '460px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            {/* Active Card */}
            <div 
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, rgba(14, 20, 32, 0.96) 0%, rgba(8, 11, 18, 0.98) 100%)',
                border: `1.5px solid ${activeStep.accent}`,
                borderRadius: '16px',
                padding: '18px 18px',
                boxShadow: `0 14px 32px ${activeStep.glow}, 0 4px 16px rgba(0, 0, 0, 0.8)`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                marginBottom: '12px'
              }}
            >
              {/* Header inside card */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: activeStep.accent
                    }}
                  >
                    [{activeStep.stepNum}]
                  </span>
                  <span 
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.20rem',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}
                  >
                    {activeStep.title}
                  </span>
                </div>

                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.60rem',
                    color: activeStep.accent,
                    background: `${activeStep.accent}20`,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: `1px solid ${activeStep.accent}60`
                  }}
                >
                  PHASE {activeStep.stepNum}/04
                </span>
              </div>

              {/* Exact Line Under */}
              <p 
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.4,
                  marginBottom: '12px'
                }}
              >
                {activeStep.line}
              </p>

              {/* Specs */}
              <div 
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {activeStep.specs.map((spec, sIdx) => (
                  <div 
                    key={sIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      color: 'rgba(255, 255, 255, 0.75)'
                    }}
                  >
                    <span style={{ color: activeStep.accent }}>·</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Step Selector Buttons */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'space-between'
              }}
            >
              <button
                onClick={() => scrollToStep(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: activeStepIndex === 0 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  cursor: activeStepIndex === 0 ? 'default' : 'pointer'
                }}
              >
                <ArrowLeft size={12} />
                <span>PREV</span>
              </button>

              {/* 4 dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {processSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(idx)}
                    style={{
                      width: idx === activeStepIndex ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: idx === activeStepIndex ? step.accent : 'rgba(255, 255, 255, 0.25)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollToStep(Math.min(3, activeStepIndex + 1))}
                disabled={activeStepIndex === 3}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: activeStepIndex === 3 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  cursor: activeStepIndex === 3 ? 'default' : 'pointer'
                }}
              >
                <span>NEXT</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Sequence Progress Hint */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          }}
        >
          <span>SCROLL SEQUENCE</span>
          <span style={{ color: activeStep.accent }}>[{Math.round(scrollProgress * 100)}%]</span>
        </div>
      </div>
    </section>
  );
};
