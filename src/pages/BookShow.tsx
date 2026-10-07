import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlanShowParticleCanvas 
} from '../components/ui/PlanShowParticleCanvas';
import { soundEngine } from '../utils/audioSynth';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  Upload, 
  FileText, 
  Trash2, 
  Volume2, 
  VolumeX, 
  X, 
  HelpCircle,
  Copy,
  Layers,
  Sparkles,
  Compass,
  Cpu,
  Radio,
  Sliders,
  Calendar,
  MapPin,
  Building,
  Target
} from 'lucide-react';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
}

const EVENT_TYPES = [
  'Corporate Event',
  'Concert / Festival',
  'Wedding',
  'Brand Activation',
  'Product Launch',
  'Government / Public Event',
  'Sports Event',
  'Cultural / Arts Event',
  'Private Celebration',
  'Other'
];

const STEP_SHAPE_NAMES: Record<number, { title: string; desc: string }> = {
  1: { title: 'AMPHITHEATER_TERRAIN_GRID', desc: 'Undulating Matrix landscape with concentric horizon waves' },
  2: { title: '3D_GEOGRAPHIC_GLOBE_RINGS', desc: 'Rotating wireframe sphere with latitude-longitude coordinate rings' },
  3: { title: 'AUTONOMOUS_CHEVRON_SWARM', desc: 'Synchronized dual-flight drone squadron in aerodynamic V-formation' },
  4: { title: 'INFINITY_MOBIUS_CHOREOGRAPHY', desc: 'Continuous 3D ribbon loop tracing volumetric flight paths' },
  5: { title: 'TIERED_ARENA_SPECTACLE_BOWL', desc: 'Concentric stadium amphitheater tiers expanding outward' },
  6: { title: 'GOLDEN_RATIO_LOGARITHMIC_SPIRAL', desc: 'Precision mathematical helix mapping investment and duration' },
  7: { title: 'TRANSMISSION_VECTOR_BEAM', desc: 'Vertical telemetry beacon flanked by dual parabolic signal arcs' },
  8: { title: 'DATA_VAULT_CUBE_ARCHITECTURE', desc: 'Floating 3D structural lattice anchoring project collateral' },
  9: { title: 'VOLUMETRIC_MATRIX_EMBLEM_SPHERE', desc: 'Fully converged geometric sphere ready for flight deployment' },
  10: { title: 'SUPERNOVA_TRANSMISSION_BURST', desc: 'High-energy celebratory constellation expansion' }
};

const COMING_SOON_AERIAL = [
  {
    name: 'Daytime Aerial Show',
    desc: 'High-visibility smoke trails and daytime pyrotechnic aerial maneuvers.'
  },
  {
    name: 'Indoor Drone Show',
    desc: 'Ultra-confined indoor cage swarming without GPS reliance.'
  },
  {
    name: 'Autonomous Aerial Installations',
    desc: 'Perpetual sky architecture and long-endurance autonomous light nodes.'
  }
];

const COMING_SOON_IMMERSIVE = [
  {
    name: 'Projection Mapping',
    desc: 'Volumetric architectural light transformations across megastructures.'
  },
  {
    name: 'Interactive LED Installations',
    desc: 'Kinetic responsive walls and sensor-driven responsive light corridors.'
  },
  {
    name: 'Laser & Light Experiences',
    desc: 'Atmospheric beam geometries synchronized with spatial frequencies.'
  },
  {
    name: 'Holographic Displays',
    desc: 'Mid-air 3D volumetric light illusions and free-floating visuals.'
  },
  {
    name: 'Immersive 360° Experiences',
    desc: 'Fully enveloped dome and arena environments fusing sound and light.'
  },
  {
    name: 'Water + Light Experiences',
    desc: 'Hydro-mist projections and water curtain laser choreography.'
  }
];

const SHOW_FEATURES = [
  'Company / brand logo',
  'Text / messaging',
  '2D graphics',
  '3D objects',
  'Animated sequences',
  'Custom artistic choreography',
  'Music synchronization',
  'Something else'
];

const AUDIENCE_SIZES = [
  'Under 500',
  '500 – 1,000',
  '1,000 – 5,000',
  '5,000 – 10,000',
  '10,000+',
  'Not sure'
];

const DURATIONS = [
  'Under 5 minutes',
  '5–10 minutes',
  '10–15 minutes',
  '15+ minutes',
  'Not sure'
];

const BUDGET_OPTIONS = [
  'Under ₦5 million',
  '₦5m – ₦10m',
  '₦10m – ₦20m',
  '₦20m – ₦50m',
  '₦50m+',
  'Not sure yet'
];

const DRONE_PRESETS = [
  { count: '50', label: '50 Drones', desc: 'Intimate private displays, essential typography & crisp vector logos.' },
  { count: '100', label: '100 Drones', desc: 'Standard brand reveals, geometric formations & high-contrast emblems.' },
  { count: '200', label: '200 Drones', desc: 'Large civic & arena scale, dense 3D volumes & animated sequences.' },
  { count: '300+', label: '300+ Drones', desc: 'Mega-spectacle, multi-kilometer sightlines & cinematic storytelling.' },
  { count: 'Not sure', label: 'Not sure — recommend suitable scale', desc: 'Default recommended option: our flight architects calculate optimal density.' }
];

