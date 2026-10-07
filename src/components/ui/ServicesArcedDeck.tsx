import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

export interface ServiceDeckItem {
  id: string;
  code: string;
  category: string;
  title: string;
  status: 'LIVE' | 'IN DEVELOPMENT' | 'RESEARCH' | 'ENQUIRE';
  statusBadge: string;
  description: string;
  specs: string;
  image: string;
  link: string;
  accent: string;
}

export const servicesDeckItems: ServiceDeckItem[] = [
  {
    id: 'light',
    code: '02',
    category: 'LIGHT',
    title: 'Projection Mapping & LED',
    status: 'ENQUIRE',
    statusBadge: '○ ENQUIRE',
    description: 'Buildings, stages and surfaces turned into moving canvases of light and volumetric laser.',
    specs: 'ARCHITECTURAL PROJECTION / HIGH-OUTPUT LED / VOLUMETRIC LASER',
    image: '/images/kinetic-light-card.jpg',
    link: '/contact?subject=Projection+Mapping',
    accent: '#ffffff'
  },
  {
    id: 'autonomous',
    code: '05',
    category: 'AUTONOMOUS',
    title: 'Robotics & Emerging Systems',
    status: 'RESEARCH',
    statusBadge: '○ RESEARCH',
    description: 'Airships, indoor drones and autonomous swarm robotics platforms for physical media.',
    specs: 'AERIAL BLIMPS / INDOOR SWARMS / KINETIC ACTUATORS',
    image: '/images/designer-card.jpg',
    link: '/contact?subject=Robotics+and+Emerging+Systems',
    accent: '#ffffff'
  },
  {
    id: 'drone-shows',
    code: '01',
    category: 'AERIAL',
    title: 'Autonomous Drone Shows',
    status: 'LIVE',
    statusBadge: '● LIVE',
    description: 'Logos, names, 3D shapes and animated stories flown in synchronised light and set to music.',
    specs: 'CONCEPT & DESIGN / APPROVALS & FLIGHT PLANNING / LIVE SHOW OPERATIONS',
    image: '/images/drone-show-card.jpg',
    link: '/drone-shows',
    accent: '#ffffff'
  },
  {
    id: 'water',
    code: '03',
    category: 'WATER',
    title: 'Programmable Fountains',
    status: 'IN DEVELOPMENT',
    statusBadge: '○ IN DEV',
    description: 'Choreographed water, light and music shows from portable event rigs to landmark installations.',
    specs: 'HIGH-PRESSURE JETS / UNDERWATER LED / TIME-CODE SYNC',
    image: '/images/fountains-card.jpg',
    link: '/contact?subject=Programmable+Fountains',
    accent: '#ffffff'
  },
  {
    id: 'immersive',
    code: '04',
    category: 'IMMERSIVE',
    title: 'Interactive Environments',
    status: 'IN DEVELOPMENT',
    statusBadge: '○ IN DEV',
    description: 'Rooms and architectural spaces that see, hear and respond dynamically to people inside them.',
    specs: 'LIDAR TRACKING / REALTIME SHADERS / SPATIAL AUDIO',
    image: '/images/immersive-card.jpg',
    link: '/contact?subject=Interactive+Environments',
    accent: '#ffffff'
  }
];

interface ServicesArcedDeckProps {
  className?: string;
  onScrollToProcess?: () => void;
}

