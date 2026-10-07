import React, { useState } from 'react';
import { CAREER_ROLES, CareerRole } from '../data/careers';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, MapPin, Briefcase, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const Careers: React.FC = () => {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const toggleRole = (id: string) => {
    setExpandedRole(expandedRole === id ? null : id);
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              JOIN MATRIX
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              RECRUITMENT & TALENT
            </span>
          </div>

          <h1 
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 5.8vw, 4.6rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.04,
              marginBottom: '24px'
            }}
          >
            BUILD WHAT <br />
            <span className="text-cyan-glow">DOESN'T EXIST YET.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
            We are building a multidisciplinary engineering and creative laboratory. We work across autonomous flight controllers, computer vision shaders, pneumatic fluid manifolds, and high-precision spatial choreography.
          </p>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            If you thrive at the edge of physical reality and computational logic, explore our open positions below.
          </p>
        </div>

        {/* Roles List */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ marginBottom: '28px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              OPEN TECHNICAL & CREATIVE POSITIONS
            </span>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>
              CURRENT OPENINGS ({CAREER_ROLES.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CAREER_ROLES.map((role) => {
              const isExpanded = expandedRole === role.id;

              return (
                <div 
                  key={role.id}
                  className="glass-panel"
                  style={{
                    borderRadius: '6px',
                    overflow: 'hidden',
                    borderLeft: isExpanded ? '3px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Header Row */}
                  <div 
                    onClick={() => toggleRole(role.id)}
                    style={{
                      padding: '28px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                          // {role.department}
                        </span>
                        <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          • {role.type}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                        {role.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        <MapPin size={12} /> {role.location}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {isExpanded ? 'Hide Details' : 'View Role'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div 
                      style={{
                        padding: '0 28px 28px 28px',
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: '4px'
                      }}
                    >
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '20px 0' }}>
                        {role.description}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Primary Responsibilities
                          </h4>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {role.responsibilities.map((resp, ri) => (
                              <li key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <CheckCircle2 size={13} color="var(--accent-cyan)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Required Qualifications
                          </h4>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {role.requirements.map((req, rqi) => (
                              <li key={rqi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Button to="/contact" variant="primary" size="sm">
                          Apply for this Position
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* General Application Banner */}
        <div 
          className="glass-panel"
          style={{
            padding: '48px',
            borderRadius: '6px',
            textAlign: 'center',
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(65, 233, 242, 0.08) 0%, rgba(14, 15, 19, 0.8) 100%)'
          }}
        >
          <h3 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '12px' }}>
            DON'T SEE YOUR SPECIFIC DISCIPLINE?
          </h3>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            We frequently create positions around exceptional people. If you possess rare skills in robotics, fluid dynamics, creative coding, or live show direction, send an open portfolio application.
          </p>
          <Button to="/contact" variant="primary" size="md">
            Submit Open Application
          </Button>
        </div>
      </div>
    </div>
  );
};
