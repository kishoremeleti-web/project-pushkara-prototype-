import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DigiTokenCard } from './DigiTokenCard';
import { 
  Search, 
  MapPin, 
  Clock, 
  DoorOpen, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const TokenTracker = () => {
  const { tokens, currentPassToken, setCurrentPassToken, findToken, navigateToRegister } = useApp();
  const [searchQuery, setSearchQuery] = useState(currentPassToken?.tokenNumber || (tokens.length > 0 ? tokens[0].tokenNumber : ''));
  const [activeToken, setActiveToken] = useState(currentPassToken || (tokens.length > 0 ? tokens[0] : null));
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Keep active token in sync when currentPassToken or tokens list updates
  useEffect(() => {
    if (currentPassToken) {
      setActiveToken(currentPassToken);
      setSearchQuery(currentPassToken.tokenNumber);
      setSearchError(null);
    } else if (!activeToken && tokens.length > 0) {
      setActiveToken(tokens[0]);
      setSearchQuery(tokens[0].tokenNumber);
    }
  }, [currentPassToken, tokens]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please enter a Token ID (e.g. ANT-042) or Mobile Number.');
      return;
    }

    const found = findToken(searchQuery);
    setHasSearched(true);
    if (found) {
      setActiveToken(found);
      setCurrentPassToken(found);
      setSearchError(null);
    } else {
      setActiveToken(null);
      setSearchError(`No token record found for "${searchQuery}". Please check your Token ID or Mobile Number.`);
    }
  };

  // Determine active step index in timeline
  const getTimelineStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 2;
      case 'verified': return 3;
      case 'used': return 5;
      case 'completed': return 5;
      case 'cancelled': return -1;
      default: return 3;
    }
  };

  const currentStep = activeToken ? getTimelineStepIndex(activeToken.status) : 0;

  const timelineSteps = [
    { num: 1, title: 'Registration', desc: 'Pilgrim & Companion details submitted successfully.' },
    { num: 2, title: 'Verification', desc: 'Simulated document and age eligibility verified.' },
    { num: 3, title: 'Token Generated', desc: 'Digital Token and QR Pass issued with time slot.' },
    { num: 4, title: 'Entry', desc: 'Special Priority Gate check-in and security scan.' },
    { num: 5, title: 'Completed', desc: 'Holy bath & darshan completed peacefully.' }
  ];

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container container-narrow">
        <div className="section-header">
          <span className="section-tag">Official Verification & Tracking</span>
          <h2 className="section-title">Pushkaralu Digi Token Status</h2>
          <p className="section-desc">
            Track real-time priority pass status, entry gate directions, and official status timeline.
          </p>
        </div>

        {/* Search Box */}
        <div className="tracker-search-box">
          <form onSubmit={handleSearch}>
            <label className="form-label" htmlFor="track-token-input">
              Search by Token ID or Mobile Number
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 240px' }}>
                <Search size={18} className="location-search-icon" />
                <input
                  id="track-token-input"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. ANT-042, RAZ-015 or 9848022334"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError(null);
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                id="search-token-btn"
              >
                <Search size={18} />
                <span>Track Status</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Search Chips */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: '700' }}>Sample Demo Passes:</span>
            {tokens.slice(0, 4).map(t => (
              <button
                key={t.id}
                type="button"
                className="demo-doc-btn"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                onClick={() => {
                  setSearchQuery(t.tokenNumber);
                  setActiveToken(t);
                  setCurrentPassToken(t);
                  setSearchError(null);
                  setHasSearched(true);
                }}
              >
                {t.tokenNumber} ({t.categoryName.split(' ')[0]})
              </button>
            ))}
          </div>

          {searchError && (
            <div className="alert alert-danger" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Token Details & Live Status View */}
        {activeToken && (
          <div>
            {/* Status Summary Banner */}
            <div 
              style={{ 
                background: activeToken.status === 'Cancelled' ? '#FEF2F2' : '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--gov-green-200)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--gov-green-100)', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--gov-green-950)' }}>
                      {activeToken.tokenNumber}
                    </span>
                    <span className={`status-badge ${
                      activeToken.status === 'Verified' ? 'status-verified' :
                      activeToken.status === 'Used' ? 'status-used' :
                      activeToken.status === 'Pending' ? 'status-pending' : 'status-cancelled'
                    }`}>
                      {activeToken.status === 'Verified' ? '🟢 Verified & Active' :
                       activeToken.status === 'Used' ? '🔵 Entry Completed' :
                       activeToken.status === 'Pending' ? '🟡 Pending Verification' : '🔴 Cancelled'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem', fontWeight: '600' }}>
                    🎫 Digital Pass Issued for <strong>{activeToken.name}</strong> ({activeToken.categoryName})
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>COMPANIONS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--gov-green-950)' }}>
                    Companion Allowed: 1
                  </div>
                </div>
              </div>

              {/* Key Highlights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--gov-green-50)', color: 'var(--gov-green-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '700' }}>📍 LOCATION</div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--gov-green-950)' }}>{activeToken.locationName}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#EFF6FF', color: 'var(--gov-green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '700' }}>⏰ TIME SLOT</div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--gov-green-950)' }}>{activeToken.timeSlot}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', color: 'var(--gov-green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DoorOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '700' }}>🚪 ENTRY GATE</div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--gov-green-950)' }}>{activeToken.entryGate}</div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--gov-green-100)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--gov-green-950)', marginBottom: '1.25rem' }}>
                  Official Priority Status Timeline
                </h4>

                <div className="status-timeline">
                  {timelineSteps.map((step) => {
                    const isCompleted = currentStep >= step.num;
                    const isActive = currentStep === step.num;

                    return (
                      <div 
                        key={step.num} 
                        className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div className="timeline-dot">
                          {isCompleted ? '✓' : step.num}
                        </div>
                        <div className="timeline-title">{step.title}</div>
                        <div className="timeline-desc">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Embedded Pass Card with QR Code */}
            <DigiTokenCard token={activeToken} />
          </div>
        )}

        {!activeToken && hasSearched && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
              Looking to register a new priority token for child or senior citizen?
            </p>
            <button className="btn btn-primary" onClick={() => navigateToRegister()}>
              <span>Register for Digi Token</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
