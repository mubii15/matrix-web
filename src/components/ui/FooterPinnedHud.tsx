import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface FooterPinnedHudProps {
  className?: string;
}

export const FooterPinnedHud: React.FC<FooterPinnedHudProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 960 : false;
  });
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer 
      className={`footer-pinned-hud ${className}`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 15,
        pointerEvents: 'auto',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 3, 5, 0.75) 25%, rgba(3, 3, 5, 0.95) 60%, #030305 100%)',
        paddingTop: isMobile ? '30px' : '60px',
        paddingBottom: isMobile ? '20px' : '36px',
        userSelect: 'none'
      }}
    >
      <div className="site-container" style={{ maxWidth: '1240px' }}>
        {/* ========================================================
            1. EDITORIAL HEADLINE & ACTION BUTTON ROW
            Matching Reference: Left Headline + Right Pill CTA
            ======================================================== */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: isMobile ? '18px' : '32px',
            marginBottom: isMobile ? '24px' : '44px',
            paddingBottom: isMobile ? '16px' : '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Main Headline with White Glow Highlight */}
          <h2 
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: isMobile ? '1.45rem' : 'clamp(2.0rem, 3.2vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.14,
              color: 'rgba(255, 255, 255, 0.38)',
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

          {/* Action Button: "Schedule a demo" */}
          <div>
            <Link
              to="/contact"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: btnHovered ? '#f1f5f9' : '#ffffff',
                color: '#000000',
                padding: isMobile ? '11px 22px' : '13px 26px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: isMobile ? '0.76rem' : '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'none',
                textDecoration: 'none',
                boxShadow: btnHovered 
                  ? '0 0 36px rgba(255, 255, 255, 0.75), 0 6px 20px rgba(0, 0, 0, 0.5)' 
                  : '0 0 22px rgba(255, 255, 255, 0.40), 0 4px 14px rgba(0, 0, 0, 0.4)',
                transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Schedule a demo</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* ========================================================
            2. MINIMALIST 4-COLUMN ARCHITECTURAL NAVIGATION GRID
            Matching Reference: SYSTEM | ITEMS | HELP CENTER | GET STARTED TODAY
            ======================================================== */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '20px 16px' : '32px',
            marginBottom: isMobile ? '20px' : '32px'
          }}
        >
          {/* Column 1: SYSTEM */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.68rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: isMobile ? '10px' : '14px' 
              }}
            >
              SYSTEM
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/drone-shows" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Autonomous Drone Shows
                </Link>
              </li>
              <li>
                <Link to="/immersive" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Interactive Airspace
                </Link>
              </li>
              <li>
                <Link to="/capabilities" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Volumetric Mapping
                </Link>
              </li>
              <li>
                <Link to="/technology" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Telemetry & Mesh Link
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: ITEMS */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.68rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: isMobile ? '10px' : '14px' 
              }}
            >
              ITEMS
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/designer" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Matrix Designer Studio
                </Link>
              </li>
              <li>
                <Link to="/work" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Selected Works
                </Link>
              </li>
              <li>
                <Link to="/labs" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Matrix Labs (R&D)
                </Link>
              </li>
              <li>
                <Link to="/capabilities" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Programmable Fluids
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP CENTER */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.68rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: isMobile ? '10px' : '14px' 
              }}
            >
              HELP CENTER
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/technology" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Flight Regulations & Geofence
                </Link>
              </li>
              <li>
                <Link to="/technology" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Technical Avionics Docs
                </Link>
              </li>
              <li>
                <Link to="/careers" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Careers (Join Matrix)
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  About the Collective
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: GET STARTED TODAY */}
          <div>
            <h5 
              style={{ 
                fontSize: '0.68rem', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(255, 255, 255, 0.42)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.14em', 
                marginBottom: isMobile ? '10px' : '14px' 
              }}
            >
              GET STARTED TODAY
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', padding: 0, margin: 0 }}>
              <li>
                <Link to="/contact" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Client Consultation
                </Link>
              </li>
              <li>
                <Link to="/contact?subject=Custom+Engineering" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Custom Engineering
                </Link>
              </li>
              <li>
                <a href="mailto:hello@matrix.com" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  hello@matrix.com
                </a>
              </li>
              <li>
                <Link to="/contact?subject=Partner+or+Invest" style={{ fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'rgba(255, 255, 255, 0.68)', textDecoration: 'none', transition: 'color 0.18s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.68)'}>
                  Partner or Invest
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================
            3. BOTTOM DIVIDER & COPYRIGHT ROW
            ======================================================== */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: isMobile ? '14px' : '18px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.64rem' : '0.72rem',
            color: 'rgba(255, 255, 255, 0.35)'
          }}
        >
          <div>
            © 2026 MATRIX SYSTEMS. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }}>Terms of Service</Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>·</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>[LIVE 60FPS CHOREOGRAPHY]</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
