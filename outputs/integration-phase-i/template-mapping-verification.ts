import {
  buildFounderConfirmation,
  buildInternalDWSNotification,
  SubmissionNotificationContext,
} from '../../netlify/functions/lib/notifications';

console.log('================================================================');
console.log('NOTIFICATION TEMPLATE FIELD MAPPING REGRESSION TEST');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`[✓ PASS] ${description}`);
    passed++;
  } else {
    console.error(`[✗ FAIL] ${description}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

// Test Case 1: Unspecified / Confidential Venture fallback
const ctxConfidential: SubmissionNotificationContext = {
  kind: 'builder',
  receiptId: 'test-receipt-001',
  createdAt: new Date().toISOString(),
  founderName: 'Ernest Yearby',
  founderEmail: 'founder@example.com',
  companyName: 'Confidential Venture',
  detail: {
    businessType: 'Consumer Brand',
    businessStage: 'Idea',
  },
};

const confFounder = buildFounderConfirmation(ctxConfidential);
assert(
  'Founder confirmation with "Confidential Venture" falls back to natural phrasing "for your venture"',
  confFounder.text.includes('submission for your venture') && !confFounder.text.includes('submission for Confidential Venture'),
  confFounder.text.slice(0, 150)
);
assert(
  'Founder confirmation greets founder by name "Dear Ernest Yearby,"',
  confFounder.text.includes('Dear Ernest Yearby,'),
  confFounder.text.slice(0, 60)
);

const confInternal = buildInternalDWSNotification(ctxConfidential);
assert(
  'Internal notification marks confidential company as "Confidential / Unspecified Venture"',
  confInternal.subject.includes('Confidential / Unspecified Venture') && confInternal.text.includes('Company / Venture: Confidential / Unspecified Venture'),
  confInternal.subject
);

// Test Case 2: Explicit named company
const ctxNamed: SubmissionNotificationContext = {
  kind: 'builder',
  receiptId: 'test-receipt-002',
  createdAt: new Date().toISOString(),
  founderName: 'Jane Doe',
  founderEmail: 'jane@acmerobotics.com',
  companyName: 'Acme Robotics',
  detail: {
    businessType: 'Technology',
    businessStage: 'Operating',
  },
};

const namedFounder = buildFounderConfirmation(ctxNamed);
assert(
  'Founder confirmation with named company renders "submission for Acme Robotics"',
  namedFounder.text.includes('submission for Acme Robotics'),
  namedFounder.text.slice(0, 150)
);
assert(
  'Founder confirmation greets founder by name "Dear Jane Doe,"',
  namedFounder.text.includes('Dear Jane Doe,'),
  namedFounder.text.slice(0, 60)
);

const namedInternal = buildInternalDWSNotification(ctxNamed);
assert(
  'Internal notification subject and body include named company "Acme Robotics"',
  namedInternal.subject.includes('Acme Robotics') && namedInternal.text.includes('Company / Venture: Acme Robotics'),
  namedInternal.subject
);

// Test Case 3: Empty name and empty company
const ctxEmpty: SubmissionNotificationContext = {
  kind: 'blueprint',
  receiptId: 'test-receipt-003',
  createdAt: new Date().toISOString(),
  founderName: '',
  founderEmail: 'empty@example.com',
  companyName: '',
  detail: {},
};

const emptyFounder = buildFounderConfirmation(ctxEmpty);
assert(
  'Founder confirmation with empty name defaults to "Dear Founder,"',
  emptyFounder.text.includes('Dear Founder,'),
  emptyFounder.text.slice(0, 60)
);
assert(
  'Founder confirmation with empty company renders "submission for your venture"',
  emptyFounder.text.includes('submission for your venture'),
  emptyFounder.text.slice(0, 150)
);

console.log(`\nRegression test complete: ${passed}/${passed + failed} passed (${failed} failed).`);
if (failed > 0) process.exit(1);
