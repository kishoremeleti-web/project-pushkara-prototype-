import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Ticket, Shield, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const LocationsList = () => {
  const { locations, navigateToRegister } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  const zones = useMemo(() => {
    return ['All', ...Array.from(new Set(locations.map(l => l.zone)))];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loc.ghat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesZone = selectedZone === 'All' || loc.zone === selectedZone;
      return matchesSearch && matchesZone;
    });
  }, [locations, searchTerm, selectedZone]);

  const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);
  const totalIssued = locations.reduce((sum, l) => sum + l.issued, 0);

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Sanctioned Sacred Ghats</span>
          <h2 className="section-title">Godavari Pushkaralu Ghat Locations</h2>
          <p className="section-desc">
            Real-time digital pass capacity and priority lane availability across all 45 sanctioned ghat locations.
          </p>
        </div>

        {/* Overview Stat Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="metric-card">
            <div className="metric-info">
              <h4>Sanctioned Locations</h4>
              <div className="metric-value">45 Ghats</div>
            </div>
            <div className="metric-icon-box" style={{ background: 'var(--gov-green-50)', color: 'var(--gov-green-900)' }}>
              <MapPin size={24} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Total Daily Capacity</h4>
              <div className="metric-value">{totalCapacity.toLocaleString()} Passes</div>
            </div>
            <div className="metric-icon-box" style={{ background: '#EFF6FF', color: 'var(--gov-green-800)' }}>
              <Shield size={24} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Tokens Issued (Live)</h4>
              <div className="metric-value" style={{ color: 'var(--gov-green-900)' }}>{totalIssued.toLocaleString()}</div>
            </div>
            <div className="metric-icon-box" style={{ background: '#ECFDF5', color: 'var(--gov-green-800)' }}>
              <Ticket size={24} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Overall Availability</h4>
              <div className="metric-value" style={{ color: '#047857' }}>{(( (totalCapacity - totalIssued) / totalCapacity ) * 100).toFixed(1)}%</div>
            </div>
            <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="table-toolbar" style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-subtle)', border: '1px solid var(--gov-green-200)' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} className="location-search-icon" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by Ghat Name, Code (e.g. ANT, SAK, Razole)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="locations-list-search-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Filter size={16} style={{ color: 'var(--slate-500)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)' }}>Zone:</span>
            {zones.map(z => (
              <button
                key={z}
                type="button"
                className="access-btn"
                style={{
                  backgroundColor: selectedZone === z ? 'var(--gov-green-900)' : '#FFFFFF',
                  color: selectedZone === z ? '#FFFFFF' : 'var(--slate-700)',
                  borderColor: selectedZone === z ? 'var(--gov-green-900)' : 'var(--slate-300)',
                  padding: '0.35rem 0.75rem'
                }}
                onClick={() => setSelectedZone(z)}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* 45 Locations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredLocations.map(loc => {
            const remaining = loc.capacity - loc.issued;
            const percentFilled = Math.min(100, Math.round((loc.issued / loc.capacity) * 100));
            const isFull = remaining <= 0;

            return (
              <div 
                key={loc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1.5px solid var(--gov-green-200)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-normal)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="location-code-tag" style={{ fontSize: '0.85rem', padding: '0.25rem 0.6rem' }}>
                        {loc.code}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--gov-green-950)' }}>
                        {loc.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: 'var(--gov-green-50)', color: 'var(--gov-green-900)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--gov-green-200)' }}>
                      {loc.zone}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-700)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    <MapPin size={16} style={{ color: 'var(--gov-green-800)', flexShrink: 0 }} />
                    <span style={{ fontWeight: '600' }}>{loc.ghat}</span>
                  </div>

                  {/* Progress / Capacity Meter */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--slate-600)' }}>Issued: {loc.issued} / {loc.capacity}</span>
                      <span style={{ color: isFull ? '#DC2626' : 'var(--gov-green-800)' }}>
                        {isFull ? '100% Full' : `${remaining} Available`}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percentFilled}%`, 
                          backgroundColor: percentFilled > 85 ? '#DC2626' : percentFilled > 60 ? '#F59E0B' : 'var(--gov-green-800)',
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--gov-green-100)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '600' }}>
                    Entry: {loc.entryGate}
                  </span>

                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => navigateToRegister(null, loc.id)}
                    id={`book-ghat-${loc.code.toLowerCase()}`}
                  >
                    <Ticket size={15} />
                    <span>Get Token</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
