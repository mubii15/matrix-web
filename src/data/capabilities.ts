export type AvailabilityStatus = 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'R&D / FUTURE';

export interface CapabilityItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: AvailabilityStatus;
  applications: string[];
  metrics?: string[];
}

export interface CapabilityCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  items: CapabilityItem[];
}

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    id: 'aerial',
    title: 'AERIAL SYSTEMS',
    subtitle: 'The sky as an infinite programmable canvas',
    description: 'Autonomous aerial light shows and unmanned swarm platforms engineered for precision trajectory execution, high lumen output, and zero-incident redundancy.',
    iconName: 'Send',
    items: [
      {
        id: 'drone-light-shows',
        name: 'Autonomous Drone Light Shows',
        tagline: 'Synchronized aerial light choreographies',
        description: 'Hundreds of synchronized autonomous drones forming animated geometries, typographic marks, 3D sculptures, and narrative sequences in the open night sky.',
        status: 'AVAILABLE NOW',
        applications: ['Brand Launches', 'Public Celebrations', 'Music Festivals', 'Civic & Tourism Events', 'Stadium Spectacles'],
        metrics: ['Centimeter-accurate RTK positioning', 'Ultra-bright RGBW LEDs', 'Sub-millisecond timecode sync']
      },
      {
        id: 'indoor-drone-shows',
        name: 'Indoor Micro-Swarm Displays',
        tagline: 'Precision flight in enclosed architecture',
        description: 'Enclosed optical and ultra-wideband (UWB) tracked micro-drone formations designed to operate safely in close proximity to stages, audiences, and exhibition halls.',
        status: 'IN DEVELOPMENT',
        applications: ['Concert Tours', 'Auto Shows & Keynotes', 'Theatrical Productions', 'Museum Exhibitions'],
        metrics: ['Ultra-wideband local positioning', 'Propeller shrouded safety cage', 'Silent low-turbulence propulsion']
      },
      {
        id: 'daytime-aerial',
        name: 'Daytime Aerial Displays',
        tagline: 'Visible high-contrast daytime sky media',
        description: 'Novel daylight aerial systems utilizing colored smoke plumes, high-luminance retroreflective payloads, and aerodynamic banners choreographed autonomously.',
        status: 'R&D / FUTURE',
        applications: ['Day Festivals', 'Airshows', 'Sporting Opening Ceremonies'],
        metrics: ['Bio-degradable vapor generation', 'High-visibility visual contrast']
      },
      {
        id: 'autonomous-aerial-platforms',
        name: 'Custom Aerial Sensor & Payload Platforms',
        tagline: 'Hardware engineered for specialized physical effects',
        description: 'Proprietary multi-rotor airframes custom-designed for specialized payloads, laser emitters, meteorological sensing, and theatrical aerial drops.',
        status: 'IN DEVELOPMENT',
        applications: ['Cinema Cinematography', 'Theatrical Special Effects', 'Atmospheric Spatial Sensing'],
        metrics: ['Modular quick-release payload bay', 'Encrypted redundant telemetry link']
      }
    ]
  },
  {
    id: 'light-image',
    title: 'LIGHT & IMAGE',
    subtitle: 'Transforming solid mass into luminous media',
    description: 'High-lumen architectural projection mapping, volumetric illumination, custom laser arrays, and engineered LED media surfaces that turn structures into living canvases.',
    iconName: 'Sparkles',
    items: [
      {
        id: 'projection-mapping',
        name: 'Architectural Projection Mapping',
        tagline: 'Large-scale structural metamorphosis',
        description: 'Multi-projector warping, edge blending, and 3D architectural scanning that sculpts light precisely onto buildings, natural landscapes, and custom geometric sculptures.',
        status: 'AVAILABLE NOW',
        applications: ['Heritage Facades', 'Stadium Canopies', 'Immersive Pavilions', 'Product Reveals'],
        metrics: ['4K laser projection stacks', 'Dynamic perspective calibration']
      },
      {
        id: 'led-environments',
        name: 'Engineered LED Environments',
        tagline: 'Seamless architectural display surfaces',
        description: 'Custom fine-pitch LED volumes, curved screens, floor displays, and transparent LED skins embedded seamlessly into physical architecture.',
        status: 'AVAILABLE NOW',
        applications: ['Immersive Galleries', 'Corporate Keynotes', 'Permanent Installations'],
        metrics: ['High refresh HDR processing', 'Sub-1mm pixel pitch options']
      },
      {
        id: 'interactive-led',
        name: 'Interactive Kinetic LED',
        tagline: 'Displays that physically respond to movement',
        description: 'Physical motorized winches and sensor-driven LED arrays that shift in three-dimensional space based on audience presence, choreography, or live data inputs.',
        status: 'AVAILABLE NOW',
        applications: ['Art Biennales', 'Nightclub Scenography', 'Luxury Flagship Stores'],
        metrics: ['DMX/ArtNet/sACN precision control', 'Real-time LiDAR occupant tracking']
      },
      {
        id: 'laser-systems',
        name: 'Synchronized Spatial Lasers',
        tagline: 'Atmospheric beam geometries and vector graphics',
        description: 'High-power RGB laser systems calibrated with atmospheric haze and spatial mirrors to slice space into geometric planes and volumetric tunnels.',
        status: 'AVAILABLE NOW',
        applications: ['Electronic Music Festivals', 'Arena Tours', 'Skyward Landmark Beacons'],
        metrics: ['Pangolin software integration', 'Audience safety scanning certified']
      },
      {
        id: 'volumetric-displays',
        name: 'Volumetric & Spatial Optics',
        tagline: 'True three-dimensional light without glasses',
        description: 'Experimental holographic optical elements and high-speed persistance-of-vision volumetric arrays producing genuine depth illusions in physical space.',
        status: 'R&D / FUTURE',
        applications: ['Exhibition Centerpieces', 'Sci-Fi Film Premieres', 'Public Art'],
        metrics: ['Zero-wearable viewing', 'True spatial focal planes']
      }
    ]
  },
  {
    id: 'water',
    title: 'PROGRAMMABLE WATER',
    subtitle: 'Turning fluid mechanics into synchronized media',
    description: 'High-speed pneumatic water nozzles, laminar flow jets, mist projection screens, and water choreography synchronized to light, sound, and autonomous systems.',
    iconName: 'Droplets',
    items: [
      {
        id: 'programmable-fountains',
        name: 'High-Speed Programmable Jets',
        tagline: 'Digital water actuation at millisecond speed',
        description: 'Solenoid-switched laminar nozzles that pulse individual water droplets to generate graphics, cascading liquid letters, and kinetic fluid sculptures.',
        status: 'IN DEVELOPMENT',
        applications: ['Civic Plazas', 'Destination Resorts', 'Waterfront Spectacles'],
        metrics: ['10ms valve actuation time', 'Submerged DMX RGB lighting integration']
      },
      {
        id: 'water-screens',
        name: 'Hydro-Mist Projection Screens',
        tagline: 'Ethereal floating imagery on water curtains',
        description: 'Semi-transparent semi-circular and straight water curtains that allow high-lumen video projection to float in mid-air above water bodies.',
        status: 'IN DEVELOPMENT',
        applications: ['Harbor Shows', 'Theme Parks', 'Lake Festivals'],
        metrics: ['Up to 40m wide projection surface', 'Wind-resistant laminar nozzle geometry']
      },
      {
        id: 'interactive-water',
        name: 'Interactive Water Installations',
        tagline: 'Water that pauses and deflects around people',
        description: 'Ultrasonic and depth-camera guided water enclosures where water streams stop instantaneously to allow people to walk through without getting wet.',
        status: 'R&D / FUTURE',
        applications: ['Science Centers', 'Brand Experiential Activations', 'Contemporary Pavilions'],
        metrics: ['Infrared time-of-flight human tracking', 'Zero-latency solenoid manifold']
      }
    ]
  },
  {
    id: 'immersive',
    title: 'IMMERSIVE ENVIRONMENTS',
    subtitle: 'World-building across 360 degrees of sensory space',
    description: 'Enclosing the viewer in cohesive sensory universes where floor, walls, ceiling, sound, and lighting interact as a single programmable entity.',
    iconName: 'Boxes',
    items: [
      {
        id: '360-environments',
        name: '360° Projection & LED Domes',
        tagline: 'Total visual envelopment',
        description: 'Geodesic domes and seamless cycloramas mapped with continuous perspective-corrected visual media that transport audiences into virtual landscapes.',
        status: 'AVAILABLE NOW',
        applications: ['Planetariums', 'Brand World Experiences', 'Metaverse Physical Portals'],
        metrics: ['8K multi-channel server playback', 'Ambisonics 3D spatial audio arrays']
      },
      {
        id: 'interactive-installations',
        name: 'Sensor-Driven Spatial Media',
        tagline: 'Physical environments that feel alive and responsive',
        description: 'Architecture and spatial sculptures that listen, track, and visually react to human presence, body gestures, sound levels, and ambient environmental conditions.',
        status: 'AVAILABLE NOW',
        applications: ['Art Museums', 'Technology Headquarters', 'Interactive Brand Flagships'],
        metrics: ['LiDAR, computer vision, pressure sensors', 'Custom TouchDesigner / Notch pipelines']
      },
      {
        id: 'spatial-audio',
        name: 'Spatial Object-Based Audio Systems',
        tagline: 'Acoustic positioning that moves through physical space',
        description: 'Multichannel speaker grids programmed using object-based spatial panning, creating the illusion of sound sources flying through the room in sync with drones or light.',
        status: 'IN DEVELOPMENT',
        applications: ['Concert Venues', 'Experiential Theaters', 'Outdoor Drone Show Soundfields'],
        metrics: ['Dolby Atmos / d&b Soundscape integration', 'Low-latency OSC automation']
      }
    ]
  },
  {
    id: 'autonomous-systems',
    title: 'AUTONOMOUS SYSTEMS & ROBOTICS',
    subtitle: 'The intelligence that coordinates mass movement',
    description: 'The algorithmic nervous system of Matrix: swarm intelligence, decentralized collision avoidance, real-time telemetry, and hardware controllers.',
    iconName: 'Cpu',
    items: [
      {
        id: 'swarm-algorithms',
        name: 'Swarm Trajectory Engine',
        tagline: 'Mathematical coordination of hundreds of agents',
        description: 'Proprietary mathematical algorithms that calculate collision-free trajectories for hundreds of autonomous drones simultaneously while respecting aerodynamic boundaries.',
        status: 'AVAILABLE NOW',
        applications: ['Drone Light Shows', 'Autonomous Aerial Art', 'Coordinated Robotic Kinetic Sculptures'],
        metrics: ['Continuous B-spline smoothing', '100% collision-free computational validation']
      },
      {
        id: 'ground-control',
        name: 'Redundant Ground Control Infrastructure',
        tagline: 'Military-grade mission control for aerial entertainment',
        description: 'Dual-redundant mission control hardware, real-time RF spectrum analysis, automatic return-to-home fail-safes, and geofencing boundaries.',
        status: 'AVAILABLE NOW',
        applications: ['Commercial Flight Operations', 'Government Public Events', 'Offshore Coastal Shows'],
        metrics: ['Triple RF link redundancy', 'Sub-second emergency swarm termination']
      },
      {
        id: 'spatial-sensors',
        name: 'Spatial Environmental Telemetry',
        tagline: 'Reading physical parameters in real-time',
        description: 'Anemometer sensor networks, atmospheric humidity monitors, and GPS satellite constellation monitors feeding real-time safety thresholds directly into the show director.',
        status: 'IN DEVELOPMENT',
        applications: ['Outdoor Live Operations', 'Harbor & Mountain Flight Sites'],
        metrics: ['Live wind vector triangulation', 'Real-time GNSS DOP telemetry']
      },
      {
        id: 'choreographed-robotics',
        name: 'Choreographed Robotic Arms & Winches',
        tagline: 'Industrial robots transformed into theatrical performers',
        description: 'Six-axis industrial robotic arms equipped with light bars, mirrors, and displays programmed in real-time synchronicity with music and video playback.',
        status: 'R&D / FUTURE',
        applications: ['Auto Show Stages', 'Live Concert Spectaculars', 'Technological Art Installations'],
        metrics: ['Sub-millimeter repeatable positioning', 'High-speed industrial fieldbus sync']
      }
    ]
  }
];
