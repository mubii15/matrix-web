import React, { useEffect } from 'react';
import { X, MapPin, Calendar, Layers, Activity } from 'lucide-react';
import { Project } from '../../data/projects';
import { Button } from './Button';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5, 5, 7, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '8px',
          background: '#0d0e12',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          padding: '36px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Telemetry */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
            CASE STUDY // {project.category.toUpperCase()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Calendar size={13} /> {project.year}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <MapPin size={13} /> {project.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Layers size={13} /> {project.client}
          </div>
        </div>

        {/* Title */}
        <h2 
          className="font-display"
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}
        >
          {project.title}
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
          {project.summary}
        </p>

        {/* Metrics Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '36px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px'
          }}
        >
          {project.metrics.map((metric, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {metric.label}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* 4-Phase Case Study Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              01 // The Brief
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.55 }}>
              {project.details.brief}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              02 // The Concept
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.55 }}>
              {project.details.concept}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              03 // Engineering & Logistics
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.55 }}>
              {project.details.engineering}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              04 // Results & Impact
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '8px', lineHeight: 1.55 }}>
              {project.details.results}
            </p>
          </div>
        </div>

        {/* Footer CTAs in Modal */}
        <div 
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.technologies.map((t, idx) => (
              <span 
                key={idx}
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  color: 'var(--text-muted)'
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <Button to="/contact" variant="primary" size="sm">
            Inquire About Similar Scope
          </Button>
        </div>
      </div>
    </div>
  );
};
