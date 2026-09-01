import React, { createContext, useContext, useState, useEffect } from 'react';
import { LOCATIONS, CATEGORIES, ASSISTANCE_TYPES } from '../data/locationsData';
import { TIME_SLOTS } from '../data/timeSlotsData';
import { INITIAL_TOKENS, VALID_ADMIN_PASSCODES } from '../data/initialTokens';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Detect if running on admin port (3001) or #admin
  const isPortAdmin = typeof window !== 'undefined' && (
    window.location.port === '3001' || 
    window.location.pathname.startsWith('/admin') || 
    window.location.hash === '#admin'
  );

  // Navigation & Views: 'home' | 'register' | 'tracker' | 'locations' | 'admin' | 'help'
  const [activeTab, setActiveTab] = useState(isPortAdmin ? 'admin' : 'home');
  const [registrationCategory, setRegistrationCategory] = useState(null);
  const [registrationLocation, setRegistrationLocation] = useState(null);

  // Active Token (just created or selected to view)
  const [currentPassToken, setCurrentPassToken] = useState(null);

  // Admin Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminRole, setActiveAdminRole] = useState('Super Administrator');
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Hash listener for #admin direct URL navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setActiveTab('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Accessibility States
  const [fontScale, setFontScale] = useState('normal'); // 'normal' | 'lg' | 'xl'
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Stored Tokens (Clean slate - 0 legacy history)
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem('pushkaralu_tokens');
      return saved ? JSON.parse(saved) : INITIAL_TOKENS;
    } catch (e) {
      return INITIAL_TOKENS;
    }
  });

  // Stored Locations (to reflect live issued counts)
  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('pushkaralu_locations');
      return saved ? JSON.parse(saved) : LOCATIONS;
    } catch (e) {
      return LOCATIONS;
    }
  });

  // Continuous Multi-Tab Sync (storage events + focus + live 1.5s sync interval)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedTokens = localStorage.getItem('pushkaralu_tokens');
        if (savedTokens) {
          const parsed = JSON.parse(savedTokens);
          if (Array.isArray(parsed)) {
            setTokens(parsed);
          }
        }
        const savedLocs = localStorage.getItem('pushkaralu_locations');
        if (savedLocs) {
          const parsedLocs = JSON.parse(savedLocs);
          if (Array.isArray(parsedLocs)) {
            setLocations(parsedLocs);
          }
        }
      } catch (err) {
        console.error('Sync error:', err);
      }
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('focus', syncFromStorage);
    const interval = setInterval(syncFromStorage, 1500);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('focus', syncFromStorage);
      clearInterval(interval);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pushkaralu_tokens', JSON.stringify(tokens));
    } catch (e) {
      console.error(e);
    }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem('pushkaralu_locations', JSON.stringify(locations));
    } catch (e) {
      console.error(e);
    }
  }, [locations]);

  // Apply accessibility classes to body
  useEffect(() => {
    document.body.classList.remove('font-lg', 'font-xl', 'high-contrast');
    if (fontScale === 'lg') document.body.classList.add('font-lg');
    if (fontScale === 'xl') document.body.classList.add('font-xl');
    if (isHighContrast) document.body.classList.add('high-contrast');
  }, [fontScale, isHighContrast]);

  // Age Calculator
  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date('2026-08-15'); // Godavari Pushkaralu event reference date
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  // Eligibility Check
  const validateEligibility = (category, age) => {
    if (age === null || age === undefined) return { valid: false, reason: 'Please select a valid date of birth.' };
    
    if (category === 'child') {
      if (age < 5) {
        return { valid: true, reason: 'Eligible for Child Below 5 Priority' };
      }
      return { valid: false, reason: 'Child must be strictly under 5 years of age for this priority category.' };
    }

    if (category === 'senior') {
      if (age >= 70) {
        return { valid: true, reason: 'Eligible for Senior Citizen 70+ Priority' };
      }
      return { valid: false, reason: 'Senior citizen must be strictly 70 years or older for this priority category.' };
    }

    if (category === 'special') {
      return { valid: true, reason: 'Eligible for Special Assistance Priority' };
    }

    return { valid: false, reason: 'Invalid category selection.' };
  };

  // Generate Unique Token ID
  const generateTokenNumber = (locCode) => {
    const locPrefix = (locCode || 'TOK').toUpperCase();
    const existingForLoc = tokens.filter(t => t.locationCode === locPrefix);
    const nextSeq = existingForLoc.length + 1;
    return `${locPrefix}-${String(nextSeq).padStart(3, '0')}`;
  };

  // Create new priority token (starts in Pending state for Admin Desk review)
  const issueToken = (data) => {
    const loc = locations.find(l => l.id === data.locationId) || LOCATIONS[0];
    const cat = CATEGORIES.find(c => c.id === data.category) || CATEGORIES[0];
    const slot = TIME_SLOTS.find(s => s.id === data.slotId) || TIME_SLOTS[0];

    const tokenNumber = generateTokenNumber(loc.code);
    const newToken = {
      id: tokenNumber,
      tokenNumber: tokenNumber,
      name: data.name || 'Sample Pilgrim',
      dob: data.dob || '1952-04-12',
      age: data.age !== null && data.age !== undefined ? data.age : 74,
      mobile: data.mobile || '9848022334',
      category: data.category || 'senior',
      categoryName: cat.title,
      assistanceType: data.assistanceType || null,
      locationId: loc.id,
      locationName: loc.name,
      locationCode: loc.code,
      ghatName: loc.ghat,
      entryGate: loc.entryGate,
      date: '15 August 2026',
      timeSlot: slot.time,
      slotId: slot.id,
      status: 'Pending', // Fresh registration enters Pending Verification for Admin Desk review
      issuedAt: new Date().toISOString(),
      companionsAllowed: 1,
      docType: data.docType || 'Aadhaar – Demo Verification',
      fileName: data.fileName || `${(data.docType || 'Aadhaar').split(' – ')[0]}_${(data.name || 'Pilgrim').replace(/\s+/g, '_')}_Proof.pdf`,
      docVerified: false,
      verificationCode: `VER-AP-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationNotes: 'Application submitted. Awaiting Document Review by Verification Officer.'
    };

    // Update tokens list immediately in state and storage
    const updatedTokens = [newToken, ...tokens];
    setTokens(updatedTokens);
    try {
      localStorage.setItem('pushkaralu_tokens', JSON.stringify(updatedTokens));
    } catch (err) {
      console.error(err);
    }

    // Increment location issued count
    const updatedLocs = locations.map(l => {
      if (l.id === loc.id) {
        return { ...l, issued: l.issued + 1 };
      }
      return l;
    });
    setLocations(updatedLocs);
    try {
      localStorage.setItem('pushkaralu_locations', JSON.stringify(updatedLocs));
    } catch (err) {
      console.error(err);
    }

    setCurrentPassToken(newToken);
    return newToken;
  };

  // Verify and Approve a token by Officer
  const approveToken = (tokenId) => {
    const updated = tokens.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return {
          ...t,
          status: 'Verified',
          docVerified: true,
          verificationNotes: 'Official document reviewed and approved by Verification Officer.'
        };
      }
      return t;
    });
    setTokens(updated);
    try {
      localStorage.setItem('pushkaralu_tokens', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: 'Verified', docVerified: true }));
    }
  };

  // Decline a token by Officer
  const declineToken = (tokenId, reason = 'Document verification failed / Ineligible') => {
    const updated = tokens.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return {
          ...t,
          status: 'Declined',
          docVerified: false,
          verificationNotes: `Declined by Officer: ${reason}`
        };
      }
      return t;
    });
    setTokens(updated);
    try {
      localStorage.setItem('pushkaralu_tokens', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: 'Declined', docVerified: false }));
    }
  };

  // Update token status (Gate Check-in, Cancel, etc.)
  const updateTokenStatus = (tokenId, newStatus) => {
    const updated = tokens.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTokens(updated);
    try {
      localStorage.setItem('pushkaralu_tokens', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Reset to clean 0 tokens dataset
  const resetDemoData = () => {
    setTokens([]);
    setLocations(LOCATIONS);
    localStorage.removeItem('pushkaralu_tokens');
    localStorage.removeItem('pushkaralu_locations');
  };

  // Find token by query (token ID or mobile number)
  const findToken = (query) => {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    return tokens.find(t => 
      t.tokenNumber.toLowerCase() === clean || 
      t.id.toLowerCase() === clean || 
      t.mobile === clean
    );
  };

  // Navigation helpers
  const navigateToRegister = (category = null, locationId = null) => {
    if (category) setRegistrationCategory(category);
    if (locationId) setRegistrationLocation(locationId);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTracker = (token = null) => {
    if (token) setCurrentPassToken(token);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isPortAdmin,
        registrationCategory,
        setRegistrationCategory,
        registrationLocation,
        setRegistrationLocation,
        currentPassToken,
        setCurrentPassToken,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        activeAdminRole,
        setActiveAdminRole,
        showAdminLoginModal,
        setShowAdminLoginModal,
        validPasscodes: VALID_ADMIN_PASSCODES,
        fontScale,
        setFontScale,
        isHighContrast,
        setIsHighContrast,
        tokens,
        locations,
        timeSlots: TIME_SLOTS,
        categories: CATEGORIES,
        assistanceTypes: ASSISTANCE_TYPES,
        calculateAge,
        validateEligibility,
        issueToken,
        approveToken,
        declineToken,
        updateTokenStatus,
        resetDemoData,
        findToken,
        navigateToRegister,
        navigateToTracker
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
