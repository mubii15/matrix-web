export interface VerticalIntegrationStep {
  step: string;
  name: string;
  description: string;
  focusAreas: string[];
}

export const VERTICAL_INTEGRATION_PILLARS: VerticalIntegrationStep[] = [
  {
    step: '01',
    name: 'DESIGN',
    description: 'We conceive experiences from mathematical, artistic, and spatial principles rather than off-the-shelf templates. Formations, light fields, and trajectories are sculpted with sculptural precision.',
    focusAreas: ['Geometric formation theory', 'Visual narrative choreography', 'Acoustic & spatial synchronicity', 'Audience sightline calculations']
  },
  {
    step: '02',
    name: 'ENGINEER',
    description: 'We engineer our own airframe geometries, flight controllers, LED driver optics, power distribution systems, and ground transmission arrays to exceed industrial tolerances.',
    focusAreas: ['Aerodynamic rotor shielding', 'Custom low-noise propulsion', 'High-discharge thermal battery design', 'Multi-band RF antenna arrays']
  },
  {
    step: '03',
    name: 'BUILD',
    description: 'Hardware is assembled, calibrated, and stress-tested in-house. Building our own fleet platforms gives us total understanding of every solder joint, sensor, and screw.',
    focusAreas: ['Carbon-fiber composite manufacturing', 'Precision PCB surface-mount assembly', 'Optics calibration & binning', 'Environmental wind-tunnel testing']
  },
  {
    step: '04',
    name: 'PROGRAM',
    description: 'We develop our own algorithms for swarm collision avoidance, trajectory optimization, real-time wireless telemetry, and our standalone desktop choreography suite: Matrix Designer.',
    focusAreas: ['Autonomous swarm algorithms', 'B-spline kinematic smoothing', 'Matrix Designer desktop software', 'Decentralized fail-safe triggers']
  },
  {
    step: '05',
    name: 'DEPLOY',
    description: 'Operational execution is conducted by trained flight controllers, safety supervisors, and creative directors using military-grade redundant ground stations.',
    focusAreas: ['Dual-redundant mission control', 'Aviation authority compliance', 'Dynamic atmospheric telemetry', 'Rapid turn-around field logistics']
  }
];

export interface TechArchitectureItem {
  id: string;
  title: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'COMMUNICATION' | 'SAFETY';
  description: string;
  specs: string[];
}

export const TECH_ARCHITECTURE: TechArchitectureItem[] = [
  {
    id: 'airframe',
    title: 'Proprietary Show Drone Platform',
    category: 'HARDWARE',
    description: 'Engineered from ultra-lightweight carbon fiber with integrated high-efficiency brushless motors, aerodynamic prop guards, and custom ultra-bright 2000-lumen RGBW LEDs.',
    specs: ['Weight: < 480g with battery', 'Max Flight Time: 18-22 minutes', 'Wind Resistance: up to 11 m/s (Beaufort 6)', 'Lumen Output: 2,000 lm multi-die RGBW']
  },
  {
    id: 'swarm-mesh',
    title: 'Dual-Band Redundant Swarm Mesh',
    category: 'COMMUNICATION',
    description: 'Proprietary frequency-hopping wireless network providing robust telemetry exchange between ground stations and hundreds of airborne nodes simultaneously in RF-congested urban environments.',
    specs: ['Sub-20ms round-trip telemetry ping', 'Dual-frequency 868/915 MHz & 2.4 GHz', 'Automatic frequency hopping against interference', 'AES-256 encrypted control commands']
  },
  {
    id: 'rtk-navigation',
    title: 'Centimetric RTK-GNSS Navigation',
    category: 'HARDWARE',
    description: 'Multi-constellation differential satellite positioning receiving GPS, GLONASS, Galileo, and BeiDou signals, delivering real-time positioning accuracy within 1.5 centimeters.',
    specs: ['Dual-band L1/L2 RTK GNSS', 'Accuracy: < 1.5 cm horizontal, < 2.5 cm vertical', 'Heading accuracy: 0.1° with dual-antenna baseline', 'Real-time kinematic base station network']
  },
  {
    id: 'designer-engine',
    title: 'Matrix Designer Computational Core',
    category: 'SOFTWARE',
    description: 'The native offline-first desktop engine powering show design. Converts vectors, text, 3D meshes, and Blender animations directly into mathematically validated drone trajectories.',
    specs: ['Standalone desktop architecture (macOS, Windows, Linux)', 'Real-time 60fps 3D physical simulation', 'Continuous collision and proximity verification', 'Native Blender and OBJ geometry import']
  },
  {
    id: 'safety-matrix',
    title: 'Three-Tier Safety & Geofencing Matrix',
    category: 'SAFETY',
    description: 'Multi-layered automated containment parameters with deterministic return-to-home protocols, emergency motor-brake sequences, and hard hardware geofence walls.',
    specs: ['Sub-100ms hardware emergency halt', 'Multi-zone dynamic exclusion fences', 'Automated battery voltage threshold descent', 'Dual-redundant pilot override controllers']
  }
];

export const WHY_BUILD_TECH = [
  {
    title: 'Absolute Creative Freedom',
    description: 'Off-the-shelf equipment forces artists into generic flight patterns. Building our own platforms allows us to execute tighter drone separations, faster acceleration curves, and custom lighting dynamics.'
  },
  {
    title: 'Local Engineering & Repairability',
    description: 'When operating large-scale events, downtime is not an option. Having in-house engineering and modular component production ensures rapid maintenance and instant adaptability on site.'
  },
  {
    title: 'Uncompromised Safety Architecture',
    description: 'By writing our own flight control firmware and ground telemetry protocols, we maintain complete control over safety fail-safes rather than trusting black-box third-party software.'
  },
  {
    title: 'Ecosystem Longevity & Proprietary IP',
    description: 'Our proprietary hardware seamlessly interfaces with Matrix Designer and our upcoming Matrix Marketplace, providing an integrated end-to-end aerial media pipeline.'
  }
];
