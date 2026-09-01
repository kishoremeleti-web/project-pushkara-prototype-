import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from './LocationPicker';
import { PilgrimForm } from './PilgrimForm';
import { DocVerification } from './DocVerification';
import { SlotSelector } from './SlotSelector';
import { DigiTokenCard } from '../token/DigiTokenCard';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Ticket, 
  Sparkles,
  MapPin,
  Calendar,
  Baby,
  HeartHandshake,
  Accessibility
} from 'lucide-react';

export const StepWizard = () => {
  const { 
    registrationCategory, 
    registrationLocation, 
    categories, 
    locations, 
    tokens,
    validateEligibility, 
    issueToken,
    setActiveTab
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: registrationCategory || 'senior',
    locationId: registrationLocation || 'ANT',
    name: '',
    dob: '',
    age: null,
    mobile: '',
    assistanceType: 'Wheelchair Assistance',
    slotId: 'slot-05',
    docType: 'Aadhaar – Demo Verification',
    fileName: 'Aadhaar_Document_Proof.pdf'
  });

  const [errors, setErrors] = useState({});
  const [isDocVerified, setIsDocVerified] = useState(false);
  const [generatedTokenId, setGeneratedTokenId] = useState(null);

  // Live lookup of token from state so when admin approves, it automatically updates to Verified with QR code
  const generatedToken = tokens.find(t => t.id === generatedTokenId || t.tokenNumber === generatedTokenId);

  // Sync category or location if pre-selected externally
  useEffect(() => {
    if (registrationCategory) {
      setFormData(prev => ({ ...prev, category: registrationCategory }));
    }
    if (registrationLocation) {
      setFormData(prev => ({ ...prev, locationId: registrationLocation }));
    }
  }, [registrationCategory, registrationLocation]);

  // Step 1 Validation (Category & Location)
  const validateStep1 = () => {
    if (!formData.category) {
      alert('Please select a priority category.');
      return false;
    }
    if (!formData.locationId) {
      alert('Please select a Pushkaralu ghat location.');
      return false;
    }
    return true;
  };

  // Step 2 Validation (Pilgrim Details & DOB Age check)
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.mobile || formData.mobile.length !== 10) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.dob) {
      newErrors.dob = 'Please select a date of birth.';
    } else {
      const eligibility = validateEligibility(formData.category, formData.age);
      if (!eligibility.valid) {
        newErrors.dob = eligibility.reason;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation (Time slot selection)
  const validateStep3 = () => {
    if (!formData.slotId) {
      alert('Please select an available morning time slot.');
      return false;
    }
    return true;
  };

  // Step 4 Validation (Document upload attached)
  const validateStep4 = () => {
    if (!isDocVerified) {
      alert('Please attach your verification document before proceeding.');
      return false;
    }
    return true;
  };

  // Handle Next
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      if (validateStep4()) {
        // Issue Token in Pending Status
        const issued = issueToken(formData);
        setGeneratedTokenId(issued.id);
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Handle Back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectedLoc = locations.find(l => l.id === formData.locationId);

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container container-narrow">
        <div className="wizard-container">
          {/* Progress Header */}
          {currentStep < 5 && (
            <div className="wizard-progress">
              <div 
                className="wizard-progress-bar" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              <div className={`wizard-step-node ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
                <div className="step-bubble">{currentStep > 1 ? '✓' : '1'}</div>
                <div className="step-label">Category & Ghat</div>
              </div>

              <div className={`wizard-step-node ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}`}>
                <div className="step-bubble">{currentStep > 2 ? '✓' : '2'}</div>
                <div className="step-label">Pilgrim Details</div>
              </div>

              <div className={`wizard-step-node ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}`}>
                <div className="step-bubble">{currentStep > 3 ? '✓' : '3'}</div>
                <div className="step-label">Time Slot</div>
              </div>

              <div className={`wizard-step-node ${currentStep >= 4 ? (currentStep > 4 ? 'completed' : 'active') : ''}`}>
                <div className="step-bubble">{currentStep > 4 ? '✓' : '4'}</div>
                <div className="step-label">Document Proof</div>
              </div>
            </div>
          )}

          {/* STEP 1: Category & Location Selection */}
          {currentStep === 1 && (
            <div>
              <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <span className="section-tag">Step 1 of 4</span>
                <h2 className="section-title">Select Priority Category & Ghat</h2>
                <p className="section-desc">
                  Choose the eligible pilgrim category and any of the 45 official Pushkaralu Ghats.
                </p>
              </div>

              {/* Category Selector Cards */}
              <label className="form-label" style={{ marginBottom: '0.75rem' }}>
                1. Select Priority Category <span className="req">*</span>
              </label>
              <div className="category-radio-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-radio-card ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        category: cat.id,
                        docType: cat.id === 'child' ? 'Birth Certificate – Demo Verification' : 'Aadhaar – Demo Verification'
                      }));
                      setIsDocVerified(false);
                    }}
                    id={`cat-select-${cat.id}`}
                  >
                    <div className="category-radio-title">
                      <span>{cat.id === 'child' ? '👶' : cat.id === 'senior' ? '👴' : '♿'} {cat.title}</span>
                      {formData.category === cat.id && (
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--gov-green-800)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      {cat.shortDesc}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-900)', fontWeight: '800', marginTop: '0.25rem' }}>
                      {cat.ageRule}
                    </div>
                  </div>
                ))}
              </div>

              {/* Location Picker (All 45 Locations) */}
              <label className="form-label" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                2. Select Pushkaralu Ghat Location (45 Locations) <span className="req">*</span>
              </label>
              <LocationPicker
                selectedLocationId={formData.locationId}
                onSelectLocation={(locId) => setFormData(prev => ({ ...prev, locationId: locId }))}
              />
            </div>
          )}

          {/* STEP 2: Pilgrim Details (Simple & Clean) */}
          {currentStep === 2 && (
            <div>
              <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <span className="section-tag">Step 2 of 4</span>
                <h2 className="section-title">Enter Pilgrim Details</h2>
                <p className="section-desc">
                  Category: <strong>{categories.find(c => c.id === formData.category)?.title}</strong> • Ghat: <strong>{selectedLoc?.name} ({selectedLoc?.code})</strong>
                </p>
              </div>

              <PilgrimForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
          )}

          {/* STEP 3: Morning Time Slot Selection */}
          {currentStep === 3 && (
            <div>
              <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <span className="section-tag">Step 3 of 4</span>
                <h2 className="section-title">Select Morning Time Slot</h2>
                <p className="section-desc">
                  Choose your preferred 30-minute morning slot at <strong>{selectedLoc?.name}</strong>.
                </p>
              </div>

              <SlotSelector
                selectedSlotId={formData.slotId}
                onSelectSlot={(slotId) => setFormData(prev => ({ ...prev, slotId }))}
                locationId={formData.locationId}
              />
            </div>
          )}

          {/* STEP 4: Document Proof Upload */}
          {currentStep === 4 && (
            <div>
              <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <span className="section-tag">Step 4 of 4</span>
                <h2 className="section-title">Attach Document Proof</h2>
                <p className="section-desc">
                  Attach your proof document. Once submitted, it will stay in <strong>Pending</strong> status until reviewed & accepted by the Officer in the Admin Panel.
                </p>
              </div>

              <DocVerification
                formData={formData}
                isVerified={isDocVerified}
                setIsVerified={setIsDocVerified}
                onVerificationComplete={(data) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    docType: data.docType,
                    fileName: data.fileName || `${data.docType?.split(' – ')[0] || 'Demo_Document'}_Uploaded.pdf`
                  }));
                }}
              />
            </div>
          )}

          {/* STEP 5: Generated Token Pass & Status (Pending -> Verified with QR after Admin Accept) */}
          {currentStep === 5 && generatedToken && (
            <div>
              <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <span className="section-tag">
                  {generatedToken.status === 'Verified' ? '🎉 Verification Approved' : generatedToken.status === 'Declined' ? '❌ Application Declined' : '⏳ Status: Pending Review'}
                </span>
                <h2 className="section-title">
                  {generatedToken.status === 'Verified' 
                    ? 'Official Priority Entry Pass Approved!' 
                    : generatedToken.status === 'Declined'
                      ? 'Application Declined by Verification Officer'
                      : 'Application Submitted — Awaiting Officer Acceptance'}
                </h2>
                <p className="section-desc">
                  {generatedToken.status === 'Verified'
                    ? 'Your pass is verified and QR code is ready. Show this at the priority lane entrance.'
                    : generatedToken.status === 'Declined'
                      ? 'The verification officer declined this application based on the submitted proof.'
                      : 'Your token is currently PENDING. Your active QR Code will automatically appear here once accepted in the Admin Command Panel.'}
                </p>
              </div>

              <DigiTokenCard token={generatedToken} isNew={true} />

              <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentStep(1);
                    setFormData({
                      category: 'senior',
                      locationId: 'ANT',
                      name: '',
                      dob: '',
                      age: null,
                      mobile: '',
                      assistanceType: 'Wheelchair Assistance',
                      slotId: 'slot-05',
                      docType: 'Aadhaar – Demo Verification',
                      fileName: 'Aadhaar_Document_Proof.pdf'
                    });
                    setIsDocVerified(false);
                    setGeneratedTokenId(null);
                  }}
                >
                  <span>Submit Another Priority Token</span>
                </button>

                <button 
                  className="btn btn-dark"
                  onClick={() => {
                    setActiveTab('tracker');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Track Status Timeline</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Back / Next) */}
          {currentStep < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid var(--slate-200)', paddingTop: '1.5rem' }}>
              {currentStep > 1 ? (
                <button 
                  className="btn btn-secondary"
                  onClick={handleBack}
                  id="wizard-back-btn"
                >
                  <ArrowLeft size={18} />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <button 
                className="btn btn-primary"
                onClick={handleNext}
                id="wizard-next-btn"
              >
                <span>{currentStep === 4 ? 'Submit Priority Pass Application' : 'Proceed to Next Step'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
