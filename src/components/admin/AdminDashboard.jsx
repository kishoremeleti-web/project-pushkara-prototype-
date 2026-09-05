import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentApprovals } from './DocumentApprovals';
import { GateScanner } from './GateScanner';
import { LocationStats } from './LocationStats';
import { TokenTable } from './TokenTable';
import { ReportsView } from './ReportsView';
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
  Users,
  ListOrdered,
  BarChart3,
  Cloud
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    tokens, 
    setIsAdminLoggedIn, 
    setActiveTab, 
    activeAdminRole,
    cloudSyncStatus,
    setShowCloudConfigModal
  } = useApp();
  const [adminPanel, setAdminPanel] = useState('approvals'); // 'approvals' | 'scanner' | 'locations' | 'registry' | 'reports'

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
              Pushkaralu Command & Management Portal
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
              style={{ 
                fontSize: '0.85rem', 
                padding: '0.5rem 0.9rem', 
                borderColor: cloudSyncStatus === 'connected' ? 'var(--gov-green-400)' : '#FCD34D',
                color: cloudSyncStatus === 'connected' ? 'var(--gov-green-900)' : '#92400E',
                backgroundColor: cloudSyncStatus === 'connected' ? 'var(--gov-green-50)' : '#FFFBEB'
              }}
              onClick={() => setShowCloudConfigModal(true)}
              title="Real-Time Cloud Synchronization Settings"
              id="admin-cloud-sync-btn"
            >
              <Cloud size={15} />
              <span>{cloudSyncStatus === 'connected' ? 'Live Cloud Synced' : 'Cloud: Local Mode'}</span>
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

        {/* ADMIN PANELS NAVIGATION TABS */}
        <div className="admin-tabs-nav" style={{ borderBottom: '3px solid var(--gov-green-200)', marginBottom: '1.75rem', overflowX: 'auto', display: 'flex', flexWrap: 'nowrap' }}>
          {/* Panel 1: Document Approvals */}
          <button
            className={`admin-tab-btn ${adminPanel === 'approvals' ? 'active' : ''}`}
            onClick={() => setAdminPanel('approvals')}
            id="panel-tab-approvals"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            <FileText size={18} />
            <span>1. Document Approvals</span>
            {pendingCount > 0 && (
              <span style={{ background: '#B45309', color: '#FFFFFF', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '900' }}>
                {pendingCount}
              </span>
            )}
          </button>

          {/* Panel 2: Gate QR Scanner */}
          <button
            className={`admin-tab-btn ${adminPanel === 'scanner' ? 'active' : ''}`}
            onClick={() => setAdminPanel('scanner')}
            id="panel-tab-scanner"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            <Scan size={18} />
            <span>2. Gate Scanner</span>
          </button>

          {/* Panel 3: 45 Locations Quota */}
          <button
            className={`admin-tab-btn ${adminPanel === 'locations' ? 'active' : ''}`}
            onClick={() => setAdminPanel('locations')}
            id="panel-tab-locations"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            <MapPin size={18} />
            <span>3. 45 Ghat Capacities</span>
          </button>

          {/* Panel 4: Master Token Registry */}
          <button
            className={`admin-tab-btn ${adminPanel === 'registry' ? 'active' : ''}`}
            onClick={() => setAdminPanel('registry')}
            id="panel-tab-registry"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            <ListOrdered size={18} />
            <span>4. Master Registry</span>
          </button>

          {/* Panel 5: Analytics & Reports */}
          <button
            className={`admin-tab-btn ${adminPanel === 'reports' ? 'active' : ''}`}
            onClick={() => setAdminPanel('reports')}
            id="panel-tab-reports"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            <BarChart3 size={18} />
            <span>5. Reports & Flow</span>
          </button>
        </div>

        {/* ACTIVE PANEL RENDERING */}
        <div>
          {adminPanel === 'approvals' && <DocumentApprovals />}
          {adminPanel === 'scanner' && <GateScanner onSwitchToApprovals={() => setAdminPanel('approvals')} />}
          {adminPanel === 'locations' && <LocationStats />}
          {adminPanel === 'registry' && <TokenTable />}
          {adminPanel === 'reports' && <ReportsView />}
        </div>
      </div>
    </div>
  );
};
