import React, { useState } from 'react';

export const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'licensing'>('privacy');

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '48px' }}>
          <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>
            LEGAL & REGULATORY POLICIES
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>
            LEGAL COMPLIANCE
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Transparent legal terms covering Matrix spatial services, autonomous aviation safety, client proprietary disclosures, and software licensing.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '36px' }}>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              borderRadius: '4px',
              border: activeTab === 'privacy' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: activeTab === 'privacy' ? 'rgba(65, 233, 242, 0.1)' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              borderRadius: '4px',
              border: activeTab === 'terms' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: activeTab === 'terms' ? 'rgba(65, 233, 242, 0.1)' : 'transparent',
              color: activeTab === 'terms' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('licensing')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              borderRadius: '4px',
              border: activeTab === 'licensing' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: activeTab === 'licensing' ? 'rgba(65, 233, 242, 0.1)' : 'transparent',
              color: activeTab === 'licensing' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Software & Ecosystem Licensing
          </button>
        </div>

        {/* Content */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '6px', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                Matrix Privacy Policy
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Matrix Technologies Inc. ("Matrix", "we", "our") respects the privacy and confidential intellectual property of our enterprise clients, production partners, and website visitors.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                1. Project Enquiries & Non-Disclosure
              </h3>
              <p style={{ marginBottom: '16px' }}>
                All creative briefs, venue floor plans, and unreleased brand assets uploaded through our project consultation forms are treated under strict confidentiality and are never shared with external third parties without prior written consent.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                2. Telemetry & Anonymous Analytics
              </h3>
              <p style={{ marginBottom: '16px' }}>
                Our corporate website collects standard technical telemetry (browser type, screen resolution, referrers) strictly to diagnose rendering performance and maintain WebGL / Canvas hardware acceleration compatibility.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                Terms of Service
              </h2>
              <p style={{ marginBottom: '16px' }}>
                By accessing matrix.com, you agree to comply with all applicable aviation, maritime, and intellectual property regulations governing spatial technology installations and unmanned aircraft displays.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                1. Aviation Regulatory Compliance
              </h3>
              <p style={{ marginBottom: '16px' }}>
                All live drone light show productions are strictly contingent upon civil aviation authority permits, meteorological safety thresholds (wind, cloud ceiling, precipitation), and secure ground perimeter enforcement.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                2. Intellectual Property & Formations
              </h3>
              <p style={{ marginBottom: '16px' }}>
                Proprietary trajectory optimization algorithms, swarm communication protocols, and custom hardware airframe designs featured on this website are protected under international patent and copyright laws.
              </p>
            </div>
          )}

          {activeTab === 'licensing' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                Software & Ecosystem Licensing Architecture
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Matrix maintains a distinct separation between corporate turnkey services (matrix.com), standalone desktop software (Matrix Designer), and digital assets (Matrix Marketplace).
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                1. Matrix Designer Desktop Application
              </h3>
              <p style={{ marginBottom: '16px' }}>
                Matrix Designer is licensed as an offline-first desktop executable for macOS, Windows, and Linux. License keys and subscription tiers are governed by the End User License Agreement (EULA) accessible on designer.matrix.com.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
                2. Matrix Marketplace Assets
              </h3>
              <p style={{ marginBottom: '16px' }}>
                Purchased show assets, formation vectors, and transition choreography packages distributed through market.matrix.com include commercial performance rights specific to the user's registered account.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
