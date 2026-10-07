import React from 'react';
import { Button } from '../components/ui/Button';
import { ProcessFlow } from '../components/ui/ProcessFlow';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  ArrowUpRight, 
  Monitor, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Box, 
  Download, 
  CheckCircle2, 
  HardDrive 
} from 'lucide-react';

export const Designer: React.FC = () => {
  const workflowSteps = [
    { number: 'PHASE 01', title: 'CREATE', description: 'Configure fleet size and import assets: typography, SVG vectors, images, or 3D polygonal geometry.' },
    { number: 'PHASE 02', title: 'CHOREOGRAPH', description: 'Arrange formations on the timeline. Apply motion paths, easing curves, dynamic color washes, and audio sync.' },
    { number: 'PHASE 03', title: 'SIMULATE', description: 'Real-time 60fps 3D physical simulation. Inspect sightlines, audience views, and light bloom from any perspective.' },
    { number: 'PHASE 04', title: 'VALIDATE', description: 'Continuous mathematical validation checking drone separation, maximum velocity, acceleration, and geofencing limits.' },
    { number: 'PHASE 05', title: 'EXPORT', description: 'Compile verified show trajectories into secure flight-control data ready for ground station loading.' }
  ];

  const inputMethods = [
    { name: 'Typography & Text', detail: 'Instant sampling of fonts into legible point-cloud drone formations' },
    { name: 'Vector SVG Files', detail: 'Interpolate 2D bezier paths directly into synchronized drone coordinates' },
    { name: 'Raster Images', detail: 'Luminance-based density mapping converting photos into aerial portraits' },
    { name: '3D Polygonal Meshes', detail: 'Surface distribution and volume voxelization of OBJ/FBX models' },
    { name: 'Native Blender Integration', detail: 'Import complex vertex animations and camera flythroughs directly' },
    { name: 'Mathematical Trajectories', detail: 'Generative Lissajous spirals, parametric spheres, and geometric waves' }
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              STANDALONE DESKTOP APPLICATION
            </span>
            <StatusBadge status="AVAILABLE NOW" size="sm" />
          </div>

          <h1 
            className="font-display"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.02,
              marginBottom: '20px'
            }}
          >
            MATRIX DESIGNER
          </h1>

          <p 
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em'
            }}
          >
            DESIGN THE SKY.
          </p>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
            Create, choreograph, simulate, and mathematically validate professional drone light shows from your desktop. Built natively for macOS, Windows, and Linux.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Button href="https://designer.matrix.com" variant="primary" size="lg" icon>
              Visit Matrix Designer (designer.matrix.com)
            </Button>
            <Button to="/drone-shows" variant="secondary" size="lg">
              Explore Live Drone Shows
            </Button>
          </div>
        </div>

        {/* Core Concept: Anything -> Formation */}
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(36px, 5vw, 64px)',
            borderRadius: '8px',
            marginBottom: '100px',
            border: '1px solid rgba(65, 233, 242, 0.3)',
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(65, 233, 242, 0.08) 0%, rgba(14, 15, 19, 0.85) 100%)'
          }}
        >
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              THE CORE PHILOSOPHY
            </span>
            <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>
              ANYTHING → FORMATION
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Whether you are an illustrator, 3D animator, or show director, Matrix Designer ingests almost any visual asset and computes an aerodynamic, collision-free drone point cloud.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {inputMethods.map((input, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>{input.name}</h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {input.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Workflow Flow */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              THE CREATIVE WORKFLOW
            </span>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>
              HOW CHOREOGRAPHERS WORK WITH DESIGNER
            </h2>
          </div>

          <ProcessFlow steps={workflowSteps} />
        </div>

        {/* Desktop Architecture Specs */}
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(36px, 5vw, 64px)',
            borderRadius: '8px',
            marginBottom: '100px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ maxWidth: '820px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HardDrive size={18} color="var(--accent-cyan)" />
              <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
                OFFLINE-FIRST ARCHITECTURE
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>
              PROFESSIONAL LOCAL DESKTOP EXECUTION
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A professional show director at a remote flight field should never have to ask: "Do I have internet connection right now?" Matrix Designer operates completely locally.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Zero Browser Latency</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Direct GPU hardware acceleration rendering hundreds of luminous drones with physical motion blur at silky-smooth 60fps.
              </p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Local File Security</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Proprietary show files (.matrixshow) remain strictly on your local disk. Confidential client brand reveals are never uploaded to unsecured cloud endpoints.
              </p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Seamless Licensing Sync</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Periodically verifies credentials with api.matrix.com and provides full offline license leases for field operations.
              </p>
            </div>
          </div>
        </div>

        {/* Download Callout linking to designer.matrix.com */}
        <div 
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(65, 233, 242, 0.1) 0%, transparent 80%)',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>
            DOWNLOAD MATRIX DESIGNER
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 28px auto' }}>
            Visit the dedicated Matrix Designer portal to explore full system documentation, release notes, license tiers, and multi-platform installers.
          </p>
          <Button href="https://designer.matrix.com" variant="primary" size="lg" icon>
            Go to designer.matrix.com
          </Button>
        </div>
      </div>
    </div>
  );
};
