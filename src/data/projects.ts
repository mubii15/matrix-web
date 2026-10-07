export interface Project {
  id: string;
  title: string;
  category: 'Drone Shows' | 'Immersive' | 'Projection' | 'LED' | 'Autonomous Systems' | 'R&D Showcase';
  client: string;
  location: string;
  year: string;
  scope: string;
  technologies: string[];
  summary: string;
  details: {
    brief: string;
    concept: string;
    engineering: string;
    results: string;
  };
  metrics: { label: string; value: string }[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'constellation-odyssey',
    title: 'Constellation Odyssey',
    category: 'Drone Shows',
    client: 'Civic Cultural Foundation',
    location: 'Coastal Arena',
    year: '2026',
    scope: '350 Autonomous Show Drones',
    technologies: ['DRONE SHOW', 'AUTONOMOUS SYSTEMS', 'SPATIAL AUDIO'],
    summary: 'A 15-minute aerial symphony translating oceanic navigation mythology into synchronized 3D constellation formations over open water.',
    details: {
      brief: 'Create an iconic aerial light narrative for a metropolitan harbor opening, visible across a 3km shoreline without disruptive fireworks debris.',
      concept: 'Translate ancient stellar navigation charts into fluid three-dimensional kinetic formations, synchronized with an orchestral score broadcast across harbor sound towers.',
      engineering: 'Multi-constellation RTK-GPS correction base stations deployed along the shoreline, managing maritime wind shear with dynamic trajectory compensation algorithms.',
      results: 'Flawless zero-incident flight executed across 350 drones, generating widespread civic engagement and viral social coverage.'
    },
    metrics: [
      { label: 'Fleet Size', value: '350 Drones' },
      { label: 'Max Altitude', value: '180m AGL' },
      { label: 'Formations', value: '14 Transitions' },
      { label: 'Wind Tolerance', value: '10 m/s' }
    ],
    featured: true
  },
  {
    id: 'monolith-resonance',
    title: 'Monolith Resonance',
    category: 'Projection',
    client: 'Design Biennale & Heritage Trust',
    location: 'Metropolitan Square',
    year: '2025',
    scope: 'Architectural Mapping & Laser Arrays',
    technologies: ['PROJECTION', 'LASER', 'INTERACTIVE SENSORS'],
    summary: 'Transforming a 70-meter brutalist concrete facade into a living harmonic equalizer reacting to acoustic inputs and ambient crowd movement.',
    details: {
      brief: 'Activate a monumental historic facade for a week-long digital arts festival, emphasizing structural architecture rather than conventional 2D video projection.',
      concept: 'Treating the physical concrete joints and reliefs as acoustic strings that vibrate with laser light and architectural shadows.',
      engineering: 'LiDAR scanning of the brutalist facade produced an exact sub-centimeter digital twin. Four 40,000-lumen 4K laser projectors were edge-blended with synchronized aerial laser scanning.',
      results: 'Over 120,000 festival attendees experienced the week-long installation, celebrated by architectural publications for respect toward the raw structure.'
    },
    metrics: [
      { label: 'Projector Lumen Output', value: '160,000 Lumens' },
      { label: 'Surface Area', value: '3,800 m²' },
      { label: 'Sensor Array', value: '4x LiDAR Scanners' }
    ],
    featured: true
  },
  {
    id: 'kinetic-horizon',
    title: 'Kinetic Horizon',
    category: 'LED',
    client: 'Automotive Innovation Summit',
    location: 'Exhibition Center',
    year: '2025',
    scope: 'Kinetic Ceiling LED & Stage Immersion',
    technologies: ['LED', 'AUTONOMOUS SYSTEMS', 'KINETIC WINCHES'],
    summary: 'A ceiling array of 128 synchronized motorized LED light tubes that physically undulate above a flagship vehicle reveal.',
    details: {
      brief: 'Deliver a breathtaking vehicle unveil moment for global press that felt like aerodynamics brought to physical life.',
      concept: 'A fluid wave of light that moves not only in pixel colors, but physically lowers and arches in the air above the stage.',
      engineering: 'Custom high-speed DMX servo winches with millimeter positioning accuracy, coordinated with real-time generative visual shaders.',
      results: 'Broadcast live to an audience of over 2.4 million viewers worldwide, receiving international accolades for experiential production design.'
    },
    metrics: [
      { label: 'Kinetic Units', value: '128 Winches' },
      { label: 'Vertical Travel', value: '6 Meters' },
      { label: 'Update Frequency', value: '60 Hz' }
    ],
    featured: true
  },
  {
    id: 'prism-tide',
    title: 'Prism Tide (Prototype Showcase)',
    category: 'R&D Showcase',
    client: 'Matrix Labs Experimental Initiative',
    location: 'Matrix Test Facility',
    year: '2026',
    scope: 'Hydro-Optic Projection & Programmable Water',
    technologies: ['WATER', 'PROJECTION', 'R&D'],
    summary: 'A controlled laboratory exploration combining laminar water curtain projections with reactive spatial acoustics in physical space.',
    details: {
      brief: 'Matrix Labs internal R&D project to determine optical transmission characteristics of varied water droplet sizes under laser illumination.',
      concept: 'Investigate how fluid surfaces can become high-resolution, zero-waste projection canvases that dissolve instantaneously.',
      engineering: 'Engineered custom manifold with 64 high-speed solenoid valves operating at 10-millisecond response rates, driven by custom firmware.',
      results: 'Proved viability for large-scale outdoor civic installations; informed the development roadmap for upcoming water media products.'
    },
    metrics: [
      { label: 'Nozzle Frequency', value: '100 Hz' },
      { label: 'Screen Width', value: '18m Arc' },
      { label: 'Status', value: 'Lab Verified' }
    ],
    featured: false
  },
  {
    id: 'apex-aerial-choreography',
    title: 'Apex Sovereign Launch',
    category: 'Drone Shows',
    client: 'Global Technology Brand',
    location: 'Bayfront Stadium',
    year: '2025',
    scope: '500 Autonomous Show Drones',
    technologies: ['DRONE SHOW', 'AUTONOMOUS SYSTEMS', 'FORMATION DESIGN'],
    summary: 'A 500-drone aerial spectacular depicting the evolution of computational speed and microchip architecture above a stadium keynote.',
    details: {
      brief: 'Close a world developer conference with a technical aerial exhibition illustrating the transition from silicon wafers to global neural networks.',
      concept: 'Precision engineering meets sculptural storytelling: drones begin in an intricate microscopic lattice before expanding into a 200-meter spherical globe.',
      engineering: 'Choreographed and validated within Matrix Designer desktop software. Trajectories were verified against maximum flight accelerations and battery discharge curves.',
      results: 'Flawless 12-minute aerial execution with 100% drone retrieval rate and unanimous standing ovation from 15,000 attendees.'
    },
    metrics: [
      { label: 'Fleet Count', value: '500 Drones' },
      { label: 'Diameter of Formation', value: '220 Meters' },
      { label: 'Average Drift', value: '< 2.4 cm' }
    ],
    featured: true
  },
  {
    id: 'hyper-cube-environment',
    title: 'HyperCube Spatial Chamber',
    category: 'Immersive',
    client: 'Interactive Arts Institute',
    location: 'Contemporary Art Hall',
    year: '2025',
    scope: '360° LED & Ambisonic Spatial Audio',
    technologies: ['IMMERSIVE', 'LED', 'SPATIAL AUDIO'],
    summary: 'A 6-sided mirrored LED cube suspending visitors inside an infinite mathematical tesseract with generative real-time particle simulations.',
    details: {
      brief: 'Create a permanent experiential centerpiece exploring the mathematics of fourth-dimensional topology.',
      concept: 'Surround participants with continuous 1.2mm floor-to-ceiling LED walls and one-way architectural mirrors, creating infinite optical reflections.',
      engineering: 'Custom GPU rendering pipeline rendering 32 million pixels at uncompressed 60fps, synchronized with an 18-channel ambisonic speaker grid.',
      results: 'Permanent installation visited by over 80,000 people in its initial 6 months of operation.'
    },
    metrics: [
      { label: 'Resolution', value: '32 Million Px' },
      { label: 'Audio Channels', value: '18 Ambisonic' },
      { label: 'Pixel Pitch', value: '1.2mm' }
    ],
    featured: false
  }
];
