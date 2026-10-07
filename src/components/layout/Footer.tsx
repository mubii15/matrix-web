import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <footer 
      style={{
        background: '#040407',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* ========================================================
          1. CINEMATIC PARTICLE HANDSHAKE ARTWORK STAGE
          Two people made of shimmering white starlight particles
          standing on undulating dunes, shaking hands in partnership
          ======================================================== */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: '620px',
          height: 'clamp(360px, 48vw, 620px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000'
        }}
      >
        {/* The Particle Handshake Visual */}
        <img 
          src="/images/particle-handshake-footer.jpg" 
          alt="Two figures made of white starlight particles shaking hands in partnership"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: 'contrast(1.06) brightness(1.02)'
          }}
        />

        {/* Ambient Shimmer / Twinkle Vignette Scrims */}
        {/* Top Edge Dissolve into previous section */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(180deg, #040407 0%, rgba(4, 4, 7, 0.75) 40%, rgba(4, 4, 7, 0) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Bottom Edge Fade into Typography & Links */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '240px',
            background: 'linear-gradient(0deg, #040407 0%, rgba(4, 4, 7, 0.88) 45%, rgba(4, 4, 7, 0) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Left & Right Edge Vignette for ultra-wide displays */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 90% 75% at 50% 45%, rgba(0, 0, 0, 0) 45%, rgba(4, 4, 7, 0.75) 85%, #040407 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* ========================================================
          2. EDITORIAL HEADLINE & CTA ROW
          ======================================================== */}
      <div className="site-container" style={{ position: 'relative', marginTop: '-40px', zIndex: 2 }}>
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '32px',
            marginBottom: '72px',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Main Statement with White Glow Highlight */}
          <h2 
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: 'clamp(2.1rem, 4.4vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              color: 'rgba(255, 255, 255, 0.38)',
              maxWidth: '680px',
              margin: 0
            }}
          >
            Provide your{' '}
            <span 
              style={{ 
                color: '#ffffff', 
                textShadow: '0 0 20px rgba(255, 255, 255, 0.65), 0 0 35px rgba(255, 255, 255, 0.25)' 
              }}
            >
              audiences
            </span>
            <br />
            the spectacle they remember
          </h2>

          {/* Action CTA Button */}
          <div>
            <Link
              to="/contact"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: btnHovered ? '#f1f5f9' : '#ffffff',
                color: '#000000',
                padding: '14px 28px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.80rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: btnHovered 
                  ? '0 0 36px rgba(255, 255, 255, 0.65), 0 6px 20px rgba(0, 0, 0, 0.4)' 
                  : '0 0 22px rgba(255, 255, 255, 0.35), 0 4px 14px rgba(0, 0, 0, 0.3)',
                transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Schedule a Demo</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* ========================================================
            3. MINIMALIST 4-COLUMN ARCHITECTURAL NAVIGATION GRID
            ======================================================== */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '72px'
          }}
        >
          {/* Column 1: System */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.72rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: '20px' 
              }}
            >
              SYSTEM
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/drone-shows" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Autonomous Drone Shows
                </Link>
              </li>
              <li>
                <Link to="/immersive" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Interactive Environments
                </Link>
              </li>
              <li>
                <Link to="/capabilities#light-image" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Projection Mapping & LED
                </Link>
              </li>
              <li>
                <Link to="/capabilities#water" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Programmable Fountains
                </Link>
              </li>
              <li>
                <Link to="/capabilities#autonomous-systems" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Swarm Robotics Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Items / Platform */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.72rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: '20px' 
              }}
            >
              ITEMS
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/designer" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Matrix Designer
                </Link>
              </li>
              <li>
                <Link to="/technology" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Swarm Avionics
                </Link>
              </li>
              <li>
                <Link to="/work" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Selected Works & Shows
                </Link>
              </li>
              <li>
                <Link to="/labs" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Matrix Labs (R&D)
                </Link>
              </li>
              <li>
                <Link to="/journal" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Technical Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help Center & Compliance */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.72rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: '20px' 
              }}
            >
              HELP CENTER
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/about" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  CAA & Airspace Approvals
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Safety Architecture
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Call Redirection
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Privacy & Data Handling
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get Started Today */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.72rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: '20px' 
              }}
            >
              GET STARTED TODAY
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/contact" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Book a Live Show
                </Link>
              </li>
              <li>
                <Link to="/contact?subject=Proposal" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Request Technical Proposal
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Email Communication
                </Link>
              </li>
              <li>
                <Link to="/careers" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}>
                  Careers & Flight Crew
                </Link>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.42)' }}>
                  London HQ // Global Operations
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================
            4. BOTTOM DIVIDER & COPYRIGHT TELEMETRY BAR
            ======================================================== */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
            paddingBottom: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255, 255, 255, 0.45)'
          }}
        >
          <div>
            © {new Date().getFullYear()} MATRIX. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px rgba(255, 255, 255, 0.85)' }} />
            <span>ALL SYSTEMS OPERATIONAL // READY FOR DISPATCH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
