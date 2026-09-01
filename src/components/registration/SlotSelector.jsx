import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Users, Check, AlertCircle } from 'lucide-react';

export const SlotSelector = ({ 
  selectedSlotId, 
  onSelectSlot, 
  locationId 
}) => {
  const { timeSlots, tokens, locations } = useApp();

  const selectedLoc = locations.find(l => l.id === locationId) || locations[0];

  // Calculate booked counts per slot for this location
  const getSlotAvailability = (slot) => {
    const bookedForSlot = tokens.filter(
      t => t.locationId === locationId && (t.slotId === slot.id || t.timeSlot === slot.time) && t.status !== 'Cancelled'
    ).length;

    // Pro-rate slot capacity based on location total capacity
    const slotCapacity = Math.round(selectedLoc.capacity / timeSlots.length);
    // Add some simulated background bookings based on slot index
    const pseudoBooked = Math.min(
      slotCapacity - 2,
      Math.floor((selectedLoc.issued / timeSlots.length) * 0.8) + bookedForSlot
    );

    const remaining = Math.max(0, slotCapacity - pseudoBooked);
    const isFull = remaining <= 0;

    return {
      capacity: slotCapacity,
      booked: pseudoBooked,
      remaining,
      isFull
    };
  };

  return (
    <div className="slot-selector-section">
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <span className="section-tag">Morning Timings (Pushkaralu Darshan)</span>
        <h2 className="section-title">Select Entry Time Slot</h2>
        <p className="section-desc">
          For Ghat: <strong>{selectedLoc.name} ({selectedLoc.ghat})</strong> on <strong>15 August 2026</strong>
        </p>
      </div>

      <div className="slots-grid">
        {timeSlots.map((slot) => {
          const { capacity, remaining, isFull } = getSlotAvailability(slot);
          const isSelected = selectedSlotId === slot.id;

          return (
            <div
              key={slot.id}
              className={`slot-card ${isSelected ? 'selected' : ''} ${isFull ? 'disabled' : ''}`}
              onClick={() => {
                if (!isFull) onSelectSlot(slot.id);
              }}
              id={`slot-card-${slot.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.4rem', color: 'var(--saffron-600)' }}>
                <Clock size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>{slot.period}</span>
              </div>

              <div className="slot-time">{slot.time}</div>

              <div className="slot-availability">
                {isFull ? (
                  <span style={{ color: '#DC2626', fontWeight: '800' }}>❌ Slot Full</span>
                ) : (
                  <span>🟢 {remaining} slots left</span>
                )}
              </div>

              {isSelected && (
                <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--saffron-600)', fontSize: '0.75rem', fontWeight: '800' }}>
                  <Check size={14} /> Selected Slot
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#F1F5F9', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertCircle size={16} style={{ flexShrink: 0, color: 'var(--saffron-600)' }} />
        <span>Please arrive 15 minutes before your allotted time slot at the Special Priority Gate.</span>
      </div>
    </div>
  );
};
