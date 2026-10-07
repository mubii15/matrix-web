import React, { useState } from 'react';
import { OurWorkWheelSection, WorkProjectItem, WORK_PROJECTS } from '../components/ui/OurWorkWheelSection';
import { ProjectModal } from '../components/ui/ProjectModal';
import { PROJECTS, Project } from '../data/projects';

export const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handle project selection from 3D wheel
  const handleSelectWheelProject = (wheelItem: WorkProjectItem) => {
    // Find matching project in PROJECTS or synthesize full Project object
    const match = PROJECTS.find(p => p.title.toLowerCase().includes(wheelItem.title.toLowerCase()) || wheelItem.title.toLowerCase().includes(p.title.toLowerCase()));
    if (match) {
      setSelectedProject(match);
    } else {
      // Synthesize full project for modal
      setSelectedProject({
        id: wheelItem.id,
        title: wheelItem.title,
        category: 'Drone Shows',
        client: 'Global Host & Enterprise Partner',
        location: wheelItem.tag,
        year: '2026',
        scope: `${wheelItem.fleetCount} Synchronized Formation`,
        technologies: ['RTK DUAL-GNSS', 'VOLUMETRIC CHOREOGRAPHY', 'SMPTE TIMECODE SYNC'],
        summary: wheelItem.description,
        details: {
          brief: `Deliver an iconic turnkey spectacle utilizing ${wheelItem.fleetCount} with zero explosive fallout.`,
          concept: `3D architectural shapes and fluid morphing transitions choreographed with millimeter precision.`,
          engineering: `Engineered using Matrix Designer software with real-time trajectory simulation and dynamic wind compensation.`,
          results: `Executed with 100% safety compliance, zero aborted airframes, and broadcast-quality visual clarity.`
        },
        metrics: [
          { label: 'Fleet Count', value: wheelItem.fleetCount },
          { label: 'Precision', value: '< 1 cm RTK' },
          { label: 'Category', value: wheelItem.category },
          { label: 'Safety Index', value: '100% Certified' }
        ],
        featured: true
      });
    }
  };

  return (
    <div style={{ background: '#000000', color: '#f5f5f7', minHeight: '100vh', position: 'relative' }}>
      {/* 3D Circular Wheel Portfolio Hero Stage */}
      <OurWorkWheelSection 
        onSelectProject={handleSelectWheelProject}
        onOpenBooking={() => {
          handleSelectWheelProject(WORK_PROJECTS[0]);
        }}
      />

      {/* Interactive Case Study Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};
