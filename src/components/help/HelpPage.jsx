import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  ShieldCheck, 
  Users, 
  Baby, 
  HeartHandshake, 
  Accessibility, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const HelpPage = () => {
  const { navigateToRegister } = useApp();

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Who is eligible for the Priority Digi Token?',
      a: 'The Priority Digi Token is strictly intended for three groups: (1) Children under 5 years of age, (2) Senior citizens aged 70 years and above, and (3) Special Assistance pilgrims with mobility, visual, or medical impairments.'
    },
    {
      q: 'Is a companion allowed to enter with the priority pilgrim?',
      a: 'Yes! Exactly 1 Companion / Guardian / Caregiver is authorized to accompany each eligible child or senior citizen through the Special Priority Gate on the same token without needing a separate pass.'
    },
    {
      q: 'Does this prototype store my real Aadhaar number?',
      a: 'No. This application is a prototype demonstration. It does NOT connect to real Aadhaar databases, nor does it store real government identification numbers. Mock verification is performed locally.'
    },
    {
      q: 'Which ghat locations are supported?',
      a: 'All 45 official Godavari Pushkaralu ghat locations in the Konaseema delta region (including Antarvedi, Razole, Sakhinetipalli, Vadapalli, Appanapalli, etc.) are available with live capacity management.'
    },
    {
      q: 'What should I do if my time slot is full?',
      a: 'If a particular 30-minute time slot is fully booked for your chosen ghat, you may select an alternative morning time slot or choose an adjacent ghat location nearby.'
    }
  ];

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container container-narrow">
        <div className="section-header">
          <span className="section-tag">Guidelines & FAQs</span>
          <h2 className="section-title">Pushkaralu Priority Guidelines</h2>
          <p className="section-desc">
            Everything you need to know about priority fast-track entry, age requirements, and companion policies.
          </p>
        </div>

        {/* Priority Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <div className="step-card" style={{ textAlign: 'left', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontWeight: '800', marginBottom: '0.4rem' }}>
              <Baby size={18} />
              <span>Children &lt; 5 Years</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Accompanied by 1 parent/guardian. Verification via Birth Certificate or Child ID simulation.
            </p>
          </div>

          <div className="step-card" style={{ textAlign: 'left', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--saffron-600)', fontWeight: '800', marginBottom: '0.4rem' }}>
              <HeartHandshake size={18} />
              <span>Seniors 70+ Years</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Dedicated shaded queue and wheelchair ramps. Accompanied by 1 family member escort.
            </p>
          </div>

          <div className="step-card" style={{ textAlign: 'left', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: '800', marginBottom: '0.4rem' }}>
              <Accessibility size={18} />
              <span>Special Assistance</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              For pilgrims requiring wheelchair or medical escort with barrier-free ramp access.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: 'var(--navy-900)'
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.1rem', color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', borderTop: '1px solid var(--slate-100)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--saffron-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--saffron-100)' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Ready to book your priority token?
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Takes under 2 minutes. Receive your instant QR Pass directly on your mobile device.
          </p>
          <button className="btn btn-primary" onClick={() => navigateToRegister()}>
            <span>Get Priority Digi Token</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
