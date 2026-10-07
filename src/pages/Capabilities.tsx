import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge, BadgeStatus } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { CAPABILITY_CATEGORIES, AvailabilityStatus } from '../data/capabilities';
import { ArrowUpRight, CheckCircle2, Shield, Layers } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | AvailabilityStatus>('ALL');

  const filterOptions: ('ALL' | AvailabilityStatus)[] = [
    'ALL',
    'AVAILABLE NOW',
    'IN DEVELOPMENT',
    'R&D / FUTURE'
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '880px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              CORE MATRIX CAPABILITIES
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              6 OPERATIONAL DOMAINS
            </span>
          </div>

          <h1 
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '24px'
            }}
          >
            CAPABILITIES
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            From the sky to the stage, from water to architecture, Matrix turns physical environments into programmable media.
          </p>

          <div 
            style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: '#fff' }}>Integrity Standard:</strong> Every capability listed below explicitly communicates its current operational maturity: <span style={{ color: 'var(--status-available)' }}>AVAILABLE NOW</span>, <span style={{ color: 'var(--status-development)' }}>IN DEVELOPMENT</span>, or <span style={{ color: 'var(--status-rd)' }}>R&D / FUTURE</span>. We do not misrepresent experimental research as off-the-shelf commercial inventory.
          </div>
        </div>

        {/* Filter Pills */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '48px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: filter === opt ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: filter === opt ? 'rgba(65, 233, 242, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: filter === opt ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Categories Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {CAPABILITY_CATEGORIES.map((cat, idx) => {
            const filteredItems = cat.items.filter((item) => filter === 'ALL' || item.status === filter);
            if (filteredItems.length === 0) return null;

            return (
              <div key={cat.id} id={cat.id} style={{ scrollMarginTop: '100px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      DOMAIN 0{idx + 1}
                    </span>
                    <h2 
                      className="font-display"
                      style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}
                    >
                      {cat.title}
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id}
                      className="glass-panel"
                      style={{
                        padding: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                            {item.name}
                          </h3>
                          <StatusBadge status={item.status} size="sm" />
                        </div>

                        <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                          {item.tagline}
                        </p>

                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '24px' }}>
                          {item.description}
                        </p>

                        {/* Applications */}
                        <div style={{ marginBottom: '20px' }}>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                            Target Applications:
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {item.applications.map((app, i) => (
                              <span 
                                key={i}
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '3px 8px',
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: '3px',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Technical Specs / Metrics */}
                      {item.metrics && (
                        <div 
                          style={{
                            borderTop: '1px solid var(--border-subtle)',
                            paddingTop: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          {item.metrics.map((m, mi) => (
                            <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              <span style={{ color: 'var(--accent-cyan)' }}>•</span> {m}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          style={{
            marginTop: '100px',
            padding: '48px',
            borderRadius: '6px',
            background: 'rgba(14, 15, 19, 0.7)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Require a Custom Spatial Installation?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              We regularly design and fabricate bespoke multi-disciplinary media systems tailored to architectural briefs.
            </p>
          </div>
          <Button to="/contact" variant="primary" size="md">
            Start a Project Enquiry
          </Button>
        </div>
      </div>
    </div>
  );
};
