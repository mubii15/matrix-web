import React, { useEffect, useRef } from 'react';

export const HeroLightStreakCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Subtle drifting starlight micro-photons along the flow
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      offsetY: (Math.random() - 0.5) * 8,
      speed: 0.05 + Math.random() * 0.08,
      size: 0.8 + Math.random() * 1.4,
      opacity: 0.3 + Math.random() * 0.5
    }));

    const render = (timestamp: number) => {
      const t = timestamp * 0.001;

      ctx.clearRect(0, 0, width, height);

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const W = width;
      const H = height;
      const centerY = H * 0.5;

      // Gentle organic wave harmonics
      const t1 = t * 0.85;
      const t2 = t * 1.15;
      const waveL1 = Math.sin(t1) * 4;
      const waveL2 = Math.cos(t2) * 3;
      const waveR1 = Math.sin(t1 + 1.3) * 4;
      const waveR2 = Math.cos(t2 + 1.7) * 3;
      const waistWave = Math.sin(t * 1.4) * 2;

      // SLIMMER HOURGLASS SHAPE:
      // Left and right flares are refined (~35% of H), center waist is ultra-slender (~6% of H)
      const topYLeft = H * 0.32 + waveL1;
      const topYCenter = H * 0.47 + waistWave;
      const topYRight = H * 0.34 + waveR1;

      const botYLeft = H * 0.68 + waveL2;
      const botYCenter = H * 0.53 - waistWave;
      const botYRight = H * 0.66 + waveR2;

      // -----------------------------------------------------------------------
      // Pass 1: Slim Volumetric Feathered Mist (Shades of Pure White & Platinum)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.filter = 'blur(26px)';

      ctx.beginPath();
      ctx.moveTo(0, topYLeft);
      ctx.bezierCurveTo(W * 0.35, topYCenter - 6, W * 0.65, topYCenter - 6, W, topYRight);
      ctx.lineTo(W, botYRight);
      ctx.bezierCurveTo(W * 0.65, botYCenter + 6, W * 0.35, botYCenter + 6, 0, botYLeft);
      ctx.closePath();

      const mistGrad = ctx.createLinearGradient(0, 0, W, 0);
      mistGrad.addColorStop(0, 'rgba(235, 242, 252, 0.3)');
      mistGrad.addColorStop(0.25, 'rgba(248, 250, 255, 0.65)');
      mistGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      mistGrad.addColorStop(0.75, 'rgba(248, 250, 255, 0.65)');
      mistGrad.addColorStop(1, 'rgba(235, 242, 252, 0.3)');
      ctx.fillStyle = mistGrad;
      ctx.fill();
      ctx.restore();

      // -----------------------------------------------------------------------
      // Pass 2: Left & Right Flaring Horn Blooms (Soft, Slim Starlight Glows)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.filter = 'blur(20px)';

      // Left horn
      const leftHorn = ctx.createRadialGradient(0, centerY, 4, 0, centerY, W * 0.28);
      leftHorn.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      leftHorn.addColorStop(0.25, 'rgba(245, 248, 255, 0.55)');
      leftHorn.addColorStop(0.65, 'rgba(220, 230, 245, 0.18)');
      leftHorn.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftHorn;
      ctx.fillRect(0, 0, W * 0.4, H);

      // Right horn
      const rightHorn = ctx.createRadialGradient(W, centerY, 4, W, centerY, W * 0.28);
      rightHorn.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      rightHorn.addColorStop(0.25, 'rgba(245, 248, 255, 0.55)');
      rightHorn.addColorStop(0.65, 'rgba(220, 230, 245, 0.18)');
      rightHorn.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightHorn;
      ctx.fillRect(W * 0.6, 0, W * 0.4, H);
      ctx.restore();

      // -----------------------------------------------------------------------
      // Pass 3: Concentrated Slim White Core Waist (Hourglass Pinch)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.filter = 'blur(10px)';
      ctx.beginPath();
      ctx.moveTo(0, topYLeft + 10);
      ctx.bezierCurveTo(W * 0.35, topYCenter + 1, W * 0.65, topYCenter + 1, W, topYRight + 10);
      ctx.lineTo(W, botYRight - 10);
      ctx.bezierCurveTo(W * 0.65, botYCenter - 1, W * 0.35, botYCenter - 1, 0, botYLeft - 10);
      ctx.closePath();

      const coreGrad = ctx.createLinearGradient(0, 0, W, 0);
      coreGrad.addColorStop(0, 'rgba(240, 245, 255, 0.45)');
      coreGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
      coreGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      coreGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.85)');
      coreGrad.addColorStop(1, 'rgba(240, 245, 255, 0.45)');
      ctx.fillStyle = coreGrad;
      ctx.fill();
      ctx.restore();

      // -----------------------------------------------------------------------
      // Pass 4: Central Horizontal Laser Spine (Pure White Core Line)
      // -----------------------------------------------------------------------
      ctx.save();
      // Soft spine halo
      ctx.filter = 'blur(4px)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.bezierCurveTo(W * 0.35, centerY + waveL1 * 0.1, W * 0.65, centerY + waveR1 * 0.1, W, centerY);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.stroke();

      // Crisp center core
      ctx.filter = 'none';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.bezierCurveTo(W * 0.35, centerY + waveL1 * 0.1, W * 0.65, centerY + waveR1 * 0.1, W, centerY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // -----------------------------------------------------------------------
      // Pass 5: Elegant Horizontal Light Surge Wave (NO CIRCULAR BALL!)
      // Flat, elongated laser flash washing smoothly across the horizontal ribbon
      // -----------------------------------------------------------------------
      const surgeProgress = (t * 0.16) % 1.6 - 0.3;
      const surgeX = surgeProgress * W;

      if (surgeX > -300 && surgeX < W + 300) {
        ctx.save();
        ctx.filter = 'blur(6px)';
        // Flat horizontal light strip 450px wide and only 8px tall
        const surgeGrad = ctx.createLinearGradient(surgeX - 225, 0, surgeX + 225, 0);
        surgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        surgeGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
        surgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = surgeGrad;
        ctx.fillRect(surgeX - 225, centerY - 4, 450, 8);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // Pass 6: Subtle Flowing Stardust Photons
      // -----------------------------------------------------------------------
      ctx.save();
      for (const p of particles) {
        p.x += p.speed * 0.0025;
        if (p.x > 1) {
          p.x = 0;
          p.offsetY = (Math.random() - 0.5) * 8;
        }

        const px = p.x * W;
        const waistFactor = Math.abs(p.x - 0.5) * 2;
        const py = centerY + p.offsetY * (0.3 + waistFactor * 1.0);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (0.5 + (1 - waistFactor) * 0.4)})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 3;
        ctx.fill();
      }
      ctx.restore();

      // -----------------------------------------------------------------------
      // Pass 7: Absolute Mathematical Alpha Fade (Seamless feather at top & bottom)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      const verticalFade = ctx.createLinearGradient(0, 0, 0, H);
      verticalFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      verticalFade.addColorStop(0.20, 'rgba(0, 0, 0, 0.85)');
      verticalFade.addColorStop(0.35, 'rgba(0, 0, 0, 1)');
      verticalFade.addColorStop(0.65, 'rgba(0, 0, 0, 1)');
      verticalFade.addColorStop(0.80, 'rgba(0, 0, 0, 0.85)');
      verticalFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = verticalFade;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};
