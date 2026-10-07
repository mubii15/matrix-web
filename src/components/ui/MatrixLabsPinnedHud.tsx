import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Send } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

export interface LabProjectTile {
  id: string;
  name: string;
  status: 'LIVE' | 'RESEARCH' | 'PLANNED';
  statusLabel: string;
  desc: string;
  link?: string;
}

export const labTiles: LabProjectTile[] = [
  {
    id: 'outdoor-drones',
    name: 'OUTDOOR DRONE SHOWS',
    status: 'LIVE',
    statusLabel: 'LIVE',
    desc: 'Synchronized light robotics in open airspace. RTK-GPS < 1cm / 0.02ms mesh / 1200+ units.',
    link: '/drone-shows'
  },
  {
    id: 'indoor-drones',
    name: 'INDOOR DRONE SHOWS',
    status: 'RESEARCH',
    statusLabel: 'IN DEV',
    desc: 'Ultra-precise micro-swarms for arenas, stages, theaters, and enclosed airspace.',
    link: '/contact?subject=Indoor+Drone+Shows'
  },
  {
    id: 'water',
    name: 'PROGRAMMABLE WATER',
    status: 'PLANNED',
    statusLabel: 'IN DEV',
    desc: 'High-speed pulsed jets & hydro-optic mist. 45 bar pulse / 30m jet vertical.',
    link: '/contact?subject=Programmable+Water'
  },
  {
    id: 'immersive',
    name: 'INTERACTIVE ENVIRONMENTS',
    status: 'PLANNED',
    statusLabel: 'IN DEV',
    desc: '360° sensor-driven spatial worlds. LiDAR tracking & realtime spatial audio.',
    link: '/contact?subject=Interactive+Environments'
  },
  {
    id: 'robotics',
    name: 'ROBOTICS & EMERGING SYSTEMS',
    status: 'PLANNED',
    statusLabel: 'IN DEV',
    desc: 'Algorithmic swarm intelligence in physical space. Onboard edge AI & flocking.',
    link: '/contact?subject=Robotics+and+Emerging+Systems'
  },
  {
    id: 'skywriting',
    name: 'SKY WRITING',
    status: 'PLANNED',
    statusLabel: 'IN DEV',
    desc: 'High-altitude nocturnal typography & persistent kinetic light trail vectors.',
    link: '/contact?subject=Sky+Writing'
  }
];

interface MatrixLabsPinnedHudProps {
  className?: string;
}

