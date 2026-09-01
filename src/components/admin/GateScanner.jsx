import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Scan, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Clock, 
  DoorOpen,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const GateScanner = ({ onSwitchToApprovals }) => {
  const { tokens, findToken, updateTokenStatus, approveToken } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scannedToken, setScannedToken] = useState(null);
  const [scanResultMsg, setScanResultMsg] = useState(null);
  const [isScanningSim, setIsScanningSim] = useState(false);

  const handleScanSubmit = (tokenToScan = null) => {
    const query = tokenToScan || scanInput;
    if (!query.trim()) return;

    setIsScanningSim(true);
    setScanResultMsg(null);

    setTimeout(() => {
      setIsScanningSim(false);
      const token = findToken(query);
      if (token) {
        setScannedToken(token);
        if (token.status === 'Verified' || token.status === 'Used') {
          setScanResultMsg({
            type: 'success',
            text: `Pass ${token.tokenNumber} Verified! Pilgrim ${token.name} is authorized for Priority Gate Entry.`
          });
        } else if (token.status === 'Pending') {
          setScanResultMsg({
            type: 'warning',
            text: `⚠️ Entry Blocked: Token ${token.tokenNumber} is PENDING document verification approval. Please approve document first.`
          });
        } else {
          setScanResultMsg({
            type: 'error',
            text: `⛔ Entry Denied: Token ${token.tokenNumber} has been DECLINED / Cancelled.`
          });
        }
      } else {
        setScannedToken(null);
        setScanResultMsg({
          type: 'error',
          text: `Invalid or Unknown Token "${query}". Please check with Helpdesk.`
        });
      }
    }, 500);
  };

  const handleGrantEntry = () => {
    if (scannedToken && scannedToken.status === 'Verified') {
      updateTokenStatus(scannedToken.id, 'Used');
      setScannedToken(prev => ({ ...prev, status: 'Used' }));
      setScanResultMsg({
        type: 'success',
        text: `Entry Granted! Pilgrim ${scannedToken.name} & 1 Companion checked in at ${scannedToken.entryGate}.`
      });
    }
  };

  const handleQuickApproveAndScan = () => {
    if (scannedToken) {
      approveToken(scannedToken.id);
      setScannedToken(prev => ({ ...prev, status: 'Verified', docVerified: true }));
      setScanResultMsg({
        type: 'success',
        text: `Document Verified & Approved! Pass ${scannedToken.tokenNumber} is now cleared for gate entry.`
      });
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="gate-scanner-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gov-green-900)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scan size={20} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--gov-green-950)' }}>
            Ghat Priority Gate Security Scanner
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Official optical barcode / QR reader for gate security officers.
        </p>

        {/* Viewfinder Animation */}
        <div className="scanner-viewfinder">
          <div className="scanner-laser-line" />
          <QrCode size={130} style={{ color: '#FFFFFF', opacity: 0.85 }} />
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Scan QR or Enter Token ID (e.g. ANT-042, MUK-007, RAZ-015)..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleScanSubmit(); }}
            id="gate-scanner-input"
          />
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => handleScanSubmit()}
            disabled={isScanningSim}
            id="gate-simulate-scan-btn"
          >
            <Scan size={18} />
            <span>{isScanningSim ? 'Scanning...' : 'Scan'}</span>
          </button>
        </div>

        {/* Quick Demo Scan Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', alignSelf: 'center' }}>Quick Test:</span>
          {tokens.slice(0, 4).map(t => (
            <button
              key={t.id}
              type="button"
              className="demo-doc-btn"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => {
                setScanInput(t.tokenNumber);
                handleScanSubmit(t.tokenNumber);
              }}
            >
              Scan {t.tokenNumber} ({t.status})
            </button>
          ))}
        </div>

        {/* Scan Result Feedback */}
        {scanResultMsg && (
          <div 
            className={`alert ${
              scanResultMsg.type === 'success' ? 'alert-success' :
              scanResultMsg.type === 'warning' ? 'alert-warning' : 'alert-danger'
            }`} 
            style={{ textAlign: 'left' }}
          >
            {scanResultMsg.type === 'success' && <CheckCircle2 size={20} style={{ color: 'var(--gov-green-800)', flexShrink: 0 }} />}
            {scanResultMsg.type === 'warning' && <AlertTriangle size={20} style={{ color: '#B45309', flexShrink: 0 }} />}
            {scanResultMsg.type === 'error' && <XCircle size={20} style={{ color: '#DC2626', flexShrink: 0 }} />}
            <span>{scanResultMsg.text}</span>
          </div>
        )}

        {/* CASE 1: VERIFIED TOKEN (PASSED SCAN) */}
        {scannedToken && (scannedToken.status === 'Verified' || scannedToken.status === 'Used') && (
          <div style={{ backgroundColor: 'var(--gov-green-25)', border: '2px solid var(--gov-green-600)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="location-code-tag">{scannedToken.tokenNumber}</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--gov-green-950)' }}>
                  {scannedToken.name} (Age: {scannedToken.age} yrs)
                </strong>
              </div>
              <span className={`status-badge ${scannedToken.status === 'Used' ? 'status-used' : 'status-verified'}`}>
                {scannedToken.status === 'Used' ? '🔵 Checked-in' : '🟢 Verified & Ready'}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div><strong>Category:</strong> {scannedToken.categoryName}</div>
              <div><strong>Location:</strong> {scannedToken.locationName}</div>
              <div><strong>Time Slot:</strong> {scannedToken.timeSlot}</div>
              <div><strong>Gate:</strong> {scannedToken.entryGate}</div>
            </div>

            {/* Companion Clearance */}
            <div style={{ backgroundColor: '#E6F7F0', border: '1px solid var(--gov-green-200)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--gov-green-950)', fontWeight: '700', marginBottom: '1rem' }}>
              👥 Companion Clearance: 1 Accompanying escort authorized to enter priority lane with pilgrim.
            </div>

            {scannedToken.status !== 'Used' ? (
              <button 
                type="button" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                onClick={handleGrantEntry}
                id="grant-gate-entry-btn"
              >
                <CheckCircle2 size={18} />
                <span>Grant Entry & Check-In (Pilgrim + 1 Companion)</span>
              </button>
            ) : (
              <div style={{ textAlign: 'center', color: '#1E40AF', fontWeight: '800', fontSize: '0.95rem', padding: '0.5rem', background: '#DBEAFE', borderRadius: 'var(--radius-md)' }}>
                ✓ Pilgrim & Companion have already Checked In at the Gate
              </div>
            )}
          </div>
        )}

        {/* CASE 2: PENDING TOKEN (BLOCKED UNTIL VERIFIED) */}
        {scannedToken && scannedToken.status === 'Pending' && (
          <div style={{ backgroundColor: '#FFFBEB', border: '2px solid #F59E0B', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="location-code-tag">{scannedToken.tokenNumber}</span>
                <strong style={{ fontSize: '1.1rem', color: '#92400E' }}>
                  {scannedToken.name} (Age: {scannedToken.age})
                </strong>
              </div>
              <span className="status-badge status-pending">
                🟡 Pending Verification
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#92400E', marginBottom: '1rem', lineHeight: '1.5' }}>
              <strong>Document Verification Required:</strong> This token has not yet been approved by the Document Verification Officer. Gate admission is blocked until document proof ({scannedToken.fileName || scannedToken.docType}) is verified.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.7rem' }}
                onClick={handleQuickApproveAndScan}
                id="officer-override-verify-btn"
              >
                <CheckCircle2 size={16} />
                <span>Verify & Approve Document Now</span>
              </button>
              {onSwitchToApprovals && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.7rem' }}
                  onClick={onSwitchToApprovals}
                >
                  <span>Go to Approvals</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CASE 3: DECLINED TOKEN */}
        {scannedToken && (scannedToken.status === 'Declined' || scannedToken.status === 'Cancelled') && (
          <div style={{ backgroundColor: '#FEF2F2', border: '2px solid #DC2626', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="location-code-tag">{scannedToken.tokenNumber}</span>
                <strong style={{ fontSize: '1.1rem', color: '#991B1B' }}>
                  {scannedToken.name}
                </strong>
              </div>
              <span className="status-badge status-cancelled">
                🔴 Application Declined
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#991B1B', marginBottom: '0.5rem' }}>
              {scannedToken.verificationNotes || 'Document verification was declined by officer.'}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#7F1D1D', fontWeight: '700' }}>
              ⛔ Priority lane entry is NOT permitted for this token.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
