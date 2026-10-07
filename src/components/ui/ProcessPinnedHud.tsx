import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

export interface ProcessStepItem {
  id: string;
  stepNum: string;
  title: string;
  line: string;
  specs: string[];
  accent: string;
  glow: string;
}

export const processStepItems: ProcessStepItem[] = [
  {
    id: 'discover',
    stepNum: '01',
    title: 'DISCOVER',
    line: 'We learn your event.',
    specs: ['Creative Concept & Vision', 'Site Survey & Airspace Checks', 'Show Timeline & Scale'],
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.35)'
  },
  {
    id: 'design',
    stepNum: '02',
    title: 'DESIGN',
    line: 'We build it in Matrix Designer.',
    specs: ['3D Choreography & Formations', 'Text & Logo Conversion', 'Music & Timecode Lock'],
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.35)'
  },
  {
    id: 'simulate',
    stepNum: '03',
    title: 'SIMULATE',
    line: 'You approve it in 3D.',
    specs: ['360° Photorealistic Preview', 'Millimeter Safety Tolerances', 'Client Sign-off & Lock'],
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.35)'
  },
  {
    id: 'fly',
    stepNum: '04',
    title: 'FLY',
    line: 'Our crew flies it live.',
    specs: ['Licensed Commercial Pilots', 'Dual-Redundant Ground Ops', 'Flawless Live Execution'],
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.35)'
  }
];

interface ProcessPinnedHudProps {
  scrollProgress: number; // Overall sticky track progress (0.0 to 1.0)
  onStepSelect?: (stepIdx: number) => void;
}

