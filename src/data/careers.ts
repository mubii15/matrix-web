export interface CareerRole {
  id: string;
  title: string;
  department: 'ENGINEERING' | 'SOFTWARE' | 'CREATIVE' | 'OPERATIONS';
  location: string;
  type: 'Full-time' | 'Contract' | 'Hybrid';
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'autonomous-flight-engineer',
    title: 'Autonomous Flight Systems Engineer',
    department: 'ENGINEERING',
    location: 'Lagos / Hybrid',
    type: 'Full-time',
    description: 'Lead the development and calibration of our proprietary multi-rotor flight controllers, RTK-GPS integration, state estimation filters, and multi-agent swarm telemetry.',
    responsibilities: [
      'Design, test, and tune custom flight control firmware (PX4 / ArduPilot / custom C++ controllers)',
      'Conduct hardware-in-the-loop (HIL) simulations and outdoor autonomous test flights',
      'Optimize RF telemetry links and frequency-hopping protocols for congested environments',
      'Collaborate with the software team on real-time telemetry streaming to Matrix Designer'
    ],
    requirements: [
      'Degree in Aerospace, Robotics, Mechatronics, or equivalent practical experience',
      'Strong proficiency in C/C++, Python, and Linux embedded environments',
      'Hands-on experience with RTK-GNSS, IMU sensor fusion (Extended Kalman Filters), and multi-rotor dynamics',
      'Passion for pushing the boundaries of live autonomous flight displays'
    ]
  },
  {
    id: 'creative-technologist-graphics',
    title: 'Senior Creative Technologist (Spatial Media)',
    department: 'CREATIVE',
    location: 'Hybrid / Remote',
    type: 'Full-time',
    description: 'Bridge the worlds of high-level visual art and spatial computing. Develop generative visual pipelines, shaders, LiDAR point-cloud interactions, and projection installations.',
    responsibilities: [
      'Build generative 2D/3D graphics pipelines using GLSL shaders, TouchDesigner, Notch, and Three.js',
      'Integrate real-time computer vision sensors (LiDAR, depth cameras) for interactive physical spaces',
      'Collaborate with 3D artists to translate complex narrative concepts into physical media systems',
      'Contribute algorithmic ideas to the Matrix Designer formation generation toolset'
    ],
    requirements: [
      'Proven portfolio of interactive physical installations, stage visual systems, or generative art',
      'Deep knowledge of real-time graphics rendering, lighting calculation, and geometry shaders',
      'Proficiency with TouchDesigner, WebGL / GLSL, Houdini, or custom creative coding frameworks',
      'Strong aesthetic sensibility paired with rigorous technical problem solving'
    ]
  },
  {
    id: '3d-choreographer-animator',
    title: '3D Drone Show Choreographer & Animator',
    department: 'CREATIVE',
    location: 'Remote / On-site for rehearsals',
    type: 'Full-time',
    description: 'Create captivating aerial choreographies, 3D sculptures, and narrative transitions using Blender and Matrix Designer for high-profile client shows.',
    responsibilities: [
      'Design and animate 3D geometric formations, logos, and narrative characters for swarms of 100 to 1,000 drones',
      'Choreograph transitions that maximize visual impact while respecting physical velocity and collision limits',
      'Synchronize aerial movements and lighting color palettes with musical timecode',
      'Prepare client-facing 3D cinematic simulation renders and show documentation'
    ],
    requirements: [
      'Exceptional 3D animation skills in Blender, Cinema4D, Maya, or 3ds Max',
      'Strong spatial awareness and understanding of perspective from ground audience viewpoints',
      'Ability to communicate technical constraints gracefully with non-technical clients',
      'Experience or strong enthusiasm for drone show choreography and kinetic lighting'
    ]
  },
  {
    id: 'embedded-hardware-engineer',
    title: 'Embedded Hardware & Robotics Engineer',
    department: 'ENGINEERING',
    location: 'Hardware Lab',
    type: 'Full-time',
    description: 'Design custom PCBs, power distribution electronics, high-power LED driver circuits, and pneumatic solenoid controllers for our physical media systems.',
    responsibilities: [
      'Schematic capture and multi-layer PCB layout using KiCad or Altium Designer',
      'Design efficient high-current power distribution and battery management systems (BMS)',
      'Prototype and test micro-controller firmware (STM32, ESP32, ARM Cortex-M)',
      'Conduct thermal modeling and electromagnetic interference (EMI) mitigation'
    ],
    requirements: [
      'Degree in Electrical/Electronic Engineering or demonstrable hardware portfolio',
      'Demonstrated experience in high-reliability PCB design and low-level firmware in C',
      'Familiarity with industrial communication protocols (CAN bus, RS485, DMX512, Ethernet)',
      'Comfortable with benchtop testing equipment: oscilloscopes, logic analyzers, RF spectrum analyzers'
    ]
  },
  {
    id: 'flight-operations-lead',
    title: 'Flight Operations & Safety Director',
    department: 'OPERATIONS',
    location: 'Lagos / Travel Required',
    type: 'Full-time',
    description: 'Direct live flight operations on site, oversee aviation regulatory compliance and airspace permits, coordinate field crews, and enforce zero-compromise safety protocols.',
    responsibilities: [
      'Manage on-site show setups, ground station deployments, and live flight countdowns',
      'Liaise with civil aviation authorities and airport control towers for airspace authorizations and NOTAMs',
      'Conduct rigorous pre-flight safety checklists, spectrum checks, and meteorological evaluations',
      'Train and supervise field technicians, battery handlers, and safety marshals'
    ],
    requirements: [
      'Commercial drone pilot certification / UAS operator credential',
      'Proven experience managing live outdoor productions, high-stakes events, or aviation operations',
      'Calm, decisive leadership under high-pressure live show conditions',
      'Willingness to travel for domestic and international project deployments'
    ]
  }
];
