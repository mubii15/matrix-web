import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DroneEstimatorCanvas } from '../components/ui/DroneEstimatorCanvas';
import { HandshakeParticleCanvas } from '../components/ui/HandshakeParticleCanvas';
import { DroneWaveHeaderCanvas } from '../components/ui/DroneWaveHeaderCanvas';
import { FooterPinnedHud } from '../components/ui/FooterPinnedHud';
import { soundEngine } from '../utils/audioSynth';
import '../styles/drone-shows.css';
import { 
  Sparkles, 
  CheckCircle, 
  ChevronRight,
  Play,
  X,
  Shield,
  Wind,
  Flame,
  QrCode,
  ArrowUpRight
} from 'lucide-react';

export const DroneShows: React.FC = () => {
  // Estimator State
  const [imageType, setImageType] = useState<'logo' | 'nature' | 'digits'>('logo');
  const [droneCount, setDroneCount] = useState<number>(500);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReelOpen, setIsReelOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Drone count options
  const droneCounts = [100, 300, 500, 1000];

  // Spec descriptions based on drone count
  const specDetails: Record<number, {
    title: string;
    sightline: string;
    bestFor: string;
    resolution: string;
    scale: string;
    area: string;
  }> = {
    100: {
      title: 'Precision Brand Signatures',
      sightline: '1.5 – 2.0 km',
      bestFor: 'VIP product reveals, intimate private venues, crisp 2D corporate logos & geometric letters',
      resolution: 'Crisp 2D vector curves & essential typography',
      scale: '80m – 120m diameter formations',
      area: '100m × 80m flight corridor'
    },
    300: {
      title: 'Dynamic Volumetric Silhouettes',
      sightline: '2.5 – 3.5 km',
      bestFor: 'Outdoor festivals, corporate launches, 3D animated transitions & scannable floating QR codes',
      resolution: 'Smooth animated morphs & dual-layer depth',
      scale: '160m – 240m diameter formations',
      area: '200m × 150m flight corridor'
    },
    500: {
      title: 'Cinematic 3D Sky Sculptures',
      sightline: '3.5 – 5.0 km',
      bestFor: 'Arenas, music festivals, multi-scene storytelling, complex organic avatars & stadium climaxes',
      resolution: 'High-density 3D volumetric meshes & gradient lighting',
      scale: '260m – 360m stadium-scale formations',
      area: '320m × 220m flight corridor'
    },
    1000: {
      title: 'Monumental Mega-Swarm Spectacles',
      sightline: '5.0+ km (Visible city-wide)',
      bestFor: 'National holidays, stadium opening ceremonies, city celebrations & pyrodrone hybrid shows',
      resolution: 'Hyper-dense 3D sculptures, photo-real contours & massive dynamic scenes',
      scale: '420m+ metropolitan landmarks',
      area: '500m × 350m flight corridor'
    }
  };

  const currentSpec = specDetails[droneCount] || specDetails[500];

  const handleSelectCount = (count: number) => {
    setDroneCount(count);
    soundEngine.playChime(480 + (count / 1000) * 300, 'sine', 0.12);
  };

  const handleSelectType = (type: 'logo' | 'nature' | 'digits') => {
    setImageType(type);
    soundEngine.playChime(640, 'triangle', 0.14);
  };

  const handleOpenBooking = () => {
    setIsModalOpen(true);
    soundEngine.playChime(700, 'sine', 0.15);
  };

  const handleOpenReel = () => {
    setIsReelOpen(true);
    soundEngine.playChime(600, 'sine', 0.15);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    soundEngine.playChime(880, 'sine', 0.25);
    setTimeout(() => {
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setFormData({ name: '', email: '', location: '', date: '', message: '' });
      }, 1500);
    }, 1000);
  };



  return (
    <div className="ds-page">
      {/* Background ambient lighting */}
      <div className="ds-ambient-glow-1" />
      <div className="ds-ambient-glow-2" />

      {/* ========================================================================= */}
      {/* FULL-WIDTH HERO HEADER (Faithful to Drone Show Japan reference with 3D Swarm Wave) */}
      {/* ========================================================================= */}
      <section className="ds-header-hero">
        {/* 3D Undulating Drone Swarm Particle Wave Canvas */}
        <DroneWaveHeaderCanvas />

        {/* Ambient Top & Bottom Scrims for flawless readability and seamless blending */}
        <div className="ds-header-scrim-top" />
        <div className="ds-header-scrim-bottom" />

        {/* Main Left-Aligned Header Typography & Actions */}
        <div className="ds-header-container">
          <div className="ds-header-content">
            <h1 className="ds-header-title">
              Drone Shows,<br />
              Matrix.
            </h1>

            <p className="ds-header-subtitle">
              Autonomous aerial light choreography and synchronized swarm formations for global stadiums, brand reveals, and world celebrations. Powered by 18,000+ airframes with RTK centimeter precision.
            </p>

            <div className="ds-header-actions">
              <button onClick={handleOpenBooking} className="ds-btn-primary">
                <span>REQUEST A PROPOSAL</span>
                <ArrowUpRight size={16} />
              </button>
              <a href="#estimator" className="ds-btn-secondary">
                <span>ESTIMATE DRONES ↓</span>
              </a>
              <button onClick={handleOpenReel} className="ds-btn-secondary">
                <Play size={14} fill="#ffffff" />
                <span>WATCH REEL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Breadcrumb matching reference (HOME>DRONE SHOW JAPAN, INC.) */}
        <div className="ds-header-bottom-strip">
          <div className="ds-header-breadcrumb">
            HOME &gt; DRONE SHOWS, MATRIX
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REST OF PAGE CONTENT (Inside Standard Centered Content Container)        */}
      {/* ========================================================================= */}
      {/* Client Credibility & Brand Trust Strip (Lumasky & DroneShow standard) */}
      <div className="ds-container">
        <div className="ds-trust-strip">
          <div className="ds-trust-label">
            FLOWN FOR WORLD EVENTS & GLOBAL BRANDS
          </div>
          <div className="ds-trust-logos">
            {['FORMULA 1', 'FIFA WORLD CUP', 'SAMSUNG GALAXY', 'RED BULL', 'TOMORROWLAND', 'PARAMOUNT+', 'DUBAI TOURISM', 'UEFA'].map((brand, i) => (
              <span key={i} className="ds-trust-item">
                <span className="ds-trust-dot" />
                <span>{brand}</span>
              </span>
            ))}
          </div>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* REST OF PAGE CONTENT (Inside Standard Centered Content Container)        */}
      {/* ========================================================================= */}
      <div className="ds-container">
        {/* ========================================================================= */}
        {/* INTERACTIVE ESTIMATOR ("How many drones do you need")                    */}
        {/* Faithfully recreated from Cyberdrone UI reference in Matrix theme        */}
        {/* ========================================================================= */}
        <section id="estimator" className="ds-estimator-section">
          <div className="ds-estimator-box">
            
            <div className="ds-estimator-grid">
              
              {/* Left Column: Estimator Controls */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#ffffff' }}>
                    INTERACTIVE SWARM SIMULATOR
                  </span>
                </div>

                <h2 className="ds-estimator-heading">
                  How many drones <br />
                  do you need
                </h2>

                {/* IMAGE selector tabs */}
                <div className="ds-control-group">
                  <div className="ds-control-label">IMAGE</div>
                  <div className="ds-image-tabs">
                    {(['logo', 'nature', 'digits'] as const).map((type) => {
                      const isActive = imageType === type;
                      const label = type === 'logo' ? 'Logo' : type === 'nature' ? 'Nature' : 'Digits';
                      return (
                        <button
                          key={type}
                          onClick={() => handleSelectType(type)}
                          className={`ds-image-tab-btn ${isActive ? 'active' : ''}`}
                        >
                          <span>{label}</span>
                          <span className="ds-tab-indicator" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DRONE NUMBER selector */}
                <div className="ds-control-group">
                  <div className="ds-control-label">DRONE NUMBER</div>

                  <div className="ds-count-box">
                    <div className="ds-count-numbers">
                      {droneCounts.map((count) => {
                        const isActive = droneCount === count;
                        return (
                          <button
                            key={count}
                            onClick={() => handleSelectCount(count)}
                            className={`ds-count-btn ${isActive ? 'active' : ''}`}
                          >
                            {count}
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive visual progress track */}
                    <div className="ds-slider-track">
                      <div 
                        className="ds-slider-fill"
                        style={{
                          width: `${
                            droneCount === 100 ? 15 :
                            droneCount === 300 ? 45 :
                            droneCount === 500 ? 75 : 100
                          }%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic specs summary */}
                <div className="ds-spec-pill">
                  <div className="ds-spec-pill-header">
                    <span>{currentSpec.title}</span>
                    <span className="ds-spec-pill-header-count">{droneCount} UNITS</span>
                  </div>
                  <p className="ds-spec-pill-desc">
                    {currentSpec.bestFor}
                  </p>
                  <div className="ds-spec-pill-footer">
                    <span>Sightline: <strong>{currentSpec.sightline}</strong></span>
                    <span>Corridor: <strong>{currentSpec.area}</strong></span>
                  </div>
                </div>

                {/* BOOK NOW Button matching reference screenshot */}
                <div>
                  <button
                    onClick={handleOpenBooking}
                    className="ds-book-now-btn"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive 3D Drone Canvas */}
              <div>
                <div className="ds-canvas-container">
                  <DroneEstimatorCanvas 
                    imageType={imageType}
                    droneCount={droneCount}
                  />

                  {/* Flight Telemetry HUD Overlay in top corner */}
                  <div style={{ position: 'absolute', top: '14px', right: '14px', pointerEvents: 'none', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#9ea2b0', display: 'flex', gap: '12px' }}>
                    <span>ALT: <strong style={{ color: '#fff' }}>180M</strong></span>
                    <span>WIND: <strong style={{ color: '#fff' }}>12 KT</strong></span>
                    <span>MESH: <strong style={{ color: '#fff' }}>2.4/5.8G</strong></span>
                    <span>GPS: <strong style={{ color: '#ffffff' }}>RTK 3D</strong></span>
                  </div>

                  {/* HUD Overlay in bottom corner */}
                  <div className="ds-canvas-hud">
                    <div className="ds-canvas-hud-live">
                      <span className="ds-canvas-live-dot" />
                      <span>FORMATION: {imageType.toUpperCase()} ({droneCount} LED POINTS)</span>
                    </div>
                    <span style={{ color: '#71717a' }}>CLICK & DRAG TO ORBIT 3D</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY DRONE SHOWS VS FIREWORKS (The Ultimate Value Proposition)             */}
        {/* ========================================================================= */}
        <section className="ds-vs-section">
          <div className="ds-vs-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="ds-section-tag">THE SUSTAINABLE REVOLUTION</div>
              <h2 className="ds-section-title">Why Drone Shows Outperform Fireworks</h2>
              <p style={{ color: '#9ea2b0', fontSize: '0.9rem', maxWidth: '640px', marginTop: '4px' }}>
                Modern audiences and city planners demand sustainable, zero-emission entertainment that creates viral brand impact without wildfire risk.
              </p>
            </div>

            <div className="ds-vs-grid">
              {[
                {
                  icon: <Shield size={20} />,
                  title: 'Zero Fire Hazard & Smog',
                  droneText: '100% electric, zero chemical fallout, zero toxic sulfur smoke, safe for nature reserves.',
                  vsText: 'VS FIREWORKS: Heavy toxic smoke, particulate pollution & severe summer fire bans.'
                },
                {
                  icon: <QrCode size={20} />,
                  title: 'Scannable Brand Art',
                  droneText: 'Floating 300-meter logos, 3D animated characters, and live scannable QR codes in the sky.',
                  vsText: 'VS FIREWORKS: Unpredictable abstract sparks with zero branded legibility.'
                },
                {
                  icon: <Wind size={20} />,
                  title: 'Whisper-Quiet Displays',
                  droneText: 'Silent flight allows synchronized orchestral audio, live vocals, and zero pet distress.',
                  vsText: 'VS FIREWORKS: 150dB explosions causing trauma to pets, wildlife, and veterans.'
                },
                {
                  icon: <Flame size={20} />,
                  title: 'Pyrodrones™ Hybrid',
                  droneText: 'Need pyrotechnic climax? Our cold-spark pyrodrones fire zero-fallout golden cascades.',
                  vsText: 'VS FIREWORKS: Explosive shrapnel requiring massive 400m fallout safety buffers.'
                }
              ].map((item, idx) => (
                <div key={idx} className="ds-vs-item">
                  <div>
                    <div className="ds-vs-item-icon">{item.icon}</div>
                    <h4 className="ds-vs-item-title">{item.title}</h4>
                    <p className="ds-vs-item-drone">{item.droneText}</p>
                  </div>
                  <div className="ds-vs-item-vs">{item.vsText}</div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* ========================================================================= */}
        {/* AVIATION SAFETY & FLIGHT OPERATIONS (Enterprise Credibility)              */}
        {/* ========================================================================= */}
        <section id="safety" className="ds-safety-section">
          <div className="ds-safety-box">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="ds-section-tag">MISSION-CRITICAL OPERATIONS</div>
              <h2 className="ds-section-title">Aviation-Grade Flight Safety</h2>
              <p style={{ color: '#9ea2b0', fontSize: '0.9rem', maxWidth: '640px', marginTop: '4px' }}>
                Every Matrix flight is managed by licensed commercial flight directors with triple-redundant telemetry and automated fail-safe geofencing.
              </p>
            </div>

            <div className="ds-safety-grid">
              {[
                {
                  num: '01 // GEOFENCE',
                  title: 'Dual Virtual Geofence',
                  desc: 'Hard-coded electronic containment borders. Any airframe breaching boundary auto-aborts within 0.1s.'
                },
                {
                  num: '02 // RETURN TO LAUNCH',
                  title: 'Triple-Redundant RTL',
                  desc: 'Independent battery telemetry, RF signal loss, and motor health sensors trigger automated safe landing.'
                },
                {
                  num: '03 // TELEMETRY LINK',
                  title: 'Encrypted Dual-Band Mesh',
                  desc: 'Military-grade 2.4GHz and 5.8GHz dual-frequency mesh radios resist electronic interference and jamming.'
                },
                {
                  num: '04 // AIRSPACE PERMITS',
                  title: 'Global Civil Clearances',
                  desc: 'Pre-approved operational waivers with FAA Part 107.35, EASA SORA, UK CAA, and UAE GCAA.'
                }
              ].map((p, idx) => (
                <div key={idx} className="ds-safety-pillar">
                  <div className="ds-safety-pillar-num">{p.num}</div>
                  <h4 className="ds-safety-pillar-title">{p.title}</h4>
                  <p className="ds-safety-pillar-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LAUNCHPAD & OPERATIONAL REQUIREMENTS MATRIX                               */}
        {/* (Directly addressing client venue feasibility like Lumasky & DroneShow)   */}
        {/* ========================================================================= */}
        <section className="ds-specs-table-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="ds-section-tag">LOGISTICAL FEASIBILITY</div>
            <h2 className="ds-section-title">Launch Site & Ground Footprint Matrix</h2>
            <p style={{ color: '#9ea2b0', fontSize: '0.9rem', maxWidth: '680px', marginTop: '4px' }}>
              Every drone show requires a certified sterile launch grid with restricted spectator access. Use this matrix to evaluate venue feasibility.
            </p>
          </div>

          <div className="ds-table-wrap">
            <table className="ds-specs-table">
              <thead>
                <tr>
                  <th>FLEET SCALE</th>
                  <th>STERILE LAUNCH GRID</th>
                  <th>FLIGHT ALTITUDE</th>
                  <th>SIGHTLINE RADIUS</th>
                  <th>FORMATION WIDTH</th>
                  <th>MINIMUM LEAD TIME</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>100 Drones</strong></td>
                  <td>25m × 20m (Flat Turf/Pavement)</td>
                  <td>60m – 120m AGL</td>
                  <td>1.5 – 2.0 km</td>
                  <td>80m – 120m</td>
                  <td>2 – 3 Weeks</td>
                </tr>
                <tr>
                  <td><strong>300 Drones</strong></td>
                  <td>45m × 35m (Stadium Field/Pier)</td>
                  <td>90m – 180m AGL</td>
                  <td>2.5 – 3.5 km</td>
                  <td>160m – 240m</td>
                  <td>3 – 4 Weeks</td>
                </tr>
                <tr>
                  <td><strong>500 Drones</strong></td>
                  <td>65m × 50m (Dedicated Arena/Barge)</td>
                  <td>120m – 250m AGL</td>
                  <td>3.5 – 5.0 km</td>
                  <td>260m – 360m</td>
                  <td>3 – 4 Weeks</td>
                </tr>
                <tr>
                  <td><strong>1,000+ Drones</strong></td>
                  <td>90m × 70m (Waterfront/Parkland)</td>
                  <td>150m – 350m AGL</td>
                  <td>5.0+ km (Metropolitan)</td>
                  <td>420m+ Dynamic 3D</td>
                  <td>4 – 6 Weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAST 4-STEP PRODUCTION PIPELINE (Clean horizontal HUD)                   */}
        {/* ========================================================================= */}
        <section className="ds-timeline-box">
          <div className="ds-section-tag">DEPLOYMENT TIMELINE</div>
          <h2 style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            From Concept to Showtime in 4 Weeks
          </h2>

          <div className="ds-timeline-grid">
            {[
              {
                step: '01',
                name: '3D Storyboard & Previz',
                desc: 'CAD choreography & 3D digital-twin simulation rendered at 60 FPS for client sign-off.'
              },
              {
                step: '02',
                name: 'Aviation Clearances',
                desc: 'FAA Part 107, EASA, and CAA airspace authorization and NOTAM emergency flight waivers.'
              },
              {
                step: '03',
                name: 'On-Site RTK Calibration',
                desc: 'Survey-grade dual GNSS base stations established on site with full radio frequency mapping.'
              },
              {
                step: '04',
                name: 'Synchronized Showtime',
                desc: 'Autonomous multi-swarm launch synchronized to timecode audio and live TV broadcast.'
              }
            ].map((item, idx) => (
              <div key={idx} className="ds-timeline-step">
                <div className="ds-step-num">PHASE {item.step}</div>
                <h4 className="ds-step-name">{item.name}</h4>
                <p className="ds-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA BANNER                                                         */}
        {/* ========================================================================= */}
        <div className="ds-cta-banner">
          <span className="ds-cta-tag">READY TO ILLUMINATE THE SKY?</span>
          <h2 className="ds-cta-heading">Custom Swarms Engineered for Any Event</h2>
          <p className="ds-cta-text">
            Tell us your date, location, and vision. Our flight directors will deliver a custom 3D simulation and turnkey logistical proposal within 24 hours.
          </p>
          <div className="ds-cta-actions">
            <button onClick={handleOpenBooking} className="ds-btn-primary">
              BOOK A DRONE SHOW ({droneCount} DRONES)
            </button>
            <a href="#estimator" className="ds-btn-secondary">
              RE-CALCULATE DRONES ↑
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* HOMEPAGE MATCHING FOOTER WITH 3D PARTICLE HANDSHAKE ENGINE                */}
      {/* (ONLY ONE FOOTER ON THE PAGE)                                             */}
      {/* ========================================================================= */}
      <footer 
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(740px, 92vh, 940px)',
          minHeight: '700px',
          background: '#000000',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginTop: '60px'
        }}
      >
        {/* Real-Time WebGL 3D Particle Swarm Forming Handshake Figures & Dunes */}
        <HandshakeParticleCanvas />

        {/* Top Edge Dissolve Fade */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(180deg, #070709 0%, rgba(7, 7, 9, 0.7) 40%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 4
          }}
        />

        {/* Footer HUD Overlay Layer (Identical to Homepage) */}
        <FooterPinnedHud />
      </footer>

      {/* ========================================================================= */}
      {/* QUICK INQUIRY MODAL                                                       */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="ds-modal-backdrop">
          <div className="ds-modal-card">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="ds-modal-close"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ padding: '36px 0', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  Proposal Request Received
                </h3>
                <p style={{ color: '#9ea2b0', fontSize: '0.88rem', maxWidth: '320px', margin: '0 auto' }}>
                  Our flight operations team will review your {droneCount}-drone configuration and respond within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '0.65rem', letterSpacing: '0.14em', color: '#ffffff', marginBottom: '6px' }}>
                  MATRIX AERIAL OPERATIONS // RESERVATION
                </div>
                <h3 style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Book Drone Show
                </h3>
                <p style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '0.75rem', color: '#8b8f9e', marginBottom: '24px' }}>
                  Configured: <strong style={{ color: '#ffffff' }}>{droneCount} Drones</strong> ({imageType.toUpperCase()} Formation)
                </p>

                <form onSubmit={handleSubmitBooking}>
                  <div className="ds-form-field">
                    <label className="ds-form-label">Your Name / Organization</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alex Rivera, Red Bull Events"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="ds-form-input"
                    />
                  </div>

                  <div className="ds-form-field">
                    <label className="ds-form-label">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="ds-form-input"
                    />
                  </div>

                  <div className="ds-form-row">
                    <div className="ds-form-field">
                      <label className="ds-form-label">Event City / Country</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dubai, UAE"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="ds-form-input"
                      />
                    </div>
                    <div className="ds-form-field">
                      <label className="ds-form-label">Target Date</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="ds-form-input"
                      />
                    </div>
                  </div>

                  <div className="ds-form-field">
                    <label className="ds-form-label">Event Details / Special Requirements</label>
                    <textarea 
                      rows={3}
                      placeholder="Stadium festival opening, brand reveal, cold pyro desired, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="ds-form-input"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div style={{ paddingTop: '8px' }}>
                    <button type="submit" className="ds-modal-submit-btn">
                      SUBMIT REQUEST ({droneCount} DRONES)
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHOW REEL LIGHTBOX MODAL                                                  */}
      {/* ========================================================================= */}
      {isReelOpen && (
        <div className="ds-reel-backdrop">
          <div className="ds-reel-modal">
            <div className="ds-reel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
                <span>MATRIX FLIGHT OPERATIONS // 2026 WORLD SHOWCASE REEL</span>
              </div>
              <button 
                onClick={() => setIsReelOpen(false)}
                style={{ color: '#8b8f9e', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ds-reel-body">
              <img 
                src="/images/stadium-drone-show.jpg" 
                alt="Matrix Drone Show Stadium Reel"
              />
              <div className="ds-reel-overlay">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ffffff', letterSpacing: '0.14em', marginBottom: '4px' }}>
                  LIVE ARENA SYNCHRONY
                </span>
                <h3 style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  World-Record Autonomous Swarms
                </h3>
                <p style={{ color: '#d1d5db', fontSize: '0.88rem', maxWidth: '580px', lineHeight: 1.5, marginBottom: '16px' }}>
                  Deploying up to 5,000 synchronized airframes with RTK centimeter precision, live timecode orchestral audio sync, and certified zero-fallout Pyrodrones™.
                </p>
                <div>
                  <button
                    onClick={() => {
                      setIsReelOpen(false);
                      handleOpenBooking();
                    }}
                    className="ds-btn-primary"
                    style={{ padding: '10px 24px', fontSize: '0.76rem' }}
                  >
                    BOOK THIS SHOW FORMAT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
