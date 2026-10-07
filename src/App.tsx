import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SpatialCursor } from './components/ui/SpatialCursor';

import { Home } from './pages/Home';
import { Capabilities } from './pages/Capabilities';
import { DroneShows } from './pages/DroneShows';
import { Immersive } from './pages/Immersive';
import { Technology } from './pages/Technology';
import { Labs } from './pages/Labs';
import { Work } from './pages/Work';
import { About } from './pages/About';
import { Designer } from './pages/Designer';
import { Journal } from './pages/Journal';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { BookShow } from './pages/BookShow';

const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  if (
    location.pathname === '/book' ||
    location.pathname === '/book-a-show'
  ) {
    return null;
  }
  return <Navbar />;
};

const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  if (
    location.pathname === '/' || 
    location.pathname === '/drone-shows' ||
    location.pathname === '/work' ||
    location.pathname === '/our-work' ||
    location.pathname === '/book' ||
    location.pathname === '/book-a-show'
  ) {
    return null;
  }
  return <Footer />;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <SpatialCursor />
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'var(--bg-deep)'
        }}
        className="technical-grid"
      >
        <ConditionalNavbar />
        <main style={{ flex: 1, width: '100%', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capabilities" element={<Capabilities />} />
            <Route path="/drone-shows" element={<DroneShows />} />
            <Route path="/immersive" element={<Immersive />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/work" element={<Work />} />
            <Route path="/our-work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/designer" element={<Designer />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<BookShow />} />
            <Route path="/book-a-show" element={<BookShow />} />
            <Route path="/privacy" element={<Legal />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
};

export default App;
