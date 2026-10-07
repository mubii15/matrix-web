import React, { useState } from 'react';
import { JOURNAL_ARTICLES, JournalArticle } from '../data/journal';
import { ArrowUpRight, Calendar, Clock, User, X, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Journal: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [filterTag, setFilterTag] = useState<string>('ALL');

  const categories = ['ALL', 'ENGINEERING', 'DESIGN', 'R&D'];

  const filteredArticles = JOURNAL_ARTICLES.filter(
    (a) => filterTag === 'ALL' || a.category === filterTag
  );

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '880px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              MATRIX JOURNAL // TECHNICAL PAPERS & ESSAYS
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              ENGINEERING INSIGHTS
            </span>
          </div>

          <h1 
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '24px'
            }}
          >
            JOURNAL
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Technical deep-dives into swarm mathematical theory, hardware vertical integration, formation choreographic pipelines, and the philosophy of physical space programmability.
          </p>
        </div>

        {/* Filter Bar */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '48px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterTag(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: filterTag === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: filterTag === cat ? 'rgba(65, 233, 242, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: filterTag === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="glass-card-interactive"
              style={{
                padding: '36px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    // {article.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={12} /> {article.readTime}
                  </div>
                </div>

                <h2 
                  className="font-display"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#fff',
                    lineHeight: 1.2,
                    marginBottom: '14px'
                  }}
                >
                  {article.title}
                </h2>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                  {article.excerpt}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {article.tags.map((t, i) => (
                    <span 
                      key={i} 
                      style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '3px', color: 'var(--text-muted)' }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div 
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>{article.date}</span>
                  <span style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Essay <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(5, 5, 7, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px'
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '8px',
              background: '#0d0e12',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              padding: 'clamp(28px, 5vw, 48px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              aria-label="Close Article Reader"
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
                {selectedArticle.category}
              </span>
              <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {selectedArticle.date} • {selectedArticle.readTime}
              </span>
            </div>

            <h1 
              className="font-display"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: '20px'
              }}
            >
              {selectedArticle.title}
            </h1>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '24px',
                marginBottom: '32px',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}
            >
              <User size={15} color="var(--accent-cyan)" />
              <span>
                <strong style={{ color: '#fff' }}>{selectedArticle.author.name}</strong> — {selectedArticle.author.role}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, fontSize: '1rem', color: 'var(--text-secondary)' }}>
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div 
              style={{
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedArticle.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '3px', color: 'var(--text-muted)' }}>
                    #{t}
                  </span>
                ))}
              </div>
              <Button onClick={() => setSelectedArticle(null)} variant="secondary" size="sm">
                Close Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
