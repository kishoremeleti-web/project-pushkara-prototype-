import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Calendar, Phone, HeartHandshake, AlertCircle, CheckCircle, Info, ShieldCheck, Sparkles } from 'lucide-react';

export const PilgrimForm = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors 
}) => {
  const { calculateAge, assistanceTypes } = useApp();

  const handleDobChange = (e) => {
    const newDob = e.target.value;
    const computedAge = calculateAge(newDob);
    setFormData(prev => ({
      ...prev,
      dob: newDob,
      age: computedAge
    }));

    if (errors.dob) {
      setErrors(prev => ({ ...prev, dob: null }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="pilgrim-form-section">
      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        <ShieldCheck size={20} style={{ flexShrink: 0, color: 'var(--gov-green-900)' }} />
        <div>
          <strong>Priority Gate Clearance:</strong> 1 Accompanying companion/family member is automatically authorized to enter the priority lane together on this digital pass.
        </div>
      </div>

      <div className="form-row">
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="pilgrim-name">
            Pilgrim Full Name <span className="req">*</span>
          </label>
          <input
            id="pilgrim-name"
            type="text"
            className={`form-input ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Enter pilgrim's legal full name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && (
            <div className="error-text">
              <AlertCircle size={14} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="pilgrim-mobile">
            Mobile Number (for SMS Priority Pass) <span className="req">*</span>
          </label>
          <input
            id="pilgrim-mobile"
            type="tel"
            maxLength={10}
            className={`form-input ${errors.mobile ? 'is-invalid' : ''}`}
            placeholder="10-digit mobile number (e.g. 9848022334)"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, ''))}
          />
          {errors.mobile && (
            <div className="error-text">
              <AlertCircle size={14} />
              <span>{errors.mobile}</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-row">
        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label" htmlFor="pilgrim-dob">
            Date of Birth <span className="req">*</span>
          </label>
          <input
            id="pilgrim-dob"
            type="date"
            className={`form-input ${errors.dob ? 'is-invalid' : ''}`}
            value={formData.dob || ''}
            max="2026-08-15"
            onChange={handleDobChange}
          />
          {formData.age !== null && formData.age !== undefined && (
            <div className="age-calculated-badge">
              <Calendar size={14} />
              <span>Calculated Age: {formData.age} {formData.age === 1 ? 'Year' : 'Years'}</span>
            </div>
          )}
          {errors.dob && (
            <div className="error-text">
              <AlertCircle size={14} />
              <span>{errors.dob}</span>
            </div>
          )}
        </div>

        {/* Computed Age Display */}
        <div className="form-group">
          <label className="form-label">
            Official Age Eligibility
          </label>
          <div 
            style={{ 
              padding: '0.75rem 0.95rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: formData.age !== null ? (
                (formData.category === 'child' && formData.age < 5) || 
                (formData.category === 'senior' && formData.age >= 70) || 
                formData.category === 'special'
                  ? 'var(--gov-green-50)' : 'var(--red-50)'
              ) : 'var(--slate-100)',
              border: '1px solid',
              borderColor: formData.age !== null ? (
                (formData.category === 'child' && formData.age < 5) || 
                (formData.category === 'senior' && formData.age >= 70) || 
                formData.category === 'special'
                  ? 'var(--gov-green-300)' : 'var(--red-200)'
              ) : 'var(--slate-200)',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: formData.age !== null ? (
                (formData.category === 'child' && formData.age < 5) || 
                (formData.category === 'senior' && formData.age >= 70) || 
                formData.category === 'special'
                  ? 'var(--gov-green-950)' : 'var(--red-700)'
              ) : 'var(--slate-500)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            {formData.age !== null ? (
              formData.category === 'child' ? (
                formData.age < 5 ? (
                  <>
                    <CheckCircle2 size={16} style={{ color: 'var(--gov-green-700)', flexShrink: 0 }} />
                    <span>Eligible for Child Priority Pass ({formData.age} Years &lt; 5)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} style={{ color: 'var(--red-600)', flexShrink: 0 }} />
                    <span>Ineligible: Child must be strictly under 5 years ({formData.age} Yrs)</span>
                  </>
                )
              ) : formData.category === 'senior' ? (
                formData.age >= 70 ? (
                  <>
                    <CheckCircle2 size={16} style={{ color: 'var(--gov-green-700)', flexShrink: 0 }} />
                    <span>Eligible for Senior Citizen 70+ Priority Pass ({formData.age} Years)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} style={{ color: 'var(--red-600)', flexShrink: 0 }} />
                    <span>Ineligible: Senior citizen must be 70 years or older ({formData.age} Yrs)</span>
                  </>
                )
              ) : (
                <>
                  <CheckCircle2 size={16} style={{ color: 'var(--gov-green-700)', flexShrink: 0 }} />
                  <span>Eligible: Special Assistance Track (Age: {formData.age} Years)</span>
                </>
              )
            ) : (
              <span>Select Date of Birth above to calculate age eligibility</span>
            )}
          </div>
          <p className="form-hint">Reference date: 15 August 2026 (Godavari Pushkaralu).</p>
        </div>
      </div>

      {/* Special Assistance Option Only */}
      {formData.category === 'special' && (
        <div style={{ background: 'var(--gov-green-25)', border: '1.5px solid var(--gov-green-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginTop: '1rem' }}>
          <label className="form-label" htmlFor="assistance-type" style={{ color: 'var(--gov-green-950)' }}>
            Select Required Assistance Type <span className="req">*</span>
          </label>
          <select
            id="assistance-type"
            className="form-select"
            value={formData.assistanceType || assistanceTypes[0]}
            onChange={(e) => handleChange('assistanceType', e.target.value)}
          >
            {assistanceTypes.map((type, i) => (
              <option key={i} value={type}>{type}</option>
            ))}
          </select>
          <p className="form-hint" style={{ marginTop: '0.4rem' }}>
            Barrier-free ramp access, wheelchair support, and volunteer escort will be arranged at the gate.
          </p>
        </div>
      )}
    </div>
  );
};
