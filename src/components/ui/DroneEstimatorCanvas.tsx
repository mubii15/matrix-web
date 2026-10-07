import React, { useRef, useEffect } from 'react';

interface DroneEstimatorCanvasProps {
  imageType: 'logo' | 'nature' | 'digits';
  droneCount: number; // 100, 300, 500, 1000
}

interface Particle {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  phase: number;
  alpha: number;
}

export const DroneEstimatorCanvas: React.FC<DroneEstimatorCanvasProps> = ({
  imageType,
  droneCount
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const rotRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate target coordinates based on imageType and count
  const generateTargets = (type: 'logo' | 'nature' | 'digits', count: number): Array<{ x: number; y: number; z: number }> => {
    const targets: Array<{ x: number; y: number; z: number }> = [];

    if (type === 'logo') {
      // Interlocking geometric faceted butterfly / ribbon / infinity structure matching Cyberdrone screenshot
      for (let i = 0; i < count; i++) {
        // Parametric double-wing faceted infinity knot
        const t = (i / count) * Math.PI * 4;
        const layer = Math.floor(i / (count / 4));
        const layerScale = 0.65 + (layer / 4) * 0.45;
        
        // Base infinity lemniscate coordinates
        const scale = 140 * layerScale;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const bx = (scale * Math.cos(t)) / denom;
        const by = (scale * Math.sin(t) * Math.cos(t)) / denom;

        // Faceted angular displacement
        const angle = Math.atan2(by, bx);
        const r = Math.sqrt(bx * bx + by * by);
        const facetedR = r * (0.88 + 0.15 * Math.cos(angle * 4));
        
        const fx = Math.cos(angle) * facetedR;
        const fy = Math.sin(angle) * facetedR * 0.9;
        const fz = Math.sin(t * 2) * 35 * (layer / 3);

        // Nested lines for higher counts
        const jitter = (Math.random() - 0.5) * (count > 300 ? 12 : 4);

        targets.push({
          x: fx + jitter,
          y: fy + jitter,
          z: fz
        });
      }
    } else if (type === 'nature') {
      // Celestial Eagle / Phoenix in flight
      for (let i = 0; i < count; i++) {
        const u = i / count;
        let x = 0;
        let y = 0;
        let z = 0;

        if (u < 0.2) {
          // Central body and head
          const bt = (u / 0.2);
          x = (Math.random() - 0.5) * 20;
          y = -90 + bt * 160;
          z = Math.sin(bt * Math.PI) * 25;
        } else {
          // Expansive wings with feathered tips
          const wt = (u - 0.2) / 0.8;
          const side = wt < 0.5 ? -1 : 1;
          const spanT = (wt % 0.5) / 0.5; // 0 to 1 along wing
          
          const wingSpread = 190 * spanT;
          const wingArc = Math.pow(spanT, 1.3) * -70 + Math.sin(spanT * Math.PI * 2) * 25;
          const depthArc = Math.sin(spanT * Math.PI) * 45;

          // Feather layers
          const layerOffset = ((i % 4) - 1.5) * 12;

          x = side * (wingSpread + Math.abs(layerOffset));
          y = wingArc + layerOffset * 0.8;
          z = depthArc + Math.sin(spanT * 5) * 10;
        }

        targets.push({ x, y, z });
      }
    } else {
      // Digits: "2 0 2 6" geometric digital grid
      const chars = ['2', '0', '2', '6'];
      const ptsPerChar = Math.floor(count / 4);

      chars.forEach((char, cIdx) => {
        const charOffsetX = -135 + cIdx * 90;
        for (let i = 0; i < ptsPerChar; i++) {
          const t = i / ptsPerChar;
          let lx = 0;
          let ly = 0;

          if (char === '2') {
            if (t < 0.4) {
              const a = Math.PI - t * 2.5 * Math.PI;
              lx = Math.cos(a) * 22;
              ly = -45 + Math.sin(a) * 22;
            } else if (t < 0.75) {
              const st = (t - 0.4) / 0.35;
              lx = 22 - st * 44;
              ly = -25 + st * 65;
            } else {
              const bt = (t - 0.75) / 0.25;
              lx = -22 + bt * 48;
              ly = 40;
            }
          } else if (char === '0') {
            const a = t * Math.PI * 2;
            lx = Math.cos(a) * 24;
            ly = Math.sin(a) * 44;
          } else if (char === '6') {
            if (t < 0.45) {
              const a = -Math.PI * 0.4 + t * 2.2 * Math.PI;
              lx = Math.cos(a) * 24;
              ly = -10 + Math.sin(a) * 35;
            } else {
              const bt = (t - 0.45) / 0.55;
              const a = bt * Math.PI * 2;
              lx = Math.cos(a) * 22;
              ly = 18 + Math.sin(a) * 22;
            }
          }

          const jitter = (Math.random() - 0.5) * (count > 300 ? 6 : 2);
          targets.push({
            x: charOffsetX + lx + jitter,
            y: ly + jitter,
            z: (Math.random() - 0.5) * 15
          });
        }
      });
    }

    return targets;
  };

  useEffect(() => {
    const targets = generateTargets(imageType, droneCount);
    const existing = particlesRef.current;

    // Adjust particle array to match target count
    const nextParticles: Particle[] = [];
    for (let i = 0; i < targets.length; i++) {
      if (existing[i]) {
        // Transition existing particle to new target
        nextParticles.push({
          ...existing[i],
          targetX: targets[i].x,
          targetY: targets[i].y,
          targetZ: targets[i].z
        });
      } else {
        // Spawn from nearby random burst point
        const originAngle = Math.random() * Math.PI * 2;
        const originR = 250 + Math.random() * 80;
        nextParticles.push({
          x: Math.cos(originAngle) * originR,
          y: Math.sin(originAngle) * originR,
          z: (Math.random() - 0.5) * 100,
          targetX: targets[i].x,
          targetY: targets[i].y,
          targetZ: targets[i].z,
          vx: 0,
          vy: 0,
          vz: 0,
          size: Math.random() > 0.85 ? 2.4 : 1.7,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.75 + Math.random() * 0.25
        });
      }
    }

    particlesRef.current = nextParticles;
  }, [imageType, droneCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.025;

      // Smooth inertia rotation
      rotRef.current.x += (rotRef.current.targetX - rotRef.current.x) * 0.08;
      rotRef.current.y += (rotRef.current.targetY - rotRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const cameraDistance = 380;

      const particles = particlesRef.current;

      // Draw subtle background radial glow
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.min(width, height) * 0.6);
      bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.035)');
      bgGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.01)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sort particles by projected Z for correct visual depth
      const sorted = [...particles].map((p, idx) => {
        // Floating micro-drift simulating autonomous aircraft hover
        const driftX = Math.sin(time + p.phase) * 1.5;
        const driftY = Math.cos(time * 0.8 + p.phase) * 1.5;
        const driftZ = Math.sin(time * 1.2 + p.phase) * 1.0;

        // Position convergence
        p.x += (p.targetX + driftX - p.x) * 0.085;
        p.y += (p.targetY + driftY - p.y) * 0.085;
        p.z += (p.targetZ + driftZ - p.z) * 0.085;

        // 3D rotation transform around center
        const cosY = Math.cos(rotRef.current.y);
        const sinY = Math.sin(rotRef.current.y);
        const cosX = Math.cos(rotRef.current.x);
        const sinX = Math.sin(rotRef.current.x);

        // Rotate Y
        const rx1 = p.x * cosY + p.z * sinY;
        const rz1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const ry2 = p.y * cosX - rz1 * sinX;
        const rz2 = p.y * sinX + rz1 * cosX;

        // Perspective projection
        const scale = cameraDistance / (cameraDistance + rz2);
        const projX = centerX + rx1 * scale;
        const projY = centerY + ry2 * scale;

        return {
          projX,
          projY,
          scale,
          z: rz2,
          size: p.size * scale,
          alpha: Math.max(0.2, Math.min(1.0, p.alpha * scale)),
          idx
        };
      });

      sorted.sort((a, b) => b.z - a.z);

      for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];

        // Calculate LED color gradient matching Cyberdrone screenshot
        // Left side cyan (34, 211, 238) -> Center white (255, 255, 255) -> Right magenta (244, 63, 110)
        const normX = Math.max(-1, Math.min(1, p.projX ? (p.projX - centerX) / (Math.min(width, height) * 0.35) : 0));
        let r = 255, g = 255, b = 255;
        if (normX < -0.15) {
          const factor = Math.max(0, Math.min(1, (normX + 1) / 0.85));
          r = Math.round(34 + (255 - 34) * factor);
          g = Math.round(211 + (255 - 211) * factor);
          b = Math.round(238 + (255 - 238) * factor);
        } else if (normX > 0.15) {
          const factor = Math.max(0, Math.min(1, (normX - 0.15) / 0.85));
          r = Math.round(255 + (244 - 255) * factor);
          g = Math.round(255 + (63 - 255) * factor);
          b = Math.round(255 + (110 - 255) * factor);
        }

        // Glow halo
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.16 * p.alpha})`;
        ctx.fill();

        // Core bright LED dot
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.95 * p.alpha})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.shadowBlur = 6 * p.scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Mouse Drag Interaction for 3D Orbit
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      rotRef.current.targetY += dx * 0.008;
      rotRef.current.targetX -= dy * 0.008;
      // Clamp pitch
      rotRef.current.targetX = Math.max(-0.6, Math.min(0.6, rotRef.current.targetX));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.1em',
          pointerEvents: 'none'
        }}
      >
        [CLICK & DRAG TO ORBIT 3D SWARM]
      </div>
    </div>
  );
};
