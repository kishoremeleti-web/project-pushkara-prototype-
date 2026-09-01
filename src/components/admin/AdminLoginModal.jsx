import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, X, AlertCircle } from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    showAdminLoginModal, 
    setShowAdminLoginModal, 
    setIsAdminLoggedIn,
    setActiveAdminRole,
    setActiveTab,
    validPasscodes = [
      'Pushk@26',
      'Admi#202',
      'Gate$999',
      'Auth*777',
      'Ghat!123'
    ]
  } = useApp();

  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(null);

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoginError(null);

    const cleanPass = passcode.trim();

    if (validPasscodes.includes(cleanPass)) {
      setActiveAdminRole(username.trim() || 'Officer');
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError('Invalid Passcode. Please enter a valid 8-character security passcode.');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowAdminLoginModal(false)}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
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
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="modal-username">
                Username / Officer Name
              </label>
              <input
                id="modal-username"
                type="text"
                className="form-input"
                placeholder="Enter any name (e.g. Kishore, Officer, Admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (loginError) setLoginError(null);
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="modal-password">
                Security Passcode (8 Characters) <span className="req">*</span>
              </label>
              <input
                id="modal-password"
                type="password"
                className="form-input"
                placeholder="Enter 8-character passcode"
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
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              id="modal-submit-login-btn"
            >
              <Lock size={18} />
              <span>Access Admin Command</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
