// Clean Initial Tokens Dataset (0 legacy history - clean slate for fresh registrations)
export const INITIAL_TOKENS = [];

export const SPECIAL_ADMIN_CODES = [
  {
    role: 'Super Administrator',
    badge: 'State Pushkara Command',
    code: 'AP-ADMIN-2026',
    passcode: 'PUSHKARA@2026',
    desc: 'Full access to Document Approvals, Gate Scanner, and 45 Ghat Locations'
  },
  {
    role: 'Document Verification Officer',
    badge: 'Verification Desk',
    code: 'VERIFY-OFFICER-01',
    passcode: 'VERIFY@2026',
    desc: 'Review submitted documents, approve priority passes, or decline ineligible applications'
  },
  {
    role: 'Ghat Gate Security Officer',
    badge: 'Priority Entry Gate',
    code: 'GATE-OFFICER-01',
    passcode: 'GATE@2026',
    desc: 'Simulate gate barcode/QR scanner and grant entry to verified pilgrims'
  }
];
