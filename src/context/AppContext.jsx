import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Stored Tokens
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem('pushkaralu_tokens');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_TOKENS;
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

  // Track serialized string to avoid redundant re-renders and race condition loops
  const lastSerializedTokensRef = useRef(JSON.stringify(tokens));
  const lastSerializedLocsRef = useRef(JSON.stringify(locations));

  // Safe localStorage saver that handles large fileDataUrls gracefully
  const saveTokensToStorage = (tokensArray) => {
    try {
      const jsonStr = JSON.stringify(tokensArray);
      localStorage.setItem('pushkaralu_tokens', jsonStr);
      lastSerializedTokensRef.current = jsonStr;
    } catch (e) {
      console.warn('LocalStorage quota reached, saving with lightweight document references:', e);
      try {
        const lightweightTokens = tokensArray.map(t => ({
          ...t,
          fileDataUrl: t.fileDataUrl && t.fileDataUrl.length > 50000 ? null : t.fileDataUrl
        }));
        const lightJson = JSON.stringify(lightweightTokens);
        localStorage.setItem('pushkaralu_tokens', lightJson);
        lastSerializedTokensRef.current = lightJson;
      } catch (err2) {
        console.error('Failed to save tokens to localStorage:', err2);
      }
    }
    // Dispatch custom browser event for instant cross-component / cross-tab update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pushkaralu_tokens_updated', { detail: tokensArray }));
    }
  };

  const saveLocationsToStorage = (locsArray) => {
    try {
      const jsonStr = JSON.stringify(locsArray);
      localStorage.setItem('pushkaralu_locations', jsonStr);
      lastSerializedLocsRef.current = jsonStr;
    } catch (e) {
      console.error(e);
    }
  };

  // Continuous Multi-Tab & Event Sync
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedTokens = localStorage.getItem('pushkaralu_tokens');
        if (savedTokens && savedTokens !== lastSerializedTokensRef.current) {
          const parsed = JSON.parse(savedTokens);
          if (Array.isArray(parsed)) {
            lastSerializedTokensRef.current = savedTokens;
            setTokens(parsed);
          }
        }
        const savedLocs = localStorage.getItem('pushkaralu_locations');
        if (savedLocs && savedLocs !== lastSerializedLocsRef.current) {
          const parsedLocs = JSON.parse(savedLocs);
          if (Array.isArray(parsedLocs)) {
            lastSerializedLocsRef.current = savedLocs;
            setLocations(parsedLocs);
          }
        }
      } catch (err) {
        console.error('Sync error:', err);
      }
    };

    const handleCustomTokenUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTokens(e.detail);
      }
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('focus', syncFromStorage);
    window.addEventListener('pushkaralu_tokens_updated', handleCustomTokenUpdate);
    const interval = setInterval(syncFromStorage, 2000);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('focus', syncFromStorage);
      window.removeEventListener('pushkaralu_tokens_updated', handleCustomTokenUpdate);
      clearInterval(interval);
    };
  }, []);

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
    const existingNumbers = tokens
      .filter(t => t.locationCode === locPrefix || (t.tokenNumber && t.tokenNumber.startsWith(`${locPrefix}-`)))
      .map(t => {
        const parts = t.tokenNumber.split('-');
        return parts.length > 1 ? parseInt(parts[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    
    const maxSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextSeq = maxSeq + 1;
    return `${locPrefix}-${String(nextSeq).padStart(3, '0')}`;
  };

  // Create new priority token (starts in Pending state for Admin Desk review)
  const issueToken = (data) => {
    const loc = locations.find(l => l.id === data.locationId || l.code === data.locationId) || LOCATIONS[0];
    const cat = CATEGORIES.find(c => c.id === data.category) || CATEGORIES[0];
    const slot = TIME_SLOTS.find(s => s.id === data.slotId || s.time === data.slotId) || TIME_SLOTS[0];

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
      fileDataUrl: data.fileDataUrl || null,
      fileSize: data.fileSize || null,
      fileType: data.fileType || null,
      docVerified: false,
      verificationCode: `VER-AP-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationNotes: 'Application submitted. Awaiting Document Review by Verification Officer.'
    };

    // Update tokens list immediately in state and storage
    const updatedTokens = [newToken, ...tokens];
    setTokens(updatedTokens);
    saveTokensToStorage(updatedTokens);

    // Increment location issued count
    const updatedLocs = locations.map(l => {
      if (l.id === loc.id) {
        return { ...l, issued: l.issued + 1 };
      }
      return l;
    });
    setLocations(updatedLocs);
    saveLocationsToStorage(updatedLocs);

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
    saveTokensToStorage(updated);

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
    saveTokensToStorage(updated);

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
    saveTokensToStorage(updated);

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Reset to initial demo tokens dataset
  const resetDemoData = () => {
    setTokens(INITIAL_TOKENS);
    setLocations(LOCATIONS);
    localStorage.removeItem('pushkaralu_tokens');
    localStorage.removeItem('pushkaralu_locations');
    saveTokensToStorage(INITIAL_TOKENS);
    saveLocationsToStorage(LOCATIONS);
  };

  // Find token by query (token ID or mobile number)
  const findToken = (query) => {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    return tokens.find(t => 
      t.tokenNumber?.toLowerCase() === clean || 
      t.id?.toLowerCase() === clean || 
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
