import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { GalaxyBackgroundCanvas } from './GalaxyBackgroundCanvas';

export interface WorkProjectItem {
  id: string;
  category: string;
  categoryCode: string;
  title: string;
  subtitle: string;
  fleetCount: string;
  specs: string;
  description: string;
  image: string;
  tag: string;
  badge: string;
}

export const WORK_PROJECTS: WorkProjectItem[] = [
  {
    id: 'tokyo-stadium',
    category: 'STADIUM SPECTACLES',
    categoryCode: '01 // ENTERTAINMENT',
    title: 'Tokyo National Arena Opening',
    subtitle: '3,200 RTK Airframes · 360° Volumetric Sightlines',
    fleetCount: '3,200 DRONES',
    specs: 'TIMECODE AUDIO SYNC · ZERO EXPLOSIVE FALLOUT',
    description: 'Volumetric rotating 3D Earth sphere and animated athletes in mid-flight synchronized live to SMPTE audio timecode with zero ground burn risk.',
    image: '/images/stadium-drone-show.jpg',
    tag: 'GLOBAL STADIUMS',
    badge: 'MATRIX'
  },
  {
    id: 'f1-night-circuit',
    category: 'SPORTS & SPEED',
    categoryCode: '02 // HIGH VELOCITY',
    title: 'Abu Dhabi Grand Prix Night Sky',
    subtitle: '2,400 Drones · 18 m/s Swarm Acceleration',
    fleetCount: '2,400 DRONES',
    specs: 'HIGH-G CARBON FRAMES · 5KM SIGHT RADIUS',
    description: 'High-speed race cars and aerodynamic particle slipstreams flying above the main grandstand straight at 65 km/h with sub-centimeter positioning.',
    image: '/images/kinetic-light-card.jpg',
    tag: 'MOTORSPORT',
    badge: 'MATRIX'
  },
  {
    id: 'pyrodrones-dubai',
    category: 'PYRODRONES™ SPECTACLE',
    categoryCode: '03 // COLD SPARKS',
    title: 'Dubai Marina Cascading Apex',
    subtitle: '1,800 Hybrid Drones · Certified Cold Emitters',
    fleetCount: '1,800 DRONES',
    specs: 'ZERO FALLOUT HAZARD · WATERFRONT OPERATIONS',
    description: 'Certified cold-spark pyrotechnic emitters launched in mid-air from synchronized drone formations with zero sulfur smoke and no burn buffer zones.',
    image: '/images/pyrodrones-show.jpg',
    tag: 'HYBRID AERIAL',
    badge: 'MATRIX'
  },
  {
    id: 'samsung-unpacked',
    category: 'BRAND ACTIVATIONS',
    categoryCode: '04 // MARKETING',
    title: 'Global Smartphone Reveal & QR Art',
    subtitle: '2,000 Drones · 300m Floating QR Code',
    fleetCount: '2,000 DRONES',
    specs: 'SCANNABLE FROM 3KM · VIRAL BROADCAST REACH',
    description: 'Massive 300-meter architectural phone silhouettes and live scannable QR codes engineered for viral social media capture above the city skyline.',
    image: '/images/skywriting-card.jpg',
    tag: 'METROPOLIS',
    badge: 'MATRIX'
  },
  {
    id: 'civic-jubilee',
    category: 'CIVIC CELEBRATIONS',
    categoryCode: '05 // HERITAGE',
    title: 'National Independence Light Odyssey',
    subtitle: '1,500 Drones · Cultural Myth Storytelling',
    fleetCount: '1,500 DRONES',
    specs: 'WHISPER-QUIET FLIGHT · 100% ECO-FRIENDLY',
    description: 'Bespoke cultural narratives painted across a 5km horizon without traumatic 150dB explosions or smoke distress to local wildlife and pets.',
    image: '/images/drone-show-card.jpg',
    tag: 'NATIONAL MEMORIAL',
    badge: 'MATRIX'
  },
  {
    id: 'indoor-arena-summit',
    category: 'INDOOR STAGE SWARMS',
    categoryCode: '06 // INDOOR IMMERSION',
    title: 'Concert Tour & Fashion Runway',
    subtitle: '450 Micro-Airframes · Optical Flow Tracking',
    fleetCount: '450 DRONES',
    specs: 'ULTRA-LIGHT CARBON · CLOSE-RANGE AUDIENCE',
    description: 'Featherweight carbon micro-frames dancing around live performers and runway stages with centimeter-level optical tracking and propeller guards.',
    image: '/images/indoor-drone-card.jpg',
    tag: 'INDOOR ARENAS',
    badge: 'MATRIX'
  }
];

