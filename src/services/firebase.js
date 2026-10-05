import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  query,
  limit
} from 'firebase/firestore';

// Default project configuration from Firebase Console
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_iEIp3MYyyQAeVCd197HwwxArgDvz0gU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pushkaras-prototype.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pushkaras-prototype',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pushkaras-prototype.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '437000337218',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:437000337218:web:5ab91a197819c7f6667adb',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-410QW0QB76'
};

// Retrieve currently active config (checks browser localStorage override first, then env)
export const getActiveFirebaseConfig = () => {
  try {
    const customConfig = localStorage.getItem('pushkaralu_firebase_config');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading custom firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
};

// Check if credentials are sufficiently provided
export const isCloudConfigured = () => {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.apiKey.trim() !== '' && cfg.projectId && cfg.projectId.trim() !== '');
};

let firebaseApp = null;
let firestoreDb = null;

// Initialize Firebase App & Firestore singleton
export const initFirebase = () => {
  if (!isCloudConfigured()) {
    return null;
  }

  try {
    const config = getActiveFirebaseConfig();
    
    if (getApps().length > 0) {
      // Reuse the existing initialized app (avoids duplicate app errors)
      firebaseApp = getApps()[0];
    } else {
      firebaseApp = initializeApp(config);
    }

    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (err) {
    console.error('Failed to initialize Firebase Firestore:', err);
    return null;
  }
};

// Save a custom config from browser UI (e.g. settings modal on mobile/admin)
export const setCustomFirebaseConfig = (newConfig) => {
  try {
    localStorage.setItem('pushkaralu_firebase_config', JSON.stringify(newConfig));
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Firebase config:', err);
  }
};

// Clear custom config
export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem('pushkaralu_firebase_config');
  window.location.reload();
};

/**
 * Sanitize token for Firestore:
 * Firestore documents have a strict 1MB limit.
 * If fileDataUrl is a massive base64 image (>400KB), truncate or omit from cloud document
 */
const sanitizeTokenForCloud = (token) => {
  const clean = { ...token };
  if (clean.fileDataUrl && typeof clean.fileDataUrl === 'string' && clean.fileDataUrl.length > 400000) {
    clean.fileDataUrl = null;
    clean.fileSize = clean.fileSize || 'Uploaded (Large Document)';
  }
  return clean;
};

/**
 * Real-time listener for all tokens in Firestore
 * Invokes onTokensChange with array of token objects whenever any device modifies data
 */
export const subscribeToCloudTokens = (onTokensChange, onError) => {
  const db = firestoreDb || initFirebase();
  if (!db) return () => {};

  try {
    const tokensCol = collection(db, 'tokens');
    
    const unsubscribe = onSnapshot(
      tokensCol,
      (snapshot) => {
        const tokensList = [];
        snapshot.forEach((docSnap) => {
          tokensList.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Sort descending by issuedAt date
        tokensList.sort((a, b) => {
          const dateA = a.issuedAt ? new Date(a.issuedAt).getTime() : 0;
          const dateB = b.issuedAt ? new Date(b.issuedAt).getTime() : 0;
          return dateB - dateA;
        });

        onTokensChange(tokensList);
      },
      (error) => {
        console.warn('Firestore snapshot error (falling back to local cache):', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Error establishing Firestore tokens listener:', err);
    return () => {};
  }
};

/**
 * Save / Create token in Firestore
 */
export const saveTokenToCloud = async (token) => {
  const db = firestoreDb || initFirebase();
  if (!db || !token) return false;

  try {
    const tokenId = token.id || token.tokenNumber;
    const cleanToken = sanitizeTokenForCloud(token);
    await setDoc(doc(db, 'tokens', tokenId), cleanToken, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving token to cloud:', err);
    return false;
  }
};

/**
 * Update existing token in Firestore
 */
export const updateTokenInCloud = async (tokenId, updates) => {
  const db = firestoreDb || initFirebase();
  if (!db || !tokenId) return false;

  try {
    const docRef = doc(db, 'tokens', tokenId);
    await setDoc(docRef, updates, { merge: true });
    return true;
  } catch (err) {
    console.error('Error updating token in cloud:', err);
    return false;
  }
};

/**
 * Delete token from Firestore
 */
export const deleteTokenFromCloud = async (tokenId) => {
  const db = firestoreDb || initFirebase();
  if (!db || !tokenId) return false;

  try {
    await deleteDoc(doc(db, 'tokens', tokenId));
    return true;
  } catch (err) {
    console.error('Error deleting token from cloud:', err);
    return false;
  }
};

/**
 * Seed initial tokens if cloud collection is currently empty
 */
export const seedCloudTokensIfEmpty = async (initialTokens) => {
  const db = firestoreDb || initFirebase();
  if (!db || !initialTokens || initialTokens.length === 0) return;

  try {
    const tokensCol = collection(db, 'tokens');
    const previewQuery = query(tokensCol, limit(1));
    const snapshot = await getDocs(previewQuery);

    if (snapshot.empty) {
      console.log('Seeding initial Pushkaralu demo tokens to Firestore cloud...');
      for (const token of initialTokens) {
        await setDoc(doc(db, 'tokens', token.id), sanitizeTokenForCloud(token));
      }
      console.log('Successfully seeded initial tokens in cloud.');
    }
  } catch (err) {
    console.warn('Could not seed initial tokens in cloud:', err);
  }
};
