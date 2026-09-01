import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Search, ShieldCheck, Sparkles, MapPin, Users, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { navigateToRegister, setActiveTab } = useApp();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Pill Badge */}
          <div className="hero-pill-badge">
            <Sparkles size={16} />
            <span>Godavari Pushkaralu 2026 • Priority Fast-Track</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Pushkaralu <span className="highlight">Digi Token</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Priority assistance for children, senior citizens and special pilgrims
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigateToRegister()}
              id="hero-get-token-btn"
            >
              <Ticket size={22} />
              <span>Get Digi Token</span>
              <ArrowRight size={20} />
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => { setActiveTab('tracker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              id="hero-track-token-btn"
            >
              <Search size={20} />
              <span>Track My Token</span>
            </button>
          </div>

          {/* Prototype disclaimer pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #FDE68A' }}>
            <ShieldCheck size={16} />
            <span>Prototype – Demo Only • Instant Simulated Verification</span>
          </div>
        </div>
      </div>
    </section>
  );
};
