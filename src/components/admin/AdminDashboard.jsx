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
  UserCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles,
  Users
} from 'lucide-react';

export const AdminDashboard = () => {
  const { tokens, setIsAdminLoggedIn, setActiveTab, activeAdminRole } = useApp();
  const [adminPanel, setAdminPanel] = useState('approvals'); // 'approvals' | 'scanner' | 'locations'

  // Quick stats
  const pendingCount = tokens.filter(t => t.status === 'Pending').length;

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
                👤 Authenticated: {activeAdminRole || 'Officer'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
