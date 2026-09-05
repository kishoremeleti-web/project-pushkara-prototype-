import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Search, ShieldCheck, MapPin, Users, ArrowRight, Clock, Award } from 'lucide-react';

export const HeroSection = () => {
  const { navigateToRegister, setActiveTab } = useApp();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Institutional Badge */}
          <div className="hero-pill-badge">
            <ShieldCheck size={15} style={{ color: 'var(--gov-green-800)' }} />
            <span>Government of Andhra Pradesh • Godavari Pushkaralu Priority Desk</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Pushkaralu <span className="highlight">Digi Token</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Official digital priority pass reservation system ensuring fast-track, dignified, and comfortable sacred bath access for Children under 5, Senior Citizens 70+, and Special Assistance pilgrims.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigateToRegister()}
              id="hero-get-token-btn"
            >
              <Ticket size={18} />
              <span>Register for Priority Pass</span>
              <ArrowRight size={18} />
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => { setActiveTab('tracker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              id="hero-track-token-btn"
            >
              <Search size={18} />
              <span>Track Existing Token</span>
            </button>
          </div>

          {/* Structured Official Stats Strip */}
          <div className="hero-stat-strip">
            <div className="hero-stat-item">
              <MapPin size={15} style={{ color: 'var(--gov-green-800)' }} />
              <span>45 Sanctioned Pushkara Ghats</span>
            </div>
            <div className="hero-stat-item">
              <Users size={15} style={{ color: 'var(--gov-green-800)' }} />
              <span>1 Companion / Caregiver Authorized</span>
            </div>
            <div className="hero-stat-item">
              <Clock size={15} style={{ color: 'var(--gov-green-800)' }} />
              <span>Dedicated 30-Min Morning Slots</span>
            </div>
            <div className="hero-stat-item">
              <Award size={15} style={{ color: 'var(--gov-green-800)' }} />
              <span>100% Free Public Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
