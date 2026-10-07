import React from 'react';

export type BadgeStatus = 
  | 'AVAILABLE NOW' 
  | 'IN DEVELOPMENT' 
  | 'R&D / FUTURE'
  | 'RESEARCH'
  | 'PROTOTYPE'
  | 'EXPERIMENTAL';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isAvailable = status === 'AVAILABLE NOW';
  const isInDevelopment = status === 'IN DEVELOPMENT';
  const isResearch = status === 'R&D / FUTURE' || status === 'RESEARCH' || status === 'PROTOTYPE' || status === 'EXPERIMENTAL';

  let colorClasses = 'border-white/10 text-white/70 bg-white/5';
  let dotColor = 'bg-white/40';

  if (isAvailable) {
    colorClasses = 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10 shadow-[0_0_12px_-3px_rgba(16,185,129,0.25)]';
    dotColor = 'bg-emerald-400 animate-pulse';
  } else if (isInDevelopment) {
    colorClasses = 'border-amber-500/30 text-amber-300 bg-amber-500/10 shadow-[0_0_12px_-3px_rgba(245,158,11,0.25)]';
    dotColor = 'bg-amber-400';
  } else if (isResearch) {
    colorClasses = 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10 shadow-[0_0_12px_-3px_rgba(99,102,241,0.25)]';
    dotColor = 'bg-indigo-400';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 tracking-wider' 
    : 'text-[11px] px-2.5 py-1 tracking-widest';

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        textTransform: 'uppercase',
        borderRadius: '9999px',
        border: '1px solid',
        lineHeight: 1,
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap'
      }}
      className={`${colorClasses} ${sizeClasses}`}
    >
      <span 
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          display: 'inline-block'
        }} 
        className={dotColor} 
      />
      {status}
    </span>
  );
};
