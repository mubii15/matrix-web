import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'telemetry' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = false,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  style
}) => {
  const getStyles = () => {
    let baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      borderRadius: '4px',
      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      textDecoration: 'none',
      border: '1px solid transparent',
      lineHeight: 1,
      userSelect: 'none'
    };

    if (size === 'sm') {
      baseStyles.fontSize = '0.74rem';
      baseStyles.padding = '8px 16px';
    } else if (size === 'md') {
      baseStyles.fontSize = '0.78rem';
      baseStyles.padding = '12px 24px';
    } else if (size === 'lg') {
      baseStyles.fontSize = '0.86rem';
      baseStyles.padding = '15px 32px';
      baseStyles.letterSpacing = '0.14em';
    }

    if (variant === 'primary') {
      baseStyles.background = '#ffffff';
      baseStyles.color = '#000000';
      baseStyles.borderColor = '#ffffff';
      baseStyles.boxShadow = '0 0 20px rgba(255, 255, 255, 0.25)';
    } else if (variant === 'secondary') {
      baseStyles.background = 'rgba(255, 255, 255, 0.05)';
      baseStyles.color = '#ffffff';
      baseStyles.borderColor = 'rgba(255, 255, 255, 0.24)';
      baseStyles.backdropFilter = 'blur(8px)';
      baseStyles.WebkitBackdropFilter = 'blur(8px)';
    } else if (variant === 'cyan') {
      baseStyles.background = '#ffffff';
      baseStyles.color = '#000000';
      baseStyles.borderColor = '#ffffff';
      baseStyles.boxShadow = '0 0 20px rgba(255, 255, 255, 0.35)';
    } else if (variant === 'ghost') {
      baseStyles.background = 'transparent';
      baseStyles.color = 'var(--text-secondary)';
      baseStyles.borderColor = 'transparent';
      baseStyles.boxShadow = 'none';
    } else if (variant === 'telemetry') {
      baseStyles.background = 'rgba(255, 255, 255, 0.06)';
      baseStyles.color = '#ffffff';
      baseStyles.borderColor = 'rgba(255, 255, 255, 0.25)';
      baseStyles.fontFamily = 'var(--font-mono)';
      baseStyles.letterSpacing = '0.12em';
      baseStyles.fontSize = '0.72rem';
    }

    return { ...baseStyles, ...style };
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && <ArrowUpRight size={size === 'sm' ? 14 : 16} />}
    </>
  );

  const combinedClassName = `button-root ${className}`.trim();

  if (to) {
    return (
      <Link to={to} style={getStyles()} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={getStyles()} 
        className={combinedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      style={getStyles()} 
      className={combinedClassName}
    >
      {content}
    </button>
  );
};

