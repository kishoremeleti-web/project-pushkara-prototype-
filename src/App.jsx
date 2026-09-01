import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryCards } from './components/home/CategoryCards';
import { HowItWorks } from './components/home/HowItWorks';
import { StepWizard } from './components/registration/StepWizard';
import { TokenTracker } from './components/token/TokenTracker';
import { LocationsList } from './components/locations/LocationsList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { HelpPage } from './components/help/HelpPage';
import { Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export function App() {
  const { 
    activeTab, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    setActiveAdminRole, 
    specialAdminCodes,
    isPortAdmin 
  } = useApp();

  const [portalCode, setPortalCode] = useState('');
  const [portalPass, setPortalPass] = useState('');
  const [portalError, setPortalError] = useState(null);

  const handleAdminPortalLogin = (e) => {
    e?.preventDefault();
    setPortalError(null);

    const cleanCode = portalCode.trim().toUpperCase();
    const cleanPass = portalPass.trim();

    const matched = specialAdminCodes.find(
      c => c.code.toUpperCase() === cleanCode && c.passcode === cleanPass
    );

    if (matched) {
      setActiveAdminRole(matched.role);
      setIsAdminLoggedIn(true);
    } else {
      setPortalError('Invalid Officer ID or Passcode. Please enter authorized credentials.');
    }
  };

  return (
    <div className="app-layout">
      {/* Global Header */}
      <Header />

      {/* Main Content Areas based on Active Tab / Port */}
      <main style={{ flex: 1 }}>
        {/* If on Port 3001 or Admin Tab and Not Logged In, Show Dedicated Admin Portal Login */}
        {activeTab === 'admin' && !isAdminLoggedIn ? (
          <div className="section" style={{ paddingTop: '3rem', minHeight: '65vh' }}>
            <div className="container container-narrow">
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '2px solid var(--gov-green-800)', padding: '2.5rem', boxShadow: 'var(--shadow-elevated)', maxWidth: '580px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--gov-green-900), var(--gov-green-950))', color: '#D4AF37', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', border: '2px solid #D4AF37' }}>
                    <Lock size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--gov-green-950)' }}>
                    Government Officer Command Portal
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Authorized Official Access for Document Verification & Gate Security
                  </p>
                </div>

                {/* Credentials Reference Box (No 1-step login) */}
                <div style={{ backgroundColor: 'var(--gov-green-25)', border: '1.5px solid var(--gov-green-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gov-green-900)', fontWeight: '800', fontSize: '0.875rem', marginBottom: '0.6rem' }}>
                    <KeyRound size={16} />
                    <span>Official Officer Access Credentials:</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                    <div style={{ background: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                      <strong>Super Admin:</strong> ID: <code>AP-ADMIN-2026</code> • Passcode: <code>PUSHKARA@2026</code>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                      <strong>Verification Officer:</strong> ID: <code>VERIFY-OFFICER-01</code> • Passcode: <code>VERIFY@2026</code>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                      <strong>Gate Security Officer:</strong> ID: <code>GATE-OFFICER-01</code> • Passcode: <code>GATE@2026</code>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAdminPortalLogin}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="portal-username">
                      Official Officer ID / Code <span className="req">*</span>
                    </label>
                    <input
                      id="portal-username"
                      type="text"
                      className="form-input"
                      placeholder="e.g. AP-ADMIN-2026"
                      value={portalCode}
                      onChange={(e) => {
                        setPortalCode(e.target.value);
                        if (portalError) setPortalError(null);
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="portal-password">
                      Security Passcode <span className="req">*</span>
                    </label>
                    <input
                      id="portal-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter security passcode"
                      value={portalPass}
                      onChange={(e) => {
                        setPortalPass(e.target.value);
                        if (portalError) setPortalError(null);
                      }}
                      required
                    />
                  </div>

                  {portalError && (
                    <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span>{portalError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
                    id="portal-login-btn"
                  >
                    <Lock size={18} />
                    <span>Authorize & Access Admin Command</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                <HeroSection />
                <CategoryCards />
                <HowItWorks />
              </>
            )}

            {activeTab === 'register' && <StepWizard />}

            {activeTab === 'tracker' && <TokenTracker />}

            {activeTab === 'locations' && <LocationsList />}

            {activeTab === 'admin' && <AdminDashboard />}

            {activeTab === 'help' && <HelpPage />}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Admin Login Dialog Modal */}
      <AdminLoginModal />
    </div>
  );
}

export default App;
