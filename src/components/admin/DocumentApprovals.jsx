import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Calendar, 
  FileCheck, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { DigiTokenCard } from '../token/DigiTokenCard';

export const DocumentApprovals = () => {
  const { tokens, locations, approveToken, declineToken } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Verified' | 'Declined'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [inspectingToken, setInspectingToken] = useState(null);
  const [viewingPassToken, setViewingPassToken] = useState(null);

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchesSearch = 
        t.tokenNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile?.includes(searchTerm) ||
        t.fileName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Pending' && t.status === 'Pending') ||
        (statusFilter === 'Verified' && (t.status === 'Verified' || t.status === 'Used')) ||
        (statusFilter === 'Declined' && (t.status === 'Declined' || t.status === 'Cancelled'));

      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tokens, searchTerm, statusFilter, categoryFilter]);

  const pendingCount = tokens.filter(t => t.status === 'Pending').length;
  const verifiedCount = tokens.filter(t => t.status === 'Verified' || t.status === 'Used').length;
  const declinedCount = tokens.filter(t => t.status === 'Declined' || t.status === 'Cancelled').length;

  const handleApprove = (token) => {
    approveToken(token.id);
    if (inspectingToken && inspectingToken.id === token.id) {
      setInspectingToken(null);
    }
  };

  const handleDecline = (token) => {
    const reason = window.prompt(`Enter rejection reason for ${token.name} (${token.tokenNumber}):`, 'Age criteria not matching document proof');
    if (reason) {
      declineToken(token.id, reason);
      if (inspectingToken && inspectingToken.id === token.id) {
        setInspectingToken(null);
      }
    }
  };

  return (
    <div>
      {/* Quick Status Tabs Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div 
          className="metric-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: statusFilter === 'Pending' ? 'var(--gold-500)' : 'var(--gov-green-200)',
            backgroundColor: statusFilter === 'Pending' ? 'var(--gold-50)' : '#FFFFFF'
          }}
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
        >
          <div className="metric-info">
            <h4 style={{ color: '#92400E' }}>Pending Verification</h4>
            <div className="metric-value" style={{ color: '#B45309' }}>{pendingCount}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <FileText size={22} />
          </div>
        </div>

        <div 
          className="metric-card"
          style={{ 
            cursor: 'pointer',
            borderColor: statusFilter === 'Verified' ? 'var(--gov-green-800)' : 'var(--gov-green-200)',
            backgroundColor: statusFilter === 'Verified' ? 'var(--gov-green-50)' : '#FFFFFF'
          }}
          onClick={() => setStatusFilter(statusFilter === 'Verified' ? 'All' : 'Verified')}
        >
          <div className="metric-info">
            <h4 style={{ color: 'var(--gov-green-900)' }}>Verified & Approved</h4>
            <div className="metric-value" style={{ color: 'var(--gov-green-800)' }}>{verifiedCount}</div>
          </div>
          <div className="metric-icon-box" style={{ background: 'var(--gov-green-100)', color: 'var(--gov-green-900)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div 
          className="metric-card"
          style={{ 
            cursor: 'pointer',
            borderColor: statusFilter === 'Declined' ? '#EF4444' : 'var(--gov-green-200)',
            backgroundColor: statusFilter === 'Declined' ? '#FEF2F2' : '#FFFFFF'
          }}
          onClick={() => setStatusFilter(statusFilter === 'Declined' ? 'All' : 'Declined')}
        >
          <div className="metric-info">
            <h4 style={{ color: '#991B1B' }}>Declined / Ineligible</h4>
            <div className="metric-value" style={{ color: '#DC2626' }}>{declinedCount}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="data-table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} className="location-search-icon" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by Token ID, Pilgrim Name, Phone, Document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="doc-verify-search-input"
            />
          </div>

          <div className="table-filter-group">
            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Verification Statuses</option>
              <option value="Pending">🟡 Pending Review</option>
              <option value="Verified">🟢 Verified & Approved</option>
              <option value="Declined">🔴 Declined</option>
            </select>

            {/* Category Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="child">👶 Child Below 5</option>
              <option value="senior">👴 Senior Citizen 70+</option>
              <option value="special">♿ Special Assistance</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: '110px' }}>Token ID</th>
                <th>Pilgrim Details</th>
                <th>Category & Age</th>
                <th>Ghat & Slot</th>
                <th>Uploaded Document Proof</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', minWidth: '220px' }}>Officer Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', color: '#94A3B8' }} />
                    <p style={{ fontWeight: '700' }}>No verification records found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => (
                  <tr key={token.id} id={`row-verify-${token.tokenNumber.toLowerCase()}`}>
                    {/* Token ID (Fixed single-line badge) */}
                    <td>
                      <span className="location-code-tag">
                        {token.tokenNumber}
                      </span>
                    </td>

                    {/* Pilgrim Name */}
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--gov-green-950)' }}>
                        {token.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        📱 {token.mobile} • DOB: {token.dob}
                      </div>
                    </td>

                    {/* Category & Age */}
                    <td>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--gov-green-950)' }}>
                        {token.category === 'child' ? '👶 Child <5' : token.category === 'senior' ? '👴 Senior 70+' : '♿ Special'}
                      </span>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: token.age >= 70 ? '#B45309' : token.age < 5 ? '#2563EB' : 'var(--gov-green-800)' }}>
                        Age: {token.age} Yrs
                      </div>
                    </td>

                    {/* Ghat & Slot */}
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{token.locationName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gov-green-800)', fontWeight: '600' }}>
                        {token.timeSlot}
                      </div>
                    </td>

                    {/* Uploaded File Proof */}
                    <td>
                      <button
                        type="button"
                        onClick={() => setInspectingToken(token)}
                        className="demo-doc-btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.775rem',
                          background: 'var(--gov-green-50)',
                          borderColor: 'var(--gov-green-200)',
                          color: 'var(--gov-green-950)'
                        }}
                        title="Click to inspect uploaded document file"
                        id={`inspect-doc-btn-${token.tokenNumber.toLowerCase()}`}
                      >
                        <FileText size={14} style={{ color: 'var(--gov-green-800)' }} />
                        <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {token.fileName || `${token.docType?.split(' – ')[0]}.pdf`}
                        </span>
                        <Eye size={13} style={{ color: 'var(--gov-green-800)', marginLeft: '2px' }} />
                      </button>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${
                        token.status === 'Verified' ? 'status-verified' :
                        token.status === 'Used' ? 'status-used' :
                        token.status === 'Pending' ? 'status-pending' : 'status-cancelled'
                      }`}>
                        {token.status === 'Verified' ? '🟢 Verified' :
                         token.status === 'Used' ? '🔵 Checked-in' :
                         token.status === 'Pending' ? '🟡 Pending' : '🔴 Declined'}
                      </span>
                    </td>

                    {/* Officer Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        {/* Inspect Doc */}
                        <button
                          type="button"
                          className="access-btn"
                          style={{ backgroundColor: '#F8FAF9', color: 'var(--gov-green-950)', borderColor: 'var(--gov-green-200)' }}
                          onClick={() => setInspectingToken(token)}
                          title="Inspect Document Proof"
                        >
                          <Eye size={14} />
                          <span>Inspect</span>
                        </button>

                        {/* Approve */}
                        {token.status !== 'Verified' && token.status !== 'Used' && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: 'var(--gov-green-800)', color: '#FFFFFF', borderColor: 'var(--gov-green-800)' }}
                            onClick={() => handleApprove(token)}
                            title="Verify and Approve Token"
                            id={`approve-btn-${token.tokenNumber.toLowerCase()}`}
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Decline */}
                        {token.status !== 'Declined' && token.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5' }}
                            onClick={() => handleDecline(token)}
                            title="Decline / Reject Application"
                            id={`decline-btn-${token.tokenNumber.toLowerCase()}`}
                          >
                            <XCircle size={14} />
                            <span>Decline</span>
                          </button>
                        )}

                        {/* View Pass QR if Verified */}
                        {(token.status === 'Verified' || token.status === 'Used') && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#E0F2FE', color: '#0369A1', borderColor: '#BAE6FD' }}
                            onClick={() => setViewingPassToken(token)}
                            title="View Verified Digi Pass"
                          >
                            <ShieldCheck size={14} />
                            <span>Pass</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT INSPECTION MODAL */}
      {inspectingToken && (
        <div className="modal-overlay" onClick={() => setInspectingToken(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} style={{ color: 'var(--gov-green-800)' }} />
                <h3>Official Document Inspection Desk</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setInspectingToken(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Document Header Meta */}
              <div style={{ backgroundColor: 'var(--gov-green-25)', border: '1.5px solid var(--gov-green-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="location-code-tag">{inspectingToken.tokenNumber}</span>
                  <span className={`status-badge ${
                    inspectingToken.status === 'Verified' ? 'status-verified' :
                    inspectingToken.status === 'Used' ? 'status-used' :
                    inspectingToken.status === 'Pending' ? 'status-pending' : 'status-cancelled'
                  }`}>
                    {inspectingToken.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--gov-green-950)' }}>
                  {inspectingToken.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <div><strong>Category:</strong> {inspectingToken.categoryName}</div>
                  <div><strong>Calculated Age:</strong> {inspectingToken.age} Years (DOB: {inspectingToken.dob})</div>
                  <div><strong>Ghat:</strong> {inspectingToken.locationName}</div>
                  <div><strong>Time Slot:</strong> {inspectingToken.timeSlot}</div>
                </div>
              </div>

              {/* SIMULATED OFFICIAL GOVERNMENT DOCUMENT PREVIEW SHEET */}
              <div 
                style={{ 
                  background: '#FFFFFF', 
                  border: '2px solid var(--gov-green-800)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.5rem', 
                  boxShadow: '0 4px 14px rgba(6, 78, 59, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Official Watermark */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%) rotate(-30deg)', 
                    fontSize: '3rem', 
                    fontWeight: '900', 
                    color: 'rgba(6, 78, 59, 0.04)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  GOVERNMENT OF AP
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gov-green-900)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.75rem' }}>
                      AP
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--gov-green-900)', textTransform: 'uppercase' }}>
                        {inspectingToken.docType || 'Identity Document'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        File: {inspectingToken.fileName || 'Document_Proof.pdf'}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', background: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ● OCR SCANNED
                  </span>
                </div>

                {/* Document Body Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'center' }}>
                  {/* Photo Avatar */}
                  <div style={{ width: '80px', height: '90px', background: 'var(--gov-green-50)', border: '1.5px solid var(--gov-green-200)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gov-green-900)' }}>
                    <User size={36} />
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '4px' }}>PHOTO ID</span>
                  </div>

                  {/* Field Details */}
                  <div style={{ fontSize: '0.85rem', color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div><strong>Legal Full Name:</strong> {inspectingToken.name}</div>
                    <div><strong>Date of Birth:</strong> {inspectingToken.dob} (Age verified: {inspectingToken.age} yrs)</div>
                    <div><strong>Security ID Number:</strong> XXXX-XXXX-{inspectingToken.mobile?.slice(-4) || '9848'}</div>
                    <div><strong>Issuing Authority:</strong> Govt Document Verification Desk (Demo Mock)</div>
                  </div>
                </div>

                {/* Eligibility Check Box */}
                <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--gov-green-25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gov-green-200)', fontSize: '0.8rem' }}>
                  <strong>Eligibility Audit: </strong>
                  {inspectingToken.category === 'child' ? (
                    inspectingToken.age < 5 ? (
                      <span style={{ color: 'var(--gov-green-900)', fontWeight: '700' }}>✅ Age {inspectingToken.age} is under 5 years threshold. Eligible for Child Pass.</span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: '700' }}>❌ Age {inspectingToken.age} is NOT under 5 years. Ineligible.</span>
                    )
                  ) : inspectingToken.category === 'senior' ? (
                    inspectingToken.age >= 70 ? (
                      <span style={{ color: 'var(--gov-green-900)', fontWeight: '700' }}>✅ Age {inspectingToken.age} meets Senior Citizen 70+ requirement. Eligible.</span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: '700' }}>❌ Age {inspectingToken.age} is below 70 years. Ineligible.</span>
                    )
                  ) : (
                    <span style={{ color: 'var(--gov-green-900)', fontWeight: '700' }}>✅ Special Assistance requested ({inspectingToken.assistanceType || 'Mobility Assistance'}).</span>
                  )}
                </div>
              </div>

              {/* Action Buttons inside Modal */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleApprove(inspectingToken)}
                  id="modal-approve-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>Verify & Approve Priority Token</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                  onClick={() => handleDecline(inspectingToken)}
                  id="modal-decline-btn"
                >
                  <XCircle size={18} />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED PASS PREVIEW MODAL */}
      {viewingPassToken && (
        <div className="modal-overlay" onClick={() => setViewingPassToken(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Priority Pass: {viewingPassToken.tokenNumber}</h3>
              <button className="modal-close-btn" onClick={() => setViewingPassToken(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <DigiTokenCard token={viewingPassToken} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