export const MatrixLabsPinnedHud: React.FC<MatrixLabsPinnedHudProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 960 : false;
  });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    soundEngine.playChime(640, 'sine', 0.2);
  };

  return (
    <div 
      className={`matrix-labs-hud ${className}`}
      style={{
        position: 'absolute',
        width: isMobile ? '92%' : '52vw',
        maxWidth: isMobile ? '560px' : '780px',
        right: isMobile ? 'auto' : 'max(3.5vw, 40px)',
        left: isMobile ? '50%' : 'auto',
        top: isMobile ? 'auto' : '50%',
        bottom: isMobile ? 'max(14px, 2.5vh)' : 'auto',
        transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
        zIndex: 12,
        pointerEvents: 'auto',
        textAlign: isMobile ? 'center' : 'left',
        userSelect: 'none'
      }}
    >
      {/* Eyebrow: [05 // MATRIX LABS] */}
      <div 
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? '0.64rem' : '0.76rem',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: isMobile ? '4px' : '10px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          gap: '10px'
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px rgba(255, 255, 255, 0.95)' }} />
        <span>[03 // MATRIX LABS]</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>·</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>R&D INCUBATOR</span>
      </div>

      {/* Headline: The sky is only the first canvas. */}
      <h2 
        style={{
          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
          fontSize: isMobile ? '1.28rem' : 'clamp(2.0rem, 2.9vw, 3.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          color: '#ffffff',
          textShadow: '0 0 16px rgba(255, 255, 255, 0.35)',
          marginBottom: isMobile ? '4px' : '10px'
        }}
      >
        The sky is only the first canvas.
      </h2>

      {/* Body Paragraph */}
      <p 
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isMobile ? '0.76rem' : '0.90rem',
          color: 'rgba(255, 255, 255, 0.72)',
          lineHeight: isMobile ? 1.4 : 1.55,
          maxWidth: isMobile ? '480px' : '640px',
          margin: isMobile ? '0 auto 12px auto' : '0 0 20px 0'
        }}
      >
        Matrix exists to make physical space programmable. Outdoor drone shows are live today. The rest of the platform is in development.
      </p>

      {/* Tiles: AERIAL LIVE · DESIGNER LIVE · INDOOR & DAYTIME {RESEARCH} · LIGHT & IMAGE PLANNED · WATER PLANNED · IMMERSIVE PLANNED */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '6px' : '10px',
          marginBottom: isMobile ? '12px' : '20px'
        }}
      >
        {labTiles.map((tile) => {
          const isHovered = hoveredTile === tile.id;
          const isLive = tile.status === 'LIVE';
          const isResearch = tile.status === 'RESEARCH';

          return (
            <Link
              key={tile.id}
              to={tile.link || '/contact'}
              onMouseEnter={() => {
                setHoveredTile(tile.id);
                soundEngine.playTick();
              }}
              onMouseLeave={() => setHoveredTile(null)}
              style={{
                background: isHovered 
                  ? 'rgba(18, 22, 30, 0.95)' 
                  : (isLive ? 'rgba(14, 17, 24, 0.88)' : 'rgba(8, 10, 15, 0.75)'),
                border: isHovered 
                  ? '1px solid rgba(255, 255, 255, 0.65)' 
                  : (isLive ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.1)'),
                borderRadius: '10px',
                padding: isMobile ? '8px 10px' : '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: isHovered 
                  ? '0 8px 24px rgba(255, 255, 255, 0.14), 0 4px 12px rgba(0, 0, 0, 0.6)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.4)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span 
                  style={{
                    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                    fontSize: isMobile ? '0.74rem' : '0.86rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: '#ffffff',
                    textShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
                  }}
                >
                  {tile.name}
                </span>

                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.50rem' : '0.58rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    padding: '1px 6px',
                    borderRadius: '12px',
                    background: isLive 
                      ? 'rgba(255, 255, 255, 0.16)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isLive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                    border: `1px solid ${isLive ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.12)'}`,
                    textShadow: isLive ? '0 0 8px rgba(255, 255, 255, 0.6)' : 'none'
                  }}
                >
                  {isLive && '● '}
                  {tile.statusLabel}
                </span>
              </div>

              {!isMobile && (
                <p 
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.68rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: 1.35,
                    margin: 0
                  }}
                >
                  {tile.desc}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Subscription Form & Partner / Invest CTA Row */}
      {/* [ your@email ] ■ FOLLOW THE LAB · PARTNER OR INVEST → */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '10px' : '18px'
        }}
      >
        <form 
          onSubmit={handleSubmit}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(10, 12, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '30px',
            padding: '3px 4px 3px 14px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <input 
            type="email"
            placeholder={submitted ? 'Thank you for following' : 'your@email.com'}
            value={email}
            disabled={submitted}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.68rem' : '0.76rem',
              width: isMobile ? '120px' : '170px',
              letterSpacing: '0.04em'
            }}
          />

          <button
            type="submit"
            disabled={submitted}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: submitted ? 'rgba(255, 255, 255, 0.15)' : '#ffffff',
              color: submitted ? '#ffffff' : '#000000',
              border: 'none',
              padding: isMobile ? '6px 12px' : '8px 18px',
              borderRadius: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.64rem' : '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: submitted ? 'default' : 'pointer',
              boxShadow: submitted ? 'none' : '0 0 16px rgba(255, 255, 255, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            {submitted ? (
              <>
                <Check size={12} />
                <span>FOLLOWING</span>
              </>
            ) : (
              <>
                <span>■ FOLLOW THE LAB</span>
              </>
            )}
          </button>
        </form>

        <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.8rem' }}>·</span>

        <Link
          to="/contact?subject=Labs+Partnership+or+Investment"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.68rem' : '0.76rem',
            color: '#ffffff',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.35)',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.textShadow = '0 0 14px rgba(255, 255, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.35)';
          }}
        >
          <span>PARTNER OR INVEST</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
};
