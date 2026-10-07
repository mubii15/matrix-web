import React, { useEffect, useRef, useState } from 'react';

export const SpatialCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on pointer-capable devices
    if (window.matchMedia('(hover: none)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('a, button, input, select, textarea, [data-interactive]');
      setIsHoveringInteractive(isInteractive);

      // Set technical coordinates for HUD
      setCoordinates({
        x: Math.round(e.clientX),
        y: Math.round(e.clientY)
      });
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth spring lag for outer reticle
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: isHoveringInteractive ? '0 0 12px rgba(255, 255, 255, 0.95)' : '0 0 6px rgba(255, 255, 255, 0.8)',
          transition: 'box-shadow 0.15s ease, transform 0.05s linear',
          pointerEvents: 'none'
        }}
      />

      {/* Outer Spatial Scanning Reticle */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isHoveringInteractive ? '44px' : '28px',
          height: isHoveringInteractive ? '44px' : '28px',
          marginLeft: isHoveringInteractive ? '-22px' : '-14px',
          marginTop: isHoveringInteractive ? '-22px' : '-14px',
          borderRadius: '50%',
          border: isHoveringInteractive ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.25)',
          background: isHoveringInteractive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), margin 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isHoveringInteractive && (
          <div
            style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: '#ffffff',
              letterSpacing: '0.12em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              background: 'rgba(7, 7, 9, 0.85)',
              padding: '1px 5px',
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.35)'
            }}
          >
            TARGET // LOCK
          </div>
        )}
      </div>

      {/* Floating Micro Coordinates Tag */}
      <div
        style={{
          position: 'absolute',
          left: `${coordinates.x + 18}px`,
          top: `${coordinates.y + 18}px`,
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.3)',
          letterSpacing: '0.06em',
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'opacity 0.2s ease',
          opacity: isHoveringInteractive ? 0 : 0.6
        }}
      >
        X:{coordinates.x} Y:{coordinates.y}
      </div>
    </div>
  );
};
