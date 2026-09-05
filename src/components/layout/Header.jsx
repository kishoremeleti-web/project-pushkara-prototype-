import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Menu, 
  X, 
  Home, 
  Ticket, 
  Search, 
  MapPin, 
  HelpCircle, 
  Lock, 
  Eye, 
  Type, 
  CheckCircle2,
  Sparkles,
  LogOut,
  Cloud,
  CloudOff,
  Loader2
} from 'lucide-react';

export const Header = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn,
    isPortAdmin,
    fontScale,
    setFontScale,
    isHighContrast,
    setIsHighContrast,
    navigateToRegister,
    cloudSyncStatus,
    setShowCloudConfigModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  return (
    <>
      {/* Official Tricolor Ribbon */}
      <div className="gov-top-bar" />

      {/* Demo Prototype Notice Banner */}
      <div className="demo-disclaimer-banner">
        <span className="badge">PROTOTYPE</span>
        <span>Pushkaralu Digi Token – Priority Entry Demo System (For Evaluation & Testing Only)</span>
      </div>

      {/* Accessibility Toolbar */}
      <div className="accessibility-bar">
        <div className="container accessibility-inner">
          <div className="gov-official-tag">
            <Shield size={14} />
            <span>Government of Andhra Pradesh • Godavari Pushkaralu Priority Portal</span>
          </div>
          <div className="access-controls">
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Elder Accessibility:</span>
            <button 
              className={`access-btn ${fontScale === 'normal' ? 'active' : ''}`}
              onClick={() => setFontScale('normal')}
              title="Standard Text Size"
            >
              A
            </button>
            <button 
              className={`access-btn ${fontScale === 'lg' ? 'active' : ''}`}
              onClick={() => setFontScale('lg')}
              title="Large Text Size for Elders"
            >
              A+
            </button>
            <button 
              className={`access-btn ${fontScale === 'xl' ? 'active' : ''}`}
              onClick={() => setFontScale('xl')}
              title="Extra Large Text Size"
            >
              A++
            </button>
            <button 
              className={`access-btn ${isHighContrast ? 'active' : ''}`}
              onClick={() => setIsHighContrast(!isHighContrast)}
              title="Toggle High Contrast for Visibility"
            >
              <Eye size={12} style={{ display: 'inline', marginRight: '3px' }} />
              {isHighContrast ? 'Standard Contrast' : 'High Contrast'}
            </button>

            {/* Real-Time Cloud Sync Indicator Button */}
            <button
              type="button"
              className="access-btn"
              onClick={() => setShowCloudConfigModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '700',
                backgroundColor: cloudSyncStatus === 'connected' ? 'rgba(22, 101, 52, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                color: cloudSyncStatus === 'connected' ? '#166534' : '#B45309',
                borderColor: cloudSyncStatus === 'connected' ? '#86EFAC' : '#FDE68A',
                marginLeft: '0.6rem'
              }}
              title="Cloud Sync Status (Firebase Firestore) – Click to configure or view status"
              id="header-cloud-sync-pill"
            >
              {cloudSyncStatus === 'connected' ? (
                <>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                  <span>Cloud Synced</span>
                </>
              ) : cloudSyncStatus === 'connecting' ? (
                <>
                  <Loader2 size={11} className="verify-spinner" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
                  <span>Cloud: Local Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="main-header">
        <div className="container header-inner">
          {/* Brand Logo & Title */}
          <div className="brand-link" onClick={() => handleNavClick('home')}>
            <div className="emblem-icon">
              <Sparkles size={26} />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                Pushkaralu <span>Digi Token</span>
              </h1>
              <p className="brand-sub">Priority Fast-Track Entry Portal</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => navigateToRegister()}
            >
              <Ticket size={18} />
              <span>Get Token</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => handleNavClick('tracker')}
            >
              <Search size={18} />
              <span>My Token</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => handleNavClick('locations')}
            >
              <MapPin size={18} />
              <span>45 Locations</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => handleNavClick('help')}
            >
              <HelpCircle size={18} />
              <span>Help & FAQ</span>
            </button>

            {/* Officer / Admin Portal Nav Button */}
            {isAdminLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button 
                  className={`nav-admin-btn logged-in ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                  id="header-nav-admin-cmd"
                >
                  <CheckCircle2 size={16} />
                  <span>Admin Command</span>
                </button>
                <button
                  className="access-btn"
                  onClick={handleLogoutAdmin}
                  style={{ padding: '0.45rem 0.7rem', color: '#FCA5A5', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  title="Logout from Admin"
                  id="header-nav-logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="nav-item"
                style={{ color: 'var(--gov-green-900)', fontWeight: '700' }}
                onClick={() => handleNavClick('admin')}
                id="header-nav-officer-portal"
              >
                <Lock size={16} />
                <span>Officer Portal</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="container mobile-menu-drawer open">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => navigateToRegister()}
            >
              <Ticket size={18} />
              <span>Get Digi Token</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => handleNavClick('tracker')}
            >
              <Search size={18} />
              <span>Track My Token</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => handleNavClick('locations')}
            >
              <MapPin size={18} />
              <span>All 45 Ghat Locations</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => handleNavClick('help')}
            >
              <HelpCircle size={18} />
              <span>Help & Guidelines</span>
            </button>
            {isAdminLoggedIn ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  className="nav-admin-btn logged-in"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleNavClick('admin')}
                >
                  <CheckCircle2 size={16} />
                  <span>Admin Command</span>
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', color: '#DC2626' }}
                  onClick={handleLogoutAdmin}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                className="nav-item"
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--gov-green-900)', fontWeight: '700' }}
                onClick={() => handleNavClick('admin')}
              >
                <Lock size={16} />
                <span>Officer Portal</span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
