import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, KeyRound, ShieldCheck, X, AlertCircle } from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    showAdminLoginModal, 
    setShowAdminLoginModal, 
    setIsAdminLoggedIn,
    setActiveAdminRole,
    setActiveTab,
    specialAdminCodes
  } = useApp();

  const [officerCode, setOfficerCode] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(null);

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoginError(null);

    const cleanCode = officerCode.trim().toUpperCase();
    const cleanPass = passcode.trim();

    const matched = specialAdminCodes.find(
      c => c.code.toUpperCase() === cleanCode && c.passcode === cleanPass
    );

    if (matched) {
      setActiveAdminRole(matched.role);
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError('Invalid Officer ID or Security Passcode. Please enter authorized credentials.');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowAdminLoginModal(false)}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--gov-green-900)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </div>
            <h3>Official Government Admin Login</h3>
          </div>
          <button 
            className="modal-close-btn"
            onClick={() => setShowAdminLoginModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Official Authorized Credentials Reference (No 1-step shortcuts) */}
          <div style={{ backgroundColor: 'var(--gov-green-25)', border: '1.5px solid var(--gov-green-200)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-green-900)', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <KeyRound size={16} />
              <span>Official Government Access Credentials:</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ background: '#FFFFFF', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                <strong>Super Admin:</strong> ID: <code>AP-ADMIN-2026</code> • Pass: <code>PUSHKARA@2026</code>
              </div>
              <div style={{ background: '#FFFFFF', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                <strong>Verification Officer:</strong> ID: <code>VERIFY-OFFICER-01</code> • Pass: <code>VERIFY@2026</code>
              </div>
              <div style={{ background: '#FFFFFF', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                <strong>Gate Security Officer:</strong> ID: <code>GATE-OFFICER-01</code> • Pass: <code>GATE@2026</code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-username">
                Officer ID / Username <span className="req">*</span>
              </label>
              <input
                id="admin-username"
                type="text"
                className="form-input"
                placeholder="Enter official ID (e.g. AP-ADMIN-2026)"
                value={officerCode}
                onChange={(e) => {
                  setOfficerCode(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">
                Security Passcode <span className="req">*</span>
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="Enter security passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                required
              />
            </div>

            {loginError && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              id="admin-submit-login-btn"
            >
              <Lock size={18} />
              <span>Verify & Access Admin Command</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
