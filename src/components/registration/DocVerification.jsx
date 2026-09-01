import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DocVerification = ({ 
  formData, 
  onVerificationComplete, 
  isVerified, 
  setIsVerified 
}) => {
  const { validateEligibility } = useApp();
  
  const [docType, setDocType] = useState(
    formData.category === 'child' ? 'Birth Certificate – Demo Verification' : 'Aadhaar – Demo Verification'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: Uploaded, 2: Age Verified, 3: Document Attached
  const [verificationError, setVerificationError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const startMockVerification = (customDocName = null) => {
    setIsScanning(true);
    setScanStep(0);
    setVerificationError(null);
    setIsVerified(false);
    const fileName = customDocName || `${docType.split(' – ')[0]}_${formData.name ? formData.name.replace(/\s+/g, '_') : 'Pilgrim'}_Proof.pdf`;
    setUploadedFileName(fileName);

    // Step 1: Upload simulated (500ms)
    setTimeout(() => {
      setScanStep(1);

      // Step 2: Age Check against rules (1000ms)
      setTimeout(() => {
        const eligibility = validateEligibility(formData.category, formData.age);
        
        if (!eligibility.valid) {
          setIsScanning(false);
          setScanStep(1);
          setVerificationError(eligibility.reason || 'You are not eligible for this priority category.');
          setIsVerified(false);
          return;
        }

        setScanStep(2);

        // Step 3: Document Attached & Ready for Admin Officer Review (1500ms)
        setTimeout(() => {
          setScanStep(3);
          setIsScanning(false);
          setIsVerified(true);
          onVerificationComplete({
            docType,
            fileName,
            verified: true,
            timestamp: new Date().toISOString()
          });
        }, 500);
      }, 600);
    }, 500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      startMockVerification(file.name);
    }
  };

  return (
    <div className="doc-verification-container">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-tag">Document Proof Submission</span>
        <h2 className="section-title">Identity & Age Document Proof</h2>
        <p className="section-desc">
          Attach your verification document. Verification completes once reviewed & accepted by the Officer in the Admin Panel.
        </p>
      </div>

      <div className="alert alert-warning">
        <ShieldCheck size={20} style={{ flexShrink: 0, color: 'var(--gov-green-900)' }} />
        <div>
          <strong>Official Privacy & Security:</strong> Do NOT upload real personal data. Use simulated or demo documents for this prototype.
        </div>
      </div>

      {/* Document Type Selection */}
      <div className="form-group">
        <label className="form-label">
          Select Document Type for Priority Verification
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            'Aadhaar – Demo Verification',
            'Birth Certificate – Demo Verification',
            formData.category === 'special' ? 'Disability Certificate – Demo Verification' : 'Senior Citizen ID – Demo Verification'
          ].map((type) => (
            <button
              key={type}
              type="button"
              className={`access-btn ${docType === type ? 'active' : ''}`}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: docType === type ? 'var(--gov-green-900)' : '#FFFFFF',
                color: docType === type ? '#FFFFFF' : 'var(--slate-800)',
                border: '1.5px solid',
                borderColor: docType === type ? 'var(--gov-green-900)' : 'var(--slate-300)',
                fontSize: '0.875rem',
                textAlign: 'left',
                fontWeight: '700'
              }}
              onClick={() => {
                setDocType(type);
                setIsVerified(false);
                setScanStep(0);
                setVerificationError(null);
              }}
            >
              <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Upload Box */}
      <div className="doc-verify-panel">
        <div className="doc-upload-box">
          <UploadCloud size={48} style={{ color: 'var(--gov-green-800)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--gov-green-950)', marginBottom: '0.35rem' }}>
            Attach Document Proof
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
            Upload demo PDF or Image proof (Demo mock verification)
          </p>

          <label 
            className="btn btn-primary"
            style={{ display: 'inline-flex', cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            <span>Browse Document File</span>
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
              disabled={isScanning}
            />
          </label>

          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '0.5rem 0' }}>— OR ATTACH DEMO SAMPLE DOCUMENT —</div>

          {/* Quick Preset Buttons */}
          <div className="quick-demo-picker">
            <button 
              type="button" 
              className="demo-doc-btn"
              onClick={() => startMockVerification(`Demo_${formData.category.toUpperCase()}_Aadhaar_Proof.pdf`)}
              disabled={isScanning}
              id="verify-demo-valid-doc-btn"
            >
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--gov-green-800)' }} />
              Attach Sample Document
            </button>
          </div>
        </div>

        {/* Verification Progress Steps */}
        {(isScanning || scanStep > 0 || verificationError) && (
          <div className="verification-status-list">
            {uploadedFileName && (
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--gov-green-950)', textAlign: 'center', marginBottom: '0.5rem' }}>
                📄 Document: {uploadedFileName}
              </div>
            )}

            {/* Step 1 */}
            <div className={`verify-step-item ${scanStep >= 1 ? 'success' : ''}`}>
              {scanStep >= 1 ? (
                <CheckCircle2 size={20} style={{ color: 'var(--gov-green-800)' }} />
              ) : isScanning ? (
                <Loader2 size={20} className="verify-spinner" />
              ) : (
                <FileCheck size={20} style={{ color: 'var(--slate-400)' }} />
              )}
              <span>✅ Document File Attached</span>
            </div>

            {/* Step 2 */}
            <div className={`verify-step-item ${scanStep >= 2 ? 'success' : verificationError ? 'failed' : ''}`}>
              {scanStep >= 2 ? (
                <CheckCircle2 size={20} style={{ color: 'var(--gov-green-800)' }} />
              ) : isScanning && scanStep === 1 ? (
                <Loader2 size={20} className="verify-spinner" />
              ) : verificationError ? (
                <XCircle size={20} style={{ color: 'var(--red-600)' }} />
              ) : (
                <FileCheck size={20} style={{ color: 'var(--slate-400)' }} />
              )}
              <span>
                {scanStep >= 2 
                  ? `✅ Age Validated (${formData.age} Years)` 
                  : verificationError 
                    ? `❌ Age Check Failed (${formData.age} Years)`
                    : 'Age Validation'}
              </span>
            </div>

            {/* Step 3 */}
            <div className={`verify-step-item ${scanStep >= 3 ? 'success' : verificationError ? 'failed' : ''}`}>
              {scanStep >= 3 ? (
                <CheckCircle2 size={20} style={{ color: 'var(--gov-green-800)' }} />
              ) : isScanning && scanStep === 2 ? (
                <Loader2 size={20} className="verify-spinner" />
              ) : verificationError ? (
                <XCircle size={20} style={{ color: 'var(--red-600)' }} />
              ) : (
                <FileCheck size={20} style={{ color: 'var(--slate-400)' }} />
              )}
              <span>
                {scanStep >= 3 
                  ? '✅ Proof Attached (Ready for Officer Acceptance in Admin)' 
                  : verificationError 
                    ? '❌ Ineligible for Priority Category' 
                    : 'Document Clearance'}
              </span>
            </div>
          </div>
        )}

        {/* Error Message if Ineligible */}
        {verificationError && (
          <div className="alert alert-danger" style={{ maxWidth: '540px', margin: '1.25rem auto 0', textAlign: 'left' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '800', marginBottom: '0.25rem' }}>
                “You are not eligible for this priority category.”
              </h4>
              <p style={{ fontSize: '0.875rem' }}>{verificationError}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: '#7F1D1D' }}>
                <strong>Rule Note:</strong> Children must be under 5 years of age. Senior citizens must be aged 70 or above. Please check the Date of Birth.
              </p>
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {isVerified && (
          <div className="alert alert-success" style={{ maxWidth: '540px', margin: '1.25rem auto 0', textAlign: 'left' }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0, color: 'var(--gov-green-800)' }} />
            <div>
              <h4 style={{ fontWeight: '800', marginBottom: '0.2rem' }}>
                Document Proof Attached Successfully!
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Document <strong>{uploadedFileName}</strong> is attached. When you submit your application, it will appear in the Admin Command Desk for Officer Acceptance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
