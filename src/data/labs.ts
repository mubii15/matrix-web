export type LabStatus = 'RESEARCH' | 'PROTOTYPE' | 'IN DEVELOPMENT' | 'EXPERIMENTAL';

export interface LabProject {
  id: string;
  codename: string;
  title: string;
  category: 'Aerial Robotics' | 'Fluid Dynamics' | 'Spatial Computing' | 'Volumetric Optics' | 'Swarm Autonomy';
  status: LabStatus;
  summary: string;
  hypothesis: string;
  technicalMilestones: string[];
  lastUpdate: string;
}

export const LAB_PROJECTS: LabProject[] = [
  {
    id: 'project-icarus',
    codename: 'PROJECT ICARUS',
    title: 'High-Velocity All-Weather Swarm Platform',
    category: 'Aerial Robotics',
    status: 'PROTOTYPE',
    summary: 'Developing a next-generation aerodynamic drone chassis capable of maintaining stable aerial formation in coastal winds up to 16 m/s (Near Gale force) with IP65 moisture sealing.',
    hypothesis: 'Toroidal propeller geometry combined with inverted brushless motor mounts can increase aerodynamic stability and reduce acoustic signature by 35% compared to conventional multirotors.',
    technicalMilestones: [
      'Completed computational fluid dynamics (CFD) simulation of airframe',
      'Machined lightweight magnesium alloy motor mounts',
      'Wind tunnel tested prototype frame up to 15.5 m/s continuous airflow',
      'Next: Live outdoor formation test scheduled for Q4 2026'
    ],
    lastUpdate: 'August 2026'
  },
  {
    id: 'hydra-flow',
    codename: 'HYDRAFLOW',
    title: 'High-Frequency Pneumatic Water Pixel Matrix',
    category: 'Fluid Dynamics',
    status: 'IN DEVELOPMENT',
    summary: 'Building a programmable 128-nozzle linear water manifold where each water stream can be pulsed at 50Hz, forming falling water pixel graphics, glyphs, and dynamic spatial curtains.',
    hypothesis: 'Direct-action ceramic solenoid valves can achieve sub-8 millisecond response rates, allowing fluid droplet resolution sufficient to render recognizable human typography.',
    technicalMilestones: [
      'Validated 16-nozzle benchtop test rig',
      'Formulated pressure equalization chamber to maintain constant laminar pressure',
      'Developed custom ArtNet-to-Solenoid driver electronics',
      'Next: Fabrication of full 12-meter commercial manifold'
    ],
    lastUpdate: 'September 2026'
  },
  {
    id: 'spatial-mesh',
    codename: 'SPATIALMESH',
    title: 'Continuous LiDAR Crowd & Geometry Tracking',
    category: 'Spatial Computing',
    status: 'RESEARCH',
    summary: 'An experimental sensor mesh networking solid-state LiDAR sensors to produce real-time 3D spatial point clouds of audience venues for reactive lighting and safety perimeters.',
    hypothesis: 'Fusing solid-state LiDAR point clouds on edge GPU devices enables zero-latency human boundary detection without storing identifiable camera imagery, preserving privacy while enabling interactive light.',
    technicalMilestones: [
      'Edge point-cloud clustering algorithm operating at 45fps on Nvidia Jetson',
      'Occupancy grid mapping verified across a 50x50m indoor test space',
      'Next: Integration with DMX lighting fixtures for real-time shadow casting'
    ],
    lastUpdate: 'July 2026'
  },
  {
    id: 'aether-light',
    codename: 'AETHERLIGHT',
    title: 'Micro-Holographic Volumetric Particle Display',
    category: 'Volumetric Optics',
    status: 'EXPERIMENTAL',
    summary: 'Exploring optical persistence-of-vision volumetric arrays that create three-dimensional light structures in physical air without head-mounted displays or glasses.',
    hypothesis: 'High-speed synchronized laser beam deflection through engineered microscopic aerosol density fields can produce visible floating 3D voxels visible from 360 degrees.',
    technicalMilestones: [
      'Small-scale vacuum chamber test validated voxel visibility',
      'Currently testing ultrasonic mist stabilization at ambient atmospheric pressure',
      'Next: Multi-color laser vector calibration'
    ],
    lastUpdate: 'September 2026'
  },
  {
    id: 'decentralized-swarm',
    codename: 'SWARM-ZERO',
    title: 'Autonomous Decentralized Swarm Collision Avoidance',
    category: 'Swarm Autonomy',
    status: 'RESEARCH',
    summary: 'Researching peer-to-peer optical time-of-flight inter-drone communication to allow swarms to avoid mid-air obstacles dynamically without relying on central server calculation.',
    hypothesis: 'Boid-algorithm behavioral heuristics running on local microcontrollers can guarantee collision-free dynamic trajectory adaptation in dense 3D aerial clusters.',
    technicalMilestones: [
      'Simulated 1,000 agents in custom physics environment with 0 collision occurrences',
      'Bench-tested UWB distance ranging between 4 micro-controllers at 100Hz',
      'Next: 10-drone physical test flight'
    ],
    lastUpdate: 'June 2026'
  }
];
