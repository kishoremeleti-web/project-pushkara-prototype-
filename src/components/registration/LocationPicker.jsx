import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Check, AlertCircle } from 'lucide-react';

export const LocationPicker = ({ selectedLocationId, onSelectLocation }) => {
  const { locations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  // Distinct zones
  const zones = useMemo(() => {
    const allZones = Array.from(new Set(locations.map(l => l.zone)));
    return ['All', ...allZones];
  }, [locations]);

  // Filtered 45 locations
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loc.ghat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = selectedZone === 'All' || loc.zone === selectedZone;
      return matchSearch && matchZone;
    });
  }, [locations, searchTerm, selectedZone]);

  return (
    <div className="location-picker-wrapper">
      {/* Search Input */}
      <div className="location-search-box">
        <Search size={18} className="location-search-icon" />
        <input 
          type="text"
          className="form-input"
          placeholder="Search any of the 45 Ghat Locations (e.g., Antarvedi, Razole, Vadapalli)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="location-search-input"
        />
      </div>

      {/* Quick Zone Filter Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.6rem', marginBottom: '0.8rem' }}>
        {zones.map(zone => (
          <button
            key={zone}
            type="button"
            className="access-btn"
            style={{
              backgroundColor: selectedZone === zone ? '#0A192F' : '#FFFFFF',
              color: selectedZone === zone ? '#FFFFFF' : '#334155',
              borderColor: selectedZone === zone ? '#0A192F' : '#CBD5E1',
              whiteSpace: 'nowrap',
              padding: '0.3rem 0.75rem',
              fontSize: '0.8rem'
            }}
            onClick={() => setSelectedZone(zone)}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Grid of 45 Locations */}
      <div className="locations-grid-picker">
        {filteredLocations.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#64748B' }}>
            <AlertCircle size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p>No location found matching "{searchTerm}". Please select from the 45 official Pushkaralu ghats.</p>
          </div>
        ) : (
          filteredLocations.map(loc => {
            const isSelected = selectedLocationId === loc.id;
            const remaining = loc.capacity - loc.issued;
            const isFull = remaining <= 0;

            return (
              <div
                key={loc.id}
                className={`location-pick-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectLocation(loc.id)}
                id={`loc-card-${loc.code.toLowerCase()}`}
              >
                <div className="location-pick-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span className="location-code-tag">{loc.code}</span>
                    <h4>{loc.name}</h4>
                  </div>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} />
                    <span>{loc.ghat}</span>
                  </p>
                  <p style={{ fontSize: '0.725rem', color: isFull ? '#DC2626' : '#059669', fontWeight: '700', marginTop: '0.25rem' }}>
                    {isFull ? '🔴 Capacity Full' : `🟢 Available: ${remaining} / ${loc.capacity} tokens`}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isSelected && (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EA580C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
        <span>Showing {filteredLocations.length} of 45 Official Pushkaralu Ghats</span>
        <span style={{ fontWeight: '600' }}>Selected: {locations.find(l => l.id === selectedLocationId)?.name || 'None'}</span>
      </div>
    </div>
  );
};
