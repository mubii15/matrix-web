export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: 'ENGINEERING' | 'R&D' | 'BEHIND THE SCENES' | 'DESIGN' | 'ANNOUNCEMENTS';
  date: string;
  readTime: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
  tags: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: '1',
    slug: 'translating-vectors-into-the-sky',
    title: 'Designing the Sky: How We Translate Vectors into Aerial Drone Formations',
    category: 'DESIGN',
    date: 'September 18, 2026',
    readTime: '6 min read',
    excerpt: 'A deep look into the mathematical and spatial translation pipeline inside Matrix Designer: transforming raw SVG bezier curves and 3D meshes into safe, kinematic drone flight coordinates.',
    author: {
      name: 'Matrix Computational Team',
      role: 'Creative Technology & Spatial Software'
    },
    content: [
      'When an artist draws a line in vector software, they are manipulating mathematical splines with infinite resolution. When that line is translated into a physical drone show, it must be discretized into distinct luminous points in three-dimensional space, each constrained by the physical laws of aerodynamics, motor thrust, and safety separation margins.',
      'Inside Matrix Designer, our core philosophy is "Anything → Formation." Whether an artist supplies text typography, SVG vectors, 2D raster imagery, or full 3D polygonal meshes from Blender, our computational engine samples the geometry and distributes drone positions using centroidal Voronoi tessellation and dynamic point-cloud relaxation.',
      'Once a formation is sampled, the true challenge begins: choreography and transition. A drone cannot simply teleport from point A in formation 1 to point B in formation 2. The shortest visual path may result in aerodynamic wake turbulence or mid-air collisions. Our transition algorithm uses Hungarian assignment optimization paired with continuous 3D collision-avoidance fields to compute graceful, fluid transit paths that look magical while maintaining rigorous safety buffers.'
    ],
    tags: ['Matrix Designer', 'Formation Design', 'Mathematics', 'Choreography']
  },
  {
    id: '2',
    slug: 'inside-swarm-safety-architecture',
    title: 'Inside Swarm Safety: Redundancy, Geofencing, and Fail-Safe Architecture',
    category: 'ENGINEERING',
    date: 'August 24, 2026',
    readTime: '8 min read',
    excerpt: 'Operating hundreds of autonomous aircraft over urban locations demands military-grade safety systems. Here is how our three-tier fail-safe matrix ensures zero-compromise reliability.',
    author: {
      name: 'Matrix Flight Operations & Systems',
      role: 'Autonomous Flight Engineering'
    },
    content: [
      'Safety in autonomous swarm operations is not an afterthought or a software toggle; it is the fundamental architectural constraint around which every motor, radio frequency, and line of code is engineered.',
      'Our flight operations deploy a three-tier safety boundary known as the Matrix Safety Matrix. Tier 1 is algorithmic: every flight path is pre-validated in simulation across hundreds of simulated turbulence profiles before a drone ever touches the flight field. Any path violating minimum safe separation is flagged and rejected at the compiler level.',
      'Tier 2 is hardware telemetry: every drone maintains dual-band RF communication with redundant ground control stations while continuously checking its own RTK-GPS deviation, battery voltage curves, and internal temperature sensors. If any single drone experiences a sensor anomaly, it independently executes a gentle vertical descent or returns to its designated abort coordinate without disturbing the swarm.',
      'Tier 3 is deterministic physical geofencing: invisible geographic 3D boundary boxes enforced by the drone flight controller firmware. Even in the theoretical failure of central telemetry, an individual drone is physically incapable of traversing outside its approved flight airspace.'
    ],
    tags: ['Safety', 'Autonomous Systems', 'Swarm Engineering', 'Hardware']
  },
  {
    id: '3',
    slug: 'physical-spaces-programmable',
    title: 'Beyond the Screen: The Philosophy of Physical Space Programmability',
    category: 'R&D',
    date: 'July 14, 2026',
    readTime: '5 min read',
    excerpt: 'Why digital media must break out of glass rectangles. Exploring the convergence of autonomous robotics, light, water, and architecture in the real world.',
    author: {
      name: 'Matrix Executive Team',
      role: 'Spatial Media & Architecture'
    },
    content: [
      'For the last three decades, digital technology has progressively compressed human attention into smaller and flatter glass screens: monitors, televisions, smartphones, and tablets. While digital tools have unlocked unprecedented creative expression, their physical manifestation has remained largely confined to two dimensions.',
      'At Matrix, our thesis is simple: "We make physical spaces programmable." Digital media does not need to live on a screen. It can exist in the sky as hundreds of luminous points of flight. It can exist across building facades as reactive light. It can exist in water as high-frequency programmable droplets.',
      'Drone light shows are our commercial beachhead, but they are just the first milestone of this vision. By developing integrated hardware, control protocols, and creative software like Matrix Designer, we are constructing the infrastructure for a world where architecture and open atmosphere can become interactive, expressive media.'
    ],
    tags: ['Philosophy', 'Spatial Media', 'Future Tech', 'Immersive']
  },
  {
    id: '4',
    slug: 'vertical-integration-show-drones',
    title: 'Why We Build Our Own Hardware: The Vertical Integration Advantage',
    category: 'ENGINEERING',
    date: 'June 02, 2026',
    readTime: '7 min read',
    excerpt: 'Off-the-shelf drones limit artistic choreography and rapid on-site repair. Discover why Matrix designs, machines, and programs its own fleet platforms in-house.',
    author: {
      name: 'Matrix Hardware & Manufacturing',
      role: 'Mechanical & Avionics Engineering'
    },
    content: [
      'In the drone show industry, many companies operate as equipment rental providers, purchasing pre-packaged turn-key systems from overseas manufacturers. While this lowers the barrier to entry, it creates severe creative and operational bottlenecks.',
      'When your hardware is a closed black box, you cannot alter motor acceleration profiles to achieve snappier choreographic transitions. You cannot redesign the optical lenses over the LEDs to achieve wider beam angles. And if an operational issue occurs in the field, you are dependent on overseas customer support.',
      'Matrix takes an uncompromising vertically integrated approach: we design our airframes from aerospace-grade carbon composites, develop custom PCB power distribution boards, write our own motor timing firmware, and solder our own communication telemetry modules. This in-house mastery allows us to iterate rapidly, deliver unmatched reliability, and build technologies that simply cannot be bought off the shelf.'
    ],
    tags: ['Hardware', 'Vertical Integration', 'Manufacturing', 'Aerospace']
  }
];
