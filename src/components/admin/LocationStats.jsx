import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Users, Ticket, Clock, ShieldCheck, Search, ChevronRight } from 'lucide-react';

export const LocationStats = () => {
  const { locations, timeSlots, tokens } = useApp();
  const [selectedLocId, setSelectedLocId] = useState('ANT');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.ghat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats for the selected location
  const tokensForLoc = tokens.filter(t => t.locationId === selectedLoc.id && t.status !== 'Cancelled');
  const usedTokensForLoc = tokensForLoc.filter(t => t.status === 'Used').length;
  const verifiedTokensForLoc = tokensForLoc.filter(t => t.status === 'Verified').length;
  const remainingTokens = Math.max(0, selectedLoc.capacity - selectedLoc.issued);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Col: 45 Locations Selector list */}
        <div className="data-table-card" style={{ padding: '1rem' }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={16} className="location-search-icon" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
              placeholder="Search 45 Ghats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ maxHeight: '550px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {filteredLocations.map(loc => {
              const isSelected = loc.id === selectedLoc.id;
              const remaining = loc.capacity - loc.issued;

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: isSelected ? 'var(--saffron-600)' : 'var(--slate-200)',
                    backgroundColor: isSelected ? 'var(--saffron-50)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="location-code-tag" style={{ fontSize: '0.7rem' }}>{loc.code}</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)' }}>{loc.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.15rem' }}>
                      Cap: {loc.capacity} • Issued: {loc.issued}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: isSelected ? 'var(--saffron-600)' : '#94A3B8' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed Single-Location Capacity & Slot Breakdown */}
        <div className="data-table-card" style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="location-code-tag" style={{ fontSize: '0.9rem', padding: '0.3rem 0.6rem' }}>
                {selectedLoc.code}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--navy-900)' }}>
                {selectedLoc.name}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.9rem' }}>
              <MapPin size={16} style={{ color: 'var(--saffron-600)' }} />
              <span>{selectedLoc.ghat} • Zone: {selectedLoc.zone} • {selectedLoc.entryGate}</span>
            </div>
          </div>

          {/* Example Format: Capacity: 500 | Issued: 327 | Remaining: 173 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="metric-card" style={{ padding: '1rem' }}>
              <div className="metric-info">
                <h4>Total Capacity</h4>
                <div className="metric-value" style={{ fontSize: '1.6rem' }}>{selectedLoc.capacity}</div>
              </div>
            </div>

            <div className="metric-card" style={{ padding: '1rem' }}>
              <div className="metric-info">
                <h4>Issued Tokens</h4>
                <div className="metric-value" style={{ fontSize: '1.6rem', color: 'var(--saffron-600)' }}>
                  {selectedLoc.issued}
                </div>
              </div>
            </div>

            <div className="metric-card" style={{ padding: '1rem' }}>
              <div className="metric-info">
                <h4>Remaining Slots</h4>
                <div className="metric-value" style={{ fontSize: '1.6rem', color: '#059669' }}>
                  {remainingTokens}
                </div>
              </div>
            </div>

            <div className="metric-card" style={{ padding: '1rem' }}>
              <div className="metric-info">
                <h4>Gate Checked-in</h4>
                <div className="metric-value" style={{ fontSize: '1.6rem', color: '#2563EB' }}>
                  {usedTokensForLoc}
                </div>
              </div>
            </div>
          </div>

          {/* Slot Breakdown Grid (12 Slots) */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)', marginBottom: '1rem' }}>
            12 Morning Time Slots Breakdown (6:00 AM – 12:00 PM)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
            {timeSlots.map(slot => {
              const slotCapacity = Math.round(selectedLoc.capacity / timeSlots.length);
              const booked = Math.min(
                slotCapacity,
                Math.floor((selectedLoc.issued / timeSlots.length) * 0.8) +
                tokens.filter(t => t.locationId === selectedLoc.id && (t.slotId === slot.id || t.timeSlot === slot.time)).length
              );
              const available = Math.max(0, slotCapacity - booked);
              const isFull = available === 0;

              return (
                <div 
                  key={slot.id}
                  style={{
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.9rem',
                    backgroundColor: isFull ? '#FFF5F5' : '#FFFFFF'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--saffron-600)' }}>
                    {slot.period}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--navy-900)' }}>
                    {slot.time}
                  </div>
                  <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Booked: {booked}/{slotCapacity}</span>
                    <strong style={{ color: isFull ? '#DC2626' : '#059669' }}>
                      {isFull ? 'FULL' : `${available} left`}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
