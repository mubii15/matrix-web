import React, { useState } from 'react';
import { StatusBadge, BadgeStatus } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { LAB_PROJECTS, LabStatus } from '../data/labs';
import { FlaskConical, Atom, Binary, CheckCircle2, ChevronRight } from 'lucide-react';

export const Labs: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | LabStatus>('ALL');

  const filterOptions: ('ALL' | LabStatus)[] = [
    'ALL',
    'RESEARCH',
    'PROTOTYPE',
    'IN DEVELOPMENT',
    'EXPERIMENTAL'
  ];

  const filteredProjects = LAB_PROJECTS.filter((p) => filter === 'ALL' || p.status === filter);

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              MATRIX LABS // RESEARCH & EXPERIMENTATION
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              EXPERIMENTAL DIVISION
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
            EXPLORING WHAT <br />
            <span className="text-cyan-glow">COMES NEXT.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
            Matrix Labs is our experimental incubator. Here, our engineers and artists test boundary-pushing prototypes across all-weather aerial robotics, high-speed fluid valves, decentralized swarm algorithms, and spatial optics.
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
            <strong style={{ color: '#fff' }}>Research Integrity Notice:</strong> Projects listed on this page are active engineering experiments or benchtop prototypes. They are <strong style={{ color: 'var(--status-rd)' }}>not commercial products for hire</strong>. They represent our medium-term technological roadmap.
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

        {/* Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '80px' }}>
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="glass-panel"
              style={{
                padding: '36px',
                borderRadius: '8px',
                borderLeft: '3px solid var(--accent-cyan)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {project.codename}
                  </span>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    // {project.category}
                  </span>
                </div>
                <StatusBadge status={project.status} size="sm" />
              </div>

              <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                {project.title}
              </h2>

              <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                {project.summary}
              </p>

              {/* Hypothesis Box */}
              <div 
                style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  marginBottom: '24px'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Core Engineering Hypothesis:
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.55 }}>
                  "{project.hypothesis}"
                </p>
              </div>

              {/* Technical Milestones */}
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Recorded Milestones & Trajectory:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {project.technicalMilestones.map((ms, mi) => (
                    <div 
                      key={mi}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.015)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}
                    >
                      <CheckCircle2 size={13} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)'
                }}
              >
                <span>FACILITY: MATRIX PROVING GROUND</span>
                <span>STATUS LOGGED: {project.lastUpdate.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Academic / Research Partnerships */}
        <div 
          className="glass-panel"
          style={{
            padding: '48px',
            borderRadius: '6px',
            textAlign: 'center',
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(65, 233, 242, 0.06) 0%, rgba(14, 15, 19, 0.8) 100%)'
          }}
        >
          <h3 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>
            COLLABORATIVE RESEARCH & PARTNERSHIPS
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Matrix Labs welcomes collaboration with university robotics laboratories, aerospace research institutes, and computational media artists.
          </p>
          <Button to="/contact" variant="primary" size="md">
            Inquire About R&D Collaboration
          </Button>
        </div>
      </div>
    </div>
  );
};
