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
import { Lock, ShieldCheck, KeyRound, AlertCircle, User } from 'lucide-react';

export function App() {
  const { 
    activeTab, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    setActiveAdminRole, 
    validPasscodes = [
      'Pushk@26',
      'Admi#202',
      'Gate$999',
      'Auth*777',
      'Ghat!123'
    ],
    isPortAdmin 
  } = useApp();

  const [portalUsername, setPortalUsername] = useState('');
  const [portalPasscode, setPortalPasscode] = useState('');
  const [portalError, setPortalError] = useState(null);

  const handleAdminPortalLogin = (e) => {
    e?.preventDefault();
    setPortalError(null);

    const enteredPass = portalPasscode.trim();

    // Check if passcode matches any of the 5 valid 8-character passcodes
    const isValid = validPasscodes.includes(enteredPass);

    if (isValid) {
      const officerDisplayName = portalUsername.trim() || 'Officer';
      setActiveAdminRole(officerDisplayName);
      setIsAdminLoggedIn(true);
    } else {
      setPortalError('Invalid Passcode. Please enter a valid 8-character security passcode.');
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
                    Enter your name and 8-character security passcode
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
                    <label className="form-label" htmlFor="portal-password">
                      Security Passcode (8 Characters) <span className="req">*</span>
                    </label>
                    <input
                      id="portal-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter 8-character passcode"
                      value={portalPasscode}
                      onChange={(e) => {
                        setPortalPasscode(e.target.value);
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
    </div>
  );
}

export default App;
