import React, { useState, useRef } from 'react';
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
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

export const DocVerification = ({ 
  formData, 
  onVerificationComplete, 
  isVerified, 
  setIsVerified,
  onDirectSubmit
}) => {
  const { validateEligibility } = useApp();
  const fileInputRef = useRef(null);
  
  const [docType, setDocType] = useState(
    formData.category === 'child' ? 'Birth Certificate – Demo Verification' : 'Aadhaar – Demo Verification'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: Uploaded, 2: Age Verified, 3: Document Attached
  const [verificationError, setVerificationError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(formData.fileName || null);
  const [fileDataUrl, setFileDataUrl] = useState(formData.fileDataUrl || null);
  const [fileSize, setFileSize] = useState(formData.fileSize || null);
  const [fileType, setFileType] = useState(formData.fileType || null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to format file sizes nicely
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const startMockVerification = (docName, dataUrl = null, size = null, type = null) => {
    setIsScanning(true);
    setScanStep(0);
    setVerificationError(null);
    setIsVerified(false);
    
    const fileName = docName || `${docType.split(' – ')[0]}_${formData.name ? formData.name.replace(/\s+/g, '_') : 'Pilgrim'}_Proof.pdf`;
    setUploadedFileName(fileName);
    setFileDataUrl(dataUrl);
    setFileSize(size);
    setFileType(type);

    // Step 1: Upload simulated (350ms)
    setTimeout(() => {
      setScanStep(1);

      // Step 2: Age Check against rules (500ms)
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

        // Step 3: Document Attached & Ready for Admin Review (400ms)
        setTimeout(() => {
          setScanStep(3);
          setIsScanning(false);
          setIsVerified(true);
          onVerificationComplete({
            docType,
            fileName,
            fileDataUrl: dataUrl,
            fileSize: size ? formatFileSize(size) : '142 KB',
            fileType: type || (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
            verified: true,
            timestamp: new Date().toISOString()
          });
        }, 400);
      }, 500);
    }, 350);
  };

  const processFile = (file) => {
    if (!file) return;

    // Check size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      startMockVerification(file.name, dataUrl, file.size, file.type);
    };
    reader.onerror = () => {
      startMockVerification(file.name, null, file.size, file.type);
    };

    if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/')) {
      reader.readAsDataURL(file);
    } else {
      startMockVerification(file.name, null, file.size, file.type);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear input value so selecting the same file again triggers onChange
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setFileDataUrl(null);
    setFileSize(null);
    setFileType(null);
    setScanStep(0);
    setIsVerified(false);
    setVerificationError(null);
  };

  return (
    <div className="doc-verification-container">
      <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <span className="section-tag">Document Proof Submission</span>
        <h2 className="section-title">Identity & Age Document Proof</h2>
        <p className="section-desc">
          Attach your proof document for <strong>{formData.name || 'Pilgrim'}</strong> (Category: <strong>{formData.category === 'child' ? 'Child Below 5' : formData.category === 'senior' ? 'Senior Citizen 70+' : 'Special Assistance'}</strong>). Once submitted, it will appear live in the Admin Command Desk for Officer Approval.
        </p>
      </div>

      <div className="alert alert-warning">
        <ShieldCheck size={20} style={{ flexShrink: 0, color: 'var(--gov-green-900)' }} />
        <div>
          <strong>Official Privacy & Security:</strong> Simulated OCR and secure verification. You can upload any demo sample image/PDF proof or click the preset demo button below.
        </div>
      </div>

      {/* Document Type Selection */}
      <div className="form-group">
        <label className="form-label">
          1. Select Document Type for Priority Verification <span className="req">*</span>
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

      {/* Interactive Upload Box & Drag Drop */}
      <div className="doc-verify-panel">
        <div 
          className={`doc-upload-box ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed var(--gov-green-800)' : '2px dashed var(--gov-green-300)',
            backgroundColor: isDragging ? 'var(--gov-green-50)' : '#FFFFFF',
            transition: 'var(--transition-fast)',
            padding: '2rem 1.5rem'
          }}
        >
          <UploadCloud size={48} style={{ color: isDragging ? 'var(--gov-green-900)' : 'var(--gov-green-800)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--gov-green-950)', marginBottom: '0.35rem' }}>
            Upload or Drag & Drop Document Proof
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
            Supported formats: PDF, PNG, JPG, JPEG (Max 10MB)
          </p>

          <label 
            className="btn btn-primary"
            style={{ display: 'inline-flex', cursor: 'pointer', marginBottom: '0.75rem', padding: '0.75rem 1.5rem' }}
          >
            <span>Browse Document File</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg,.webp" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
              disabled={isScanning}
            />
          </label>

          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '0.75rem 0' }}>— OR ATTACH DEMO SAMPLE DOCUMENT —</div>

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
              Attach Sample Document (Aadhaar / Certificate)
            </button>
          </div>
        </div>

        {/* Uploaded File Visual Preview Box */}
        {uploadedFileName && (
          <div style={{ maxWidth: '540px', margin: '1rem auto', padding: '1rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--gov-green-300)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-subtle)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--gov-green-100)', color: 'var(--gov-green-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {fileType?.startsWith('image/') || fileDataUrl?.startsWith('data:image/') ? (
                    <ImageIcon size={22} />
                  ) : (
                    <FileText size={22} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--gov-green-950)', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                    {uploadedFileName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Type: {docType.split(' – ')[0]} {fileSize ? `• Size: ${typeof fileSize === 'number' ? formatFileSize(fileSize) : fileSize}` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="access-btn"
                style={{ color: '#DC2626', borderColor: '#FCA5A5', padding: '0.35rem 0.6rem' }}
                onClick={handleRemoveFile}
                title="Remove attached document"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Thumbnail Preview for Images */}
            {fileDataUrl && fileDataUrl.startsWith('data:image/') && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--slate-100)', paddingTop: '0.75rem' }}>
                <img 
                  src={fileDataUrl} 
                  alt="Document Proof Preview" 
                  style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '6px', border: '1px solid var(--slate-200)', objectFit: 'contain' }} 
                />
              </div>
            )}
          </div>
        )}

        {/* Verification Progress Steps */}
        {(isScanning || scanStep > 0 || verificationError) && (
          <div className="verification-status-list">
            {/* Step 1 */}
            <div className={`verify-step-item ${scanStep >= 1 ? 'success' : ''}`}>
              {scanStep >= 1 ? (
                <CheckCircle2 size={20} style={{ color: 'var(--gov-green-800)' }} />
              ) : isScanning ? (
                <Loader2 size={20} className="verify-spinner" />
              ) : (
                <FileCheck size={20} style={{ color: 'var(--slate-400)' }} />
              )}
              <span>Document Attached & Digitized</span>
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
                  ? `Age Validated (${formData.age !== null ? formData.age : 74} Years)` 
                  : verificationError 
                    ? `Age Check Failed (${formData.age !== null ? formData.age : 'Unknown'} Years)`
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
                  ? 'Proof Attached (Transmitted to Admin Desk for Clearance)' 
                  : verificationError 
                    ? 'Ineligible for Priority Category' 
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
                <strong>Rule Note:</strong> Children must be strictly under 5 years of age. Senior citizens must be aged 70 or above. Please check the Date of Birth on Step 2.
              </p>
            </div>
          </div>
        )}

        {/* Success Confirmation & Direct Submission Trigger */}
        {isVerified && (
          <div className="alert alert-success" style={{ maxWidth: '540px', margin: '1.25rem auto 0', textAlign: 'left' }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0, color: 'var(--gov-green-800)' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: '800', marginBottom: '0.2rem' }}>
                Document Proof Attached Successfully!
              </h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Document <strong>{uploadedFileName}</strong> is attached. When you submit, it immediately enters the Admin Desk for Officer Review.
              </p>
              {onDirectSubmit && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                  onClick={onDirectSubmit}
                  id="direct-submit-proof-btn"
                >
                  <span>Submit Priority Pass Application & Send to Admin</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
