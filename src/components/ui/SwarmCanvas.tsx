import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
  alpha: number;
}

export const SwarmCanvas: React.FC<{ interactive?: boolean; height?: string }> = ({
  interactive = true,
  height = '100%'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(320, Math.floor((width * height) / 4500));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const initParticles = () => {
      particles.length = 0;
      const radius = Math.min(width, height) * 0.35;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Fibonacci sphere point distribution
        const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const bx = radius * Math.sin(phi) * Math.cos(theta);
        const by = radius * Math.sin(phi) * Math.sin(theta);
        const bz = radius * Math.cos(phi);

        const isCyan = i % 4 !== 0;
        const color = isCyan ? '#41e9f2' : '#ffffff';

        particles.push({
          x: bx,
          y: by,
          z: bz,
          baseX: bx,
          baseY: by,
          baseZ: bz,
          vx: 0,
          vy: 0,
          vz: 0,
          color,
          size: Math.random() * 1.6 + 1.1,
          alpha: Math.random() * 0.5 + 0.5
        });
      }
    };

    initParticles();

    let rotationAngleX = 0;
    let rotationAngleY = 0;
    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Base rotation
      rotationAngleY += 0.003;
      rotationAngleX = (mouseY / height - 0.5) * 0.4;
      const mouseOffsetRotY = (mouseX / width - 0.5) * 0.6;
      const currentRotY = rotationAngleY + mouseOffsetRotY;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(rotationAngleX);
      const sinX = Math.sin(rotationAngleX);

      const fov = 420;
      const centerX = width / 2;
      const centerY = height / 2;

      // Sort by depth
      const projectedList = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic breathing effect
        const wave = Math.sin(time + i * 0.05) * 12;
        const currentRadiusRatio = 1 + wave / 200;

        const px = p.baseX * currentRadiusRatio;
        const py = p.baseY * currentRadiusRatio;
        const pz = p.baseZ * currentRadiusRatio;

        // 3D rotation Y
        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;

        // 3D rotation X
        const y2 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        // Perspective projection
        const depth = z2 + 600;
        if (depth > 20) {
          const scale = fov / depth;
          const projX = centerX + x1 * scale;
          const projY = centerY + y2 * scale;
          const projSize = Math.max(0.6, p.size * scale * 1.3);

          projectedList.push({
            x: projX,
            y: projY,
            z: z2,
            size: projSize,
            color: p.color,
            alpha: Math.min(1, Math.max(0.15, (scale - 0.2) * 1.5))
          });
        }
      }

      projectedList.sort((a, b) => b.z - a.z);

      // Render connection lines for nearest neighbours
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedList.length; i += 2) {
        const p1 = projectedList[i];
        for (let j = i + 1; j < Math.min(i + 5, projectedList.length); j++) {
          const p2 = projectedList[j];
          const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          if (distSq < 3800) {
            const lineAlpha = (1 - distSq / 3800) * 0.12 * p1.alpha;
            ctx.strokeStyle = `rgba(65, 233, 242, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render points with luminous glow
      for (let i = 0; i < projectedList.length; i++) {
        const p = projectedList[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra halo for front particles
        if (p.z > 50 && p.color === '#41e9f2') {
          ctx.fillStyle = 'rgba(65, 233, 242, 0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: height, 
        pointerEvents: 'none', 
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%',
          opacity: 0.85
        }} 
      />
    </div>
  );
};
