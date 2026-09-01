import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentApprovals } from './DocumentApprovals';
import { GateScanner } from './GateScanner';
import { LocationStats } from './LocationStats';
import { 
  ShieldCheck, 
  FileText, 
  Scan, 
  MapPin, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles,
  Users
} from 'lucide-react';

export const AdminDashboard = () => {
  const { tokens, setIsAdminLoggedIn, setActiveTab, activeAdminRole, specialAdminCodes } = useApp();
  const [adminPanel, setAdminPanel] = useState('approvals'); // 'approvals' | 'scanner' | 'locations'
  const [showCodesCard, setShowCodesCard] = useState(false);

  // Quick stats
  const totalTokens = tokens.length;
  const pendingCount = tokens.filter(t => t.status === 'Pending').length;
  const verifiedCount = tokens.filter(t => t.status === 'Verified' || t.status === 'Used').length;
  const usedCount = tokens.filter(t => t.status === 'Used').length;
  const declinedCount = tokens.filter(t => t.status === 'Declined' || t.status === 'Cancelled').length;

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  return (
    <div className="admin-shell">
      <div className="container">
        {/* Top Command Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--gov-green-900)', fontSize: '0.825rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <ShieldCheck size={16} />
              <span>Government of Andhra Pradesh • Official Command Portal</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--gov-green-950)' }}>
              Pushkaralu 3-Panel Admin Command
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.8rem', background: 'var(--gov-green-100)', color: 'var(--gov-green-900)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '800', border: '1px solid var(--gov-green-200)' }}>
                Active Role: {activeAdminRole || 'Super Administrator'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
              onClick={() => setShowCodesCard(!showCodesCard)}
              id="admin-view-codes-btn"
            >
              <KeyRound size={15} style={{ color: 'var(--gov-green-900)' }} />
              <span>{showCodesCard ? 'Hide Admin Codes' : 'Special Admin Codes'}</span>
            </button>

            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', color: '#DC2626', borderColor: '#FCA5A5' }}
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* SPECIAL ADMIN CODES DRAWER */}
        {showCodesCard && (
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--gov-green-800)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-green-900)', fontWeight: '800', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              <KeyRound size={18} />
              <span>Special Government Admin Access Codes</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {specialAdminCodes.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--gov-green-25)', border: '1px solid var(--gov-green-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--gov-green-900)', textTransform: 'uppercase' }}>
                    {item.badge}
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--gov-green-950)' }}>{item.role}</strong>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', background: '#FFFFFF', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                    <div><strong>Code:</strong> <code>{item.code}</code></div>
                    <div><strong>Passcode:</strong> <code>{item.passcode}</code></div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.4rem' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 ADMIN PANELS NAVIGATION TABS */}
        <div className="admin-tabs-nav" style={{ borderBottom: '3px solid var(--gov-green-200)', marginBottom: '1.75rem' }}>
          {/* Panel 1: Document Approvals */}
          <button
            className={`admin-tab-btn ${adminPanel === 'approvals' ? 'active' : ''}`}
            onClick={() => setAdminPanel('approvals')}
            id="panel-tab-approvals"
            style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem' }}
          >
            <FileText size={20} />
            <span>1. Document Approvals & Verification Desk</span>
            {pendingCount > 0 && (
              <span style={{ background: '#B45309', color: '#FFFFFF', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '900' }}>
                {pendingCount} Pending
              </span>
            )}
          </button>

          {/* Panel 2: Gate QR Scanner */}
          <button
            className={`admin-tab-btn ${adminPanel === 'scanner' ? 'active' : ''}`}
            onClick={() => setAdminPanel('scanner')}
            id="panel-tab-scanner"
            style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem' }}
          >
            <Scan size={20} />
            <span>2. Gate QR Security Scanner</span>
          </button>

          {/* Panel 3: 45 Locations Quota */}
          <button
            className={`admin-tab-btn ${adminPanel === 'locations' ? 'active' : ''}`}
            onClick={() => setAdminPanel('locations')}
            id="panel-tab-locations"
            style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem' }}
          >
            <MapPin size={20} />
            <span>3. 45 Ghat Locations & Live Capacity</span>
          </button>
        </div>

        {/* ACTIVE PANEL RENDERING */}
        <div>
          {adminPanel === 'approvals' && <DocumentApprovals />}
          {adminPanel === 'scanner' && <GateScanner onSwitchToApprovals={() => setAdminPanel('approvals')} />}
          {adminPanel === 'locations' && <LocationStats />}
        </div>
      </div>
    </div>
  );
};
