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
  RotateCcw,
  RefreshCw,
  PlusCircle,
  Sparkles,
  Image as ImageIcon,
  Hourglass,
  Clock,
  Check
} from 'lucide-react';
import { DigiTokenCard } from '../token/DigiTokenCard';

export const DocumentApprovals = () => {
  const { tokens, locations, approveToken, declineToken, issueToken } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Verified' | 'Declined'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [inspectingToken, setInspectingToken] = useState(null);
  const [viewingPassToken, setViewingPassToken] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchesSearch = 
        t.tokenNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile?.includes(searchTerm) ||
        t.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.locationName?.toLowerCase().includes(searchTerm.toLowerCase());

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

  const showFeedbackToast = (msg, type = 'success') => {
    setActionFeedback({ msg, type });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleApprove = (token) => {
    approveToken(token.id);
    showFeedbackToast(`Priority Pass ${token.tokenNumber} for ${token.name} has been APPROVED & Verified!`);
    if (inspectingToken && inspectingToken.id === token.id) {
      setInspectingToken(null);
    }
  };

  const handleDecline = (token) => {
    const reason = window.prompt(`Enter rejection reason for ${token.name} (${token.tokenNumber}):`, 'Age criteria / Document verification did not match priority requirements');
    if (reason) {
      declineToken(token.id, reason);
      showFeedbackToast(`Pass ${token.tokenNumber} for ${token.name} was DECLINED.`, 'warning');
      if (inspectingToken && inspectingToken.id === token.id) {
        setInspectingToken(null);
      }
    }
  };

  const handleCreateSampleTest = (cat = 'senior') => {
    if (cat === 'senior') {
      const created = issueToken({
        name: 'Suryanarayana Murthy',
        dob: '1952-04-12',
        age: 74,
        mobile: '9848022334',
        category: 'senior',
        locationId: 'ANT',
        slotId: 'slot-05',
        docType: 'Aadhaar – Demo Verification',
        fileName: 'Aadhaar_Suryanarayana_1952.pdf'
      });
      showFeedbackToast(`Sample Senior Application (${created.tokenNumber}) added to queue!`);
    } else if (cat === 'child') {
      const created = issueToken({
        name: 'Master Reyansh Reddy',
        dob: '2023-06-10',
        age: 3,
        mobile: '9177233445',
        category: 'child',
        locationId: 'RAZ',
        slotId: 'slot-04',
        docType: 'Birth Certificate – Demo Verification',
        fileName: 'Birth_Certificate_Reyansh.pdf'
      });
      showFeedbackToast(`Sample Child Application (${created.tokenNumber}) added to queue!`);
    }
  };

  return (
    <div>
      {/* Toast Feedback Notification */}
      {actionFeedback && (
        <div 
          className={`alert ${actionFeedback.type === 'success' ? 'alert-success' : 'alert-warning'}`}
          style={{ marginBottom: '1.25rem', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} />
            <strong>{actionFeedback.msg}</strong>
          </div>
          <button 
            type="button" 
            onClick={() => setActionFeedback(null)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '800' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Pending Queue Alert */}
      {pendingCount > 0 && (
        <div 
          style={{ 
            backgroundColor: '#FEF3C7', 
            border: '2px solid #F59E0B', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1rem 1.25rem', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#B45309', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hourglass size={20} />
            </div>
            <div>
              <h4 style={{ color: '#92400E', fontWeight: '900', fontSize: '1.05rem', margin: 0 }}>
                {pendingCount} Priority Application{pendingCount === 1 ? '' : 's'} Awaiting Officer Document Review
              </h4>
              <p style={{ color: '#78350F', fontSize: '0.825rem', margin: '0.15rem 0 0' }}>
                Review attached identity and age proof documents below. Click "Approve" to activate pilgrim's digital QR entry pass.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ backgroundColor: '#B45309', borderColor: '#92400E', fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
              onClick={() => setStatusFilter('Pending')}
            >
              <span>Filter Pending ({pendingCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Status Tabs Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div 
          className="metric-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: statusFilter === 'Pending' ? '#F59E0B' : 'var(--gov-green-200)',
            backgroundColor: statusFilter === 'Pending' ? '#FEF3C7' : '#FFFFFF',
            borderWidth: statusFilter === 'Pending' ? '2.5px' : '1.5px',
            transform: statusFilter === 'Pending' ? 'translateY(-2px)' : 'none',
            boxShadow: statusFilter === 'Pending' ? '0 6px 16px rgba(245, 158, 11, 0.2)' : 'var(--shadow-card)'
          }}
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
        >
          <div className="metric-info">
            <h4 style={{ color: '#92400E' }}>Pending Verification</h4>
            <div className="metric-value" style={{ color: '#B45309' }}>{pendingCount}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Hourglass size={22} />
          </div>
        </div>

        <div 
          className="metric-card"
          style={{ 
            cursor: 'pointer',
            borderColor: statusFilter === 'Verified' ? 'var(--gov-green-800)' : 'var(--gov-green-200)',
            backgroundColor: statusFilter === 'Verified' ? 'var(--gov-green-50)' : '#FFFFFF',
            borderWidth: statusFilter === 'Verified' ? '2.5px' : '1.5px',
            transform: statusFilter === 'Verified' ? 'translateY(-2px)' : 'none',
            boxShadow: statusFilter === 'Verified' ? '0 6px 16px rgba(6, 78, 59, 0.2)' : 'var(--shadow-card)'
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
            backgroundColor: statusFilter === 'Declined' ? '#FEF2F2' : '#FFFFFF',
            borderWidth: statusFilter === 'Declined' ? '2.5px' : '1.5px',
            transform: statusFilter === 'Declined' ? 'translateY(-2px)' : 'none',
            boxShadow: statusFilter === 'Declined' ? '0 6px 16px rgba(239, 68, 68, 0.2)' : 'var(--shadow-card)'
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
              style={{ width: 'auto', fontSize: '0.85rem', fontWeight: '700' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses ({tokens.length})</option>
              <option value="Pending">🟡 Pending Review ({pendingCount})</option>
              <option value="Verified">🟢 Verified ({verifiedCount})</option>
              <option value="Declined">🔴 Declined ({declinedCount})</option>
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748B' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gov-green-50)', color: 'var(--gov-green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                      <FileText size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--gov-green-950)', marginBottom: '0.25rem' }}>
                      Verification Queue is Empty for this Filter
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                      When a pilgrim submits a priority registration on the public portal, their uploaded document proof will appear here live for officer review.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={() => handleCreateSampleTest('senior')}
                      >
                        <Sparkles size={16} />
                        <span>Create Sample Senior Application (Age 74)</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={() => handleCreateSampleTest('child')}
                      >
                        <Sparkles size={16} />
                        <span>Create Sample Child Application (Age 3)</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => {
                  const isPendingRow = token.status === 'Pending';

                  return (
                    <tr 
                      key={token.id} 
                      id={`row-verify-${token.tokenNumber.toLowerCase()}`}
                      style={{
                        backgroundColor: isPendingRow ? '#FFFDF5' : 'inherit'
                      }}
                    >
                      {/* Token ID (Fixed single-line badge) */}
                      <td>
                        <span className="location-code-tag">
                          {token.tokenNumber}
                        </span>
                        {isPendingRow && (
                          <div style={{ marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.65rem', background: '#F59E0B', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '900', letterSpacing: '0.5px' }}>
                              NEW
                            </span>
                          </div>
                        )}
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
                            background: token.fileDataUrl?.startsWith('data:image/') ? '#EFF6FF' : 'var(--gov-green-50)',
                            borderColor: token.fileDataUrl?.startsWith('data:image/') ? '#BFDBFE' : 'var(--gov-green-200)',
                            color: 'var(--gov-green-950)',
                            fontWeight: '700'
                          }}
                          title="Click to inspect uploaded document proof"
                          id={`inspect-doc-btn-${token.tokenNumber.toLowerCase()}`}
                        >
                          {token.fileDataUrl?.startsWith('data:image/') ? (
                            <ImageIcon size={14} style={{ color: '#2563EB' }} />
                          ) : (
                            <FileText size={14} style={{ color: 'var(--gov-green-800)' }} />
                          )}
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
                           token.status === 'Pending' ? '🟡 Pending Review' : '🔴 Declined'}
                        </span>
                      </td>

                      {/* Officer Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          {/* Inspect Doc */}
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#F8FAF9', color: 'var(--gov-green-950)', borderColor: 'var(--gov-green-200)', padding: '0.4rem 0.65rem' }}
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
                              style={{ backgroundColor: 'var(--gov-green-800)', color: '#FFFFFF', borderColor: 'var(--gov-green-800)', padding: '0.4rem 0.65rem', fontWeight: '800' }}
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
                              style={{ backgroundColor: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5', padding: '0.4rem 0.65rem' }}
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
                              style={{ backgroundColor: '#E0F2FE', color: '#0369A1', borderColor: '#BAE6FD', padding: '0.4rem 0.65rem' }}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT INSPECTION DESK MODAL */}
      {inspectingToken && (
        <div className="modal-overlay" onClick={() => setInspectingToken(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
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
                    {inspectingToken.status === 'Pending' ? '🟡 Pending Review' : inspectingToken.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--gov-green-950)' }}>
                  {inspectingToken.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <div><strong>Category:</strong> {inspectingToken.categoryName}</div>
                  <div><strong>Calculated Age:</strong> {inspectingToken.age} Years (DOB: {inspectingToken.dob})</div>
                  <div><strong>Ghat:</strong> {inspectingToken.locationName}</div>
                  <div><strong>Time Slot:</strong> {inspectingToken.timeSlot}</div>
                </div>
              </div>

              {/* REAL UPLOADED IMAGE PREVIEW OR SIMULATED GOVERNMENT DOCUMENT PREVIEW */}
              {inspectingToken.fileDataUrl && inspectingToken.fileDataUrl.startsWith('data:image/') ? (
                /* Actual Uploaded Image Display */
                <div style={{ background: '#F8FAFC', border: '2px solid var(--gov-green-700)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#475569' }}>
                    <span><strong>Uploaded Proof:</strong> {inspectingToken.fileName}</span>
                    <span style={{ color: '#059669', fontWeight: '800' }}>● ATTACHED IMAGE</span>
                  </div>
                  <div style={{ maxHeight: '280px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '0.5rem' }}>
                    <img 
                      src={inspectingToken.fileDataUrl} 
                      alt="Uploaded Document" 
                      style={{ maxHeight: '260px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              ) : (
                /* Official Government Security Verification Certificate Sheet */
                <div 
                  style={{ 
                    background: '#FFFFFF', 
                    border: '2px solid var(--gov-green-800)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '1.5rem', 
                    boxShadow: '0 4px 14px rgba(6, 78, 59, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '1.25rem'
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
                          {inspectingToken.docType || 'Identity Document Proof'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          Attached File: {inspectingToken.fileName || 'Proof.pdf'}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', background: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      ● OCR SCANNED & ATTACHED
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
                      <div><strong>Date of Birth:</strong> {inspectingToken.dob} (Age: {inspectingToken.age} yrs)</div>
                      <div><strong>Security Identifier:</strong> XXXX-XXXX-{inspectingToken.mobile?.slice(-4) || '9848'}</div>
                      <div><strong>Verification ID:</strong> {inspectingToken.verificationCode || 'VER-AP-89210'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility Audit Box */}
              <div style={{ padding: '0.85rem', background: 'var(--gov-green-25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gov-green-200)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                <strong>Eligibility Audit: </strong>
                {inspectingToken.category === 'child' ? (
                  inspectingToken.age < 5 ? (
                    <span style={{ color: 'var(--gov-green-900)', fontWeight: '700' }}>✅ Age {inspectingToken.age} is strictly under 5 years. Eligible for Child Priority Pass.</span>
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

              {/* Action Buttons inside Modal */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem' }}
                  onClick={() => handleApprove(inspectingToken)}
                  id="modal-approve-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>Verify & Approve Priority Token</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5', padding: '0.85rem 1.25rem' }}
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
