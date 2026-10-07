import React from 'react';

interface SectionHeaderProps {
  number?: string;
  tagline?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  maxWidth?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  tagline,
  title,
  description,
  align = 'left',
  maxWidth = '780px',
  action
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align === 'center' ? 'center' : 'left',
        marginBottom: '48px',
        position: 'relative'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {number && (
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.12em'
              }}
            >
              {number}
            </span>
          )}
          {tagline && (
            <span className="telemetry-tag">
              {tagline}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <h2 
        className="font-display"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          maxWidth: maxWidth,
          marginBottom: description ? '20px' : '0'
        }}
      >
        {title}
      </h2>

      {description && (
        <p 
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: maxWidth,
            fontWeight: 400
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
