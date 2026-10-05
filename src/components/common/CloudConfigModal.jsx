import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  CloudOff, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Key, 
  RefreshCw,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const CloudConfigModal = ({ isOpen, onClose }) => {
  const { 
    cloudSyncStatus, 
    setCustomFirebaseConfig, 
    clearCustomFirebaseConfig, 
    getActiveFirebaseConfig 
  } = useApp();

  const currentCfg = getActiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentCfg.apiKey || '');
  const [projectId, setProjectId] = useState(currentCfg.projectId || 'pushkaras-prototype');
  const [authDomain, setAuthDomain] = useState(currentCfg.authDomain || 'pushkaras-prototype.firebaseapp.com');
  const [appId, setAppId] = useState(currentCfg.appId || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentCfg.messagingSenderId || '');
  const [rawSnippet, setRawSnippet] = useState('');
  const [parseError, setParseError] = useState('');

  if (!isOpen) return null;

  // Handle pasting raw firebaseConfig code snippet
  const handlePasteSnippet = (e) => {
    const text = e.target.value;
    setRawSnippet(text);
    setParseError('');

    if (!text.trim()) return;

    try {
      // Regex parse key-value pairs from standard Firebase console snippet
      const extractVal = (key) => {
        const regex = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`, 'i');
        const match = text.match(regex);
        return match ? match[1] : '';
      };

      const extractedApiKey = extractVal('apiKey');
      const extractedProjectId = extractVal('projectId');
      const extractedAuthDomain = extractVal('authDomain');
      const extractedAppId = extractVal('appId');
      const extractedSenderId = extractVal('messagingSenderId');

      if (extractedApiKey) setApiKey(extractedApiKey);
      if (extractedProjectId) setProjectId(extractedProjectId);
      if (extractedAuthDomain) setAuthDomain(extractedAuthDomain);
      if (extractedAppId) setAppId(extractedAppId);
      if (extractedSenderId) setMessagingSenderId(extractedSenderId);
    } catch (err) {
      setParseError('Could not auto-extract values. Please fill the fields below manually.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      alert('Please enter at least the Firebase API Key and Project ID.');
      return;
    }

    const newConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: `${projectId.trim()}.firebasestorage.app`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };

    setCustomFirebaseConfig(newConfig);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset cloud settings to default?')) {
      clearCustomFirebaseConfig();
    }
  };

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '1.75rem',
          border: '1px solid var(--slate-200)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: cloudSyncStatus === 'connected' ? 'var(--gov-green-100)' : '#FEF3C7',
              color: cloudSyncStatus === 'connected' ? 'var(--gov-green-900)' : '#B45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--gov-green-950)', margin: 0 }}>
                Real-Time Cloud Sync
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0 }}>
                Firebase Firestore Multi-Device Synchronization
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="access-btn"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Status Banner */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: cloudSyncStatus === 'connected' ? 'var(--gov-green-50)' : '#FFFBEB',
          border: `1.5px solid ${cloudSyncStatus === 'connected' ? 'var(--gov-green-300)' : '#FCD34D'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          {cloudSyncStatus === 'connected' ? (
            <CheckCircle2 size={22} style={{ color: 'var(--gov-green-800)', flexShrink: 0 }} />
          ) : (
            <AlertCircle size={22} style={{ color: '#D97706', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.85rem', flex: 1 }}>
            <strong style={{ color: cloudSyncStatus === 'connected' ? 'var(--gov-green-900)' : '#92400E' }}>
              {cloudSyncStatus === 'connected' 
                ? 'Cloud Firestore Active & Connected' 
                : cloudSyncStatus === 'connecting'
                  ? 'Connecting to Firestore Cloud...'
                  : 'Currently in Local Browser Mode'}
            </strong>
            <div style={{ color: 'var(--slate-600)', fontSize: '0.77rem', marginTop: '0.15rem' }}>
              {cloudSyncStatus === 'connected' 
                ? `Tokens created on any phone or PC sync live to all screens in real time.`
                : `Tokens will only appear on this specific device until Firebase credentials are saved.`}
            </div>
          </div>
        </div>

        {/* Quick Paste Snippet Area */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.35rem' }}>
            Option 1: Paste Firebase Config Snippet
          </label>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            From Firebase Console → Project Settings → General → Web Apps
          </p>
          <textarea
            placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "pushkaras-prototype.firebaseapp.com",\n  projectId: "pushkaras-prototype",\n  ...\n};`}
            value={rawSnippet}
            onChange={handlePasteSnippet}
            style={{
              width: '100%',
              minHeight: '75px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--slate-300)',
              backgroundColor: '#F8FAFC'
            }}
          />
          {parseError && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{parseError}</div>}
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-400)', margin: '0.75rem 0' }}>
          — OR ENTER MANUALLY —
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.2rem' }}>
                API Key <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--slate-300)'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.2rem' }}>
                Project ID <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="pushkaras-prototype"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--slate-300)'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.2rem' }}>
                App ID
              </label>
              <input
                type="text"
                placeholder="1:123456789:web:abcdef"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--slate-300)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.2rem' }}>
                Messaging Sender ID
              </label>
              <input
                type="text"
                placeholder="1234567890"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--slate-300)'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)' }}>
            <button
              type="button"
              className="access-btn"
              onClick={handleResetToDefault}
              style={{ color: '#DC2626', borderColor: '#FCA5A5', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
            >
              <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Reset
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Cloud size={16} />
                <span>Save & Connect Cloud</span>
              </button>
            </div>
          </div>
        </form>

        {/* Firebase Console link */}
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          Need credentials? Open{' '}
          <a 
            href="https://console.firebase.google.com/project/pushkaras-prototype/settings/general" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--gov-green-900)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
          >
            Firebase Console
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
