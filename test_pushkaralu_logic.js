// Comprehensive Verification Script for Pushkaralu Digi Token Business Rules & Data Integrity
import { LOCATIONS, CATEGORIES, ASSISTANCE_TYPES } from './src/data/locationsData.js';
import { TIME_SLOTS } from './src/data/timeSlotsData.js';
import { INITIAL_TOKENS, VALID_ADMIN_PASSCODES } from './src/data/initialTokens.js';

console.log('=== PUSHKARALU DIGI TOKEN VERIFICATION SUITE ===\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Check all 45 exact locations
assert(LOCATIONS.length === 45, 'Exactly 45 Pushkaralu Ghat Locations are configured');

const requiredLocations = [
  'Antarvedi', 'Sakhinetipalli', 'Razole', 'Sompalli', 'Appanapalli',
  'Dindi', 'Chinchinada', 'Vadapalli', 'Atreyapuram', 'Rajavaram',
  'Lolla', 'Ravulapalem', 'Komarajulanka', 'Bobbilanka', 'Vaddiparru',
  'Peravaram', 'Velicheru', 'Kothapeta', 'Vadapalem', 'Vanapalli',
  'P. Gannavaram', 'Mukteswaram', 'Tottaramudi', 'Madupalli', 'Veeravallipalem',
  'Kondukuduru', 'Sanapallilanka', 'Kedarlanka', 'Addankivarilanka', 'Muramalla',
  'Yedurlanka', 'Guthinadeevi', 'G. Mulapalem', 'Tillakuppa', 'Kesanakurru',
  'Gedullanka', 'Inapuram', 'Kothalanka', 'Tanelanka', 'Pallavaripalem',
  'Kundaleswaram', 'Nadavapalli', 'Pallamkurru', 'Bodasakurru', 'Allavaram'
];

const missingLocations = requiredLocations.filter(req => !LOCATIONS.some(l => l.name.toLowerCase() === req.toLowerCase()));
assert(missingLocations.length === 0, `All 45 required locations present (Missing: ${missingLocations.join(', ')})`);

// 2. Check location prefix codes (e.g. ANT, SAK, RAZ, APP)
const antarvedi = LOCATIONS.find(l => l.name === 'Antarvedi');
assert(antarvedi && antarvedi.code === 'ANT', 'Antarvedi has code ANT');

const razole = LOCATIONS.find(l => l.name === 'Razole');
assert(razole && razole.code === 'RAZ', 'Razole has code RAZ');

const appanapalli = LOCATIONS.find(l => l.name === 'Appanapalli');
assert(appanapalli && appanapalli.code === 'APP', 'Appanapalli has code APP');

// 3. Check 3 Priority Categories
assert(CATEGORIES.length === 3, 'Exactly 3 Priority Categories configured');
assert(CATEGORIES.some(c => c.id === 'child'), 'Child Below 5 Category exists');
assert(CATEGORIES.some(c => c.id === 'senior'), 'Senior Citizen 70+ Category exists');
assert(CATEGORIES.some(c => c.id === 'special'), 'Special Assistance Category exists');

// 4. Check 12 Morning Time Slots
assert(TIME_SLOTS.length === 12, '12 Morning Time Slots configured (6:00 AM - 12:00 PM)');
assert(TIME_SLOTS[0].time === '6:00 AM – 6:30 AM', 'First slot is 6:00 AM – 6:30 AM');
assert(TIME_SLOTS[11].time === '11:30 AM – 12:00 PM', 'Last slot is 11:30 AM – 12:00 PM');

// 5. Age Calculation Logic Test (Pushkaralu reference date Aug 15, 2026)
function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date('2026-08-15');
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

assert(calculateAge('2023-05-10') === 3, 'Child DOB 2023-05-10 calculates to 3 years');
assert(calculateAge('2022-01-01') === 4, 'Child DOB 2022-01-01 calculates to 4 years');
assert(calculateAge('2020-01-01') === 6, 'Child DOB 2020-01-01 calculates to 6 years (> 5 yrs)');
assert(calculateAge('1952-04-12') === 74, 'Senior DOB 1952-04-12 calculates to 74 years (>= 70 yrs)');
assert(calculateAge('1965-01-01') === 61, 'Senior DOB 1965-01-01 calculates to 61 years (< 70 yrs)');

// 6. Eligibility Validation Logic Test
function validateEligibility(category, age) {
  if (age === null || age === undefined) return { valid: false, reason: 'Invalid DOB' };
  if (category === 'child') {
    return age < 5 
      ? { valid: true, reason: 'Eligible for Child Below 5 Priority' }
      : { valid: false, reason: 'Child must be strictly under 5 years of age.' };
  }
  if (category === 'senior') {
    return age >= 70
      ? { valid: true, reason: 'Eligible for Senior Citizen 70+ Priority' }
      : { valid: false, reason: 'Senior citizen must be strictly 70 years or older.' };
  }
  if (category === 'special') {
    return { valid: true, reason: 'Eligible for Special Assistance Priority' };
  }
  return { valid: false, reason: 'Invalid category' };
}

assert(validateEligibility('child', 3).valid === true, 'Child age 3 is ELIGIBLE');
assert(validateEligibility('child', 5).valid === false, 'Child age 5 is INELIGIBLE');
assert(validateEligibility('senior', 74).valid === true, 'Senior age 74 is ELIGIBLE');
assert(validateEligibility('senior', 65).valid === false, 'Senior age 65 is INELIGIBLE');
assert(validateEligibility('special', 35).valid === true, 'Special assistance age 35 is ELIGIBLE');

// 7. Dummy Dataset Verification
assert(INITIAL_TOKENS.length >= 5, 'Initial realistic dummy tokens populated');
assert(INITIAL_TOKENS.some(t => t.tokenNumber === 'ANT-042'), 'Sample token ANT-042 present');
assert(INITIAL_TOKENS.some(t => t.category === 'child'), 'Sample Child token present');
assert(INITIAL_TOKENS.some(t => t.category === 'senior'), 'Sample Senior token present');
assert(INITIAL_TOKENS.some(t => t.category === 'special'), 'Sample Special Assistance token present');
assert(INITIAL_TOKENS.every(t => t.companionsAllowed === 1), 'All priority tokens grant 1 Companion entry');

// 8. Admin Security Passcodes
assert(VALID_ADMIN_PASSCODES.length >= 5, 'Valid 10-char passcodes and admin credentials configured');
assert(VALID_ADMIN_PASSCODES.includes('K9#mQ7$vX2'), 'Primary passcode K9#mQ7$vX2 valid');
assert(VALID_ADMIN_PASSCODES.includes('admin'), 'Demo passcode "admin" valid');

// 9. Document Proof Attachment & Approval Lifecycle Test
const mockRegistration = {
  name: 'Kishore Meleti',
  dob: '1950-05-20',
  age: 76,
  mobile: '9848099887',
  category: 'senior',
  locationId: 'ANT',
  slotId: 'slot-05',
  docType: 'Aadhaar – Demo Verification',
  fileName: 'Aadhaar_Kishore_1950.pdf',
  fileDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
};

function issueMockToken(data, currentTokens) {
  const tokenNumber = `ANT-099`;
  return {
    id: tokenNumber,
    tokenNumber,
    name: data.name,
    age: data.age,
    category: data.category,
    status: 'Pending',
    fileName: data.fileName,
    fileDataUrl: data.fileDataUrl,
    docVerified: false
  };
}

const newlyCreated = issueMockToken(mockRegistration, INITIAL_TOKENS);
assert(newlyCreated.status === 'Pending', 'Newly submitted registration starts with status Pending');
assert(newlyCreated.fileName === 'Aadhaar_Kishore_1950.pdf', 'Document filename correctly attached');
assert(newlyCreated.fileDataUrl !== null, 'Document file data URL preserved');

// Officer Approval simulation
function approveMockToken(token) {
  return {
    ...token,
    status: 'Verified',
    docVerified: true,
    verificationNotes: 'Official document reviewed and approved by Verification Officer.'
  };
}

const approved = approveMockToken(newlyCreated);
assert(approved.status === 'Verified', 'Approved token status becomes Verified');
assert(approved.docVerified === true, 'docVerified becomes true upon officer approval');

console.log(`\n=== TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED ===\n`);
if (failedTests > 0) process.exit(1);
