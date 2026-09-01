import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, PieChart, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export const ReportsView = () => {
  const { tokens, locations } = useApp();

  const total = tokens.length;
  const childTokens = tokens.filter(t => t.category === 'child').length;
  const seniorTokens = tokens.filter(t => t.category === 'senior').length;
  const specialTokens = tokens.filter(t => t.category === 'special').length;

  const verified = tokens.filter(t => t.status === 'Verified').length;
  const used = tokens.filter(t => t.status === 'Used').length;
  const pending = tokens.filter(t => t.status === 'Pending').length;
  const cancelled = tokens.filter(t => t.status === 'Cancelled').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Category Distribution */}
        <div className="data-table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Users size={20} style={{ color: 'var(--saffron-600)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)' }}>
              Pilgrim Category Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Senior */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                <span>👴 Senior Citizen 70+</span>
                <span>{seniorTokens} ({total > 0 ? Math.round((seniorTokens / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${total > 0 ? (seniorTokens / total) * 100 : 0}%`, background: 'var(--saffron-600)' }} />
              </div>
            </div>

            {/* Child */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                <span>👶 Child Below 5</span>
                <span>{childTokens} ({total > 0 ? Math.round((childTokens / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${total > 0 ? (childTokens / total) * 100 : 0}%`, background: '#2563EB' }} />
              </div>
            </div>

            {/* Special */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                <span>♿ Special Assistance</span>
                <span>{specialTokens} ({total > 0 ? Math.round((specialTokens / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${total > 0 ? (specialTokens / total) * 100 : 0}%`, background: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Status Breakdown */}
        <div className="data-table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} style={{ color: '#2563EB' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)' }}>
              Pass Lifecycle & Gate Flow
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--green-700)' }}>VERIFIED & ACTIVE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--green-700)' }}>{verified}</div>
            </div>

            <div style={{ padding: '0.85rem', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1E40AF' }}>GATE CHECKED-IN</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1E40AF' }}>{used}</div>
            </div>

            <div style={{ padding: '0.85rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400E' }}>PENDING</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#92400E' }}>{pending}</div>
            </div>

            <div style={{ padding: '0.85rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991B1B' }}>CANCELLED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#991B1B' }}>{cancelled}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
