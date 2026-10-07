import React from 'react';

interface PixelIconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 8-Bit Pixelated Arrow Right (Stepped pixel blocks)
 */
export const PixelArrowRight: React.FC<PixelIconProps> = ({ size = 14, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="2" y="7" width="8" height="2" />
    <rect x="8" y="5" width="2" height="2" />
    <rect x="8" y="9" width="2" height="2" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="10" y="10" width="2" height="2" />
    <rect x="12" y="6" width="2" height="4" />
  </svg>
);

/**
 * 8-Bit Pixelated Arrow Up-Right (Diagonal stepped pixel blocks)
 */
export const PixelArrowUpRight: React.FC<PixelIconProps> = ({ size = 14, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    {/* Diagonal stem */}
    <rect x="3" y="11" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="9" y="5" width="2" height="2" />
    {/* Arrowhead */}
    <rect x="7" y="3" width="6" height="2" />
    <rect x="11" y="5" width="2" height="6" />
    <rect x="9" y="3" width="4" height="4" />
  </svg>
);

/**
 * 8-Bit Pixelated Chevron Down
 */
export const PixelChevronDown: React.FC<PixelIconProps> = ({ size = 12, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="2" y="4" width="2" height="2" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="4" y="6" width="2" height="2" />
    <rect x="8" y="6" width="2" height="2" />
    <rect x="6" y="8" width="2" height="2" />
  </svg>
);

/**
 * 8-Bit Pixelated Menu Icon (Chunky 3-bar pixel stack)
 */
export const PixelMenu: React.FC<PixelIconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="2" y="3" width="12" height="2" />
    <rect x="2" y="7" width="12" height="2" />
    <rect x="2" y="11" width="12" height="2" />
  </svg>
);

/**
 * 8-Bit Pixelated Close X Icon
 */
export const PixelClose: React.FC<PixelIconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="2" y="2" width="2" height="2" />
    <rect x="4" y="4" width="2" height="2" />
    <rect x="6" y="6" width="4" height="4" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="12" y="2" width="2" height="2" />
    <rect x="10" y="10" width="2" height="2" />
    <rect x="12" y="12" width="2" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="2" y="12" width="2" height="2" />
  </svg>
);

/**
 * 8-Bit Pixel Mouse Scroll Indicator
 */
export const PixelMouse: React.FC<PixelIconProps> = ({ size = 20, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 16 24"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    {/* Outer pixelated mouse frame */}
    <rect x="4" y="1" width="8" height="2" />
    <rect x="2" y="3" width="2" height="2" />
    <rect x="12" y="3" width="2" height="2" />
    <rect x="1" y="5" width="2" height="14" />
    <rect x="13" y="5" width="2" height="14" />
    <rect x="2" y="19" width="2" height="2" />
    <rect x="12" y="19" width="2" height="2" />
    <rect x="4" y="21" width="8" height="2" />
    {/* Inner pixel wheel dot */}
    <rect x="7" y="5" width="2" height="4" />
  </svg>
);

/**
 * 8-Bit Pixelated Audio Speaker On
 */
export const PixelVolume: React.FC<PixelIconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="1" y="6" width="3" height="4" />
    <rect x="4" y="5" width="2" height="6" />
    <rect x="6" y="3" width="2" height="10" />
    {/* Sound waves */}
    <rect x="10" y="5" width="2" height="6" />
    <rect x="13" y="3" width="2" height="10" />
  </svg>
);

/**
 * 8-Bit Pixelated Audio Speaker Muted (with X)
 */
export const PixelVolumeMute: React.FC<PixelIconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="1" y="6" width="3" height="4" />
    <rect x="4" y="5" width="2" height="6" />
    <rect x="6" y="3" width="2" height="10" />
    {/* Pixel X */}
    <rect x="10" y="6" width="2" height="2" />
    <rect x="14" y="6" width="2" height="2" />
    <rect x="12" y="7" width="2" height="2" />
    <rect x="10" y="9" width="2" height="2" />
    <rect x="14" y="9" width="2" height="2" />
  </svg>
);

/**
 * 8-Bit Pixelated Checkmark
 */
export const PixelCheck: React.FC<PixelIconProps> = ({ size = 14, color = 'currentColor', style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    className={className}
    style={{
      imageRendering: 'pixelated',
      shapeRendering: 'crispEdges',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <rect x="3" y="8" width="2" height="2" />
    <rect x="5" y="10" width="2" height="2" />
    <rect x="7" y="12" width="2" height="2" />
    <rect x="9" y="10" width="2" height="2" />
    <rect x="11" y="8" width="2" height="2" />
    <rect x="13" y="6" width="2" height="2" />
  </svg>
);