interface OurWorkWheelSectionProps {
  onSelectProject?: (project: WorkProjectItem) => void;
  onOpenBooking?: () => void;
}

export const OurWorkWheelSection: React.FC<OurWorkWheelSectionProps> = ({
  onSelectProject,
  onOpenBooking
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  // Floating index for infinite continuous circular rotation in both directions
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const lastTickIndexRef = useRef<number>(0);

  // Touch and drag support
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartIndexRef = useRef<number>(0);

  const totalItems = WORK_PROJECTS.length;

  // Viewport width tracking for responsive circle radius & wide card spacing
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Infinite Mouse Wheel / Trackpad Listener on the Stage
  useEffect(() => {
    const stage = trackRef.current;
    if (!stage) return;

    let snapTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      // Smooth responsive scroll step
      const step = dy * 0.0024;
      setTargetIndex((prev) => prev + step);

      // Debounced smooth snap to nearest card integer when scrolling stops
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        setTargetIndex((prev) => Math.round(prev));
      }, 180);
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', onWheel);
      if (snapTimeout) clearTimeout(snapTimeout);
    };
  }, []);

  // 2. Keyboard Arrow Key Navigation (Endless Dial)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setTargetIndex((prev) => Math.round(prev) + 1);
        soundEngine.playChime(640, 'sine', 0.12);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setTargetIndex((prev) => Math.round(prev) - 1);
        soundEngine.playChime(560, 'sine', 0.12);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // 3. Smooth Damping Animation Loop (spring/lerp interpolation)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      setCurrentIndex((prev) => {
        const diff = targetIndex - prev;
        if (Math.abs(diff) < 0.0008) return targetIndex;

        const next = prev + diff * 0.14;

        // Audio feedback on card boundary cross
        const nearestInt = Math.round(next);
        if (nearestInt !== lastTickIndexRef.current && Math.abs(next - nearestInt) < 0.1) {
          lastTickIndexRef.current = nearestInt;
          soundEngine.playTick();
        }

        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetIndex]);

  // Active project index (modulo wrapped to WORK_PROJECTS range)
  const activeInt = ((Math.round(currentIndex) % totalItems) + totalItems) % totalItems;
  const activeProject = WORK_PROJECTS[activeInt] || WORK_PROJECTS[0];

  // Infinite Navigation Click Helpers (Endless cycling)
  const handlePrev = useCallback(() => {
    setTargetIndex((prev) => Math.round(prev) - 1);
    soundEngine.playChime(560, 'sine', 0.12);
  }, []);

  const handleNext = useCallback(() => {
    setTargetIndex((prev) => Math.round(prev) + 1);
    soundEngine.playChime(640, 'sine', 0.12);
  }, []);

  // Touch and Drag Handlers (Infinite unclamped gestures)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartIndexRef.current = targetIndex;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const indexShift = -deltaX / (viewportWidth >= 1024 ? 300 : 180);
    setTargetIndex(dragStartIndexRef.current + indexShift);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      const snapIndex = Math.round(currentIndex);
      setTargetIndex(snapIndex);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartIndexRef.current = targetIndex;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const indexShift = -deltaX / (viewportWidth >= 1024 ? 260 : 160);
    setTargetIndex(dragStartIndexRef.current + indexShift);
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      const snapIndex = Math.round(currentIndex);
      setTargetIndex(snapIndex);
    }
  };

  // Circular Wheel Geometric Parameters (Fanned Out Circle with Generous Airy Distances)
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isStdDesktop = viewportWidth >= 1024 && viewportWidth < 1400;

  const circleRadius = isMobile 
    ? 660 
    : isTablet 
    ? 960 
    : isStdDesktop 
    ? 1260 
    : 1520;

  const stepAngleDeg = isMobile 
    ? 18.0 
    : isTablet 
    ? 14.2 
    : isStdDesktop 
    ? 13.8 
    : 14.0;

  const stepAngleRad = (stepAngleDeg * Math.PI) / 180;

  return (
    <section 
      ref={trackRef} 
      className="ds-our-work-stage-fullscreen"
      id="our-work"
      style={{
        position: 'relative',
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        background: '#000000',
        zIndex: 4,
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Fullscreen Interactive Stage */}
      <div 
        className="ds-our-work-sticky"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: 'clamp(72px, 9.5vh, 92px) 0 clamp(18px, 3vh, 30px) 0',
          boxSizing: 'border-box'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3D Rotating Spiral Galaxy Particle System in Background */}
        <GalaxyBackgroundCanvas />

        {/* Ambient Top & Bottom Vignettes */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        {/* Top Header Controls: < CATEGORY > matching Reference Image */}
        <div 
          className="ds-work-top-bar"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px'
          }}
        >
          {/* Subtle Tag */}
          <div 
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              color: 'rgba(255, 255, 255, 0.55)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>PORTFOLIO ARCHIVE // 0{activeInt + 1} OF 0{totalItems}</span>
          </div>

          {/* Interactive < Category Title > with Chevrons (Endless dial) */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              userSelect: 'none'
            }}
          >
            <button
              onClick={handlePrev}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.85)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              aria-label="Previous Project"
            >
              <ChevronLeft size={22} />
            </button>

            <h2 
              style={{
                margin: 0,
                fontFamily: 'var(--font-display, "Syne", sans-serif)',
                fontSize: 'clamp(1.25rem, 2.4vw, 1.85rem)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
              }}
            >
              {activeProject.category}
            </h2>

            <button
              onClick={handleNext}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.85)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              aria-label="Next Project"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* 3D Circular Wheel Carousel Stage (Infinite Fanned Dial) */}
        <div 
          className="ds-work-wheel-stage"
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100vw',
            maxWidth: '100vw',
            height: 'clamp(350px, 50vh, 430px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1300px',
            transformStyle: 'preserve-3d',
            overflow: 'visible'
          }}
        >
          {[-3, -2, -1, 0, 1, 2, 3].map((slotOffset) => {
            const centerRound = Math.round(currentIndex);
            const virtualIdx = centerRound + slotOffset;
            const delta = virtualIdx - currentIndex;
            const absDelta = Math.abs(delta);

            // Hide cards beyond visible 5-card fanned horizon
            if (absDelta > 2.8) return null;

            // Modulo wrap to valid project in WORK_PROJECTS
            const projectIdx = ((virtualIdx % totalItems) + totalItems) % totalItems;
            const project = WORK_PROJECTS[projectIdx];

            // --- TRUE CIRCLE WHEEL MATHEMATICS ---
            const angle = delta * stepAngleRad;
            const translateX = circleRadius * Math.sin(angle);
            const translateY = circleRadius * (1 - Math.cos(angle));

            // Fanned Out Z-Rotation along circle tangent
            const rotateZ = delta * stepAngleDeg;

            // Inward 3D perspective turn toward the center viewer
            const rotateY = -delta * 9.5;

            // Depth push into space: Active card hovers forward in front (+35px), outer cards recede
            const focusAmount = Math.max(0, 1.0 - Math.min(1.0, absDelta));
            const smoothFocus = Math.cos((1.0 - focusAmount) * Math.PI * 0.5); // 1.0 at center, 0 at delta >= 1
            const translateZ = smoothFocus * 35.0 - absDelta * 65.0;

            // Prominent Focus Scale: Center focus card is heroed at 1.30 (noticeably larger), side cards step down to 0.88 and 0.76
            const scale = (0.88 - Math.max(0, absDelta - 1.0) * 0.12) + smoothFocus * 0.42;

            // Opacity falloff
            const opacity = Math.max(0, 1.0 - absDelta * 0.22);
            const zIndex = Math.round(50 - absDelta * 10);

            const isCenter = absDelta < 0.45;

            return (
              <div
                key={virtualIdx}
                onClick={() => {
                  setTargetIndex(virtualIdx);
                  if (onSelectProject) onSelectProject(project);
                }}
                className={`ds-work-card ${isCenter ? 'is-active' : ''}`}
                style={{
                  position: 'absolute',
                  width: 'clamp(180px, 13.5vw, 205px)',
                  height: 'clamp(270px, 20vw, 305px)',
                  transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  zIndex,
                  opacity,
                  transition: isDraggingRef.current ? 'none' : 'transform 0.12s ease-out, opacity 0.15s ease-out',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {/* Tech Keycard Container with Chamfered Corners matching Reference */}
                <div 
                  className="ds-work-card-inner"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: '#ffffff',
                    color: '#090a0f',
                    // Signature Chamfered Sci-Fi Cutouts: Notched top-right, bottom corners, SIM-card side notch
                    clipPath: `polygon(
                      0% 0%, 
                      calc(100% - 16px) 0%, 
                      100% 16px, 
                      100% calc(50% - 10px),
                      calc(100% - 5px) calc(50% - 6px),
                      calc(100% - 5px) calc(50% + 6px),
                      100% calc(50% + 10px),
                      100% calc(100% - 14px), 
                      calc(100% - 14px) 100%, 
                      14px 100%, 
                      0% calc(100% - 14px)
                    )`,
                    boxShadow: isCenter
                      ? '0 16px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 255, 255, 0.28)'
                      : '0 10px 28px rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 12px 12px 12px',
                    boxSizing: 'border-box',
                    border: isCenter ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.35)'
                  }}
                >
                  {/* Card Header Bar (Dark Banner like reference) */}
                  <div 
                    style={{
                      background: '#121318',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span 
                      style={{
                        fontFamily: 'var(--font-display, "Syne", sans-serif)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {project.category}
                    </span>
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.58rem',
                        color: 'rgba(255, 255, 255, 0.55)',
                        letterSpacing: '0.08em'
                      }}
                    >
                      {project.categoryCode.split('//')[0]}
                    </span>
                  </div>

                  {/* Thumbnail Image Container */}
                  <div 
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '42%',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      background: '#0a0a0c',
                      marginBottom: '8px'
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {/* Fleet Badge Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.56rem',
                        color: '#ffffff',
                        fontWeight: 600,
                        letterSpacing: '0.06em'
                      }}
                    >
                      {project.fleetCount}
                    </div>
                  </div>

                  {/* Card Body & Description */}
                  <div 
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h3 
                        style={{
                          margin: '0 0 4px 0',
                          fontFamily: 'var(--font-display, "Syne", sans-serif)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: '#0f1117'
                        }}
                      >
                        {project.title}
                      </h3>
                      <p 
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-sans, sans-serif)',
                          fontSize: '0.66rem',
                          lineHeight: 1.35,
                          color: '#4b5563',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Branded Badge */}
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <div 
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.60rem',
                          color: '#111827',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>&gt;</span>
                        <span>{project.tag}</span>
                      </div>

                      {/* Pill Badge matching Kimi / Matrix reference */}
                      <div 
                        style={{
                          background: '#000000',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em'
                        }}
                      >
                        {project.badge}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Pill Button matching Reference Image: < 立即申请 > */}
        <div 
          className="ds-work-bottom-bar"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <button
            onClick={() => {
              if (onOpenBooking) onOpenBooking();
              if (onSelectProject) onSelectProject(activeProject);
            }}
            className="ds-work-explore-btn"
            style={{
              background: '#ffffff',
              color: '#000000',
              padding: '10px 28px',
              borderRadius: '999px',
              border: 'none',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            <span>&lt; VIEW CASE STUDY &gt;</span>
            <ArrowUpRight size={14} />
          </button>

          <span 
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.62rem',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.12em'
            }}
          >
            SCROLL OR DRAG TO ROTATE DIAL · ARROW KEYS TO NAVIGATE
          </span>
        </div>
      </div>
    </section>
  );
};