export const ServicesArcedDeck: React.FC<ServicesArcedDeckProps> = ({ className = '', onScrollToProcess }) => {
  // Center card is drone-shows by default (index 2)
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeItem = servicesDeckItems[activeIndex] || servicesDeckItems[2];

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    if (idx !== activeIndex) {
      e.preventDefault();
      setActiveIndex(idx);
      soundEngine.playChime(520 + idx * 40, 'sine', 0.15);
    }
  };

  const handleMouseEnter = (idx: number) => {
    if (!isMobile) {
      setHoveredIndex(idx);
      soundEngine.playTick();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredIndex(null);
    }
  };

  // Touch Swipe for mobile carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        // Swiped left -> next
        setActiveIndex(prev => Math.min(servicesDeckItems.length - 1, prev + 1));
        soundEngine.playTick();
      } else {
        // Swiped right -> prev
        setActiveIndex(prev => Math.max(0, prev - 1));
        soundEngine.playTick();
      }
    }
    setTouchStartX(null);
  };

  // Dimensions: spacious focused card on mobile; 3D fan deck on desktop
  const cardWidth = isMobile ? Math.min(295, typeof window !== 'undefined' ? window.innerWidth - 48 : 295) : 210;
  const cardHeight = isMobile ? 190 : 300;
  const stageHeight = isMobile ? 205 : 355;
  const fanSpacing = isMobile ? 0 : 100;

  return (
    <div 
      className={`services-deck-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'center' : 'flex-start',
        position: 'relative',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Eyebrow & Headline */}
      <div 
        style={{ 
          width: '100%', 
          marginBottom: isMobile ? '8px' : '16px', 
          textAlign: isMobile ? 'center' : 'left' 
        }}
      >
        <div 
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: isMobile ? '0.64rem' : '0.78rem', 
            color: '#ffffff', 
            textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.14em', 
            marginBottom: isMobile ? '4px' : '10px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: '10px'
          }}
        >
          <span>[01 // SERVICES]</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>·</span>
          <span style={{ color: '#ffffff', fontWeight: 600, textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}>● 1 LIVE</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>○ 4 IN DEV</span>
        </div>

        <h3 
          style={{ 
            fontFamily: "'Space Grotesk', -apple-system, sans-serif", 
            fontSize: isMobile ? '1.24rem' : 'clamp(1.9rem, 2.7vw, 2.85rem)', 
            color: '#ffffff', 
            fontWeight: 700, 
            letterSpacing: '-0.02em', 
            lineHeight: 1.12,
            marginBottom: isMobile ? '4px' : '8px'
          }}
        >
          We Turn Technology Into Experiences.
        </h3>

        <p 
          style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            fontSize: isMobile ? '0.78rem' : '0.98rem', 
            color: 'rgba(255, 255, 255, 0.65)', 
            lineHeight: isMobile ? 1.4 : 1.6,
            maxWidth: isMobile ? '520px' : '660px',
            margin: isMobile ? '0 auto' : '0'
          }}
        >
          {isMobile 
            ? 'Autonomous drone shows live today. Platform in development.' 
            : 'Drone shows are live today. The rest of the platform is in development.'}
        </p>
      </div>

      {/* 3D Arced Card Deck Stage filling the right-hand area */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          height: `${stageHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'center',
          perspective: isMobile ? '900px' : '1300px',
          marginTop: isMobile ? '2px' : '10px',
          marginBottom: isMobile ? '12px' : '22px',
          userSelect: 'none',
          touchAction: 'pan-y'
        }}
      >
        {servicesDeckItems.map((item, idx) => {
          const offset = idx - activeIndex;
          const isCenter = offset === 0;
          const isHovered = hoveredIndex === idx;

          // Mobile: focused single spacious card with smooth slide. Desktop: 3D Arced Fan Deck.
          const rotateZ = isMobile ? 0 : offset * 6.0;
          const rotateY = isMobile ? 0 : offset * -3.2;
          const translateY = isMobile 
            ? (isCenter ? 0 : 8) 
            : (Math.abs(offset) * 14 + (isHovered ? -16 : (isCenter ? -10 : 0)));
          const translateX = isMobile 
            ? offset * (cardWidth + 24) 
            : offset * fanSpacing;
          const scale = isMobile 
            ? (isCenter ? 1.0 : 0.94) 
            : ((isHovered ? 1.06 : 1.0) * (isCenter ? 1.02 : Math.max(0.85, 1.0 - Math.abs(offset) * 0.05)));
          const zIndex = isMobile ? (isCenter ? 30 : 10) : (isHovered ? 40 : (30 - Math.abs(offset) * 3));
          const opacity = isMobile 
            ? (isCenter ? 1.0 : 0.0) 
            : (Math.abs(offset) > 2 ? 0.35 : (isCenter ? 1.0 : (isHovered ? 0.96 : 0.82)));
          const pointerEvents = isMobile ? (isCenter ? 'auto' : 'none') : 'auto';

          const isLive = item.status === 'LIVE';

          return (
            <Link
              key={item.id}
              to={item.link}
              onClick={(e) => handleCardClick(idx, e)}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'absolute',
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                borderRadius: isMobile ? '14px' : '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                textDecoration: 'none',
                color: '#ffffff',
                background: '#090b10',
                border: isCenter 
                  ? '1.5px solid rgba(255, 255, 255, 0.9)' 
                  : (isHovered ? '1px solid rgba(255, 255, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.16)'),
                boxShadow: isCenter 
                  ? '0 0 32px rgba(255, 255, 255, 0.28), 0 20px 48px rgba(0, 0, 0, 0.85)' 
                  : (isHovered ? '0 14px 36px rgba(255, 255, 255, 0.15), 0 18px 40px rgba(0, 0, 0, 0.7)' : '0 12px 28px rgba(0, 0, 0, 0.6)'),
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transformOrigin: '50% 90%',
                transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.32s ease',
                zIndex,
                opacity,
                pointerEvents,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Background Thumbnail Image with Gradient Scrim */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: isCenter ? 'contrast(1.05) saturate(1.05)' : 'grayscale(0.2) brightness(0.85)',
                  transition: 'filter 0.3s ease, transform 0.4s ease',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
                  zIndex: 1
                }}
              />

              {/* Multi-stop Cinematic Overlay Mask */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5, 7, 10, 0.18) 0%, rgba(5, 7, 10, 0.45) 42%, rgba(5, 7, 10, 0.94) 82%, #06080d 100%)',
                  zIndex: 2
                }}
              />

              {/* Top Header Badge */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 3,
                  padding: isMobile ? '8px 10px' : '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.60rem' : '0.74rem',
                    letterSpacing: '0.10em',
                    fontWeight: 600,
                    color: isCenter ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                    textShadow: isCenter ? '0 0 8px rgba(255, 255, 255, 0.6)' : 'none'
                  }}
                >
                  [{item.code}]
                </span>

                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.54rem' : '0.66rem',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                    padding: isMobile ? '2px 6px' : '4px 10px',
                    borderRadius: '20px',
                    background: isLive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                    color: isLive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    border: isLive ? '1px solid rgba(255, 255, 255, 0.55)' : '1px solid rgba(255, 255, 255, 0.15)',
                    textShadow: isLive ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
                  }}
                >
                  {isLive ? (
                    <>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px rgba(255, 255, 255, 0.95)' }} />
                      LIVE
                    </>
                  ) : (
                    item.statusBadge
                  )}
                </span>
              </div>

              {/* Bottom Content Info */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 3,
                  padding: isMobile ? '10px' : '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '2px' : '5px'
                }}
              >
                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.56rem' : '0.68rem',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    color: '#ffffff',
                    textShadow: isCenter ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  {item.category}
                </div>

                <div 
                  style={{
                    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                    fontSize: isMobile ? '1.02rem' : (isCenter ? '1.12rem' : '0.94rem'),
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: '#ffffff',
                    textShadow: isCenter ? '0 0 14px rgba(255, 255, 255, 0.35)' : 'none'
                  }}
                >
                  {item.title}
                </div>

                {isCenter && (
                  <>
                    <p 
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: isMobile ? '0.70rem' : '0.74rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: 1.35,
                        marginTop: isMobile ? '2px' : '4px'
                      }}
                    >
                      {item.description}
                    </p>

                    <div 
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.54rem' : '0.58rem',
                        color: 'rgba(255, 255, 255, 0.72)',
                        textShadow: '0 0 6px rgba(255, 255, 255, 0.25)',
                        letterSpacing: '0.06em',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: isMobile ? '4px' : '6px',
                        marginTop: isMobile ? '2px' : '4px'
                      }}
                    >
                      {item.specs}
                    </div>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile Swipe Pagination Indicator Dots */}
      {isMobile && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            zIndex: 10
          }}
        >
          {servicesDeckItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: idx === activeIndex ? '16px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: idx === activeIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
                boxShadow: idx === activeIndex ? '0 0 8px rgba(255, 255, 255, 0.9)' : 'none',
                border: 'none',
                padding: 0,
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Interactive Bottom Control Pill */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '8px' : '14px',
          zIndex: 10,
          alignSelf: 'center',
          marginTop: isMobile ? '4px' : '10px'
        }}
      >
        <Link
          to={activeItem.link}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            padding: isMobile ? '8px 16px' : '12px 26px',
            borderRadius: '30px',
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.68rem' : '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '0 0 24px rgba(255, 255, 255, 0.38)',
            transition: 'all 0.22s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.boxShadow = '0 0 32px rgba(255, 255, 255, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 255, 255, 0.38)';
          }}
        >
          <span>{activeItem.status === 'LIVE' ? (isMobile ? 'BOOK SHOW' : 'BOOK A DRONE SHOW') : (isMobile ? 'ENQUIRE' : `ENQUIRE // ${activeItem.category}`)}</span>
          <ArrowUpRight size={isMobile ? 12 : 15} />
        </Link>

        <button
          onClick={() => {
            if (onScrollToProcess) {
              onScrollToProcess();
            } else {
              const track = document.querySelector('[data-sticky-track="landing"]') as HTMLElement;
              if (track) {
                const total = track.offsetHeight - window.innerHeight;
                window.scrollTo({ top: track.offsetTop + 0.68 * total, behavior: 'smooth' });
              }
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            padding: isMobile ? '8px 12px' : '12px 20px',
            borderRadius: '30px',
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.68rem' : '0.78rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.22s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
          }}
        >
          <span>HOW IT WORKS</span>
          <ChevronDown size={isMobile ? 12 : 15} />
        </button>
      </div>
    </div>
  );
};
