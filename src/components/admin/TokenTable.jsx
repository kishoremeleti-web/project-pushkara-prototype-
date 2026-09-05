import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RotateCcw, 
  MapPin, 
  Users, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { DigiTokenCard } from '../token/DigiTokenCard';

export const TokenTable = () => {
  const { tokens, locations, categories, updateTokenStatus, setCurrentPassToken, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [viewingToken, setViewingToken] = useState(null);

  // Distinct dates in dataset
  const dates = useMemo(() => {
    return ['All', '15 August 2026', '2026-08-15'];
  }, []);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchSearch = 
        t.tokenNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile?.includes(searchTerm) ||
        t.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.companionName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLocation = selectedLocation === 'All' || t.locationId === selectedLocation || t.locationCode === selectedLocation;
      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
      const matchDate = selectedDate === 'All' || t.date === selectedDate;

      return matchSearch && matchLocation && matchCategory && matchStatus && matchDate;
    });
  }, [tokens, searchTerm, selectedLocation, selectedCategory, selectedStatus, selectedDate]);

  return (
    <div>
      {/* Table Card Container */}
      <div className="data-table-card">
        {/* Toolbar & Filters */}
        <div className="table-toolbar">
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} className="location-search-icon" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by Token ID (ANT-042), Pilgrim Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="admin-token-search"
            />
          </div>

          {/* Multi-Filters */}
          <div className="table-filter-group">
            {/* Location Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              id="filter-location-select"
            >
              <option value="All">All 45 Ghats</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.code} - {loc.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="filter-category-select"
            >
              <option value="All">All Categories</option>
              <option value="child">Child Below 5</option>
              <option value="senior">Senior Citizen 70+</option>
              <option value="special">Special Assistance</option>
            </select>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              id="filter-status-select"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified (Active)</option>
              <option value="Used">Used / Checked-in</option>
              <option value="Pending">Pending Verification</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="All">All Dates</option>
              <option value="15 August 2026">15 August 2026</option>
            </select>
          </div>
        </div>

        {/* Tokens Data Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Pilgrim Name</th>
                <th>Age</th>
                <th>Category</th>
                <th>Ghat Location</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', color: '#94A3B8' }} />
                    <p style={{ fontWeight: '700' }}>No tokens matched your filter criteria.</p>
                    <p style={{ fontSize: '0.8rem' }}>Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredTokens.map(token => (
                  <tr key={token.id} id={`row-${token.tokenNumber.toLowerCase()}`}>
                    {/* Token ID */}
                    <td>
                      <span className="location-code-tag" style={{ fontSize: '0.825rem' }}>
                        {token.tokenNumber}
                      </span>
                    </td>

                    {/* Pilgrim Name & Contact */}
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>
                        {token.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Ph: {token.mobile}
                      </div>
                    </td>

                    {/* Age */}
                    <td>
                      <span style={{ fontWeight: '700', color: token.age >= 70 ? '#C2410C' : token.age < 5 ? '#2563EB' : '#059669' }}>
                        {token.age} yrs
                      </span>
                    </td>

                    {/* Category */}
                    <td>
                      <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--navy-900)' }}>
                        {token.category === 'child' ? 'Child (<5 Yrs)' : token.category === 'senior' ? 'Senior (70+ Yrs)' : 'Special Assistance'}
                      </span>
                      {token.assistanceType && (
                        <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>
                          {token.assistanceType}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td>
                      <div style={{ fontWeight: '700' }}>{token.locationName}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{token.ghatName}</div>
                    </td>

                    {/* Time Slot */}
                    <td>
                      <div style={{ fontWeight: '700', color: '#2563EB', fontSize: '0.825rem' }}>
                        {token.timeSlot}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${
                        token.status === 'Verified' ? 'status-verified' :
                        token.status === 'Used' ? 'status-used' :
                        token.status === 'Pending' ? 'status-pending' : 'status-cancelled'
                      }`}>
                        {token.status === 'Verified' ? 'Verified' :
                         token.status === 'Used' ? 'Checked-in' :
                         token.status === 'Pending' ? 'Pending' : 'Cancelled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        {/* View Pass */}
                        <button
                          type="button"
                          className="access-btn"
                          style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-800)', borderColor: 'var(--slate-300)' }}
                          onClick={() => setViewingToken(token)}
                          title="View Digital Pass & QR"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Mark Used / Gate Check-in */}
                        {token.status !== 'Used' && token.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', borderColor: '#BFDBFE' }}
                            onClick={() => {
                              updateTokenStatus(token.id, 'Used');
                            }}
                            title="Gate Officer: Mark Checked-in / Used"
                            id={`checkin-btn-${token.tokenNumber.toLowerCase()}`}
                          >
                            <CheckCircle size={14} />
                            <span>Check-in</span>
                          </button>
                        )}

                        {/* Cancel Token */}
                        {token.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' }}
                            onClick={() => {
                              if (window.confirm(`Cancel token ${token.tokenNumber}?`)) {
                                updateTokenStatus(token.id, 'Cancelled');
                              }
                            }}
                            title="Cancel Token"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        {/* Re-activate */}
                        {token.status === 'Cancelled' && (
                          <button
                            type="button"
                            className="access-btn"
                            style={{ backgroundColor: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}
                            onClick={() => updateTokenStatus(token.id, 'Verified')}
                            title="Restore Token to Verified"
                          >
                            <RotateCcw size={14} />
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

        {/* Table Footer */}
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: '#64748B' }}>
          <span>Showing <strong>{filteredTokens.length}</strong> of {tokens.length} total tokens</span>
          <span>Companion Allowed: 1 per priority pass</span>
        </div>
      </div>

      {/* Modal View for Token Pass */}
      {viewingToken && (
        <div className="modal-overlay" onClick={() => setViewingToken(null)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Priority Token Pass: {viewingToken.tokenNumber}</h3>
              <button className="modal-close-btn" onClick={() => setViewingToken(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <DigiTokenCard token={viewingToken} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
