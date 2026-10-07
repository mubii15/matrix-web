import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Sparkles, Eye, Waves, Radio, Move, Layers } from 'lucide-react';

export const Immersive: React.FC = () => {
  const immersiveEnvironments = [
    {
      title: 'Architectural Projection Mapping',
      tagline: 'Treating concrete and stone as luminous pixels',
      status: 'AVAILABLE NOW' as const,
      desc: 'Large-scale multi-projector warping, edge-blending, and 3D architectural scanning that projects bespoke narratives across building facades, landscapes, and custom geometric sculptures.',
      specs: ['Up to 160,000+ Lumens Laser Stacks', 'Sub-millimeter 3D LiDAR Facade Mapping', 'Real-time Perspective Warping']
    },
    {
      title: 'Engineered LED Volumes & Floors',
      tagline: 'Seamless architectural display skins',
      status: 'AVAILABLE NOW' as const,
      desc: 'High-refresh-rate, fine-pitch LED stages, curved spatial tunnels, and walk-on floor panels that eliminate the boundary between performance space and visual illusion.',
      specs: ['HDR High-Dynamic Range Processing', 'Sub-1.5mm Pixel Pitch Available', 'Zero-Reflective Optical Coating']
    },
    {
      title: '360° Geodesic & Cyclorama Domes',
      tagline: 'Complete sensory envelopment',
      status: 'AVAILABLE NOW' as const,
      desc: 'Panoramic dome environments mapped with continuous perspective-corrected visual media that completely submerse the human visual field into virtual worlds.',
      specs: ['8K Multi-Server Rendering', 'Integrated Ambisonics 3D Audio', 'Dynamic Viewer Point-of-View Tracking']
    },
    {
      title: 'Sensor-Driven Interactive Installations',
      tagline: 'Architecture that responds to human presence',
      status: 'AVAILABLE NOW' as const,
      desc: 'Physical spaces equipped with solid-state LiDAR, depth sensors, and ultrasonic arrays that alter lighting colors, sound frequencies, and projections based on crowd movement.',
      specs: ['Real-time GPU Particle Pipelines', 'LiDAR & Computer Vision Tracking', 'TouchDesigner & Notch Realtime Engine']
    },
    {
      title: 'Spatial Object-Based Audio Arrays',
      tagline: 'Acoustic points flying through physical coordinates',
      status: 'IN DEVELOPMENT' as const,
      desc: 'Multichannel acoustic speaker matrices configured with object-based coordinate panning, allowing sound objects to fly through the room in exact synchronicity with light.',
      specs: ['Dolby Atmos / d&b Soundscape Protocol', 'Low-Latency OSC Coordinate Streaming', 'Sub-Bass Physical Haptic Resonance']
    },
    {
      title: 'True Volumetric & Holographic Light',
      tagline: 'Three-dimensional geometry floating in mid-air',
      status: 'R&D / FUTURE' as const,
      desc: 'Experimental spatial optics, high-speed persistence-of-vision arrays, and aerosol light deflection creating genuine volumetric depth without glasses or headsets.',
      specs: ['Zero Headset Viewing Requirement', '360° Perspective Parallax', 'Currently in Matrix Labs Benchtop Testing']
    }
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              SPATIAL MEDIA & ARCHITECTURE
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              IMMERSIVE SPACES
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
            DON'T JUST BUILD A STAGE. <br />
            <span className="text-cyan-glow">BUILD A WORLD.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Immersive experiences dismantle the traditional separation between audience and spectacle. We engineer sensory environments where light, sound, architecture, and interaction operate as a unified programmable organism.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Button to="/contact" variant="primary" size="lg">
              Commission an Immersive Environment
            </Button>
            <Button to="/work" variant="secondary" size="lg">
              View Spatial Case Studies
            </Button>
          </div>
        </div>

        {/* Environments Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '100px' }}>
          {immersiveEnvironments.map((env, i) => (
            <div 
              key={i}
              className="glass-panel"
              style={{
                padding: '36px',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '2px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    SYSTEM 0{i + 1}
                  </span>
                  <StatusBadge status={env.status} size="sm" />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {env.title}
                </h3>

                <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {env.tagline}
                </p>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '24px' }}>
                  {env.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {env.specs.map((spec, si) => (
                  <div key={si} style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>•</span> {spec}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '48px',
            borderRadius: '6px',
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(65, 233, 242, 0.06) 0%, rgba(14, 15, 19, 0.8) 100%)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>
              BEYOND PASSIVE SPECTATORSHIP
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              True immersion is not simply projecting higher resolution video on a wall. It is the real-time dialogue between human presence, physical materials, and responsive software.
            </p>
            <div className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              WE MAKE PHYSICAL SPACES PROGRAMMABLE.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