export const ProcessPinnedHud: React.FC<ProcessPinnedHudProps> = ({
  scrollProgress,
  onStepSelect
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active step from scroll progress in the Process phase (0.28 to 0.56)
  // Phase 1 (01 DISCOVER): 0.28 - 0.35
  // Phase 2 (02 DESIGN):   0.35 - 0.42
  // Phase 3 (03 SIMULATE): 0.42 - 0.49
  // Phase 4 (04 FLY):      0.49 - 0.56
  let activeIdx = 0;
  if (scrollProgress < 0.35) {
    activeIdx = 0;
  } else if (scrollProgress < 0.42) {
    activeIdx = 1;
  } else if (scrollProgress < 0.49) {
    activeIdx = 2;
  } else {
    activeIdx = 3;
  }

  const activeStep = processStepItems[activeIdx];

  const handleStepClick = (idx: number) => {
    if (onStepSelect) {
      onStepSelect(idx);
    }
    soundEngine.playChime(480 + idx * 60, 'sine', 0.15);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '70px 16px 20px 16px' : '80px 48px 28px 48px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        zIndex: 12
      }}
    >
      {/* Top Header & Pipeline Bar */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1240px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}
      >
        {/* Eyebrow: [02 // PROCESS] */}
        <div 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.68rem' : '0.78rem',
            color: '#ffffff',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: isMobile ? '4px' : '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px rgba(255, 255, 255, 0.95)' }} />
          <span>[02 // PROCESS]</span>
        </div>

        {/* Headline: From idea to airborne. */}
        <h2 
          style={{
            fontFamily: "'Space Grotesk', -apple-system, sans-serif",
            fontSize: isMobile ? 'clamp(1.5rem, 5vw, 2.0rem)' : 'clamp(2.2rem, 3.8vw, 3.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: isMobile ? '8px' : '12px'
          }}
        >
          From idea to airborne.
        </h2>

        {/* Pipeline Bar: 01 DISCOVER → 02 DESIGN → 03 SIMULATE → 04 FLY */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '6px' : '12px',
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            padding: isMobile ? '5px 10px' : '6px 18px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {processStepItems.map((step, idx) => {
            const isActive = activeIdx === idx;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(idx)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isActive ? `${step.accent}25` : 'transparent',
                    border: isActive ? `1px solid ${step.accent}80` : '1px solid transparent',
                    padding: isMobile ? '3px 8px' : '4px 12px',
                    borderRadius: '20px',
                    color: isActive ? step.accent : 'rgba(255, 255, 255, 0.55)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.62rem' : '0.72rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>{step.stepNum}</span>
                  <span>{step.title}</span>
                </button>
                {idx < processStepItems.length - 1 && (
                  <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: isMobile ? '0.62rem' : '0.72rem' }}>
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
            fontSize: isMobile ? '0.70rem' : '0.80rem',
            color: 'rgba(255, 255, 255, 0.45)',
            marginTop: '6px'
          }}
        >
          Four steps read faster than six.
        </div>
      </div>

      {/* Cards Under the 3D Particle Numbers (01, 02, 03, 04) */}
      {!isMobile ? (
        // Desktop: 4 Columns Directly Beneath the 4 Particle Digits
        <div 
          style={{
            width: '100%',
            maxWidth: '1240px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '8px',
            pointerEvents: 'auto'
          }}
        >
          {processStepItems.map((step, idx) => {
            const isActive = activeIdx === idx;
            const isHovered = hoveredIdx === idx;

            return (
              <div 
                key={step.id}
                onClick={() => handleStepClick(idx)}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  soundEngine.playTick();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: isActive 
                    ? 'linear-gradient(180deg, rgba(14, 20, 32, 0.95) 0%, rgba(8, 11, 18, 0.98) 100%)' 
                    : (isHovered ? 'rgba(14, 19, 28, 0.88)' : 'rgba(8, 11, 16, 0.78)'),
                  border: isActive 
                    ? `1.5px solid ${step.accent}` 
                    : (isHovered ? `1px solid ${step.accent}70` : '1px solid rgba(255, 255, 255, 0.1)'),
                  borderRadius: '14px',
                  padding: '22px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isActive ? 'translateY(-6px)' : (isHovered ? 'translateY(-3px)' : 'translateY(0)'),
                  boxShadow: isActive 
                    ? `0 16px 36px ${step.glow}, 0 4px 16px rgba(0, 0, 0, 0.75)` 
                    : '0 8px 24px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '200px'
                }}
              >
                <div>
                  {/* Top Step Code & Status */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '12px' 
                    }}
                  >
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        textShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.7)' : 'none',
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
                        background: isActive ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                        border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        textShadow: isActive ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
                      }}
                    >
                      {isActive ? '● ACTIVE' : `PHASE 0${idx + 1}`}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 
                    style={{
                      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                      fontSize: '1.30rem',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: '#ffffff',
                      textShadow: isActive ? '0 0 14px rgba(255, 255, 255, 0.4)' : 'none',
                      marginBottom: '6px'
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* One line under each step */}
                  <p 
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.88rem',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                      lineHeight: 1.4,
                      marginBottom: '12px',
                      fontWeight: 500
                    }}
                  >
                    {step.line}
                  </p>
                </div>

                {/* Bullet highlights */}
                <div 
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
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
                        fontSize: '0.64rem',
                        color: isActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
                        letterSpacing: '0.03em'
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
        // Mobile: Focused single card with clean spacing & touch controls
        <div 
          style={{
            width: '100%',
            maxWidth: '440px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '8px',
            pointerEvents: 'auto'
          }}
        >
          <div 
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, rgba(14, 20, 32, 0.96) 0%, rgba(8, 11, 18, 0.98) 100%)',
              border: `1.5px solid ${activeStep.accent}`,
              borderRadius: '14px',
              padding: '16px',
              boxShadow: `0 12px 28px ${activeStep.glow}, 0 4px 16px rgba(0, 0, 0, 0.8)`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              marginBottom: '10px'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  [{activeStep.stepNum}]
                </span>
                <span 
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    textShadow: '0 0 14px rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {activeStep.title}
                </span>
              </div>

              <span 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.16)',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                }}
              >
                PHASE {activeStep.stepNum}/04
              </span>
            </div>

            <p 
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.35,
                marginBottom: '10px'
              }}
            >
              {activeStep.line}
            </p>

            <div 
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
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
                    fontSize: '0.64rem',
                    color: 'rgba(255, 255, 255, 0.75)'
                  }}
                >
                  <span style={{ color: activeStep.accent }}>·</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {processStepItems.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                style={{
                  width: idx === activeIdx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === activeIdx ? step.accent : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sequence Progress Marker */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.60rem',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase'
        }}
      >
        <span>SCROLL PROGRESS</span>
        <span style={{ color: '#ffffff', textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}>[{Math.round(scrollProgress * 100)}%]</span>
      </div>
    </div>
  );
};
