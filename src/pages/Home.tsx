import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SunriseLoader } from '../components/ui/SunriseLoader';
import { HeroSunriseTerrainCanvas } from '../components/ui/HeroSunriseTerrainCanvas';
import { ServicesArcedDeck } from '../components/ui/ServicesArcedDeck';
import { ProcessPinnedHud } from '../components/ui/ProcessPinnedHud';
import { MatrixLabsPinnedHud } from '../components/ui/MatrixLabsPinnedHud';
import { FooterPinnedHud } from '../components/ui/FooterPinnedHud';
import { soundEngine } from '../utils/audioSynth';

export const Home: React.FC = () => {
  const [showAsciiLoader, setShowAsciiLoader] = useState(true);
  const [isTransformed, setIsTransformed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stickyTrackRef = useRef<HTMLDivElement | null>(null);
  const pinnedSectionRef = useRef<HTMLElement | null>(null);

  // Bulletproof viewport pinning & progress tracking through landing container
  useEffect(() => {
    let ticking = false;

    const updatePinnedPosition = () => {
      const track = stickyTrackRef.current;
      const pinned = pinnedSectionRef.current;
      if (!track) {
        ticking = false;
        return;
      }

      const rect = track.getBoundingClientRect();
      const totalScrollable = track.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) {
        ticking = false;
        return;
      }

      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1.0, scrolled / totalScrollable);
      setScrollProgress(progress);

      if (pinned) {
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          // Inside sticky track: pinned to viewport
          pinned.style.position = 'fixed';
          pinned.style.top = '0px';
          pinned.style.bottom = 'auto';
        } else if (rect.bottom < window.innerHeight) {
          // Scrolled past sticky track: anchored at bottom of track
          pinned.style.position = 'absolute';
          pinned.style.top = `${totalScrollable}px`;
          pinned.style.bottom = 'auto';
        } else {
          // Above track (top of page or rubber banding)
          pinned.style.position = 'absolute';
          pinned.style.top = '0px';
          pinned.style.bottom = 'auto';
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updatePinnedPosition);
        ticking = true;
      }
    };

    updatePinnedPosition();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div style={{ position: 'relative', background: '#000000' }}>
      {/* Full-Screen ASCII / Particle Sunrise Loader */}
      {showAsciiLoader && (
        <SunriseLoader
          minDuration={3000}
          onTransformStart={() => {
            setIsTransformed(true);
            soundEngine.playMorphSound();
          }}
          onComplete={() => {
            setShowAsciiLoader(false);
          }}
        />
      )}

      {/* ========================================================
          1. STICKY LANDING PAGE & SCROLL METAMORPHOSIS
          - 260vh Sticky scroll track
          - Sticky 100vh pinned viewport:
            1. The sun rises all the way outside the top of the page
            2. The hero particles disperse into 3D space
            3. The dispersed particles converge and reform into a rotating 3D sphere!
          ======================================================== */}
      <div 
        ref={stickyTrackRef}
        data-sticky-track="landing"
        style={{
          position: 'relative',
          height: '680vh',
          background: '#000000'
        }}
      >
        <section 
          ref={pinnedSectionRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 5
          }}
        >
          {/* Continuous 3D Canvas (Dawn -> Waves -> Disperse -> Rotating 3D Sphere) */}
          <HeroSunriseTerrainCanvas 
            loadProgress={isTransformed ? 1 : 0.3}
            isTransformed={isTransformed}
            scrollProgress={scrollProgress}
          />

          {/* Hero Content (Fades & blurs out as user scrolls, sun rises outside the page) */}
          <div 
            className="site-container" 
            style={{ 
              position: 'relative', 
              zIndex: 10, 
              width: '100%',
              maxWidth: '920px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: isTransformed ? Math.max(0, 1.0 - scrollProgress / 0.05) : 0,
              transform: `translateY(-${scrollProgress * 70}px)`,
              filter: `blur(${scrollProgress * 14}px)`,
              transition: isTransformed ? 'opacity 0.15s ease-out, transform 0.15s ease-out' : 'opacity 1.6s ease',
              pointerEvents: (isTransformed && scrollProgress < 0.04) ? 'auto' : 'none',
              visibility: scrollProgress >= 0.06 ? 'hidden' : 'visible',
              marginTop: '-50px'
            }}
          >
            {/* Centered Matrix Official Volumetric Emblem */}
            <div 
              style={{ 
                marginBottom: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.45))'
              }}
            >
              <img 
                src="/matrix-logo-white.png" 
                alt="Matrix Emblem" 
                style={{ 
                  width: '54px', 
                  height: '54px', 
                  objectFit: 'contain' 
                }} 
              />
            </div>

            {/* Eyebrow / Brand */}
            <div 
              style={{ 
                marginBottom: '18px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px' 
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.45em', 
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  paddingLeft: '0.45em'
                }}
              >
                MATRIX
              </span>
              <span 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.68rem', 
                  fontWeight: 400, 
                  letterSpacing: '0.22em', 
                  color: 'rgba(255, 255, 255, 0.52)',
                  textTransform: 'uppercase'
                }}
              >
                Aerial &amp; Immersive Technology
              </span>
            </div>

            {/* Main Headline (SET IN MOTION visually dominant) */}
            <h1 
              style={{
                fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                color: '#ffffff',
                marginBottom: '20px',
                textAlign: 'center',
                maxWidth: '920px',
                lineHeight: 1.12
              }}
            >
              <span 
                style={{ 
                  display: 'block',
                  fontSize: 'clamp(1.75rem, 3.4vw, 2.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '2px'
                }}
              >
                IMAGINATION,
              </span>
              <span 
                style={{ 
                  display: 'block',
                  fontSize: 'clamp(2.4rem, 5.4vw, 4.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  textShadow: '0 0 35px rgba(255, 255, 255, 0.35)'
                }}
              >
                SET IN MOTION.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p 
              style={{
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.65,
                maxWidth: '560px',
                margin: '0 auto 28px auto',
                textAlign: 'center',
                fontWeight: 400
              }}
            >
              We create extraordinary experiences where technology, light, motion and space come together.
            </p>

            {/* Sleek CTAs: Primary & Secondary */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                marginBottom: '28px'
              }}
            >
              <Link 
                to="/book"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#000000',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.25)';
                }}
              >
                <span>BOOK A SHOW</span>
                <ArrowRight size={14} />
              </Link>

              <Link 
                to="/work"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.24)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.24)';
                }}
              >
                <span>EXPLORE OUR WORK</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Sleek Minimal Centered Scroll Indicator */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  window.scrollTo({
                    top: stickyTrackRef.current.offsetTop + stickyTrackRef.current.offsetHeight,
                    behavior: 'smooth'
                  });
                }
                soundEngine.playMorphSound();
              }}
              aria-label="Scroll to explore"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.45)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                transition: 'color 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
            >
              <div 
                style={{ 
                  width: '16px', 
                  height: '24px', 
                  borderRadius: '9px', 
                  border: '1.2px solid currentColor', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  paddingTop: '4px' 
                }}
              >
                <div 
                  style={{ 
                    width: '2px', 
                    height: '4px', 
                    borderRadius: '1px', 
                    background: 'currentColor' 
                  }} 
                />
              </div>
              <ChevronDown size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* Small Quiet Bottom Signature Statement */}
          <div
            style={{
              position: 'absolute',
              bottom: '22px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              letterSpacing: '0.3em',
              color: 'rgba(255, 255, 255, 0.38)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 10,
              opacity: isTransformed ? Math.max(0, 1.0 - scrollProgress / 0.05) : 0,
              visibility: scrollProgress >= 0.06 ? 'hidden' : 'visible',
              transition: 'opacity 0.2s ease'
            }}
          >
            AERIAL · IMMERSIVE · AUTONOMOUS · LIGHT · MOTION
          </div>

          {/* Services Metamorphosis Arced Deck (Revealed as particles reform into the Hand + Gears + Stars sculpture) */}
          {(() => {
            let svcOp = 0;
            if (scrollProgress >= 0.06 && scrollProgress <= 0.10) {
              svcOp = (scrollProgress - 0.06) / 0.04;
            } else if (scrollProgress > 0.10 && scrollProgress < 0.22) {
              svcOp = 1.0;
            } else if (scrollProgress >= 0.22 && scrollProgress <= 0.26) {
              svcOp = Math.max(0, 1.0 - (scrollProgress - 0.22) / 0.04);
            }
            const svcBlur = scrollProgress < 0.08 
              ? Math.max(0, (0.08 - scrollProgress) * 10) 
              : (scrollProgress > 0.22 ? Math.max(0, (scrollProgress - 0.22) * 12) : 0);
            return (
              <div 
                className="services-metamorphosis-hud"
                style={{ 
                  opacity: svcOp,
                  filter: `blur(${svcBlur}px)`,
                  pointerEvents: (scrollProgress >= 0.06 && scrollProgress <= 0.24) ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease-out'
                }}
              >
                <ServicesArcedDeck 
                  onScrollToProcess={() => {
                    if (stickyTrackRef.current) {
                      const track = stickyTrackRef.current;
                      const total = track.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: track.offsetTop + 0.31 * total, behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            );
          })()}

          {/* Process Metamorphosis Pinned HUD (Particles transform from Hand & Gears into 01, 02, 03, 04) */}
          {(() => {
            let procOp = 0;
            if (scrollProgress >= 0.24 && scrollProgress <= 0.28) {
              procOp = (scrollProgress - 0.24) / 0.04;
            } else if (scrollProgress > 0.28 && scrollProgress < 0.56) {
              procOp = 1.0;
            } else if (scrollProgress >= 0.56 && scrollProgress <= 0.60) {
              procOp = Math.max(0, 1.0 - (scrollProgress - 0.56) / 0.04);
            }
            const procBlur = scrollProgress < 0.26
              ? Math.max(0, (0.26 - scrollProgress) * 10)
              : (scrollProgress > 0.56 ? Math.max(0, (scrollProgress - 0.56) * 12) : 0);
            return (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: procOp,
                  filter: `blur(${procBlur}px)`,
                  pointerEvents: (scrollProgress >= 0.24 && scrollProgress <= 0.58) ? 'auto' : 'none',
                  transition: 'opacity 0.18s ease-out',
                  zIndex: 12
                }}
              >
                <ProcessPinnedHud 
                  scrollProgress={scrollProgress}
                  onStepSelect={(idx) => {
                    if (stickyTrackRef.current) {
                      const track = stickyTrackRef.current;
                      const total = track.offsetHeight - window.innerHeight;
                      // Target offsets for the 4 steps: 0 -> 0.31, 1 -> 0.38, 2 -> 0.45, 3 -> 0.52
                      const targetProgress = 0.31 + idx * 0.07;
                      window.scrollTo({
                        top: track.offsetTop + targetProgress * total,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              </div>
            );
          })()}

          {/* Matrix Labs Metamorphosis Pinned HUD (Particles transform into Beaker with floating ascending bubbles) */}
          {(() => {
            let labsOp = 0;
            if (scrollProgress >= 0.60 && scrollProgress <= 0.65) {
              labsOp = (scrollProgress - 0.60) / 0.05;
            } else if (scrollProgress > 0.65 && scrollProgress < 0.74) {
              labsOp = 1.0;
            } else if (scrollProgress >= 0.74 && scrollProgress <= 0.78) {
              labsOp = Math.max(0, 1.0 - (scrollProgress - 0.74) / 0.04);
            }
            const labsBlur = scrollProgress < 0.64
              ? Math.max(0, (0.64 - scrollProgress) * 10)
              : (scrollProgress > 0.74 ? Math.max(0, (scrollProgress - 0.74) * 12) : 0);
            return (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: labsOp,
                  filter: `blur(${labsBlur}px)`,
                  pointerEvents: (scrollProgress >= 0.63 && scrollProgress < 0.76) ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease-out',
                  zIndex: 13
                }}
              >
                <MatrixLabsPinnedHud />
              </div>
            );
          })()}

          {/* Stage 5: Partnership & Handshake Footer HUD (Live Particles form Two Figures Shaking Hands over Dunes) */}
          {(() => {
            let footerOp = 0;
            if (scrollProgress >= 0.76 && scrollProgress <= 0.82) {
              footerOp = (scrollProgress - 0.76) / 0.06;
            } else if (scrollProgress > 0.82) {
              footerOp = 1.0;
            }
            const footerBlur = scrollProgress < 0.80 ? Math.max(0, (0.80 - scrollProgress) * 10) : 0;
            return (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: footerOp,
                  filter: `blur(${footerBlur}px)`,
                  pointerEvents: scrollProgress >= 0.78 ? 'auto' : 'none',
                  transition: 'opacity 0.22s ease-out',
                  zIndex: 14
                }}
              >
                <FooterPinnedHud />
              </div>
            );
          })()}

          {/* Right-Side Vertical Navigation Dots: Hero -> Services -> Process -> Matrix Labs -> Partnership */}
          <div 
            style={{
              position: 'absolute',
              right: '32px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              alignItems: 'center',
              opacity: isTransformed ? 1 : 0,
              transition: 'opacity 1.4s ease',
              pointerEvents: 'auto'
            }}
            className="desktop-nav"
          >
            {/* Dot 1: Active during Hero */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  window.scrollTo({ top: stickyTrackRef.current.offsetTop, behavior: 'smooth' });
                }
              }}
              title="Hero"
              aria-label="Scroll to Hero"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {scrollProgress < 0.08 ? (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)' }} />
                </div>
              ) : (
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
              )}
            </button>

            {/* Dot 2: Active during Services / Hand + Gears */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  const track = stickyTrackRef.current;
                  const total = track.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: track.offsetTop + 0.15 * total, behavior: 'smooth' });
                }
              }}
              title="Services"
              aria-label="Scroll to Services"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {scrollProgress >= 0.08 && scrollProgress < 0.24 ? (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px rgba(255, 255, 255, 0.95)' }} />
                </div>
              ) : (
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
              )}
            </button>

            {/* Dot 3: Active during Process (01, 02, 03, 04) */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  const track = stickyTrackRef.current;
                  const total = track.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: track.offsetTop + 0.35 * total, behavior: 'smooth' });
                }
              }}
              title="Process"
              aria-label="Scroll to Process"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {scrollProgress >= 0.24 && scrollProgress < 0.58 ? (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px rgba(255, 255, 255, 0.95)' }} />
                </div>
              ) : (
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
              )}
            </button>

            {/* Dot 4: Active during Matrix Labs (Flask / Beaker & Bubbling Ascent) */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  const track = stickyTrackRef.current;
                  const total = track.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: track.offsetTop + 0.68 * total, behavior: 'smooth' });
                }
              }}
              title="Matrix Labs"
              aria-label="Scroll to Matrix Labs"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {scrollProgress >= 0.58 && scrollProgress < 0.78 ? (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px rgba(255, 255, 255, 0.95)' }} />
                </div>
              ) : (
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
              )}
            </button>

            {/* Dot 5: Active during Partnership & Handshake Footer */}
            <button
              onClick={() => {
                if (stickyTrackRef.current) {
                  const track = stickyTrackRef.current;
                  const total = track.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: track.offsetTop + 0.94 * total, behavior: 'smooth' });
                }
              }}
              title="Partnership &amp; Footer"
              aria-label="Scroll to Partnership and Footer"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {scrollProgress >= 0.78 ? (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px rgba(255, 255, 255, 0.95)' }} />
                </div>
              ) : (
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
