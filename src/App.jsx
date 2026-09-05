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
import { CloudConfigModal } from './components/common/CloudConfigModal';
import { HelpPage } from './components/help/HelpPage';
import { Lock, ShieldCheck, KeyRound, AlertCircle, User } from 'lucide-react';

export function App() {
  const { 
    activeTab, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    setActiveAdminRole, 
    validPasscodes = [
      'K9#mQ7$vX2',
      'p8!Tx4&W9z',
      'J3@bY6*nE5',
      'Z7%hR2#kM9',
      'd4$Vw8!L1q'
    ],
    isPortAdmin,
    showCloudConfigModal,
    setShowCloudConfigModal
  } = useApp();

  const [portalUsername, setPortalUsername] = useState('');
  const [portalPasscode, setPortalPasscode] = useState('');
  const [portalError, setPortalError] = useState(null);

  const handleAdminPortalLogin = (e) => {
    e?.preventDefault();
    setPortalError(null);

    const enteredPass = portalPasscode.trim();

    // Check if passcode matches any of the 5 valid 10-character passcodes
    const isValid = validPasscodes.includes(enteredPass);

    if (isValid) {
      const officerDisplayName = portalUsername.trim() || 'Officer';
      setActiveAdminRole(officerDisplayName);
      setIsAdminLoggedIn(true);
    } else {
      setPortalError('Invalid Passcode. Please enter an authorized 10-character security passcode.');
    }
  };

  return (
    <div className="app-layout">
      {/* Global Header */}
      <Header />

      {/* Main Content Areas based on Active Tab / Port */}
      <main style={{ flex: 1 }}>
        {/* Dedicated Admin Portal Login View */}
        {activeTab === 'admin' && !isAdminLoggedIn ? (
          <div className="section" style={{ paddingTop: '3.5rem', minHeight: '65vh' }}>
            <div className="container container-narrow">
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '2px solid var(--gov-green-800)', padding: '2.5rem', boxShadow: 'var(--shadow-elevated)', maxWidth: '480px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--gov-green-900), var(--gov-green-950))', color: '#D4AF37', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', border: '2px solid #D4AF37' }}>
                    <Lock size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--gov-green-950)' }}>
                    Government Officer Portal
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Enter your name and 10-character security passcode
                  </p>
                </div>

                <form onSubmit={handleAdminPortalLogin}>
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" htmlFor="portal-username">
                      Username / Officer Name
                    </label>
                    <input
                      id="portal-username"
                      type="text"
                      className="form-input"
                      placeholder="Enter any name (e.g. Kishore, Officer, Admin)"
                      value={portalUsername}
                      onChange={(e) => {
                        setPortalUsername(e.target.value);
                        if (portalError) setPortalError(null);
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="form-label" htmlFor="portal-password" style={{ marginBottom: 0 }}>
                        Security Passcode <span className="req">*</span>
                      </label>
                      <button
                        type="button"
                        className="demo-doc-btn"
                        style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem' }}
                        onClick={() => {
                          setPortalUsername('Officer Kishore');
                          setPortalPasscode('K9#mQ7$vX2');
                          if (portalError) setPortalError(null);
                        }}
                      >
                        ⚡ Auto-fill Passcode
                      </button>
                    </div>
                    <input
                      id="portal-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter security passcode (e.g. K9#mQ7$vX2 or admin)"
                      value={portalPasscode}
                      onChange={(e) => {
                        setPortalPasscode(e.target.value);
                        if (portalError) setPortalError(null);
                      }}
                      required
                    />
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Authorized Demo Passcodes:</span>
                      {validPasscodes.slice(0, 3).map((pc, idx) => (
                        <button
                          key={pc}
                          type="button"
                          className="demo-doc-btn"
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                          onClick={() => {
                            setPortalUsername(`Officer ${idx + 1}`);
                            setPortalPasscode(pc);
                            if (portalError) setPortalError(null);
                          }}
                        >
                          <code>{pc}</code>
                        </button>
                      ))}
                    </div>
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
                    <span>Access Admin Command</span>
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

      {/* Real-time Cloud Config Modal */}
      <CloudConfigModal 
        isOpen={showCloudConfigModal} 
        onClose={() => setShowCloudConfigModal(false)} 
      />
    </div>
  );
}

export default App;
