import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, AlertTriangle, RotateCcw, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, resetDemoData, navigateToRegister } = useApp();

  const handleReset = () => {
    if (window.confirm('Reset all demo data (tokens and capacities) back to default initial dataset?')) {
      resetDemoData();
      alert('Demo data has been reset to default state.');
    }
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: About Portal */}
          <div className="footer-col" style={{ gridColumn: 'span 1' }}>
            <h4>Pushkaralu Digi Token</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Digital priority pass management prototype for Godavari Pushkaralu. Fast-track entry for Children below 5, Senior Citizens 70+, and Special Assistance pilgrims.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.825rem', fontWeight: '600' }}>
              <Shield size={16} />
              <span>Priority Lane Assistance System</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Access</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigateToRegister()}>Get Priority Token</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('tracker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Track Digi Token Status
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('locations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  45 Godavari Ghat Locations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Eligibility & Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Priority Categories */}
          <div className="footer-col">
            <h4>Priority Categories</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigateToRegister('child')}>👶 Children Under 5 Years</button>
              </li>
              <li>
                <button onClick={() => navigateToRegister('senior')}>👴 Senior Citizens (70+ Years)</button>
              </li>
              <li>
                <button onClick={() => navigateToRegister('special')}>♿ Special & Medical Assistance</button>
              </li>
              <li>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>*1 Accompanying Companion Allowed</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Demo Disclaimer & Control */}
          <div className="footer-col">
            <h4>Prototype Disclaimer</h4>
            <div className="footer-disclaimer-card">
              <div style={{ display: 'flex', gap: '0.4rem', color: '#F59E0B', marginBottom: '0.4rem', fontWeight: '700' }}>
                <AlertTriangle size={15} />
                <span>Notice</span>
              </div>
              <p>
                <strong>“Prototype Demo – Not an official government service.”</strong>
              </p>
              <p style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
                This is a simulation platform. Do not enter real Aadhaar or confidential documents. All verifications are mock tests.
              </p>
            </div>
            
            <button 
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.8rem', color: '#DC2626', borderColor: '#DC2626' }}
            >
              <RotateCcw size={14} />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Pushkaralu Digi Token Prototype • Godavari Pushkara Ghat Priority Management System</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            Designed for high accessibility, elder ease-of-use, and fast crowd distribution across 45 sacred ghats.
          </p>
        </div>
      </div>
    </footer>
  );
};
