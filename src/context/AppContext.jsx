import React, { createContext, useContext, useState, useEffect } from 'react';
import { LOCATIONS, CATEGORIES, ASSISTANCE_TYPES } from '../data/locationsData';
import { TIME_SLOTS } from '../data/timeSlotsData';
import { INITIAL_TOKENS, SPECIAL_ADMIN_CODES } from '../data/initialTokens';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isPortAdmin);
  const [activeAdminRole, setActiveAdminRole] = useState('Super Administrator');
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

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

  // Sync to localStorage and broadcast cross-window/port
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

  // Listen for storage events (Real-time sync between localhost:3000 and localhost:3001)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'pushkaralu_tokens' && e.newValue) {
        try {
          setTokens(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'pushkaralu_locations' && e.newValue) {
        try {
          setLocations(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    const existingForLoc = tokens.filter(t => t.locationCode === locPrefix);
    const nextSeq = existingForLoc.length + 1;
    return `${locPrefix}-${String(nextSeq).padStart(3, '0')}`;
  };

  // Create new priority token (starts in Pending / Verified state with clean record)
  const issueToken = (data) => {
    const loc = locations.find(l => l.id === data.locationId) || LOCATIONS[0];
    const cat = CATEGORIES.find(c => c.id === data.category) || CATEGORIES[0];
    const slot = TIME_SLOTS.find(s => s.id === data.slotId) || TIME_SLOTS[0];

    const tokenNumber = generateTokenNumber(loc.code);
    const newToken = {
      id: tokenNumber,
      tokenNumber: tokenNumber,
      name: data.name,
      dob: data.dob,
      age: data.age,
      mobile: data.mobile,
      category: data.category,
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
      fileName: data.fileName || `${(data.docType || 'Document').split(' – ')[0]}_${data.name.replace(/\s+/g, '_')}.pdf`,
      docVerified: false,
      verificationCode: `VER-AP-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationNotes: 'Application submitted. Awaiting Document Review by Verification Officer.'
    };

    // Update tokens list
    setTokens(prev => [newToken, ...prev]);

    // Increment location issued count
    setLocations(prev => prev.map(l => {
      if (l.id === loc.id) {
        return { ...l, issued: l.issued + 1 };
      }
      return l;
    }));

    setCurrentPassToken(newToken);
    return newToken;
  };

  // Verify and Approve a token by Officer
  const approveToken = (tokenId) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return {
          ...t,
          status: 'Verified',
          docVerified: true,
          verificationNotes: 'Official document reviewed and approved by Verification Officer.'
        };
      }
      return t;
    }));

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: 'Verified', docVerified: true }));
    }
  };

  // Decline a token by Officer
  const declineToken = (tokenId, reason = 'Document verification failed / Ineligible') => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return {
          ...t,
          status: 'Declined',
          docVerified: false,
          verificationNotes: `Declined by Officer: ${reason}`
        };
      }
      return t;
    }));

    if (currentPassToken && (currentPassToken.id === tokenId || currentPassToken.tokenNumber === tokenId)) {
      setCurrentPassToken(prev => ({ ...prev, status: 'Declined', docVerified: false }));
    }
  };

  // Update token status (Gate Check-in, Cancel, etc.)
  const updateTokenStatus = (tokenId, newStatus) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId || t.tokenNumber === tokenId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));

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
        specialAdminCodes: SPECIAL_ADMIN_CODES,
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
