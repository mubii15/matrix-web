import React from 'react';
import { Project } from '../../data/projects';
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className="glass-card-interactive"
      style={{
        borderRadius: '6px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        minHeight: '320px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Meta Line */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
            {project.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <Calendar size={12} /> {project.year}
          </div>
        </div>

        {/* Title */}
        <h3 
          className="font-display"
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '10px'
          }}
        >
          {project.title}
        </h3>

        {/* Location & Client */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
          <MapPin size={12} /> {project.location} • {project.client}
        </div>

        {/* Summary */}
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
          {project.summary}
        </p>
      </div>

      {/* Bottom Specs & Action */}
      <div>
        <div 
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.technologies.slice(0, 2).map((t, idx) => (
              <span 
                key={idx}
                style={{
                  fontSize: '0.66rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  color: 'var(--text-muted)'
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <span 
            style={{
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Case Study <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