export const BookShow: React.FC = () => {
  const navigate = useNavigate();

  // Current Step (1 through 8, Step 9 is Final Review, Step 10 is Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [showDossierDrawer, setShowDossierDrawer] = useState<boolean>(false);
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeKeyPulse, setActiveKeyPulse] = useState<number | null>(null);

  // Form State
  const [eventType, setEventType] = useState<string>('Corporate Event');
  const [eventTypeOther, setEventTypeOther] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [isDateConfirmed, setIsDateConfirmed] = useState<string>('Tentative');

  // Step 2: Location
  const [country, setCountry] = useState<string>('Nigeria');
  const [city, setCity] = useState<string>('Abuja');
  const [venue, setVenue] = useState<string>('');
  const [isVenueConfirmed, setIsVenueConfirmed] = useState<string>('Still deciding');
  const [locationNotes, setLocationNotes] = useState<string>('');

  // Step 3: Experience & Scale
  const [droneCount, setDroneCount] = useState<string>('Not sure');

  // Step 4: Vision
  const [vision, setVision] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Company / brand logo',
    '3D objects',
    'Animated sequences'
  ]);
  const [featureOther, setFeatureOther] = useState<string>('');

  // Step 5: Audience & Scale
  const [audienceSize, setAudienceSize] = useState<string>('1,000 – 5,000');
  const [duration, setDuration] = useState<string>('10–15 minutes');
  const [isLargerProduction, setIsLargerProduction] = useState<string>('No');
  const [productionCollaborators, setProductionCollaborators] = useState<string>('');

  // Step 6: Budget
  const [budget, setBudget] = useState<string>('₦10m – ₦20m');

  // Step 7: Contact Details
  const [fullName, setFullName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<string>('Email');
  const [socialLink, setSocialLink] = useState<string>('');

  // Step 8: Anything Else & Files
  const [anythingElse, setAnythingElse] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Validation feedback
  const [validationError, setValidationError] = useState<string | null>(null);

  // Audio mute toggle
  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard Navigation (Kahoot style shortcuts!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'Escape') {
        if (infoModalContent) {
          setInfoModalContent(null);
          return;
        }
        if (showDossierDrawer) {
          setShowDossierDrawer(false);
          return;
        }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNextStep();
        }
        return;
      }

      if (!isInput) {
        // Quick number selection for cards 1 to 9
        const num = parseInt(e.key, 10);
        if (!isNaN(num)) {
          setActiveKeyPulse(num);
          setTimeout(() => setActiveKeyPulse(null), 300);

          if (currentStep === 1 && num >= 1 && num <= EVENT_TYPES.length) {
            e.preventDefault();
            const choice = EVENT_TYPES[num - 1];
            setEventType(choice);
            soundEngine.playBlip(440 + num * 40);
          } else if (currentStep === 3) {
            if (num >= 1 && num <= DRONE_PRESETS.length) {
              e.preventDefault();
              setDroneCount(DRONE_PRESETS[num - 1].count);
              soundEngine.playBlip(500 + num * 50);
            }
          } else if (currentStep === 5) {
            if (num >= 1 && num <= AUDIENCE_SIZES.length) {
              e.preventDefault();
              setAudienceSize(AUDIENCE_SIZES[num - 1]);
              soundEngine.playBlip(480 + num * 45);
            }
          } else if (currentStep === 6) {
            if (num >= 1 && num <= BUDGET_OPTIONS.length) {
              e.preventDefault();
              setBudget(BUDGET_OPTIONS[num - 1]);
              soundEngine.playBlip(520 + num * 40);
            }
          }
        }

        if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          if (currentStep > 1 && currentStep <= 9) {
            e.preventDefault();
            handlePrevStep();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, eventType, droneCount, audienceSize, budget, infoModalContent, showDossierDrawer, fullName, email, phone]);

  // Step advancement validation
  const handleNextStep = () => {
    setValidationError(null);

    // Validate Step 7 required fields
    if (currentStep === 7) {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name');
        soundEngine.playBlip(320);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setValidationError('Please enter a valid email address');
        soundEngine.playBlip(320);
        return;
      }
      if (!phone.trim()) {
        setValidationError('Please enter a phone or WhatsApp contact number');
        soundEngine.playBlip(320);
        return;
      }
    }

    if (currentStep < 9) {
      setTransitionDirection('forward');
      soundEngine.playMorphSound();
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 9) {
      setTransitionDirection('forward');
      soundEngine.playUplinkSuccess();
      setCurrentStep(10);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setTransitionDirection('backward');
      soundEngine.playTick();
      setCurrentStep(prev => prev - 1);
      setValidationError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jumpToStep = (stepNum: number) => {
    setTransitionDirection(stepNum > currentStep ? 'forward' : 'backward');
    soundEngine.playBlip(540);
    setCurrentStep(stepNum);
    setShowDossierDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle show features
  const toggleFeature = (feat: string) => {
    soundEngine.playTick();
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  // Simulated file handling
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    soundEngine.playBlip(620);
    const mapped: AttachedFile[] = newFiles.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 100
    }));
    setAttachedFiles(prev => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    soundEngine.playTick();
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Generated Transmission Reference
  const transmissionRef = useRef(`MTX-PLAN-${Math.floor(100000 + Math.random() * 900000)}`).current;

  // Percentage completion
  const progressPercent = Math.min(100, Math.round((currentStep / 9) * 100));

  const currentShapeMeta = STEP_SHAPE_NAMES[currentStep] || STEP_SHAPE_NAMES[1];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: '#000000',
        color: '#ffffff',
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Fullscreen Precision 3D Particle Canvas with Step-Driven Morphing Shapes */}
      <PlanShowParticleCanvas 
        currentStep={currentStep} 
        isCompleted={currentStep === 10} 
      />

      {/* 2. Top Immersive Telemetry Header Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(0, 0, 0, 0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Left: Matrix Branding & Plan Your Show Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link 
            to="/"
            onClick={() => soundEngine.playTick()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none',
              color: '#ffffff'
            }}
          >
            <img 
              src="/matrix-logo-white.png" 
              alt="Matrix" 
              style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
            />
            <span 
              style={{ 
                fontFamily: 'var(--font-mono, monospace)', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                letterSpacing: '0.24em',
                textTransform: 'uppercase'
              }}
            >
              MATRIX
            </span>
          </Link>

          <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.85rem' }}>/</span>

          <span 
            style={{ 
              fontFamily: 'var(--font-mono, monospace)', 
              fontSize: '0.70rem', 
              letterSpacing: '0.14em', 
              color: 'rgba(255, 255, 255, 0.85)',
              textTransform: 'uppercase'
            }}
          >
            PLAN YOUR SHOW
          </span>
        </div>

        {/* Center: Stepped Segmented Breadcrumb (Desktop) with Micro-Interactions */}
        {currentStep <= 9 && (
          <div 
            style={{ 
              display: 'none', 
              alignItems: 'center', 
              gap: '6px'
            }}
            className="md-flex"
          >
            {[
              { num: 1, label: 'EVENT' },
              { num: 2, label: 'LOCATION' },
              { num: 3, label: 'EXPERIENCE' },
              { num: 4, label: 'VISION' },
              { num: 5, label: 'SCALE' },
              { num: 6, label: 'BUDGET' },
              { num: 7, label: 'CONTACT' },
              { num: 8, label: 'FILES' },
              { num: 9, label: 'REVIEW' }
            ].map(s => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => jumpToStep(s.num)}
                  style={{
                    background: isActive ? '#ffffff' : isPast ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: isActive ? '#000000' : isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.10)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transform: isActive ? 'scale(1.05)' : 'none',
                    boxShadow: isActive ? '0 0 16px rgba(255, 255, 255, 0.35)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                      e.currentTarget.style.color = isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                >
                  <span style={{ fontWeight: isActive ? 700 : 500 }}>{s.num < 10 ? `0${s.num}` : s.num}</span>
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Tools: Progress Gauge, Dossier Drawer, Sound Toggle & Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentStep <= 9 && (
            <div 
              style={{ 
                fontFamily: 'var(--font-mono, monospace)', 
                fontSize: '0.68rem', 
                color: 'rgba(255, 255, 255, 0.75)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px'
              }}
            >
              <span>{currentStep <= 8 ? `STEP 0${currentStep}/08` : 'FINAL REVIEW'}</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>{progressPercent}%</span>
            </div>
          )}

          {/* Dossier Summary Drawer Toggle */}
          <button
            onClick={() => {
              soundEngine.playTick();
              setShowDossierDrawer(!showDossierDrawer);
            }}
            title="Inspect project summary brief"
            style={{
              background: showDossierDrawer ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
              color: showDossierDrawer ? '#000000' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={13} />
            <span style={{ display: 'none' }} className="sm-inline">BRIEF DOSSIER</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: isMuted ? 'rgba(255, 255, 255, 0.45)' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Exit / Return Link */}
          <button
            onClick={() => {
              soundEngine.playTick();
              navigate('/');
            }}
            title="Exit to home"
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* 3. Sleek Telemetry Sub-Bar (Displays active particle formation shape in real time!) */}
      {currentStep <= 9 && (
        <div 
          style={{
            position: 'relative',
            zIndex: 35,
            padding: '6px 24px',
            background: 'rgba(0, 0, 0, 0.45)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.62rem',
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.12em'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #ffffff', display: 'inline-block' }} />
            <span>SWARM FORMATION:</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{currentShapeMeta.title}</span>
          </div>

          <div style={{ display: 'none' }} className="sm-inline">
            <span>{currentShapeMeta.desc}</span>
          </div>
        </div>
      )}

      {/* 4. Main Form Stage Area (High-Contrast Solid Frosted Glass Barrier for 100% Text Legibility) */}
      <main 
        style={{ 
          flex: 1, 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: currentStep === 10 ? 'center' : 'flex-start',
          padding: '24px 16px 120px 16px',
          width: '100%',
          maxWidth: '920px',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Solid Frosted Glass Card Stage (Guarantees zero text collision with background particles) */}
        <div
          key={`step-stage-${currentStep}`}
          className={transitionDirection === 'forward' ? 'step-transition-forward' : 'step-transition-backward'}
          style={{
            width: '100%',
            background: 'rgba(8, 9, 13, 0.94)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          {/* Validation Alert */}
          {validationError && (
            <div 
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid #ffffff',
                borderRadius: '8px',
                padding: '12px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.80rem',
                boxShadow: '0 0 24px rgba(255, 255, 255, 0.2)'
              }}
            >
              <HelpCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* =========================================================================
              STEP 1 — TELL US ABOUT YOUR EVENT
              ========================================================================= */}
          {currentStep === 1 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 01 // EVENT PROFILE
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                What are you planning?
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '28px',
                  lineHeight: 1.55 
                }}
              >
                Select your event category, working title, and projected date.
              </p>

              {/* Event Type Grid (Interactive Kahoot-style cards with keyboard hints & hover lift) */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px'
                }}
              >
                {EVENT_TYPES.map((type, idx) => {
                  const isSelected = eventType === type;
                  const keyNum = idx + 1 <= 9 ? idx + 1 : 0;
                  const isPulsing = activeKeyPulse === keyNum;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setEventType(type);
                        soundEngine.playBlip(480 + idx * 30);
                      }}
                      onMouseEnter={() => soundEngine.playTick()}
                      className="interactive-card-hover"
                      style={{
                        background: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'rgba(20, 22, 30, 0.90)',
                        border: isSelected ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '16px 18px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 0 24px rgba(255, 255, 255, 0.22)' : 'none',
                        transform: isPulsing ? 'scale(1.04)' : (isSelected ? 'translateY(-2px)' : 'none')
                      }}
                    >
                      <div>
                        <div 
                          style={{ 
                            fontSize: '0.90rem', 
                            fontWeight: 600, 
                            color: '#ffffff',
                            marginBottom: '3px' 
                          }}
                        >
                          {type}
                        </div>
                        <span 
                          style={{ 
                            fontFamily: 'var(--font-mono, monospace)', 
                            fontSize: '0.60rem', 
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.40)',
                            letterSpacing: '0.08em'
                          }}
                        >
                          KEY [{keyNum}]
                        </span>
                      </div>

                      <div 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #ffffff' : '1.5px solid rgba(255, 255, 255, 0.35)',
                          background: isSelected ? '#ffffff' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSelected && <Check size={11} color="#000000" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom input if "Other" is chosen */}
              {eventType === 'Other' && (
                <div style={{ marginBottom: '28px' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    SPECIFY EVENT TYPE
                  </label>
                  <input 
                    type="text"
                    value={eventTypeOther}
                    onChange={e => setEventTypeOther(e.target.value)}
                    placeholder="e.g. VIP Yacht Launch, Summit Opening Ceremony..."
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Event Name & Date Section */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  marginBottom: '28px'
                }}
              >
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    EVENT NAME
                  </label>
                  <input 
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="e.g. Abuja International Festival"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    EVENT DATE
                  </label>
                  <input 
                    type="text"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    placeholder="DD / MM / YYYY or Season (e.g. Dec 2026)"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Is the Date Confirmed? */}
              <div>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  IS THE DATE CONFIRMED?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Confirmed', 'Tentative', 'Still planning'].map(opt => {
                    const isSel = isDateConfirmed === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsDateConfirmed(opt);
                          soundEngine.playBlip(540);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-pill-btn"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.16)',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSel ? '0 0 16px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2 — WHERE IS IT HAPPENING?
              ========================================================================= */}
          {currentStep === 2 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 02 // AIRSPACE & LOCATION
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Where is it happening?
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '32px',
                  lineHeight: 1.55 
                }}
              >
                Matrix operates worldwide. Provide your country, city, and expected venue geometry.
              </p>

              {/* Country and City Dropdowns */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px'
                }}
              >
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    COUNTRY
                  </label>
                  <select
                    value={country}
                    onChange={e => {
                      setCountry(e.target.value);
                      soundEngine.playTick();
                    }}
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: '#0d0e14',
                      border: '1px solid rgba(255, 255, 255, 0.22)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Nigeria">Nigeria ▼</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Other">Other Global Region</option>
                  </select>
                </div>

                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    CITY
                  </label>
                  <select
                    value={city}
                    onChange={e => {
                      setCity(e.target.value);
                      soundEngine.playTick();
                    }}
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: '#0d0e14',
                      border: '1px solid rgba(255, 255, 255, 0.22)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Abuja">Abuja ▼</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Dubai">Dubai</option>
                    <option value="London">London</option>
                    <option value="Accra">Accra</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Johannesburg">Johannesburg</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              </div>

              {/* Venue / Location */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '8px',
                    letterSpacing: '0.1em'
                  }}
                >
                  VENUE / SPECIFIC LOCATION
                </label>
                <input 
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="e.g. Moshood Abiola National Stadium, Eko Atlantic, or Private Estate"
                  className="interactive-input"
                  style={{
                    width: '100%',
                    background: 'rgba(20, 22, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Venue Confirmed */}
              <div style={{ marginBottom: '28px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  DO YOU ALREADY HAVE THE VENUE CONFIRMED?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Yes', 'No', 'Still deciding'].map(opt => {
                    const isSel = isVenueConfirmed === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsVenueConfirmed(opt);
                          soundEngine.playBlip(560);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-pill-btn"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.16)',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSel ? '0 0 16px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Location Notes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label 
                    style={{ 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      letterSpacing: '0.1em'
                    }}
                  >
                    TELL US ANYTHING IMPORTANT ABOUT THE LOCATION (OPTIONAL)
                  </label>
                  <span style={{ fontSize: '0.70rem', color: 'rgba(255, 255, 255, 0.45)' }}>Optional</span>
                </div>
                <textarea 
                  rows={3}
                  value={locationNotes}
                  onChange={e => setLocationNotes(e.target.value)}
                  placeholder="Nearby buildings, airport restrictions, open field, waterfront, stadium roof, high-voltage lines, VIP grandstands..."
                  className="interactive-input"
                  style={{
                    width: '100%',
                    background: 'rgba(20, 22, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '0.90rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3 — WHAT WOULD YOU LIKE TO CREATE?
              ========================================================================= */}
          {currentStep === 3 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 03 // SPECTACLE ARCHITECTURE
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                What would you like to create?
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '32px',
                  lineHeight: 1.55 
                }}
              >
                Explore currently active aerial capabilities and our experimental immersive technologies in development.
              </p>

              {/* Section 1: AERIAL EXPERIENCES */}
              <div style={{ marginBottom: '36px' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '16px'
                  }}
                >
                  <span>AERIAL EXPERIENCES</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
                </div>

                {/* 1.1 ACTIVE SERVICE: Drone Light Show */}
                <div 
                  style={{
                    background: 'rgba(16, 18, 26, 0.95)',
                    border: '1.5px solid #ffffff',
                    borderRadius: '10px',
                    padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 0 32px rgba(255, 255, 255, 0.14)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                        Drone Light Show
                      </h3>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono, monospace)', 
                          fontSize: '0.62rem', 
                          padding: '3px 8px', 
                          background: 'rgba(255, 255, 255, 0.18)', 
                          border: '1px solid #ffffff',
                          borderRadius: '3px',
                          color: '#ffffff',
                          letterSpacing: '0.1em'
                        }}
                      >
                        ● AVAILABLE
                      </span>
                    </div>

                    <span 
                      style={{ 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontSize: '0.65rem', 
                        color: 'rgba(255, 255, 255, 0.65)' 
                      }}
                    >
                      READY FOR PRODUCTION
                    </span>
                  </div>

                  <p 
                    style={{ 
                      fontSize: '0.88rem', 
                      color: 'rgba(255, 255, 255, 0.75)', 
                      marginBottom: '20px',
                      lineHeight: 1.55 
                    }}
                  >
                    Synchronized autonomous drones creating logos, text, 2D/3D formations and animated sequences in the night sky.
                  </p>

                  {/* Sub-Question: Number of Drones */}
                  <div>
                    <div 
                      style={{ 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontSize: '0.68rem', 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        letterSpacing: '0.12em',
                        marginBottom: '12px'
                      }}
                    >
                      NUMBER OF DRONES
                    </div>

                    <div 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                        gap: '10px' 
                      }}
                    >
                      {DRONE_PRESETS.map((p, idx) => {
                        const isSelected = droneCount === p.count;
                        return (
                          <button
                            key={p.count}
                            type="button"
                            onClick={() => {
                              setDroneCount(p.count);
                              soundEngine.playBlip(540 + idx * 40);
                            }}
                            onMouseEnter={() => soundEngine.playTick()}
                            className="interactive-card-hover"
                            style={{
                              background: isSelected ? '#ffffff' : 'rgba(24, 26, 36, 0.95)',
                              color: isSelected ? '#000000' : '#ffffff',
                              border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.14)',
                              borderRadius: '6px',
                              padding: '12px 14px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              boxShadow: isSelected ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                                {p.label}
                              </span>
                              {isSelected && <Check size={12} color="#000000" strokeWidth={3} />}
                            </div>
                            <span 
                              style={{ 
                                fontSize: '0.68rem', 
                                color: isSelected ? 'rgba(0,0,0,0.7)' : 'rgba(255, 255, 255, 0.55)',
                                lineHeight: 1.35
                              }}
                            >
                              {p.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 1.2 COMING SOON AERIAL CARDS (Greyed Out / Muted) */}
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '12px'
                  }}
                >
                  {COMING_SOON_AERIAL.map(srv => (
                    <div
                      key={srv.name}
                      onClick={() => {
                        soundEngine.playTick();
                        setInfoModalContent(srv.name);
                      }}
                      className="interactive-card-hover"
                      style={{
                        background: 'rgba(18, 20, 28, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        opacity: 0.65,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '1.0';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '0.65';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                          {srv.name}
                        </span>
                        <span 
                          style={{ 
                            fontFamily: 'var(--font-mono, monospace)', 
                            fontSize: '0.58rem', 
                            background: 'rgba(255, 255, 255, 0.10)', 
                            padding: '2px 6px', 
                            borderRadius: '3px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          ⚪ COMING SOON
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.45 }}>
                        {srv.desc}
                      </p>
                      <div 
                        style={{ 
                          marginTop: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          fontSize: '0.66rem', 
                          color: 'rgba(255, 255, 255, 0.55)',
                          fontFamily: 'var(--font-mono, monospace)'
                        }}
                      >
                        <Info size={11} />
                        <span>Click to get notified upon release</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: IMMERSIVE EXPERIENCES (All Coming Soon) */}
              <div>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '16px'
                  }}
                >
                  <span>IMMERSIVE EXPERIENCES (IN DEVELOPMENT)</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
                </div>

                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '12px'
                  }}
                >
                  {COMING_SOON_IMMERSIVE.map(srv => (
                    <div
                      key={srv.name}
                      onClick={() => {
                        soundEngine.playTick();
                        setInfoModalContent(srv.name);
                      }}
                      className="interactive-card-hover"
                      style={{
                        background: 'rgba(18, 20, 28, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        opacity: 0.65,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '1.0';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '0.65';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                          {srv.name}
                        </span>
                        <span 
                          style={{ 
                            fontFamily: 'var(--font-mono, monospace)', 
                            fontSize: '0.58rem', 
                            background: 'rgba(255, 255, 255, 0.10)', 
                            padding: '2px 6px', 
                            borderRadius: '3px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          ⚪ COMING SOON
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.45 }}>
                        {srv.desc}
                      </p>
                      <div 
                        style={{ 
                          marginTop: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          fontSize: '0.66rem', 
                          color: 'rgba(255, 255, 255, 0.55)',
                          fontFamily: 'var(--font-mono, monospace)'
                        }}
                      >
                        <Info size={11} />
                        <span>Click to get notified upon release</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4 — TELL US WHAT YOU HAVE IN MIND (VISION & FEATURES)
              ========================================================================= */}
          {currentStep === 4 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 04 // CREATIVE CHOREOGRAPHY
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Tell us what you have in mind
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '28px',
                  lineHeight: 1.55 
                }}
              >
                What would you like the show to feature? This informs our 3D animation pipeline and choreography complexity.
              </p>

              {/* Vision Big Textarea */}
              <div style={{ marginBottom: '32px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  TELL US ABOUT YOUR VISION...
                </label>
                <textarea 
                  rows={5}
                  value={vision}
                  onChange={e => setVision(e.target.value)}
                  placeholder="Describe your narrative, key moments, emotional tone, product reveals, cultural emblems, or special surprises..."
                  className="interactive-input"
                  style={{
                    width: '100%',
                    background: 'rgba(20, 22, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                    color: '#ffffff',
                    fontSize: '0.98rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Show Feature Checkboxes (Multi-select) */}
              <div>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '12px',
                    letterSpacing: '0.1em'
                  }}
                >
                  WOULD YOU LIKE THE SHOW TO INCLUDE:
                </label>

                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '10px',
                    marginBottom: '16px'
                  }}
                >
                  {SHOW_FEATURES.map(feat => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-card-hover"
                        style={{
                          background: isChecked ? 'rgba(255, 255, 255, 0.16)' : 'rgba(20, 22, 30, 0.90)',
                          border: isChecked ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          padding: '14px 16px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          boxShadow: isChecked ? '0 0 16px rgba(255, 255, 255, 0.2)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                          {feat}
                        </span>
                        <div 
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '3px',
                            border: isChecked ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.4)',
                            background: isChecked ? '#ffffff' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isChecked && <Check size={11} color="#000000" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedFeatures.includes('Something else') && (
                  <div style={{ marginTop: '12px' }}>
                    <input 
                      type="text"
                      value={featureOther}
                      onChange={e => setFeatureOther(e.target.value)}
                      placeholder="Specify other required elements (e.g. live singer sync, AR broadcast filter)..."
                      className="interactive-input"
                      style={{
                        width: '100%',
                        background: 'rgba(20, 22, 30, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.20)',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        color: '#ffffff',
                        fontSize: '0.90rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 5 — AUDIENCE & SCALE
              ========================================================================= */}
          {currentStep === 5 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 05 // SIGHTLINE & SCOPE
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Audience &amp; Scale
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '32px',
                  lineHeight: 1.55 
                }}
              >
                Determine spectator volume, flight window duration, and integrated production stakeholders.
              </p>

              {/* Expected Audience Size */}
              <div style={{ marginBottom: '32px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  EXPECTED AUDIENCE SIZE
                </label>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {AUDIENCE_SIZES.map((size, idx) => {
                    const isSel = audienceSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setAudienceSize(size);
                          soundEngine.playBlip(520 + idx * 30);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-card-hover"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.14)',
                          padding: '14px 14px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.80rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          boxShadow: isSel ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show Duration */}
              <div style={{ marginBottom: '32px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  SHOW DURATION
                </label>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {DURATIONS.map((dur, idx) => {
                    const isSel = duration === dur;
                    return (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => {
                          setDuration(dur);
                          soundEngine.playBlip(560 + idx * 30);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-card-hover"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.14)',
                          padding: '14px 14px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.80rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          boxShadow: isSel ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {dur}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part of Larger Production? */}
              <div>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  IS THIS PART OF A LARGER PRODUCTION?
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: isLargerProduction === 'Yes' ? '16px' : '0' }}>
                  {['Yes', 'No'].map(opt => {
                    const isSel = isLargerProduction === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsLargerProduction(opt);
                          soundEngine.playBlip(580);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-pill-btn"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.16)',
                          padding: '10px 24px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSel ? '0 0 16px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isLargerProduction === 'Yes' && (
                  <div>
                    <label 
                      style={{ 
                        display: 'block', 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontSize: '0.70rem', 
                        color: 'rgba(255, 255, 255, 0.85)',
                        marginBottom: '8px',
                        letterSpacing: '0.1em'
                      }}
                    >
                      WHO ELSE IS INVOLVED?
                    </label>
                    <input 
                      type="text"
                      value={productionCollaborators}
                      onChange={e => setProductionCollaborators(e.target.value)}
                      placeholder="Event planner, broadcast production company, agency, stadium management, musical artist..."
                      className="interactive-input"
                      style={{
                        width: '100%',
                        background: 'rgba(20, 22, 30, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.20)',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        color: '#ffffff',
                        fontSize: '0.90rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 6 — BUDGET (OPTIONAL & NON-THREATENING)
              ========================================================================= */}
          {currentStep === 6 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 06 // ESTIMATED INVESTMENT
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Do you have an approximate budget?
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '12px',
                  lineHeight: 1.55 
                }}
              >
                Budget is completely optional. This helps us suggest the best fleet density, choreography scope, and visual impact.
              </p>

              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.70rem',
                  color: 'rgba(255, 255, 255, 0.50)',
                  marginBottom: '32px'
                }}
              >
                NOTE // ALL ESTIMATES INCLUDE FLIGHT AUTHORIZATION, REHEARSALS, &amp; RTK TELEMETRY
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px'
                }}
              >
                {BUDGET_OPTIONS.map((opt, idx) => {
                  const isSel = budget === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setBudget(opt);
                        soundEngine.playBlip(500 + idx * 40);
                      }}
                      onMouseEnter={() => soundEngine.playTick()}
                      className="interactive-card-hover"
                      style={{
                        background: isSel ? 'rgba(255, 255, 255, 0.16)' : 'rgba(20, 22, 30, 0.90)',
                        border: isSel ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '18px 20px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isSel ? '0 0 24px rgba(255, 255, 255, 0.22)' : 'none',
                        transform: isSel ? 'translateY(-2px)' : 'none'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>
                          {opt}
                        </div>
                        <span 
                          style={{ 
                            fontFamily: 'var(--font-mono, monospace)', 
                            fontSize: '0.62rem', 
                            color: isSel ? '#ffffff' : 'rgba(255, 255, 255, 0.40)' 
                          }}
                        >
                          KEY [{idx + 1}]
                        </span>
                      </div>

                      <div 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%',
                          border: isSel ? '2px solid #ffffff' : '1.5px solid rgba(255, 255, 255, 0.35)',
                          background: isSel ? '#ffffff' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSel && <Check size={11} color="#000000" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 7 — YOUR DETAILS (LET'S TALK)
              ========================================================================= */}
          {currentStep === 7 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 07 // DIRECT TELEMETRY COORDINATES
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Let's talk.
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '32px',
                  lineHeight: 1.55 
                }}
              >
                Provide your details so our executive creative director and flight operations team can reach you.
              </p>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}
              >
                {/* Full Name */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    FULL NAME *
                  </label>
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Company / Organisation */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    COMPANY / ORGANISATION
                  </label>
                  <input 
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}
              >
                {/* Role / Position */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    ROLE / POSITION
                  </label>
                  <input 
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Creative Director, CMO, Event Producer"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    EMAIL ADDRESS *
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '28px'
                }}
              >
                {/* Phone / WhatsApp */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    PHONE / WHATSAPP *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 ... or international format"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Website / Social */}
                <div>
                  <label 
                    style={{ 
                      display: 'block', 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.70rem', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '8px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    WEBSITE / INSTAGRAM / LINKEDIN (OPTIONAL)
                  </label>
                  <input 
                    type="text"
                    value={socialLink}
                    onChange={e => setSocialLink(e.target.value)}
                    placeholder="https://... or @handle"
                    className="interactive-input"
                    style={{
                      width: '100%',
                      background: 'rgba(20, 22, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label 
                  style={{ 
                    display: 'block', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em'
                  }}
                >
                  PREFERRED CONTACT METHOD
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Email', 'Phone', 'WhatsApp'].map(method => {
                    const isSel = preferredContact === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPreferredContact(method);
                          soundEngine.playBlip(560);
                        }}
                        onMouseEnter={() => soundEngine.playTick()}
                        className="interactive-pill-btn"
                        style={{
                          background: isSel ? '#ffffff' : 'rgba(20, 22, 30, 0.95)',
                          color: isSel ? '#000000' : '#ffffff',
                          border: isSel ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.16)',
                          padding: '10px 22px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSel ? '0 0 16px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 8 — ANYTHING ELSE? & FILE UPLOAD
              ========================================================================= */}
          {currentStep === 8 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                STEP 08 // COLLATERAL & DOSSIER
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  marginBottom: '10px'
                }}
              >
                Tell us anything else we should know
              </h1>

              <p 
                style={{ 
                  fontSize: '0.94rem', 
                  color: 'rgba(255, 255, 255, 0.70)', 
                  marginBottom: '28px',
                  lineHeight: 1.55 
                }}
              >
                Share creative briefs, site blueprints, vector assets, reference videos, or strict deadlines.
              </p>

              {/* Large Textarea */}
              <div style={{ marginBottom: '32px' }}>
                <textarea 
                  rows={4}
                  value={anythingElse}
                  onChange={e => setAnythingElse(e.target.value)}
                  placeholder="Anything about the event, creative direction, important deadlines, collaborators, or special requirements..."
                  className="interactive-input"
                  style={{
                    width: '100%',
                    background: 'rgba(20, 22, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* File Upload Box (Inspo 2 style) */}
              <div>
                <div 
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '12px'
                  }}
                >
                  ATTACH FILES (BRIEF, LOGO, SITE PLAN, REFERENCES)
                </div>

                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="interactive-card-hover"
                  style={{
                    background: isDragging ? 'rgba(255, 255, 255, 0.12)' : 'rgba(20, 22, 30, 0.90)',
                    border: isDragging ? '2px dashed #ffffff' : '1px dashed rgba(255, 255, 255, 0.28)',
                    borderRadius: '10px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px'
                  }}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept=".pdf,.jpg,.jpeg,.png,.svg,.mp4,.docx"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                  <div 
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}
                  >
                    <Upload size={20} color="#ffffff" />
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '10px' }}>
                    Have a brief, venue plan, logo, reference images or presentation?
                  </div>
                  <div 
                    style={{ 
                      fontFamily: 'var(--font-mono, monospace)', 
                      fontSize: '0.64rem', 
                      color: 'rgba(255, 255, 255, 0.40)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    ACCEPTED: PDF, JPG, PNG, SVG, MP4, DOCX (MAX 50MB)
                  </div>
                </div>

                {/* Uploaded File List */}
                {attachedFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {attachedFiles.map(file => (
                      <div
                        key={file.id}
                        style={{
                          background: 'rgba(20, 22, 30, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={16} color="rgba(255, 255, 255, 0.8)" />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                              {file.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.50)' }}>
                              {file.size} · Uploaded
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.45)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 9 — FINAL REVIEW & SUBMISSION SCREEN
              ========================================================================= */}
          {currentStep === 9 && (
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                FINAL STEP // MISSION DOSSIER REVIEW
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(2.0rem, 4.2vw, 3.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginBottom: '12px'
                }}
              >
                LET'S MAKE SOMETHING EXTRAORDINARY.
              </h1>

              <p 
                style={{ 
                  fontSize: '1.02rem', 
                  color: 'rgba(255, 255, 255, 0.75)', 
                  marginBottom: '32px',
                  lineHeight: 1.6 
                }}
              >
                Tell us what you're imagining. Our team will review your brief and get back to you with the next steps.
              </p>

              {/* Dossier Summary Card (Monochrome High Contrast) */}
              <div
                style={{
                  background: 'rgba(20, 22, 30, 0.95)',
                  border: '1.5px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: '10px',
                  padding: '24px',
                  marginBottom: '36px',
                  boxShadow: '0 0 30px rgba(255, 255, 255, 0.05)'
                }}
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    paddingBottom: '14px',
                    marginBottom: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.70rem', letterSpacing: '0.14em', color: '#ffffff' }}>
                      PROJECT ENQUIRY SUMMARY
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                    REF // {transmissionRef}
                  </span>
                </div>

                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '18px',
                    marginBottom: '18px'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '2px' }}>
                      EVENT &amp; DATE
                    </div>
                    <div style={{ fontSize: '0.90rem', fontWeight: 600, color: '#ffffff' }}>
                      {eventName || 'Untitled Event'} ({eventType})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {eventDate || 'Date Pending'} · {isDateConfirmed}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '2px' }}>
                      AIRSPACE &amp; VENUE
                    </div>
                    <div style={{ fontSize: '0.90rem', fontWeight: 600, color: '#ffffff' }}>
                      {city}, {country}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {venue || 'Venue Pending'} ({isVenueConfirmed})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '2px' }}>
                      FLEET &amp; DURATION
                    </div>
                    <div style={{ fontSize: '0.90rem', fontWeight: 600, color: '#ffffff' }}>
                      {droneCount === 'Not sure' ? 'Flight Team Recommendation' : `${droneCount} Drones`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {duration} · {audienceSize} audience
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '2px' }}>
                      CONTACT COORDINATES
                    </div>
                    <div style={{ fontSize: '0.90rem', fontWeight: 600, color: '#ffffff' }}>
                      {fullName || 'Representative'} {company ? `(${company})` : ''}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {email} · {phone}
                    </div>
                  </div>
                </div>

                {vision && (
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.10)', paddingTop: '12px', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.70)' }}>
                    <strong style={{ color: '#ffffff' }}>Vision:</strong> “{vision}”
                  </div>
                )}
              </div>

              {/* Big Action Submit Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="interactive-action-btn"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    padding: '16px 36px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>SUBMIT PROJECT ENQUIRY</span>
                  <ArrowRight size={18} />
                </button>

                <div 
                  style={{ 
                    fontFamily: 'var(--font-mono, monospace)', 
                    fontSize: '0.72rem', 
                    color: 'rgba(255, 255, 255, 0.70)' 
                  }}
                >
                  We typically respond within 1–2 business days.
                </div>

                <div 
                  style={{ 
                    fontFamily: 'var(--font-sans, sans-serif)', 
                    fontSize: '0.70rem', 
                    color: 'rgba(255, 255, 255, 0.45)',
                    textAlign: 'center'
                  }}
                >
                  By submitting this form, you agree to our{' '}
                  <Link to="/legal" target="_blank" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 10 — CONFIRMATION SUCCESS SCREEN (UPLINK COMPLETE)
              ========================================================================= */}
          {currentStep === 10 && (
            <div 
              style={{ 
                width: '100%', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 0'
              }}
            >
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 0 45px rgba(255, 255, 255, 0.7)'
                }}
              >
                <Check size={32} color="#000000" strokeWidth={3} />
              </div>

              <div 
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.24em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                TELEMETRY ENQUIRY LOGGED // TRANSMISSION CONFIRMED
              </div>

              <h1 
                style={{ 
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '14px',
                  lineHeight: 1.1
                }}
              >
                We'll be in touch.
              </h1>

              <p 
                style={{ 
                  fontSize: '1.05rem', 
                  color: 'rgba(255, 255, 255, 0.75)', 
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '540px'
                }}
              >
                Thank you, {fullName || 'there'}. Your project brief for <strong>{eventName || 'your show'}</strong> in {city} has been received by our flight operations and creative design team.
              </p>

              {/* Reference Badge */}
              <div 
                style={{
                  background: 'rgba(24, 26, 36, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  marginBottom: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.60rem', color: 'rgba(255, 255, 255, 0.50)' }}>
                    OFFICIAL REFERENCE CODE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    {transmissionRef}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(transmissionRef);
                    setCopiedCode(true);
                    soundEngine.playTick();
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="interactive-pill-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.28)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '0.70rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                  to="/"
                  onClick={() => soundEngine.playTick()}
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.25)'
                  }}
                >
                  RETURN HOME
                </Link>

                <Link
                  to="/drone-shows"
                  onClick={() => soundEngine.playTick()}
                  style={{
                    background: 'rgba(24, 26, 36, 0.95)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  EXPLORE FLEET SPECS
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. Bottom Floating HUD Bar with Smooth Micro-Interaction Buttons */}
      {currentStep <= 9 && (
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.92) 40%, #000000 100%)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Left: Previous Button */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="interactive-nav-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                padding: '10px 18px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={14} />
              <span>PREVIOUS</span>
            </button>
          ) : (
            <div />
          )}

          {/* Center: Tactile Keyboard Hint */}
          <div 
            style={{ 
              display: 'none', 
              fontFamily: 'var(--font-mono, monospace)', 
              fontSize: '0.66rem', 
              color: 'rgba(255, 255, 255, 0.50)',
              alignItems: 'center',
              gap: '6px'
            }}
            className="sm-flex"
          >
            <span>PRESS</span>
            <span 
              className="enter-key-pulse"
              style={{ 
                padding: '2px 8px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '3px', 
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              ENTER ↵
            </span>
            <span>TO ADVANCE</span>
          </div>

          {/* Right: Next / Review Button with Magnetic Hover Arrow */}
          {currentStep < 9 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="interactive-action-btn"
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 24px rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{currentStep === 8 ? 'REVIEW ENQUIRY' : 'NEXT'}</span>
              <ArrowRight size={14} className="next-arrow-icon" />
            </button>
          ) : (
            <div />
          )}
        </footer>
      )}

      {/* 6. "COMING SOON" Modal Dialog */}
      {infoModalContent && (
        <div
          onClick={() => setInfoModalContent(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.80)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d0e14',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '12px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span 
                style={{ 
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.65rem', 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  letterSpacing: '0.14em' 
                }}
              >
                MATRIX R&amp;D // COMING SOON
              </span>
              <button 
                onClick={() => setInfoModalContent(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
              >
                <X size={16} />
              </button>
            </div>

            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {infoModalContent}
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, marginBottom: '22px' }}>
              This experience is currently in development at Matrix. Join our notification dispatch to receive VIP deployment schedules and first access when it becomes available.
            </p>

            {notifySuccess ? (
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid #ffffff',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.78rem',
                  color: '#ffffff'
                }}
              >
                ✓ YOU ARE ON THE PRIORITY NOTIFICATION LIST
              </div>
            ) : (
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  if (notifyEmail) {
                    setNotifySuccess(true);
                    soundEngine.playUplinkSuccess();
                  }
                }}
                style={{ display: 'flex', gap: '8px' }}
              >
                <input 
                  type="email"
                  required
                  placeholder="Enter email for priority access"
                  value={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  NOTIFY ME
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. Live Brief Dossier Side Drawer */}
      {showDossierDrawer && (
        <aside
          style={{
            position: 'fixed',
            top: '64px',
            bottom: 0,
            right: 0,
            width: '340px',
            maxWidth: '85vw',
            zIndex: 60,
            background: 'rgba(10, 11, 16, 0.96)',
            backdropFilter: 'blur(25px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
            padding: '24px',
            overflowY: 'auto',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.85)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', letterSpacing: '0.16em', color: '#ffffff' }}>
              LIVE BRIEF DOSSIER
            </span>
            <button
              onClick={() => setShowDossierDrawer(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                  01 // EVENT
                </span>
                <button onClick={() => jumpToStep(1)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                {eventName || 'Untitled Event'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                {eventType} · {eventDate || 'Date Pending'}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                  02 // LOCATION
                </span>
                <button onClick={() => jumpToStep(2)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                {city}, {country}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                Venue: {venue || 'TBD'} ({isVenueConfirmed})
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                  03 // FLEET &amp; SCALE
                </span>
                <button onClick={() => jumpToStep(3)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                {droneCount === 'Not sure' ? 'Drone Light Show (Recommend Scale)' : `${droneCount} Drones`}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                  05-06 // AUDIENCE &amp; BUDGET
                </span>
                <button onClick={() => jumpToStep(5)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '0.80rem', color: '#ffffff' }}>
                Audience: {audienceSize} · Duration: {duration}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                Budget: {budget}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                  07 // CONTACT
                </span>
                <button onClick={() => jumpToStep(7)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '0.80rem', color: '#ffffff' }}>
                {fullName || 'Name pending'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                {email || 'Email pending'}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Embedded CSS Animations & Micro-Interactions */}
      <style>{`
        /* Smooth Step Transitions */
        .step-transition-forward {
          animation: stepSlideInForward 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .step-transition-backward {
          animation: stepSlideInBackward 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes stepSlideInForward {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.985);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes stepSlideInBackward {
          0% {
            opacity: 0;
            transform: translateY(-22px) scale(0.985);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Micro-interactions: Card Hover Lift */
        .interactive-card-hover {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease, box-shadow 0.22s ease !important;
        }
        .interactive-card-hover:hover {
          transform: translateY(-2.5px);
          border-color: rgba(255, 255, 255, 0.35) !important;
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 255, 255, 0.08) !important;
        }
        .interactive-card-hover:active {
          transform: scale(0.98);
        }

        /* Micro-interactions: Input Focus Glow */
        .interactive-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        .interactive-input:focus {
          border-color: #ffffff !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.25) !important;
        }

        /* Micro-interactions: Action Buttons */
        .interactive-action-btn {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .interactive-action-btn:hover {
          box-shadow: 0 0 45px rgba(255, 255, 255, 0.7) !important;
          transform: translateY(-2px);
        }
        .interactive-action-btn:hover .next-arrow-icon {
          transform: translateX(4px);
        }
        .next-arrow-icon {
          transition: transform 0.25s ease;
        }
        .interactive-action-btn:active {
          transform: scale(0.97);
        }

        /* Enter Key Pulse */
        .enter-key-pulse {
          animation: enterPulse 2.4s infinite ease-in-out;
        }
        @keyframes enterPulse {
          0%, 100% {
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.25);
          }
          50% {
            box-shadow: 0 0 14px rgba(255, 255, 255, 0.65);
            border-color: rgba(255, 255, 255, 0.85);
          }
        }

        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
        }
        @media (min-width: 640px) {
          .sm-flex { display: flex !important; }
          .sm-inline { display: inline !important; }
        }
      `}</style>
    </div>
  );
};
