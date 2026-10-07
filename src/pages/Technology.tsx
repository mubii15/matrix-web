import React from 'react';
import { ProcessFlow } from '../components/ui/ProcessFlow';
import { Button } from '../components/ui/Button';
import { 
  VERTICAL_INTEGRATION_PILLARS, 
  TECH_ARCHITECTURE, 
  WHY_BUILD_TECH 
} from '../data/technology';
import { Cpu, Radio, Shield, Wrench, Terminal, Layers } from 'lucide-react';

export const Technology: React.FC = () => {
  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              ENGINEERING & R&D CULTURE
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              VERTICAL INTEGRATION
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
            WE DON'T JUST USE TECHNOLOGY. <br />
            <span className="text-cyan-glow">WE BUILD IT.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Matrix is vertically integrated. We develop our own drone airframes, embedded electronics, swarm coordination firmware, and creative software. We believe the only way to invent new physical media is to control the entire technology stack.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Button to="/designer" variant="primary" size="lg">
              Explore Matrix Designer Software
            </Button>
            <Button to="/labs" variant="secondary" size="lg">
              Explore Matrix Labs (R&D)
            </Button>
          </div>
        </div>

        {/* 5-Pillar Vertical Integration Flow */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              THE VERTICAL STACK
            </span>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>
              HOW WE GO FROM FIRST PRINCIPLES TO LIVE FLIGHT
            </h2>
          </div>

          <ProcessFlow
            steps={VERTICAL_INTEGRATION_PILLARS.map((p) => ({
              number: `PHASE ${p.step}`,
              title: p.name,
              description: p.description
            }))}
          />
        </div>

        {/* Technology Architecture Cards */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '36px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              CORE SYSTEMS
            </span>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>
              PROPRIETARY HARDWARE & SOFTWARE
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {TECH_ARCHITECTURE.map((tech) => (
              <div 
                key={tech.id}
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
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {tech.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      IN-HOUSE SPEC
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                    {tech.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '24px' }}>
                    {tech.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {tech.specs.map((s, si) => (
                    <div key={si} style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>•</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Matrix Builds Its Own Tech */}
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(36px, 5vw, 64px)',
            borderRadius: '8px',
            background: 'rgba(14, 15, 19, 0.8)',
            border: '1px solid var(--border-medium)',
            marginBottom: '80px'
          }}
        >
          <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              FIRST-PRINCIPLES ADVANTAGE
            </span>
            <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>
              WHY WE DEVELOP IN-HOUSE
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Event rental companies rely on third-party black-box equipment with generic capabilities. Matrix operates as a deep engineering laboratory. Here is why in-house R&D matters for our clients and audiences:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {WHY_BUILD_TECH.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px'
                }}
              >
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', display: 'block', marginBottom: '8px' }}>
                  0{idx + 1}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Button to="/contact" variant="primary" size="lg">
            Consult With Our Engineering Team
          </Button>
        </div>
      </div>
    </div>
  );
};
