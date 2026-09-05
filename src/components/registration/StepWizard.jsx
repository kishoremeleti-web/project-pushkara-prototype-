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
  Accessibility,
  CheckCircle2,
  Hourglass,
  ShieldCheck,
  ExternalLink
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
    approveToken,
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
    fileName: 'Aadhaar_Document_Proof.pdf',
    fileDataUrl: null,
    fileSize: null,
    fileType: null
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

  const submitApplication = () => {
    if (validateStep4()) {
      // Issue Token in Pending Status
      const issued = issueToken(formData);
      setGeneratedTokenId(issued.id);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      submitApplication();
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {cat.id === 'child' && <Baby size={18} style={{ color: 'var(--gov-green-850)' }} />}
                        {cat.id === 'senior' && <HeartHandshake size={18} style={{ color: 'var(--gov-green-850)' }} />}
                        {cat.id === 'special' && <Accessibility size={18} style={{ color: 'var(--gov-green-850)' }} />}
                        {cat.title}
                      </span>
                      {formData.category === cat.id && (
                        <CheckCircle2 size={18} style={{ color: 'var(--gov-green-800)' }} />
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
              <DocVerification
                formData={formData}
                isVerified={isDocVerified}
                setIsVerified={setIsDocVerified}
                onDirectSubmit={submitApplication}
                onVerificationComplete={(data) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    docType: data.docType,
                    fileName: data.fileName || `${data.docType?.split(' – ')[0] || 'Demo_Document'}_Uploaded.pdf`,
                    fileDataUrl: data.fileDataUrl || null,
                    fileSize: data.fileSize || null,
                    fileType: data.fileType || null
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
                  {generatedToken.status === 'Verified' ? 'Verification Approved' : generatedToken.status === 'Declined' ? 'Application Declined' : 'Status: Pending Officer Review'}
                </span>
                <h2 className="section-title">
                  {generatedToken.status === 'Verified' 
                    ? 'Official Priority Entry Pass Approved' 
                    : generatedToken.status === 'Declined'
                      ? 'Application Declined by Verification Officer'
                      : 'Application Submitted — Awaiting Officer Acceptance'}
                </h2>
                <p className="section-desc">
                  {generatedToken.status === 'Verified'
                    ? 'Your pass is verified and QR code is ready. Present this pass at the priority lane entrance.'
                    : generatedToken.status === 'Declined'
                      ? 'The verification officer declined this application based on the submitted proof.'
                      : 'Your application has been received and is waiting in the Admin Command Desk for Officer Acceptance. As soon as the officer approves, your QR code will activate here.'}
                </p>
              </div>

              {/* Demo Helper Actions Bar for Testing */}
              {generatedToken.status === 'Pending' && (
                <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem', backgroundColor: '#FEF9C3', border: '1px solid #FEF08A', borderRadius: 'var(--radius-lg)', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#854D0E', fontSize: '0.825rem', fontWeight: '600' }}>
                    <Hourglass size={16} />
                    <span>Officer Action Required: Token <strong>{generatedToken.tokenNumber}</strong> is pending review</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.775rem' }}
                      onClick={() => approveToken(generatedToken.id)}
                      id="quick-demo-approve-btn"
                    >
                      <CheckCircle2 size={13} />
                      <span>Quick Officer Approve (Demo)</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        setActiveTab('admin');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Admin Desk</span>
                    </button>
                  </div>
                </div>
              )}

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
                      fileName: 'Aadhaar_Document_Proof.pdf',
                      fileDataUrl: null,
                      fileSize: null,
                      fileType: null
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
