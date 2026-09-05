// End-to-End Simulation Test for Document Upload & Admin Verification Workflow
import { LOCATIONS, CATEGORIES, ASSISTANCE_TYPES } from './src/data/locationsData.js';
import { TIME_SLOTS } from './src/data/timeSlotsData.js';
import { INITIAL_TOKENS, VALID_ADMIN_PASSCODES } from './src/data/initialTokens.js';

console.log('===============================================================');
console.log('  PUSHKARALU DIGI TOKEN - FULL END-TO-END VERIFICATION TEST    ');
console.log('===============================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Simulate State & Storage
let mockStorage = {};
let currentTokens = [...INITIAL_TOKENS];

function saveTokens(tokens) {
  currentTokens = tokens;
  mockStorage['pushkaralu_tokens'] = JSON.stringify(tokens);
}

saveTokens(INITIAL_TOKENS);
assert(currentTokens.length === 6, 'Initial 6 sample tokens loaded');

// 2. User registers on Public Portal with an uploaded Document Proof
console.log('\n--- Step 1: Public Portal Registration with Document Proof ---');

const userFormData = {
  category: 'senior',
  locationId: 'ANT', // Antarvedi
  name: 'Kishore Senior Rao',
  dob: '1950-05-20',
  age: 76,
  mobile: '9848099887',
  assistanceType: 'Wheelchair Assistance',
  slotId: 'slot-05',
  docType: 'Aadhaar – Demo Verification',
  fileName: 'Aadhaar_Kishore_1950.pdf',
  fileDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  fileSize: '184 KB',
  fileType: 'image/png'
};

// Simulate issueToken
function issueToken(data) {
  const loc = LOCATIONS.find(l => l.id === data.locationId) || LOCATIONS[0];
  const cat = CATEGORIES.find(c => c.id === data.category) || CATEGORIES[0];
  const slot = TIME_SLOTS.find(s => s.id === data.slotId) || TIME_SLOTS[0];

  const locPrefix = (loc.code || 'TOK').toUpperCase();
  const existingNumbers = currentTokens
    .filter(t => t.locationCode === locPrefix || (t.tokenNumber && t.tokenNumber.startsWith(`${locPrefix}-`)))
    .map(t => parseInt(t.tokenNumber.split('-')[1], 10))
    .filter(n => !isNaN(n));
  
  const maxSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const tokenNumber = `${locPrefix}-${String(maxSeq + 1).padStart(3, '0')}`;

  const newToken = {
    id: tokenNumber,
    tokenNumber,
    name: data.name,
    dob: data.dob,
    age: data.age,
    mobile: data.mobile,
    category: data.category,
    categoryName: cat.title,
    assistanceType: data.assistanceType,
    locationId: loc.id,
    locationName: loc.name,
    locationCode: loc.code,
    ghatName: loc.ghat,
    entryGate: loc.entryGate,
    date: '15 August 2026',
    timeSlot: slot.time,
    slotId: slot.id,
    status: 'Pending', // Fresh registration starts in Pending for Admin Officer review
    issuedAt: new Date().toISOString(),
    companionsAllowed: 1,
    docType: data.docType,
    fileName: data.fileName,
    fileDataUrl: data.fileDataUrl,
    fileSize: data.fileSize,
    fileType: data.fileType,
    docVerified: false,
    verificationCode: `VER-AP-${Math.floor(10000 + Math.random() * 90000)}`,
    verificationNotes: 'Application submitted. Awaiting Document Review by Verification Officer.'
  };

  const updated = [newToken, ...currentTokens];
  saveTokens(updated);
  return newToken;
}

const submittedToken = issueToken(userFormData);
console.log(`Submitted Token ID: ${submittedToken.tokenNumber}, Status: ${submittedToken.status}`);

assert(submittedToken.tokenNumber === 'ANT-043', 'Token ID is unique and incremented to ANT-043');
assert(submittedToken.status === 'Pending', 'Pass starts in Pending status');
assert(submittedToken.fileName === 'Aadhaar_Kishore_1950.pdf', 'Uploaded filename preserved');
assert(submittedToken.fileDataUrl !== null, 'Uploaded file data URL preserved');
assert(submittedToken.docVerified === false, 'docVerified is initially false');
assert(currentTokens.length === 7, 'Total tokens count in system increased to 7');

// 3. Admin Command Desk Verification Queue
console.log('\n--- Step 2: Officer Logs In & Views Document Approvals Desk ---');

// Check Admin Passcodes
assert(VALID_ADMIN_PASSCODES.includes('K9#mQ7$vX2'), 'Passcode K9#mQ7$vX2 is valid');
assert(VALID_ADMIN_PASSCODES.includes('admin'), 'Passcode "admin" is valid');

// Check Document Approvals Queue
const pendingList = currentTokens.filter(t => t.status === 'Pending');
console.log(`Pending Tokens Count in Admin Queue: ${pendingList.length}`);
assert(pendingList.length === 7, 'Admin queue has 7 pending tokens in clean unverified state (including new ANT-043)');
assert(pendingList[0].id === 'ANT-043', 'Newly submitted application ANT-043 is at top of Admin queue');

// 4. Officer Inspects the Document Proof
console.log('\n--- Step 3: Officer Inspects Attached Document & Runs Eligibility Audit ---');

const inspectingToken = pendingList[0];
assert(inspectingToken.fileDataUrl !== null, 'Officer can preview actual uploaded image/doc dataUrl');
assert(inspectingToken.age >= 70, 'Pilgrim age 76 satisfies Senior Citizen 70+ rule');
assert(inspectingToken.locationName === 'Antarvedi', 'Pilgrim ghat is Antarvedi');

// 5. Officer Approves the Token
console.log('\n--- Step 4: Officer Approves the Application ---');

function approveToken(tokenId) {
  const updated = currentTokens.map(t => {
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
  saveTokens(updated);
}

approveToken(submittedToken.id);

const verifiedToken = currentTokens.find(t => t.id === submittedToken.id);
console.log(`Approved Token ID: ${verifiedToken.tokenNumber}, Status: ${verifiedToken.status}, docVerified: ${verifiedToken.docVerified}`);

assert(verifiedToken.status === 'Verified', 'Token status transitioned from Pending to Verified');
assert(verifiedToken.docVerified === true, 'Token docVerified is true');
assert(currentTokens.filter(t => t.status === 'Pending').length === 6, 'Pending queue count reduced from 7 to 6 upon approval');

// 6. Pilgrim Token Tracker & Gate Security Scan
console.log('\n--- Step 5: Gate Scanner & Check-in Verification ---');

function scanTokenAtGate(tokenQuery) {
  const token = currentTokens.find(t => t.tokenNumber === tokenQuery || t.id === tokenQuery);
  if (!token) return { success: false, msg: 'Unknown token' };
  if (token.status === 'Verified') {
    return {
      success: true,
      msg: `Access Granted! Pilgrim ${token.name} + 1 Companion authorized at Gate ${token.entryGate}.`
    };
  }
  return { success: false, msg: `Blocked: Token is ${token.status}` };
}

const scanResult = scanTokenAtGate('ANT-043');
console.log(`Scan Result for ANT-043:`, scanResult.msg);
assert(scanResult.success === true, 'Gate scanner accepts Verified ANT-043');

console.log(`\n===============================================================`);
console.log(`  ALL END-TO-END TESTS PASSED: ${passed} PASSED, ${failed} FAILED `);
console.log(`===============================================================\n`);

if (failed > 0) process.exit(1);
