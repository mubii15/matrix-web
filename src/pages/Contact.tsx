import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  UploadCloud, 
  Clock, 
  Compass, 
  HelpCircle,
  AlertTriangle,
  Radio,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Drone Show',
    fleetEstimate: '250 Drones',
    venueSetting: 'Waterfront / Coastal',
    audioSync: 'Synchronized Musical Soundtrack',
    location: '',
    projectDate: '',
    estimatedAudience: '',
    budgetRange: '₦75M - ₦200M / $50k - $120k',
    description: '',
    fileName: ''
  });

  const projectTypes = [
    'Drone Show',
    'Immersive Experience',
    'Projection Mapping',
    'LED Installation',
    'Programmable Water Experience',
    'Custom Technology Development',
    'R&D / Academic Partnership',
    'Other'
  ];

  const fleetSizes = [
    '100 Drones (Intimate / Brand Reveal)',
    '250 Drones (Festival / Dynamic 3D)',
    '500 Drones (Monumental Civic Symphony)',
    '1,000+ Drones (Mega-Spectacle)',
    'Recommend based on my venue sightlines'
  ];

  const venueSettings = [
    'Waterfront / Coastal / Lake',
    'Stadium / Arena Grandstand',
    'Open Grass Field / Park',
    'Urban Plaza / Tarmac',
    'Enclosed Indoor Arena'
  ];

  const budgetOptions = [
    'Under ₦35,000,000 / $25,000',
    '₦35,000,000 - ₦75,000,000 / $25k - $50k',
    '₦75,000,000 - ₦200,000,000 / $50k - $130k',
    '₦200,000,000+ / Custom Enterprise Scale'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '120px' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ maxWidth: '920px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
              PROJECT FEASIBILITY & CONSULTATION
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              CLIENT ENQUIRY PORTAL
            </span>
          </div>

          <h1 
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 5.8vw, 4.6rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.04,
              marginBottom: '24px'
            }}
          >
            WHAT CAN WE CREATE <br />
            <span className="text-cyan-glow">WITH YOUR SPACE?</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Tell us about your event, venue dimensions, and narrative concepts. Our flight directors and engineering teams will review airspace logistics, drone count recommendations, and 3D simulation concepts.
          </p>
        </div>

        {/* Immersive Mission Configurator Callout Banner */}
        <div 
          style={{ 
            marginBottom: '40px',
            padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Radio size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', background: 'rgba(56,189,248,0.1)' }}>
                  IMMERSIVE FLIGHT COCKPIT
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  REAL-TIME 3D SWARM ENGINE READY
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Looking to customize fleet scale & visual effects live?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', margin: '4px 0 0 0' }}>
                Experience the 3D aerial simulator, test drone counts up to 5,000, and generate an executive flight mission pass.
              </p>
            </div>
          </div>
          <Link
            to="/book"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 22px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#000000',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.25s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 28px rgba(56, 189, 248, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4)';
            }}
          >
            <span>LAUNCH 3D CONFIGURATOR</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'flex-start' }}>
          {/* Main Enquiry Form */}
          <div 
            className="glass-panel"
            style={{
              padding: 'clamp(28px, 4vw, 44px)',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              background: 'rgba(14, 15, 19, 0.85)'
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 168, 0.1)',
                    border: '1px solid var(--status-available)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                  }}
                >
                  <CheckCircle size={32} color="var(--status-available)" />
                </div>
                <h3 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '12px' }}>
                  INQUIRY LOGGED INTO MATRIX TELEMETRY
                </h3>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 28px auto' }}>
                  Thank you, <strong style={{ color: '#fff' }}>{formData.name}</strong>. A dedicated project director from Matrix Flight & Spatial Operations has received your brief and will contact you within 24 business hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="secondary" size="md">
                  Submit Another Brief
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Organization / Brand / Agency *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Global Media"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="elena@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Direct Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Primary Project Type *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          borderRadius: '4px',
                          border: formData.projectType === type ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                          background: formData.projectType === type ? 'rgba(65, 233, 242, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          color: formData.projectType === type ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drone Show Specifics (Fleet Size & Venue) */}
                {formData.projectType === 'Drone Show' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', padding: '18px', background: 'rgba(65, 233, 242, 0.03)', border: '1px solid rgba(65, 233, 242, 0.15)', borderRadius: '6px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Estimated Fleet Size
                      </label>
                      <select
                        value={formData.fleetEstimate}
                        onChange={(e) => setFormData({ ...formData, fleetEstimate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#15161c',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '0.84rem',
                          outline: 'none',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {fleetSizes.map((f, i) => (
                          <option key={i} value={f} style={{ background: '#15161c' }}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Venue Setting Environment
                      </label>
                      <select
                        value={formData.venueSetting}
                        onChange={(e) => setFormData({ ...formData, venueSetting: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#15161c',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '0.84rem',
                          outline: 'none',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {venueSettings.map((v, i) => (
                          <option key={i} value={v} style={{ background: '#15161c' }}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Logistics Info: Location, Date, Audience */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Proposed Location / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos Harbor / London"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Target Date / Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. November 2026"
                      value={formData.projectDate}
                      onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Estimated Audience Scope
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10,000 on site / Broadcast"
                      value={formData.estimatedAudience}
                      onChange={(e) => setFormData({ ...formData, estimatedAudience: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Approximate Production Budget
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#15161c',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {budgetOptions.map((b, i) => (
                      <option key={i} value={b} style={{ background: '#15161c' }}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Project Description / Creative Brief *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your creative narrative, brand themes, venue dimensions, musical synchronization, or key milestones..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      lineHeight: 1.5,
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Optional Attachment File UI */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Attach Site Map / Deck / Brief (PDF, DOCX, ZIP)
                  </label>
                  <div 
                    style={{
                      border: '1px dashed var(--border-medium)',
                      padding: '20px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.01)',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.onchange = (e: any) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, fileName: e.target.files[0].name });
                        }
                      };
                      input.click();
                    }}
                  >
                    <UploadCloud size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 8px auto' }} />
                    <p style={{ fontSize: '0.82rem', color: formData.fileName ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                      {formData.fileName ? `Selected: ${formData.fileName}` : 'Click to select project files'}
                    </p>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg">
                  Submit Project Enquiry
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details & Operations Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '6px' }}>
              <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                MATRIX HEADQUARTERS
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Engineering & Creative Studio
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Physical flight testing, robotics fabrication, and spatial media research facility.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} color="var(--accent-cyan)" />
                  <span>Victoria Island / Lekki Aerospace Corridor, Lagos, Nigeria</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Mail size={16} color="var(--accent-cyan)" />
                  <span>projects@matrix.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Phone size={16} color="var(--accent-cyan)" />
                  <span>+234 1 800 MATRIX</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Clock size={16} color="var(--accent-cyan)" />
                  <span>Mon – Fri: 08:00 – 18:00 WAT (24/7 Live Flight Ops)</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={18} color="var(--status-available)" />
                <span className="telemetry-tag" style={{ color: 'var(--accent-cyan)' }}>
                  REGULATORY TIMELINES
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Airspace Authorization Filing Window
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Standard domestic airspace NOTAM authorizations require approximately <strong>4 weeks</strong>. For international cross-border shows or military-adjacent airspace, allow 6 to 8 weeks for civil aviation clearance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
