import React, { useState, useEffect, useRef } from 'react';
import { Sliders, ShieldCheck, Eye, Zap, Wind } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

export const InteractiveFleetSimulator: React.FC = () => {
  const [fleetSize, setFleetSize] = useState<number>(500);
  const [formationType, setFormationType] = useState<'sphere' | 'spiral' | 'bird' | 'matrix'>('sphere');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute show telemetry based on fleet size
  const airspaceWidth = Math.round(40 + (fleetSize / 1000) * 120);
  const airspaceHeight = Math.round(50 + (fleetSize / 1000) * 100);
  const visibilityDistance = (1.5 + (fleetSize / 1000) * 3.5).toFixed(1);
  const totalLumens = (fleetSize * 1800).toLocaleString();

  // Canvas visual simulation of the active fleet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Set canvas dimensions
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 360;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.02;
      ctx.fillStyle = 'rgba(7, 7, 9, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.38;

      // Draw faint flight zone boundary
      ctx.strokeStyle = 'rgba(65, 233, 242, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active fleet drones
      const count = Math.min(fleetSize, 600); // Visual clamp for smooth 60fps canvas render
      for (let i = 0; i < count; i++) {
        let x = cx;
        let y = cy;
        let color = '#41e9f2';

        if (formationType === 'sphere') {
          const angle = (i / count) * Math.PI * 2 + t * 0.4;
          const r = radius * (0.3 + 0.65 * Math.sin(i * 137.5 + t));
          x = cx + Math.cos(angle) * r;
          y = cy + Math.sin(angle) * r * 0.6;
          color = i % 2 === 0 ? '#41e9f2' : '#f59e0b';
        } else if (formationType === 'spiral') {
          const angle = (i * 0.15) + t * 1.2;
          const r = (i / count) * radius;
          x = cx + Math.cos(angle) * r;
          y = cy + Math.sin(angle) * r * 0.8;
          color = i % 3 === 0 ? '#ffffff' : (i % 2 === 0 ? '#41e9f2' : '#38bdf8');
        } else if (formationType === 'bird') {
          // Dynamic undulating soaring bird / wing shape
          const wingSide = i % 2 === 0 ? 1 : -1;
          const wingSpan = (i / count) * radius;
          const flap = Math.sin(t * 3 + wingSpan * 0.05) * 35;
          x = cx + wingSide * wingSpan * 0.9;
          y = cy - (wingSpan * 0.3) + flap;
          color = '#41e9f2';
        } else if (formationType === 'matrix') {
          // Kinetic grid matrix cube
          const cols = 20;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const spacing = (radius * 1.6) / cols;
          x = cx - (radius * 0.8) + col * spacing;
          y = cy - (radius * 0.6) + row * spacing + Math.sin(t * 2 + col * 0.4) * 15;
          color = row % 2 === 0 ? '#00f0a8' : '#41e9f2';
        }

        // Draw drone point with glow halo
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // High-density leader drone beacons
        if (i % 25 === 0) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [fleetSize, formationType]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFleetSize(val);
    soundEngine.playChime(300 + (val / 2000) * 500, 'sine', 0.15);
  };

  const handleFormationSelect = (type: 'sphere' | 'spiral' | 'bird' | 'matrix') => {
    setFormationType(type);
    soundEngine.playMorphSound();
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        marginBottom: '48px',
        background: 'rgba(14, 15, 19, 0.92)'
      }}
    >
      {/* Top Header & Simulation Controls */}
      <div
        style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)'
            }}
          />
          <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
            INTERACTIVE FLEET AIRSPACE SIMULATOR
          </span>
        </div>

        {/* Formation Shape Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'sphere', label: 'CELESTIAL ORB' },
            { id: 'spiral', label: 'GALAXY SPIRAL' },
            { id: 'bird', label: 'KINETIC AVIAN' },
            { id: 'matrix', label: 'PROGRAMMED GRID' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleFormationSelect(f.id as 'sphere' | 'spiral' | 'bird' | 'matrix')}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '6px 10px',
                borderRadius: '4px',
                background: formationType === f.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.04)',
                color: formationType === f.id ? '#070709' : 'var(--text-secondary)',
                border: formationType === f.id ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Animated Airspace Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '360px', background: '#070709' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Live Canvas Telemetry Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent-cyan)',
            letterSpacing: '0.08em',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: 'rgba(7, 7, 9, 0.75)',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(65, 233, 242, 0.2)'
          }}
        >
          <div>SWARM STATUS: AIRBORNE // SYNC 100%</div>
          <div>ACTIVE DRONES: {fleetSize} UNITS</div>
          <div>RTK GPS: RTK-FIXED (0.8cm Precision)</div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '20px',
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            background: 'rgba(7, 7, 9, 0.75)',
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          SIMULATED 60FPS CHOREOGRAPHY ENGINE
        </div>
      </div>

      {/* Interactive Controls & Real-Time Specifications */}
      <div style={{ padding: '24px 28px', background: 'rgba(21, 22, 28, 0.6)' }}>
        {/* Fleet Size Slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} color="var(--accent-cyan)" /> FLEET SCALE CONTROLLER
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {fleetSize} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DRONES</span>
            </span>
          </div>

          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={fleetSize}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              accentColor: 'var(--accent-cyan)',
              cursor: 'pointer'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>100 (Intimate)</span>
            <span>500 (Enterprise)</span>
            <span>1,000 (Stadium)</span>
            <span>2,000+ (National Landmark)</span>
          </div>
        </div>

        {/* Dynamic Computed Telemetry Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <Wind size={12} /> AIRSPACE VOLUME
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {airspaceWidth}m × {airspaceHeight}m
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe flight corridor envelope</div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <Eye size={12} /> VISIBILITY RADIUS
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Up to {visibilityDistance} km
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct line-of-sight audience view</div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <Zap size={12} /> LUMINOUS OUTPUT
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {totalLumens} lm
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-output multi-spectral RGBW LEDs</div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f0a8', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <ShieldCheck size={12} /> AVIATION SAFETY
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Triple Redundant
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FAA Part 107 / CAA compliant geofence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
