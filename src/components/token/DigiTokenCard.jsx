import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Download, 
  Share2, 
  Smartphone, 
  Printer, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  FileCheck,
  AlertCircle,
  Copy,
  Sparkles,
  Lock,
  Hourglass,
  XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigiTokenCard = ({ token, isNew = false }) => {
  const { setActiveTab } = useApp();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [phoneAdded, setPhoneAdded] = useState(false);

  const isVerified = token?.status === 'Verified' || token?.status === 'Used';
  const isPending = token?.status === 'Pending';
  const isDeclined = token?.status === 'Declined' || token?.status === 'Cancelled';

  // Trigger celebration confetti only if verified
  useEffect(() => {
    if (isNew && isVerified) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#D4AF37', '#064E3B', '#10B981']
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [isNew, isVerified]);

  // Generate real QR code on canvas if verified
  useEffect(() => {
    if (token && isVerified && canvasRef.current) {
      const qrData = JSON.stringify({
        token: token.tokenNumber || token.id,
        name: token.name,
        category: token.categoryName || token.category,
        location: token.locationName,
        date: token.date,
        slot: token.timeSlot,
        gate: token.entryGate,
        status: 'VERIFIED_OFFICIAL_PASS',
        companion: '1 Companion Allowed'
      });

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 180,
        margin: 1,
        color: {
          dark: '#03231B',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [token, isVerified]);

  if (!token) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Pushkaralu Priority Token: ${token.tokenNumber}\nPilgrim: ${token.name}\nStatus: ${token.status}\nLocation: ${token.locationName} (${token.ghatName})\nTime Slot: ${token.timeSlot}\nEntry Gate: ${token.entryGate}\nCompanion Allowed: 1`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToPhone = () => {
    setPhoneAdded(true);
    setTimeout(() => setPhoneAdded(false), 3000);
  };

  return (
    <div className="token-card-wrapper">
      {/* Newly Issued Toast */}
      {isNew && isPending && (
        <div className="alert alert-warning" style={{ marginBottom: '1.5rem', textAlign: 'center', justifyContent: 'center' }}>
          <Hourglass size={20} style={{ color: '#B45309' }} />
          <strong>Application Submitted! Awaiting Verification Officer Review in Admin Portal.</strong>
        </div>
      )}

      {isNew && isVerified && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', textAlign: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={20} />
          <strong>Document Verified & Approved! Priority QR Pass is Active.</strong>
        </div>
      )}

      {/* Main Digital Pass Card */}
      <div className="token-pass-card" id="printable-token-pass">
        {/* Pass Header */}
        <div className="token-pass-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#FEF3C7', fontWeight: '800' }}>
              <Shield size={14} style={{ color: '#D4AF37' }} />
              <span>Government of Andhra Pradesh • Godavari Pushkaralu</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0.2rem 0 0', color: '#FFFFFF', letterSpacing: '0.5px' }}>
              {isVerified ? 'OFFICIAL PRIORITY ENTRY PASS' : 'PRIORITY PASS APPLICATION'}
            </h3>
          </div>

          <div className="token-security-badge" style={{ backgroundColor: isPending ? 'rgba(245, 158, 11, 0.3)' : isDeclined ? 'rgba(239, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.25)' }}>
            {isPending && <Hourglass size={14} style={{ color: '#FCD34D' }} />}
            {isVerified && <Sparkles size={14} style={{ color: '#D4AF37' }} />}
            {isDeclined && <XCircle size={14} style={{ color: '#FCA5A5' }} />}
            <span>{isPending ? 'PENDING APPROVAL' : isVerified ? 'VERIFIED' : 'DECLINED'}</span>
          </div>
        </div>

        {/* Token Number Hero Display */}
        <div className="token-number-hero">
          <div className="token-number-title">Digital Token ID</div>
          <div className="token-number-value">{token.tokenNumber}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gov-green-900)', fontWeight: '800', marginTop: '0.25rem' }}>
            ● Priority Category: {token.categoryName}
          </div>
        </div>

        {/* Real QR Code Section or Pending Lock Frame */}
        <div className="token-qr-section">
          {isVerified ? (
            <>
              <div className="qr-code-frame">
                <canvas ref={canvasRef} style={{ display: 'block' }} />
              </div>
              <p className="qr-instruction-text" style={{ color: '#047857', fontWeight: '800' }}>
                🟢 Verified Pass • Scan at Special Priority Gate with 1 Companion
              </p>
            </>
          ) : isPending ? (
            <div style={{ padding: '1.5rem', background: '#FFFBEB', borderRadius: 'var(--radius-lg)', border: '2px dashed #F59E0B', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Lock size={24} />
              </div>
              <h4 style={{ color: '#92400E', fontSize: '1rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                Verification in Progress
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#78350F', lineHeight: '1.4' }}>
                Your QR Code will activate immediately once the Verification Officer accepts your document (<code>{token.fileName || 'Proof.pdf'}</code>) in the Admin Panel.
              </p>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: 'var(--radius-lg)', border: '2px solid #EF4444', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
              <XCircle size={36} style={{ color: '#DC2626', margin: '0 auto 0.5rem' }} />
              <h4 style={{ color: '#991B1B', fontSize: '1rem', fontWeight: '800' }}>Application Declined</h4>
              <p style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '0.25rem' }}>
                {token.verificationNotes || 'Document eligibility criteria not met.'}
              </p>
            </div>
          )}
        </div>

        {/* Token Details Grid */}
        <div className="token-details-grid">
          <div className="token-detail-item">
            <span className="token-detail-label">Pilgrim Name</span>
            <span className="token-detail-val">{token.name} (Age: {token.age} yrs)</span>
          </div>

          <div className="token-detail-item">
            <span className="token-detail-label">Priority Track</span>
            <span className="token-detail-val">{token.categoryName}</span>
          </div>

          <div className="token-detail-item">
            <span className="token-detail-label">Ghat Location</span>
            <span className="token-detail-val">{token.locationName}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{token.ghatName}</span>
          </div>

          <div className="token-detail-item">
            <span className="token-detail-label">Priority Entry Gate</span>
            <span className="token-detail-val" style={{ color: 'var(--gov-green-900)' }}>{token.entryGate}</span>
          </div>

          <div className="token-detail-item">
            <span className="token-detail-label">Pushkaralu Date</span>
            <span className="token-detail-val">{token.date || '15 August 2026'}</span>
          </div>

          <div className="token-detail-item">
            <span className="token-detail-label">Allocated Morning Slot</span>
            <span className="token-detail-val" style={{ color: 'var(--gov-green-900)', fontWeight: '900' }}>{token.timeSlot}</span>
          </div>
        </div>

        {/* Security & Verification Ribbon */}
        <div className="token-companion-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Users size={16} />
            <span>Companion Policy: 1 Family Member / Escort authorized into Priority Lane</span>
          </div>
        </div>

        <div className="token-pass-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div>
              <span>Verification Status: </span>
              <strong>{isVerified ? '✅ Accepted & Verified by Officer' : isPending ? '⏳ Awaiting Officer Review' : '❌ Declined'}</strong>
            </div>
            <div>
              <span>Document: </span>
              <strong>{token.fileName || 'Aadhaar / Birth Proof.pdf'}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748B' }}>
            Prototype Demo Only • Pushkaralu Digital Token Verification System
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="token-actions">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrint}
          title="Print or Save PDF"
          id="btn-print-token"
        >
          <Printer size={18} />
          <span>Print / Save PDF</span>
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={handleCopy}
          id="btn-copy-token"
        >
          <Copy size={18} />
          <span>{copied ? 'Copied Details!' : 'Copy Token Info'}</span>
        </button>

        <button 
          className="btn btn-primary" 
          onClick={handleAddToPhone}
          id="btn-add-phone"
        >
          <Smartphone size={18} />
          <span>{phoneAdded ? 'SMS Token Sent!' : 'Send SMS Pass'}</span>
        </button>
      </div>
    </div>
  );
};
