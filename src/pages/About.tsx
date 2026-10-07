import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, Compass, Shield, Terminal, Boxes, Calendar, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  const pillars = [
    { name: 'AEROSPACE ENGINEERING', desc: 'Rigorous flight mechanics, propulsion physics, trajectory optimization, and aviation-grade fail-safe systems.' },
    { name: 'CONTEMPORARY MEDIA ART', desc: 'Sculptural geometries, light narrative theory, architectural spatialization, and evocative visual storytelling.' },
    { name: 'SOFTWARE & ALGORITHMS', desc: 'Centroidal Voronoi tessellation, real-time 3D simulation, collision avoidance, and desktop creative suites.' },
    { name: 'LIVE PHYSICAL DEPLOYMENT', desc: 'Zero-tolerance reliability in real-world weather conditions, maritime airspaces, and urban gathering zones.' }
  ];

  const milestones = [
    {
      year: '2023',
      tag: 'THE THESIS',
      title: 'What if physical space became programmable?',
      location: 'Research & Spatial Media Lab',
      body: 'We saw the opportunity to liberate digital creativity from glass rectangles. No screens, no scaffolding, no explosive fallout. We began with a single engineering question: how do you program light, autonomous motion, and physical matter in the open world?'
    },
    {
      year: '2024',
      tag: 'WE STARTED BUILDING',
      title: 'Aircraft. Software. Swarm Systems.',
      location: 'Hardware Engineering & Flight Lab',
      body: 'Instead of purchasing off-the-shelf hobbyist drones, we engineered our own carbon-fiber airframes, low-noise propulsion systems, and encrypted dual-band swarm mesh telemetry. The foundations of the Matrix platform were forged in-house.'
    },
    {
      year: '2025',
      tag: 'SOFTWARE ENGINE',
      title: 'The Birth of Matrix Designer',
      location: 'Desktop Computational Software',
      body: 'To enable choreographers and artists to compose in three-dimensional space, we engineered Matrix Designer: an offline-first desktop tool for macOS, Windows, and Linux that translates vectors, 3D meshes, and Blender animations into validated flight paths.'
    },
    {
      year: '2026',
      tag: 'PRODUCTION FLIGHT',
      title: 'The Sky Becomes Our Canvas',
      location: 'Commercial Fleet Deployments',
      body: 'From prototype to live commercial operations: deploying synchronized swarms for high-stakes brand launches, stadium spectacles, and civic celebrations with centimeter RTK precision and dual-pilot aviation safety command.'
    },
    {
      year: '2027 & BEYOND',
      tag: 'THE FUTURE PLATFORM',
      title: 'Programmable Spaces Ecosystem',
      location: 'Matrix Marketplace & Matrix Labs',
      body: 'Opening the choreography ecosystem to creators worldwide through Matrix Marketplace, while Matrix Labs pioneers programmable water manifolds, architectural projection systems, and volumetric spatial optics.'
    }
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              COMPANY PURPOSE & VISION
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              ABOUT MATRIX
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
              marginBottom: '28px'
            }}
          >
            WE MAKE PHYSICAL <br />
            <span className="text-cyan-glow">SPACES PROGRAMMABLE.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            Matrix is a spatial media and experiential technology company that designs and engineers technology-driven experiences in physical space.
          </p>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We combine autonomous systems, software, light, motion, water, and emerging spatial computing to transform environments into programmable media. We are not simply an equipment rental operator; we build the technology that enables the future of physical experiences.
          </p>
        </div>

        {/* Intersection Matrix */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              MULTIDISCIPLINARY DNA
            </span>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>
              AT THE CONVERGENCE OF FOUR DISCIPLINES
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {pillars.map((p, idx) => (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  padding: '32px',
                  borderRadius: '6px',
                  borderTop: '2px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  DISCIPLINE 0{idx + 1}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '8px', marginBottom: '12px' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            FROM THE LAB TO THE SKY — THE MATRIX TIMELINE
            (Inspired by droneshows.co.nz Journey)
            ======================================================== */}
        <div style={{ marginBottom: '110px' }}>
          <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              EVOLUTION & MILESTONES
            </span>
            <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px', marginBottom: '12px' }}>
              FROM THE LAB TO THE SKY
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              How a research hypothesis grew into an integrated aerospace, software, and spatial media enterprise:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {milestones.map((m, idx) => (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  padding: '32px',
                  borderRadius: '6px',
                  borderLeft: '3px solid var(--accent-cyan)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {m.year}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      // {m.tag}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {m.location}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Hierarchy & Ecosystem Breakdown */}
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(36px, 5vw, 64px)',
            borderRadius: '8px',
            marginBottom: '100px',
            border: '1px solid var(--border-medium)',
            background: 'rgba(14, 15, 19, 0.85)'
          }}
        >
          <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', marginBottom: '10px' }}>
              CORPORATE STRUCTURE
            </span>
            <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>
              THE MATRIX ECOSYSTEM
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Matrix operates as the parent company and engineering hub. Our ecosystem is partitioned into dedicated platforms to provide focused value for clients, software users, and asset creators:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                PARENT COMPANY
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
                MATRIX
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                matrix.com — Corporate vision, turnkey live drone shows, architectural projection, and bespoke spatial engineering for global clients.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                DESKTOP SOFTWARE
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
                MATRIX DESIGNER
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                designer.matrix.com — Standalone offline-first desktop application for choreographers, designers, and drone fleet operators.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                DIGITAL ASSETS
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
                MATRIX MARKETPLACE
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                market.matrix.com — Cloud catalog of pre-choreographed formations, 3D animated transitions, and show templates for Matrix Designer.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                EXPERIMENTAL R&D
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
                MATRIX LABS
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                matrix.com/labs — Prototyping next-generation autonomous platforms, high-speed fluid nozzles, and volumetric holographic optics.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '36px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Explore Career Opportunities at Matrix
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              We are actively hiring aerospace engineers, creative technologists, 3D animators, and software developers.
            </p>
          </div>
          <Button to="/careers" variant="primary" size="md">
            View Open Roles
          </Button>
        </div>
      </div>
    </div>
  );
};
