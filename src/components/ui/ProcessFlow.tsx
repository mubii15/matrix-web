import React from 'react';

interface Step {
  number?: string;
  title: string;
  description?: string;
}

interface ProcessFlowProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  currentStepIndex?: number;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ steps }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${steps.length}, minmax(180px, 1fr))`,
          gap: '12px',
          minWidth: `${steps.length * 190}px`
        }}
      >
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '4px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: idx === 0 ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: idx === 0 ? 'rgba(65, 233, 242, 0.04)' : 'rgba(14, 15, 19, 0.65)'
            }}
          >
            <div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: idx === 0 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {step.number || `STEP 0${idx + 1}`}
                </span>
                {idx < steps.length - 1 && (
                  <span 
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    →
                  </span>
                )}
              </div>
              <h4 
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}
              >
                {step.title}
              </h4>
            </div>

            {step.description && (
              <p 
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginTop: '6px'
                }}
              >
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
