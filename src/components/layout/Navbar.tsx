import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // On the Home page, the sun rises and exits as the user scrolls.
      // The sun completely ascends and fades out by ~75% of window.innerHeight scroll distance.
      // So on Home, keep the navbar 100% transparent until the sun has completely gone away.
      const isHome = location.pathname === '/';
      const threshold = isHome ? window.innerHeight * 0.82 : 40;
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Work', path: '/work' },
    { label: 'About us', path: '/about' },
    { label: 'Contact us', path: '/contact' }
  ];

  const secondaryLinks = [
    { label: 'Our Work', path: '/work', badge: 'Portfolio' },
    { label: 'Drone Shows', path: '/drone-shows', badge: 'Commercial' },
    { label: 'Immersive Experiences', path: '/immersive', badge: 'Environments' },
    { label: 'Matrix Labs (R&D)', path: '/labs', badge: 'Experimental' },
    { label: 'Matrix Designer', path: '/designer', badge: 'Desktop Software' },
    { label: 'Journal', path: '/journal', badge: 'Articles' },
    { label: 'Careers', path: '/careers', badge: 'Hiring' },
    { label: 'Contact & Enquiry', path: '/contact', badge: 'Enquiries' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        borderBottom: 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Soft Faded Ambient Vignette Backdrop (Gradual fade-out at the bottom edge, zero hard lines) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 'calc(var(--header-height) + 28px)',
          pointerEvents: 'none',
          zIndex: -1,
          background: 'linear-gradient(180deg, rgba(4, 5, 8, 0.94) 0%, rgba(4, 5, 8, 0.72) 50%, rgba(4, 5, 8, 0.22) 80%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          maskImage: 'linear-gradient(180deg, black 0%, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 55%, transparent 100%)',
          opacity: (isScrolled || mobileMenuOpen) ? 1 : 0,
          transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      <div className="site-container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        {/* Brand Logo matching reference */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          {/* Official Matrix Volumetric Dot Logo */}
          <img 
            src="/matrix-logo-white.png" 
            alt="Matrix Logo" 
            style={{ 
              width: '28px', 
              height: '28px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))'
            }} 
          />
          <span 
            style={{ 
              fontFamily: "'Exo 2', sans-serif",
              fontSize: '1.2rem', 
              fontWeight: 500, 
              letterSpacing: '0.02em', 
              color: '#ffffff' 
            }}
          >
            Matrix
          </span>
        </Link>

        {/* Desktop Primary Nav matching exact reference */}
        <nav 
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '36px' 
          }}
          className="desktop-nav"
        >
          <style>{`
            @media (min-width: 960px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/work' && location.pathname === '/our-work');
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  textDecoration: 'none',
                  padding: '6px 0'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? '#ffffff' : '#9ca3af')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'none' }} className="desktop-nav">
            <Button to="/book" variant="primary" size="sm">
              Book a Show
            </Button>
          </div>

          {/* Mobile Menu Drawer Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Slide-out Full Ecosystem Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(100vh - var(--header-height))',
            background: 'rgba(7, 7, 9, 0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--border-subtle)',
            overflowY: 'auto',
            padding: '36px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 99
          }}
        >
          <div className="site-container" style={{ width: '100%', maxWidth: '800px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
                MATRIX BRAND ECOSYSTEM
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.12em' }}>
                  Core Navigation
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: location.pathname === link.path ? 'var(--accent-cyan)' : 'var(--text-primary)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.12em' }}>
                  Capabilities & Explorations
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        fontSize: '0.86rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>{link.label}</span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {link.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div 
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button to="/book" variant="primary" size="md">
                  Book a Show
                </Button>
                <Button href="https://designer.matrix.com" variant="secondary" size="md" icon>
                  Download Designer
                </Button>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                WE MAKE PHYSICAL SPACES PROGRAMMABLE.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
